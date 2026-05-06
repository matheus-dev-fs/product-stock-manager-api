ALTER TABLE "stock_movements" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."stock_movements_enum";--> statement-breakpoint
CREATE TYPE "public"."stock_movements_enum" AS ENUM('in', 'out');--> statement-breakpoint
ALTER TABLE "stock_movements" ALTER COLUMN "type" SET DATA TYPE "public"."stock_movements_enum" USING "type"::"public"."stock_movements_enum";