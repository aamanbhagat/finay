import type { SVGProps } from "react";

const BASE: SVGProps<SVGSVGElement> = {
  viewBox: "0 0 24 24",
  fill: "currentColor",
  "aria-hidden": true,
};

/** Minimal X/Twitter glyph (lucide dropped brand icons in v1). */
export function XIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...props}>
      <path d="M18.244 2H21l-6.52 7.45L22 22h-6.797l-4.79-6.243L4.8 22H2l7.077-8.082L2 2h6.953l4.327 5.717L18.244 2Zm-2.385 18.187h1.881L8.21 3.71H6.198l9.661 16.477Z" />
    </svg>
  );
}

/** Minimal LinkedIn glyph. */
export function LinkedInIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg {...BASE} {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.26 2.36 4.26 5.43v6.31ZM5.34 7.43A2.06 2.06 0 1 1 5.35 3.3a2.06 2.06 0 0 1-.01 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
    </svg>
  );
}
