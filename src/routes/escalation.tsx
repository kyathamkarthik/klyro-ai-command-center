import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";

import { CreditsExhaustedBanner, useCreditGuard } from "@/components/credit-wallet";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/external/client";
import { consumeCredits } from "@/lib/wallet";

export const Route = createFileRoute("/escalation")({
  head: () => ({
    meta: [
      { title: "HITL Escalation Queue | Klyro AI" },
      {
        name: "description",
        content:
          "Human-in-the-loop review of failed SAP payloads against AI-suggested fixes, with approve and execute decisions.",
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

type HitlRow = {
  id: string;
  iflow_name: string | null;
  error_message: string | null;
  original_payload: unknown;
  proposed_payload: unknown;
  status: string;
  created_at?: string;
};

function prettyPayload(value: unknown): string {
  if (value == null) return "—";
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function usePendingHitl() {
  return useQuery({
    queryKey: ["hitl-queue", "pending_approval"],
    refetchOnWindowFocus: true,
    queryFn: async (): Promise<HitlRow[]> => {
      const { data, error } = await supabase
        .from("hitl_queue")
        .select("*")
        .eq("status", "pending_approval")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as HitlRow[];
    },
  });
}

function Escalation() {
  const queryClient = useQueryClient();
  const { data: rows, isLoading } = usePendingHitl();
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { userId, balance, exhausted } = useCreditGuard();

  const pending = (rows ?? []).filter((r) => !approvedIds.has(r.id));

  const approve = async (row: HitlRow) => {
    if (exhausted || approvingId) return;
    setApprovingId(row.id);
    setErrors((e) => {
      const next = { ...e };
      delete next[row.id];
      return next;
    });
    try {
      const { error } = await supabase
        .from("hitl_queue")
        .update({ status: "approved" })
        .eq("id", row.id);
      if (error) throw error;
      // Immediately remove from the active list.
      setApprovedIds((s) => new Set(s).add(row.id));
      if (userId) {
        try {
          await consumeCredits(userId, "Approve & Execute", 0.5, balance);
        } catch {
          // Credit debit failure should not block the approval decision.
        }
      }
      queryClient.invalidateQueries({ queryKey: ["hitl-queue"] });
    } catch (error) {
      setErrors((e) => ({
        ...e,
        [row.id]: `Approval failed: ${(error as Error).message}`,
      }));
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <DashboardLayout
      title="HITL Escalation Queue"
      description="Payload fixes proposed by the AI agent, awaiting human approval"
    >
      {exhausted ? (
        <div className="mb-6">
          <CreditsExhaustedBanner />
        </div>
      ) : null}

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : pending.length === 0 ? (
        <div className="panel flex items-center justify-center py-24">
          <p className="text-sm text-muted-foreground">
            No pending payloads for review.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Pending reviews</span>
            <Badge variant="outline" className="border-warning/50 text-warning">
              {pending.length} pending
            </Badge>
          </div>

          {pending.map((row) => (
            <section key={row.id} className="panel">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
                <div>
                  <p className="text-sm font-semibold">
                    {row.iflow_name ?? "Unknown iFlow"}
                  </p>
                  <p className="mt-0.5 text-xs text-destructive">
                    {row.error_message ?? "No error message recorded"}
                  </p>
                </div>
                <span className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  AI-proposed fix awaiting review
                </span>
              </div>

              <div className="grid gap-px bg-border md:grid-cols-2">
                <div className="bg-card p-4">
                  <p className="mb-2 text-[11px] uppercase tracking-wide text-destructive">
                    Original failed payload
                  </p>
                  <pre className="max-h-80 overflow-auto rounded-sm bg-code-bg p-4 font-mono text-[11px] leading-relaxed text-code-foreground">
                    {prettyPayload(row.original_payload)}
                  </pre>
                </div>
                <div className="bg-card p-4">
                  <p className="mb-2 text-[11px] uppercase tracking-wide text-primary">
                    AI-suggested fix
                  </p>
                  <pre className="max-h-80 overflow-auto rounded-sm border border-primary/30 bg-code-bg p-4 font-mono text-[11px] leading-relaxed text-code-foreground">
                    {prettyPayload(row.proposed_payload)}
                  </pre>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border p-4">
                <span className="text-xs text-destructive">
                  {errors[row.id] ?? ""}
                </span>
                <Button
                  onClick={() => approve(row)}
                  disabled={approvingId === row.id || exhausted}
                  className="bg-success text-success-foreground hover:bg-success/90"
                >
                  {approvingId === row.id ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  {approvingId === row.id ? "Approving…" : "Approve & Execute"}
                </Button>
              </div>
            </section>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
