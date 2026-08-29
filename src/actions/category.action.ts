"use server";
import { categorySchema } from "@/schemas/category.schema";
import { authContext } from "./action-utils";
import { listCategories, createCategory } from "@/services/category.service";
export async function listCategoriesAction() { try { const { tenantId } = await authContext(); return { success: true as const, data: await listCategories(tenantId) }; } catch (e) { return { success: false as const, error: e instanceof Error ? e.message : "Unable to load categories" }; } }
export async function createCategoryAction(input: unknown) { const p = categorySchema.safeParse(input); if (!p.success) return { success: false as const, error: "Invalid category" }; try { const { tenantId } = await authContext(); return { success: true as const, data: await createCategory(tenantId, p.data) }; } catch (e) { return { success: false as const, error: e instanceof Error ? e.message : "Unable to create category" }; } }
