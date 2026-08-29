import "server-only";

import type { User } from "@supabase/supabase-js";
import { getMemberships, getTenantDetails } from "@/app/shared/lib/graphood/services";
import { graphoodServerClient } from "@/app/shared/lib/graphood/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const tenantRoles = ["TEACHER", "ASSISTANT", "STUDENT"] as const;
export type TenantRole = (typeof tenantRoles)[number];

export interface TenantAuthSession {
    userId: string;
    tenantId: string;
    tenantSlug: string;
    role: TenantRole;
    status: "ACTIVE";
}

function tenantOwnerId(tenant: Awaited<ReturnType<typeof getTenantDetails>>["data"]["tenant"]): string | null {
    return tenant.owner_id ?? tenant.ownerId ?? tenant.owner?.id ?? null;
}

function tenantOwnerEmail(tenant: Awaited<ReturnType<typeof getTenantDetails>>["data"]["tenant"]): string | null {
    return tenant.owner_email ?? tenant.ownerEmail ?? tenant.owner?.email ?? null;
}

function sameEmail(left: string | null | undefined, right: string | null | undefined) {
    if (!left || !right) return false;
    return left.trim().toLowerCase() === right.trim().toLowerCase();
}

function isCurrentUser(user: User, member: Awaited<ReturnType<typeof getMemberships>>["data"]["memberships"][number]) {
    return member.user.id === user.id || sameEmail(user.email, member.user.email);
}

export async function resolveTenantSession(
    tenantSlug: string,
    options: { user?: User; updateAuthMetadata?: boolean } = {},
): Promise<TenantAuthSession | null> {
    if (!tenantSlug) return null;

    const supabase = await createSupabaseServerClient();
    const user = options.user ?? (await supabase.auth.getUser()).data.user;
    if (!user) return null;

    const tenantResponse = await getTenantDetails(tenantSlug, graphoodServerClient);
    const tenant = tenantResponse.data?.tenant;
    if (!tenantResponse.success || !tenant?.id || tenant.status !== "ACTIVE") return null;

    let role: TenantRole = "STUDENT";
    const ownerByTenant = user.id === tenantOwnerId(tenant) || sameEmail(user.email, tenantOwnerEmail(tenant));
    if (ownerByTenant) {
        role = "TEACHER";
    } else {
        try {
            const response = await getMemberships(tenant.slug || tenantSlug, graphoodServerClient, { cache: "no-store" });
            const memberships = response.data?.memberships?.filter((item) =>
                item.status === "ACTIVE" && isCurrentUser(user, item),
            ) ?? [];
            if (memberships.some((item) => item.role === "OWNER")) role = "TEACHER";
            else if (memberships.some((item) => item.role === "ADMIN" || item.role === "STAFF")) role = "ASSISTANT";
        } catch (error) {
            // Graphood can temporarily return no membership data while provisioning.
            console.warn("[Tenant Role Resolution] Membership lookup unavailable; using STUDENT.", error);
        }
    }

    const session: TenantAuthSession = {
        userId: user.id,
        tenantId: tenant.id,
        tenantSlug: tenant.slug || tenantSlug,
        role,
        status: "ACTIVE",
    };

    try {
        const { error: membershipError } = await createSupabaseAdminClient()
            .from("tenant_memberships")
            .upsert(
                { user_id: user.id, tenant_id: tenant.id, role, status: "ACTIVE" },
                { onConflict: "user_id,tenant_id" },
            );
        if (membershipError) {
            console.error("[Tenant Role Resolution] Membership upsert failed:", membershipError.message);
        }
    } catch (error) {
        // Auth must not be reported as failed after Supabase has authenticated the
        // user. Configure SUPABASE_SECRET_KEY to enable the authoritative upsert.
        console.error("[Tenant Role Resolution] Membership persistence unavailable:", error);
    }

    if (options.updateAuthMetadata) {
        const { error } = await supabase.auth.updateUser({
            data: {
                ...user.user_metadata,
                tenant_id: session.tenantId,
                tenant_slug: session.tenantSlug,
                tenant_role: session.role,
                tenant_membership_status: session.status,
            },
        });
        if (error) throw new Error(`Unable to update tenant session claims: ${error.message}`);
    }

    return session;
}

export async function requireTenantSession(tenantSlug: string): Promise<TenantAuthSession> {
    const session = await resolveTenantSession(tenantSlug);
    if (!session) throw new Error("Authentication required for this tenant");
    return session;
}

export async function requireTenantRole(
    tenantSlug: string,
    allowedRoles: readonly TenantRole[],
): Promise<TenantAuthSession> {
    const session = await requireTenantSession(tenantSlug);
    if (!allowedRoles.includes(session.role)) throw new Error("Forbidden");
    return session;
}
