import { Check, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCreditPackages, type CreditPackage } from "@/lib/wallet";

const TIER_ORDER = ["Starter", "Pro", "Business", "Enterprise"];

export function CreditPackagesGrid() {
  const { data: packages, isLoading } = useCreditPackages();
  const [pending, setPending] = useState<string | null>(null);

  const grouped = TIER_ORDER.map((tier) => ({
    tier,
    items: (packages ?? []).filter((p: CreditPackage) => p.tier === tier),
  })).filter((g) => g.items.length > 0);

  const checkout = async (pkg: CreditPackage) => {
    setPending(pkg.id);
    try {
      if (pkg.is_custom) {
        window.location.href =
          "mailto:sales@klyro.ai?subject=Klyro%20Enterprise%20API%20Quota";
        return;
      }
      toast.info(
        `Checkout for ${pkg.name} ($${Number(pkg.price_usd).toFixed(0)}) is opening — payments are not yet connected.`,
      );
    } finally {
      setPending(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-10 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading packages…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {grouped.map((group) => (
        <div key={group.tier}>
          <div className="mb-3 flex items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{group.tier}</h3>
            <Badge variant="outline" className="rounded-sm text-[10px]">
              {group.tier === "Enterprise" ? "Custom agreement" : "Instant subscribe"}
            </Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {group.items.map((pkg) => (
              <div
                key={pkg.id}
                className="flex flex-col justify-between rounded-sm border border-border bg-card p-4"
              >
                <div>
                  <p className="text-xl font-semibold tracking-tight text-foreground">
                    {pkg.is_custom ? "Custom" : `$${Number(pkg.price_usd).toLocaleString()}`}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {pkg.is_custom
                      ? "Volume pricing & SLA"
                      : `${Number(pkg.credits).toLocaleString()} API Quota`}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={pkg.is_custom ? "outline" : "default"}
                  className="mt-4 w-full"
                  disabled={pending === pkg.id}
                  onClick={() => checkout(pkg)}
                >
                  {pending === pkg.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : pkg.is_custom ? (
                    "Contact Sales"
                  ) : (
                    <>
                      <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Subscribe
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

const TIERS = [
  {
    name: "Starter",
    price: "$15",
    credits: "15 API Quota",
    description: "Perfect for evaluation and small tenants.",
    features: ["15 API Quota", "Email support", "2-day usage history"],
  },
  {
    name: "Pro",
    price: "$50",
    credits: "50 API Quota",
    description: "For production integration teams.",
    features: ["50 API Quota", "Priority support", "30-day usage history"],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "$100",
    credits: "100 API Quota",
    description: "High-volume autonomous healing.",
    features: ["100 API Quota", "Dedicated support", "Full audit history"],
  },
];

export function BuyCreditsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-4xl overflow-y-auto">
        <DialogHeader className="text-center">
          <DialogTitle className="text-lg">Choose an API Quota Plan</DialogTitle>
          <DialogDescription>
            Select the right amount of API Quota for your SAP Integration Suite operations.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 pt-2 sm:grid-cols-3">
          {TIERS.map((tier) => (
            <div
              key={tier.name}
              className={`flex flex-col rounded-sm border p-5 ${
                tier.highlighted
                  ? "border-primary bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-foreground">{tier.name}</h3>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                  {tier.price}
                </p>
                <p className="text-sm text-muted-foreground">{tier.credits}</p>
                <p className="mt-2 text-xs text-muted-foreground">{tier.description}</p>
              </div>
              <ul className="mb-6 space-y-2">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-xs text-foreground">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                asChild
                variant={tier.highlighted ? "default" : "outline"}
                className="mt-auto w-full"
              >
                <a
                  href="https://example.com/checkout"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Select Plan
                </a>
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
