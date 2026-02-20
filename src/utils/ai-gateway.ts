import { GoogleGenAI } from '@google/genai';
import type { Env } from '../types/worker';

export interface AIGatewayConfig {
  provider: 'google-ai-studio' | 'openai' | 'worker-ai';
  model: string;
}

export async function initializeAIWithGateway(
  env: Env,
  config: AIGatewayConfig = { provider: 'google-ai-studio', model: 'gemini-2.5-pro' }
): Promise<GoogleGenAI> {
  const apiKey = await env.AI_GATEWAY_TOKEN;
  const baseUrl = await env.AI.gateway('research').getUrl(config.provider);

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      baseUrl,
    },
  });
}

export async function getAIGatewayUrl(env: Env, provider: string): Promise<string> {
  return await env.AI.gateway('research').getUrl(provider);
}
