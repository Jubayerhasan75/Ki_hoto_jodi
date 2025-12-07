export enum CalculatorType {
  MONEY = 'MONEY',
  TIME = 'TIME',
  CUSTOM = 'CUSTOM'
}

export interface MoneyCalcData {
  itemCost: number;
  currentDailyUsage: number;
  goalDailyUsage: number;
}

export interface TimeCalcData {
  currentDailyHours: number;
  goalDailyHours: number;
}

export interface InsightResult {
  text: string;
  loading: boolean;
}