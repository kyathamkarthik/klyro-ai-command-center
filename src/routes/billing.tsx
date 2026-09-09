import { createFileRoute } from "@tanstack/react-router";

import { CreditPackagesGrid } from "@/components/buy-credits-dialog";
import { WalletSummaryCard } from "@/components/credit-wallet";
import { DashboardLayout } from "@/components/dashboard-layout";

export const Route = createFileRoute("/billing")({
  head: () => ({
    meta: [
      { title: "Billing & Plans | Klyro AI" },
      {
        name: "description",
        content:
          "Review your API Quota balance, recent usage and purchase Starter, Pro, Business or Enterprise API Quota packages.",
      },
      { property: "og:title", content: "Billing & Plans | Klyro AI" },
      {
        property: "og:description",
        content: "Manage API Quota and purchase additional capacity.",
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
      description="Klyro Recovery Credits balance, usage history and credit packages"
    >
      <div className="space-y-6">
        <WalletSummaryCard />

        <section className="panel p-6">
          <h2 className="text-sm font-semibold text-foreground">
            Purchase API Quota
          </h2>
          <p className="mb-5 mt-1 text-xs text-muted-foreground">
            API Quota is consumed by autonomous analysis, healing and re-trigger actions.
          </p>
          <CreditPackagesGrid />
        </section>
      </div>
    </DashboardLayout>
  );
}
