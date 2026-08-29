"use server";
import { addToCartSchema, cartSchema, updateCartItemQuantitySchema } from "@/schemas/cart.schema";
import { authContext } from "./action-utils";
import { getCart, saveCart } from "@/services/cart.service";
import { cartCatalog } from "@/lib/products/cart-catalog";
export async function getCartAction() { try { const c = await authContext(); return { success: true as const, data: await getCart(c.tenantId, c.userId) }; } catch (e) { return { success: false as const, error: e instanceof Error ? e.message : "Unable to load cart" }; } }
export async function saveCartAction(input: unknown) { const parsed = cartSchema.safeParse(input); if (!parsed.success) return { success: false as const, error: "Invalid cart" }; try { const c = await authContext(); return { success: true as const, data: await saveCart(c.tenantId, c.userId, parsed.data) }; } catch (e) { return { success: false as const, error: e instanceof Error ? e.message : "Unable to save cart" }; } }

function calculateSummary(items: NonNullable<Awaited<ReturnType<typeof getCart>>>["items"]) {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { subtotal, shippingFee: 0, discountAmount: 0, total: subtotal };
}

export async function addToCartAction(input: unknown) {
    const parsed = addToCartSchema.safeParse(input);
    if (!parsed.success) return { success: false as const, error: "Invalid product options" };
    try {
        const c = await authContext();
        const product = cartCatalog.find((item) => String(item.id) === String(parsed.data.productId));
        if (!product) throw new Error("Product not found");
        if (parsed.data.selectedColor && !product.colors?.includes(parsed.data.selectedColor)) throw new Error("Selected color is unavailable");

        const price = product.price;
        const image = product.image;
        const cart = await getCart(c.tenantId, c.userId);
        const items = [...(cart?.items ?? [])];
        const existingIndex = items.findIndex((item) => String(item.productId) === String(product.id) && item.selectedColor === parsed.data.selectedColor && item.selectedSize === parsed.data.selectedSize);

        if (existingIndex >= 0) items[existingIndex] = { ...items[existingIndex], quantity: items[existingIndex].quantity + parsed.data.quantity };
        else items.push({ tenant_id: c.tenantId, id: crypto.randomUUID(), productId: product.id, title: product.title, slug: String(product.id), image, selectedColor: parsed.data.selectedColor, selectedSize: parsed.data.selectedSize, price, quantity: parsed.data.quantity });

        return { success: true as const, data: await saveCart(c.tenantId, c.userId, { id: cart?.id, tenant_id: c.tenantId, tenantId: c.tenantId, userId: c.userId, items, summary: calculateSummary(items), updatedAt: new Date() }) };
    } catch (e) { return { success: false as const, error: e instanceof Error ? e.message : "Unable to add item to cart" }; }
}

export async function updateCartItemAction(input: unknown) {
    const parsed = updateCartItemQuantitySchema.safeParse(input);
    if (!parsed.success) return { success: false as const, error: "Invalid cart quantity" };
    try {
        const c = await authContext();
        const cart = await getCart(c.tenantId, c.userId);
        if (!cart) throw new Error("Cart not found");
        const items = parsed.data.quantity === 0
            ? cart.items.filter((item) => String(item.id) !== String(parsed.data.cartItemId))
            : cart.items.map((item) => String(item.id) === String(parsed.data.cartItemId) ? { ...item, quantity: parsed.data.quantity } : item);
        return { success: true as const, data: await saveCart(c.tenantId, c.userId, { ...cart, items, summary: calculateSummary(items) }) };
    } catch (e) { return { success: false as const, error: e instanceof Error ? e.message : "Unable to update cart" }; }
}

export async function clearCartAction() {
    try {
        const c = await authContext();
        const cart = await getCart(c.tenantId, c.userId);
        if (!cart) return { success: true as const, data: null };
        return { success: true as const, data: await saveCart(c.tenantId, c.userId, { ...cart, items: [], summary: calculateSummary([]) }) };
    } catch (e) { return { success: false as const, error: e instanceof Error ? e.message : "Unable to clear cart" }; }
}
