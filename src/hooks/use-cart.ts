"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addToCartAction, clearCartAction, getCartAction, saveCartAction, updateCartItemAction } from "@/actions/cart.action";
import { toast } from "sonner";
import type { AddToCartInput, Cart, UpdateCartItemQuantityInput } from "@/schemas/cart.schema";

async function unwrapCart() {
    const result = await getCartAction();
    if (!result.success) throw new Error(result.error);
    return result.data;
}

export function useAddToCart(tenantId: string | null, sandbox = false) {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: async (input: AddToCartInput) => {
            if (!sandbox) return addToCartAction(input);
            const product = (await import("@/app/_components/view-products")).Products.find((item) => String(item.id) === String(input.productId));
            if (!product) return { success: false as const, error: "Product not found" };
            const queryKey = ["cart", "sandbox"] as const;
            qc.setQueryData<Cart>(queryKey, (current) => {
                const cart = current ?? { tenant_id: "00000000-0000-0000-0000-000000000000", items: [], summary: { subtotal: 0, shippingFee: 0, discountAmount: 0, total: 0 } };
                const items = [...cart.items]; const selectedColor = input.selectedColor; const index = items.findIndex((item) => String(item.productId) === String(input.productId) && item.selectedColor === selectedColor);
                if (index >= 0) items[index] = { ...items[index], quantity: items[index].quantity + input.quantity };
                else { const image = Array.isArray(product.image) ? product.image[0] : product.image; const price = Number(product.price.replace(/[^0-9.]/g, "")); items.push({ tenant_id: cart.tenant_id, id: crypto.randomUUID(), productId: product.id, title: product.title, slug: String(product.id), image, selectedColor, selectedSize: input.selectedSize, price, quantity: input.quantity }); }
                const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0); return { ...cart, items, summary: { ...cart.summary, subtotal, total: subtotal } };
            });
            return { success: true as const, data: null };
        },
        onSuccess: (result) => {
            if (result.success) {
                toast.success("Added to cart");
                if (!sandbox) qc.invalidateQueries({ queryKey: ["cart", tenantId] });
            } else toast.error(result.error);
        },
        onError: (error: Error) => toast.error(error.message || "Unable to add item to cart"),
    });
}

export function useCart(tenantId: string | null, sandbox = false) {
    const qc = useQueryClient();
    const queryKey = ["cart", sandbox ? "sandbox" : tenantId] as const;
    const refresh = () => qc.invalidateQueries({ queryKey });
    const mutationOptions = (message: string) => ({ onSuccess: (result: { success: boolean; error?: string }) => { if (result.success) { toast.success(message); refresh(); } else toast.error(result.error || "Cart update failed"); }, onError: (error: Error) => toast.error(error.message) });
    const emptySandboxCart: Cart = { tenant_id: "00000000-0000-0000-0000-000000000000", items: [], summary: { subtotal: 0, shippingFee: 0, discountAmount: 0, total: 0 } };
    const query = useQuery({ queryKey, queryFn: unwrapCart, enabled: !sandbox && Boolean(tenantId), initialData: sandbox ? emptySandboxCart : undefined });
    const save = useMutation({ mutationFn: saveCartAction, ...mutationOptions("Cart saved") });
    const updateItem = useMutation({
        mutationFn: async (input: UpdateCartItemQuantityInput) => {
            if (sandbox) return qc.getQueryData<Cart>(queryKey)!;
            const result = await updateCartItemAction(input);
            if (!result.success) throw new Error(result.error);
            return result.data;
        },
        onMutate: async (input) => {
            await qc.cancelQueries({ queryKey });
            const previousCart = qc.getQueryData<Cart | null>(queryKey);
            qc.setQueryData<Cart | null>(queryKey, (current) => {
                if (!current) return current;
                const items = input.quantity === 0
                    ? current.items.filter((item) => String(item.id) !== String(input.cartItemId))
                    : current.items.map((item) => String(item.id) === String(input.cartItemId) ? { ...item, quantity: input.quantity } : item);
                const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
                const discountAmount = Math.min(current.summary.discountAmount, subtotal);
                return { ...current, items, summary: { ...current.summary, subtotal, discountAmount, total: subtotal + current.summary.shippingFee - discountAmount } };
            });
            return { previousCart };
        },
        onSuccess: () => toast.success("Cart updated"),
        onError: (error: Error, _input, context) => {
            if (context) qc.setQueryData(queryKey, context.previousCart);
            toast.error(error.message || "Unable to update cart");
        },
        onSettled: () => { if (!sandbox) qc.invalidateQueries({ queryKey, refetchType: "active" }); },
    });
    const removeItem = useMutation({ mutationFn: async (cartItemId: string | number) => { if (sandbox) { const cart = qc.getQueryData<Cart>(queryKey); if (cart) { const items = cart.items.filter(item => String(item.id) !== String(cartItemId)); const subtotal = items.reduce((sum,item)=>sum+item.price*item.quantity,0); qc.setQueryData(queryKey,{...cart,items,summary:{...cart.summary,subtotal,total:subtotal}}); } return { success:true as const,data:null }; } return updateCartItemAction({ cartItemId, quantity: 0 }); }, ...mutationOptions("Item removed") });
    const clear = useMutation({ mutationFn: async () => { if (sandbox) { qc.setQueryData(queryKey,emptySandboxCart); return { success:true as const,data:null }; } return clearCartAction(); }, ...mutationOptions("Cart cleared") });
    return { ...query, save, updateItem, removeItem, clear };
}
