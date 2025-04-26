export default function WorkoutsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="min-h-screen bg-zinc-50 py-8">{children}</main>;
}
