import { useId, useState } from "react";

type DisclosureProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

export function Disclosure({
  title,
  children,
  defaultOpen = false,
}: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const contentId = useId();

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <h2 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={contentId}
          onClick={() => setOpen((current) => !current)}
          className="flex w-full items-center justify-between gap-4 bg-white px-5 py-4 text-left font-semibold text-slate-900 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
        >
          <span>{title}</span>
          <span aria-hidden="true" className="text-xl">
            {open ? "−" : "+"}
          </span>
        </button>
      </h2>

      <div
        id={contentId}
        hidden={!open}
        className="border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm leading-6 text-slate-600"
      >
        {children}
      </div>
    </div>
  );
}
