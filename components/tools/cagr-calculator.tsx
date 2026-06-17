"use client";

import { useMemo } from "react";
import { InputRow } from "@/components/tools/input-row";
import { ResultSummary } from "@/components/tools/result-summary";
import { useUrlNumberState } from "@/lib/use-url-state";
import { calculateCagr } from "@/lib/finance";
import { formatINR } from "@/lib/utils";

const DEFAULTS = { initial: 100000, final: 350000, years: 7 };

export function CagrCalculator() {
  const [s, set] = useUrlNumberState(DEFAULTS);

  const result = useMemo(
    () =>
      calculateCagr({
        initialValue: s.initial,
        finalValue: s.final,
        years: s.years,
      }),
    [s],
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
      <div className="space-y-7 rounded-xl border border-border bg-surface-2 p-6 sm:p-7">
        <InputRow
          label="Initial investment"
          value={s.initial}
          min={1000}
          max={100000000}
          step={1000}
          onChange={set.initial}
          currency
        />
        <InputRow
          label="Final value"
          value={s.final}
          min={1000}
          max={1000000000}
          step={1000}
          onChange={set.final}
          currency
        />
        <InputRow
          label="Duration"
          value={s.years}
          min={1}
          max={50}
          step={0.5}
          onChange={set.years}
          suffix=" yrs"
        />
      </div>

      <ResultSummary
        stats={[
          { label: "CAGR", value: `${result.cagrPct.toFixed(2)}%`, emphasis: true },
          { label: "Total return", value: `${result.totalReturnPct.toFixed(1)}%` },
          { label: "Absolute gain", value: formatINR(s.final - s.initial) },
        ]}
      />
    </div>
  );
}
