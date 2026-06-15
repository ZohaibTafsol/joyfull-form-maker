import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode, type FormEvent } from "react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/dashboard_/payers")({
  head: () => ({
    meta: [
      { title: "Payers — 1099ly Dashboard" },
      { name: "description", content: "Create, edit and manage payer entities (EIN, address, contact) used across your 1099, W-2 and 94x filings." },
      { name: "robots", content: "noindex,follow" },
    ],
    links: [{ rel: "canonical", href: "/dashboard/payers" }],
  }),
  component: PayersPage,
});

type Payer = {
  id: string;
  name: string;
  ein: string;
  type: "Business" | "Individual" | "Non-profit" | "Government";
  email: string;
  phone: string;
  address1: string;
  city: string;
  state: string;
  zip: string;
  forms: number;
  recipients: number;
  status: "Active" | "Draft" | "Archived";
  updated: string;
};

const SEED: Payer[] = [
  { id: "PYR-1001", name: "Northwind Labs LLC", ein: "84-1029384", type: "Business", email: "tax@northwind.io", phone: "(512) 555-0142", address1: "1200 W 6th St", city: "Austin", state: "TX", zip: "78703", forms: 412, recipients: 287, status: "Active", updated: "Today" },
  { id: "PYR-1002", name: "Bluebird Studios Inc.", ein: "27-8847261", type: "Business", email: "ap@bluebird.com", phone: "(415) 555-0188", address1: "88 Folsom St", city: "San Francisco", state: "CA", zip: "94105", forms: 88, recipients: 64, status: "Active", updated: "Today" },
  { id: "PYR-1003", name: "Pinecrest Co-op", ein: "93-4410982", type: "Non-profit", email: "finance@pinecrest.coop", phone: "(503) 555-0119", address1: "440 NE Glisan", city: "Portland", state: "OR", zip: "97232", forms: 1240, recipients: 1240, status: "Active", updated: "Yesterday" },
  { id: "PYR-1004", name: "Harbor Payments", ein: "11-2098374", type: "Business", email: "filings@harborpay.co", phone: "(212) 555-0166", address1: "1 Battery Park Plz", city: "New York", state: "NY", zip: "10004", forms: 22, recipients: 22, status: "Draft", updated: "Yesterday" },
  { id: "PYR-1005", name: "Atlas Health Group", ein: "55-9988772", type: "Business", email: "tax@atlashealth.com", phone: "(312) 555-0177", address1: "200 N LaSalle", city: "Chicago", state: "IL", zip: "60601", forms: 612, recipients: 612, status: "Active", updated: "Jun 09" },
  { id: "PYR-1006", name: "Cedar & Co.", ein: "46-7712098", type: "Individual", email: "hello@cedar.co", phone: "(206) 555-0102", address1: "PO Box 1842", city: "Seattle", state: "WA", zip: "98101", forms: 0, recipients: 0, status: "Archived", updated: "May 28" },
];

const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

const NAV_GROUPS = [
  { label: "Workspace", items: [
    { key: "home", label: "Dashboard", icon: "home", to: "/dashboard" as const },
    { key: "filings", label: "Filings", icon: "file", to: "/dashboard" as const },
    { key: "payers", label: "Payers", icon: "building", to: "/dashboard/payers" as const, badge: "CRUD" },
    { key: "recipients", label: "Recipients", icon: "users", to: "/dashboard" as const },
  ]},
  { label: "eFile", items: [
    { key: "1099", label: "1099 Series", icon: "doc", to: "/dashboard" as const },
    { key: "w2", label: "W-2 / W-3", icon: "doc", to: "/dashboard" as const },
    { key: "94x", label: "94x Payroll", icon: "doc", to: "/dashboard" as const },
    { key: "aca", label: "ACA 1095", icon: "doc", to: "/dashboard" as const },
    { key: "state", label: "State Filing", icon: "map", to: "/dashboard" as const },
  ]},
  { label: "Tools", items: [
    { key: "tin", label: "TIN Matching", icon: "shield", to: "/dashboard" as const },
    { key: "import", label: "Bulk Import", icon: "upload", to: "/dashboard" as const },
    { key: "integrations", label: "Integrations", icon: "plug", to: "/dashboard" as const },
    { key: "reports", label: "Reports", icon: "chart", to: "/dashboard" as const },
  ]},
];

function Icon({ name, className = "size-4" }: { name: string; className?: string }) {
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, ReactNode> = {
    home: <><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /></>,
    file: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /></>,
    doc: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /><path d="M9 14h6M9 17h4" /></>,
    building: <><path d="M4 21V5l8-2v18" /><path d="M12 9h8v12h-8" /><path d="M7 8v.01M7 12v.01M7 16v.01" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3 3-5 6-5s6 2 6 5" /><circle cx="17" cy="9" r="2.5" /><path d="M15 20c0-2.5 2-4 4-4s2.5 1 2.5 2.5" /></>,
    map: <><path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14M15 6v14" /></>,
    shield: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" /></>,
    upload: <><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M4 17v3h16v-3" /></>,
    plug: <><path d="M9 3v6M15 3v6" /><path d="M7 9h10v4a5 5 0 0 1-10 0z" /><path d="M12 18v3" /></>,
    chart: <><path d="M4 20h16" /><path d="M6 16V9M11 16V5M16 16v-6" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    bell: <><path d="M6 16V11a6 6 0 1 1 12 0v5l2 3H4z" /><path d="M10 21a2 2 0 0 0 4 0" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    chevron: <><path d="m9 6 6 6-6 6" /></>,
    download: <><path d="M12 4v12" /><path d="m7 11 5 5 5-5" /><path d="M4 20h16" /></>,
    filter: <><path d="M4 5h16l-6 8v6l-4-2v-4z" /></>,
    edit: <><path d="m4 20 4-1 11-11-3-3L5 16z" /><path d="m14 6 3 3" /></>,
    trash: <><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /><path d="M10 11v6M14 11v6" /></>,
    close: <><path d="M6 6l12 12M18 6 6 18" /></>,
    more: <><circle cx="5" cy="12" r="1.3" /><circle cx="12" cy="12" r="1.3" /><circle cx="19" cy="12" r="1.3" /></>,
    check: <><path d="m5 12 5 5L20 6" /></>,
  };
  return <svg viewBox="0 0 24 24" className={className} {...stroke}>{paths[name] ?? null}</svg>;
}

function statusStyle(s: Payer["status"]) {
  switch (s) {
    case "Active": return "bg-brand-accent/15 text-brand-primary ring-brand-accent/30";
    case "Draft": return "bg-amber-50 text-amber-700 ring-amber-200";
    case "Archived": return "bg-neutral-100 text-neutral-500 ring-neutral-200";
  }
}

const EMPTY: Payer = {
  id: "", name: "", ein: "", type: "Business", email: "", phone: "",
  address1: "", city: "", state: "TX", zip: "", forms: 0, recipients: 0,
  status: "Draft", updated: "Today",
};

function formatEin(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 9);
  return d.length > 2 ? `${d.slice(0, 2)}-${d.slice(2)}` : d;
}

function PayersPage() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const [payers, setPayers] = useState<Payer[]>(SEED);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"All" | Payer["status"]>("All");
  const [sortKey, setSortKey] = useState<"name" | "forms" | "updated">("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Payer | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Payer | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = payers.filter((p) => {
      if (statusFilter !== "All" && p.status !== statusFilter) return false;
      if (!q) return true;
      return [p.name, p.ein, p.email, p.city, p.state, p.id].some((f) => f.toLowerCase().includes(q));
    });
    list = [...list].sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortKey === "forms") return (a.forms - b.forms) * dir;
      if (sortKey === "updated") return a.updated.localeCompare(b.updated) * dir;
      return a.name.localeCompare(b.name) * dir;
    });
    return list;
  }, [payers, query, statusFilter, sortKey, sortDir]);

  const counts = useMemo(() => ({
    All: payers.length,
    Active: payers.filter((p) => p.status === "Active").length,
    Draft: payers.filter((p) => p.status === "Draft").length,
    Archived: payers.filter((p) => p.status === "Archived").length,
  }), [payers]);

  const flash = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const toggleSort = (k: typeof sortKey) => {
    if (sortKey === k) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(k); setSortDir("asc"); }
  };

  const allChecked = filtered.length > 0 && filtered.every((p) => selected.has(p.id));
  const toggleAll = () => {
    if (allChecked) setSelected(new Set());
    else setSelected(new Set(filtered.map((p) => p.id)));
  };
  const toggleOne = (id: string) => {
    const n = new Set(selected);
    n.has(id) ? n.delete(id) : n.add(id);
    setSelected(n);
  };

  const openNew = () => setEditing({ ...EMPTY });
  const openEdit = (p: Payer) => setEditing({ ...p });

  const savePayer = (p: Payer) => {
    if (p.id) {
      setPayers((prev) => prev.map((x) => (x.id === p.id ? { ...p, updated: "Just now" } : x)));
      flash(`Payer "${p.name}" updated`);
    } else {
      const id = `PYR-${1000 + payers.length + 1}`;
      setPayers((prev) => [{ ...p, id, updated: "Just now" }, ...prev]);
      flash(`Payer "${p.name}" created`);
    }
    setEditing(null);
  };

  const deletePayer = (p: Payer) => {
    setPayers((prev) => prev.filter((x) => x.id !== p.id));
    setSelected((prev) => { const n = new Set(prev); n.delete(p.id); return n; });
    setConfirmDelete(null);
    flash(`Payer "${p.name}" deleted`);
  };

  const bulkDelete = () => {
    setPayers((prev) => prev.filter((x) => !selected.has(x.id)));
    flash(`${selected.size} payer${selected.size === 1 ? "" : "s"} deleted`);
    setSelected(new Set());
  };

  return (
    <div className="min-h-screen bg-neutral-100 font-sans text-neutral-900 selection:bg-brand-accent/30">
      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`sticky top-0 hidden h-screen shrink-0 border-r border-neutral-200 bg-white transition-[width] duration-200 md:flex md:flex-col ${
            collapsed ? "w-[72px]" : "w-[260px]"
          }`}
        >
          <div className="flex h-16 items-center justify-between px-4">
            <Link to="/" aria-label="1099ly home" className="overflow-hidden">
              {collapsed ? (
                <span className="grid size-8 place-items-center rounded-[10px] bg-brand-primary text-white">
                  <Icon name="file" />
                </span>
              ) : (
                <Logo />
              )}
            </Link>
            <button
              onClick={() => setCollapsed((v) => !v)}
              aria-label="Toggle sidebar"
              className="grid size-7 place-items-center rounded-md text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700"
            >
              <Icon name="chevron" className={`size-3.5 transition-transform ${collapsed ? "" : "rotate-180"}`} />
            </button>
          </div>

          <div className="px-3">
            <button
              onClick={openNew}
              className="flex w-full items-center gap-2 rounded-xl bg-brand-primary px-3 py-2.5 text-sm font-medium text-white shadow-sm shadow-brand-primary/20 transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <Icon name="plus" />
              {!collapsed && <span>New payer</span>}
            </button>
          </div>

          <nav className="mt-4 flex-1 overflow-y-auto px-2 pb-6">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="mt-4 first:mt-0">
                {!collapsed && (
                  <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">{group.label}</p>
                )}
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = item.key === "payers";
                    return (
                      <li key={item.key}>
                        <button
                          onClick={() => navigate({ to: item.to })}
                          className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                            isActive
                              ? "bg-brand-primary/8 text-brand-primary"
                              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                          }`}
                        >
                          <Icon name={item.icon} className={`size-4 ${isActive ? "text-brand-primary" : "text-neutral-400 group-hover:text-neutral-600"}`} />
                          {!collapsed && (
                            <>
                              <span className="flex-1 text-left">{item.label}</span>
                              {"badge" in item && item.badge && (
                                <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset ${
                                  isActive ? "bg-white text-brand-primary ring-brand-accent/30" : "bg-neutral-100 text-neutral-500 ring-neutral-200"
                                }`}>{item.badge}</span>
                              )}
                            </>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-neutral-200 bg-white/85 px-6 backdrop-blur-md">
            <div className="flex flex-1 items-center gap-3">
              <div className="hidden items-center gap-1.5 text-xs text-neutral-500 md:flex">
                <Link to="/dashboard" className="hover:text-neutral-800">Workspace</Link>
                <Icon name="chevron" className="size-3 text-neutral-300" />
                <span className="font-medium text-neutral-700">Northwind Labs</span>
                <Icon name="chevron" className="size-3 text-neutral-300" />
                <span className="text-neutral-500">Payers</span>
              </div>
              <div className="relative ml-auto w-full max-w-md">
                <Icon name="search" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search payers by name, EIN, email, city…"
                  className="h-9 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-9 pr-14 text-sm placeholder:text-neutral-400 focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/15"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative grid size-9 place-items-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800">
                <Icon name="bell" />
              </button>
              <div className="hidden h-6 w-px bg-neutral-200 sm:block" />
              <div className="flex items-center gap-2 rounded-lg p-1 pr-3 hover:bg-neutral-100">
                <span className="grid size-7 place-items-center rounded-md bg-brand-primary font-display text-sm text-white">A</span>
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-medium leading-none text-neutral-800">Avery Chen</p>
                  <p className="mt-0.5 text-[10px] text-neutral-500">Admin · Northwind</p>
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 px-6 py-8">
            {/* Heading */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-primary/70">Workspace</p>
                <h1 className="mt-2 font-display text-4xl tracking-tight text-neutral-900 md:text-5xl">Payers</h1>
                <p className="mt-2 max-w-xl text-sm text-neutral-500">
                  Manage the legal entities that issue your 1099, W-2 and 94x forms. Keep EINs, addresses and contacts in one place.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                  <Icon name="download" /> Export
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                  <Icon name="upload" /> Import CSV
                </button>
                <button
                  onClick={openNew}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-3.5 py-2 text-sm font-medium text-white ring-1 ring-brand-primary hover:opacity-95"
                >
                  <Icon name="plus" /> New payer
                </button>
              </div>
            </div>

            {/* Stat strip */}
            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                { label: "Total payers", value: counts.All, hint: "across all entities" },
                { label: "Active", value: counts.Active, hint: "ready to file" },
                { label: "Drafts", value: counts.Draft, hint: "need review" },
                { label: "Archived", value: counts.Archived, hint: "hidden from filings" },
              ].map((k) => (
                <div key={k.label} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm shadow-neutral-900/[0.02]">
                  <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">{k.label}</p>
                  <p className="mt-3 font-display text-4xl tracking-tight text-neutral-900 tabular-nums">{k.value}</p>
                  <p className="mt-1 text-xs text-neutral-500">{k.hint}</p>
                </div>
              ))}
            </section>

            {/* Table card */}
            <section className="mt-6 rounded-2xl border border-neutral-200 bg-white shadow-sm shadow-neutral-900/[0.02]">
              {/* Toolbar */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-6 py-4">
                <div className="flex flex-wrap items-center gap-1 rounded-lg bg-neutral-100 p-0.5 text-xs">
                  {(["All","Active","Draft","Archived"] as const).map((s) => (
                    <button
                      key={s}
                      onClick={() => setStatusFilter(s)}
                      className={`rounded-md px-3 py-1.5 font-medium transition-colors ${
                        statusFilter === s ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      {s} <span className="ml-1 text-neutral-400">{counts[s]}</span>
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {selected.size > 0 ? (
                    <>
                      <span className="text-xs text-neutral-500">{selected.size} selected</span>
                      <button
                        onClick={bulkDelete}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs font-medium text-rose-700 hover:bg-rose-100"
                      >
                        <Icon name="trash" className="size-3.5" /> Delete
                      </button>
                    </>
                  ) : (
                    <button className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50">
                      <Icon name="filter" className="size-3.5" /> Filter
                    </button>
                  )}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      <th className="w-10 px-6 py-3">
                        <input type="checkbox" checked={allChecked} onChange={toggleAll} className="size-3.5 rounded border-neutral-300 text-brand-primary focus:ring-brand-primary/30" />
                      </th>
                      <th className="px-2 py-3">
                        <button onClick={() => toggleSort("name")} className="inline-flex items-center gap-1 hover:text-neutral-700">
                          Payer {sortKey === "name" && <Icon name="chevron" className={`size-3 ${sortDir === "asc" ? "-rotate-90" : "rotate-90"}`} />}
                        </button>
                      </th>
                      <th className="px-2 py-3">EIN / Type</th>
                      <th className="px-2 py-3">Contact</th>
                      <th className="px-2 py-3">Location</th>
                      <th className="px-2 py-3 text-right">
                        <button onClick={() => toggleSort("forms")} className="inline-flex items-center gap-1 hover:text-neutral-700">
                          Forms {sortKey === "forms" && <Icon name="chevron" className={`size-3 ${sortDir === "asc" ? "-rotate-90" : "rotate-90"}`} />}
                        </button>
                      </th>
                      <th className="px-2 py-3">Status</th>
                      <th className="px-2 py-3">
                        <button onClick={() => toggleSort("updated")} className="inline-flex items-center gap-1 hover:text-neutral-700">
                          Updated {sortKey === "updated" && <Icon name="chevron" className={`size-3 ${sortDir === "asc" ? "-rotate-90" : "rotate-90"}`} />}
                        </button>
                      </th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-6 py-16 text-center">
                          <div className="mx-auto max-w-sm">
                            <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-brand-primary/8 text-brand-primary">
                              <Icon name="building" className="size-6" />
                            </div>
                            <p className="mt-3 font-display text-xl tracking-tight text-neutral-900">No payers found</p>
                            <p className="mt-1 text-sm text-neutral-500">Try adjusting your search or filters, or create your first payer.</p>
                            <button onClick={openNew} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-primary px-3 py-2 text-xs font-medium text-white">
                              <Icon name="plus" className="size-3.5" /> New payer
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                    {filtered.map((p) => {
                      const checked = selected.has(p.id);
                      return (
                        <tr key={p.id} className={`border-b border-neutral-50 last:border-0 transition-colors ${checked ? "bg-brand-accent/5" : "hover:bg-neutral-50/60"}`}>
                          <td className="px-6 py-3 align-top">
                            <input type="checkbox" checked={checked} onChange={() => toggleOne(p.id)} className="size-3.5 rounded border-neutral-300 text-brand-primary focus:ring-brand-primary/30" />
                          </td>
                          <td className="px-2 py-3">
                            <div className="flex items-center gap-3">
                              <span className="grid size-9 place-items-center rounded-lg bg-brand-primary/8 font-display text-sm font-medium text-brand-primary">
                                {p.name.slice(0, 1)}
                              </span>
                              <div className="min-w-0">
                                <p className="truncate font-medium text-neutral-900">{p.name}</p>
                                <p className="truncate font-mono text-[11px] text-neutral-400">{p.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-3">
                            <p className="font-mono text-xs text-neutral-700">{p.ein}</p>
                            <p className="text-[11px] text-neutral-500">{p.type}</p>
                          </td>
                          <td className="px-2 py-3">
                            <p className="truncate text-xs text-neutral-700">{p.email}</p>
                            <p className="text-[11px] text-neutral-500">{p.phone}</p>
                          </td>
                          <td className="px-2 py-3">
                            <p className="text-xs text-neutral-700">{p.city}, {p.state}</p>
                            <p className="text-[11px] text-neutral-500">{p.zip}</p>
                          </td>
                          <td className="px-2 py-3 text-right tabular-nums">
                            <p className="font-medium text-neutral-900">{p.forms.toLocaleString()}</p>
                            <p className="text-[11px] text-neutral-500">{p.recipients.toLocaleString()} recip.</p>
                          </td>
                          <td className="px-2 py-3">
                            <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${statusStyle(p.status)}`}>
                              <span className="size-1.5 rounded-full bg-current" />
                              {p.status}
                            </span>
                          </td>
                          <td className="px-2 py-3 text-neutral-500">{p.updated}</td>
                          <td className="px-6 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => openEdit(p)} title="Edit" className="grid size-7 place-items-center rounded-md text-neutral-500 hover:bg-brand-primary/8 hover:text-brand-primary">
                                <Icon name="edit" className="size-3.5" />
                              </button>
                              <button onClick={() => setConfirmDelete(p)} title="Delete" className="grid size-7 place-items-center rounded-md text-neutral-500 hover:bg-rose-50 hover:text-rose-600">
                                <Icon name="trash" className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between px-6 py-3 text-xs text-neutral-500">
                <span>Showing {filtered.length} of {payers.length}</span>
                <div className="flex items-center gap-1">
                  <button className="rounded-md border border-neutral-200 px-2 py-1 hover:bg-neutral-50">Prev</button>
                  <button className="rounded-md border border-neutral-200 bg-neutral-900 px-2 py-1 text-white">1</button>
                  <button className="rounded-md border border-neutral-200 px-2 py-1 hover:bg-neutral-50">Next</button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      {/* Edit / Create drawer */}
      {editing && (
        <PayerDrawer
          payer={editing}
          onClose={() => setEditing(null)}
          onSave={savePayer}
        />
      )}

      {/* Delete confirm */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-900/40 backdrop-blur-sm p-4" onClick={() => setConfirmDelete(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="grid size-11 place-items-center rounded-xl bg-rose-50 text-rose-600">
              <Icon name="trash" />
            </div>
            <h3 className="mt-4 font-display text-2xl tracking-tight">Delete payer?</h3>
            <p className="mt-1 text-sm text-neutral-500">
              <span className="font-medium text-neutral-800">{confirmDelete.name}</span> will be removed.
              This cannot be undone and may affect linked filings.
            </p>
            <div className="mt-5 flex items-center justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                Cancel
              </button>
              <button onClick={() => deletePayer(confirmDelete)} className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700">
                Delete payer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm text-white shadow-xl">
            <Icon name="check" className="size-4 text-brand-accent" />
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}

function PayerDrawer({ payer, onClose, onSave }: { payer: Payer; onClose: () => void; onSave: (p: Payer) => void }) {
  const [form, setForm] = useState<Payer>(payer);
  const [errors, setErrors] = useState<Partial<Record<keyof Payer, string>>>({});
  const isEdit = !!payer.id;

  const set = <K extends keyof Payer>(k: K, v: Payer[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Partial<Record<keyof Payer, string>> = {};
    if (!form.name.trim()) er.name = "Required";
    if (!/^\d{2}-\d{7}$/.test(form.ein)) er.ein = "Format: 12-3456789";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = "Invalid email";
    if (!form.city.trim()) er.city = "Required";
    if (!/^\d{5}(-\d{4})?$/.test(form.zip)) er.zip = "Invalid ZIP";
    setErrors(er);
    if (Object.keys(er).length) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-900/40 backdrop-blur-sm" onClick={onClose}>
      <form
        onSubmit={submit}
        onClick={(e) => e.stopPropagation()}
        className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-primary/70">{isEdit ? "Edit payer" : "New payer"}</p>
            <h2 className="mt-1 font-display text-2xl tracking-tight">{isEdit ? form.name || "Untitled payer" : "Create a payer"}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-8 place-items-center rounded-lg text-neutral-500 hover:bg-neutral-100">
            <Icon name="close" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          <Section title="Entity">
            <Field label="Legal name" error={errors.name} className="col-span-2">
              <input value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Acme Holdings LLC" className={inputCls} />
            </Field>
            <Field label="EIN" error={errors.ein}>
              <input value={form.ein} onChange={(e) => set("ein", formatEin(e.target.value))} placeholder="12-3456789" className={`${inputCls} font-mono`} />
            </Field>
            <Field label="Entity type">
              <select value={form.type} onChange={(e) => set("type", e.target.value as Payer["type"])} className={inputCls}>
                <option>Business</option><option>Individual</option><option>Non-profit</option><option>Government</option>
              </select>
            </Field>
          </Section>

          <Section title="Contact">
            <Field label="Email" error={errors.email}>
              <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="tax@acme.com" className={inputCls} />
            </Field>
            <Field label="Phone">
              <input value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(555) 555-0100" className={inputCls} />
            </Field>
          </Section>

          <Section title="Address">
            <Field label="Street" className="col-span-2">
              <input value={form.address1} onChange={(e) => set("address1", e.target.value)} placeholder="1200 Main St" className={inputCls} />
            </Field>
            <Field label="City" error={errors.city}>
              <input value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls} />
            </Field>
            <Field label="State">
              <select value={form.state} onChange={(e) => set("state", e.target.value)} className={inputCls}>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="ZIP" error={errors.zip}>
              <input value={form.zip} onChange={(e) => set("zip", e.target.value)} placeholder="78703" className={inputCls} />
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={(e) => set("status", e.target.value as Payer["status"])} className={inputCls}>
                <option>Active</option><option>Draft</option><option>Archived</option>
              </select>
            </Field>
          </Section>
        </div>

        <footer className="flex items-center justify-between border-t border-neutral-100 px-6 py-4">
          <p className="text-xs text-neutral-500">{isEdit ? `ID ${form.id}` : "A new payer ID will be generated."}</p>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onClose} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
              Cancel
            </button>
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-3.5 py-2 text-sm font-medium text-white hover:opacity-95">
              <Icon name="check" className="size-4" /> {isEdit ? "Save changes" : "Create payer"}
            </button>
          </div>
        </footer>
      </form>
    </div>
  );
}

const inputCls = "h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/15";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8 last:mb-0">
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">{title}</h3>
      <div className="grid grid-cols-2 gap-4">{children}</div>
    </section>
  );
}

function Field({ label, error, className = "", children }: { label: string; error?: string; className?: string; children: ReactNode }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-xs font-medium text-neutral-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[11px] text-rose-600">{error}</span>}
    </label>
  );
}