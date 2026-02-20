import type { Content } from '@google/genai';
import type { NewResearchLog, NewResearchSession, NewResearchTask } from '../db/schema';

export class WorkerAPIClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string = '', apiKey: string = '') {
    this.baseUrl = baseUrl || window.location.origin;
    this.apiKey = apiKey;
  }

  setApiKey(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async fetch(url: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
      ...options.headers,
    };

    const response = await fetch(`${this.baseUrl}${url}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // AI Generation
  async generateContent(params: {
    provider?: string;
    model: string;
    contents: Content[];
    config?: any;
  }) {
    return this.fetch('/api/ai/generate', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // AI Generation with Streaming
  async generateContentStream(params: {
    provider?: string;
    model: string;
    contents: Content[];
    config?: any;
  }) {
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.apiKey}`,
    };

    const response = await fetch(`${this.baseUrl}/api/ai/generate`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ ...params, stream: true }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`API Error: ${response.status} - ${error}`);
    }

    return response;
  }

  // Research Sessions
  async createSession(session: NewResearchSession) {
    return this.fetch('/api/research/sessions', {
      method: 'POST',
      body: JSON.stringify(session),
    });
  }

  async listSessions() {
    return this.fetch('/api/research/sessions', {
      method: 'GET',
    });
  }

  async getSession(sessionId: string) {
    return this.fetch(`/api/research/sessions/${sessionId}`, {
      method: 'GET',
    });
  }

  async updateSession(sessionId: string, updates: Partial<NewResearchSession>) {
    return this.fetch(`/api/research/sessions/${sessionId}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  // Research Tasks
  async createTask(task: NewResearchTask) {
    return this.fetch('/api/research/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  // Research Logs
  async createLog(log: NewResearchLog) {
    return this.fetch('/api/research/logs', {
      method: 'POST',
      body: JSON.stringify(log),
    });
  }
}

// Singleton instance
let apiClient: WorkerAPIClient | null = null;

export function getAPIClient(): WorkerAPIClient {
  if (!apiClient) {
    apiClient = new WorkerAPIClient();
  }
  return apiClient;
}

export function initializeAPIClient(apiKey: string, baseUrl?: string) {
  apiClient = new WorkerAPIClient(baseUrl, apiKey);
  return apiClient;
}
