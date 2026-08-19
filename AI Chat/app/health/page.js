export const dynamic = "force-dynamic";

async function getHealthData() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/todos/1", {
      cache: "no-store"
    });

    if (!response.ok) {
      throw new Error(`API responded with ${response.status}`);
    }

    const data = await response.json();

    return {
      ok: true,
      data
    };
  } catch (error) {
    return {
      ok: false,
      error: error.message
    };
  }
}

export default async function HealthPage() {
  const result = await getHealthData();

  return (
    <section className="container-page py-12 sm:py-16">
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
        System Check
      </p>
      <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
        Health Check
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
        This server-rendered page fetches live data from a public API and displays the result.
      </p>

      <div className="card mt-8 max-w-3xl p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div>
            <p className="text-sm text-slate-500">Application status</p>
            <p className={`mt-1 text-2xl font-bold ${result.ok ? "text-emerald-600" : "text-red-600"}`}>
              {result.ok ? "Healthy" : "Error"}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-sm font-semibold ${result.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
            {result.ok ? "API Connected" : "API Unavailable"}
          </span>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold text-slate-900">Fetched Data</h2>
          {result.ok ? (
            <pre className="mt-3 overflow-x-auto rounded-xl bg-slate-950 p-5 text-sm leading-6 text-slate-100">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          ) : (
            <p className="mt-3 rounded-xl bg-red-50 p-4 text-sm text-red-700">
              {result.error}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
