export type StockMovementWithDetails = {
    id: string;
    productId: string;
    productName: string | null;
    userId: string;
    type: 'IN' | 'OUT';
    quantity: string;
    unitPrice: number;
    createdAt: Date;
};