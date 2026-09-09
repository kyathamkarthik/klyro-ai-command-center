import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Klyro AI" },
      {
        name: "description",
        content:
          "Privacy Policy for Klyro AI. Learn how we handle sensitive PII, SAP payloads, and model routing.",
      },
      { property: "og:title", content: "Privacy Policy | Klyro AI" },
      {
        property: "og:description",
        content:
          "How Klyro AI handles sensitive PII and SAP payloads with zero-retention architecture.",
      },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
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
            Privacy Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Effective date: September 9, 2026
          </p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground">
            <section>
              <h2 className="text-base font-semibold">1. Data We Process</h2>
              <p className="mt-2 text-muted-foreground">
                Klyro AI processes message processing logs, payload metadata,
                and integration configuration data solely to provide diagnostic
                and remediation services. We do not collect or store
                unnecessary personal information.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">
                2. Sensitive PII Sanitization
              </h2>
              <p className="mt-2 text-muted-foreground">
                <strong className="text-foreground">
                  Sensitive PII — including passwords, financial data,
                  and email addresses — is automatically sanitized on the
                  client/middleware layer
                </strong>{" "}
                before any content is routed to external models or diagnostic
                pipelines. Redaction rules are applied at ingestion to minimize
                exposure of credentials and regulated data.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">3. Zero-Retention Architecture</h2>
              <p className="mt-2 text-muted-foreground">
                <strong className="text-foreground">
                  SAP payloads are processed ephemerally and are not used to
                  train shared foundation models.
                </strong>{" "}
                Diagnostic inputs and outputs are retained only for the
                duration required to deliver the service and are subject to
                automatic expiry. Where retention is necessary for audit or
                billing, only sanitized metadata is kept.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">4. Your Rights</h2>
              <p className="mt-2 text-muted-foreground">
                You may request access to, correction of, or deletion of your
                account data by contacting us at{" "}
                <a
                  href="mailto:founder@klyroai.in"
                  className="font-medium text-primary hover:underline"
                >
                  founder@klyroai.in
                </a>
                .
              </p>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}
