import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TaxForm — Tax compliance, civilized." },
      { name: "description", content: "Automated 1099, W-2, and 1042-S e-filing for modern finance teams. Real-time TIN matching, bulk import, state delivery." },
      { property: "og:title", content: "TaxForm — Tax compliance, civilized." },
      { property: "og:description", content: "Automated 1099, W-2, and 1042-S e-filing for modern finance teams." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 selection:bg-brand-accent/30">
      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-neutral-50/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-8">
            <span className="font-display text-2xl font-medium tracking-tight text-brand-primary">TaxForm.</span>
            <div className="hidden gap-6 sm:flex">
              <a href="#solutions" className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900">Solutions</a>
              <a href="#forms" className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900">Forms</a>
              <a href="#pricing" className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900">Pricing</a>
              <a href="#faq" className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900">FAQ</a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-neutral-600 hover:text-neutral-900">Sign in</button>
            <button className="rounded-full bg-brand-primary px-4 py-2 text-sm font-medium text-white ring-1 ring-brand-primary transition-transform hover:scale-[1.02] active:scale-95">
              Start filing
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                IRS-authorized e-file provider
              </div>
              <h1 className="max-w-[15ch] font-display text-5xl leading-none tracking-tight text-balance md:text-7xl">
                Tax compliance, <span className="italic text-brand-primary">civilized.</span>
              </h1>
              <p className="mt-8 max-w-[48ch] text-lg leading-relaxed text-neutral-600 text-pretty">
                The automated reporting layer for modern finance teams. Handle 1099s, W-2s, and 1042-S filings with real-time TIN matching and automated state delivery.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <button className="rounded-full bg-brand-primary px-8 py-4 text-base font-medium text-white ring-1 ring-brand-primary transition-transform hover:scale-[1.02] active:scale-95">
                  Create free account
                </button>
                <button className="rounded-full bg-white px-8 py-4 text-base font-medium text-neutral-900 ring-1 ring-black/5 transition-transform hover:scale-[1.02] active:scale-95">
                  View documentation
                </button>
              </div>
              <div className="mt-12 flex items-center gap-8 text-xs text-neutral-500">
                <div>
                  <div className="font-display text-2xl text-neutral-900">500k+</div>
                  <div>Forms filed</div>
                </div>
                <div className="h-8 w-px bg-neutral-200" />
                <div>
                  <div className="font-display text-2xl text-neutral-900">99.98%</div>
                  <div>Acceptance rate</div>
                </div>
                <div className="h-8 w-px bg-neutral-200" />
                <div>
                  <div className="font-display text-2xl text-neutral-900">SOC 2</div>
                  <div>Type II certified</div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-[24px] bg-white p-2 ring-1 ring-black/5 shadow-2xl shadow-brand-primary/5">
                <div className="rounded-[16px] border border-neutral-100 bg-neutral-50 p-6">
                  <div className="mb-8 flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="text-xs font-medium uppercase tracking-wider text-neutral-400">Active Batch</div>
                      <div className="text-sm font-semibold">FY2024 Contractor Payouts</div>
                    </div>
                    <div className="grid size-8 place-items-center rounded-full bg-brand-accent/10 text-brand-primary">
                      <div className="size-4 rounded-sm border-2 border-current" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    {[
                      { name: "Acme Design Co.", form: "Form 1099-NEC", tag: "Verified", tone: "emerald" },
                      { name: "Global Logistics Corp", form: "Form 1099-MISC", tag: "Pending TIN", tone: "amber" },
                      { name: "Northwind Studios", form: "Form W-2", tag: "Verified", tone: "emerald" },
                      { name: "Helios Partners LLP", form: "Form 1042-S", tag: "Filed", tone: "emerald" },
                    ].map((row) => (
                      <div key={row.name} className="flex items-center justify-between rounded-lg bg-white p-3 ring-1 ring-black/5">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-full bg-neutral-100" />
                          <div>
                            <div className="text-xs font-semibold">{row.name}</div>
                            <div className="text-[10px] text-neutral-400">{row.form}</div>
                          </div>
                        </div>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${row.tone === "emerald" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                          {row.tag}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Forms Grid */}
      <section id="forms" className="bg-neutral-100 py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-primary">Form library</div>
            <h2 className="font-display text-4xl tracking-tight text-balance md:text-5xl">Supported reporting</h2>
            <p className="mt-4 max-w-[52ch] text-neutral-600">Every federal and state form your business needs to stay compliant — from contractor pay to international withholding.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { code: "1099-NEC", desc: "Non-employee compensation for contractors and freelancers." },
              { code: "1099-MISC", desc: "Royalties, rents, and other miscellaneous income reports." },
              { code: "1099-K", desc: "Payment card and third-party network transactions." },
              { code: "1099-DIV", desc: "Dividends and distributions from investment accounts." },
              { code: "W-2", desc: "Electronic filing and digital delivery for all your employees." },
              { code: "W-9", desc: "Request and securely store taxpayer identification numbers." },
              { code: "1042-S", desc: "Foreign person's U.S. source income subject to withholding." },
              { code: "941 / 940", desc: "Quarterly and annual federal employment tax returns." },
            ].map((f) => (
              <div key={f.code} className="group rounded-[20px] bg-white p-8 ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-primary/5">
                <div className="mb-6 grid size-10 place-items-center rounded-xl bg-brand-accent/10 text-brand-primary">
                  <div className="size-4 rounded-sm border-2 border-current" />
                </div>
                <h3 className="font-semibold">{f.code}</h3>
                <p className="mt-2 text-sm text-neutral-500 text-pretty">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="solutions" className="py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-primary">Workflow</div>
              <h2 className="font-display text-4xl tracking-tight text-balance md:text-5xl">
                Built for finance teams who&apos;d <span className="italic text-brand-primary">rather not</span> think about tax season.
              </h2>
              <p className="mt-6 text-neutral-600">Import, validate, file, and deliver — all from one quiet workspace. No spreadsheets, no envelopes, no surprise B-Notices.</p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {[
                { title: "Real-time TIN matching", desc: "Validate names and TINs against IRS records the moment you import them." },
                { title: "Bulk import & API", desc: "Push thousands of records via CSV, QuickBooks, Xero, or our typed REST API." },
                { title: "Combined state filing", desc: "Automatic CF/SF participation plus direct filing for every other state." },
                { title: "Secure digital delivery", desc: "Recipients get encrypted e-delivery with full IRS-compliant consent capture." },
              ].map((f) => (
                <div key={f.title} className="rounded-2xl bg-white p-6 ring-1 ring-black/5">
                  <div className="mb-4 grid size-9 place-items-center rounded-lg bg-brand-primary text-white">
                    <div className="size-3.5 rounded-sm border-2 border-current" />
                  </div>
                  <h3 className="font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-neutral-500 text-pretty">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Integrations marquee */}
      <section className="border-y border-neutral-200 bg-white py-12 overflow-hidden">
        <div className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Integrates with the stack you already run
        </div>
        <div className="flex animate-marquee gap-16 whitespace-nowrap">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              {["QuickBooks", "Xero", "NetSuite", "Sage Intacct", "Workday", "FreshBooks", "Bill.com", "Gusto"].map((n) => (
                <span key={n} className="text-sm font-semibold uppercase tracking-widest text-neutral-400">{n}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-32">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-display text-3xl leading-tight text-balance md:text-5xl">
            &ldquo;We filed <span className="italic text-brand-primary">3,400 1099s</span> in an afternoon. Last year that was a two-week project.&rdquo;
          </p>
          <div className="mt-10 flex items-center justify-center gap-3 text-sm text-neutral-500">
            <div className="size-10 rounded-full bg-neutral-200" />
            <div className="text-left">
              <div className="font-semibold text-neutral-900">Priya Shah</div>
              <div>Controller, Northwind Studios</div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-neutral-100 py-32">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-primary">Pricing</div>
            <h2 className="font-display text-4xl tracking-tight md:text-5xl">Transparent for every scale</h2>
            <p className="mx-auto mt-4 max-w-[48ch] text-neutral-600">Start free, pay only for what you file. No platform fees, no surprise overages.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { name: "Growth", price: "$0", suffix: "/mo", desc: "Pay only for what you file. Perfect for small startups.", features: ["Unlimited recipients", "Federal e-file", "Email delivery"], muted: ["API access", "Bulk TIN matching"], cta: "Start for free", highlight: false },
              { name: "Professional", price: "$49", suffix: "/mo", desc: "Advanced compliance tools for medium enterprises.", features: ["Bulk TIN matching", "Full API integration", "Combined state filing", "Priority support"], muted: [], cta: "Choose Pro", highlight: true },
              { name: "Platform", price: "Custom", suffix: "", desc: "Bespoke solutions for white-labeling and high volume.", features: ["Dedicated support", "Custom contracts", "SSO & SCIM", "Audit log export"], muted: [], cta: "Contact sales", highlight: false },
            ].map((t) => (
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
                      <div className="flex size-4 items-center justify-center rounded-full bg-emerald-500/10">
                        <div className="size-1.5 rounded-full bg-emerald-600" />
                      </div>
                      {f}
                    </li>
                  ))}
                  {t.muted.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm text-neutral-400">
                      <div className="size-4 rounded-full bg-neutral-100" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`mt-8 w-full rounded-full py-3 text-sm font-medium transition-colors ${t.highlight ? "bg-brand-primary text-white hover:opacity-90" : "ring-1 ring-black/10 hover:bg-neutral-50"}`}>
                  {t.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-display text-4xl tracking-tight md:text-5xl">Frequently asked</h2>
          <div className="mt-12 divide-y divide-neutral-200 border-y border-neutral-200">
            {[
              { q: "Is TaxForm an IRS-authorized e-file provider?", a: "Yes. TaxForm is an IRS-authorized transmitter for 1099, W-2, 1042-S, and 94x series filings." },
              { q: "Which states do you support for combined filing?", a: "All states participating in the CF/SF program, plus direct filing for the remaining states with reporting requirements." },
              { q: "How does TIN matching work?", a: "We check recipient name + TIN against IRS records in real time as you import, so you never file a return that will bounce back as a B-Notice." },
              { q: "Can recipients opt into digital delivery?", a: "Yes — we capture IRS-compliant electronic consent and deliver encrypted PDFs to each recipient." },
            ].map((row) => (
              <details key={row.q} className="group py-6">
                <summary className="flex cursor-pointer items-center justify-between text-base font-semibold">
                  {row.q}
                  <span className="ml-4 grid size-6 place-items-center rounded-full bg-neutral-100 text-neutral-500 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-neutral-600">{row.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-brand-primary p-12 text-center md:p-20">
          <h2 className="font-display text-4xl leading-tight text-white text-balance md:text-6xl">
            File this season, <span className="italic">quietly.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[48ch] text-white/70">Free to start. No credit card. Filed returns priced per form, billed only when transmitted to the IRS.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <button className="rounded-full bg-white px-8 py-4 text-base font-medium text-brand-primary transition-transform hover:scale-[1.02] active:scale-95">
              Create free account
            </button>
            <button className="rounded-full bg-white/10 px-8 py-4 text-base font-medium text-white ring-1 ring-white/20 transition-colors hover:bg-white/20">
              Talk to sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col justify-between gap-12 md:flex-row">
            <div className="max-w-sm">
              <span className="font-display text-2xl font-medium tracking-tight text-brand-primary">TaxForm.</span>
              <p className="mt-6 text-sm leading-relaxed text-neutral-500">
                Built by tax professionals and engineers. Secure, accurate, and always up to date with IRS changes.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12 sm:grid-cols-3">
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Product</h4>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li><a href="#" className="transition-colors hover:text-neutral-900">e-File API</a></li>
                  <li><a href="#" className="transition-colors hover:text-neutral-900">TIN Matching</a></li>
                  <li><a href="#" className="transition-colors hover:text-neutral-900">Digital Delivery</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Company</h4>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li><a href="#" className="transition-colors hover:text-neutral-900">About</a></li>
                  <li><a href="#" className="transition-colors hover:text-neutral-900">Careers</a></li>
                  <li><a href="#" className="transition-colors hover:text-neutral-900">Trust Center</a></li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Compliance</h4>
                <ul className="space-y-2 text-sm text-neutral-600">
                  <li><a href="#" className="transition-colors hover:text-neutral-900">IRS SOC 2</a></li>
                  <li><a href="#" className="transition-colors hover:text-neutral-900">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-24 flex items-center justify-between border-t border-neutral-100 pt-8 text-xs text-neutral-400">
            <p>© 2024 TaxForm Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-neutral-600">Twitter</a>
              <a href="#" className="hover:text-neutral-600">LinkedIn</a>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-marquee { animation: marquee 40s linear infinite; }
      `}</style>
    </div>
  );
}
