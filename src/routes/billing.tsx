import { createFileRoute } from "@tanstack/react-router";
import { Check } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/billing")({
  head: () => ({
    meta: [
      { title: "Billing & Plans | Klyro AI" },
      {
        name: "description",
        content:
          "Compare Klyro AI subscription tiers: 2-day evaluation trial, Professional at $99/mo plus token usage, and custom Enterprise agreements.",
      },
      { property: "og:title", content: "Billing & Plans | Klyro AI" },
      {
        property: "og:description",
        content: "Klyro AI subscription tiers for autonomous SAP integration recovery.",
      },
    ],
  }),
  component: Billing,
});

const tiers = [
  {
    name: "Evaluation",
    price: "2-Day Trial",
    note: "Active",
    active: true,
    features: [
      "1 SAP Integration Suite tenant",
      "MPL observer with 24h retention",
      "Read-only autonomous healing preview",
      "Community support",
    ],
    cta: "Current plan",
  },
  {
    name: "Professional",
    price: "$99/mo",
    note: "+ Token Usage",
    active: false,
    features: [
      "Up to 5 tenants across Dev / QA / Prod",
      "Full autonomous healing + re-trigger",
      "HITL escalation queue with audit trail",
      "Metered AI token billing",
    ],
    cta: "Upgrade to Professional",
  },
  {
    name: "Enterprise",
    price: "Custom",
    note: "Annual agreement",
    active: false,
    features: [
      "Unlimited tenants and iFlows",
      "SAML / SSO, private networking",
      "Dedicated healing model tuning",
      "99.9% SLA and named CSM",
    ],
    cta: "Contact sales",
  },
];

function Billing() {
  return (
    <DashboardLayout
      title="Billing & Plans"
      description="Subscription tier, token consumption and upgrade options"
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {tiers.map((tier) => (
          <section
            key={tier.name}
            className={`panel flex flex-col p-6 ${
              tier.active ? "border-primary ring-1 ring-primary/30" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-sm font-semibold text-foreground">{tier.name}</h2>
              {tier.active && (
                <Badge variant="outline" className="border-success/40 text-success">
                  Active
                </Badge>
              )}
            </div>
            <p className="mt-4 text-2xl font-bold tracking-tight text-foreground">
              {tier.price}
            </p>
            <p className="text-xs text-muted-foreground">{tier.note}</p>
            <ul className="mt-5 flex-1 space-y-2.5 text-xs text-muted-foreground">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Button
              className="mt-6"
              variant={tier.active ? "outline" : "default"}
              disabled={tier.active}
            >
              {tier.cta}
            </Button>
          </section>
        ))}
      </div>

      <section className="panel mt-6 p-6">
        <h2 className="text-sm font-semibold">Token usage this cycle</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {[
            ["Healing tokens", "412,880"],
            ["Escalation reviews", "37"],
            ["Estimated overage", "$0.00"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-sm border border-border p-4">
              <p className="text-xs text-muted-foreground">{k}</p>
              <p className="mt-1 font-mono text-lg text-foreground">{v}</p>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
