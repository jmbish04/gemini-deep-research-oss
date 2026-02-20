import { GoogleGenAI } from '@google/genai';
import { drizzle } from 'drizzle-orm/d1';
import type { Env } from '../src/types/worker';
import * as schema from '../src/db/schema';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const db = drizzle(env.DB, { schema });

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Check authentication
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    const token = authHeader.substring(7);
    if (token !== env.WORKER_API_KEY) {
      return new Response('Unauthorized', { status: 401, headers: corsHeaders });
    }

    try {
      // API routes
      if (url.pathname === '/api/ai/generate') {
        return await handleAIGenerate(request, env, corsHeaders);
      } else if (url.pathname === '/api/research/sessions') {
        if (request.method === 'GET') {
          return await handleListSessions(db, corsHeaders);
        } else if (request.method === 'POST') {
          return await handleCreateSession(request, db, corsHeaders);
        }
      } else if (url.pathname.startsWith('/api/research/sessions/')) {
        const sessionId = url.pathname.split('/').pop();
        if (request.method === 'GET') {
          return await handleGetSession(sessionId!, db, corsHeaders);
        } else if (request.method === 'PATCH') {
          return await handleUpdateSession(sessionId!, request, db, corsHeaders);
        }
      } else if (url.pathname === '/api/research/logs') {
        return await handleCreateLog(request, db, corsHeaders);
      } else if (url.pathname === '/api/research/tasks') {
        return await handleCreateTask(request, db, corsHeaders);
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });
    } catch (error) {
      console.error('Error:', error);
      return new Response('Internal Server Error', {
        status: 500,
        headers: corsHeaders,
      });
    }
  },
};

async function handleAIGenerate(
  request: Request,
  env: Env,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const body = await request.json();
  const { provider = 'google-ai-studio', model, contents, config } = body;

  // Get AI Gateway URL
  const baseUrl = await env.AI.gateway('research').getUrl(provider);

  // Initialize Google GenAI with AI Gateway
  const ai = new GoogleGenAI({
    apiKey: env.AI_GATEWAY_TOKEN,
    httpOptions: {
      baseUrl,
    },
  });

  // Generate content
  const response = await ai.models.generateContent({
    model,
    contents,
    config,
  });

  return new Response(JSON.stringify(response), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleListSessions(
  db: ReturnType<typeof drizzle>,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const sessions = await db.select().from(schema.researchSessions).orderBy(schema.researchSessions.createdAt).limit(50);

  return new Response(JSON.stringify(sessions), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleCreateSession(
  request: Request,
  db: ReturnType<typeof drizzle>,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const body = await request.json();
  const session = await db.insert(schema.researchSessions).values(body).returning();

  return new Response(JSON.stringify(session[0]), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleGetSession(
  sessionId: string,
  db: ReturnType<typeof drizzle>,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const session = await db.select().from(schema.researchSessions).where(eq(schema.researchSessions.id, sessionId)).limit(1);

  if (session.length === 0) {
    return new Response('Not Found', { status: 404, headers: corsHeaders });
  }

  // Also get tasks and logs
  const tasks = await db.select().from(schema.researchTasks).where(eq(schema.researchTasks.sessionId, sessionId));
  const logs = await db.select().from(schema.researchLogs).where(eq(schema.researchLogs.sessionId, sessionId));

  return new Response(JSON.stringify({ session: session[0], tasks, logs }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleUpdateSession(
  sessionId: string,
  request: Request,
  db: ReturnType<typeof drizzle>,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const body = await request.json();
  const session = await db.update(schema.researchSessions).set(body).where(eq(schema.researchSessions.id, sessionId)).returning();

  return new Response(JSON.stringify(session[0]), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleCreateLog(
  request: Request,
  db: ReturnType<typeof drizzle>,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const body = await request.json();
  const log = await db.insert(schema.researchLogs).values(body).returning();

  return new Response(JSON.stringify(log[0]), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

async function handleCreateTask(
  request: Request,
  db: ReturnType<typeof drizzle>,
  corsHeaders: Record<string, string>
): Promise<Response> {
  const body = await request.json();
  const task = await db.insert(schema.researchTasks).values(body).returning();

  return new Response(JSON.stringify(task[0]), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });
}

// Helper to import eq from drizzle-orm
import { eq } from 'drizzle-orm';
