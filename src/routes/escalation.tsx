import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { useState } from "react";
import ReactDiffViewer from "react-diff-viewer-continued";

import { CreditsExhaustedBanner, useCreditGuard } from "@/components/credit-wallet";
import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
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
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Escalation,
});

type HitlRow = {
  id: string;
  iflow_name: string | null;
  error_message: string | null;
  failure_type: string | null;
  risk_level: string | null;
  confidence_score: number | string | null;
  original_payload: unknown;
  proposed_payload: unknown;
  status: string;
  created_at?: string;
};

function parsePayload(value: unknown): unknown {
  if (typeof value !== "string") return value;
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}

function prettyPayload(value: unknown): string {
  if (value == null) return "—";
  const parsed = parsePayload(value);
  if (typeof parsed === "string") return parsed;
  try {
    return JSON.stringify(parsed, null, 2);
  } catch {
    return String(parsed);
  }
}

const riskStyles: Record<string, string> = {
  low: "border-success/40 bg-success/10 text-success",
  medium: "border-warning/40 bg-warning/10 text-warning-foreground",
  high: "border-destructive/40 bg-destructive/10 text-destructive",
};

function confidenceOf(row: HitlRow): number | null {
  if (row.confidence_score == null || row.confidence_score === "") return null;
  const score = Number(row.confidence_score);
  return Number.isFinite(score) ? Math.min(1, Math.max(0, score)) : null;
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
  const { data: rows, isLoading, error: queueError } = usePendingHitl();
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [approvedIds, setApprovedIds] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<HitlRow | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const { userId, balance, exhausted } = useCreditGuard();

  const pending = (rows ?? []).filter((r) => !approvedIds.has(r.id));

  const approve = async (row: HitlRow) => {
    if (exhausted || approvingId || !userId || row.proposed_payload == null) return;
    setApprovingId(row.id);
    setActionError(null);
    let retriggerSucceeded = false;
    try {
      const response = await fetch("https://klyro-backend-spme.onrender.com/api/v1/retrigger-sap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          iflow_name: row.iflow_name,
          payload: parsePayload(row.proposed_payload),
        }),
      });
      if (!response.ok) {
        throw new Error(`SAP retrigger failed (${response.status}). The item is still pending.`);
      }
      retriggerSucceeded = true;
      const { error } = await supabase
        .from("hitl_queue")
        .update({ status: "approved" })
        .eq("id", row.id)
        .eq("status", "pending_approval")
        .select("id")
        .single();
      if (error) throw error;
      setApprovedIds((s) => new Set(s).add(row.id));
      setSelected(null);
      try {
        await consumeCredits(userId, "Approve & Retrigger", 0.5, balance);
      } catch {
        // A credit recording failure must not undo the completed SAP action.
      }
      void queryClient.invalidateQueries({ queryKey: ["hitl-queue"] });
    } catch (error) {
      setActionError(
        retriggerSucceeded
          ? "SAP retrigger succeeded, but the queue could not be updated. Do not retry this action; contact support to reconcile the item."
          : `Approval failed: ${(error as Error).message}`,
      );
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
      ) : queueError ? (
        <div
          role="alert"
          className="border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive"
        >
          Pending payloads could not be loaded. Please try again.
        </div>
      ) : pending.length === 0 ? (
        <div className="panel flex items-center justify-center py-24">
          <p className="text-sm text-muted-foreground">No pending payloads for review.</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold">Pending reviews</span>
            <Badge variant="outline" className="border-warning/50 text-warning">
              {pending.length} pending
            </Badge>
          </div>

          {pending.map((row) => {
            const risk = row.risk_level?.toLowerCase() ?? "";
            const confidence = confidenceOf(row);
            return (
              <section key={row.id} className="panel p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{row.iflow_name ?? "Unknown iFlow"}</p>
                    <p className="mt-1 text-xs text-muted-foreground break-words">
                      {row.error_message ?? "No error message recorded"}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {row.failure_type && <Badge variant="secondary">{row.failure_type}</Badge>}
                    {row.risk_level && (
                      <Badge
                        variant="outline"
                        className={riskStyles[risk] ?? "border-border text-muted-foreground"}
                      >
                        {row.risk_level} risk
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="mt-5 flex flex-wrap items-end justify-between gap-5 border-t border-border pt-4">
                  <div className="w-full max-w-56">
                    <div className="mb-2 flex justify-between text-xs text-muted-foreground">
                      <span>AI confidence</span>
                      <span>{confidence == null ? "—" : `${Math.round(confidence * 100)}%`}</span>
                    </div>
                    <Progress
                      value={(confidence ?? 0) * 100}
                      className="h-1.5"
                      aria-label="AI confidence"
                    />
                  </div>
                  <Button
                    onClick={() => {
                      setActionError(null);
                      setSelected(row);
                    }}
                  >
                    Review Fix <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </section>
            );
          })}
        </div>
      )}

      <Dialog
        open={Boolean(selected)}
        onOpenChange={(open) => {
          if (!open && !approvingId) setSelected(null);
        }}
      >
        <DialogContent className="flex max-h-[90vh] w-[calc(100vw-2rem)] max-w-6xl flex-col gap-0 overflow-hidden p-0 sm:rounded-md">
          {selected && (
            <>
              <DialogHeader className="shrink-0 border-b border-border px-6 py-5 pr-12">
                <DialogTitle>Review Fix · {selected.iflow_name ?? "Unknown iFlow"}</DialogTitle>
                <DialogDescription>
                  Compare the failed payload with the AI-proposed correction before retriggering
                  SAP.
                </DialogDescription>
              </DialogHeader>
              <div className="min-h-0 flex-1 overflow-auto px-4 py-5 sm:px-6">
                <div className="min-w-[720px] overflow-auto border border-border font-mono text-xs">
                  <ReactDiffViewer
                    oldValue={prettyPayload(selected.original_payload)}
                    newValue={prettyPayload(selected.proposed_payload)}
                    splitView
                    leftTitle="Original payload"
                    rightTitle="Proposed payload"
                    disableWorker
                    showDiffOnly={false}
                  />
                </div>
              </div>
              <div className="shrink-0 border-t border-border px-6 py-4">
                {actionError && (
                  <p role="alert" className="mb-3 text-sm text-destructive">
                    {actionError}
                  </p>
                )}
                <div className="flex flex-wrap items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelected(null)}
                    disabled={Boolean(approvingId)}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="bg-success text-success-foreground hover:bg-success/90"
                    disabled={
                      Boolean(approvingId) ||
                      exhausted ||
                      !userId ||
                      selected.proposed_payload == null
                    }
                    onClick={() => approve(selected)}
                  >
                    {approvingId ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="mr-2 h-4 w-4" />
                    )}
                    {approvingId ? "Retriggering…" : "Approve & Retrigger"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
