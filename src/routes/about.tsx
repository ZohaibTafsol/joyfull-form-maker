import { createFileRoute } from "@tanstack/react-router";
import { SiteShell } from "@/components/SiteShell";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About 1099ly — modern IRS-authorized eFiling" },
      { name: "description", content: "1099ly is on a mission to make federal information return filing quiet, accurate and on time for every finance team in America." },
      { property: "og:title", content: "About 1099ly — modern IRS-authorized eFiling" },
      { property: "og:description", content: "Built by finance and tax engineers to replace spreadsheets, paper, and pricey legacy filers." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

function About() {
  return (
    <SiteShell>
      <section className="pt-20 pb-20">
        <div className="mx-auto max-w-3xl px-6">
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest text-brand-primary">About</div>
          <h1 className="font-display text-5xl tracking-tight text-balance md:text-6xl">
            We file <span className="italic text-brand-primary">information returns</span>, so finance teams can do the rest.
          </h1>
          <p className="mt-8 text-lg leading-relaxed text-neutral-600">
            1099ly is an IRS-authorized eFile transmitter for the 1099, W-2, 94x, 1042 and 1095 series. We started as a side project inside an accounting firm
            that filed 40,000 returns a season on legacy software — and decided enterprise tax filing didn’t have to look like 2003.
          </p>
          <p className="mt-4 text-lg leading-relaxed text-neutral-600">
            Today we serve CPAs, marketplaces, payment platforms, and Fortune 500 finance teams. The platform handles real-time TIN matching,
            combined federal/state filing, recipient eDelivery, and a typed API — built to a SOC 2 Type II bar.
          </p>
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-white py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-4">
          {[
            { n: "12M+", l: "Returns transmitted to the IRS" },
            { n: "75%", l: "Avg time saved vs. legacy filers" },
            { n: "SOC 2", l: "Type II audited annually" },
            { n: "4.9/5", l: "Customer rating, all-time" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-4xl md:text-5xl">{s.n}</div>
              <div className="mt-2 text-sm text-neutral-500">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="font-display text-4xl tracking-tight md:text-5xl">What we believe</h2>
          <div className="mt-10 grid gap-8 md:grid-cols-2">
            {[
              { t: "Accuracy is a product feature.", d: "TIN matching, schema validation, and IRS edits run before submission — not after a B-Notice." },
              { t: "Pricing should be honest.", d: "Pay per filed form, billed when transmitted. No seats, no platform fees, no surprise overages." },
              { t: "Filing should be quiet.", d: "Compliance is plumbing. Our job is to disappear into your workflow, not become another one." },
              { t: "Security is non-negotiable.", d: "Encrypted at rest and in transit, audited to SOC 2 Type II, with granular role-based controls." },
            ].map((b) => (
              <div key={b.t}>
                <h3 className="font-display text-2xl">{b.t}</h3>
                <p className="mt-2 text-neutral-600">{b.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}