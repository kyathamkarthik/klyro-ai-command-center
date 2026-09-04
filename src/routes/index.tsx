import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";
import { useState } from "react";

import logoAsset from "@/assets/klyro-logo.png.asset.json";
import { FOUNDER_BIO } from "@/components/dashboard-layout";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/lib/auth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign In | Klyro AI Autonomous SAP Recovery" },
      {
        name: "description",
        content:
          "Sign in to Klyro AI or start a 2-day free trial to monitor, heal and re-trigger failed SAP Integration Suite messages autonomously.",
      },
      { property: "og:title", content: "Sign In | Klyro AI" },
      {
        property: "og:description",
        content: "Access the Klyro AI cockpit for autonomous SAP integration recovery.",
      },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("anika.kaur@klyro.ai");
  const [password, setPassword] = useState("••••••••••");
  const [founderOpen, setFounderOpen] = useState(false);

  const enter = (plan: "signin" | "trial") => {
    signIn(plan);
    navigate({ to: "/cockpit" });
  };

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,1fr)_480px]">
      <section className="hidden flex-col justify-between border-r border-border bg-sidebar p-12 lg:flex">
        <div className="flex items-center gap-3">
          <img src={logoAsset.url} alt="Klyro AI" className="h-11 w-auto" />
          <span className="text-3xl font-extrabold tracking-tight text-sidebar-foreground">
            Klyro AI
          </span>
        </div>
        <div className="max-w-lg">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground">
            Autonomous recovery for SAP Integration Suite
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            Klyro AI observes message processing logs, heals malformed payloads with
            semantic mapping, and escalates only what needs a human decision.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-muted-foreground">
            {[
              "OAuth-secured tenant connectivity across Dev, QA and Prod",
              "Circuit-breaker protected auto re-trigger",
              "Human-in-the-loop review with full audit trail",
            ].map((f) => (
              <li key={f} className="flex gap-2">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={() => setFounderOpen(true)}
          className="flex w-fit items-center gap-2 text-xs font-semibold text-primary hover:underline"
        >
          <Sparkles className="h-4 w-4" /> About the Founder
        </button>
      </section>

      <section className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2.5 lg:hidden">
            <img src={logoAsset.url} alt="Klyro AI" className="h-9 w-auto" />
            <span className="text-3xl font-extrabold tracking-tight">Klyro AI</span>
          </div>
          <h2 className="text-lg font-semibold text-foreground">Sign in to your cockpit</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Use your corporate identity provider or Klyro credentials.
          </p>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Work email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={() => enter("signin")}>
              Sign In
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => enter("trial")}
            >
              Start 2-Day Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <p className="mt-6 text-center text-[11px] text-muted-foreground">
            Google SSO and SAML available on Enterprise plans.
          </p>
          <button
            onClick={() => setFounderOpen(true)}
            className="mx-auto mt-4 flex items-center gap-1.5 text-[11px] font-semibold text-primary hover:underline lg:hidden"
          >
            <Sparkles className="h-3.5 w-3.5" /> About the Founder
          </button>
        </div>
      </section>

      <Dialog open={founderOpen} onOpenChange={setFounderOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-lg">About the Founder</DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-relaxed text-foreground">
              {FOUNDER_BIO}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
