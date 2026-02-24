import { randomBytes, createHash } from 'node:crypto';
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { execSync } from 'node:child_process';
import { URL, URLSearchParams } from 'node:url';
import { config } from '../config.js';
import { loadTokens, saveTokens, isExpired } from './token-store.js';
import type { FitbitTokens } from '../types/fitbit.js';

// ---------- PKCE helpers ----------

function generateCodeVerifier(): string {
  return randomBytes(32).toString('base64url');
}

function generateCodeChallenge(verifier: string): string {
  return createHash('sha256').update(verifier).digest('base64url');
}

// ---------- Auth URL ----------

function buildAuthUrl(codeChallenge: string): string {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: config.fitbit.clientId,
    redirect_uri: config.fitbit.callbackUrl,
    scope: config.fitbit.scopes.join(' '),
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  });

  return `${config.fitbit.authUrl}?${params.toString()}`;
}

// ---------- Token exchange ----------

async function exchangeCodeForTokens(code: string, codeVerifier: string): Promise<FitbitTokens> {
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.fitbit.callbackUrl,
    client_id: config.fitbit.clientId,
    code_verifier: codeVerifier,
  });

  const credentials = Buffer.from(
    `${config.fitbit.clientId}:${config.fitbit.clientSecret}`,
  ).toString('base64');

  const response = await fetch(config.fitbit.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: body.toString(),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token exchange failed (${response.status}): ${text}`);
  }

  return (await response.json()) as FitbitTokens;
}

// ---------- Token refresh ----------

export async function refreshToken(): Promise<FitbitTokens> {
  const tokens = loadTokens();
  if (!tokens) {
    throw new Error('No stored tokens found. Run the auth flow first.');
  }

  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    refresh_token: tokens.refresh_token,
    client_id: config.fitbit.clientId,
  });

  const credentials = Buffer.from(
    `${config.fitbit.clientId}:${config.fitbit.clientSecret}`,
  ).toString('base64');

  const response = await fetch(config.fitbit.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${credentials}`,
    },
    body: body.toString(),
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Token refresh failed (${response.status}): ${text}`);
  }

  const refreshed = (await response.json()) as FitbitTokens;
  saveTokens(refreshed);
  return refreshed;
}

// ---------- Ensure valid token ----------

export async function ensureValidToken(): Promise<FitbitTokens> {
  const tokens = loadTokens();
  if (!tokens) {
    throw new Error('No stored tokens found. Run: npm run auth');
  }

  if (isExpired(tokens)) {
    console.log('Access token expired, refreshing...');
    return refreshToken();
  }

  return tokens;
}

// ---------- OAuth flow with local callback server ----------

export function startAuthFlow(): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = generateCodeChallenge(codeVerifier);
    const authUrl = buildAuthUrl(codeChallenge);

    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
      try {
        const requestUrl = new URL(req.url ?? '/', `http://localhost:9876`);

        if (requestUrl.pathname !== '/callback') {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not found');
          return;
        }

        const code = requestUrl.searchParams.get('code');
        const error = requestUrl.searchParams.get('error');

        if (error) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end(`Authorization failed: ${error}`);
          server.close(() => reject(new Error(`Authorization denied: ${error}`)));
          return;
        }

        if (!code) {
          res.writeHead(400, { 'Content-Type': 'text/plain' });
          res.end('Missing authorization code');
          server.close(() => reject(new Error('No authorization code received')));
          return;
        }

        const tokens = await exchangeCodeForTokens(code, codeVerifier);
        saveTokens(tokens);

        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(
          '<h1>Authorization successful!</h1><p>You can close this window and return to the terminal.</p>',
        );

        console.log('Tokens saved successfully.');
        server.close(() => resolve());
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Authorization failed. Check the terminal for details.');
        server.close(() => reject(err));
      }
    });

    server.listen(9876, () => {
      console.log('Listening on http://localhost:9876 for OAuth callback...');
      console.log('Opening browser for Fitbit authorization...\n');

      // Open browser on macOS
      try {
        execSync(`open "${authUrl}"`);
      } catch {
        console.log('Could not open browser automatically. Open this URL manually:');
        console.log(`\n${authUrl}\n`);
      }
    });

    server.on('error', (err) => {
      reject(new Error(`Failed to start callback server: ${err.message}`));
    });
  });
}

// ---------- Run directly ----------

const isMainModule =
  import.meta.url === `file://${process.argv[1]}` ||
  import.meta.url === new URL(process.argv[1], 'file://').href;

if (isMainModule) {
  startAuthFlow()
    .then(() => {
      console.log('Fitbit auth flow complete.');
      process.exit(0);
    })
    .catch((err: unknown) => {
      console.error('Auth flow failed:', err instanceof Error ? err.message : err);
      process.exit(1);
    });
}
