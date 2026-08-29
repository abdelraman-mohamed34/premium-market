"use server";
import { checkoutInputSchema } from "@/schemas/order.schema";
import { authContext } from "./action-utils";
import { checkoutCart, listOrders } from "@/services/order.service";
import { getCart } from "@/services/cart.service";
import { cartCatalog } from "@/lib/products/cart-catalog";
export async function listOrdersAction() { try { const c = await authContext(); return { success: true as const, data: await listOrders(c.tenantId, c.userId) }; } catch (e) { return { success: false as const, error: e instanceof Error ? e.message : "Unable to load orders" }; } }
export async function createOrderAction(input: unknown) {
    const parsed = checkoutInputSchema.safeParse(input);
    if (!parsed.success) return { success: false as const, error: "Invalid shipping or payment details" };
    try {
        const c = await authContext();
        const cart = await getCart(c.tenantId, c.userId);
        if (!cart?.items.length) throw new Error("Your cart is empty");
        const items = cart.items.map((item) => {
            const product = cartCatalog.find((candidate) => String(candidate.id) === String(item.productId));
            if (!product) throw new Error(`Product ${item.title} is no longer available`);
            if (item.selectedColor && !product.colors.includes(item.selectedColor)) throw new Error(`Selected option for ${product.title} is unavailable`);
            if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) throw new Error(`Invalid quantity for ${product.title}`);
            return { ...item, tenant_id: c.tenantId, title: product.title, image: product.image, price: product.price };
        });
        return { success: true as const, data: await checkoutCart(c.tenantId, items, parsed.data) };
    } catch (e) { return { success: false as const, error: e instanceof Error ? e.message : "Unable to create order" }; }
}
export const checkoutAction = createOrderAction;
