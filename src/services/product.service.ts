import { productSchema, type Product } from "@/schemas/product.schema";
import { tenantClient, unwrap } from "./service-utils";

export async function listProducts(tenantId: string): Promise<Product[]> {
    const { supabase } = await tenantClient(tenantId);
    const result = await supabase.from("products").select("*").eq("tenant_id", tenantId).order("created_at", { ascending: false });
    const rows = unwrap(result) as unknown[];
    return rows.map((row) => productSchema.parse(row));
}

export async function getProduct(tenantId: string, id: string): Promise<Product> {
    const { supabase } = await tenantClient(tenantId);
    return productSchema.parse(unwrap(await supabase.from("products").select("*").eq("tenant_id", tenantId).eq("id", id).single()));
}

export async function createProduct(tenantId: string, input: Product): Promise<Product> {
    const { supabase } = await tenantClient(tenantId);
    const value = productSchema.parse({ ...input, tenant_id: tenantId });
    return productSchema.parse(unwrap(await supabase.from("products").insert(value).select().single()));
}

export async function updateProduct(tenantId: string, id: string, input: Partial<Product>): Promise<Product> {
    const { supabase } = await tenantClient(tenantId);
    return productSchema.parse(unwrap(await supabase.from("products").update({ ...input, tenant_id: tenantId }).eq("tenant_id", tenantId).eq("id", id).select().single()));
}

export async function deleteProduct(tenantId: string, id: string): Promise<void> {
    const { supabase } = await tenantClient(tenantId);
    unwrap(await supabase.from("products").delete().eq("tenant_id", tenantId).eq("id", id));
}
