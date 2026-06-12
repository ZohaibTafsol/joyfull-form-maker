import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Logo } from "./Logo";

const NAV = [
  { to: "/forms", label: "Tax Forms" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-neutral-50/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" aria-label="1099ly home">
          <Logo />
        </Link>
        <nav>
          <ul className="hidden items-center gap-8 md:flex">
            {NAV.map((n) => (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className="text-sm font-medium text-neutral-600 transition-colors hover:text-neutral-900"
                  activeProps={{ className: "text-sm font-medium text-brand-primary" }}
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden text-sm font-medium text-neutral-600 hover:text-neutral-900 sm:inline">
            Sign in
          </Link>
          <Link
            to="/signup"
            className="rounded-full bg-brand-primary px-4 py-2 text-sm font-medium text-white ring-1 ring-brand-primary transition-transform hover:scale-[1.02] active:scale-95"
          >
            Sign up
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-neutral-200 bg-white py-16">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 md:grid-cols-5">
        <div className="col-span-2 max-w-sm">
          <Logo />
          <p className="mt-6 text-sm leading-relaxed text-neutral-500">
            The modern IRS-authorized eFiling platform. Secure, accurate, and always up to date with IRS changes.
          </p>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Product</h4>
          <ul className="mt-3 space-y-2 text-sm text-neutral-600">
            <li><Link to="/forms" className="hover:text-neutral-900">Tax Forms</Link></li>
            <li><Link to="/pricing" className="hover:text-neutral-900">Pricing</Link></li>
            <li><Link to="/signup" className="hover:text-neutral-900">Get started</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Company</h4>
          <ul className="mt-3 space-y-2 text-sm text-neutral-600">
            <li><Link to="/about" className="hover:text-neutral-900">About</Link></li>
            <li><Link to="/contact" className="hover:text-neutral-900">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">Account</h4>
          <ul className="mt-3 space-y-2 text-sm text-neutral-600">
            <li><Link to="/login" className="hover:text-neutral-900">Sign in</Link></li>
            <li><Link to="/signup" className="hover:text-neutral-900">Create account</Link></li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-7xl items-center justify-between border-t border-neutral-100 px-6 pt-6 text-xs text-neutral-400">
        <p>© {new Date().getFullYear()} 1099ly Inc. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-neutral-600">Twitter</a>
          <a href="#" className="hover:text-neutral-600">LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 selection:bg-brand-accent/30">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}