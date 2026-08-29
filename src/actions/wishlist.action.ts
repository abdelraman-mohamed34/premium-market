"use server";
import { toggleWishlistSchema } from "@/schemas/wishlist.schema";
import { authContext } from "./action-utils";
import { listWishlist, toggleWishlist } from "@/services/wishlist.service";
export async function listWishlistAction() { try { const c = await authContext(); return { success: true as const, data: await listWishlist(c.tenantId, c.userId) }; } catch (e) { return { success: false as const, error: e instanceof Error ? e.message : "Unable to load wishlist" }; } }
export async function toggleWishlistAction(input: unknown) { const p = toggleWishlistSchema.safeParse(input); if (!p.success) return { success: false as const, error: "Invalid wishlist item" }; try { const c = await authContext(); await toggleWishlist(c.tenantId, c.userId, String(p.data.productId)); return { success: true as const, data: null }; } catch (e) { return { success: false as const, error: e instanceof Error ? e.message : "Unable to update wishlist" }; } }
