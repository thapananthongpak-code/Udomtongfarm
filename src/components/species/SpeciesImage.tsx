type Props = {
  src: string;
  alt: string;
  /** "cover" fills the frame for cards. "contain" shows the whole photo, for the entry page. */
  fit?: "cover" | "contain";
  /** Load straight away, for photos visible when the page opens. */
  priority?: boolean;
  className?: string;
};

/** A photo on a wall-coloured ground. Draws an empty frame when the species has no photo yet. */
export default function SpeciesImage({ src, alt, fit = "cover", priority = false, className = "" }: Props) {
  return (
    <div className={`relative overflow-hidden bg-wall ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className={`absolute inset-0 size-full ${fit === "cover" ? "object-cover" : "object-contain"}`}
        />
      ) : (
        <div aria-hidden className="absolute inset-6 border border-line-strong" />
      )}
    </div>
  );
}
