import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Lock, RefreshCw } from "lucide-react";
import { useState } from "react";

import { DashboardLayout } from "@/components/dashboard-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export const Route = createFileRoute("/cockpit")({
  head: () => ({
    meta: [
      { title: "Tenant & Connection Hub | Klyro AI" },
      {
        name: "description",
        content:
          "Connect Klyro AI to your SAP Integration Suite tenant with OAuth client credentials and manage Dev, QA and Prod environments.",
      },
      { property: "og:title", content: "Tenant & Connection Hub | Klyro AI" },
      {
        property: "og:description",
        content: "Connect and manage your SAP Integration Suite tenants in Klyro AI.",
      },
    ],
  }),
  component: TenantHub,
});

const environments = [
  { id: "dev", label: "Dev", host: "klyro-dev.it-cpi012.cfapps.eu10" },
  { id: "qa", label: "QA", host: "klyro-qa.it-cpi012.cfapps.eu10" },
  { id: "prod", label: "Prod", host: "klyro-prd.it-cpi012.cfapps.eu10" },
];

function TenantHub() {
  const [env, setEnv] = useState("prod");
  const [connecting, setConnecting] = useState(false);
  const [tenant, setTenant] = useState("klyro-prd-it-cpi012");
  const [clientId, setClientId] = useState("sb-6b1e9a0f!b12345|it-rt-klyro-prd");
  const [secret, setSecret] = useState("a4f9-cc21-77bd-9f30-e1aa");

  const connect = () => {
    setConnecting(true);
    setTimeout(() => setConnecting(false), 1200);
  };

  return (
    <DashboardLayout
      title="Tenant & Connection Hub"
      description="OAuth client credentials for SAP Integration Suite runtime and OData APIs"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <section className="panel p-6">
          <h2 className="text-sm font-semibold text-foreground">Tenant credentials</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Credentials are stored encrypted and used only for MPL retrieval and message
            re-triggering.
          </p>
          <Separator className="my-5" />
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tenant">Tenant ID</Label>
              <Input
                id="tenant"
                value={tenant}
                onChange={(e) => setTenant(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client">Client ID</Label>
              <Input
                id="client"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                className="font-mono text-xs"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="secret">Client Secret</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="secret"
                  type="password"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                  className="pl-9 font-mono text-xs"
                />
              </div>
              <p className="text-[11px] text-muted-foreground">
                Masked at rest. Rotated automatically every 90 days.
              </p>
            </div>
          </div>
          <div className="mt-6 flex items-center gap-3">
            <Button onClick={connect} disabled={connecting}>
              {connecting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-2 h-4 w-4" />
              )}
              {connecting ? "Connecting…" : "Connect"}
            </Button>
            <span className="text-xs text-muted-foreground">
              Last handshake 3 min ago · token TTL 11h 42m
            </span>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="panel p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold">Connection status</h2>
              <span className="flex items-center gap-2 text-xs font-medium text-success">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                Active
              </span>
            </div>
            <dl className="mt-4 space-y-3 text-xs">
              {[
                ["Runtime node", "cpi-rt-eu10-014"],
                ["OData API", "v2 · /MessageProcessingLogs"],
                ["Latency", "184 ms"],
                ["Polling interval", "30 s"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="font-mono text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="panel p-5">
            <h2 className="text-sm font-semibold">Environments</h2>
            <div className="mt-4 space-y-2">
              {environments.map((e) => {
                const active = env === e.id;
                return (
                  <button
                    key={e.id}
                    onClick={() => setEnv(e.id)}
                    className={`flex w-full items-center justify-between rounded-sm border px-3 py-2.5 text-left transition-colors ${
                      active
                        ? "border-primary bg-accent"
                        : "border-border hover:bg-surface-muted"
                    }`}
                  >
                    <span>
                      <span className="block text-xs font-medium">{e.label}</span>
                      <span className="block font-mono text-[11px] text-muted-foreground">
                        {e.host}
                      </span>
                    </span>
                    {active ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : (
                      <Badge variant="outline" className="text-[10px]">
                        idle
                      </Badge>
                    )}
                  </button>
                );
              })}
            </div>
          </section>
        </aside>
      </div>
    </DashboardLayout>
  );
}
