"use client";

import { useMemo } from "react";
import { InputRow } from "@/components/tools/input-row";
import { ResultSummary } from "@/components/tools/result-summary";
import { useUrlNumberState } from "@/lib/use-url-state";
import { calculateRetirement } from "@/lib/finance";
import { formatINR, cn } from "@/lib/utils";

const DEFAULTS = {
  currentAge: 30,
  retirementAge: 60,
  monthlyExpenses: 50000,
  inflation: 6,
  postYears: 25,
  postRate: 7,
  currentSavings: 500000,
  preRate: 12,
  sip: 20000,
};

export function RetirementCalculator() {
  const [s, set] = useUrlNumberState(DEFAULTS);

  const result = useMemo(
    () =>
      calculateRetirement({
        currentAge: s.currentAge,
        retirementAge: s.retirementAge,
        monthlyExpensesToday: s.monthlyExpenses,
        inflationPct: s.inflation,
        postRetirementYears: s.postYears,
        postRetirementRatePct: s.postRate,
        currentSavings: s.currentSavings,
        preRetirementRatePct: s.preRate,
        monthlySipNow: s.sip,
      }),
    [s],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-7 rounded-xl border border-border bg-surface-2 p-6 sm:p-7">
        <InputRow
          label="Current age"
          value={s.currentAge}
          min={18}
          max={70}
          step={1}
          onChange={set.currentAge}
          suffix=" yrs"
        />
        <InputRow
          label="Retirement age"
          value={s.retirementAge}
          min={40}
          max={75}
          step={1}
          onChange={set.retirementAge}
          suffix=" yrs"
        />
        <InputRow
          label="Monthly expenses today"
          value={s.monthlyExpenses}
          min={10000}
          max={1000000}
          step={1000}
          onChange={set.monthlyExpenses}
          currency
        />
        <InputRow
          label="Expected inflation"
          value={s.inflation}
          min={2}
          max={12}
          step={0.25}
          onChange={set.inflation}
          suffix="%"
        />
        <InputRow
          label="Years in retirement"
          value={s.postYears}
          min={10}
          max={40}
          step={1}
          onChange={set.postYears}
          suffix=" yrs"
        />
        <InputRow
          label="Post-retirement return"
          value={s.postRate}
          min={1}
          max={15}
          step={0.25}
          onChange={set.postRate}
          suffix="%"
        />
        <InputRow
          label="Current savings"
          value={s.currentSavings}
          min={0}
          max={100000000}
          step={10000}
          onChange={set.currentSavings}
          currency
        />
        <InputRow
          label="Pre-retirement return"
          value={s.preRate}
          min={1}
          max={20}
          step={0.5}
          onChange={set.preRate}
          suffix="%"
        />
        <InputRow
          label="Monthly SIP now"
          value={s.sip}
          min={0}
          max={500000}
          step={1000}
          onChange={set.sip}
          currency
        />
      </div>

      <div className="space-y-6">
        <ResultSummary
          stats={[
            { label: "Required corpus", value: formatINR(result.requiredCorpus) },
            { label: "Projected corpus", value: formatINR(result.projectedCorpus) },
            {
              label: result.onTrack ? "Surplus" : "Shortfall",
              value: formatINR(Math.abs(result.gap)),
              emphasis: true,
            },
          ]}
        />
        <div
          className={cn(
            "rounded-lg border p-5",
            result.onTrack ? "border-emerald-500/40 bg-emerald-500/10" : "border-amber-500/40 bg-amber-500/10",
          )}
        >
          <p className="font-display text-lg font-semibold">
            {result.onTrack
              ? "You're on track to retire comfortably."
              : "There's a gap to close."}
          </p>
          <p className="mt-2 text-sm text-muted">
            By age {s.retirementAge} your monthly expenses become{" "}
            <strong>{formatINR(result.inflatedMonthlyExpenses)}</strong>. At that level you'll need
            a corpus of <strong>{formatINR(result.requiredCorpus)}</strong> to fund {s.postYears}{" "}
            years of retirement.
          </p>
        </div>
      </div>
    </div>
  );
}
