import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Logo } from "@/components/Logo";
import { payersApi, type Payer, type PayerPayload } from "@/lib/api/payers";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/api/auth";

export const Route = createFileRoute("/dashboard_/payers")({
  head: () => ({
    meta: [
      { title: "Payers — 1099ly Dashboard" },
      { name: "description", content: "Create, edit and manage payer entities used across your 1099, W-2 and 94x filings." },
      { name: "robots", content: "noindex,follow" },
    ],
    links: [{ rel: "canonical", href: "/dashboard/payers" }],
  }),
  component: PayersPage,
});

const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

const NAV_GROUPS = [
  { label: "Workspace", items: [
    { key: "home", label: "Dashboard", icon: "home", to: "/dashboard" as const },
    { key: "payers", label: "Payers", icon: "building", to: "/dashboard/payers" as const, badge: "API" },
    { key: "recipients", label: "Recipients", icon: "users", to: "/dashboard/recipients" as const, badge: "API" },
  ]},
];

function Icon({ name, className = "size-4" }: { name: string; className?: string }) {
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, ReactNode> = {
    home: <><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /></>,
    building: <><path d="M4 21V5l8-2v18" /><path d="M12 9h8v12h-8" /><path d="M7 8v.01M7 12v.01M7 16v.01" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3 3-5 6-5s6 2 6 5" /><circle cx="17" cy="9" r="2.5" /><path d="M15 20c0-2.5 2-4 4-4s2.5 1 2.5 2.5" /></>,
    file: <><path d="M7 3h7l5 5v13H7z" /><path d="M14 3v5h5" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    bell: <><path d="M6 16V11a6 6 0 1 1 12 0v5l2 3H4z" /><path d="M10 21a2 2 0 0 0 4 0" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    chevron: <><path d="m9 6 6 6-6 6" /></>,
    edit: <><path d="m4 20 4-1 11-11-3-3L5 16z" /><path d="m14 6 3 3" /></>,
    trash: <><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /><path d="M10 11v6M14 11v6" /></>,
    close: <><path d="M6 6l12 12M18 6 6 18" /></>,
    check: <><path d="m5 12 5 5L20 6" /></>,
    refresh: <><path d="M20 12a8 8 0 1 1-3-6.2" /><path d="M20 4v5h-5" /></>,
    logout: <><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 17l-5-5 5-5" /><path d="M5 12h11" /></>,
  };
  return <svg viewBox="0 0 24 24" className={className} {...stroke}>{paths[name] ?? null}</svg>;
}

function formatTaxId(v: string, type: "SSN" | "EIN") {
  const d = v.replace(/\D/g, "").slice(0, 9);
  if (type === "SSN") {
    if (d.length <= 3) return d;
    if (d.length <= 5) return `${d.slice(0,3)}-${d.slice(3)}`;
    return `${d.slice(0,3)}-${d.slice(3,5)}-${d.slice(5)}`;
  }
  return d.length > 2 ? `${d.slice(0,2)}-${d.slice(2)}` : d;
}

const EMPTY: PayerPayload = {
  file_type: "Business",
  last_name: "",
  first_name: "",
  middle_name: "",
  id_type: "EIN",
  id_number: "",
  email: "",
  phone_number: "",
  address_one: "",
  address_two: "",
  city: "",
  state: "TX",
  zip_code: "",
  country: "US",
};

function displayName(p: Payer) {
  return p.name || [p.first_name, p.middle_name, p.last_name].filter(Boolean).join(" ") || p.last_name || "—";
}

function PayersPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { isAuthenticated, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<(Partial<Payer> & PayerPayload) | null>(null);
  const [editingUuid, setEditingUuid] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Payer | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 2400); };

  const { data: payers = [], isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["payers"],
    queryFn: () => payersApi.list(),
    enabled: isAuthenticated,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return payers;
    return payers.filter((p) =>
      [displayName(p), p.id_number, p.email, p.city, p.state, p.uuid]
        .filter(Boolean)
        .some((f) => String(f).toLowerCase().includes(q))
    );
  }, [payers, query]);

  const createMut = useMutation({
    mutationFn: (body: PayerPayload) => payersApi.create(body),
    onSuccess: (p) => { qc.invalidateQueries({ queryKey: ["payers"] }); flash(`Payer "${displayName(p)}" created`); setEditing(null); setEditingUuid(null); },
  });
  const updateMut = useMutation({
    mutationFn: ({ uuid, body }: { uuid: string; body: Partial<PayerPayload> }) => payersApi.update(uuid, body),
    onSuccess: (p) => { qc.invalidateQueries({ queryKey: ["payers"] }); flash(`Payer "${displayName(p)}" updated`); setEditing(null); setEditingUuid(null); },
  });
  const deleteMut = useMutation({
    mutationFn: (uuid: string) => payersApi.remove(uuid),
    onSuccess: (_d, uuid) => {
      qc.invalidateQueries({ queryKey: ["payers"] });
      flash(`Payer deleted`);
      setConfirmDelete(null);
      void uuid;
    },
  });

  const openNew = () => { setEditingUuid(null); setEditing({ ...EMPTY }); };
  const openEdit = (p: Payer) => {
    setEditingUuid(p.uuid);
    setEditing({
      ...EMPTY,
      ...p,
      file_type: (p.file_type as "Individual" | "Business") || "Business",
      id_type: (p.id_type as "SSN" | "EIN") || "EIN",
      last_name: p.last_name || p.name || "",
      country: p.country || "US",
      phone_number: p.phone_number || "",
      address_one: p.address_one || "",
      city: p.city || "",
      zip_code: p.zip_code || "",
      id_number: p.id_number || "",
    });
  };

  const onSave = (form: PayerPayload) => {
    if (editingUuid) updateMut.mutate({ uuid: editingUuid, body: form });
    else createMut.mutate(form);
  };

  const handleLogout = async () => { await logout(); navigate({ to: "/login" }); };

  return (
    <div className="min-h-screen bg-neutral-100 font-sans text-neutral-900">
      <div className="flex">
        {/* Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 border-r border-neutral-200 bg-white md:flex md:flex-col">
          <div className="flex h-16 items-center px-4">
            <Link to="/" aria-label="1099ly home"><Logo /></Link>
          </div>
          <div className="px-3">
            <button onClick={openNew} className="flex w-full items-center gap-2 rounded-xl bg-brand-primary px-3 py-2.5 text-sm font-medium text-white">
              <Icon name="plus" /> New payer
            </button>
          </div>
          <nav className="mt-4 flex-1 overflow-y-auto px-2 pb-6">
            {NAV_GROUPS.map((group) => (
              <div key={group.label} className="mt-4 first:mt-0">
                <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">{group.label}</p>
                <ul className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = item.key === "payers";
                    return (
                      <li key={item.key}>
                        <button
                          onClick={() => navigate({ to: item.to })}
                          className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                            isActive ? "bg-brand-primary/8 text-brand-primary" : "text-neutral-600 hover:bg-neutral-100"
                          }`}
                        >
                          <Icon name={item.icon} />
                          <span className="flex-1 text-left">{item.label}</span>
                          {"badge" in item && item.badge && (
                            <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500 ring-1 ring-neutral-200">{item.badge}</span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
          <div className="border-t border-neutral-100 p-3">
            <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100">
              <Icon name="logout" /> Sign out
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-neutral-200 bg-white/85 px-6 backdrop-blur-md">
            <div className="hidden items-center gap-1.5 text-xs text-neutral-500 md:flex">
              <Link to="/dashboard" className="hover:text-neutral-800">Workspace</Link>
              <Icon name="chevron" className="size-3 text-neutral-300" />
              <span className="text-neutral-500">Payers</span>
            </div>
            <div className="relative ml-auto w-full max-w-md">
              <Icon name="search" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search payers by name, TIN, email, city…"
                className="h-9 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-9 pr-3 text-sm focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/15"
              />
            </div>
            <button onClick={() => refetch()} className="grid size-9 place-items-center rounded-lg text-neutral-500 hover:bg-neutral-100" title="Refresh">
              <Icon name="refresh" className={isFetching ? "size-4 animate-spin" : "size-4"} />
            </button>
          </header>

          <main className="flex-1 px-6 py-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-primary/70">Workspace</p>
                <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">Payers</h1>
                <p className="mt-2 max-w-xl text-sm text-neutral-500">Manage the legal entities that issue your 1099, W-2 and 94x forms.</p>
              </div>
              <button onClick={openNew} className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-3.5 py-2 text-sm font-medium text-white">
                <Icon name="plus" /> New payer
              </button>
            </div>

            {!isAuthenticated && (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                You're not signed in. <Link to="/login" className="font-medium underline">Sign in</Link> to load payers from the API.
              </div>
            )}

            {error && (
              <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
                {(error as Error).message}
              </div>
            )}

            <section className="mt-6 rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      <th className="px-6 py-3">Payer</th>
                      <th className="px-2 py-3">TIN / Type</th>
                      <th className="px-2 py-3">Contact</th>
                      <th className="px-2 py-3">Location</th>
                      <th className="px-2 py-3">Status</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading && (
                      <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-neutral-500">Loading payers…</td></tr>
                    )}
                    {!isLoading && filtered.length === 0 && (
                      <tr><td colSpan={6} className="px-6 py-16 text-center">
                        <p className="font-display text-xl text-neutral-900">No payers found</p>
                        <p className="mt-1 text-sm text-neutral-500">Create your first payer to get started.</p>
                        <button onClick={openNew} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-primary px-3 py-2 text-xs font-medium text-white">
                          <Icon name="plus" className="size-3.5" /> New payer
                        </button>
                      </td></tr>
                    )}
                    {filtered.map((p) => (
                      <tr key={p.uuid} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60">
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <span className="grid size-9 place-items-center rounded-lg bg-brand-primary/8 font-display text-sm text-brand-primary">
                              {displayName(p).slice(0, 1).toUpperCase()}
                            </span>
                            <div className="min-w-0">
                              <p className="truncate font-medium text-neutral-900">{displayName(p)}</p>
                              <p className="truncate font-mono text-[11px] text-neutral-400">{p.uuid?.slice(0, 8)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-2 py-3">
                          <p className="font-mono text-xs text-neutral-700">{p.id_number || "—"}</p>
                          <p className="text-[11px] text-neutral-500">{p.file_type} · {p.id_type}</p>
                        </td>
                        <td className="px-2 py-3">
                          <p className="truncate text-xs text-neutral-700">{p.email || "—"}</p>
                          <p className="text-[11px] text-neutral-500">{p.phone_number || ""}</p>
                        </td>
                        <td className="px-2 py-3">
                          <p className="text-xs text-neutral-700">{[p.city, p.state].filter(Boolean).join(", ") || "—"}</p>
                          <p className="text-[11px] text-neutral-500">{p.zip_code}</p>
                        </td>
                        <td className="px-2 py-3">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${
                            p.is_active === false
                              ? "bg-neutral-100 text-neutral-500 ring-neutral-200"
                              : "bg-brand-accent/15 text-brand-primary ring-brand-accent/30"
                          }`}>
                            <span className="size-1.5 rounded-full bg-current" />
                            {p.is_active === false ? "Inactive" : "Active"}
                          </span>
                        </td>
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
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between px-6 py-3 text-xs text-neutral-500">
                <span>{filtered.length} of {payers.length} payers</span>
              </div>
            </section>
          </main>
        </div>
      </div>

      {editing && (
        <PayerDrawer
          initial={editing}
          isEdit={!!editingUuid}
          saving={createMut.isPending || updateMut.isPending}
          serverError={
            (createMut.error as ApiError | null)?.message ||
            (updateMut.error as ApiError | null)?.message ||
            null
          }
          onClose={() => { setEditing(null); setEditingUuid(null); createMut.reset(); updateMut.reset(); }}
          onSave={onSave}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-900/40 backdrop-blur-sm p-4" onClick={() => setConfirmDelete(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="grid size-11 place-items-center rounded-xl bg-rose-50 text-rose-600"><Icon name="trash" /></div>
            <h3 className="mt-4 font-display text-2xl tracking-tight">Delete payer?</h3>
            <p className="mt-1 text-sm text-neutral-500">
              <span className="font-medium text-neutral-800">{displayName(confirmDelete)}</span> will be removed permanently.
            </p>
            {deleteMut.error && <p className="mt-2 text-xs text-rose-600">{(deleteMut.error as Error).message}</p>}
            <div className="mt-5 flex items-center justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">Cancel</button>
              <button disabled={deleteMut.isPending} onClick={() => deleteMut.mutate(confirmDelete.uuid)} className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60">
                {deleteMut.isPending ? "Deleting…" : "Delete payer"}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm text-white shadow-xl">
            <Icon name="check" className="size-4 text-brand-accent" />{toast}
          </div>
        </div>
      )}
    </div>
  );
}

const inputCls = "h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 text-sm text-neutral-900 focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/15";

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

function PayerDrawer({
  initial, isEdit, saving, serverError, onClose, onSave,
}: {
  initial: PayerPayload;
  isEdit: boolean;
  saving: boolean;
  serverError: string | null;
  onClose: () => void;
  onSave: (p: PayerPayload) => void;
}) {
  const [form, setForm] = useState<PayerPayload>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = <K extends keyof PayerPayload>(k: K, v: PayerPayload[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!form.last_name?.trim()) er.last_name = form.file_type === "Business" ? "Business name required" : "Last name required";
    if (form.id_type === "EIN" && !/^\d{2}-\d{7}$/.test(form.id_number || "")) er.id_number = "Format: 12-3456789";
    if (form.id_type === "SSN" && !/^\d{3}-\d{2}-\d{4}$/.test(form.id_number || "")) er.id_number = "Format: 123-45-6789";
    if (!form.phone_number?.trim()) er.phone_number = "Required";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = "Invalid email";
    if (!form.address_one?.trim()) er.address_one = "Required";
    if (!form.city?.trim()) er.city = "Required";
    if (!form.zip_code?.trim()) er.zip_code = "Required";
    setErrors(er);
    if (Object.keys(er).length) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-900/40 backdrop-blur-sm" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-primary/70">{isEdit ? "Edit payer" : "New payer"}</p>
            <h2 className="mt-1 font-display text-2xl tracking-tight">{isEdit ? form.last_name || "Untitled" : "Create a payer"}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-8 place-items-center rounded-lg text-neutral-500 hover:bg-neutral-100">
            <Icon name="close" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {serverError && (
            <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{serverError}</div>
          )}

          <Section title="Entity">
            <Field label="File type">
              <select value={form.file_type} onChange={(e) => set("file_type", e.target.value as "Individual" | "Business")} className={inputCls}>
                <option>Business</option><option>Individual</option>
              </select>
            </Field>
            <Field label="ID type">
              <select value={form.id_type} onChange={(e) => { const t = e.target.value as "SSN" | "EIN"; set("id_type", t); set("id_number", ""); }} className={inputCls}>
                <option>EIN</option><option>SSN</option>
              </select>
            </Field>
            {form.file_type === "Individual" && (
              <>
                <Field label="First name"><input value={form.first_name || ""} onChange={(e) => set("first_name", e.target.value)} className={inputCls} /></Field>
                <Field label="Middle name"><input value={form.middle_name || ""} onChange={(e) => set("middle_name", e.target.value)} className={inputCls} /></Field>
              </>
            )}
            <Field label={form.file_type === "Business" ? "Business name" : "Last name"} error={errors.last_name} className="col-span-2">
              <input value={form.last_name} onChange={(e) => set("last_name", e.target.value)} className={inputCls} />
            </Field>
            <Field label={form.id_type} error={errors.id_number} className="col-span-2">
              <input value={form.id_number} onChange={(e) => set("id_number", formatTaxId(e.target.value, form.id_type))}
                placeholder={form.id_type === "EIN" ? "12-3456789" : "123-45-6789"} className={`${inputCls} font-mono`} />
            </Field>
          </Section>

          <Section title="Contact">
            <Field label="Email" error={errors.email}><input type="email" value={form.email || ""} onChange={(e) => set("email", e.target.value)} className={inputCls} /></Field>
            <Field label="Phone" error={errors.phone_number}><input value={form.phone_number} onChange={(e) => set("phone_number", e.target.value)} placeholder="(555) 555-0100" className={inputCls} /></Field>
          </Section>

          <Section title="Address">
            <Field label="Street" error={errors.address_one} className="col-span-2"><input value={form.address_one} onChange={(e) => set("address_one", e.target.value)} className={inputCls} /></Field>
            <Field label="Address line 2" className="col-span-2"><input value={form.address_two || ""} onChange={(e) => set("address_two", e.target.value)} className={inputCls} /></Field>
            <Field label="City" error={errors.city}><input value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls} /></Field>
            <Field label="State">
              <select value={form.state || "TX"} onChange={(e) => set("state", e.target.value)} className={inputCls}>
                {STATES.map((s) => <option key={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="ZIP" error={errors.zip_code}><input value={form.zip_code} onChange={(e) => set("zip_code", e.target.value)} placeholder="78703" className={inputCls} /></Field>
            <Field label="Country"><input value={form.country} onChange={(e) => set("country", e.target.value.toUpperCase())} maxLength={2} className={`${inputCls} font-mono uppercase`} /></Field>
          </Section>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-neutral-100 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-3.5 py-2 text-sm font-medium text-white disabled:opacity-60">
            <Icon name="check" className="size-4" /> {saving ? "Saving…" : isEdit ? "Save changes" : "Create payer"}
          </button>
        </footer>
      </form>
    </div>
  );
}