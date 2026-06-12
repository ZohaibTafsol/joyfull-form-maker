import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — 1099ly eFiling from $0.68 per form" },
      { name: "description", content: "Transparent pay-per-form pricing for 1099, W-2, 94x, 1042 and ACA eFiling. No platform fees, no overages. Start free." },
      { property: "og:title", content: "Pricing — 1099ly eFiling from $0.68 per form" },
      { property: "og:description", content: "Pay only per filed form. Free to start. Volume discounts and Enterprise plans." },
      { property: "og:url", content: "/pricing" },
    ],
    links: [{ rel: "canonical", href: "/pricing" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Product",
        name: "1099ly eFiling",
        description: "IRS-authorized eFiling for 1099, W-2, 94x, 1042 and ACA forms.",
        offers: [
          { "@type": "Offer", name: "Starter", price: "0.68", priceCurrency: "USD" },
          { "@type": "Offer", name: "Professional", price: "1.63", priceCurrency: "USD" },
        ],
      }),
    }],
  }),
  component: Pricing,
});

const TIERS = [
  { name: "Starter", price: "$0.68", suffix: "/form", desc: "Pay only for what you file. Perfect for small businesses.", features: ["Federal eFile", "Email & print delivery", "Unlimited recipients", "Email support"], highlight: false, cta: "Start for free", to: "/signup" as const },
  { name: "Professional", price: "$1.63", suffix: "/form", desc: "Most popular for finance teams and accountants.", features: ["Everything in Starter", "Bulk TIN matching", "Combined state filing", "12+ integrations", "Priority support"], highlight: true, cta: "Choose Professional", to: "/signup" as const },
  { name: "Enterprise", price: "Custom", suffix: "", desc: "API, SSO and white-glove implementation.", features: ["Full API access", "SSO & SCIM", "Audit log export", "Dedicated CSM", "Custom contracts"], highlight: false, cta: "Contact sales", to: "/contact" as const },
];

function Pricing() {
  return (
    <SiteShell>
      <section className="pt-20 pb-16">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-primary">Pricing</div>
          <h1 className="font-display text-5xl tracking-tight md:text-6xl">Priced per form, <span className="italic text-brand-primary">never per seat.</span></h1>
          <p className="mx-auto mt-6 max-w-[52ch] text-neutral-600">Start free. Pay only when a return is transmitted to the IRS. Volume discounts kick in automatically.</p>
        </div>
      </section>

      <section className="pb-28">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-3">
          {TIERS.map((t) => (
            <div key={t.name} className={`flex flex-col rounded-3xl bg-white p-8 ${t.highlight ? "ring-2 ring-brand-primary shadow-xl shadow-brand-primary/10" : "ring-1 ring-black/5"}`}>
              <div className={`text-sm font-semibold ${t.highlight ? "text-brand-primary" : "text-neutral-500"}`}>{t.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-5xl">{t.price}</span>
                {t.suffix && <span className="text-sm text-neutral-400">{t.suffix}</span>}
              </div>
              <p className="mt-4 text-sm text-neutral-500">{t.desc}</p>
              <ul className="mt-8 flex-1 space-y-4">
                {t.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <span className="grid size-4 place-items-center rounded-full bg-emerald-500/10"><span className="size-1.5 rounded-full bg-emerald-600" /></span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link to={t.to} className={`mt-8 w-full rounded-full py-3 text-center text-sm font-medium transition-colors ${t.highlight ? "bg-brand-primary text-white hover:opacity-90" : "ring-1 ring-black/10 hover:bg-neutral-50"}`}>
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-neutral-100 py-24">
        <div className="mx-auto max-w-5xl px-6">
          <h2 className="font-display text-3xl tracking-tight md:text-4xl">Volume pricing</h2>
          <p className="mt-3 text-neutral-600">Discounts apply automatically across the calendar year, per form type.</p>
          <div className="mt-8 overflow-hidden rounded-2xl bg-white ring-1 ring-black/5">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-xs uppercase tracking-wider text-neutral-500">
                <tr><th className="px-6 py-4 text-left">Forms per year</th><th className="px-6 py-4 text-left">Per-form price</th><th className="px-6 py-4 text-left">Savings</th></tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {[
                  { r: "1 – 250", p: "$1.63", s: "—" },
                  { r: "251 – 1,000", p: "$1.29", s: "20%" },
                  { r: "1,001 – 10,000", p: "$0.95", s: "40%" },
                  { r: "10,001+", p: "$0.68", s: "58%" },
                ].map((row) => (
                  <tr key={row.r}><td className="px-6 py-4 font-medium">{row.r}</td><td className="px-6 py-4">{row.p}</td><td className="px-6 py-4 text-brand-primary">{row.s}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}