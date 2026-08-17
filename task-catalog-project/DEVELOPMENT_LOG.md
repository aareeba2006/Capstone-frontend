# Development log — Index (a card-catalog task manager)

## What it is

A single-file React task manager, styled as a library card catalog instead
of a generic to-do list. Tasks are "cards" filed into a "drawer," each with a
colored category tab, a priority dot, a due date, and a rotated "FILED" ink
stamp that appears when a task is marked complete. Built as `TaskCatalog.jsx`.

Core features: add/remove tasks, mark complete, filter by status
(open/filed/all) and category, search by title, sort by due date/priority/
newest, an empty state, and inline form validation.

---

## Prompts used during development

Roughly in the order they were used:

1. *"I need to build a React task manager app for a class assignment. Instead
   of a generic to-do list, give it a distinct visual identity — something
   like a library card catalog, where tasks are index cards. Plan the design
   first: color palette, typography, and the one signature visual element,
   before writing code."*
2. *"Build the component: add task form (title, category, priority, due
   date), a grid of cards, filters for status/category, search, and sorting
   by due date or priority."*
3. *"The 'FILED' stamp on completed cards — make it look like an actual
   library due-date ink stamp: rotated, bordered, a bit worn, not a flat
   badge."*
4. *"Review the filtering logic — I want to make sure completed tasks don't
   still show up under 'Open' and that search is case-insensitive."*
5. *"Check the empty state and form validation — what happens if someone
   submits a card with no title, or every filter combination returns
   nothing?"*
6. *"Write up how you (the AI) helped me build this and what I changed by
   hand afterward, for the assignment submission."*

---

## How AI assisted

- **Scaffolding and boilerplate.** Claude generated the initial component
  structure — state hooks, the add-task form, the card grid — in one pass,
  which would otherwise have been the slowest part to type out by hand.
- **Design direction.** Rather than a default cream-and-serif layout, Claude
  proposed the card-catalog concept and worked out a matching palette (kraft
  brown, cream index cards, stamp-red and library-teal accents) and a
  typewriter/serif type pairing before any code was written — this made the
  app feel intentional rather than templated.
- **Feature logic.** Filtering, sorting, and overdue-detection logic
  (`useMemo`-based derived state) were drafted by AI and then read through
  line by line rather than trusted blindly.
- **Iteration on a specific detail.** The "FILED" stamp went through a
  revision pass — the first version was a flat colored badge; a follow-up
  prompt asked specifically for a rotated, hand-stamped look, which changed
  both the CSS (`transform: rotate()`, a heavier border, reduced opacity)
  and how it's layered over the card.

---

## Manual improvements made after reviewing the AI draft

**1. Overdue logic used a hardcoded reference date.**
The first draft computed "overdue" against a fixed date string rather than
something that would keep working as the app is used over time:

```js
// AI draft
function isOverdue(due) {
  return new Date(due) < new Date("2026-08-18");
}
```

This was flagged as a real bug for a live app — it would call every task
overdue once the date passed. Fixed to also account for completed tasks
(a finished task shouldn't ever read as overdue) and left a comment
explaining why the reference date is still pinned for this demo:

```js
function isOverdue(due, done) {
  if (!due || done) return false;
  const today = new Date("2026-08-18"); // demo data is anchored to this date;
  return new Date(due) < today;          // swap for `new Date()` in production
}
```

**2. Form allowed empty-title submissions.**
The initial `addTask` handler pushed whatever was in the input straight into
state, including whitespace-only strings:

```js
// AI draft
function addTask(e) {
  e.preventDefault();
  setTasks((prev) => [{ id: nextId(), title: draft.title, ...}, ...prev]);
}
```

Rewrote it to trim and validate first, with an inline error message instead
of silently doing nothing (a "form appears broken" pattern worth avoiding):

```js
function addTask(e) {
  e.preventDefault();
  if (!draft.title.trim()) {
    setFormError("Give this card a title first.");
    return;
  }
  setTasks((prev) => [{ id: nextId(), title: draft.title.trim(), ...}, ...prev]);
  setFormError("");
}
```

**3. Category filter dropdown vs. chip-based status filter — inconsistent
interaction pattern.**
The AI draft used the same dropdown `<select>` component for both status and
category filtering. Since status only has three fixed, frequently-toggled
values (open/filed/all), it was changed to tappable chips, while category
(a longer, less frequently changed list) stayed a dropdown — a small UX
correction so the more common action takes fewer clicks.

**4. Search was case-sensitive.**
Original filter used a direct substring match:

```js
list.filter((t) => t.title.includes(query))
```

Changed to `.toLowerCase()` on both sides so "meeting" also matches
"Meeting" — an easy miss in a first pass that only gets caught by actually
testing the search box.

**5. Empty-state copy.**
The AI's first version read "No tasks found." — accurate but generic and
inconsistent with the rest of the interface's voice. Rewrote it to match
the catalog metaphor: *"This drawer is empty. Nothing filed under these
terms."* — small, but it's the difference between an app that feels
designed end-to-end and one where the polish stops at the visuals.

---

## Files in this submission

- `TaskCatalog.jsx` — the completed application
- `DEVELOPMENT_LOG.md` — this document
