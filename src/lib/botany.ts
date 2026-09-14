import { Inhabitant, EventLog } from '../types';

/**
 * Calculates the Vigor Index for a garden inhabitant.
 * Weighted average of:
 * - Growth Rate (40%)
 * - Pest Pressure (30%) - Inverted
 * - Manual Health Rating (30%)
 */
export function calculateVigorIndex(
  inhabitant: Inhabitant,
  recentLogs: EventLog[]
): number {
  // 1. Growth Rate Score (0-100)
  // Assuming progress is 0-100 and daysActive is > 0
  const growthRateScore = inhabitant.daysActive > 0 
    ? Math.min(100, (inhabitant.progress / inhabitant.daysActive) * 10) 
    : 100;

  // 2. Pest Pressure Score (0-100, Inverted)
  // Average pest pressure from recent logs (0-10 scale)
  const pestLogs = recentLogs.filter(log => log.pest_pressure !== undefined);
  const avgPestPressure = pestLogs.length > 0
    ? pestLogs.reduce((acc, log) => acc + (log.pest_pressure || 0), 0) / pestLogs.length
    : 0;
  const pestScore = Math.max(0, 100 - (avgPestPressure * 10));

  // 3. Manual Health Rating Score (0-100)
  // Mapping status to a score
  const statusScores: Record<string, number> = {
    'Excellent': 100,
    'Healthy': 80,
    'Vegetative': 70,
    'Flowering': 75,
    'Pending': 50,
    'Dormant': 40,
    'Struggling': 20
  };
  const manualScore = statusScores[inhabitant.status] || 50;

  // Weighted Average
  const vigorIndex = (growthRateScore * 0.4) + (pestScore * 0.3) + (manualScore * 0.3);
  
  return Math.round(vigorIndex);
}

/**
 * Financial Service for Google Sheets Integration
 * Placeholder for future API implementation
 */
export const FinancialService = {
  async ingestFromGoogleSheets(sheetId: string): Promise<any[]> {
    console.log(`Ingesting data from sheet: ${sheetId}`);
    // In a real scenario, this would call a backend or use the Google Sheets API
    return [];
  },

  calculateCostPerYield(expenses: any[], yieldData: any[]): number {
    const totalCost = expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const totalYield = yieldData.reduce((acc, y) => acc + y.quantity, 0);
    return totalYield > 0 ? totalCost / totalYield : 0;
  }
};
