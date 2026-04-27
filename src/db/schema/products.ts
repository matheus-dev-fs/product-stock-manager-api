import { integer, numeric, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { categories } from "./categories";

export const unityTypeEnum = pgEnum('unity_type', ['kg', 'g', 'l', 'ml', 'un']);

export const products = pgTable('products', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull(),
    categoryId: uuid('category_id').notNull().references(() => categories.id),
    unitPrice: integer('unit_price').notNull(),
    unityType: unityTypeEnum('unity_type').notNull().default('un'),
    quantity: numeric('quantity').notNull().default('0'),
    minimumQuantity: numeric('minimum_quantity').notNull().default('0'),
    maximumQuantity: numeric('maximum_quantity').notNull().default('0'),
    deletedAt: timestamp('deleted_at'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;