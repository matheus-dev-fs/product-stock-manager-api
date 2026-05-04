import { formatStockMovementsSummary } from './stock-movements.helper';
import type { StockMovementSummary } from '../types/stock-movements/stock-movement-summary.type';

describe('stock-movements.helper', () => {
  it('formats summary with defaults', () => {
    const data: StockMovementSummary[] = [
      { type: 'IN', totalValue: 120, count: 2 },
    ];

    const result = formatStockMovementsSummary(data);

    expect(result).toEqual({
      IN: { value: 120, count: 2 },
      OUT: { value: 0, count: 0 },
    });
  });
});
