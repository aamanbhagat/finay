import type { ComponentType } from "react";
import { SipCalculator } from "@/components/tools/sip-calculator";
import { EmiCalculator } from "@/components/tools/emi-calculator";
import { FdRdCalculator } from "@/components/tools/fd-rd-calculator";
import { CompoundInterestCalculator } from "@/components/tools/compound-interest-calculator";
import { IncomeTaxCalculator } from "@/components/tools/income-tax-calculator";
import { RetirementCalculator } from "@/components/tools/retirement-calculator";
import { CagrCalculator } from "@/components/tools/cagr-calculator";
import { LumpsumVsSipCalculator } from "@/components/tools/lumpsum-vs-sip-calculator";

export const CALCULATOR_COMPONENTS: Record<string, ComponentType> = {
  sip: SipCalculator,
  emi: EmiCalculator,
  "fd-rd": FdRdCalculator,
  "compound-interest": CompoundInterestCalculator,
  "income-tax": IncomeTaxCalculator,
  retirement: RetirementCalculator,
  cagr: CagrCalculator,
  "lumpsum-vs-sip": LumpsumVsSipCalculator,
};
