import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact 1099ly — sales, support & demos" },
      { name: "description", content: "Talk to 1099ly about eFiling at scale. Sales, implementation, API, and 24/7 support contacts." },
      { property: "og:title", content: "Contact 1099ly — sales, support & demos" },
      { property: "og:description", content: "Get in touch with sales, schedule a demo, or reach support." },
      { property: "og:url", content: "/contact" },
    ],
    links: [{ rel: "canonical", href: "/contact" }],
  }),
  component: Contact,
});

function Contact() {
  return (
    <SiteShell>
      <section className="py-20">
        <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-primary">Contact</div>
            <h1 className="font-display text-5xl tracking-tight text-balance md:text-6xl">Let’s talk filings.</h1>
            <p className="mt-6 max-w-md text-neutral-600">
              Whether you’re filing 50 returns or 5 million, our team can scope an implementation and price in a single call.
            </p>
            <dl className="mt-10 space-y-6 text-sm">
              {[
                { k: "Sales", v: "sales@1099ly.com" },
                { k: "Support", v: "support@1099ly.com · 24/7" },
                { k: "Press", v: "press@1099ly.com" },
                { k: "Office", v: "548 Market St, San Francisco, CA" },
              ].map((row) => (
                <div key={row.k} className="grid grid-cols-[120px_1fr] gap-4 border-t border-neutral-200 pt-4">
                  <dt className="text-xs font-semibold uppercase tracking-widest text-neutral-400">{row.k}</dt>
                  <dd className="text-neutral-700">{row.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <form onSubmit={(e) => e.preventDefault()} className="rounded-3xl bg-white p-8 ring-1 ring-black/5 md:p-10">
            <h2 className="font-display text-2xl">Schedule a demo</h2>
            <p className="mt-1 text-sm text-neutral-500">A specialist will reply within one business day.</p>

            <div className="mt-8 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">First name</span>
                  <input required className="mt-1.5 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/15" />
                </label>
                <label className="block">
                  <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">Last name</span>
                  <input required className="mt-1.5 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/15" />
                </label>
              </div>
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">Work email</span>
                <input type="email" required className="mt-1.5 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/15" />
              </label>
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">Company</span>
                <input className="mt-1.5 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/15" />
              </label>
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">Estimated forms / year</span>
                <select className="mt-1.5 block w-full appearance-none rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm">
                  <option>Under 250</option><option>250 – 1,000</option><option>1,000 – 10,000</option><option>10,000+</option>
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">How can we help?</span>
                <textarea rows={4} className="mt-1.5 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/15" />
              </label>
            </div>

            <button type="submit" className="mt-8 w-full rounded-full bg-brand-primary py-3 text-sm font-medium text-white ring-1 ring-brand-primary transition-transform hover:scale-[1.01] active:scale-95">
              Request demo
            </button>
          </form>
        </div>
      </section>
    </SiteShell>
  );
}