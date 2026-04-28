import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm"; // Importe o helper 'sql'
import { users } from "./users";

export const refreshTokens = pgTable('refresh_tokens', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => users.id),
    token: text('token').notNull().unique(),
    expiresAt: timestamp('expires_at').notNull().default(sql`now() + interval '7 days'`), 
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type RefreshToken = typeof refreshTokens.$inferSelect;
export type NewRefreshToken = typeof refreshTokens.$inferInsert;