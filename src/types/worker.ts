import type { Ai } from '@cloudflare/workers-types/experimental';

export interface Env {
  AI: Ai;
  DB: D1Database;
  CLOUDFLARE_ACCOUNT_ID: string;
  WORKER_API_KEY: string;
  AI_GATEWAY_TOKEN: string;
  CF_BROWSER_RENDER_TOKEN: string;
}
