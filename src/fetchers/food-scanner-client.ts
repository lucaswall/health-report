import type { DiskCache } from './cache.js';

export class FoodScannerClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly cache: DiskCache | null;

  constructor(baseUrl: string, apiKey: string, cache?: DiskCache) {
    // Strip trailing slash from base URL
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.apiKey = apiKey;
    this.cache = cache ?? null;
  }

  async get<T>(path: string): Promise<T> {
    if (this.cache) {
      const cached = this.cache.get<T>(path);
      if (cached !== null) return cached;
    }

    const url = `${this.baseUrl}${path}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: 'application/json',
      },
      signal: AbortSignal.timeout(15_000),
    });

    if (!response.ok) {
      throw new Error(
        `Food Scanner API error: ${response.status} ${response.statusText} for ${path}`
      );
    }

    const result = (await response.json()) as T;

    if (this.cache) {
      this.cache.set(path, result);
    }

    return result;
  }
}
