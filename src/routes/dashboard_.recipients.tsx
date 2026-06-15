import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type ReactNode, type FormEvent } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Logo } from "@/components/Logo";
import { recipientsApi, type Recipient, type RecipientPayload } from "@/lib/api/recipients";
import { payersApi } from "@/lib/api/payers";
import { ApiError } from "@/lib/api/client";
import { useAuth } from "@/lib/api/auth";

export const Route = createFileRoute("/dashboard_/recipients")({
  head: () => ({
    meta: [
      { title: "Recipients — 1099ly Dashboard" },
      { name: "description", content: "Manage 1099 / W-2 recipients linked to your payers." },
      { name: "robots", content: "noindex,follow" },
    ],
    links: [{ rel: "canonical", href: "/dashboard/recipients" }],
  }),
  component: RecipientsPage,
});

const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY","DC"];

function Icon({ name, className = "size-4" }: { name: string; className?: string }) {
  const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, ReactNode> = {
    home: <><path d="M3 11 12 4l9 7" /><path d="M5 10v10h14V10" /></>,
    building: <><path d="M4 21V5l8-2v18" /><path d="M12 9h8v12h-8" /></>,
    users: <><circle cx="9" cy="8" r="3" /><path d="M3 20c0-3 3-5 6-5s6 2 6 5" /><circle cx="17" cy="9" r="2.5" /><path d="M15 20c0-2.5 2-4 4-4s2.5 1 2.5 2.5" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    chevron: <><path d="m9 6 6 6-6 6" /></>,
    edit: <><path d="m4 20 4-1 11-11-3-3L5 16z" /><path d="m14 6 3 3" /></>,
    trash: <><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /></>,
    close: <><path d="M6 6l12 12M18 6 6 18" /></>,
    check: <><path d="m5 12 5 5L20 6" /></>,
    refresh: <><path d="M20 12a8 8 0 1 1-3-6.2" /><path d="M20 4v5h-5" /></>,
    logout: <><path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3" /><path d="M10 17l-5-5 5-5" /><path d="M5 12h11" /></>,
  };
  return <svg viewBox="0 0 24 24" className={className} {...stroke}>{paths[name] ?? null}</svg>;
}

function formatTin(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 9);
  if (d.length <= 3) return d;
  if (d.length <= 5) return `${d.slice(0,3)}-${d.slice(3)}`;
  return `${d.slice(0,3)}-${d.slice(3,5)}-${d.slice(5)}`;
}

const EMPTY: RecipientPayload = {
  payer_uuid: "",
  file_type: "Individual",
  last_name: "",
  first_name: "",
  recipient_tin: "",
  tin_not_provided: false,
  email: "",
  phone_number: "",
  address_one: "",
  city: "",
  state: "TX",
  zip_code: "",
  country: "US",
};

function rDisplayName(r: Recipient) {
  return r.name || [r.first_name, r.middle_name, r.last_name].filter(Boolean).join(" ") || r.last_name || "—";
}

function RecipientsPage() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { isAuthenticated, logout } = useAuth();
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<RecipientPayload | null>(null);
  const [editingId, setEditingId] = useState<number | string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Recipient | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const flash = (m: string) => { setToast(m); setTimeout(() => setToast(null), 2400); };

  const { data: recipients = [], isLoading, error, refetch, isFetching } = useQuery({
    queryKey: ["recipients"],
    queryFn: () => recipientsApi.list(),
    enabled: isAuthenticated,
  });

  const { data: payers = [] } = useQuery({
    queryKey: ["payers"],
    queryFn: () => payersApi.list(),
    enabled: isAuthenticated,
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return recipients;
    return recipients.filter((r) =>
      [rDisplayName(r), r.recipient_tin, r.email, r.city, r.client_recipient_id]
        .filter(Boolean)
        .some((f) => String(f).toLowerCase().includes(q))
    );
  }, [recipients, query]);

  const createMut = useMutation({
    mutationFn: (body: RecipientPayload) => recipientsApi.create(body),
    onSuccess: (r) => { qc.invalidateQueries({ queryKey: ["recipients"] }); flash(`Recipient "${rDisplayName(r)}" created`); setEditing(null); setEditingId(null); },
  });
  const updateMut = useMutation({
    mutationFn: ({ id, body }: { id: number | string; body: Partial<RecipientPayload> }) => recipientsApi.update(id, body),
    onSuccess: (r) => { qc.invalidateQueries({ queryKey: ["recipients"] }); flash(`Recipient "${rDisplayName(r)}" updated`); setEditing(null); setEditingId(null); },
  });
  const deleteMut = useMutation({
    mutationFn: (id: number | string) => recipientsApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["recipients"] }); flash("Recipient deleted"); setConfirmDelete(null); },
  });

  const openNew = () => {
    const defaultPayer = payers[0]?.uuid || "";
    setEditingId(null);
    setEditing({ ...EMPTY, payer_uuid: defaultPayer });
  };
  const openEdit = (r: Recipient) => {
    setEditingId((r.id ?? r.uuid) as string | number);
    setEditing({
      ...EMPTY,
      ...r,
      payer_uuid: r.payer_uuid || payers[0]?.uuid || "",
      file_type: (r.file_type as "Individual" | "Business") || "Individual",
      last_name: r.last_name || r.name || "",
    });
  };

  const onSave = (form: RecipientPayload) => {
    if (editingId != null) updateMut.mutate({ id: editingId, body: form });
    else createMut.mutate(form);
  };

  const handleLogout = async () => { await logout(); navigate({ to: "/login" }); };

  return (
    <div className="min-h-screen bg-neutral-100 font-sans text-neutral-900">
      <div className="flex">
        <aside className="sticky top-0 hidden h-screen w-[260px] shrink-0 border-r border-neutral-200 bg-white md:flex md:flex-col">
          <div className="flex h-16 items-center px-4"><Link to="/"><Logo /></Link></div>
          <div className="px-3">
            <button onClick={openNew} className="flex w-full items-center gap-2 rounded-xl bg-brand-primary px-3 py-2.5 text-sm font-medium text-white">
              <Icon name="plus" /> New recipient
            </button>
          </div>
          <nav className="mt-4 flex-1 overflow-y-auto px-2 pb-6">
            <p className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">Workspace</p>
            <ul className="space-y-0.5">
              <li><button onClick={() => navigate({ to: "/dashboard" })} className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100"><Icon name="home" /> Dashboard</button></li>
              <li><button onClick={() => navigate({ to: "/dashboard/payers" })} className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-neutral-600 hover:bg-neutral-100"><Icon name="building" /> Payers</button></li>
              <li><button className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm bg-brand-primary/8 text-brand-primary"><Icon name="users" /> Recipients</button></li>
            </ul>
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
              <span>Recipients</span>
            </div>
            <div className="relative ml-auto w-full max-w-md">
              <Icon name="search" className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search recipients…" className="h-9 w-full rounded-lg border border-neutral-200 bg-neutral-50 pl-9 pr-3 text-sm focus:border-brand-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-primary/15" />
            </div>
            <button onClick={() => refetch()} className="grid size-9 place-items-center rounded-lg text-neutral-500 hover:bg-neutral-100" title="Refresh">
              <Icon name="refresh" className={isFetching ? "size-4 animate-spin" : "size-4"} />
            </button>
          </header>

          <main className="flex-1 px-6 py-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-primary/70">Workspace</p>
                <h1 className="mt-2 font-display text-4xl tracking-tight md:text-5xl">Recipients</h1>
                <p className="mt-2 max-w-xl text-sm text-neutral-500">Manage the people and businesses that receive your 1099 / W-2 forms.</p>
              </div>
              <button onClick={openNew} className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-3.5 py-2 text-sm font-medium text-white">
                <Icon name="plus" /> New recipient
              </button>
            </div>

            {!isAuthenticated && (
              <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                You're not signed in. <Link to="/login" className="font-medium underline">Sign in</Link> to load recipients.
              </div>
            )}
            {error && <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">{(error as Error).message}</div>}

            <section className="mt-6 rounded-2xl border border-neutral-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 text-left text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                      <th className="px-6 py-3">Recipient</th>
                      <th className="px-2 py-3">TIN</th>
                      <th className="px-2 py-3">Payer</th>
                      <th className="px-2 py-3">Contact</th>
                      <th className="px-2 py-3">Location</th>
                      <th className="px-6 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading && <tr><td colSpan={6} className="px-6 py-12 text-center text-sm text-neutral-500">Loading recipients…</td></tr>}
                    {!isLoading && filtered.length === 0 && (
                      <tr><td colSpan={6} className="px-6 py-16 text-center">
                        <p className="font-display text-xl text-neutral-900">No recipients found</p>
                        <p className="mt-1 text-sm text-neutral-500">Create your first recipient to get started.</p>
                        <button onClick={openNew} className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-brand-primary px-3 py-2 text-xs font-medium text-white"><Icon name="plus" className="size-3.5" /> New recipient</button>
                      </td></tr>
                    )}
                    {filtered.map((r) => {
                      const payer = payers.find((p) => p.uuid === r.payer_uuid);
                      return (
                        <tr key={String(r.id ?? r.uuid)} className="border-b border-neutral-50 last:border-0 hover:bg-neutral-50/60">
                          <td className="px-6 py-3">
                            <div className="flex items-center gap-3">
                              <span className="grid size-9 place-items-center rounded-lg bg-brand-accent/15 font-display text-sm text-brand-primary">
                                {rDisplayName(r).slice(0, 1).toUpperCase()}
                              </span>
                              <div className="min-w-0">
                                <p className="truncate font-medium text-neutral-900">{rDisplayName(r)}</p>
                                <p className="text-[11px] text-neutral-500">{r.file_type}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-2 py-3 font-mono text-xs text-neutral-700">{r.recipient_tin || (r.tin_not_provided ? "Not provided" : "—")}</td>
                          <td className="px-2 py-3 text-xs text-neutral-700">{payer ? (payer.name || payer.last_name) : <span className="text-neutral-400">—</span>}</td>
                          <td className="px-2 py-3">
                            <p className="truncate text-xs text-neutral-700">{r.email || "—"}</p>
                            <p className="text-[11px] text-neutral-500">{r.phone_number || ""}</p>
                          </td>
                          <td className="px-2 py-3">
                            <p className="text-xs text-neutral-700">{[r.city, r.state].filter(Boolean).join(", ") || "—"}</p>
                            <p className="text-[11px] text-neutral-500">{r.zip_code}</p>
                          </td>
                          <td className="px-6 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => openEdit(r)} title="Edit" className="grid size-7 place-items-center rounded-md text-neutral-500 hover:bg-brand-primary/8 hover:text-brand-primary"><Icon name="edit" className="size-3.5" /></button>
                              <button onClick={() => setConfirmDelete(r)} title="Delete" className="grid size-7 place-items-center rounded-md text-neutral-500 hover:bg-rose-50 hover:text-rose-600"><Icon name="trash" className="size-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-3 text-xs text-neutral-500">{filtered.length} of {recipients.length} recipients</div>
            </section>
          </main>
        </div>
      </div>

      {editing && (
        <RecipientDrawer
          initial={editing}
          isEdit={editingId != null}
          saving={createMut.isPending || updateMut.isPending}
          serverError={(createMut.error as ApiError | null)?.message || (updateMut.error as ApiError | null)?.message || null}
          payers={payers.map((p) => ({ uuid: p.uuid, label: p.name || p.last_name || p.uuid.slice(0, 8) }))}
          onClose={() => { setEditing(null); setEditingId(null); createMut.reset(); updateMut.reset(); }}
          onSave={onSave}
        />
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-neutral-900/40 backdrop-blur-sm p-4" onClick={() => setConfirmDelete(null)}>
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="grid size-11 place-items-center rounded-xl bg-rose-50 text-rose-600"><Icon name="trash" /></div>
            <h3 className="mt-4 font-display text-2xl tracking-tight">Delete recipient?</h3>
            <p className="mt-1 text-sm text-neutral-500"><span className="font-medium text-neutral-800">{rDisplayName(confirmDelete)}</span> will be removed.</p>
            {deleteMut.error && <p className="mt-2 text-xs text-rose-600">{(deleteMut.error as Error).message}</p>}
            <div className="mt-5 flex items-center justify-end gap-2">
              <button onClick={() => setConfirmDelete(null)} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">Cancel</button>
              <button disabled={deleteMut.isPending} onClick={() => deleteMut.mutate((confirmDelete.id ?? confirmDelete.uuid) as string | number)} className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-60">
                {deleteMut.isPending ? "Deleting…" : "Delete recipient"}
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
  return <section className="mb-8 last:mb-0"><h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">{title}</h3><div className="grid grid-cols-2 gap-4">{children}</div></section>;
}
function Field({ label, error, className = "", children }: { label: string; error?: string; className?: string; children: ReactNode }) {
  return <label className={`block ${className}`}><span className="mb-1 block text-xs font-medium text-neutral-700">{label}</span>{children}{error && <span className="mt-1 block text-[11px] text-rose-600">{error}</span>}</label>;
}

function RecipientDrawer({
  initial, isEdit, saving, serverError, payers, onClose, onSave,
}: {
  initial: RecipientPayload;
  isEdit: boolean;
  saving: boolean;
  serverError: string | null;
  payers: { uuid: string; label: string }[];
  onClose: () => void;
  onSave: (r: RecipientPayload) => void;
}) {
  const [form, setForm] = useState<RecipientPayload>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const set = <K extends keyof RecipientPayload>(k: K, v: RecipientPayload[K]) => setForm((f) => ({ ...f, [k]: v }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const er: Record<string, string> = {};
    if (!form.payer_uuid) er.payer_uuid = "Select a payer";
    if (!form.last_name?.trim()) er.last_name = "Required";
    if (!form.tin_not_provided && !/^\d{3}-\d{2}-\d{4}$/.test(form.recipient_tin || "")) er.recipient_tin = "Format: 123-45-6789";
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) er.email = "Invalid email";
    if (!form.address_one?.trim()) er.address_one = "Required";
    if (!form.city?.trim()) er.city = "Required";
    setErrors(er);
    if (Object.keys(er).length) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-900/40 backdrop-blur-sm" onClick={onClose}>
      <form onSubmit={submit} onClick={(e) => e.stopPropagation()} className="flex h-full w-full max-w-xl flex-col bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-neutral-100 px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-brand-primary/70">{isEdit ? "Edit recipient" : "New recipient"}</p>
            <h2 className="mt-1 font-display text-2xl tracking-tight">{isEdit ? form.last_name || "Untitled" : "Create a recipient"}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="grid size-8 place-items-center rounded-lg text-neutral-500 hover:bg-neutral-100"><Icon name="close" /></button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {serverError && <div className="mb-6 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{serverError}</div>}

          <Section title="Link">
            <Field label="Payer" error={errors.payer_uuid} className="col-span-2">
              <select value={form.payer_uuid} onChange={(e) => set("payer_uuid", e.target.value)} className={inputCls}>
                <option value="">Select a payer…</option>
                {payers.map((p) => <option key={p.uuid} value={p.uuid}>{p.label}</option>)}
              </select>
            </Field>
          </Section>

          <Section title="Identity">
            <Field label="File type">
              <select value={form.file_type} onChange={(e) => set("file_type", e.target.value as "Individual" | "Business")} className={inputCls}>
                <option>Individual</option><option>Business</option>
              </select>
            </Field>
            <Field label="TIN not provided">
              <select value={String(form.tin_not_provided ?? false)} onChange={(e) => set("tin_not_provided", e.target.value === "true")} className={inputCls}>
                <option value="false">No</option><option value="true">Yes</option>
              </select>
            </Field>
            {form.file_type === "Individual" && (
              <Field label="First name"><input value={form.first_name || ""} onChange={(e) => set("first_name", e.target.value)} className={inputCls} /></Field>
            )}
            <Field label={form.file_type === "Business" ? "Business name" : "Last name"} error={errors.last_name} className={form.file_type === "Individual" ? "" : "col-span-2"}>
              <input value={form.last_name} onChange={(e) => set("last_name", e.target.value)} className={inputCls} />
            </Field>
            {!form.tin_not_provided && (
              <Field label="Recipient TIN" error={errors.recipient_tin} className="col-span-2">
                <input value={form.recipient_tin || ""} onChange={(e) => set("recipient_tin", formatTin(e.target.value))} placeholder="123-45-6789" className={`${inputCls} font-mono`} />
              </Field>
            )}
          </Section>

          <Section title="Contact">
            <Field label="Email" error={errors.email}><input type="email" value={form.email || ""} onChange={(e) => set("email", e.target.value)} className={inputCls} /></Field>
            <Field label="Phone"><input value={form.phone_number || ""} onChange={(e) => set("phone_number", e.target.value)} className={inputCls} /></Field>
          </Section>

          <Section title="Address">
            <Field label="Street" error={errors.address_one} className="col-span-2"><input value={form.address_one || ""} onChange={(e) => set("address_one", e.target.value)} className={inputCls} /></Field>
            <Field label="City" error={errors.city}><input value={form.city || ""} onChange={(e) => set("city", e.target.value)} className={inputCls} /></Field>
            <Field label="State">
              <select value={form.state || "TX"} onChange={(e) => set("state", e.target.value)} className={inputCls}>{STATES.map((s) => <option key={s}>{s}</option>)}</select>
            </Field>
            <Field label="ZIP"><input value={form.zip_code || ""} onChange={(e) => set("zip_code", e.target.value)} className={inputCls} /></Field>
            <Field label="Country"><input value={form.country || "US"} onChange={(e) => set("country", e.target.value.toUpperCase())} maxLength={2} className={`${inputCls} font-mono uppercase`} /></Field>
          </Section>
        </div>

        <footer className="flex items-center justify-end gap-2 border-t border-neutral-100 px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">Cancel</button>
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-brand-primary px-3.5 py-2 text-sm font-medium text-white disabled:opacity-60">
            <Icon name="check" className="size-4" /> {saving ? "Saving…" : isEdit ? "Save changes" : "Create recipient"}
          </button>
        </footer>
      </form>
    </div>
  );
}