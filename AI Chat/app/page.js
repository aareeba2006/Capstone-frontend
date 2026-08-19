import Link from "next/link";

export default function HomePage() {
  return (
    <section className="container-page py-14 sm:py-20">
      <div className="max-w-3xl">
        <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
          Day 1 · Deployment Ready
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-6xl">
          Build once. <span className="gradient-text">Deploy from day one.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          A clean Next.js starter with routed screens, Tailwind design tokens,
          a live-data health check, responsive layouts, and a deployment-ready
          environment structure.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/dashboard" className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700">
            Open Dashboard
          </Link>
          <Link href="/health" className="rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700">
            Check Health
          </Link>
        </div>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["01", "Next.js", "Server Components by default"],
          ["02", "Tailwind", "Reusable visual tokens"],
          ["03", "Health", "Live fetched data"],
          ["04", "Deploy", "Vercel-ready workflow"]
        ].map(([number, title, text]) => (
          <div className="card p-6" key={number}>
            <p className="text-sm font-bold text-blue-600">{number}</p>
            <h2 className="mt-5 text-xl font-bold text-slate-900">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
