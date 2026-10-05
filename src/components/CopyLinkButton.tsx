"use client";

import { useState } from "react";

export default function CopyLinkButton({ label, copiedLabel }: { label: string; copiedLabel: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Clipboard access can be refused. The address bar still has the link.
    }
  }

  return (
    <button type="button" onClick={copy} className="btn btn-quiet">
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
