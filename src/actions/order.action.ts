"use server";
import { checkoutInputSchema } from "@/schemas/order.schema";
import { authContext } from "./action-utils";
import { checkoutCart, listOrders } from "@/services/order.service";
import { getCart } from "@/services/cart.service";
import { cartCatalog } from "@/lib/products/cart-catalog";
import { getProductById } from "@/services/product.service";
export async function listOrdersAction() { try { const c = await authContext(); return { success: true as const, data: await listOrders(c.tenantId, c.userId) }; } catch (e) { return { success: false as const, error: e instanceof Error ? e.message : "Unable to load orders" }; } }
export async function createOrderAction(input: unknown) {
    const parsed = checkoutInputSchema.safeParse(input);
    if (!parsed.success) return { success: false as const, error: "Invalid shipping or payment details" };
    try {
        const c = await authContext();
        const cart = await getCart(c.tenantId, c.userId);
        if (!cart?.items.length) throw new Error("Your cart is empty");
        const items = await Promise.all(cart.items.map(async (item) => {
            const productId = String(item.productId).split(/[?#]/, 1)[0].trim();
            const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(productId);
            const product = isUuid
                ? await getProductById(c.tenantId, productId)
                : cartCatalog.find((candidate) => String(candidate.id) === productId);

            if (!product) {
                console.error('[Checkout Error] Product validation failed:', { productId, tenantId: c.tenantId, reason: 'Product not found for tenant' });
                throw new Error(`Product ${item.title} is no longer available`);
            }
            if ('inStock' in product && product.inStock === false) {
                console.error('[Checkout Error] Product validation failed:', { productId, tenantId: c.tenantId, reason: 'Product explicitly out of stock' });
                throw new Error(`Product ${product.title} is no longer available`);
            }
            if (item.selectedColor && !product.colors.includes(item.selectedColor)) {
                console.error('[Checkout Error] Product validation failed:', { productId, tenantId: c.tenantId, reason: 'Selected color is unavailable' });
                throw new Error(`Selected option for ${product.title} is unavailable`);
            }
            if (!Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 99) {
                console.error('[Checkout Error] Product validation failed:', { productId, tenantId: c.tenantId, reason: 'Invalid quantity', quantity: item.quantity });
                throw new Error(`Invalid quantity for ${product.title}`);
            }

            const image = 'images' in product ? product.images[0] : product.image;
            return { ...item, tenant_id: c.tenantId, productId: product.id, title: product.title, image, price: product.price };
        }));
        return { success: true as const, data: await checkoutCart(c.tenantId, items, parsed.data) };
    } catch (e) { return { success: false as const, error: e instanceof Error ? e.message : "Unable to create order" }; }
}
export const checkoutAction = createOrderAction;
