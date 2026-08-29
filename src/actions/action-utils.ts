import "server-only";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getTenantDetails } from "@/app/shared/lib/graphood/services";
import { graphoodServerClient } from "@/app/shared/lib/graphood/server";

export async function authContext() {
    const requestHeaders = await headers();
    const tenantSlug = requestHeaders.get("x-tenant-slug");
    const supabase = await createSupabaseServerClient();
    const { data } = await supabase.auth.getUser();
    if (!tenantSlug || !data.user) throw new Error("Authentication and tenant context are required");
    const tenantResponse = await getTenantDetails(tenantSlug, graphoodServerClient);
    const tenantId = tenantResponse.data?.tenant?.id;
    if (!tenantResponse.success || !tenantId) throw new Error("Unable to resolve tenant context");
    return { tenantId, userId: data.user.id };
}
