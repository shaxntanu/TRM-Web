import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function calculateExpectedValue(
  winProb: number,
  winAmount: number,
  lossAmount: number
): number {
  return winProb * winAmount - (1 - winProb) * lossAmount;
}

export function calculateRuinProbability(
  playerBankroll: number,
  casinoBankroll: number,
  houseEdge: number
): number {
  if (houseEdge === 0) {
    return casinoBankroll / (playerBankroll + casinoBankroll);
  }
  const q = (1 + houseEdge) / (1 - houseEdge);
  const n = playerBankroll;
  const m = casinoBankroll;
  return (Math.pow(q, n) - 1) / (Math.pow(q, n + m) - 1);
}

export function calculateMartingaleRequirement(
  baseBet: number,
  consecutiveLosses: number
): { requiredBankroll: number; totalRisk: number; potentialProfit: number } {
  const requiredBankroll = baseBet * (Math.pow(2, consecutiveLosses) - 1);
  const totalRisk = requiredBankroll;
  const potentialProfit = baseBet;
  return { requiredBankroll, totalRisk, potentialProfit };
}

export function exportToCSV(
  history: number[],
  filename: string = 'ruin-machine-data.csv'
): void {
  const headers = ['Game', 'Bankroll'];
  const rows = history.map((bankroll, index) => [index, bankroll]);
  
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
