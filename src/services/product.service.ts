import "server-only";
import { productSchema, type Product, type CreateProductInput } from "@/schemas/product.schema";
import { tenantClient, unwrap } from "./service-utils";

export async function listProducts(tenantId: string): Promise<Product[]> {
    const { supabase } = await tenantClient(tenantId);
    const result = await supabase.from("products").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: false });
    const rows = unwrap(result) as unknown[];
    return rows.map((row) => mapProductRow(row as Record<string, unknown>));
}

function mapProductRow(row: Record<string, unknown>): Product {
    return productSchema.parse({ ...row, categoryId: row.categoryId ?? row.category_id, compareAtPrice: row.compareAtPrice ?? row.compare_at_price, reviewsCount: row.reviewsCount ?? row.reviews_count, inStock: row.inStock ?? row.in_stock, isFeatured: row.isFeatured ?? row.is_featured, createdAt: row.createdAt ?? row.created_at, updatedAt: row.updatedAt ?? row.updated_at });
}

export async function getProduct(tenantId: string, id: string): Promise<Product> {
    const { supabase } = await tenantClient(tenantId);
    return mapProductRow(unwrap(await supabase.from("products").select("*").eq("tenant_id", tenantId).eq("id", id).single()));
}

export async function createProduct({ tenantId, input }: { tenantId: string; input: CreateProductInput }): Promise<Product> {
    const { supabase } = await tenantClient(tenantId);
    const value = { tenant_id: tenantId, title: input.title, slug: input.slug, description: input.description, price: input.price, compare_at_price: input.compareAtPrice ?? null, images: input.images, colors: input.colors, tags: input.tags, category_id: input.categoryId ?? null, variants: input.variants, in_stock: input.inStock, is_featured: input.isFeatured };
    return mapProductRow(unwrap(await supabase.from("products").insert(value).select().single()));
}

export async function updateProduct(tenantId: string, id: string, input: Partial<Product>): Promise<Product> {
    const { supabase } = await tenantClient(tenantId);
    return mapProductRow(unwrap(await supabase.from("products").update({ ...input, tenant_id: tenantId }).eq("tenant_id", tenantId).eq("id", id).select().single()));
}

export async function deleteProduct(tenantId: string, id: string): Promise<void> {
    const { supabase } = await tenantClient(tenantId);
    unwrap(await supabase.from("products").delete().eq("tenant_id", tenantId).eq("id", id));
}
