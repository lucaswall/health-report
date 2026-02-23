import { readFileSync, writeFileSync, mkdirSync, unlinkSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { homedir } from 'node:os';
import type { FitbitTokens } from '../types/fitbit.js';

const TOKEN_PATH = join(homedir(), '.config', 'health-report', 'tokens.json');

export function loadTokens(): FitbitTokens | null {
  if (!existsSync(TOKEN_PATH)) {
    return null;
  }

  try {
    const raw = readFileSync(TOKEN_PATH, 'utf-8');
    return JSON.parse(raw) as FitbitTokens;
  } catch {
    return null;
  }
}

export function saveTokens(tokens: FitbitTokens): void {
  const dir = dirname(TOKEN_PATH);
  mkdirSync(dir, { recursive: true });

  // Compute absolute expiry timestamp if not already set
  if (!tokens.expires_at) {
    tokens.expires_at = Date.now() + tokens.expires_in * 1000;
  }

  writeFileSync(TOKEN_PATH, JSON.stringify(tokens, null, 2), 'utf-8');
}

export function isExpired(tokens: FitbitTokens): boolean {
  // Consider expired 60 seconds early to avoid edge-case failures
  return Date.now() >= tokens.expires_at - 60_000;
}

export function deleteTokens(): void {
  if (existsSync(TOKEN_PATH)) {
    unlinkSync(TOKEN_PATH);
  }
}
