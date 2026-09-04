const KEY = "klyro.session";

export function signIn(plan: "trial" | "signin" = "signin") {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify({ plan, at: Date.now() }));
}

export function signOut() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
}

export function isSignedIn() {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(KEY) !== null;
}
