import { createFileRoute } from "@tanstack/react-router";

import { EnterprisePricingGrid } from "@/components/buy-credits-dialog";
import { WalletSummaryCard } from "@/components/credit-wallet";
import { DashboardLayout } from "@/components/dashboard-layout";

export const Route = createFileRoute("/billing")({
  head: () => ({
    meta: [
      { title: "Billing & Plans | Klyro AI" },
      {
        name: "description",
        content:
          "Review your Klyro Recovery Credits balance and recent usage, and explore tailored enterprise plans for SAP integration recovery.",
      },
      { property: "og:title", content: "Billing & Plans | Klyro AI" },
      {
        property: "og:description",
        content: "Manage Klyro Recovery Credits and explore tailored enterprise plans.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Billing,
});

function Billing() {
  return (
    <DashboardLayout
      title="Billing & Plans"
      description="Klyro Recovery Credits balance, usage history and enterprise plans"
    >
      <div className="space-y-6">
        <WalletSummaryCard />

        <section aria-labelledby="plans-heading">
          <div className="mb-5">
            <h2 id="plans-heading" className="text-xl font-semibold text-foreground">Enterprise plans</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Tailored coverage and support for your SAP Integration Suite operations.
            </p>
          </div>
          <EnterprisePricingGrid />
        </section>
      </div>
    </DashboardLayout>
  );
}
