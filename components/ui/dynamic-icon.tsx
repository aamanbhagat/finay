import {
  TrendingUp,
  Bitcoin,
  Wallet,
  Landmark,
  ReceiptText,
  ShieldCheck,
  PiggyBank,
  Banknote,
  LineChart,
  Hourglass,
  GitCompareArrows,
  Calculator,
  Hash,
  type LucideIcon,
} from "lucide-react";

/**
 * Explicit icon registry. Using a static map (instead of `import * as Icons`
 * + dynamic lookup) keeps tree-shaking working — only these icons ship.
 */
const ICONS: Record<string, LucideIcon> = {
  TrendingUp,
  Bitcoin,
  Wallet,
  Landmark,
  ReceiptText,
  ShieldCheck,
  PiggyBank,
  Banknote,
  LineChart,
  Hourglass,
  GitCompareArrows,
  Calculator,
  Hash,
};

interface DynamicIconProps {
  name: string;
  className?: string;
}

export function DynamicIcon({ name, className }: DynamicIconProps) {
  const Icon = ICONS[name] ?? Hash;
  return <Icon className={className} aria-hidden />;
}
