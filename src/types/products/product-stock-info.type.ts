import { Product } from "../../db/schema";

export type ProductStockInfo = Pick<Product, 'quantity' | 'minimumQuantity' | 'maximumQuantity' | 'unitPrice'>;