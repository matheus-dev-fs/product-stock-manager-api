import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
}

// Create postgres connection
const connectionString = process.env.NODE_ENV === 'test' && process.env.DATABASE_TEST_URL
    ? process.env.DATABASE_TEST_URL
    : process.env.DATABASE_URL;
const queryClient = postgres(connectionString);

// Create drizzle instance
export const db = drizzle(queryClient);
