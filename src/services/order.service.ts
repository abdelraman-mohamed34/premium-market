import { orderSchema, type Order } from "@/schemas/order.schema";
import { tenantClient, unwrap } from "./service-utils";
import type { CartItem } from "@/schemas/cart.schema";
import type { CheckoutInput } from "@/schemas/order.schema";
export async function listOrders(tenantId: string, userId: string): Promise<Order[]> { const { supabase } = await tenantClient(tenantId); const result = unwrap(await supabase.from("orders").select("*").eq("tenant_id", tenantId).eq("user_id", userId).order("created_at", { ascending: false })); return (result as unknown[]).map((row) => orderSchema.parse(row)); }
export async function createOrder(tenantId: string, userId: string, input: Order): Promise<Order> { const { supabase } = await tenantClient(tenantId); return orderSchema.parse(unwrap(await supabase.from("orders").insert({ ...input, tenant_id: tenantId, user_id: userId }).select().single())); }
export async function checkoutCart(tenantId: string, items: CartItem[], input: CheckoutInput): Promise<{ orderId: string; orderNumber: string }> {
    const { supabase } = await tenantClient(tenantId);
    const result = await supabase.rpc("checkout_cart", { p_tenant_id: tenantId, p_items: items, p_shipping_address: input.shippingAddress, p_payment_method: input.paymentMethod, p_notes: input.notes ?? null });
    if (result.error) throw new Error(result.error.message);
    const row = Array.isArray(result.data) ? result.data[0] : result.data;
    if (!row?.order_id || !row?.order_number) throw new Error("Order creation returned no confirmation");
    return { orderId: row.order_id, orderNumber: row.order_number };
}
