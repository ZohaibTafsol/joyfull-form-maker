import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — 1099ly" },
      { name: "description", content: "Sign in to 1099ly to eFile 1099, W-2, 94x, 1042 and ACA forms with the IRS." },
      { property: "og:title", content: "Sign in — 1099ly" },
      { property: "og:description", content: "Access your 1099ly workspace to manage filings, recipients and integrations." },
      { property: "og:url", content: "/login" },
      { name: "robots", content: "noindex,follow" },
    ],
    links: [{ rel: "canonical", href: "/login" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const [showPw, setShowPw] = useState(false);
  const { login, verifyMfa, mfaPending } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"credentials" | "mfa">(mfaPending ? "mfa" : "credentials");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (step === "credentials") {
        const r = await login(email, password);
        if (r.mfa_required) setStep("mfa");
        else navigate({ to: "/dashboard" });
      } else {
        await verifyMfa(otp);
        navigate({ to: "/dashboard" });
      }
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen bg-neutral-50 font-sans text-neutral-900 lg:grid-cols-2">
      {/* Left panel — editorial */}
      <aside className="relative hidden overflow-hidden bg-brand-primary p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <Link to="/" aria-label="1099ly home" className="inline-flex">
          <span className="inline-flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-[10px] bg-white/15 text-white">
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 5h12l4 4v10a1 1 0 0 1-1 1H4z" /><path d="M16 5v4h4" /><path d="m8 14 2 2 4-4" />
              </svg>
            </span>
            <span className="font-display text-2xl tracking-tight">1099<span className="italic">ly</span><span className="text-brand-accent">.</span></span>
          </span>
        </Link>
        <div>
          <p className="font-display text-4xl leading-[1.05] tracking-tight text-balance md:text-5xl">
            Filing season, <span className="italic">civilized.</span>
          </p>
          <p className="mt-6 max-w-md text-sm text-white/70">
            Sign in to your 1099ly workspace to manage 1099, W-2, 94x, 1042 and ACA filings with real-time TIN matching and combined state filing.
          </p>
        </div>
        <div className="text-xs text-white/50">© {new Date().getFullYear()} 1099ly Inc. · SOC 2 Type II · IRS-authorized eFile provider</div>
        <div aria-hidden className="pointer-events-none absolute -right-32 -top-32 size-[28rem] rounded-full bg-brand-accent/20 blur-3xl" />
      </aside>

      {/* Form */}
      <section className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="lg:hidden">
            <Link to="/"><Logo /></Link>
          </div>
          <h1 className="mt-8 font-display text-4xl tracking-tight md:text-5xl">
            {step === "credentials" ? "Welcome back" : "Two-factor"}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            {step === "credentials"
              ? "Sign in to continue to your 1099ly workspace."
              : "Enter the 6-digit code from your authenticator app."}
          </p>

          {error && (
            <div className="mt-6 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {error}
            </div>
          )}

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            {step === "credentials" ? (
              <>
                <label className="block">
                  <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">Email</span>
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="mt-1.5 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/15"
                  />
                </label>
                <label className="block">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">Password</span>
                    <a href="#" className="text-xs font-medium text-brand-primary hover:underline">Forgot?</a>
                  </div>
                  <div className="relative mt-1.5">
                    <input
                      type={showPw ? "text" : "password"}
                      required
                      minLength={8}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="block w-full rounded-lg border border-neutral-200 bg-white px-3 py-2.5 pr-16 text-sm focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/15"
                    />
                    <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute inset-y-0 right-0 px-3 text-xs font-medium text-neutral-500 hover:text-neutral-900">
                      {showPw ? "Hide" : "Show"}
                    </button>
                  </div>
                </label>
              </>
            ) : (
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">Authentication code</span>
                <input
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength={6}
                  required
                  autoFocus
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="123456"
                  className="mt-1.5 block w-full rounded-lg border border-neutral-200 bg-white px-3 py-3 text-center font-mono text-lg tracking-[0.5em] focus:border-brand-primary focus:outline-none focus:ring-2 focus:ring-brand-primary/15"
                />
              </label>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-brand-primary py-3 text-sm font-medium text-white ring-1 ring-brand-primary transition-transform hover:scale-[1.01] active:scale-95 disabled:opacity-60"
            >
              {loading ? "Please wait…" : step === "credentials" ? "Sign in" : "Verify code"}
            </button>

            {step === "mfa" && (
              <button
                type="button"
                onClick={() => { setStep("credentials"); setOtp(""); }}
                className="w-full text-center text-xs font-medium text-neutral-500 hover:text-neutral-900"
              >
                Back to sign-in
              </button>
            )}
          </form>

          <p className="mt-10 text-sm text-neutral-500">
            New to 1099ly? <Link to="/signup" className="font-medium text-brand-primary hover:underline">Create an account</Link>
          </p>
        </div>
      </section>
    </div>
  );
}