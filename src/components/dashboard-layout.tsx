import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  Bot,
  ChevronDown,
  CreditCard,
  LogOut,
  Plug,
  Settings,
  ShieldCheck,
  Sparkles,
  UserRound,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";


import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getUserEmail, isSignedIn, signOut } from "@/lib/auth";

const navItems = [
  { to: "/cockpit", label: "Tenant & Connection Hub", icon: Plug },
  { to: "/observer", label: "IFlow & MPL Observer", icon: Activity },
  { to: "/healing", label: "Autonomous Healing", icon: Bot },
  { to: "/escalation", label: "HITL Escalation Queue", icon: ShieldCheck },
  { to: "/billing", label: "Billing & Plans", icon: CreditCard },
] as const;

export const FOUNDER_BIO =
  "Founded by Kyatham Karthik, a B.E. Computer Science Engineer specializing in SAP BTP and autonomous cloud integration. Backed by an AI/ML certification from IIT Patna Hub and a 1st place victory at the IIT Hyderabad Techgyan Hackathon, Klyro AI bridges the gap between static enterprise architectures and autonomous healing.";

export function DashboardLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  const navigate = useNavigate();
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [founderOpen, setFounderOpen] = useState(false);

  useEffect(() => {
    const ok = isSignedIn();
    setAuthed(ok);
    if (!ok) navigate({ to: "/", replace: true });
  }, [navigate]);

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">
        Verifying session…
      </div>
    );
  }

  const handleSignOut = () => {
    signOut();
    navigate({ to: "/", replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex h-20 items-center border-b border-sidebar-border px-5">
          <img src="/logo.png" alt="Klyro Logo" className="h-10 w-auto" />
        </div>
        <nav className="flex-1 space-y-1 p-3">
          <p className="px-2 pb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Operations
          </p>
          {navItems.map((item) => {
            const active = pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-sm border-l-2 px-3 py-2 text-sm transition-colors ${
                  active
                    ? "border-l-primary bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                    : "border-l-transparent text-sidebar-foreground hover:bg-sidebar-accent/60"
                }`}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                <span className="leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="space-y-3 border-t border-sidebar-border p-4 text-xs text-muted-foreground">
          <button
            onClick={() => setFounderOpen(true)}
            className="flex w-full items-center gap-2 rounded-sm border border-primary/40 bg-primary/5 px-3 py-2.5 text-left text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            About the Founder
          </button>
          <div className="flex items-center justify-between">
            <span>Agent runtime</span>
            <Badge variant="outline" className="border-success/40 text-success">
              v2.4.1
            </Badge>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-border bg-card px-6">
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-foreground">{title}</h1>
            <p className="truncate text-xs text-muted-foreground">{description}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-sm border border-border px-2 py-1.5 text-sm hover:bg-surface-muted">
              <Avatar className="h-7 w-7 rounded-sm">
                <AvatarFallback className="rounded-sm bg-primary text-xs text-primary-foreground">
                  AK
                </AvatarFallback>
              </Avatar>
              <span className="hidden text-left leading-tight sm:block">
                <span className="block text-xs font-medium">Anika Kaur</span>
                <span className="block text-[11px] text-muted-foreground">
                  Integration Lead
                </span>
              </span>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60">
              <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
                anika.kaur@klyro.ai
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <UserRound className="mr-2 h-4 w-4" /> Profile & identity
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ShieldCheck className="mr-2 h-4 w-4" /> Google SSO — connected
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" /> SSO & SAML settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <div className="flex gap-2 overflow-x-auto border-b border-border bg-card px-4 py-2 md:hidden">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="whitespace-nowrap rounded-sm border border-border px-3 py-1.5 text-xs data-[status=active]:border-primary data-[status=active]:text-primary"
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={() => setFounderOpen(true)}
            className="whitespace-nowrap rounded-sm border border-primary/40 px-3 py-1.5 text-xs font-semibold text-primary"
          >
            About the Founder
          </button>
        </div>

        <main className="flex-1 p-6">{children}</main>
      </div>

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
