import { ArrowUpRight, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

const TIERS = [
  {
    name: "Enterprise Pilot",
    price: "$399 / mo",
    description: "A focused evaluation of autonomous recovery in your SAP landscape.",
    features: [
      "Guided tenant onboarding",
      "Selected iFlow evaluation",
      "Human-in-the-loop approval workflows",
      "Recovery and audit review",
    ],
  },
  {
    name: "Production Business",
    price: "$1,299 / mo",
    description: "Operational coverage and expert support for business-critical integrations.",
    features: [
      "Multi-environment SAP coverage",
      "Autonomous healing with approval controls",
      "24/7 Slack Connect Support",
      "Dedicated Integration Architect",
      "Enterprise audit visibility",
    ],
    highlighted: true,
  },
  {
    name: "Dedicated Scale",
    price: "Custom Pricing",
    description: "Tailored deployment and governance for complex enterprise estates.",
    features: [
      "Everything in Production Business",
      "Custom Model Fine-Tuning",
      "VPC Isolation",
      "Dedicated deployment planning",
      "Tailored recovery policies and governance",
    ],
  },
];

export function EnterprisePricingGrid() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {TIERS.map((tier) => (
        <article
          key={tier.name}
          className={`flex h-full flex-col rounded-sm border p-6 shadow-card transition-all duration-300 hover:-translate-y-2 hover:border-primary hover:shadow-xl motion-reduce:transform-none motion-reduce:transition-none ${
            tier.highlighted ? "border-primary bg-primary/5" : "border-border bg-card"
          }`}
        >
          <div className="min-h-40 border-b border-border pb-5">
            <h3 className="text-lg font-semibold text-foreground">{tier.name}</h3>
            <p className="mt-3 text-2xl font-semibold text-foreground">{tier.price}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tier.description}</p>
          </div>
          <ul className="mb-8 mt-6 space-y-4">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm text-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button asChild variant={tier.highlighted ? "default" : "outline"} className="mt-auto w-full">
            <a href="mailto:founder@klyroai.in">
              Contact Sales <ArrowUpRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </a>
          </Button>
        </article>
      ))}
    </div>
  );
}
