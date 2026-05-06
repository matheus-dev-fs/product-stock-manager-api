export type StockMovementWithDetails = {
    id: string;
    productId: string;
    productName: string | null;
    userId: string;
    type: 'in' | 'out';
    quantity: string;
    unitPrice: number;
    createdAt: Date;
};