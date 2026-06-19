export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-950">
      <section className="w-full max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm sm:p-16">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
          Tax Invoice
        </p>
        <h1 className="max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl">
          Your invoice workspace is ready.
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
          Next.js, TypeScript, Tailwind CSS and Supabase client utilities are
          configured. The invoice builder comes next.
        </p>
        <div className="mt-10 flex flex-wrap gap-3 text-sm font-medium">
          {["Next.js 16", "TypeScript", "Tailwind CSS 4", "Supabase ready"].map(
            (item) => (
              <span
                key={item}
                className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2"
              >
                {item}
              </span>
            ),
          )}
        </div>
      </section>
    </main>
  );
}
