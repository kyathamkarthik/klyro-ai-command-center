import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { supabase } from "@/integrations/supabase/client";

export const EXHAUSTED_THRESHOLD = 0.2;

export type Wallet = {
  id: string;
  user_id: string;
  current_balance: number;
  total_purchased: number;
};

export type CreditTransaction = {
  id: string;
  feature: string;
  credits_used: number;
  created_at: string;
};

export type CreditPackage = {
  id: string;
  tier: string;
  name: string;
  price_usd: number | null;
  credits: number | null;
  is_custom: boolean;
  sort_order: number;
};

export function useWallet(userId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["credit-wallet", userId],
    enabled: Boolean(userId),
    refetchOnWindowFocus: true,
    queryFn: async (): Promise<Wallet | null> => {
      const { data, error } = await supabase
        .from("credit_wallets")
        .select("id,user_id,current_balance,total_purchased")
        .eq("user_id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data as Wallet | null;
    },
  });

  useEffect(() => {
    if (!userId) return;
    const channel = supabase
      .channel(`wallet-${userId}`)
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
      const { data, error } = await supabase
        .from("credit_transactions")
        .select("id,feature,credits_used,created_at")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(10);
      if (error) throw error;
      return (data ?? []) as CreditTransaction[];
    },
  });
}

export function useCreditPackages() {
  return useQuery({
    queryKey: ["credit-packages"],
    queryFn: async (): Promise<CreditPackage[]> => {
      const { data, error } = await supabase
        .from("credit_packages")
        .select("id,tier,name,price_usd,credits,is_custom,sort_order")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as CreditPackage[];
    },
  });
}

export function formatCredits(value: number | null | undefined) {
  return (Number(value ?? 0)).toFixed(2);
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
