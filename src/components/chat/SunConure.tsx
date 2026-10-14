import { useId } from "react";

type Props = {
  className?: string;
  /** Idle movement: bobbing, blinking, and a head tilt and wing flutter when the pointer is near. */
  animated?: boolean;
};

/**
 * The farm's sun conure, drawn in code. Shading comes from gradients (light from the upper left)
 * and a glint in the eye, which gives the flat shapes some depth. It has no frame or background of its own.
 */
export default function SunConure({ className = "", animated = true }: Props) {
  // Gradient ids must be unique on the page, because the bird can be drawn more than once.
  const id = useId().replace(/:/g, "");
  const ref = (name: string) => `url(#${name}-${id})`;

  return (
    <svg
      aria-hidden
      viewBox="4 8 112 112"
      className={`${animated ? "conure" : ""} ${className}`}
      focusable="false"
    >
      <defs>
        <radialGradient id={`body-${id}`} cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#fff07a" />
          <stop offset="0.45" stopColor="#ffc21f" />
          <stop offset="1" stopColor="#f08a0a" />
        </radialGradient>
        <radialGradient id={`face-${id}`} cx="0.35" cy="0.3" r="0.85">
          <stop offset="0" stopColor="#ffc247" />
          <stop offset="0.5" stopColor="#ff9a1c" />
          <stop offset="1" stopColor="#e8650a" />
        </radialGradient>
        <radialGradient id={`belly-${id}`} cx="0.4" cy="0.35" r="0.75">
          <stop offset="0" stopColor="#ffb340" />
          <stop offset="1" stopColor="#f07a0d" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`wing-${id}`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#ffb62b" />
          <stop offset="0.45" stopColor="#8fb83a" />
          <stop offset="0.8" stopColor="#2f9a5b" />
          <stop offset="1" stopColor="#1f6fb0" />
        </linearGradient>
        <linearGradient id={`tail-${id}`} x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0" stopColor="#f58a0c" />
          <stop offset="0.5" stopColor="#4aa84f" />
          <stop offset="1" stopColor="#1f6fb0" />
        </linearGradient>
        <linearGradient id={`beak-${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#6c6c78" />
          <stop offset="1" stopColor="#25252b" />
        </linearGradient>
        <linearGradient id={`perch-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b98355" />
          <stop offset="1" stopColor="#6b4426" />
        </linearGradient>
      </defs>

      <g className="conure-bob">
        {/* The tail hangs down behind the perch. */}
        <path d="M66 74c8 14 12 28 8 42-7-8-13-24-14-40Z" fill={ref("tail")} />
        <path d="M58 76c4 15 4 28-2 39-6-9-8-24-5-38Z" fill={ref("tail")} opacity="0.85" />

        <rect x="10" y="94" width="100" height="10" rx="5" fill={ref("perch")} />
        <path d="M14 96h92" stroke="#e0b283" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />

        {/* Feet */}
        <path d="M49 88v8M54 88v8M63 88v8M68 88v8" stroke="#8b8b94" strokeWidth="3" strokeLinecap="round" />

        {/* Body */}
        <ellipse cx="58" cy="62" rx="29" ry="31" fill={ref("body")} />
        <ellipse cx="50" cy="73" rx="17" ry="18" fill={ref("belly")} />

        {/* Wing */}
        <g className="conure-wing">
          <path d="M70 40c19 6 24 32 11 52-9-5-18-21-18-38 0-6 2-11 7-14Z" fill={ref("wing")} />
          <path d="M71 50c6 10 7 22 3 33M77 52c4 9 4 19 0 30" stroke="#fff" strokeWidth="1.2" strokeLinecap="round" opacity="0.28" fill="none" />
        </g>

        {/* Head */}
        <g className="conure-head">
          <circle cx="46" cy="40" r="23" fill={ref("body")} />
          <circle cx="40" cy="44" r="16" fill={ref("face")} />
          <ellipse cx="42" cy="25" rx="10" ry="4.5" fill="#fff" opacity="0.4" transform="rotate(-22 42 25)" />
          <path d="M52 19c2-6 8-8 11-5-5 0-8 2-9 6Z" fill="#f08a0a" />

          {/* Eye, with a lid that closes for a blink */}
          <circle cx="38" cy="39" r="7.5" fill="#fff6dc" />
          <circle cx="38" cy="39" r="4.6" fill="#1c1209" />
          <circle cx="36.3" cy="37.2" r="1.6" fill="#fff" />
          <circle cx="38" cy="39" r="7.5" fill={ref("face")} className="conure-lid" />

          {/* Beak */}
          <path d="M27 36C16 35 10 44 15 55c3-5 8-8 14-8Z" fill={ref("beak")} />
          <path d="M17 50c2 7 9 8 13 1-4-1-9-1-13-1Z" fill="#3a3a42" />
          <path d="M19 41c2-3 5-4 8-4" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" fill="none" />
        </g>
      </g>
    </svg>
  );
}
