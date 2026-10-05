type Props = { title: string; lede: string; notice?: string | null; children: React.ReactNode; footer?: React.ReactNode };

/** The narrow column used by the sign-in page. */
export default function AuthCard({ title, lede, notice, children, footer }: Props) {
  return (
    <div className="w-full max-w-sm">
      <h1 className="display text-4xl">{title}</h1>
      <p className="mt-3 text-[0.9375rem] text-muted">{lede}</p>
      {notice && <p className="notice mt-6">{notice}</p>}
      <div className="mt-8">{children}</div>
      {footer && <div className="mt-8 space-y-2 border-t border-line pt-6 text-[0.9375rem] text-muted">{footer}</div>}
    </div>
  );
}
