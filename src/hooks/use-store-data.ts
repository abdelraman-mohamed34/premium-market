"use client";
import { Products as mockProducts } from "@/app/_components/view-products";
import type { Product as UiProduct } from "@/features/_components/reusable/product-card";
import { useProducts } from "./use-products";
import { useAddToCart, useCart } from "./use-cart";

export function isSandboxTenant(tenantSlug?: string | null) { return !tenantSlug || tenantSlug.toLowerCase() === "sandbox"; }
export function useStoreProducts(tenantSlug: string | null, tenantId: string | null) {
    const isSandbox = isSandboxTenant(tenantSlug); const live = useProducts(tenantId ?? "", !isSandbox && Boolean(tenantId));
    const products: UiProduct[] = isSandbox ? mockProducts : (live.data ?? []).map((product) => ({ id: product.id, tenant_id: product.tenant_id, title: product.title, price: `EGP ${product.price.toFixed(2)}`, originalPrice: product.compareAtPrice ? `EGP ${product.compareAtPrice.toFixed(2)}` : undefined, image: product.images, colors: product.colors, tags: product.tags, rating: product.rating, reviewsCount: product.reviewsCount, reviews: product.reviews.map(review => ({ id: Number(review.id), author: review.author, rating: review.rating, comment: review.comment, date: String(review.date) })) }));
    return { ...live, data: products, isLoading: isSandbox ? false : live.isLoading, error: isSandbox ? null : live.error, isSandbox };
}
export function useStoreCart(tenantSlug: string | null, tenantId: string | null) { const isSandbox = isSandboxTenant(tenantSlug); return { ...useCart(tenantId, isSandbox), isSandbox }; }
export function useStoreAddToCart(tenantSlug: string | null, tenantId: string | null) { return useAddToCart(tenantId, isSandboxTenant(tenantSlug)); }
