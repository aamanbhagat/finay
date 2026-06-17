/**
 * Pure financial math. Every function is deterministic, unit-testable,
 * and takes/returns plain numbers — no UI or formatting concerns.
 *
 * Conventions:
 *   - `years` is fractional (e.g. 2.5 = 2 years 6 months)
 *   - Annual rates are passed as percentages (8 = 8%)
 *   - All monetary amounts are in the same currency (INR by default)
 */

const MONTHS_PER_YEAR = 12;

/* ─── SIP ──────────────────────────────────────────────────────────── */

export interface SipInput {
  monthlyInvestment: number;
  annualRatePct: number;
  years: number;
}

export interface SipResult {
  futureValue: number;
  totalInvested: number;
  totalGains: number;
  /** Per-year corpus for charting. */
  series: { year: number; invested: number; value: number }[];
}

/** Future value of a recurring monthly SIP. FV = P * ((1+r)^n - 1)/r * (1+r). */
export function calculateSip({ monthlyInvestment, annualRatePct, years }: SipInput): SipResult {
  const months = Math.round(years * MONTHS_PER_YEAR);
  const r = annualRatePct / 100 / MONTHS_PER_YEAR;
  const series: SipResult["series"] = [];
  let invested = 0;
  let value = 0;
  for (let m = 1; m <= months; m++) {
    value = (value + monthlyInvestment) * (1 + r);
    invested += monthlyInvestment;
    if (m % MONTHS_PER_YEAR === 0 || m === months) {
      series.push({ year: m / MONTHS_PER_YEAR, invested, value });
    }
  }
  return {
    futureValue: value,
    totalInvested: invested,
    totalGains: value - invested,
    series,
  };
}

/* ─── EMI ──────────────────────────────────────────────────────────── */

export interface EmiInput {
  principal: number;
  annualRatePct: number;
  years: number;
}

export interface EmiResult {
  emi: number;
  totalInterest: number;
  totalPayment: number;
  /** Per-year principal vs interest paid (for the stacked area chart). */
  series: { year: number; principalPaid: number; interestPaid: number; balance: number }[];
}

/** EMI for a fixed-rate amortising loan. */
export function calculateEmi({ principal, annualRatePct, years }: EmiInput): EmiResult {
  const months = Math.round(years * MONTHS_PER_YEAR);
  const r = annualRatePct / 100 / MONTHS_PER_YEAR;
  const emi =
    r === 0 ? principal / months : (principal * r * (1 + r) ** months) / ((1 + r) ** months - 1);

  let balance = principal;
  let principalPaid = 0;
  let interestPaid = 0;
  const series: EmiResult["series"] = [];
  for (let m = 1; m <= months; m++) {
    const interest = balance * r;
    const principalPortion = emi - interest;
    balance -= principalPortion;
    principalPaid += principalPortion;
    interestPaid += interest;
    if (m % MONTHS_PER_YEAR === 0 || m === months) {
      series.push({
        year: m / MONTHS_PER_YEAR,
        principalPaid,
        interestPaid,
        balance: Math.max(0, balance),
      });
    }
  }
  return { emi, totalInterest: interestPaid, totalPayment: emi * months, series };
}

/* ─── Fixed / Recurring deposit ────────────────────────────────────── */

type Frequency = 1 | 2 | 4 | 12;

export interface FdInput {
  principal: number;
  annualRatePct: number;
  years: number;
  compoundingPerYear: Frequency;
}

export function calculateFd({ principal, annualRatePct, years, compoundingPerYear }: FdInput) {
  const r = annualRatePct / 100;
  const maturity = principal * (1 + r / compoundingPerYear) ** (compoundingPerYear * years);
  return {
    maturity,
    interest: maturity - principal,
    principal,
  };
}

export interface RdInput {
  monthlyDeposit: number;
  annualRatePct: number;
  years: number;
}

/** Indian-bank RD maturity formula: each month's deposit compounds quarterly. */
export function calculateRd({ monthlyDeposit, annualRatePct, years }: RdInput) {
  const months = Math.round(years * MONTHS_PER_YEAR);
  // Equivalent monthly rate from quarterly compounding.
  const q = annualRatePct / 100 / 4;
  const monthlyRate = (1 + q) ** (1 / 3) - 1;
  let maturity = 0;
  for (let m = 0; m < months; m++) {
    const monthsLeft = months - m;
    maturity += monthlyDeposit * (1 + monthlyRate) ** monthsLeft;
  }
  const invested = monthlyDeposit * months;
  return { maturity, invested, interest: maturity - invested };
}

/* ─── Compound interest ────────────────────────────────────────────── */

export interface CompoundInput {
  principal: number;
  annualRatePct: number;
  years: number;
  compoundingPerYear: Frequency;
}

export function calculateCompoundInterest({
  principal,
  annualRatePct,
  years,
  compoundingPerYear,
}: CompoundInput) {
  const r = annualRatePct / 100;
  const series: { year: number; value: number }[] = [];
  for (let y = 1; y <= Math.ceil(years); y++) {
    const t = Math.min(y, years);
    series.push({ year: t, value: principal * (1 + r / compoundingPerYear) ** (compoundingPerYear * t) });
  }
  const finalValue = principal * (1 + r / compoundingPerYear) ** (compoundingPerYear * years);
  return {
    finalValue,
    interest: finalValue - principal,
    principal,
    series,
  };
}

/* ─── Indian Income Tax (FY 2025-26, illustrative) ─────────────────── */

interface Slab {
  upTo: number;
  ratePct: number;
}

const STD_DEDUCTION_NEW = 75000;
const STD_DEDUCTION_OLD = 50000;
const REBATE_LIMIT_NEW = 1_200_000;
const REBATE_LIMIT_OLD = 500_000;
const CESS_RATE = 0.04;

/** New regime FY 2025-26 slabs. */
const NEW_REGIME_SLABS: Slab[] = [
  { upTo: 400_000, ratePct: 0 },
  { upTo: 800_000, ratePct: 5 },
  { upTo: 1_200_000, ratePct: 10 },
  { upTo: 1_600_000, ratePct: 15 },
  { upTo: 2_000_000, ratePct: 20 },
  { upTo: 2_400_000, ratePct: 25 },
  { upTo: Infinity, ratePct: 30 },
];

/** Old regime slabs (age < 60). */
const OLD_REGIME_SLABS: Slab[] = [
  { upTo: 250_000, ratePct: 0 },
  { upTo: 500_000, ratePct: 5 },
  { upTo: 1_000_000, ratePct: 20 },
  { upTo: Infinity, ratePct: 30 },
];

function applySlabs(taxable: number, slabs: Slab[]): number {
  let tax = 0;
  let lower = 0;
  for (const slab of slabs) {
    if (taxable <= lower) break;
    const upper = Math.min(taxable, slab.upTo);
    tax += ((upper - lower) * slab.ratePct) / 100;
    lower = upper;
  }
  return tax;
}

export interface TaxInput {
  /** Annual gross income (CTC excluding employer contributions). */
  grossIncome: number;
  /** Deductions claimed under the old regime (80C + 80D + HRA + 24(b) etc). */
  oldDeductions: number;
}

export interface RegimeResult {
  taxableIncome: number;
  baseTax: number;
  rebate: number;
  cess: number;
  totalTax: number;
}

function computeRegime(
  taxable: number,
  slabs: Slab[],
  rebateLimit: number,
): RegimeResult {
  const baseTax = applySlabs(taxable, slabs);
  const rebate = taxable <= rebateLimit ? baseTax : 0;
  const afterRebate = baseTax - rebate;
  const cess = afterRebate * CESS_RATE;
  return {
    taxableIncome: taxable,
    baseTax,
    rebate,
    cess,
    totalTax: afterRebate + cess,
  };
}

export function calculateIncomeTax({ grossIncome, oldDeductions }: TaxInput) {
  const newTaxable = Math.max(0, grossIncome - STD_DEDUCTION_NEW);
  const oldTaxable = Math.max(0, grossIncome - STD_DEDUCTION_OLD - oldDeductions);
  const newRegime = computeRegime(newTaxable, NEW_REGIME_SLABS, REBATE_LIMIT_NEW);
  const oldRegime = computeRegime(oldTaxable, OLD_REGIME_SLABS, REBATE_LIMIT_OLD);
  const cheaper: "new" | "old" = newRegime.totalTax <= oldRegime.totalTax ? "new" : "old";
  return {
    newRegime,
    oldRegime,
    cheaper,
    savings: Math.abs(newRegime.totalTax - oldRegime.totalTax),
  };
}

/* ─── Retirement corpus ────────────────────────────────────────────── */

export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  /** Today's monthly expenses; inflated to retirement. */
  monthlyExpensesToday: number;
  inflationPct: number;
  postRetirementYears: number;
  /** Return on the corpus after retirement (post-tax, real-ish). */
  postRetirementRatePct: number;
  currentSavings: number;
  /** Expected return on savings until retirement. */
  preRetirementRatePct: number;
  monthlySipNow: number;
}

export function calculateRetirement(input: RetirementInput) {
  const yearsToRetire = Math.max(0, input.retirementAge - input.currentAge);

  // 1. Expenses at retirement (inflation-adjusted).
  const inflatedMonthlyExpenses =
    input.monthlyExpensesToday * (1 + input.inflationPct / 100) ** yearsToRetire;
  const inflatedAnnualExpenses = inflatedMonthlyExpenses * MONTHS_PER_YEAR;

  // 2. Required corpus — PV of an annuity at the post-retirement real return.
  const realRate =
    (1 + input.postRetirementRatePct / 100) / (1 + input.inflationPct / 100) - 1;
  const n = input.postRetirementYears;
  const requiredCorpus =
    realRate === 0
      ? inflatedAnnualExpenses * n
      : inflatedAnnualExpenses * (1 - (1 + realRate) ** -n) / realRate;

  // 3. Projected corpus with current savings + ongoing SIP.
  const lumpsumFuture =
    input.currentSavings * (1 + input.preRetirementRatePct / 100) ** yearsToRetire;
  const sip = calculateSip({
    monthlyInvestment: input.monthlySipNow,
    annualRatePct: input.preRetirementRatePct,
    years: yearsToRetire,
  });
  const projectedCorpus = lumpsumFuture + sip.futureValue;

  return {
    yearsToRetire,
    inflatedMonthlyExpenses,
    requiredCorpus,
    projectedCorpus,
    gap: requiredCorpus - projectedCorpus,
    onTrack: projectedCorpus >= requiredCorpus,
  };
}

/* ─── CAGR ─────────────────────────────────────────────────────────── */

export function calculateCagr({
  initialValue,
  finalValue,
  years,
}: {
  initialValue: number;
  finalValue: number;
  years: number;
}) {
  if (initialValue <= 0 || years <= 0) return { cagrPct: 0, totalReturnPct: 0 };
  const cagrPct = ((finalValue / initialValue) ** (1 / years) - 1) * 100;
  const totalReturnPct = (finalValue / initialValue - 1) * 100;
  return { cagrPct, totalReturnPct };
}

/* ─── Lumpsum vs SIP comparison ────────────────────────────────────── */

export function compareLumpsumVsSip({
  totalAmount,
  annualRatePct,
  years,
}: {
  totalAmount: number;
  annualRatePct: number;
  years: number;
}) {
  const lumpsumFv = totalAmount * (1 + annualRatePct / 100) ** years;
  const monthly = totalAmount / (years * MONTHS_PER_YEAR);
  const sip = calculateSip({ monthlyInvestment: monthly, annualRatePct, years });
  return {
    lumpsum: { invested: totalAmount, futureValue: lumpsumFv },
    sip: { invested: sip.totalInvested, futureValue: sip.futureValue, monthly },
    advantage: lumpsumFv - sip.futureValue,
  };
}
