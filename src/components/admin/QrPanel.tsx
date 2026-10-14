import { useState } from "react";
import { Link } from "react-router-dom";
import QrCode from "@/components/QrCode";
import { localePath } from "@/i18n";
import { useLang, useT } from "@/i18n/hooks";
import { qrPng, qrSvgFile, saveBlob } from "@/lib/qr";
import { speciesQrUrl } from "@/lib/site";

/** The QR code of one entry, with the ways to take it away: picture files, the link, and the sheet of all codes. */
export default function QrPanel({ id, name, published }: { id: string; name: string; published: boolean }) {
  const lang = useLang();
  const t = useT().admin.qr;
  const [message, setMessage] = useState<"" | "copied" | "failed">("");
  const url = speciesQrUrl(id);

  async function downloadPng() {
    const blob = await qrPng(url);
    if (blob) saveBlob(blob, `qr-${id}.png`);
    else setMessage("failed");
  }

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setMessage("copied");
    } catch {
      setMessage("failed");
    }
  }

  return (
    <section aria-labelledby="qr-title" className="mt-10 grid gap-8 border-y border-line py-8 sm:grid-cols-[auto_1fr]">
      <QrCode url={url} label={`${t.panelTitle}: ${name}`} className="size-40 border border-line-strong" />
      <div className="min-w-0">
        <h2 id="qr-title" className="font-serif text-2xl">
          {t.panelTitle}
        </h2>
        <p className="mt-2 max-w-md text-[0.9375rem] text-muted">{t.panelHint}</p>
        <p className="mt-3 break-all font-mono text-[0.8125rem]">{url}</p>
        {!published && <p className="notice mt-4 max-w-md">{t.draft}</p>}

        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" className="btn btn-sm" onClick={downloadPng}>
            {t.png}
          </button>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => saveBlob(new Blob([qrSvgFile(url)], { type: "image/svg+xml" }), `qr-${id}.svg`)}
          >
            {t.svg}
          </button>
          <button type="button" className="btn btn-sm btn-quiet" onClick={copyLink}>
            {t.copy}
          </button>
          <Link to={localePath(lang, "/admin/qr")} className="btn btn-sm btn-quiet">
            {t.sheet}
          </Link>
        </div>
        <p role="status" className={`mt-3 text-[0.875rem] ${message === "failed" ? "text-danger" : "text-muted"}`}>
          {message === "copied" ? t.copied : message === "failed" ? t.failed : ""}
        </p>
      </div>
    </section>
  );
}
