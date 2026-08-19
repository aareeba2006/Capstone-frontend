# NOTES — Hand-Built Components vs shadcn/ui

## What I built by hand

I implemented three components in `playground/`:

- `Modal.tsx`
- `Tabs.tsx`
- `Disclosure.tsx`

The implementations use React + TypeScript and do not use a component library.

### Keyboard behavior tested

**Modal**
- Tab moves between focusable elements inside the dialog.
- Shift+Tab moves backward.
- Tab wraps from the last focusable element to the first.
- Escape closes the dialog.
- Focus returns to the element that opened the dialog.

**Tabs**
- Tab reaches the active tab.
- Arrow Left/Up and Arrow Right/Down move between tabs.
- Home moves to the first tab.
- End moves to the last tab.
- The active tab uses `aria-selected` and `tabIndex` correctly.
- The panel uses `role="tabpanel"` and `aria-labelledby`.

**Disclosure**
- The control is a real button, so Enter and Space work with native keyboard behavior.
- `aria-expanded` exposes the open/closed state.
- `aria-controls` connects the button to its content.
- The controlled content is hidden when closed.

## What shadcn/ui handled that I missed or simplified

### 1. Focus management and modal behavior are more complete

My hand-built modal implements the main focus trap, Escape handling, and focus restoration manually. That is a lot of behavior to maintain correctly.

shadcn's Dialog delegates this behavior to Radix UI primitives. The generated component composes `DialogPrimitive.Root`, `Portal`, `Overlay`, `Content`, `Title`, `Description`, and `Close`. The primitive handles the difficult interaction details instead of making the application component own them.

**Gap:** my version is a smaller educational implementation; the shadcn/Radix approach provides a more battle-tested interaction foundation.

### 2. shadcn separates dialog structure into reusable accessible primitives

My modal has a single `Modal` component and a custom focusable-selector implementation.

The shadcn version separates the dialog into pieces such as `Dialog`, `DialogTrigger`, `DialogContent`, `DialogOverlay`, `DialogTitle`, `DialogDescription`, and `DialogClose`.

**Gap:** my API is simpler, but it is less composable. shadcn makes it easier to add different dialog layouts while preserving the underlying accessibility behavior.

### 3. Tabs behavior is delegated to an accessibility primitive

My tabs manually implement the roving `tabIndex`, arrow-key navigation, Home/End behavior, and active state.

shadcn's Tabs wraps Radix Tabs primitives, so keyboard navigation and tab/panel relationships are handled by the primitive rather than by my component's event handler.

**Gap:** my implementation demonstrates that I understand the APG interaction pattern, but it has more custom interaction code that I would have to maintain and test.

### 4. shadcn adds production-oriented composition and styling conventions

The generated shadcn components accept the underlying primitive props and merge custom classes with `cn()`.

My hand-built components expose only the props I currently need.

**Gap:** shadcn provides a more flexible composition API and a consistent way to extend generated components without rewriting their accessibility primitives.

## Main lesson

Building the components manually first made the hidden complexity visible: keyboard navigation, focus state, ARIA relationships, and restoration behavior are easy to overlook.

The value of shadcn/ui is not simply that it makes a component shorter. Its generated source combines composable UI code with established accessibility primitives, which reduces the amount of interaction behavior that I have to implement and maintain myself.
