// Drawing QR codes for the pages of the collection (the address itself is `speciesQrUrl` in site.ts).
// Codes are always black on white, whatever contrast mode is chosen, because that is what scanners read best.

import { encode } from "uqr";

/** The white margin around a code, in modules. Scanners need at least four. */
const QUIET_ZONE = 4;

export type QrDrawing = {
  /** Width and height of the drawing, margin included, in modules. */
  size: number;
  /** An SVG path that fills every black module. */
  path: string;
  rows: boolean[][];
};

export function drawQr(url: string): QrDrawing {
  const rows = encode(url, { ecc: "M", border: 0 }).data;
  const size = rows.length + QUIET_ZONE * 2;

  // One rectangle per run of black modules keeps the path short.
  const parts: string[] = [];
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      if (!row[x]) continue;
      let end = x;
      while (end + 1 < row.length && row[end + 1]) end++;
      parts.push(`M${x + QUIET_ZONE} ${y + QUIET_ZONE}h${end - x + 1}v1h-${end - x + 1}z`);
      x = end;
    }
  });
  return { size, path: parts.join(""), rows };
}

/** A complete SVG file, for printing and for downloading. */
export function qrSvgFile(url: string): string {
  const { size, path } = drawQr(url);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size * 10}" height="${size * 10}" shape-rendering="crispEdges">` +
    `<rect width="${size}" height="${size}" fill="#fff"/><path d="${path}" fill="#000"/></svg>`
  );
}

/** A PNG picture of the code, each module `modulePx` pixels wide. Null if the browser cannot draw it. */
export function qrPng(url: string, modulePx = 16): Promise<Blob | null> {
  const { size, rows } = drawQr(url);
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size * modulePx;
  const context = canvas.getContext("2d");
  if (!context) return Promise.resolve(null);

  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "#000";
  rows.forEach((row, y) =>
    row.forEach((on, x) => {
      if (on) context.fillRect((x + QUIET_ZONE) * modulePx, (y + QUIET_ZONE) * modulePx, modulePx, modulePx);
    }),
  );
  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}

export function saveBlob(blob: Blob, filename: string) {
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}
