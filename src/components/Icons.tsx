// Brand marks that lucide-react does not provide.

type IconProps = { size?: number; className?: string };

export function LogoMark({ size = 36, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="16" fill="#1f4d36" />
      <circle cx="21" cy="21" r="6" fill="#d8ab52" />
      <path d="M16 49C16 33 27 22 48 19C47 37 36 49 16 49Z" fill="#f6f3ea" />
      <path d="M17 48C24 39 31 32 41 26" stroke="#1f4d36" strokeWidth="2.6" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function FacebookIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" focusable="false">
      <path d="M24 12.07C24 5.44 18.63.07 12 .07S0 5.44 0 12.07c0 5.99 4.39 10.95 10.13 11.85v-8.38H7.08v-3.47h3.05V9.43c0-3.01 1.79-4.67 4.53-4.67 1.31 0 2.69.24 2.69.24v2.95h-1.51c-1.49 0-1.96.93-1.96 1.87v2.25h3.33l-.53 3.47h-2.8v8.38C19.61 23.02 24 18.06 24 12.07Z" />
    </svg>
  );
}

export function LineIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" focusable="false">
      <path d="M24 10.31C24 4.94 18.62.57 12 .57S0 4.94 0 10.31c0 4.82 4.27 8.85 10.04 9.61.39.08.92.26 1.06.59.12.3.08.77.04 1.08l-.17 1.02c-.05.3-.24 1.19 1.05.65 1.29-.54 6.92-4.08 9.44-6.97C23.18 14.39 24 12.46 24 10.31ZM7.75 13.51H5.36a.63.63 0 0 1-.63-.63V8.11a.63.63 0 1 1 1.26 0v4.14h1.76a.63.63 0 1 1 0 1.26Zm2.47-.63a.63.63 0 1 1-1.26 0V8.11a.63.63 0 1 1 1.26 0v4.77Zm5.74 0a.63.63 0 0 1-1.14.37l-2.44-3.32v2.95a.63.63 0 1 1-1.26 0V8.11a.63.63 0 0 1 1.13-.38l2.46 3.33V8.11a.63.63 0 1 1 1.26 0v4.77Zm3.86-3.02a.63.63 0 1 1 0 1.26h-1.76v1.13h1.76a.63.63 0 1 1 0 1.26h-2.39a.63.63 0 0 1-.63-.63V8.11c0-.35.28-.63.63-.63h2.39a.63.63 0 1 1 0 1.26h-1.76v1.12h1.76Z" />
    </svg>
  );
}

export function XIcon({ size = 18, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true" focusable="false">
      <path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.66l-5.21-6.82-5.97 6.82H1.67l7.73-8.84L1.25 2.25h6.83l4.71 6.23 5.45-6.23Zm-1.16 17.52h1.83L7.08 4.13H5.12l11.96 15.64Z" />
    </svg>
  );
}
