import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "1099ly — eFile 1099, W-2, 94x, 1042 & ACA forms" },
      { name: "description", content: "1099ly is the modern IRS-authorized eFiling platform for 1099, W-2, 94x, 1042 and 1095 forms. Real-time TIN matching, bulk import, state filing." },
      { property: "og:title", content: "1099ly — eFile 1099, W-2, 94x, 1042 & ACA forms" },
      { property: "og:description", content: "Fast, accurate, on-time eFiling for finance teams and accountants." },
      { property: "og:url", content: "/" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "1099ly",
        description: "IRS-authorized eFiling platform for 1099, W-2, 94x, 1042 and ACA forms.",
        url: "/",
      }),
    }],
  }),
  component: Index,
});

/* ---------- Nav data sourced from tax1099 information architecture ---------- */

const FORM_GROUPS: { title: string; items: string[] }[] = [
  { title: "1099 Forms", items: ["1099-NEC", "1099-MISC", "1099-INT", "1099-K", "1099-DIV", "1099-R", "1099-S", "1099-PATR", "1099-B", "1099-C", "1099-OID", "1099-A", "1099-SA", "1099-Q", "1099-G", "1099-DA", "1099-HC", "1099-LS", "1099-QA", "1099 Corrections"] },
  { title: "Payroll", items: ["940", "941", "941-X", "943", "943-X", "944", "944-X", "945"] },
  { title: "Wage & W-2", items: ["W-2", "W-2C", "W-2VI", "W-2GU"] },
  { title: "ACA & 1095", items: ["1095-B", "1095-C", "ACA Corrections"] },
  { title: "1098 / 5498", items: ["1098", "1098-C", "1098-T", "1098-E", "5498", "5498-SA", "5498-ESA"] },
  { title: "Tax Exempt", items: ["990", "990-N", "990-T", "990-PF", "990-EZ"] },
  { title: "Extensions", items: ["8809", "7004", "4868", "8027", "8868", "8955-SSA"] },
  { title: "1042 / Stock / 480", items: ["1042", "1042-S", "3921", "3922", "480.6A", "480.6B", "480.6D", "480.7A"] },
];

const SOLUTIONS = [
  { title: "For Accountants & CPAs", desc: "Multi-client workspace with team controls and bulk imports." },
  { title: "For Large Enterprise", desc: "API, SSO, audit trails, and dedicated implementation support." },
  { title: "For Small & Medium Business", desc: "Guided eFiling and a fair pay-per-form price." },
  { title: "For Gig Economy", desc: "High-volume 1099-NEC and 1099-K with real-time TIN match." },
  { title: "For Online Marketplaces & FBA", desc: "1099-K reporting tooling for platform operators." },
  { title: "For Crypto Exchanges", desc: "1099-DA, 1099-B, and digital asset cost-basis support." },
  { title: "For Affiliate Partners", desc: "Revenue share program for resellers and consultants." },
  { title: "For Developers", desc: "Typed REST API, webhooks, sandbox, and idempotency keys." },
];

const STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","DC","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

const FEATURES = [
  "eFile with IRS, SSA & CFSF",
  "Smart eFiling with AI",
  "Corrected / Void form eFiling",
  "Scheduled eFiling",
  "W-9 / W-8 Manager",
  "Print and Mail",
  "IRS-Compliant eDelivery",
  "Real-time TIN Match",
  "Bulk TIN Matching",
  "Resubmission of IRS-rejected forms",
  "Audit Trails",
  "12+ Accounting Integrations",
  "API Integration",
  "24/7 AI chat assistance",
  "1096 / W3 summary forms",
  "4 years of secured storage",
  "Pre-built Reports",
  "Team & User Management",
  "Single Sign-on",
  "Workflow Management",
  "Two-Factor Authentication",
  "USPS Address Validation",
];

const INTEGRATIONS = ["QuickBooks Desktop", "QuickBooks Online", "Xero", "BILL", "Oracle NetSuite", "Sage Intacct", "FreshBooks", "Zoho Books", "Tipalti", "Entrata", "Excel", "Zapier"];

const RESOURCES = [
  { label: "Webinars" }, { label: "Customer Stories" }, { label: "Glossary" }, { label: "White Papers" }, { label: "Blog" }, { label: "How-To Videos" }, { label: "Podcast" }, { label: "ROI Calculator" }, { label: "Price Calculator" }, { label: "Worker Classification" }, { label: "OBBBA State Conformity" }, { label: "Pre-Season Readiness Checker" }, { label: "IRS Filing Deadlines" }, { label: "IRS Penalty Estimator" },
];

/* ---------- Components ---------- */

function MegaItem({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <li className="group/menu relative">
      <button className="flex items-center gap-1 text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900">
        {label}
        <svg viewBox="0 0 12 12" className="size-3 transition-transform group-hover/menu:rotate-180" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="m3 4.5 3 3 3-3" /></svg>
      </button>
      <div
        className={`pointer-events-none invisible absolute left-1/2 top-full z-50 mt-3 -translate-x-1/2 translate-y-2 rounded-2xl border border-neutral-200 bg-white p-6 opacity-0 shadow-2xl shadow-brand-primary/5 ring-1 ring-black/[0.02] transition-all duration-200 group-hover/menu:visible group-hover/menu:translate-y-0 group-hover/menu:opacity-100 group-hover/menu:pointer-events-auto ${
          wide ? "w-[820px]" : "w-[360px]"
        }`}
      >
        {children}
      </div>
    </li>
  );
}

function NavBar() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-neutral-50/80 backdrop-blur-md">
      {/* utility row */}
      <div className="hidden border-b border-neutral-200/70 bg-white/60 md:block">
        <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-6 text-xs text-neutral-500">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              IRS-authorized eFile provider · SOC 2 Type II
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-neutral-900">Contact</a>
            <a href="#" className="hover:text-neutral-900">Schedule a demo</a>
            <a href="#" className="hover:text-neutral-900">Status</a>
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-10">
          <Logo />
          <nav>
            <ul className="hidden items-center gap-7 lg:flex">
              <MegaItem label="Tax Forms" wide>
                <div className="grid grid-cols-3 gap-x-8 gap-y-6">
                  {FORM_GROUPS.map((g) => (
                    <div key={g.title}>
                      <div className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-brand-primary">{g.title}</div>
                      <ul className="space-y-1.5">
                        {g.items.slice(0, 8).map((it) => (
                          <li key={it}><a href="#" className="text-sm text-neutral-600 hover:text-neutral-900">Form {it}</a></li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between border-t border-neutral-100 pt-4 text-xs">
                  <span className="text-neutral-500">Need a form not listed? We support 40+ federal forms.</span>
                  <a href="#forms" className="font-medium text-brand-primary hover:underline">View all forms →</a>
                </div>
              </MegaItem>

              <MegaItem label="Solutions" wide>
                <div className="grid grid-cols-2 gap-3">
                  {SOLUTIONS.map((s) => (
                    <a key={s.title} href="#solutions" className="rounded-xl p-3 transition-colors hover:bg-neutral-50">
                      <div className="text-sm font-semibold text-neutral-900">{s.title}</div>
                      <div className="mt-1 text-xs text-neutral-500">{s.desc}</div>
                    </a>
                  ))}
                </div>
              </MegaItem>

              <MegaItem label="State Filing">
                <div className="text-[10px] font-semibold uppercase tracking-widest text-brand-primary">1099 · W-2 · ACA · Payroll</div>
                <div className="mt-3 grid grid-cols-6 gap-1.5 text-center">
                  {STATES.map((s) => (
                    <a key={s} href="#" className="rounded-md py-1 text-xs font-medium text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900">{s}</a>
                  ))}
                </div>
                <a href="#" className="mt-4 block border-t border-neutral-100 pt-3 text-xs font-medium text-brand-primary hover:underline">All state filing requirements →</a>
              </MegaItem>

              <MegaItem label="Features" wide>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  {FEATURES.map((f) => (
                    <a key={f} href="#features" className="text-sm text-neutral-600 hover:text-neutral-900">{f}</a>
                  ))}
                </div>
              </MegaItem>

              <li><Link to="/forms" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">Forms</Link></li>
              <li><Link to="/pricing" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">Pricing</Link></li>
              <li><Link to="/about" className="text-sm font-medium text-neutral-600 hover:text-neutral-900">About</Link></li>

              <MegaItem label="Resources">
                <div className="grid grid-cols-2 gap-2">
                  {RESOURCES.map((r) => (
                    <a key={r.label} href="#" className="rounded-md px-2 py-1.5 text-sm text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900">{r.label}</a>
                  ))}
                </div>
              </MegaItem>
            </ul>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/contact" className="hidden text-sm font-medium text-neutral-600 hover:text-neutral-900 md:inline">Get a Demo</Link>
          <Link to="/login" className="hidden text-sm font-medium text-neutral-600 hover:text-neutral-900 md:inline">Sign in</Link>
          <Link to="/signup" className="rounded-full bg-brand-primary px-4 py-2 text-sm font-medium text-white ring-1 ring-brand-primary transition-transform hover:scale-[1.02] active:scale-95">
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}

function Index() {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 selection:bg-brand-accent/30">
      <NavBar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-col justify-center">
              <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Award-winning IRS-authorized eFiling platform
              </div>
              <h1 className="max-w-[18ch] font-display text-5xl leading-[1.02] tracking-tight text-balance md:text-7xl">
                File 1099, W-2, 94x, 1042 & 1095 forms <span className="italic text-brand-primary">civilized.</span>
              </h1>
              <p className="mt-7 max-w-[52ch] text-lg leading-relaxed text-neutral-600 text-pretty">
                eFile Federal, State & SSA with a guided, end-to-end workflow. An AI copilot flags issues before you submit — and prices start at $0.68 per form.
              </p>
              <div className="mt-10 flex flex-wrap gap-4">
                <a href="#" className="rounded-full bg-brand-primary px-8 py-4 text-base font-medium text-white ring-1 ring-brand-primary transition-transform hover:scale-[1.02] active:scale-95">eFile Now</a>
                <a href="#" className="rounded-full bg-white px-8 py-4 text-base font-medium text-neutral-900 ring-1 ring-black/5 transition-transform hover:scale-[1.02] active:scale-95">Get a Demo</a>
              </div>
              <ul className="mt-10 grid max-w-lg grid-cols-1 gap-3 text-sm text-neutral-600 sm:grid-cols-2">
                {["Federal, State & SSA in one workflow", "Ideal for businesses of all sizes", "AI Copilot catches issues pre-submit", "Pricing as low as $0.68 / form"].map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <span className="mt-1 grid size-4 place-items-center rounded-full bg-brand-accent/15 text-brand-primary">
                      <svg viewBox="0 0 12 12" className="size-2.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m2.5 6 2.5 2.5L9.5 3.5" /></svg>
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>

            {/* Price calculator card */}
            <div className="relative">
              <div className="rounded-[24px] bg-white p-2 ring-1 ring-black/5 shadow-2xl shadow-brand-primary/10">
                <div className="rounded-[16px] border border-neutral-100 bg-neutral-50 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-medium uppercase tracking-wider text-neutral-400">Price Calculator</div>
                      <div className="text-sm font-semibold">Estimate your filing cost</div>
                    </div>
                    <span className="rounded-full bg-brand-accent/15 px-2 py-0.5 text-[10px] font-medium text-brand-primary">Transparent</span>
                  </div>

                  <div className="mt-6 space-y-3">
                    <label className="block">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">Form type</span>
                      <select className="mt-1 w-full appearance-none rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm">
                        <option>Form 1099-NEC</option><option>Form 1099-MISC</option><option>Form 1099-K</option><option>Form W-2</option><option>Form 941</option><option>Form 1042-S</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">State</span>
                      <select className="mt-1 w-full appearance-none rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm">
                        <option>California</option><option>New York</option><option>Texas</option><option>Florida</option><option>Illinois</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-400">Number of forms</span>
                      <input defaultValue={50} type="number" className="mt-1 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm" />
                    </label>
                  </div>

                  <div className="mt-6 flex items-end justify-between rounded-xl bg-brand-primary p-4 text-white">
                    <div>
                      <div className="text-[10px] font-medium uppercase tracking-wider text-white/70">Per form</div>
                      <div className="font-display text-4xl leading-none">$1.63</div>
                    </div>
                    <a href="#" className="rounded-full bg-white px-4 py-2 text-xs font-semibold text-brand-primary">Get a quote</a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* stats strip */}
          <div className="mt-20 grid grid-cols-2 gap-8 border-t border-neutral-200 pt-10 md:grid-cols-4">
            {[
              { n: "75%", l: "Savings on compliance time & cost" },
              { n: "3×", l: "Faster with integrated solutions" },
              { n: "24/7", l: "AI tax assistance, in-app" },
              { n: "4.9/5", l: "Customer rating, all-time" },
            ].map((s) => (
              <div key={s.l}>
                <div className="font-display text-4xl text-neutral-900 md:text-5xl">{s.n}</div>
                <div className="mt-2 text-sm text-neutral-500">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Forms Grid */}
      <section id="forms" className="bg-neutral-100 py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-primary">Form Library</div>
              <h2 className="font-display text-4xl tracking-tight text-balance md:text-5xl">Every form you need to stay compliant</h2>
            </div>
            <p className="max-w-sm text-sm text-neutral-600">1099, W-2, ACA, 1042, 990, 1098, 5498, payroll & extension forms — all in one workspace.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {FORM_GROUPS.map((g) => (
              <div key={g.title} className="rounded-[20px] bg-white p-6 ring-1 ring-black/5">
                <div className="mb-4 flex items-center gap-2">
                  <div className="grid size-8 place-items-center rounded-lg bg-brand-accent/15 text-brand-primary">
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 4h11l3 3v13H5z" /><path d="M16 4v3h3" /></svg>
                  </div>
                  <h3 className="text-sm font-semibold">{g.title}</h3>
                </div>
                <ul className="flex flex-wrap gap-1.5">
                  {g.items.map((it) => (
                    <li key={it}>
                      <a href="#" className="rounded-md bg-neutral-50 px-2 py-1 text-xs font-medium text-neutral-600 ring-1 ring-black/5 transition-colors hover:bg-brand-primary hover:text-white">
                        {it}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section id="solutions" className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-primary">Solutions</div>
              <h2 className="font-display text-4xl tracking-tight text-balance md:text-5xl">
                Built for the team that <span className="italic text-brand-primary">owns</span> the filing.
              </h2>
              <p className="mt-6 text-neutral-600">From a single-CPA shop to a public marketplace processing millions of payouts, 1099ly scales with the work.</p>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {SOLUTIONS.map((s) => (
                <div key={s.title} className="rounded-2xl bg-white p-6 ring-1 ring-black/5 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-brand-primary/5">
                  <div className="mb-4 grid size-9 place-items-center rounded-lg bg-brand-primary text-white">
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 7h18M6 7v13h12V7" /><path d="M9 4h6v3H9z" /></svg>
                  </div>
                  <h3 className="text-sm font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-neutral-500">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-neutral-100 py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-primary">Platform Features</div>
            <h2 className="font-display text-4xl tracking-tight text-balance md:text-5xl">Everything in one quiet workspace</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f} className="flex items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-black/5">
                <span className="grid size-7 place-items-center rounded-md bg-brand-accent/15 text-brand-primary">
                  <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="2"><path d="m2.5 6 2.5 2.5L9.5 3.5" /></svg>
                </span>
                <span className="text-sm font-medium text-neutral-800">{f}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations marquee */}
      <section className="border-y border-neutral-200 bg-white py-12 overflow-hidden">
        <div className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Integrates with the accounting stack you already run
        </div>
        <div className="flex animate-marquee gap-16 whitespace-nowrap">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center gap-12 px-6">
              {INTEGRATIONS.map((n) => (
                <span key={n} className="text-sm font-semibold uppercase tracking-widest text-neutral-400">{n}</span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* State filing */}
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
            <div>
              <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-primary">State Filing</div>
              <h2 className="font-display text-4xl tracking-tight md:text-5xl">All 50 states, one workflow</h2>
              <p className="mt-4 max-w-xl text-neutral-600">Combined Federal/State (CF/SF) plus direct filing for every other reporting jurisdiction — 1099, W-2, ACA, and state payroll.</p>
            </div>
            <a href="#" className="text-sm font-medium text-brand-primary hover:underline">View state requirements →</a>
          </div>
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-10 md:grid-cols-13">
            {STATES.map((s) => (
              <a key={s} href="#" className="grid aspect-square place-items-center rounded-lg bg-white text-sm font-semibold text-neutral-700 ring-1 ring-black/5 transition-colors hover:bg-brand-primary hover:text-white">{s}</a>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="bg-neutral-100 py-28">
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
      <section id="pricing" className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-primary">Pricing</div>
            <h2 className="font-display text-4xl tracking-tight md:text-5xl">Transparent for every scale</h2>
            <p className="mx-auto mt-4 max-w-[48ch] text-neutral-600">Start free. Pay only per filed form — no platform fees, no surprise overages.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              { name: "Starter", price: "$0.68", suffix: "/form", desc: "Pay only for what you file. Perfect for small businesses.", features: ["Federal eFile", "Email & print delivery", "Unlimited recipients", "Email support"], highlight: false, cta: "Start for free" },
              { name: "Professional", price: "$1.63", suffix: "/form", desc: "Most popular for finance teams and accountants.", features: ["Everything in Starter", "Bulk TIN matching", "Combined state filing", "12+ integrations", "Priority support"], highlight: true, cta: "Choose Professional" },
              { name: "Enterprise", price: "Custom", suffix: "", desc: "API, SSO and white-glove implementation.", features: ["Full API access", "SSO & SCIM", "Audit log export", "Dedicated CSM", "Custom contracts"], highlight: false, cta: "Contact sales" },
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
                      <span className="grid size-4 place-items-center rounded-full bg-emerald-500/10">
                        <span className="size-1.5 rounded-full bg-emerald-600" />
                      </span>
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
      <section className="bg-neutral-100 py-28">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-display text-4xl tracking-tight md:text-5xl">Frequently asked</h2>
          <div className="mt-12 divide-y divide-neutral-200 border-y border-neutral-200">
            {[
              { q: "Is 1099ly an IRS-authorized eFile provider?", a: "Yes. 1099ly is an IRS-authorized transmitter for 1099, W-2, 1042-S, 1095, and 94x series filings." },
              { q: "Which states do you support?", a: "All states that participate in the CF/SF program, plus direct filing for the remaining states with 1099, W-2, ACA, or payroll reporting requirements." },
              { q: "How does real-time TIN matching work?", a: "We validate recipient name + TIN against IRS records the moment you import them, so you never file a return that bounces back as a B-Notice." },
              { q: "Can recipients opt into digital delivery?", a: "Yes — we capture IRS-compliant electronic consent and deliver encrypted PDFs to each recipient. Print-and-mail is one click away for the rest." },
              { q: "Do you offer an API?", a: "Yes. A typed REST API with sandbox, webhooks, and idempotency keys. Built for high-volume marketplaces and payment platforms." },
            ].map((row) => (
              <details key={row.q} className="group py-6">
                <summary className="flex cursor-pointer items-center justify-between text-base font-semibold">
                  {row.q}
                  <span className="ml-4 grid size-6 place-items-center rounded-full bg-white text-neutral-500 transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 max-w-[60ch] text-sm leading-relaxed text-neutral-600">{row.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-28">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-brand-primary p-12 text-center md:p-20">
          <h2 className="font-display text-4xl leading-tight text-white text-balance md:text-6xl">
            File this season, <span className="italic">quietly.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[48ch] text-white/70">Free to start. No credit card. Filed returns priced per form — billed only when transmitted to the IRS.</p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="#" className="rounded-full bg-white px-8 py-4 text-base font-medium text-brand-primary transition-transform hover:scale-[1.02] active:scale-95">Create free account</a>
            <a href="#" className="rounded-full bg-white/10 px-8 py-4 text-base font-medium text-white ring-1 ring-white/20 transition-colors hover:bg-white/20">Talk to sales</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-5">
            <div className="col-span-2 max-w-sm">
              <Logo />
              <p className="mt-6 text-sm leading-relaxed text-neutral-500">
                The modern IRS-authorized eFiling platform. Secure, accurate, and always up to date with IRS changes.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Forms</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                {["1099-NEC", "1099-MISC", "W-2", "941", "1042-S", "1095-C"].map((f) => <li key={f}><a href="#" className="hover:text-neutral-900">Form {f}</a></li>)}
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Product</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                {["API", "Integrations", "TIN Match", "eDelivery", "Pricing"].map((f) => <li key={f}><a href="#" className="hover:text-neutral-900">{f}</a></li>)}
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Company</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                {["About", "Careers", "Trust Center", "Privacy", "Contact"].map((f) => <li key={f}><a href="#" className="hover:text-neutral-900">{f}</a></li>)}
              </ul>
            </div>
          </div>
          <div className="mt-16 flex items-center justify-between border-t border-neutral-100 pt-6 text-xs text-neutral-400">
            <p>© 2025 1099ly Inc. All rights reserved.</p>
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