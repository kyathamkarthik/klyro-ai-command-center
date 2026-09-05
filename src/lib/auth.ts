const KEY = "klyro.session";

export function signIn(plan: "trial" | "signin" = "signin", email?: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    KEY,
    JSON.stringify({ plan, email: email ?? null, at: Date.now() }),
  );
}

export function signOut() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function isSignedIn() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) !== null;
}

export function getUserEmail(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as { email?: string | null };
    return session.email ?? null;
  } catch {
    return null;
  }
}
