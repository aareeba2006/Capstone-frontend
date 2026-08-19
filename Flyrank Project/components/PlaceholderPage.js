export default function PlaceholderPage({ eyebrow, title, description, items = [] }) {
  return (
    <section className="container-page py-12 sm:py-16">
      <div className="mb-8">
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
          {eyebrow}
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
          {description}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div className="card p-6" key={item.title}>
            <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 font-bold text-blue-600">
              {item.icon}
            </div>
            <h2 className="font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
