import { cartSchema, type Cart } from "@/schemas/cart.schema";
import { tenantClient, unwrap } from "./service-utils";

function fromRow(row: Record<string, unknown>): Cart {
    const items = Array.isArray(row.items)
        ? row.items.map((item) => ({ ...(item as object), tenant_id: (item as { tenant_id?: string }).tenant_id ?? row.tenant_id }))
        : [];
    return cartSchema.parse({ ...row, tenant_id: row.tenant_id, tenantId: row.tenant_id, userId: row.user_id, updatedAt: row.updated_at, items });
}

export async function getCart(tenantId: string, userId: string): Promise<Cart | null> {
    const { supabase } = await tenantClient(tenantId);
    const result = await supabase.from("carts").select("*").eq("tenant_id", tenantId).eq("user_id", userId).order("updated_at", { ascending: false }).limit(1);
    if (result.error) throw new Error(result.error.message);
    const row = result.data?.[0];
    return row ? fromRow(row as Record<string, unknown>) : null;
}

export async function saveCart(tenantId: string, userId: string, cart: Cart): Promise<Cart> {
    const { supabase } = await tenantClient(tenantId);
    const row = unwrap(await supabase.from("carts").upsert({ id: cart.id, tenant_id: tenantId, user_id: userId, items: cart.items, summary: cart.summary, updated_at: new Date().toISOString() }, { onConflict: "tenant_id,user_id" }).select().single());
    return fromRow(row as Record<string, unknown>);
}
