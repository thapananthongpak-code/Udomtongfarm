export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="shell flex justify-center py-16 md:py-24">{children}</div>;
}
