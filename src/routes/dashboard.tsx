import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — 1099ly" },
      { name: "description", content: "Manage your 1099, W-2, 94x and ACA filings, payers, recipients and integrations from your 1099ly dashboard." },
      { name: "robots", content: "noindex,follow" },
    ],
    links: [{ rel: "canonical", href: "/dashboard" }],
  }),
  component: DashboardPage,
});

const NAV_GROUPS = [
  {
    label: "Workspace",
    items: [
      { key: "home", label: "Dashboard", icon: "home", badge: null as string | null },
      { key: "filings", label: "Filings", icon: "file", badge: "12" },
      { key: "payers", label: "Payers", icon: "building", badge: null },
      { key: "recipients", label: "Recipients", icon: "users", badge: null },
    ],
  },
  {
    label: "eFile",
    items: [
      { key: "1099", label: "1099 Series", icon: "doc", badge: "NEC · MISC · K" },
      { key: "w2", label: "W-2 / W-3", icon: "doc", badge: null },
      { key: "94x", label: "94x Payroll", icon: "doc", badge: null },
      { key: "aca", label: "ACA 1095", icon: "doc", badge: null },
      { key: "1042", label: "1042 / 1042-S", icon: "doc", badge: null },
      { key: "state", label: "State Filing", icon: "map", badge: "50" },
    ],
  },
  {
    label: "Tools",
    items: [
      { key: "tin", label: "TIN Matching", icon: "shield", badge: null },
      { key: "import", label: "Bulk Import", icon: "upload", badge: null },
      { key: "integrations", label: "Integrations", icon: "plug", badge: "9" },
      { key: "api", label: "Developer API", icon: "code", badge: null },
      { key: "reports", label: "Reports", icon: "chart", badge: null },
    ],
  },
  {
    label: "Account",
    items: [
      { key: "billing", label: "Billing", icon: "card", badge: null },
      { key: "team", label: "Team", icon: "team", badge: null },
      { key: "settings", label: "Settings", icon: "cog", badge: null },
    ],
  },
] as const;

const KPIS = [
  { label: "Forms filed YTD", value: "12,847", delta: "+18.2%", trend: "up" as const, hint: "vs. last tax year" },
  { label: "In review", value: "342", delta: "−4.1%", trend: "down" as const, hint: "queued for IRS submission" },
  { label: "Rejected", value: "11", delta: "0.08%", trend: "flat" as const, hint: "auto-corrections available" },
  { label: "Recipients", value: "3,901", delta: "+126", trend: "up" as const, hint: "new this quarter" },
];

const RECENT = [
  { id: "FX-22091", form: "1099-NEC", payer: "Northwind Labs LLC", recipients: 412, state: "TX", status: "Accepted", date: "Today, 09:14" },
  { id: "FX-22090", form: "1099-MISC", payer: "Bluebird Studios Inc.", recipients: 88, state: "CA", status: "Transmitted", date: "Today, 08:42" },
  { id: "FX-22089", form: "W-2", payer: "Pinecrest Co-op", recipients: 1240, state: "OR", status: "In review", date: "Yesterday" },
  { id: "FX-22088", form: "1099-K", payer: "Harbor Payments", recipients: 22, state: "NY", status: "Action needed", date: "Yesterday" },
  { id: "FX-22087", form: "1095-C", payer: "Atlas Health Group", recipients: 612, state: "Multi", status: "Accepted", date: "Jun 09" },
  { id: "FX-22086", form: "941", payer: "Northwind Labs LLC", recipients: 1, state: "TX", status: "Accepted", date: "Jun 09" },
];

const DEADLINES = [
  { form: "1099-NEC", desc: "Recipient & IRS copies", date: "Jan 31", days: 38 },
  { form: "W-2 / W-3", desc: "SSA submission", date: "Jan 31", days: 38 },
  { form: "1099-MISC", desc: "IRS eFile", date: "Mar 31", days: 97 },
  { form: "1042-S", desc: "IRS eFile", date: "Mar 17", days: 83 },
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
    shield: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z" /><path d="m9 12 2 2 4-4" /></>,
    upload: <><path d="M12 16V4" /><path d="m7 9 5-5 5 5" /><path d="M4 17v3h16v-3" /></>,
    plug: <><path d="M9 3v6M15 3v6" /><path d="M7 9h10v4a5 5 0 0 1-10 0z" /><path d="M12 18v3" /></>,
    code: <><path d="m8 8-4 4 4 4" /><path d="m16 8 4 4-4 4" /><path d="m14 6-4 12" /></>,
    chart: <><path d="M4 20h16" /><path d="M6 16V9M11 16V5M16 16v-6" /></>,
    card: <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18M7 15h4" /></>,
    team: <><circle cx="12" cy="8" r="3" /><path d="M5 20c1-4 4-6 7-6s6 2 7 6" /></>,
    cog: <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    bell: <><path d="M6 16V11a6 6 0 1 1 12 0v5l2 3H4z" /><path d="M10 21a2 2 0 0 0 4 0" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    chevron: <><path d="m9 6 6 6-6 6" /></>,
    download: <><path d="M12 4v12" /><path d="m7 11 5 5 5-5" /><path d="M4 20h16" /></>,
    filter: <><path d="M4 5h16l-6 8v6l-4-2v-4z" /></>,
    sparkle: <><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l3 3M15 15l3 3M6 18l3-3M15 9l3-3" /></>,
  };
  return <svg viewBox="0 0 24 24" className={className} {...stroke}>{paths[name] ?? null}</svg>;
}

function statusStyle(s: string) {
  switch (s) {
    case "Accepted": return "bg-brand-accent/15 text-brand-primary ring-brand-accent/30";
    case "Transmitted": return "bg-blue-50 text-blue-700 ring-blue-200";
    case "In review": return "bg-amber-50 text-amber-700 ring-amber-200";
    case "Action needed": return "bg-rose-50 text-rose-700 ring-rose-200";
    default: return "bg-neutral-100 text-neutral-700 ring-neutral-200";
  }
}

function DashboardPage() {
  const [active, setActive] = useState("home");
  const [collapsed, setCollapsed] = useState(false);

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
            <button className="flex w-full items-center gap-2 rounded-xl bg-brand-primary px-3 py-2.5 text-sm font-medium text-white shadow-sm shadow-brand-primary/20 transition-transform hover:scale-[1.01] active:scale-[0.99]">
              <Icon name="plus" />
              {!collapsed && <span>New filing</span>}
            </button>
          </div>

          <nav className="mt-4 flex-1 overflow-y-auto px-2 pb-6">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="mt-4 first:mt-0">
                {!collapsed && (
                  <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                    {group.label}
                  </p>
                )}
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = active === item.key;
                    return (
                      <li key={item.key}>
                        <button
                          onClick={() => setActive(item.key)}
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
                              {item.badge && (
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

          {!collapsed && (
            <div className="m-3 rounded-xl border border-brand-accent/30 bg-gradient-to-br from-brand-primary to-brand-primary/80 p-4 text-white">
              <div className="flex items-center gap-2">
                <Icon name="sparkle" className="size-4" />
                <p className="text-xs font-semibold uppercase tracking-wider">Pro tip</p>
              </div>
              <p className="mt-2 font-display text-lg leading-tight">Bulk import 10k forms in under a minute.</p>
              <button className="mt-3 inline-flex items-center gap-1 rounded-md bg-white/15 px-2.5 py-1 text-xs font-medium ring-1 ring-white/20 hover:bg-white/25">
                Try import <Icon name="chevron" className="size-3" />
              </button>
            </div>
          )}
        </aside>

        {/* Main */}
        <div className="flex min-w-0 flex-1 flex-col">
          {/* Topbar */}
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-neutral-200 bg-white/85 px-6 backdrop-blur-md">
            <div className="flex flex-1 items-center gap-3">
              <div className="hidden items-center gap-1.5 text-xs text-neutral-500 md:flex">
                <span>Workspace</span>
                <Icon name="chevron" className="size-3 text-neutral-300" />
                <span className="font-medium text-neutral-700">Northwind Labs</span>
                <Icon name="chevron" className="size-3 text-neutral-300" />
                <span className="text-neutral-500">Dashboard</span>
              </div>
              <div className="relative ml-auto w-full max-w-md">
                <Icon name="search" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="search"
                  placeholder="Search filings, payers, recipients, TINs…"
                  className="h-9 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-9 pr-14 text-sm placeholder:text-neutral-400 focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/15"
                />
                <kbd className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded border border-neutral-200 bg-white px-1.5 py-0.5 font-mono text-[10px] text-neutral-400 md:block">⌘K</kbd>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="relative grid size-9 place-items-center rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800">
                <Icon name="bell" />
                <span className="absolute right-2 top-2 size-1.5 rounded-full bg-rose-500" />
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
            {/* Page heading */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-primary/70">Tax Year 2025</p>
                <h1 className="mt-2 font-display text-4xl tracking-tight text-neutral-900 md:text-5xl">
                  Welcome back, <span className="italic">Avery.</span>
                </h1>
                <p className="mt-2 max-w-xl text-sm text-neutral-500">
                  38 days until the 1099-NEC deadline. Your queue is healthy — 11 filings need attention.
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                  <Icon name="download" /> Export
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
                  <Icon name="upload" /> Import CSV
                </button>
                <button className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-3.5 py-2 text-sm font-medium text-white ring-1 ring-brand-primary hover:opacity-95">
                  <Icon name="plus" /> New filing
                </button>
              </div>
            </div>

            {/* KPIs */}
            <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {KPIS.map((k) => (
                <div key={k.label} className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm shadow-neutral-900/[0.02]">
                  <div className="flex items-start justify-between">
                    <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">{k.label}</p>
                    <span className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold ring-1 ring-inset ${
                      k.trend === "up" ? "bg-brand-accent/15 text-brand-primary ring-brand-accent/30"
                      : k.trend === "down" ? "bg-rose-50 text-rose-700 ring-rose-200"
                      : "bg-neutral-100 text-neutral-600 ring-neutral-200"
                    }`}>{k.delta}</span>
                  </div>
                  <p className="mt-3 font-display text-4xl tracking-tight text-neutral-900">{k.value}</p>
                  <p className="mt-1 text-xs text-neutral-500">{k.hint}</p>
                </div>
              ))}
            </section>

            {/* Grid: chart + deadlines */}
            <section className="mt-6 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm shadow-neutral-900/[0.02] lg:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-display text-2xl tracking-tight">Filing volume</h2>
                    <p className="text-xs text-neutral-500">Forms transmitted in the last 12 weeks</p>
                  </div>
                  <div className="flex rounded-lg bg-neutral-100 p-0.5 text-xs">
                    {["12W", "QTD", "YTD"].map((t, i) => (
                      <button key={t} className={`rounded-md px-3 py-1.5 font-medium ${i === 0 ? "bg-white text-neutral-900 shadow-sm" : "text-neutral-500"}`}>{t}</button>
                    ))}
                  </div>
                </div>
                {/* Bar chart */}
                <div className="mt-6 flex h-56 items-end gap-2">
                  {[28, 42, 36, 58, 71, 49, 84, 92, 67, 110, 96, 134].map((v, i) => (
                    <div key={i} className="group relative flex flex-1 flex-col items-center gap-2">
                      <div className="relative w-full overflow-hidden rounded-t-md bg-neutral-100">
                        <div
                          className="w-full bg-gradient-to-t from-brand-primary to-brand-accent transition-all"
                          style={{ height: `${v * 1.4}px` }}
                        />
                      </div>
                      <span className="text-[10px] text-neutral-400">W{i + 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm shadow-neutral-900/[0.02]">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl tracking-tight">Deadlines</h2>
                  <button className="text-xs font-medium text-brand-primary hover:underline">View all</button>
                </div>
                <ul className="mt-4 space-y-3">
                  {DEADLINES.map((d) => (
                    <li key={d.form} className="flex items-center gap-3 rounded-xl border border-neutral-100 p-3 hover:border-brand-accent/40 hover:bg-brand-accent/5">
                      <div className="grid size-11 place-items-center rounded-lg bg-brand-primary/8 text-center">
                        <span className="font-display text-base leading-none text-brand-primary">{d.date.split(" ")[1]}</span>
                        <span className="text-[9px] font-semibold uppercase tracking-wider text-brand-primary/70">{d.date.split(" ")[0]}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-neutral-900">{d.form}</p>
                        <p className="truncate text-xs text-neutral-500">{d.desc}</p>
                      </div>
                      <span className="text-xs font-medium text-neutral-400">{d.days}d</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Recent filings table */}
            <section className="mt-6 rounded-2xl border border-neutral-200 bg-white shadow-sm shadow-neutral-900/[0.02]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-100 px-6 py-4">
                <div>
                  <h2 className="font-display text-2xl tracking-tight">Recent filings</h2>
                  <p className="text-xs text-neutral-500">All payers · last 7 days</p>
                </div>
                <div className="flex items-center gap-2">
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50">
                    <Icon name="filter" className="size-3.5" /> Filter
                  </button>
                  <button className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-200 px-2.5 py-1.5 text-xs font-medium text-neutral-600 hover:bg-neutral-50">
                    All forms <Icon name="chevron" className="size-3 rotate-90" />
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      <th className="px-6 py-3">Reference</th>
                      <th className="px-6 py-3">Form</th>
                      <th className="px-6 py-3">Payer</th>
                      <th className="px-6 py-3 text-right">Recipients</th>
                      <th className="px-6 py-3">State</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Submitted</th>
                      <th className="px-6 py-3" />
                    </tr>
                  </thead>
                  <tbody>
                    {RECENT.map((r) => (
                      <tr key={r.id} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60">
                        <td className="px-6 py-3 font-mono text-xs text-neutral-500">{r.id}</td>
                        <td className="px-6 py-3">
                          <span className="rounded-md bg-neutral-100 px-2 py-0.5 font-mono text-[11px] font-medium text-neutral-700">{r.form}</span>
                        </td>
                        <td className="px-6 py-3 font-medium text-neutral-800">{r.payer}</td>
                        <td className="px-6 py-3 text-right tabular-nums">{r.recipients.toLocaleString()}</td>
                        <td className="px-6 py-3 text-neutral-600">{r.state}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${statusStyle(r.status)}`}>
                            <span className="size-1.5 rounded-full bg-current" />
                            {r.status}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-neutral-500">{r.date}</td>
                        <td className="px-6 py-3 text-right">
                          <button className="text-xs font-medium text-brand-primary hover:underline">Open</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between px-6 py-3 text-xs text-neutral-500">
                <span>Showing 6 of 12,847</span>
                <div className="flex items-center gap-1">
                  <button className="rounded-md border border-neutral-200 px-2 py-1 hover:bg-neutral-50">Prev</button>
                  <button className="rounded-md border border-neutral-200 bg-neutral-900 px-2 py-1 text-white">1</button>
                  <button className="rounded-md border border-neutral-200 px-2 py-1 hover:bg-neutral-50">2</button>
                  <button className="rounded-md border border-neutral-200 px-2 py-1 hover:bg-neutral-50">Next</button>
                </div>
              </div>
            </section>

            {/* Quick actions + integrations */}
            <section className="mt-6 grid gap-4 lg:grid-cols-3">
              <div className="rounded-2xl border border-neutral-200 bg-white p-6 lg:col-span-2">
                <h2 className="font-display text-2xl tracking-tight">Quick actions</h2>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {[
                    { t: "Match TINs in bulk", d: "Upload a CSV and verify against IRS records in seconds.", i: "shield" },
                    { t: "Invite a teammate", d: "Add accountants, reviewers or read-only collaborators.", i: "team" },
                    { t: "Connect QuickBooks", d: "Sync vendors and 1099 amounts automatically.", i: "plug" },
                    { t: "Set up state filing", d: "Combined Federal/State + direct state submissions.", i: "map" },
                  ].map((a) => (
                    <button key={a.t} className="group flex items-start gap-3 rounded-xl border border-neutral-100 p-4 text-left transition-colors hover:border-brand-accent/40 hover:bg-brand-accent/5">
                      <span className="grid size-9 place-items-center rounded-lg bg-brand-primary/8 text-brand-primary">
                        <Icon name={a.i} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900">{a.t}</p>
                        <p className="mt-0.5 text-xs leading-relaxed text-neutral-500">{a.d}</p>
                      </div>
                      <Icon name="chevron" className="ml-auto size-4 text-neutral-300 group-hover:text-brand-primary" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-200 bg-white p-6">
                <div className="flex items-center justify-between">
                  <h2 className="font-display text-2xl tracking-tight">Integrations</h2>
                  <span className="rounded-md bg-brand-accent/15 px-2 py-0.5 text-[10px] font-semibold text-brand-primary">9 active</span>
                </div>
                <ul className="mt-4 space-y-2.5">
                  {[
                    { n: "QuickBooks Online", s: "Synced 14m ago", ok: true },
                    { n: "Xero", s: "Synced 1h ago", ok: true },
                    { n: "NetSuite", s: "Awaiting auth", ok: false },
                    { n: "Gusto", s: "Synced today", ok: true },
                    { n: "Stripe", s: "Synced today", ok: true },
                  ].map((i) => (
                    <li key={i.n} className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-neutral-50">
                      <span className="grid size-8 place-items-center rounded-md bg-neutral-100 font-display text-sm text-neutral-700">{i.n[0]}</span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-neutral-800">{i.n}</p>
                        <p className="truncate text-[11px] text-neutral-500">{i.s}</p>
                      </div>
                      <span className={`size-1.5 rounded-full ${i.ok ? "bg-brand-accent" : "bg-amber-400"}`} />
                    </li>
                  ))}
                </ul>
                <button className="mt-4 w-full rounded-lg border border-dashed border-neutral-200 py-2 text-xs font-medium text-neutral-500 hover:border-brand-primary hover:text-brand-primary">
                  + Browse all integrations
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}