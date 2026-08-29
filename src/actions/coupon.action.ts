"use server";
import { applyCouponSchema } from "@/schemas/cart.schema";
import { authContext } from "./action-utils";
import { getCoupon } from "@/services/coupon.service";
export async function getCouponAction(input: unknown) { const p = applyCouponSchema.safeParse(input); if (!p.success) return { success: false as const, error: "Invalid coupon code" }; try { const { tenantId } = await authContext(); return { success: true as const, data: await getCoupon(tenantId, p.data.code) }; } catch (e) { return { success: false as const, error: e instanceof Error ? e.message : "Unable to validate coupon" }; } }
