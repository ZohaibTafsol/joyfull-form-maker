import { createFileRoute, Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your free 1099ly account" },
      { name: "description", content: "Start eFiling 1099, W-2, 94x, 1042 and ACA forms in minutes. No credit card. Pay only per filed form." },
      { property: "og:title", content: "Create your free 1099ly account" },
      { property: "og:description", content: "IRS-authorized eFiling for finance teams and accountants. Start free." },
      { property: "og:url", content: "/signup" },
      { name: "robots", content: "noindex,follow" },
    ],
    links: [{ rel: "canonical", href: "/signup" }],
  }),
  component: SignupPage,
});

function SignupPage() {
  return (
    <div className="grid min-h-screen bg-neutral-50 font-sans text-neutral-900 lg:grid-cols-[1.05fr_0.95fr]">
      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <Link to="/"><Logo /></Link>
          <h1 className="mt-8 font-display text-4xl tracking-tight md:text-5xl">Create your account</h1>
          <p className="mt-2 text-sm text-neutral-500">Free to start. Pay only per filed form — billed only when transmitted to the IRS.</p>

          <form className="mt-10 space-y-5" onSubmit={(e) => e.preventDefault()}>
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
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">Password</span>
              <input type="password" required minLength={8} className="mt-1.5 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/15" />
              <span className="mt-1 block text-[11px] text-neutral-400">At least 8 characters.</span>
            </label>

            <button type="submit" className="w-full rounded-full bg-brand-primary py-3 text-sm font-medium text-white ring-1 ring-brand-primary transition-transform hover:scale-[1.01] active:scale-95">
              Create free account
            </button>
            <p className="text-[11px] text-neutral-400">
              By creating an account you agree to our Terms and acknowledge our Privacy Policy.
            </p>
          </form>

          <p className="mt-8 text-sm text-neutral-500">
            Already have an account? <Link to="/login" className="font-medium text-brand-primary hover:underline">Sign in</Link>
          </p>
        </div>
      </section>

      <aside className="relative hidden overflow-hidden bg-neutral-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="text-xs uppercase tracking-widest text-white/50">What you get</div>
        <ul className="space-y-5">
          {[
            "Federal, State & SSA filing in one workflow",
            "Real-time TIN matching to prevent B-Notices",
            "Bulk import from QuickBooks, Xero, NetSuite",
            "IRS-compliant electronic recipient delivery",
            "Pricing from $0.68 per form — no platform fees",
          ].map((b) => (
            <li key={b} className="flex items-start gap-3 font-display text-2xl leading-snug text-balance">
              <span className="mt-2 grid size-5 shrink-0 place-items-center rounded-full bg-brand-accent/20 text-brand-accent">
                <svg viewBox="0 0 12 12" className="size-3" fill="none" stroke="currentColor" strokeWidth="2"><path d="m2.5 6 2.5 2.5L9.5 3.5" /></svg>
              </span>
              {b}
            </li>
          ))}
        </ul>
        <div className="text-xs text-white/40">IRS-authorized eFile provider · SOC 2 Type II</div>
        <div aria-hidden className="pointer-events-none absolute -left-32 bottom-0 size-[28rem] rounded-full bg-brand-primary/40 blur-3xl" />
      </aside>
    </div>
  );
}