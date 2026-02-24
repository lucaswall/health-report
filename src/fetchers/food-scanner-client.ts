export class FoodScannerClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    // Strip trailing slash from base URL
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.apiKey = apiKey;
  }

  async get<T>(path: string): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(
        `Food Scanner API error: ${response.status} ${response.statusText} for ${path}`
      );
    }

    return (await response.json()) as T;
  }
}
