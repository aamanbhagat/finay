"use client";

import { useState } from "react";
import { Check, Copy, Share2, MessageCircle } from "lucide-react";
import { XIcon, LinkedInIcon } from "@/components/ui/brand-icons";

interface ShareButtonsProps {
  url: string;
  title: string;
}

const BTN =
  "inline-flex size-9 items-center justify-center rounded-(--radius) border border-border text-muted transition-colors hover:bg-surface hover:text-foreground";

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const encoded = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const tweet = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encoded}`;
  const linkedin = `https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`;
  const whatsapp = `https://wa.me/?text=${encodedTitle}%20${encoded}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* ignore — clipboard may be unavailable */
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* user cancelled */
      }
    } else {
      copyLink();
    }
  }

  return (
    <div className="flex items-center gap-2" aria-label="Share this article">
      <a href={tweet} target="_blank" rel="noopener noreferrer" aria-label="Share on X" className={BTN}>
        <XIcon className="size-4" />
      </a>
      <a
        href={linkedin}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on LinkedIn"
        className={BTN}
      >
        <LinkedInIcon className="size-4" />
      </a>
      <a
        href={whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className={BTN}
      >
        <MessageCircle className="size-4" aria-hidden />
      </a>
      <button type="button" onClick={copyLink} aria-label="Copy link" className={BTN}>
        {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
      </button>
      <button type="button" onClick={nativeShare} aria-label="Share" className={BTN}>
        <Share2 className="size-4" aria-hidden />
      </button>
    </div>
  );
}
