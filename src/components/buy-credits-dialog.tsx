import { Loader2, Sparkles } from "lucide-react";
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
          "mailto:sales@klyro.ai?subject=Klyro%20Enterprise%20Credits";
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
              {group.tier === "Enterprise" ? "Custom agreement" : "Instant top-up"}
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
                      : `${Number(pkg.credits).toLocaleString()} Klyro Recovery Credits`}
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
                      <Sparkles className="mr-1.5 h-3.5 w-3.5" /> Buy
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

export function BuyCreditsDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Purchase Klyro Recovery Credits</DialogTitle>
          <DialogDescription>
            Credits are consumed by autonomous analysis, healing and re-trigger actions.
          </DialogDescription>
        </DialogHeader>
        <CreditPackagesGrid />
      </DialogContent>
    </Dialog>
  );
}
