import { CalculationMode, CalculationResult, OperatorGuide } from '../types';

export const DEFAULT_TAX_RATE = 15.0; // 15% standard Advance Income Tax in Pakistan

export function calculateMobileLoad(
  amount: number,
  mode: CalculationMode,
  taxRate: number = DEFAULT_TAX_RATE,
  roundToWhole: boolean = false
): CalculationResult {
  const safeAmount = Math.max(0, isNaN(amount) ? 0 : amount);
  const rateFactor = 1 + taxRate / 100;

  let loadAmount = 0;
  let actualBalance = 0;
  let taxDeducted = 0;

  if (mode === 'actual_balance') {
    // Mode B: User enters load amount they wish to purchase
    loadAmount = safeAmount;
    if (loadAmount > 0) {
      const rawBalance = loadAmount / rateFactor;
      actualBalance = roundToWhole
        ? Math.round(rawBalance)
        : Math.round(rawBalance * 100) / 100;
      taxDeducted = Math.round((loadAmount - actualBalance) * 100) / 100;
    }
  } else {
    // Mode A: User enters desired balance they want to receive
    actualBalance = safeAmount;
    if (actualBalance > 0) {
      const rawLoad = actualBalance * rateFactor;
      loadAmount = roundToWhole
        ? Math.round(rawLoad)
        : Math.round(rawLoad * 100) / 100;
      taxDeducted = Math.round((loadAmount - actualBalance) * 100) / 100;
    }
  }

  // Prevent negative floating point rounding artifacts
  taxDeducted = Math.max(0, taxDeducted);

  const effectiveRateOnBalance =
    actualBalance > 0 ? (taxDeducted / actualBalance) * 100 : taxRate;

  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    mode,
    inputAmount: safeAmount,
    loadAmount,
    actualBalance,
    taxDeducted,
    taxPercentage: taxRate,
    effectiveRateOnBalance,
    timestamp: Date.now(),
  };
}

export function formatPKR(
  amount: number,
  includePrefix: boolean = true,
  decimals: number = 2
): string {
  const formattedNumber = new Intl.NumberFormat('en-PK', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);

  return includePrefix ? `Rs. ${formattedNumber}` : formattedNumber;
}

export const PAKISTANI_OPERATORS: OperatorGuide[] = [
  {
    id: 'jazz',
    name: 'Jazz (Mobilink)',
    brandColor: '#D9232D',
    balanceCode: '*111#',
    advanceLoanCode: '*112#',
    taxCertApp: 'Jazz World App',
    notes: '15% Advance Income Tax deducted at recharge. Dial *111# to check remaining balance.',
  },
  {
    id: 'telenor',
    name: 'Telenor Pakistan',
    brandColor: '#0085CA',
    balanceCode: '*444#',
    advanceLoanCode: '*0#',
    taxCertApp: 'My Telenor App',
    notes: '15% Advance Income Tax deducted at recharge. Dial *444# to check remaining balance.',
  },
  {
    id: 'zong',
    name: 'Zong 4G (CMPak)',
    brandColor: '#84B819',
    balanceCode: '*222#',
    advanceLoanCode: '*911#',
    taxCertApp: 'My Zong App',
    notes: '15% Advance Income Tax deducted at recharge. Dial *222# to check remaining balance.',
  },
  {
    id: 'ufone',
    name: 'Ufone 4G (PTCL)',
    brandColor: '#F37021',
    balanceCode: '*124#',
    advanceLoanCode: '*456#',
    taxCertApp: 'My Ufone App',
    notes: '15% Advance Income Tax deducted at recharge. Dial *124# to check remaining balance.',
  },
  {
    id: 'scom',
    name: 'SCOM (SCO)',
    brandColor: '#005A36',
    balanceCode: '*125#',
    advanceLoanCode: '*135#',
    taxCertApp: 'SCO Customer Care',
    notes: 'Operates in AJK and Gilgit-Baltistan. 15% standard advance tax applicable on recharges.',
  },
];

export const POPULAR_RECHARGE_PRESETS = [50, 100, 200, 300, 500, 1000, 2000];

export function generateShareText(result: CalculationResult): string {
  if (result.mode === 'actual_balance') {
    return `🇵🇰 *Pakistan Mobile Load Tax Calculation*\n\n` +
      `💳 *Recharge Load:* ${formatPKR(result.loadAmount)}\n` +
      `✅ *Net Balance Received:* ${formatPKR(result.actualBalance)}\n` +
      `📉 *Tax Deducted (${result.taxPercentage}%):* ${formatPKR(result.taxDeducted)}\n\n` +
      `_Calculated with Load Calculator Pakistan_`;
  } else {
    return `🇵🇰 *Pakistan Mobile Load Tax Calculation*\n\n` +
      `🎯 *Desired Balance:* ${formatPKR(result.actualBalance)}\n` +
      `💳 *Required Load to Buy:* ${formatPKR(result.loadAmount)}\n` +
      `📉 *Tax Deducted (${result.taxPercentage}%):* ${formatPKR(result.taxDeducted)}\n\n` +
      `_Calculated with Load Calculator Pakistan_`;
  }
}
