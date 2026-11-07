export type CalculationMode = 'actual_balance' | 'required_load';

export interface CalculationResult {
  id: string;
  mode: CalculationMode;
  inputAmount: number;
  loadAmount: number;
  actualBalance: number;
  taxDeducted: number;
  taxPercentage: number;
  effectiveRateOnBalance: number;
  timestamp: number;
}

export interface AppSettings {
  taxRate: number; // e.g. 15.0
  roundToWholeRupee: boolean;
  selectedOperator: string;
}

export interface OperatorGuide {
  id: string;
  name: string;
  brandColor: string;
  balanceCode: string;
  advanceLoanCode: string;
  taxCertApp: string;
  notes: string;
}
