import { integer, numeric, pgEnum, pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { products } from "./products";
import { users } from "./users";

export const stockMovementsEnum = pgEnum('stock_movements_enum', ['in', 'out']);

export const stockMovements = pgTable('stock_movements', {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id').notNull().references(() => products.id),
    userId: uuid('user_id').notNull().references(() => users.id),
    type: stockMovementsEnum('type').notNull(),
    quantity: numeric('quantity').notNull(),
    unitPrice: integer('unit_price').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow()
});

export type StockMovement = typeof stockMovements.$inferSelect;
export type NewStockMovement = typeof stockMovements.$inferInsert;