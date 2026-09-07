import { createFileRoute } from "@tanstack/react-router";
import { Check, Clock, Sparkles, X } from "lucide-react";
import { useState } from "react";

import { CreditsExhaustedBanner, useCreditGuard } from "@/components/credit-wallet";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { consumeCredits } from "@/lib/wallet";

export const Route = createFileRoute("/escalation")({
  head: () => ({
    meta: [
      { title: "HITL Escalation Queue | Klyro AI" },
      {
        name: "description",
        content:
          "Human-in-the-loop review of failed SAP payloads against AI-suggested fixes, with approve and re-trigger or reject decisions.",
      },
      { property: "og:title", content: "HITL Escalation Queue | Klyro AI" },
      {
        property: "og:description",
        content: "Review AI-suggested fixes for failed SAP master data payloads.",
      },
    ],
  }),
  component: Escalation,
});

const queue = [
  {
    id: "AGAS9tqK1_hV3mY6cE1",
    iflow: "MaterialMaster_Sync_MDG",
    reason: "Schema validation · unknown UoM",
    waiting: "6m 12s",
    confidence: 0.62,
    original: `{
  "Material": "MAT-77410",
  "Description": "Hex Bolt M12x60",
  "BaseUnit": "PCS",
  "GrossWeight": "0,84",
  "Plant": "1710",
  "MRPType": null
}`,
    suggested: `{
  "Material": "MAT-77410",
  "Description": "Hex Bolt M12x60",
  "BaseUnit": "EA",
  "GrossWeight": 0.84,
  "WeightUnit": "KG",
  "Plant": "1710",
  "MRPType": "PD"
}`,
  },
  {
    id: "AGAS9tqK1_kL5bF8dQ3",
    iflow: "Delivery_Confirm_EWM",
    reason: "IDoc segment missing · E1EDL20",
    waiting: "14m 03s",
    confidence: 0.57,
    original: `{
  "DeliveryDocument": "80004421",
  "Items": [{ "Material": "MAT-88121" }],
  "ShippingPoint": ""
}`,
    suggested: `{
  "DeliveryDocument": "80004421",
  "Items": [{ "Material": "MAT-88121", "ActualQuantity": 12, "Unit": "EA" }],
  "ShippingPoint": "1710"
}`,
  },
  {
    id: "AGAS9tqK1_nD2vS5rK8",
    iflow: "Vendor_Onboarding_MDG",
    reason: "Duplicate business partner candidate",
    waiting: "21m 47s",
    confidence: 0.49,
    original: `{
  "Supplier": "0000501233",
  "Name": "Acme Industrial GMBH",
  "TaxNumber": "DE1129 88 4412"
}`,
    suggested: `{
  "Supplier": "0000488102",
  "Name": "Acme Industrial GmbH",
  "TaxNumber": "DE1129884412",
  "MergeWithExisting": true
}`,
  },
];

function Escalation() {
  const [selected, setSelected] = useState<string>(queue[0]!.id);
  const [decisions, setDecisions] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const item = queue.find((q) => q.id === selected)!;
  const { userId, balance, exhausted } = useCreditGuard();

  const approve = async () => {
    if (exhausted || !userId) return;
    setPending(true);
    setResult(null);
    try {
      const res = await fetch(
        "https://klyro-backend-spme.onrender.com/api/v1/retrigger-sap",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mpl_id: item.id,
            iflow: item.iflow,
            payload: JSON.parse(item.suggested),
          }),
        },
      );
      const text = await res.text();
      if (res.ok) {
        setDecisions((d) => ({ ...d, [item.id]: "Approved" }));
        await consumeCredits(userId, "Approve & Re-trigger", 0.5, balance);
        setResult({ ok: true, message: `Re-trigger accepted by SAP (${res.status})` });
      } else {
        setResult({
          ok: false,
          message: `Re-trigger failed (${res.status}) ${text.slice(0, 120)}`,
        });
      }
    } catch (error) {
      setResult({
        ok: false,
        message: `Could not reach Klyro backend: ${(error as Error).message}`,
      });
    } finally {
      setPending(false);
    }
  };


  return (
    <DashboardLayout
      title="HITL Escalation Queue"
      description="Master data reviews where agent confidence fell below the autonomy threshold"
    >
      {exhausted ? (
        <div className="mb-6">
          <CreditsExhaustedBanner />
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="panel">
          <div className="flex items-center justify-between border-b border-border p-4">
            <span className="text-sm font-semibold">Queue</span>
            <Badge variant="outline" className="border-warning/50 text-warning">
              {queue.length} pending
            </Badge>
          </div>
          <ul className="divide-y divide-border">
            {queue.map((q) => (
              <li key={q.id}>
                <button
                  onClick={() => setSelected(q.id)}
                  className={`w-full border-l-2 p-4 text-left transition-colors ${
                    selected === q.id
                      ? "border-l-primary bg-accent"
                      : "border-l-transparent hover:bg-surface-muted"
                  }`}
                >
                  <p className="text-xs font-medium">{q.iflow}</p>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {q.id}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" /> waiting {q.waiting}
                  </p>
                  {decisions[q.id] && (
                    <Badge variant="outline" className="mt-2 text-[10px]">
                      {decisions[q.id]}
                    </Badge>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <section className="panel">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
            <div>
              <p className="text-sm font-semibold">{item.iflow}</p>
              <p className="text-xs text-muted-foreground">{item.reason}</p>
            </div>
            <span className="flex items-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              agent confidence{" "}
              <span className="font-mono text-foreground">
                {(item.confidence * 100).toFixed(0)}%
              </span>
            </span>
          </div>

          <div className="grid gap-px bg-border md:grid-cols-2">
            <div className="bg-card p-4">
              <p className="mb-2 text-[11px] uppercase tracking-wide text-destructive">
                Original failed payload
              </p>
              <pre className="overflow-x-auto rounded-sm bg-code-bg p-4 font-mono text-[11px] leading-relaxed text-code-foreground">
                {item.original}
              </pre>
            </div>
            <div className="bg-card p-4">
              <p className="mb-2 text-[11px] uppercase tracking-wide text-primary">
                AI-suggested fix
              </p>
              <pre className="overflow-x-auto rounded-sm border border-primary/30 bg-code-bg p-4 font-mono text-[11px] leading-relaxed text-code-foreground">
                {item.suggested}
              </pre>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4">
            <span
              className={`text-xs ${
                result ? (result.ok ? "text-success" : "text-destructive") : "text-transparent"
              }`}
            >
              {result?.message ?? "."}
            </span>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setDecisions((d) => ({ ...d, [item.id]: "Rejected" }))}
              >
                <X className="mr-2 h-4 w-4" /> Reject
              </Button>
              <Button onClick={approve} disabled={pending || exhausted}>
                <Check className="mr-2 h-4 w-4" />
                {pending ? "Re-triggering…" : "Approve & Re-trigger"}
              </Button>
            </div>
          </div>

        </section>
      </div>
    </DashboardLayout>
  );
}
