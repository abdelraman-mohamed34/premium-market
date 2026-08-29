import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

export async function createSupabaseServerClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!url || !key) throw new Error("Missing public Supabase configuration");
    const store = await cookies();
    return createServerClient<Database>(url, key, {
        cookies: {
            getAll: () => store.getAll(),
            setAll(values) {
                try {
                    values.forEach(({ name, value, options }) => store.set(name, value, options));
                } catch {
                    // Server Components cannot write cookies; proxy refresh handles this.
                }
            },
        },
    });
}
