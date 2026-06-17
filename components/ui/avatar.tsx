import Image from "next/image";
import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  src?: string;
  size?: number;
  className?: string;
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Author avatar with a graceful initials fallback when no image is set. */
export function Avatar({ name, src, size = 40, className }: AvatarProps) {
  const dimension = { width: size, height: size };
  if (src) {
    return (
      <Image
        src={src}
        alt={name}
        {...dimension}
        className={cn("rounded-full object-cover", className)}
      />
    );
  }
  return (
    <span
      aria-hidden
      style={dimension}
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-navy-700 font-display text-sm font-semibold text-gold",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
