import { useId, useRef, useState } from "react";

type TabsProps = {
  tabs: Array<{
    id: string;
    label: string;
    content: React.ReactNode;
  }>;
};

export function Tabs({ tabs }: TabsProps) {
  const generatedId = useId();
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function moveFocus(index: number) {
    const nextIndex = (index + tabs.length) % tabs.length;
    const next = tabs[nextIndex];
    if (!next) return;
    setActiveId(next.id);
    tabRefs.current[nextIndex]?.focus();
  }

  function handleKeyDown(
    event: React.KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) {
    switch (event.key) {
      case "ArrowRight":
      case "ArrowDown":
        event.preventDefault();
        moveFocus(index + 1);
        break;
      case "ArrowLeft":
      case "ArrowUp":
        event.preventDefault();
        moveFocus(index - 1);
        break;
      case "Home":
        event.preventDefault();
        moveFocus(0);
        break;
      case "End":
        event.preventDefault();
        moveFocus(tabs.length - 1);
        break;
    }
  }

  const activeTab = tabs.find((tab) => tab.id === activeId) ?? tabs[0];

  return (
    <div>
      <div
        role="tablist"
        aria-label="Playground tabs"
        className="flex gap-1 border-b border-slate-200"
      >
        {tabs.map((tab, index) => {
          const selected = tab.id === activeTab?.id;
          const tabId = `${generatedId}-${tab.id}-tab`;
          const panelId = `${generatedId}-${tab.id}-panel`;

          return (
            <button
              key={tab.id}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={tabId}
              role="tab"
              type="button"
              aria-selected={selected}
              aria-controls={panelId}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(tab.id)}
              onKeyDown={(event) => handleKeyDown(event, index)}
              className="rounded-t-lg px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 data-[selected=true]:text-blue-700"
              data-selected={selected}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab && (
        <div
          id={`${generatedId}-${activeTab.id}-panel`}
          role="tabpanel"
          aria-labelledby={`${generatedId}-${activeTab.id}-tab`}
          tabIndex={0}
          className="mt-4 rounded-xl border border-slate-200 p-5 outline-none focus:ring-2 focus:ring-blue-500"
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}
