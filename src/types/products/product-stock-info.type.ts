import { Product } from "../../db/schema/index.js";

export type ProductStockInfo = Pick<Product, 'quantity' |  'unitPrice'>;