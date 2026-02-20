import type { Content } from '@google/genai';
import { getAPIClient } from './api-client';

export interface MockGoogleGenAI {
  models: {
    generateContent: (params: {
      model: string;
      contents: Content[];
      config?: any;
    }) => Promise<any>;
    generateContentStream: (params: {
      model: string;
      contents: Content[];
      config?: any;
    }) => Promise<any>;
    list: () => Promise<any>;
  };
  files: {
    upload: (params: { file: Blob; config?: any }) => Promise<any>;
    delete: (params: { name: string }) => Promise<void>;
  };
}

export function createMockGoogleGenAI(): MockGoogleGenAI {
  const apiClient = getAPIClient();

  return {
    models: {
      generateContent: async (params: { model: string; contents: Content[]; config?: any }) => {
        return await apiClient.generateContent({
          model: params.model,
          contents: params.contents,
          config: params.config,
        });
      },
      generateContentStream: async (params: {
        model: string;
        contents: Content[];
        config?: any;
      }) => {
        const response = await apiClient.generateContentStream({
          model: params.model,
          contents: params.contents,
          config: params.config,
        });

        // Create an async iterator from the stream
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        return {
          stream: {
            async *[Symbol.asyncIterator]() {
              if (!reader) return;

              try {
                while (true) {
                  const { done, value } = await reader.read();
                  if (done) break;

                  const text = decoder.decode(value, { stream: true });
                  yield {
                    text: () => text,
                    candidates: [{ content: { parts: [{ text }] } }],
                  };
                }
              } finally {
                reader.releaseLock();
              }
            },
          },
        };
      },
      list: async () => {
        // Return a static list of available models
        return {
          page: [
            { name: 'models/gemini-2.5-flash' },
            { name: 'models/gemini-2.5-pro' },
            { name: 'models/gemini-2.0-flash' },
            { name: 'models/gemini-1.5-pro' },
            { name: 'models/gemini-1.5-flash' },
          ],
        };
      },
    },
    files: {
      upload: async (params: { file: Blob; config?: any }) => {
        // For now, file upload goes through a different mechanism
        // We'll need to implement this in the worker API later
        console.warn('File upload not yet implemented with worker API');
        return {
          name: `files/${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          displayName: params.config?.displayName || 'Uploaded File',
          mimeType: params.config?.mimeType || 'application/octet-stream',
        };
      },
      delete: async (params: { name: string }) => {
        // File deletion through worker API
        console.warn('File deletion not yet implemented with worker API');
      },
    },
  };
}
