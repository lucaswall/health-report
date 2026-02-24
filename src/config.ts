import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

// Load .env file using Node 24 native support
const envPath = resolve(process.cwd(), '.env');
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function optionalEnv(name: string, defaultValue: string): string {
  return process.env[name] || defaultValue;
}

export const config = {
  fitbit: {
    clientId: requireEnv('FITBIT_CLIENT_ID'),
    clientSecret: requireEnv('FITBIT_CLIENT_SECRET'),
    callbackUrl: 'http://localhost:9876/callback',
    scopes: [
      'activity',
      'heartrate',
      'sleep',
      'weight',
      'oxygen_saturation',
      'respiratory_rate',
      'temperature',
      'cardio_fitness',
      'profile',
    ],
    apiBase: 'https://api.fitbit.com',
    authUrl: 'https://www.fitbit.com/oauth2/authorize',
    tokenUrl: 'https://api.fitbit.com/oauth2/token',
  },
  foodScanner: {
    url: optionalEnv('FOOD_SCANNER_URL', 'http://localhost:3000'),
    apiKey: requireEnv('FOOD_SCANNER_API_KEY'),
  },
  report: {
    outputDir: optionalEnv('REPORT_OUTPUT_DIR', './output'),
    date: process.env.REPORT_DATE || undefined,
  },
} as const;
