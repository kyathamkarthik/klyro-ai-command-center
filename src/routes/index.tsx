import { Link, createFileRoute } from "@tanstack/react-router";
import {
  ArrowRight,
  CircuitBoard,
  FileSearch,
  Mail,
  ShieldCheck,
  Wand2,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Klyro AI | Autonomous Error Recovery for SAP Integration Suite" },
      {
        name: "description",
        content:
          "Klyro AI observes SAP Integration Suite message processing logs, heals malformed payloads with semantic mapping, and escalates only what needs a human decision.",
      },
      { property: "og:title", content: "Klyro AI | Autonomous SAP Integration Recovery" },
      {
        property: "og:description",
        content:
          "Autonomous MPL inspection, semantic schema healing, and circuit-breaker auto-retrigger for SAP Integration Suite.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

const FEATURES = [
  {
    icon: FileSearch,
    title: "Autonomous MPL Log Inspection",
    description:
      "Continuously polls the SAP Integration Suite OData API for failed Message Processing Logs across your Dev, QA, and Prod tenants — no manual monitoring, no missed failures.",
  },
  {
    icon: Wand2,
    title: "Semantic Schema Healing",
    description:
      "Malformed payloads are reconstructed against the target schema with AI-driven semantic field mapping. Every correction is logged, diffed, and auditable before reprocessing.",
  },
  {
    icon: CircuitBoard,
    title: "Circuit-Breaker Auto-Retrigger",
    description:
      "Healed messages are re-triggered automatically under a circuit-breaker policy that throttles retry storms and protects downstream iFlows — escalating to humans only when judgment is required.",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900 antialiased">
      {/* Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <img src="/logo.png" alt="Klyro AI" className="h-9 w-auto" />
          <nav className="flex items-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-1 text-sm font-semibold text-slate-700 transition-colors hover:text-slate-950"
            >
              Sign in <ArrowRight className="h-3.5 w-3.5" />
            </Link>
            <a
              href="mailto:founder@klyroai.in"
              className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
            >
              Contact sales <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60rem 32rem at 70% -10%, rgba(37, 99, 235, 0.10), transparent 60%), radial-gradient(48rem 28rem at 10% 20%, rgba(14, 165, 233, 0.08), transparent 60%), radial-gradient(40rem 24rem at 90% 60%, rgba(99, 102, 241, 0.07), transparent 60%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(15, 23, 42, 0.10) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage:
              "radial-gradient(50rem 30rem at 60% 20%, black, transparent 75%)",
            WebkitMaskImage:
              "radial-gradient(50rem 30rem at 60% 20%, black, transparent 75%)",
          }}
        />
        <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-24 text-center sm:pt-32">
          <p className="mx-auto inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold tracking-wide text-slate-600">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
            Enterprise-grade recovery agent for SAP BTP
          </p>
          <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-bold leading-[1.08] tracking-tight text-slate-950 sm:text-6xl">
            Autonomous error recovery for SAP Integration Suite.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
            Klyro AI observes message processing logs, heals malformed payloads
            with semantic mapping, and escalates only what needs a human
            decision.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:bg-blue-500 hover:shadow-blue-500/30"
            >
              Start Free Trial <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="mailto:founder@klyroai.in"
              className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-7 py-3 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50"
            >
              Contact sales
            </a>
          </div>
        </div>
      </section>

      {/* Value propositions */}
      <section className="border-t border-slate-200 bg-slate-50/60">
        <div className="mx-auto max-w-6xl px-6 py-24">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            Built for SAP Business Technology Platform
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight text-slate-950">
            From failed message to healed payload — without the war room.
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-slate-950">
                  {f.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                  {f.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="border-t border-slate-200">
        <div className="mx-auto max-w-4xl px-6 py-24 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
            About the Founder
          </p>
          <img
            src="/karthik.jpg"
            alt="Kyatham Karthik, founder of Klyro AI"
            className="mx-auto mt-8 h-28 w-28 rounded-full object-cover shadow-lg ring-4 ring-slate-100"
          />
          <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-950">
            Kyatham Karthik
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            Klyro AI exists to bring trust and zero-downtime integration to
            enterprise SAP landscapes. Our mission is simple: no critical
            message should ever sit failed in a queue waiting for someone to
            notice. We build autonomous systems that enterprise architects can
            audit, govern, and rely on.
          </p>
          <a
            href="mailto:founder@klyroai.in"
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:border-slate-400 hover:bg-slate-50"
          >
            <Mail className="h-4 w-4" /> founder@klyroai.in
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 sm:flex-row">
          <img src="/logo.png" alt="Klyro AI" className="h-7 w-auto" />
          <p className="text-xs text-slate-500">
            © 2026 Klyro AI. Autonomous recovery for SAP Integration Suite.
          </p>
        </div>
      </footer>
    </div>
  );
}
