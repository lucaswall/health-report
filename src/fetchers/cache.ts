import { readFileSync, writeFileSync, mkdirSync, readdirSync, unlinkSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { createHash } from 'node:crypto';

interface CacheEntry<T> {
  cachedAt: number;
  data: T;
}

const CACHE_BASE = join(homedir(), '.cache', 'health-report');

export class DiskCache {
  private readonly dir: string;
  private readonly ttlMs: number;
  private readonly volatilePattern: string | null;

  constructor(namespace: string, ttlMs: number = 3_600_000, volatilePattern?: string) {
    this.dir = join(CACHE_BASE, namespace);
    this.ttlMs = ttlMs;
    this.volatilePattern = volatilePattern ?? null;
    mkdirSync(this.dir, { recursive: true });
  }

  get<T>(path: string): T | null {
    const file = this.keyFile(path);
    if (!existsSync(file)) return null;

    try {
      const raw = readFileSync(file, 'utf-8');
      const entry = JSON.parse(raw) as CacheEntry<T>;

      // Apply TTL only to volatile entries (keys containing today's date);
      // all other entries persist forever
      const isVolatile = this.volatilePattern !== null && path.includes(this.volatilePattern);
      if (isVolatile && Date.now() - entry.cachedAt > this.ttlMs) {
        try { unlinkSync(file); } catch { /* ignore */ }
        return null;
      }

      return entry.data;
    } catch {
      // Corrupt or unreadable cache entry — treat as miss
      return null;
    }
  }

  set<T>(path: string, data: T): void {
    const file = this.keyFile(path);
    const entry: CacheEntry<T> = { cachedAt: Date.now(), data };

    try {
      writeFileSync(file, JSON.stringify(entry), 'utf-8');
    } catch {
      // Silently fail — cache is optional
    }
  }

  clear(): void {
    if (!existsSync(this.dir)) return;

    try {
      for (const file of readdirSync(this.dir)) {
        unlinkSync(join(this.dir, file));
      }
    } catch {
      // Best-effort cleanup
    }
  }

  private keyFile(path: string): string {
    const hash = createHash('sha256').update(path).digest('hex');
    return join(this.dir, `${hash}.json`);
  }
}
