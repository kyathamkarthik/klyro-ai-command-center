import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Cancellation & Refund Policy | Klyro AI" },
      {
        name: "description",
        content:
          "Cancellation and Refund Policy for Klyro AI credits and subscription tiers.",
      },
      { property: "og:title", content: "Cancellation & Refund Policy | Klyro AI" },
      {
        property: "og:description",
        content:
          "Learn how Klyro AI handles refunds for consumed and unused credits.",
      },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
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
            Cancellation & Refund Policy
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Effective date: September 9, 2026
          </p>

          <div className="mt-8 space-y-8 text-sm leading-relaxed text-foreground">
            <section>
              <h2 className="text-base font-semibold">1. Consumed Credits</h2>
              <p className="mt-2 text-muted-foreground">
                <strong className="text-foreground">
                  Credits consumed for diagnostic analysis or payload correction
                  are strictly non-refundable.
                </strong>{" "}
                Once a credit has been debited for an AI operation, heuristic
                review, or retriggered integration action, the service has been
                rendered and no refund will be issued.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">
                2. Unused Credit Balances
              </h2>
              <p className="mt-2 text-muted-foreground">
                Unused credit balances from Starter or Growth tiers may be
                requested for refund within{" "}
                <strong className="text-foreground">
                  7 calendar days of the initial purchase
                </strong>{" "}
                by contacting{" "}
                <a
                  href="mailto:founder@klyroai.in"
                  className="font-medium text-primary hover:underline"
                >
                  founder@klyroai.in
                </a>
                . Refund eligibility is reviewed on a case-by-case basis and
                requires the original purchase details.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">3. Refund Processing</h2>
              <p className="mt-2 text-muted-foreground">
                Approved refunds are credited to the original payment method
                within{" "}
                <strong className="text-foreground">
                  5–7 business days
                </strong>{" "}
                of approval. Processing times may vary depending on the issuing
                bank or payment provider.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold">4. Contact</h2>
              <p className="mt-2 text-muted-foreground">
                For refund or cancellation requests, please email us at{" "}
                <a
                  href="mailto:founder@klyroai.in"
                  className="font-medium text-primary hover:underline"
                >
                  founder@klyroai.in
                </a>{" "}
                with your registered email address and purchase reference.
              </p>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}
