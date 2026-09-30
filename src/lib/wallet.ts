import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { supabase } from "@/integrations/external/client";

export const EXHAUSTED_THRESHOLD = 0.2;

export type Wallet = {
  wallet_id: string;
  user_id: string;
  current_balance: number;
  total_credits_purchased: number;
  total_credits_used: number;
};

export type CreditTransaction = {
  id: string;
  feature: string;
  credits_used: number;
  created_at: string;
};

export function useWallet(userId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["credit-wallet", userId],
    enabled: Boolean(userId),
    refetchOnWindowFocus: true,
    queryFn: async (): Promise<Wallet | null> => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("credit_wallets")
        .select("wallet_id, user_id, current_balance, total_credits_purchased, total_credits_used")
        .eq("user_id", userId)
        .maybeSingle();
      if (error) throw error;
      return data as Wallet | null;
    },
  });

  useEffect(() => {
    if (!userId) return;

    // A unique channel name prevents multiple consumers / React Strict Mode re-mounts
    // from reusing an already-subscribed channel instance, which would raise
    // "cannot add 'postgres_changes' callbacks after 'subscribe()'".
    const channelId = `${userId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(`wallet-${channelId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "credit_wallets",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["credit-wallet", userId] });
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "credit_transactions",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["credit-transactions", userId] });
          queryClient.invalidateQueries({ queryKey: ["credit-wallet", userId] });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  return query;
}

export function useTransactions(userId: string | undefined) {
  return useQuery({
    queryKey: ["credit-transactions", userId],
    enabled: Boolean(userId),
    refetchOnWindowFocus: true,
    queryFn: async (): Promise<CreditTransaction[]> => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("credit_transactions")
        .select("id,feature,credits_used,created_at")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return (data ?? []) as CreditTransaction[];
    },
  });
}

export function formatCredits(value: number | null | undefined) {
  return (Number(value ?? 0)).toFixed(2);
}

export function formatWalletBalance(value: number | null | undefined) {
  return Number(value ?? 0).toFixed(4);
}

/** Records a credit-consuming AI operation and debits the wallet. */
export async function consumeCredits(
  userId: string,
  feature: string,
  amount: number,
  currentBalance: number,
) {
  const next = Math.max(0, Number((currentBalance - amount).toFixed(2)));
  const { error: txError } = await supabase.from("credit_transactions").insert({
    user_id: userId,
    feature,
    credits_used: amount,
  });
  if (txError) throw txError;

  const { error } = await supabase
    .from("credit_wallets")
    .update({ current_balance: next })
    .eq("user_id", userId);
  if (error) throw error;
  return next;
}
