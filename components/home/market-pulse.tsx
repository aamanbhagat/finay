import { cn } from "@/lib/utils";

const MAIN = "0,190 35,170 70,186 105,150 140,156 175,128 210,138 245,98 280,108 315,72 350,82 385,52 420,60 455,38 490,42 525,22 560,32 595,12";
const SECONDARY = "0,210 35,202 70,210 105,196 140,200 175,184 210,188 245,170 280,176 315,156 350,162 385,142 420,148 455,128 490,134 525,118 560,124 595,110";

const POINTS = MAIN.split(" ").map((p) => p.split(",").map(Number) as [number, number]);

/** Layered editorial chart — theme-aware (uses CSS vars), two series + gradient + glow. */
export function MarketPulse({ className }: { className?: string }) {
  const [lastX, lastY] = POINTS[POINTS.length - 1];
  return (
    <svg
      viewBox="0 0 600 240"
      role="img"
      aria-label="An illustrative market index trending upward"
      className={cn("h-full w-full", className)}
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id="pulse-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.4" />
          <stop offset="60%" stopColor="var(--color-gold)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pulse-stroke" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="var(--color-gold)" />
          <stop offset="100%" stopColor="var(--color-accent-ink)" />
        </linearGradient>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Ledger hairlines + price labels */}
      {[40, 80, 120, 160, 200].map((y, i) => (
        <g key={y}>
          <line x1="0" x2="600" y1={y} y2={y} stroke="var(--color-border)" strokeWidth="1" />
          <text x="6" y={y - 4} fill="var(--color-faint)" fontSize="9" fontFamily="ui-monospace, monospace">
            {(28000 - i * 1500).toLocaleString()}
          </text>
        </g>
      ))}
      {[100, 200, 300, 400, 500].map((x) => (
        <line key={x} x1={x} x2={x} y1="220" y2="226" stroke="var(--color-border)" strokeWidth="1" />
      ))}

      {/* Secondary muted series */}
      <polyline
        points={SECONDARY}
        fill="none"
        stroke="var(--color-faint)"
        strokeWidth="1.25"
        strokeDasharray="3 3"
        strokeLinecap="round"
        opacity="0.6"
      />

      {/* Area + main line */}
      <polygon points={`0,240 ${MAIN} 600,240`} fill="url(#pulse-area)" />
      <polyline
        points={MAIN}
        fill="none"
        stroke="url(#pulse-stroke)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
        className="animate-draw"
        style={{ strokeDasharray: 1600, ["--dash" as string]: 1600 }}
      />

      {/* Latest data point */}
      <circle cx={lastX} cy={lastY} r="8" fill="var(--color-gold)" opacity="0.18" />
      <circle cx={lastX} cy={lastY} r="4" fill="var(--color-gold)" />
      <circle cx={lastX} cy={lastY} r="1.5" fill="var(--color-surface-2)" />

      {/* Floating gain badge */}
      <g transform={`translate(${lastX - 60}, ${lastY - 32})`}>
        <rect x="0" y="0" width="56" height="20" rx="4" fill="rgb(16 185 129 / 0.16)" stroke="rgb(16 185 129 / 0.5)" strokeWidth="0.75" />
        <text x="28" y="14" textAnchor="middle" fill="rgb(16 185 129)" fontSize="10" fontWeight="700" fontFamily="ui-monospace, monospace">
          +1.84%
        </text>
      </g>
    </svg>
  );
}
