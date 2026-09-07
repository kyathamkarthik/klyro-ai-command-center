import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
import { supabase } from "@/integrations/supabase/client";
import { useSession } from "@/lib/auth";

export function LoginScreen() {
  const navigate = useNavigate();
  const { session, loading } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [founderOpen, setFounderOpen] = useState(false);

  useEffect(() => {
    if (!loading && session) navigate({ to: "/cockpit", replace: true });
  }, [loading, session, navigate]);

  const signInWithProvider = async (provider: "google" | "github") => {
    setBusy(provider);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + "/cockpit" },
    });
    if (error) {
      toast.error(`${provider === "google" ? "Google" : "GitHub"} sign-in failed. Please try again.`);
      setBusy(null);
    }
  };


  const withEmail = async (mode: "signin" | "signup") => {
    if (!email || !password) {
      toast.error("Enter your work email and password.");
      return;
    }
    setBusy(mode);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Check your email to confirm your account, then sign in.");
          return;
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      navigate({ to: "/cockpit", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="grid min-h-screen bg-background lg:grid-cols-[minmax(0,1fr)_480px]">
      <section className="hidden flex-col justify-between border-r border-border bg-sidebar p-12 lg:flex">
        <div className="flex items-center">
          <img src="/logo.png" alt="Klyro Logo" className="h-10 w-auto" />
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
          <div className="mb-8 flex items-center lg:hidden">
            <img src="/logo.png" alt="Klyro Logo" className="h-10 w-auto" />
          </div>
          <h2 className="text-lg font-semibold text-foreground">Sign in to your cockpit</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Use your corporate identity provider or Klyro credentials.
          </p>

          <div className="mt-6 space-y-3">
            <Button
              variant="outline"
              className="w-full"
              disabled={busy !== null}
              onClick={() => signInWithProvider("google")}
            >
              {busy === "google" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={busy !== null}
              onClick={() => signInWithProvider("github")}
            >
              {busy === "github" ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Continue with GitHub
            </Button>
          </div>


          <div className="my-5 flex items-center gap-3 text-[11px] uppercase tracking-widest text-muted-foreground">
            <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button
              className="w-full"
              disabled={busy !== null}
              onClick={() => withEmail("signin")}
            >
              {busy === "signin" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Sign In
            </Button>
            <Button
              variant="outline"
              className="w-full"
              disabled={busy !== null}
              onClick={() => withEmail("signup")}
            >
              {busy === "signup" ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Start 2-Day Free Trial <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <p className="mt-6 text-center text-[11px] text-muted-foreground">
            New accounts start with 15.00 Klyro Recovery Credits.
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
            <img
              src="/karthik.jpg"
              alt="Kyatham Karthik"
              className="rounded-full h-24 w-24 mx-auto mb-4 object-cover shadow-lg"
            />
            <DialogTitle className="text-center text-lg">About the Founder</DialogTitle>
            <DialogDescription className="pt-2 text-sm leading-relaxed text-foreground">
              {FOUNDER_BIO}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
