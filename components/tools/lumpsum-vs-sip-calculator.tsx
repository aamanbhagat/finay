"use client";

import { useMemo } from "react";
import { InputRow } from "@/components/tools/input-row";
import { ResultSummary } from "@/components/tools/result-summary";
import { useUrlNumberState } from "@/lib/use-url-state";
import { compareLumpsumVsSip } from "@/lib/finance";
import { formatINR } from "@/lib/utils";

const DEFAULTS = { amount: 1200000, rate: 12, years: 10 };

export function LumpsumVsSipCalculator() {
  const [s, set] = useUrlNumberState(DEFAULTS);

  const result = useMemo(
    () =>
      compareLumpsumVsSip({
        totalAmount: s.amount,
        annualRatePct: s.rate,
        years: s.years,
      }),
    [s],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-7 rounded-xl border border-border bg-surface-2 p-6 sm:p-7">
        <InputRow
          label="Total amount"
          value={s.amount}
          min={10000}
          max={100000000}
          step={10000}
          onChange={set.amount}
          currency
        />
        <InputRow
          label="Annual return"
          value={s.rate}
          min={1}
          max={30}
          step={0.5}
          onChange={set.rate}
          suffix="%"
        />
        <InputRow
          label="Duration"
          value={s.years}
          min={1}
          max={40}
          step={1}
          onChange={set.years}
          suffix=" yrs"
        />
        <p className="text-xs leading-relaxed text-muted">
          Compares investing the whole amount today against splitting it equally each month over the same period — assuming
          the same constant return.
        </p>
      </div>

      <div className="space-y-4">
        <div className="rounded-xl border border-border bg-surface-2 p-5 sm:p-6">
          <h3 className="font-display text-lg font-semibold">Lumpsum</h3>
          <p className="mt-1 text-sm text-muted">Entire amount invested today.</p>
          <ResultSummary
            className="mt-4 sm:grid-cols-2"
            stats={[
              { label: "Invested", value: formatINR(result.lumpsum.invested) },
              { label: "Future value", value: formatINR(result.lumpsum.futureValue), emphasis: true },
            ]}
          />
        </div>
        <div className="rounded-xl border border-border bg-surface-2 p-5 sm:p-6">
          <h3 className="font-display text-lg font-semibold">SIP</h3>
          <p className="mt-1 text-sm text-muted">
            {formatINR(result.sip.monthly)} every month for {s.years} years.
          </p>
          <ResultSummary
            className="mt-4 sm:grid-cols-2"
            stats={[
              { label: "Invested", value: formatINR(result.sip.invested) },
              { label: "Future value", value: formatINR(result.sip.futureValue), emphasis: true },
            ]}
          />
        </div>
        <p className="rounded-lg border border-border bg-surface p-4 text-sm">
          At a steady {s.rate}% return, the lumpsum ends{" "}
          <strong className="text-accent-ink">{formatINR(result.advantage)}</strong> ahead — but real
          returns aren't steady, and SIPs smooth out the volatility.
        </p>
      </div>
    </div>
  );
}
