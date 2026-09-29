import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  lede?: string;
  children?: ReactNode;
};

export default function PageHeader({ eyebrow, title, lede, children }: Props) {
  return (
    <header className="page-header">
      <div className="container">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="page-header__title">{title}</h1>
        {lede && <p className="page-header__lede">{lede}</p>}
        {children}
      </div>
    </header>
  );
}
