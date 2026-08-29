import { couponSchema, type Coupon } from "@/schemas/coupon.schema";
import { tenantClient, unwrap } from "./service-utils";
export async function getCoupon(tenantId: string, code: string): Promise<Coupon | null> { const { supabase } = await tenantClient(tenantId); const result = await supabase.from("coupons").select("*").eq("tenant_id", tenantId).eq("code", code.toUpperCase()).eq("is_active", true).maybeSingle(); if (result.error) throw new Error(result.error.message); return result.data ? couponSchema.parse(result.data) : null; }
