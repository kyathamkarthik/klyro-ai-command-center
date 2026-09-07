// External Supabase project client (user-owned production backend).
// Configured explicitly at the user's request; this replaces the built-in
// backend for all frontend reads/writes and auth.
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://gmwcsrllveveoouifsdj.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_ICqZxvOy-CGsnQQKUT1HPg_Js0aLB9U";

function externalFetch(): typeof fetch {
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== "undefined" && input instanceof Request ? input.headers : undefined,
    );
    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }
    // New-format publishable keys are opaque strings, not bearer JWTs.
    if (headers.get("Authorization") === `Bearer ${SUPABASE_PUBLISHABLE_KEY}`) {
      headers.delete("Authorization");
    }
    headers.set("apikey", SUPABASE_PUBLISHABLE_KEY);
    return fetch(input, { ...init, headers });
  };
}

function createExternalClient() {
  return createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    global: { fetch: externalFetch() },
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}

let _client: ReturnType<typeof createExternalClient> | undefined;

export const supabase = new Proxy({} as ReturnType<typeof createExternalClient>, {
  get(_target, prop, receiver) {
    if (!_client) _client = createExternalClient();
    return Reflect.get(_client, prop, receiver);
  },
});
