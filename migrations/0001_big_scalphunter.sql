ALTER TABLE "todo" RENAME COLUMN "text" TO "file_url";--> statement-breakpoint
ALTER TABLE "todo" RENAME COLUMN "done" TO "file_name";--> statement-breakpoint
ALTER TABLE "todo" ADD COLUMN "file_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "todo" ADD COLUMN "user_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "todo" ADD COLUMN "created_at" timestamp;