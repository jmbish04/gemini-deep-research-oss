import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const researchSessions = sqliteTable('research_sessions', {
  id: text('id').primaryKey(),
  originalPrompt: text('original_prompt').notNull(),
  clarificationQuestions: text('clarification_questions'),
  clarificationAnswers: text('clarification_answers'),
  plan: text('plan'),
  dataCollection: text('data_collection'),
  verboseLog: text('verbose_log'),
  finalReport: text('final_report'),
  status: text('status').notNull().default('in_progress'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const researchTasks = sqliteTable('research_tasks', {
  id: text('id').primaryKey(),
  sessionId: text('session_id')
    .notNull()
    .references(() => researchSessions.id, { onDelete: 'cascade' }),
  tier: integer('tier').notNull(),
  title: text('title').notNull(),
  direction: text('direction').notNull(),
  target: text('target').notNull(),
  learning: text('learning'),
  groundingChunks: text('grounding_chunks'),
  webSearchQueries: text('web_search_queries'),
  urlsMetadata: text('urls_metadata'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const researchLogs = sqliteTable('research_logs', {
  id: text('id').primaryKey(),
  sessionId: text('session_id')
    .notNull()
    .references(() => researchSessions.id, { onDelete: 'cascade' }),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull(),
  type: text('type').notNull(),
  level: text('level').notNull(),
  message: text('message').notNull(),
  agent: text('agent'),
  phase: text('phase'),
  metadata: text('metadata'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .default(sql`(unixepoch())`),
});

export type ResearchSession = typeof researchSessions.$inferSelect;
export type NewResearchSession = typeof researchSessions.$inferInsert;
export type ResearchTask = typeof researchTasks.$inferSelect;
export type NewResearchTask = typeof researchTasks.$inferInsert;
export type ResearchLog = typeof researchLogs.$inferSelect;
export type NewResearchLog = typeof researchLogs.$inferInsert;
