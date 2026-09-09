import { AlertTriangle, Loader2, Wallet } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { BuyCreditsDialog } from "@/components/buy-credits-dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useSession } from "@/lib/auth";
import {
  consumeCredits,
  EXHAUSTED_THRESHOLD,
  formatCredits,
  useTransactions,
  useWallet,
} from "@/lib/wallet";

export function useCreditGuard() {
  const { user } = useSession();
  const { data: wallet, isLoading } = useWallet(user?.id);
  const balance = Number(wallet?.current_balance ?? 0);
  return {
    userId: user?.id,
    wallet,
    balance,
    isLoading,
    exhausted: !isLoading && balance <= EXHAUSTED_THRESHOLD,
  };
}

export function CreditsExhaustedBanner() {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex flex-col gap-3 rounded-sm border border-destructive/40 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-2">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
        <p className="text-sm text-foreground">
          Your Klyro Recovery Credits are exhausted. Please purchase additional credits
          to continue.
        </p>
      </div>
      <Button size="sm" onClick={() => setOpen(true)}>
        Buy More Credits
      </Button>
      <BuyCreditsDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

export function WalletSummaryCard() {
  const { user } = useSession();
  const { data: wallet, isLoading } = useWallet(user?.id);
  const { data: transactions } = useTransactions(user?.id);
  const [buyOpen, setBuyOpen] = useState(false);

  const balance = Number(wallet?.current_balance ?? 0);
  const total = Number(wallet?.total_purchased ?? 0);
  const percent = total > 0 ? Math.min(100, (balance / total) * 100) : 0;

  return (
    <div className="space-y-4">
      <div className="rounded-sm border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              <Wallet className="h-3.5 w-3.5" /> Credit Wallet
            </p>
            <p className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
              {isLoading ? "—" : `${formatCredits(balance)} Klyro Recovery Credits`}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {formatCredits(balance)} of {formatCredits(total)} credits remaining
            </p>
          </div>
          <Button size="sm" variant="outline" onClick={() => setBuyOpen(true)}>
            Buy More Credits
          </Button>
        </div>
        <Progress value={percent} className="mt-4 h-2" />
        <BuyCreditsDialog open={buyOpen} onOpenChange={setBuyOpen} />
      </div>

      <div className="rounded-sm border border-border bg-card">
        <div className="border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold text-foreground">Recent Usage</h3>
          <p className="text-xs text-muted-foreground">
            Last 10 credit-consuming actions on this account.
          </p>
        </div>
        {transactions && transactions.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Action / Feature</TableHead>
                <TableHead>Credits Used</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="text-sm">{tx.feature}</TableCell>
                  <TableCell className="font-mono text-sm text-destructive">
                    -{formatCredits(tx.credits_used)}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(tx.created_at).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="px-5 py-10 text-center text-sm text-muted-foreground">
            No AI healing activity yet.
          </p>
        )}
      </div>
    </div>
  );
}

export function SidebarWalletBadge() {
  const { user } = useSession();
  const { data: wallet } = useWallet(user?.id);
  const balance = Number(wallet?.current_balance ?? 0);
  const total = Number(wallet?.total_purchased ?? 0);
  const percent = total > 0 ? Math.min(100, (balance / total) * 100) : 0;

  return (
    <div className="rounded-sm border border-sidebar-border bg-sidebar-accent/40 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        Credit Wallet
      </p>
      <p className="mt-1 text-sm font-semibold text-foreground">
        {formatCredits(balance)} Klyro Recovery Credits
      </p>
      <Progress value={percent} className="mt-2 h-1.5" />
    </div>
  );
}

/** Runs a credit-consuming AI action, debiting the wallet on success. */
export function useAiAction() {
  const { userId, balance, exhausted, isLoading } = useCreditGuard();
  const [running, setRunning] = useState<string | null>(null);

  const run = async (feature: string, cost: number, work?: () => Promise<void>) => {
    if (!userId || exhausted) return;
    setRunning(feature);
    try {
      if (work) await work();
      await consumeCredits(userId, feature, cost, balance);
      toast.success(`${feature} complete · ${formatCredits(cost)} credits used`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : `${feature} failed`);
    } finally {
      setRunning(null);
    }
  };

  return { run, running, exhausted, isLoading, balance };
}
