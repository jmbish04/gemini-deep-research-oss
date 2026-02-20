CREATE TABLE `research_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`timestamp` integer NOT NULL,
	`type` text NOT NULL,
	`level` text NOT NULL,
	`message` text NOT NULL,
	`agent` text,
	`phase` text,
	`metadata` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `research_sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `research_sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`original_prompt` text NOT NULL,
	`clarification_questions` text,
	`clarification_answers` text,
	`plan` text,
	`data_collection` text,
	`verbose_log` text,
	`final_report` text,
	`status` text DEFAULT 'in_progress' NOT NULL,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `research_tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`session_id` text NOT NULL,
	`tier` integer NOT NULL,
	`title` text NOT NULL,
	`direction` text NOT NULL,
	`target` text NOT NULL,
	`learning` text,
	`grounding_chunks` text,
	`web_search_queries` text,
	`urls_metadata` text,
	`created_at` integer DEFAULT (unixepoch()) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch()) NOT NULL,
	FOREIGN KEY (`session_id`) REFERENCES `research_sessions`(`id`) ON UPDATE no action ON DELETE cascade
);
