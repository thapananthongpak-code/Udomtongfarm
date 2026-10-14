import { useState } from "react";

type Props = {
  src: string;
  alt: string;
  /** "cover" fills the frame for cards. "contain" shows the whole photo, for the entry page. */
  fit?: "cover" | "contain";
  /** Load straight away, for photos visible when the page opens. */
  priority?: boolean;
  /** What to draw inside the empty frame while there is no photo. */
  placeholder?: "animal" | "plant";
  className?: string;
};

const ICONS = {
  // A perched bird.
  animal: (
    <>
      <path d="M5 14.5c0-4 3-7.5 7.2-7.5 2.6 0 4.6 1.6 5.1 3.8L21 12l-3.7 1.2c-.5 3.6-3.5 6.3-7.3 6.3-2.8 0-5-2.2-5-5Z" />
      <path d="M5.3 16.2 2.5 19M10 19.5V22M13 19v3" />
      <circle cx="14.2" cy="10.6" r=".6" fill="currentColor" stroke="none" />
    </>
  ),
  // A leaf with its midrib.
  plant: (
    <>
      <path d="M4.5 19.5C4.5 10.5 10 5 19.5 4.5 19 14 13.5 19.5 4.5 19.5Z" />
      <path d="M4.5 19.5 14 10M9 15h4.5M11.5 12.5V8.5" />
    </>
  ),
};

/**
 * A photo on a wall-coloured ground. While there is no photo, or it cannot be loaded,
 * an empty frame is drawn instead, with a small bird or leaf when the kind is known.
 */
export default function SpeciesImage({ src, alt, fit = "cover", priority = false, placeholder, className = "" }: Props) {
  // The address that failed to load, so that a new address gets a fresh try.
  const [failed, setFailed] = useState<string | null>(null);
  const showPhoto = src !== "" && failed !== src;

  return (
    <div className={`relative overflow-hidden rounded-2xl bg-wall ${className}`}>
      {showPhoto ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(src)}
          className={`zoom-on-hover absolute inset-0 size-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
        />
      ) : (
        <div aria-hidden className="absolute inset-[8%] flex items-center justify-center rounded-xl border border-dashed border-line-strong">
          {placeholder && (
            <svg
              viewBox="0 0 24 24"
              className="zoom-on-hover size-[34%] max-h-24 max-w-24 text-line-strong"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {ICONS[placeholder]}
            </svg>
          )}
        </div>
      )}
    </div>
  );
}
