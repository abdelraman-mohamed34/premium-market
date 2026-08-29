import { z } from 'zod'

export const couponTypeSchema = z.enum(['percentage', 'fixed_amount'])

export const couponSchema = z.object({
    id: z.string().uuid().optional(),
    tenant_id: z.string().uuid('Invalid Tenant ID'),
    tenantId: z.string().uuid('Invalid Tenant ID'),
    code: z.string().trim().uppercase().min(3),
    discountType: couponTypeSchema,
    discountValue: z.number().positive(),
    minOrderAmount: z.number().nonnegative().optional(),
    maxDiscountAmount: z.number().positive().optional(),
    expiresAt: z.string().datetime().or(z.date()).optional(),
    isActive: z.boolean().default(true),
})

export type CouponType = z.infer<typeof couponTypeSchema>
export type Coupon = z.infer<typeof couponSchema>
