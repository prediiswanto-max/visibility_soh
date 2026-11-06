import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Server-only module: never import this from a "use client" component.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.SUPABASE_ANON_KEY

export const isSupabaseServerConfigured = Boolean(supabaseUrl && (serviceRoleKey || anonKey))

/**
 * Server-side Supabase client.
 * Prefers the service role key so reads keep working when RLS is locked down.
 */
export function createSupabaseServerClient(): SupabaseClient | null {
  const key = serviceRoleKey ?? anonKey
  if (!supabaseUrl || !key) return null

  return createClient(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }),
    },
  })
}
