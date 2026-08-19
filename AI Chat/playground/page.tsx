import PlaygroundClient from "./PlaygroundClient";

export default function PlaygroundPage() {
  return (
    <main className="container-page py-12 sm:py-16">
      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
          Accessibility Playground
        </p>
        <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
          Three components built by hand
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Modal, tabs, and disclosure implemented in React + TypeScript using
          WAI-ARIA semantics and keyboard interaction.
        </p>
      </div>
      <PlaygroundClient />
    </main>
  );
}
