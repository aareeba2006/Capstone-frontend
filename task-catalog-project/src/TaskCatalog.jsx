import React, { useState, useMemo } from "react";
import { Plus, X, Check, Trash2, Search, Tag, CalendarDays, Archive } from "lucide-react";

const CATEGORIES = [
  { id: "work", label: "Work", color: "#B33B2E" },
  { id: "personal", label: "Personal", color: "#2F6F62" },
  { id: "learning", label: "Learning", color: "#C79A3D" },
  { id: "errands", label: "Errands", color: "#5B7C99" },
];

const PRIORITIES = [
  { id: "low", label: "Low", dot: "#8B8272" },
  { id: "medium", label: "Medium", dot: "#C79A3D" },
  { id: "high", label: "High", dot: "#B33B2E" },
];

const seedTasks = [
  {
    id: "t1",
    title: "Draft Q3 budget review",
    category: "work",
    priority: "high",
    due: "2026-08-21",
    done: false,
    created: 1,
  },
  {
    id: "t2",
    title: "Renew library card",
    category: "errands",
    priority: "low",
    due: "2026-08-25",
    done: false,
    created: 2,
  },
  {
    id: "t3",
    title: "Finish React hooks chapter",
    category: "learning",
    priority: "medium",
    due: "2026-08-19",
    done: false,
    created: 3,
  },
  {
    id: "t4",
    title: "Call mom",
    category: "personal",
    priority: "medium",
    due: "",
    done: true,
    created: 4,
  },
];

function catInfo(id) {
  return CATEGORIES.find((c) => c.id === id) || CATEGORIES[0];
}
function priInfo(id) {
  return PRIORITIES.find((p) => p.id === id) || PRIORITIES[1];
}
function isOverdue(due, done) {
  if (!due || done) return false;
  const today = new Date("2026-08-18");
  return new Date(due) < today;
}
function formatDue(due) {
  if (!due) return "no due date";
  const d = new Date(due + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function TaskCatalog() {
  const [tasks, setTasks] = useState(seedTasks);
  const [query, setQuery] = useState("");
  const [catFilter, setCatFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("open");
  const [sortBy, setSortBy] = useState("due");
  const [showForm, setShowForm] = useState(false);

  const [draft, setDraft] = useState({
    title: "",
    category: "work",
    priority: "medium",
    due: "",
  });
  const [formError, setFormError] = useState("");

  const nextId = () => "t" + Math.random().toString(36).slice(2, 9);

  function addTask(e) {
    e.preventDefault();
    if (!draft.title.trim()) {
      setFormError("Give this card a title first.");
      return;
    }
    setTasks((prev) => [
      {
        id: nextId(),
        title: draft.title.trim(),
        category: draft.category,
        priority: draft.priority,
        due: draft.due,
        done: false,
        created: prev.length + 1,
      },
      ...prev,
    ]);
    setDraft({ title: "", category: "work", priority: "medium", due: "" });
    setFormError("");
    setShowForm(false);
  }

  function toggleDone(id) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  }

  function removeTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  const filtered = useMemo(() => {
    let list = tasks.filter((t) => {
      if (statusFilter === "open" && t.done) return false;
      if (statusFilter === "filed" && !t.done) return false;
      if (catFilter !== "all" && t.category !== catFilter) return false;
      if (query && !t.title.toLowerCase().includes(query.toLowerCase()))
        return false;
      return true;
    });
    const priorityRank = { high: 0, medium: 1, low: 2 };
    list.sort((a, b) => {
      if (sortBy === "due") {
        if (!a.due) return 1;
        if (!b.due) return -1;
        return a.due.localeCompare(b.due);
      }
      if (sortBy === "priority") {
        return priorityRank[a.priority] - priorityRank[b.priority];
      }
      return b.created - a.created;
    });
    return list;
  }, [tasks, statusFilter, catFilter, query, sortBy]);

  const total = tasks.length;
  const filedCount = tasks.filter((t) => t.done).length;

  return (
    <div style={styles.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Courier+Prime:wght@400;700&family=Source+Serif+4:wght@400;600&display=swap');
        * { box-sizing: border-box; }
        .tc-card { transition: transform 0.15s ease, box-shadow 0.15s ease; }
        .tc-card:hover { transform: translateY(-2px); }
        .tc-btn { cursor: pointer; }
        .tc-chip { cursor: pointer; user-select: none; }
        input, select { font-family: inherit; }
        input:focus, select:focus, textarea:focus { outline: 2px solid #C79A3D; outline-offset: 1px; }
      `}</style>

      <div style={styles.drawer}>
        <header style={styles.header}>
          <div>
            <div style={styles.eyebrow}>DRAWER NO. 01</div>
            <h1 style={styles.title}>Index</h1>
            <div style={styles.subtitle}>a card catalog for things left undone</div>
          </div>
          <button
            className="tc-btn"
            style={styles.addBtn}
            onClick={() => setShowForm((s) => !s)}
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            {showForm ? "Close" : "New card"}
          </button>
        </header>

        {showForm && (
          <form onSubmit={addTask} style={styles.formCard}>
            <div style={styles.formRow}>
              <input
                autoFocus
                placeholder="What needs doing?"
                value={draft.title}
                onChange={(e) => {
                  setDraft({ ...draft, title: e.target.value });
                  if (formError) setFormError("");
                }}
                style={styles.input}
              />
            </div>
            <div style={styles.formRowSplit}>
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Category</label>
                <div style={styles.chipRow}>
                  {CATEGORIES.map((c) => (
                    <span
                      key={c.id}
                      className="tc-chip"
                      onClick={() => setDraft({ ...draft, category: c.id })}
                      style={{
                        ...styles.chip,
                        borderColor: c.color,
                        background:
                          draft.category === c.id ? c.color : "transparent",
                        color: draft.category === c.id ? "#F5F0E1" : c.color,
                      }}
                    >
                      {c.label}
                    </span>
                  ))}
                </div>
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Priority</label>
                <div style={styles.chipRow}>
                  {PRIORITIES.map((p) => (
                    <span
                      key={p.id}
                      className="tc-chip"
                      onClick={() => setDraft({ ...draft, priority: p.id })}
                      style={{
                        ...styles.chip,
                        borderColor: p.dot,
                        background:
                          draft.priority === p.id ? p.dot : "transparent",
                        color: draft.priority === p.id ? "#F5F0E1" : p.dot,
                      }}
                    >
                      {p.label}
                    </span>
                  ))}
                </div>
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.fieldLabel}>Due</label>
                <input
                  type="date"
                  value={draft.due}
                  onChange={(e) => setDraft({ ...draft, due: e.target.value })}
                  style={styles.dateInput}
                />
              </div>
            </div>
            {formError && <div style={styles.formError}>{formError}</div>}
            <div style={styles.formActions}>
              <button type="submit" className="tc-btn" style={styles.fileBtn}>
                File this card
              </button>
            </div>
          </form>
        )}

        <div style={styles.toolbar}>
          <div style={styles.searchWrap}>
            <Search size={14} color="#8B8272" />
            <input
              placeholder="Search the catalog..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.filterGroup}>
            {["open", "filed", "all"].map((s) => (
              <span
                key={s}
                className="tc-chip"
                onClick={() => setStatusFilter(s)}
                style={{
                  ...styles.tab,
                  ...(statusFilter === s ? styles.tabActive : {}),
                }}
              >
                {s === "open" ? "Open" : s === "filed" ? "Filed" : "All"}
              </span>
            ))}
          </div>

          <select
            value={catFilter}
            onChange={(e) => setCatFilter(e.target.value)}
            style={styles.select}
          >
            <option value="all">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={styles.select}
          >
            <option value="due">Sort: due date</option>
            <option value="priority">Sort: priority</option>
            <option value="created">Sort: newest</option>
          </select>
        </div>

        {filtered.length === 0 ? (
          <div style={styles.empty}>
            <Archive size={28} color="#8B8272" />
            <div style={styles.emptyTitle}>This drawer is empty.</div>
            <div style={styles.emptyBody}>
              Nothing filed under these terms. Try a different search or
              category.
            </div>
          </div>
        ) : (
          <div style={styles.grid}>
            {filtered.map((t) => {
              const cat = catInfo(t.category);
              const pri = priInfo(t.priority);
              const overdue = isOverdue(t.due, t.done);
              return (
                <div key={t.id} className="tc-card" style={styles.card}>
                  <div style={{ ...styles.cardTab, background: cat.color }}>
                    {cat.label}
                  </div>
                  <div style={styles.cardBody}>
                    <div style={styles.cardTop}>
                      <span
                        style={{ ...styles.priorityDot, background: pri.dot }}
                        title={pri.label + " priority"}
                      />
                      <span
                        style={{
                          ...styles.cardTitle,
                          textDecoration: t.done ? "line-through" : "none",
                          opacity: t.done ? 0.55 : 1,
                        }}
                      >
                        {t.title}
                      </span>
                    </div>
                    <div style={styles.cardMeta}>
                      <CalendarDays size={12} />
                      <span
                        style={{
                          color: overdue ? "#B33B2E" : "#8B8272",
                          fontWeight: overdue ? 700 : 400,
                        }}
                      >
                        {overdue ? "overdue · " : ""}
                        {formatDue(t.due)}
                      </span>
                    </div>
                    <div style={styles.cardActions}>
                      <button
                        className="tc-btn"
                        onClick={() => toggleDone(t.id)}
                        style={{
                          ...styles.iconBtn,
                          color: t.done ? "#2F6F62" : "#8B8272",
                        }}
                        title={t.done ? "Reopen" : "Mark filed"}
                      >
                        <Check size={14} />
                      </button>
                      <button
                        className="tc-btn"
                        onClick={() => removeTask(t.id)}
                        style={styles.iconBtn}
                        title="Remove card"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  {t.done && (
                    <div style={styles.stamp}>
                      <span style={styles.stampText}>FILED</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <footer style={styles.footer}>
          <Tag size={12} />
          <span>
            {total} card{total !== 1 ? "s" : ""} in this drawer · {filedCount}{" "}
            filed · {total - filedCount} open
          </span>
        </footer>
      </div>
    </div>
  );
}

const ink = "#2B2621";
const paper = "#F5F0E1";
const kraft = "#3E3226";
const kraftDark = "#241C15";
const muted = "#8B8272";

const styles = {
  page: {
    minHeight: "100vh",
    background: kraft,
    backgroundImage:
      "repeating-linear-gradient(0deg, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 1px, transparent 1px, transparent 3px)",
    padding: "32px 16px",
    fontFamily: "'Source Serif 4', Georgia, serif",
    color: ink,
    display: "flex",
    justifyContent: "center",
  },
  drawer: {
    width: "100%",
    maxWidth: 900,
    background: paper,
    borderRadius: 6,
    boxShadow: "0 12px 0 " + kraftDark + ", 0 12px 24px rgba(0,0,0,0.35)",
    padding: "28px 28px 20px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    borderBottom: `2px solid ${ink}`,
    paddingBottom: 16,
    marginBottom: 20,
    flexWrap: "wrap",
    gap: 12,
  },
  eyebrow: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 11,
    letterSpacing: "0.12em",
    color: muted,
    marginBottom: 4,
  },
  title: {
    fontSize: 34,
    margin: 0,
    fontWeight: 700,
    letterSpacing: "0.02em",
  },
  subtitle: {
    fontSize: 14,
    color: muted,
    fontStyle: "italic",
    marginTop: 2,
  },
  addBtn: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    background: ink,
    color: paper,
    border: "none",
    borderRadius: 3,
    padding: "10px 16px",
    fontFamily: "'Courier Prime', monospace",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: "0.03em",
  },
  formCard: {
    background: "#EAE2CB",
    border: `1px dashed ${muted}`,
    borderRadius: 4,
    padding: 18,
    marginBottom: 20,
  },
  formRow: { marginBottom: 12 },
  formRowSplit: {
    display: "flex",
    gap: 16,
    flexWrap: "wrap",
    marginBottom: 8,
  },
  fieldGroup: { display: "flex", flexDirection: "column", gap: 6 },
  fieldLabel: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 10,
    letterSpacing: "0.08em",
    color: muted,
    textTransform: "uppercase",
  },
  chipRow: { display: "flex", gap: 6, flexWrap: "wrap" },
  chip: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 11,
    padding: "5px 10px",
    borderRadius: 3,
    border: "1.5px solid",
    fontWeight: 700,
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    border: `1.5px solid ${ink}`,
    borderRadius: 3,
    fontSize: 15,
    background: paper,
    color: ink,
  },
  dateInput: {
    padding: "7px 8px",
    border: `1.5px solid ${muted}`,
    borderRadius: 3,
    fontSize: 12,
    fontFamily: "'Courier Prime', monospace",
    background: paper,
    color: ink,
  },
  formError: {
    color: "#B33B2E",
    fontSize: 12,
    marginTop: 6,
    fontFamily: "'Courier Prime', monospace",
  },
  formActions: { marginTop: 12, display: "flex", justifyContent: "flex-end" },
  fileBtn: {
    background: "#2F6F62",
    color: paper,
    border: "none",
    borderRadius: 3,
    padding: "9px 18px",
    fontFamily: "'Courier Prime', monospace",
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: "0.03em",
  },
  toolbar: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 18,
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: `1.5px solid ${muted}`,
    borderRadius: 3,
    padding: "7px 10px",
    background: "#EFE9D8",
    flex: "1 1 200px",
  },
  searchInput: {
    border: "none",
    background: "transparent",
    fontSize: 13,
    flex: 1,
    color: ink,
  },
  filterGroup: { display: "flex", gap: 4 },
  tab: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 11,
    padding: "7px 12px",
    borderRadius: 3,
    border: `1.5px solid ${muted}`,
    color: muted,
    fontWeight: 700,
  },
  tabActive: {
    background: ink,
    color: paper,
    borderColor: ink,
  },
  select: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 11,
    padding: "7px 8px",
    borderRadius: 3,
    border: `1.5px solid ${muted}`,
    background: "#EFE9D8",
    color: ink,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: 14,
    marginBottom: 20,
  },
  card: {
    position: "relative",
    background: "#FCFAF2",
    border: `1px solid #D9CBA3`,
    borderRadius: 4,
    boxShadow: "0 2px 4px rgba(0,0,0,0.12)",
    overflow: "hidden",
  },
  cardTab: {
    fontFamily: "'Courier Prime', monospace",
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.06em",
    color: "#FCFAF2",
    padding: "4px 10px",
    textTransform: "uppercase",
  },
  cardBody: { padding: "12px 14px 10px" },
  cardTop: { display: "flex", alignItems: "flex-start", gap: 8 },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: "50%",
    marginTop: 5,
    flexShrink: 0,
  },
  cardTitle: { fontSize: 15, lineHeight: 1.35 },
  cardMeta: {
    display: "flex",
    alignItems: "center",
    gap: 5,
    fontFamily: "'Courier Prime', monospace",
    fontSize: 11,
    marginTop: 8,
    color: muted,
  },
  cardActions: {
    display: "flex",
    gap: 6,
    marginTop: 10,
    borderTop: "1px solid #E5DAB8",
    paddingTop: 8,
  },
  iconBtn: {
    border: `1px solid #D9CBA3`,
    background: "transparent",
    borderRadius: 3,
    padding: "5px 8px",
    display: "flex",
    alignItems: "center",
  },
  stamp: {
    position: "absolute",
    top: 8,
    right: 8,
    transform: "rotate(-12deg)",
    pointerEvents: "none",
  },
  stampText: {
    display: "inline-block",
    border: "2.5px solid #B33B2E",
    color: "#B33B2E",
    fontFamily: "'Courier Prime', monospace",
    fontWeight: 700,
    fontSize: 12,
    letterSpacing: "0.1em",
    padding: "2px 8px",
    borderRadius: 3,
    opacity: 0.75,
  },
  empty: {
    textAlign: "center",
    padding: "48px 16px",
    color: muted,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: 700,
    marginTop: 10,
    color: ink,
  },
  emptyBody: { fontSize: 13, marginTop: 4 },
  footer: {
    display: "flex",
    alignItems: "center",
    gap: 6,
    fontFamily: "'Courier Prime', monospace",
    fontSize: 11,
    color: muted,
    borderTop: `1px solid #D9CBA3`,
    paddingTop: 12,
  },
};
