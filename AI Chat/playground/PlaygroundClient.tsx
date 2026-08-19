"use client";

import { useRef, useState } from "react";
import { Modal } from "./Modal";
import { Tabs } from "./Tabs";
import { Disclosure } from "./Disclosure";

export default function PlaygroundClient() {
  const [modalOpen, setModalOpen] = useState(false);
  const modalTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="space-y-10">
      <section>
        <div className="mb-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            01 · Modal
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">Dialog</h2>
          <p className="mt-2 text-sm text-slate-600">
            Try Tab, Shift+Tab, and Escape without touching the mouse.
          </p>
        </div>
        <button
          ref={modalTriggerRef}
          type="button"
          onClick={() => setModalOpen(true)}
          className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Open modal
        </button>
        <Modal
          open={modalOpen}
          title="Accessible modal"
          onClose={() => setModalOpen(false)}
        >
          <p>
            Focus moves into the dialog, stays inside while it is open, and
            returns to the trigger after closing.
          </p>
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              className="rounded-lg border border-slate-300 px-3 py-2 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Secondary action
            </button>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="rounded-lg bg-slate-900 px-3 py-2 font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Done
            </button>
          </div>
        </Modal>
      </section>

      <section>
        <div className="mb-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            02 · Tabs
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">Keyboard tabs</h2>
          <p className="mt-2 text-sm text-slate-600">
            Use Arrow keys, Home, and End after focusing the tablist.
          </p>
        </div>
        <Tabs
          tabs={[
            { id: "overview", label: "Overview", content: <p>Overview content.</p> },
            { id: "activity", label: "Activity", content: <p>Activity content.</p> },
            { id: "settings", label: "Settings", content: <p>Settings content.</p> },
          ]}
        />
      </section>

      <section>
        <div className="mb-4">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-600">
            03 · Disclosure
          </p>
          <h2 className="mt-1 text-2xl font-bold text-slate-950">Disclosure</h2>
          <p className="mt-2 text-sm text-slate-600">
            The button exposes its expanded state and controls the content.
          </p>
        </div>
        <Disclosure title="What does this component demonstrate?">
          <p>
            A disclosure is a button-controlled section of content. Tab reaches
            the button, Enter or Space toggles it, and the accessible state is
            exposed with aria-expanded and aria-controls.
          </p>
        </Disclosure>
      </section>
    </div>
  );
}
