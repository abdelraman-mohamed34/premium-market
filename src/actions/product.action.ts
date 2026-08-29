"use server";
import { createProductSchema, updateProductSchema, type Product } from "@/schemas/product.schema";
import { authContext } from "./action-utils";
import * as products from "@/services/product.service";

export async function listProductsAction() { try { const { tenantId } = await authContext(); return { success: true as const, data: await products.listProducts(tenantId) }; } catch (e) { return { success: false as const, error: e instanceof Error ? e.message : "Unable to load products" }; } }
export async function createProductAction(input: unknown) { const parsed = createProductSchema.safeParse(input); if (!parsed.success) return { success: false as const, error: "Invalid product details" }; try { const { tenantId } = await authContext(); return { success: true as const, data: await products.createProduct(tenantId, { ...parsed.data, tenant_id: tenantId, id: crypto.randomUUID(), tenantId, rating: 0, reviewsCount: 0, reviews: [] } as unknown as Product) }; } catch (e) { return { success: false as const, error: e instanceof Error ? e.message : "Unable to create product" }; } }
export async function updateProductAction(id: string, input: unknown) { const parsed = updateProductSchema.safeParse(input); if (!parsed.success) return { success: false as const, error: "Invalid product details" }; try { const { tenantId } = await authContext(); return { success: true as const, data: await products.updateProduct(tenantId, id, parsed.data) }; } catch (e) { return { success: false as const, error: e instanceof Error ? e.message : "Unable to update product" }; } }
