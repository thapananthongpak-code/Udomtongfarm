import { useMemo } from "react";
import { drawQr } from "@/lib/qr";

/** A QR code that opens `url`. Always black on white, with the margin scanners need. */
export default function QrCode({ url, label, className = "" }: { url: string; label: string; className?: string }) {
  const { size, path } = useMemo(() => drawQr(url), [url]);

  return (
    <svg role="img" aria-label={label} viewBox={`0 0 ${size} ${size}`} shapeRendering="crispEdges" className={className}>
      <rect width={size} height={size} fill="#fff" />
      <path d={path} fill="#000" />
    </svg>
  );
}
