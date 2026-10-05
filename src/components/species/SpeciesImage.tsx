import Image from "next/image";
import { supabaseEnv } from "@/lib/supabase/env";

/** Local files and uploads in this project's Supabase storage can be resized by Next.js. Anything else is shown as it is. */
const canOptimize = (src: string) => src.startsWith("/") || (supabaseEnv !== null && src.startsWith(`${supabaseEnv.url}/`));

type Props = {
  src: string;
  alt: string;
  sizes: string;
  /** "cover" fills the frame for cards. "contain" shows the whole photo, for the entry page. */
  fit?: "cover" | "contain";
  priority?: boolean;
  className?: string;
};

/** A photo on a wall-coloured ground. Draws an empty frame when the species has no photo yet. */
export default function SpeciesImage({ src, alt, sizes, fit = "cover", priority = false, className = "" }: Props) {
  return (
    <div className={`relative overflow-hidden bg-wall ${className}`}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          unoptimized={!canOptimize(src)}
          className={fit === "cover" ? "object-cover" : "object-contain"}
        />
      ) : (
        <div aria-hidden className="absolute inset-6 border border-line-strong" />
      )}
    </div>
  );
}
