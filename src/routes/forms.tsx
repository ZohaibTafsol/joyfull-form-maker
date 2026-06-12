import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/forms")({
  head: () => ({
    meta: [
      { title: "Tax Forms — eFile 1099, W-2, 94x, 1042 & ACA" },
      { name: "description", content: "Browse the full 1099ly form library: 1099 series, W-2, 94x payroll, 1042-S, 1095 ACA, 990, 1098/5498, extensions and corrections." },
      { property: "og:title", content: "Tax Forms — eFile 1099, W-2, 94x, 1042 & ACA" },
      { property: "og:description", content: "Every IRS information return, in one workspace." },
      { property: "og:url", content: "/forms" },
    ],
    links: [{ rel: "canonical", href: "/forms" }],
  }),
  component: FormsPage,
});

const FORM_GROUPS = [
  { title: "1099 Series", items: ["1099-NEC","1099-MISC","1099-INT","1099-K","1099-DIV","1099-R","1099-S","1099-PATR","1099-B","1099-C","1099-OID","1099-A","1099-SA","1099-Q","1099-G","1099-DA","1099-LS","1099-QA","1099 Corrections"] },
  { title: "Payroll (94x)", items: ["940","941","941-X","943","943-X","944","944-X","945"] },
  { title: "Wage & W-2", items: ["W-2","W-2C","W-2VI","W-2GU","W-3"] },
  { title: "ACA & 1095", items: ["1095-B","1095-C","ACA Corrections"] },
  { title: "1098 / 5498", items: ["1098","1098-C","1098-T","1098-E","5498","5498-SA","5498-ESA"] },
  { title: "Tax Exempt", items: ["990","990-N","990-T","990-PF","990-EZ"] },
  { title: "Extensions", items: ["8809","7004","4868","8027","8868","8955-SSA"] },
  { title: "1042 / Stock / 480", items: ["1042","1042-S","3921","3922","480.6A","480.6B","480.6D","480.7A"] },
];

function FormsPage() {
  return (
    <SiteShell>
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-primary">Form Library</div>
          <h1 className="max-w-3xl font-display text-5xl tracking-tight text-balance md:text-6xl">
            Every IRS information return, in <span className="italic text-brand-primary">one workspace.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-neutral-600">
            1099ly supports the full 1099, W-2, 94x, 1042, 1095, 1098, 5498, 990 and 8xx series — including corrections and extensions.
          </p>

          <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {FORM_GROUPS.map((g) => (
              <div key={g.title} className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
                <h2 className="text-sm font-semibold text-neutral-900">{g.title}</h2>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {g.items.map((it) => (
                    <li key={it}>
                      <span className="rounded-md bg-neutral-50 px-2 py-1 text-xs font-medium text-neutral-600 ring-1 ring-black/5">{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}