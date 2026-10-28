
interface PlaceholderPageProps {
  title: string;
}

export function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <main className="min-h-screen bg-[#130d0a] p-8 text-[#F4EEE8]">
      <h1 className="text-2xl font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-[#D98845]/80">
        Esta página ainda está em desenvolvimento.
      </p>
    </main>
  );
}
