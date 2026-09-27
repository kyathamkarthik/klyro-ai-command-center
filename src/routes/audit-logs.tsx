import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Loader2, Search, ScrollText } from "lucide-react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/external/client";
import { useSession } from "@/lib/auth";

const PAGE_SIZE = 20;

type AuditLog = {
  log_id: string;
  created_at: string | null;
  iflow_name: string | null;
  failure_category: string | null;
  decision: string | null;
  ai_model_used: string | null;
  tokens_consumed: number | null;
  verification_status: string | null;
};

export const Route = createFileRoute("/audit-logs")({
  validateSearch: (search) => ({
    q: typeof search.q === "string" ? search.q.slice(0, 120) : "",
    page: Number.isSafeInteger(Number(search.page)) && Number(search.page) > 0
      ? Number(search.page)
      : 1,
  }),
  head: () => ({
    meta: [
      { title: "Audit Logs | Klyro AI" },
      { name: "description", content: "Review the read-only SAP integration recovery audit ledger in Klyro AI." },
      { property: "og:title", content: "Audit Logs | Klyro AI" },
      { property: "og:description", content: "Read-only audit records for SAP integration recovery decisions and verification." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuditLogs,
});

const decisionStyles: Record<string, string> = {
  AUTO_RECOVERY: "border-success/40 bg-success/10 text-success",
  APPROVAL: "border-warning/40 bg-warning/10 text-warning-foreground",
  ESCALATION: "border-destructive/40 bg-destructive/10 text-destructive",
};

const verificationStyles: Record<string, string> = {
  SUCCESS: "bg-success",
  FAILED: "bg-destructive",
  PENDING: "bg-warning",
};

function formatTimestamp(value: string | null) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit",
    timeZoneName: "short",
  }).format(date);
}

function AuditLogs() {
  const { q, page } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { user, loading: sessionLoading } = useSession();
  const search = q.trim();
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["audit-logs", user?.id, search, page],
    enabled: Boolean(user),
    queryFn: async (): Promise<{ rows: AuditLog[]; count: number }> => {
      let request = supabase
        .from("audit_logs")
        .select("log_id, created_at, iflow_name, failure_category, decision, ai_model_used, tokens_consumed, verification_status", { count: "exact" })
        .order("created_at", { ascending: false })
        .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);
      if (search) {
        // Escape LIKE wildcards so the field behaves as a literal name search.
        const literal = search.replace(/[\\%_]/g, "\\$&");
        request = request.ilike("iflow_name", `%${literal}%`);
      }
      const { data: rows, count, error: queryError } = await request;
      if (queryError) throw queryError;
      return { rows: (rows ?? []) as AuditLog[], count: count ?? 0 };
    },
  });

  const total = data?.count ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rows = data?.rows ?? [];

  return (
    <DashboardLayout title="Audit Logs" description="Immutable record of integration decisions and verification">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase text-muted-foreground">
            <ScrollText className="h-4 w-4 text-primary" /> Compliance ledger
          </div>
          <h2 className="mt-2 text-xl font-semibold text-foreground">Recovery audit trail</h2>
          <p className="mt-1 text-sm text-muted-foreground">Read-only history of policy decisions, AI routing, and outcomes.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Search by iFlow name"
            placeholder="Search iFlow name"
            value={q}
            onChange={(event) => navigate({ search: { q: event.target.value, page: 1 }, replace: true })}
            className="pl-9"
          />
        </div>
      </div>

      <section className="overflow-hidden rounded-sm border border-border bg-card shadow-card" aria-label="Audit records">
        <div className="flex items-center justify-between border-b border-border px-5 py-3 text-xs text-muted-foreground">
          <span>{isLoading || sessionLoading ? "Loading records…" : `${total.toLocaleString()} ${total === 1 ? "record" : "records"}`}</span>
          <span className="flex items-center gap-2">{isFetching && !isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Newest first</span>
        </div>
        {sessionLoading || isLoading ? (
          <div className="flex min-h-64 items-center justify-center" role="status" aria-label="Loading audit logs">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-5 text-center" role="alert">
            <p className="text-sm text-destructive">Audit logs could not be loaded. Check your access and try again.</p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>Retry</Button>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex min-h-64 items-center justify-center px-5 text-center text-sm text-muted-foreground">
            {search ? "No audit logs match this iFlow name." : "No audit logs available."}
          </div>
        ) : (
          <Table className="min-w-[1060px]">
            <TableHeader>
              <TableRow className="bg-surface-muted hover:bg-surface-muted">
                <TableHead className="w-48 px-5 text-xs">Timestamp</TableHead>
                <TableHead className="min-w-52 text-xs">Integration</TableHead>
                <TableHead className="min-w-44 text-xs">Failure Category</TableHead>
                <TableHead className="min-w-40 text-xs">Policy Decision</TableHead>
                <TableHead className="min-w-44 text-xs">AI Routing</TableHead>
                <TableHead className="min-w-36 pr-5 text-xs">Verification</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.log_id} className="hover:bg-surface-muted/60">
                  <TableCell className="whitespace-nowrap px-5 py-4 text-xs tabular-nums text-muted-foreground">{formatTimestamp(row.created_at)}</TableCell>
                  <TableCell className="py-4">
                    <div className="max-w-64 break-words text-sm font-medium text-foreground">{row.iflow_name ?? "—"}</div>
                    <div className="mt-1 max-w-64 break-all font-mono text-[11px] text-muted-foreground">{row.log_id}</div>
                  </TableCell>
                  <TableCell className="py-4 font-mono text-xs text-muted-foreground">{row.failure_category ?? "—"}</TableCell>
                  <TableCell className="py-4">
                    {row.decision ? <Badge variant="outline" className={decisionStyles[row.decision.toUpperCase()] ?? "text-muted-foreground"}>{row.decision}</Badge> : "—"}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="text-xs font-medium text-foreground">{row.ai_model_used ?? "—"}</div>
                    <div className="mt-1 text-xs tabular-nums text-muted-foreground">{row.tokens_consumed == null ? "—" : `${Number(row.tokens_consumed).toLocaleString()} tokens`}</div>
                  </TableCell>
                  <TableCell className="py-4 pr-5">
                    <span className="inline-flex items-center gap-2 text-xs font-medium text-foreground">
                      <span className={`h-2 w-2 shrink-0 rounded-full ${verificationStyles[row.verification_status?.toUpperCase() ?? ""] ?? "bg-muted-foreground"}`} />
                      {row.verification_status ?? "—"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3 text-xs text-muted-foreground">
          <span>{total === 0 ? "0 records" : `Showing ${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, total)} of ${total.toLocaleString()}`}</span>
          <div className="flex items-center gap-3">
            <span>Page {page} of {pageCount}</span>
            <Button variant="outline" size="icon" aria-label="Previous page" title="Previous page" disabled={page <= 1 || isLoading || Boolean(error)} onClick={() => navigate({ search: { q, page: page - 1 } })}><ChevronLeft /></Button>
            <Button variant="outline" size="icon" aria-label="Next page" title="Next page" disabled={page >= pageCount || isLoading || Boolean(error)} onClick={() => navigate({ search: { q, page: page + 1 } })}><ChevronRight /></Button>
          </div>
        </div>
      </section>
    </DashboardLayout>
  );
}