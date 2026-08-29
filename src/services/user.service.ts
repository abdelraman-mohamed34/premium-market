import { userProfileSchema, type UserProfile } from "@/schemas/user.schema";
import { tenantClient, unwrap } from "./service-utils";
function fromRow(row: Record<string, unknown>): UserProfile {
    return userProfileSchema.parse({ ...row, tenant_id: row.tenant_id, tenantId: row.tenant_id, fullName: row.full_name, avatarUrl: row.avatar_url, isEmailVerified: row.is_email_verified, createdAt: row.created_at, updatedAt: row.updated_at });
}
export async function getUserProfile(tenantId: string, userId: string): Promise<UserProfile> { const { supabase } = await tenantClient(tenantId); return fromRow(unwrap(await supabase.from("profiles").select("*").eq("tenant_id", tenantId).eq("id", userId).single()) as Record<string, unknown>); }
export async function updateUserProfile(tenantId: string, userId: string, input: Partial<UserProfile>): Promise<UserProfile> { const { supabase } = await tenantClient(tenantId); const payload = { ...(input.fullName === undefined ? {} : { full_name: input.fullName }), ...(input.phone === undefined ? {} : { phone: input.phone }), ...(input.avatarUrl === undefined ? {} : { avatar_url: input.avatarUrl }), tenant_id: tenantId }; return fromRow(unwrap(await supabase.from("profiles").update(payload).eq("tenant_id", tenantId).eq("id", userId).select().single()) as Record<string, unknown>); }
