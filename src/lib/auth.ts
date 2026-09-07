import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";

import { supabase } from "@/integrations/external/client";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      if (!mounted) return;
      setSession(next);
      setLoading(false);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, user: session?.user ?? null, loading };
}

export function displayNameFor(user: User | null): {
  email: string;
  displayName: string;
  initials: string;
} {
  const email = user?.email ?? "";
  const metaName =
    (user?.user_metadata?.["full_name"] as string | undefined) ??
    (user?.user_metadata?.["name"] as string | undefined) ??
    "";
  const parts = (metaName || (email.split("@")[0] ?? ""))
    .split(/[._\-\s]/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1));
  const displayName = parts.join(" ") || "Klyro User";
  const initials =
    parts
      .map((p) => p.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase() || "KU";
  return { email, displayName, initials };
}

export async function signOutEverywhere() {
  await supabase.auth.signOut();
}
