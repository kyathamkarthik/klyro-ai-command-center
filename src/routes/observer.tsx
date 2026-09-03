import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Filter, RotateCw, Search } from "lucide-react";
import { useState } from "react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/observer")({
  head: () => ({
    meta: [
      { title: "IFlow & MPL Observer | Klyro AI" },
      {
        name: "description",
        content:
          "Live view of failed SAP Message Processing Logs retrieved via OData, with error codes, iFlow names and retry status.",
      },
      { property: "og:title", content: "IFlow & MPL Observer | Klyro AI" },
      {
        property: "og:description",
        content: "Monitor failed SAP MPLs across iFlows in real time.",
      },
    ],
  }),
  component: Observer,
});

const logs = [
  {
    id: "AGAS9tqK1_zLqM4dR2v",
    iflow: "SO_Replication_ECC_to_S4",
    code: "MAPPING_ERROR",
    ts: "2026-09-03 08:41:12",
    status: "Failed",
  },
  {
    id: "AGAS9tqK1_pQ8xN0aB7",
    iflow: "Invoice_Dispatch_Ariba",
    code: "HTTP_502_BAD_GATEWAY",
    ts: "2026-09-03 08:37:55",
    status: "Healing",
  },
  {
    id: "AGAS9tqK1_hV3mY6cE1",
    iflow: "MaterialMaster_Sync_MDG",
    code: "SCHEMA_VALIDATION",
    ts: "2026-09-03 08:29:04",
    status: "Escalated",
  },
  {
    id: "AGAS9tqK1_wR7jT2sU9",
    iflow: "Payment_Advice_SWIFT",
    code: "AUTH_TOKEN_EXPIRED",
    ts: "2026-09-03 08:16:38",
    status: "Recovered",
  },
  {
    id: "AGAS9tqK1_kL5bF8dQ3",
    iflow: "Delivery_Confirm_EWM",
    code: "IDOC_SEGMENT_MISSING",
    ts: "2026-09-03 07:58:20",
    status: "Failed",
  },
  {
    id: "AGAS9tqK1_zX1nP4gH6",
    iflow: "CustomerMaster_C4C",
    code: "DUPLICATE_KEY",
    ts: "2026-09-03 07:44:02",
    status: "Recovered",
  },
  {
    id: "AGAS9tqK1_tB6cJ9mW2",
    iflow: "GRN_Posting_MM",
    code: "TIMEOUT_RECEIVER",
    ts: "2026-09-03 07:30:47",
    status: "Healing",
  },
];

const statusStyles: Record<string, string> = {
  Failed: "border-destructive/40 bg-destructive/10 text-destructive",
  Healing: "border-primary/40 bg-accent text-primary",
  Escalated: "border-warning/50 bg-warning/10 text-warning",
  Recovered: "border-success/40 bg-success/10 text-success",
};

const metrics = [
  { label: "Failed MPLs (24h)", value: "148", sub: "+12 vs yesterday" },
  { label: "Auto-recovered", value: "121", sub: "81.8% recovery rate" },
  { label: "Awaiting HITL", value: "9", sub: "avg wait 6m 12s" },
  { label: "Monitored iFlows", value: "37", sub: "across 3 tenants" },
];

function Observer() {
  const [q, setQ] = useState("");
  const rows = logs.filter((l) =>
    (l.iflow + l.id + l.code).toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <DashboardLayout
      title="IFlow & MPL Observer"
      description="Message Processing Logs polled from /MessageProcessingLogs OData endpoint"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="panel p-4">
            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">
              {m.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums">{m.value}</p>
            <p className="mt-1 text-[11px] text-muted-foreground">{m.sub}</p>
          </div>
        ))}
      </div>

      <div className="panel mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border p-4">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Failed message processing logs
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search iFlow, MPL ID, error code"
                className="h-8 w-64 pl-8 text-xs"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="mr-2 h-3.5 w-3.5" /> Filter
            </Button>
            <Button variant="outline" size="sm">
              <RotateCw className="mr-2 h-3.5 w-3.5" /> Refresh
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-muted">
              <TableHead className="text-[11px] uppercase tracking-wide">MPL ID</TableHead>
              <TableHead className="text-[11px] uppercase tracking-wide">
                IFlow name
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-wide">
                Error code
              </TableHead>
              <TableHead className="text-[11px] uppercase tracking-wide">
                Timestamp
              </TableHead>
              <TableHead className="text-right text-[11px] uppercase tracking-wide">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((l) => (
              <TableRow key={l.id}>
                <TableCell className="font-mono text-xs">{l.id}</TableCell>
                <TableCell className="text-xs font-medium">{l.iflow}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {l.code}
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {l.ts}
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="outline" className={statusStyles[l.status]}>
                    {l.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </DashboardLayout>
  );
}
