import type { FitbitTokens } from '../types/fitbit.js';

const FITBIT_API_BASE = 'https://api.fitbit.com';
const RATE_LIMIT_THRESHOLD = 10;
const RATE_LIMIT_PAUSE_MS = 60_000;
const MAX_RETRIES = 1;

export type TokenRefreshCallback = (tokens: FitbitTokens) => Promise<FitbitTokens>;

export class FitbitClient {
  private accessToken: string;
  private onTokenRefresh: TokenRefreshCallback | null;

  constructor(accessToken: string, onTokenRefresh?: TokenRefreshCallback) {
    this.accessToken = accessToken;
    this.onTokenRefresh = onTokenRefresh ?? null;
  }

  async get<T>(path: string): Promise<T> {
    return this.request<T>(path, 0);
  }

  async getTimeSeries(resource: string, start: string, end: string): Promise<unknown> {
    const path = `/1/user/-/${resource}/date/${start}/${end}.json`;
    return this.get<unknown>(path);
  }

  private async request<T>(path: string, attempt: number): Promise<T> {
    const url = `${FITBIT_API_BASE}${path}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        Accept: 'application/json',
      },
    });

    // Check rate limit header and pause proactively if running low
    const remaining = response.headers.get('Fitbit-Rate-Limit-Remaining');
    if (remaining !== null) {
      const remainingCount = parseInt(remaining, 10);
      if (!isNaN(remainingCount) && remainingCount < RATE_LIMIT_THRESHOLD) {
        const resetSeconds = response.headers.get('Fitbit-Rate-Limit-Reset');
        const pauseMs = resetSeconds
          ? parseInt(resetSeconds, 10) * 1000
          : RATE_LIMIT_PAUSE_MS;
        console.warn(
          `Fitbit rate limit low (${remainingCount} remaining). Pausing for ${Math.ceil(pauseMs / 1000)}s...`
        );
        await sleep(pauseMs);
      }
    }

    // Handle 401 — attempt token refresh once
    if (response.status === 401 && this.onTokenRefresh && attempt === 0) {
      console.warn('Fitbit token expired, attempting refresh...');
      const refreshed = await this.onTokenRefresh({} as FitbitTokens);
      this.accessToken = refreshed.access_token;
      return this.request<T>(path, attempt + 1);
    }

    // Retry on 429 or 5xx (once)
    if ((response.status === 429 || response.status >= 500) && attempt < MAX_RETRIES) {
      const retryAfter = response.headers.get('Retry-After');
      const waitMs = retryAfter ? parseInt(retryAfter, 10) * 1000 : RATE_LIMIT_PAUSE_MS;
      console.warn(
        `Fitbit API returned ${response.status}. Retrying in ${Math.ceil(waitMs / 1000)}s...`
      );
      await sleep(waitMs);
      return this.request<T>(path, attempt + 1);
    }

    if (!response.ok) {
      const body = await response.text().catch(() => '');
      throw new Error(
        `Fitbit API error: ${response.status} ${response.statusText} for ${path}\n${body}`
      );
    }

    return (await response.json()) as T;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
