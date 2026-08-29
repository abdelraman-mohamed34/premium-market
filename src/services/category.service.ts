import { categorySchema, type Category } from "@/schemas/category.schema";
import { tenantClient, unwrap } from "./service-utils";
export async function listCategories(tenantId: string): Promise<Category[]> { const { supabase } = await tenantClient(tenantId); const result = unwrap(await supabase.from("categories").select("*").eq("tenant_id", tenantId)); return (result as unknown[]).map((row) => categorySchema.parse(row)); }
export async function createCategory(tenantId: string, input: Category): Promise<Category> { const { supabase } = await tenantClient(tenantId); return categorySchema.parse(unwrap(await supabase.from("categories").insert({ ...input, tenant_id: tenantId }).select().single())); }
