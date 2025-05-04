import { integer, text, pgTable, timestamp } from "drizzle-orm/pg-core";

export const files = pgTable("files", {
  id: integer("id").primaryKey(),
  fileUrl: text("file_url").notNull(),
  fileName: text("file_name").notNull(),
  fileId: text("file_id").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
