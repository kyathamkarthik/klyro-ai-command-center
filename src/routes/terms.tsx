import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service | Klyro AI" },
      {
        name: "description",
        content:
          "Terms of Service for Klyro AI, operated by Klyro Technologies. Read about usage, API Quota, and service limits.",
      },
      { property: "og:title", content: "Terms of Service | Klyro AI" },
      {
        property: "og:description",
        content:
          "Terms of Service for Klyro AI, operated by Klyro Technologies.",
      },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Klyro AI" className="h-8 w-auto" />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <article className="panel p-8">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Terms of Service
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Effective date: September 9, 2026
          </p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground">
            <section>
              <h2 className="text-base font-semibold">1. Platform Operator</h2>
              <p className="mt-2 text-muted-foreground">
                The Klyro AI platform is operated by{" "}
                <strong className="text-foreground">Klyro Technologies</strong>,
                a registered business entity in India. All references to
                “Klyro,” “Klyro AI,” “we,” or “us” refer to Klyro Technologies.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">2. Description of Service</h2>
              <p className="mt-2 text-muted-foreground">
                Klyro AI provides automated and human-in-the-loop diagnostic
                tooling for cloud integrations, including observability,
                payload analysis, schema mapping suggestions, and remediation
                orchestration for SAP Integration Suite and related middleware.
                Our services augment, and do not replace, your organization's
                operational change-management and testing procedures.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">3. Acceptable Use</h2>
              <p className="mt-2 text-muted-foreground">
                You agree to use Klyro AI only in compliance with applicable laws
                and the terms of any third-party systems you connect. You are
                responsible for maintaining the confidentiality of your tenant
                credentials, API keys, and service-account credentials.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">
                4. API Quota
              </h2>
              <p className="mt-2 text-muted-foreground">
                <strong className="text-foreground">
                  API Quota is a usage allowance
                </strong>{" "}
                used to invoke diagnostic and remediation services within the
                platform. API Quota has no cash value outside the Klyro AI
                service, is non-transferable, and cannot be redeemed for cash
                except as expressly permitted under our Cancellation & Refund
                Policy.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">5. Limitation of Liability</h2>
              <p className="mt-2 text-muted-foreground">
                Klyro AI is provided “as is” without warranties of any kind.
                Diagnostic recommendations and automated remediation actions
                are advisory; you remain fully responsible for reviewing,
                approving, and deploying changes to production systems.
              </p>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}
