import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center gap-12 px-6 py-16">
      <section className="space-y-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-primary">Cursor SaaS Template</p>
        <h1 className="text-4xl font-bold sm:text-5xl">Ship AI-assisted SaaS PWAs at Ludicrous Speed</h1>
        <p className="text-lg text-slate-500 dark:text-slate-300">
          Start from a production-ready template with type-safe contracts, managed auth & billing, and a full docs-as-code
          workflow tuned for Cursor AI.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/sign-in"
            className="rounded-md bg-primary px-6 py-3 text-base font-semibold text-primary-foreground shadow hover:bg-blue-600"
          >
            Sign in
          </Link>
          <Link
            href="/pricing"
            className="rounded-md border border-slate-300 px-6 py-3 text-base font-semibold hover:border-primary"
          >
            View pricing
          </Link>
        </div>
      </section>
      <section className="grid gap-6 text-left sm:grid-cols-3">
        {[
          {
            title: 'AI-first contracts',
            body: 'tRPC + Zod + Prisma keep the entire stack type-safe so Cursor can implement features safely.'
          },
          {
            title: 'Managed from day one',
            body: 'Clerk, Stripe/Xendit, Supabase/Neon, Resend, and observability wired in.'
          },
          {
            title: 'Docs-as-code',
            body: 'Architecture, ADRs, Storybook, and CI guards ensure the template stays explainable to agents.'
          }
        ].map((feature) => (
          <div key={feature.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:bg-slate-800">
            <h3 className="text-lg font-semibold">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">{feature.body}</p>
          </div>
        ))}
      </section>
    </main>
  );
}


