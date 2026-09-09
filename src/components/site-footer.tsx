import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
        <p className="text-xs text-muted-foreground">
          © 2026 Klyro AI — A product of Klyro Technologies. All rights reserved.
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <Link to="/terms" className="hover:text-foreground">
            Terms of Service
          </Link>
          <span aria-hidden className="text-border">
            |
          </span>
          <Link to="/privacy" className="hover:text-foreground">
            Privacy Policy
          </Link>
          <span aria-hidden className="text-border">
            |
          </span>
          <Link to="/refund" className="hover:text-foreground">
            Cancellation & Refund
          </Link>
          <span aria-hidden className="text-border">
            |
          </span>
          <Link to="/contact" className="hover:text-foreground">
            Contact Us
          </Link>
        </nav>
      </div>
    </footer>
  );
}
