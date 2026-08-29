import "server-only";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function tenantClient(tenantId: string) {
    const supabase = await createSupabaseServerClient() as any;
    return { supabase, tenantId };
}

export function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
    if (result.error) throw new Error(result.error.message);
    if (result.data === null) throw new Error("No data returned");
    return result.data;
}
