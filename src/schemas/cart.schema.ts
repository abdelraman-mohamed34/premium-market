import { z } from 'zod'
import { productSizeSchema } from './product.schema'

export const cartItemSchema = z.object({
    tenant_id: z.string().uuid('Invalid Tenant ID'),
    id: z.string().uuid().or(z.number()),
    productId: z.string().uuid().or(z.number()),
    variantId: z.string().uuid().optional(),
    title: z.string().trim().min(1, 'Product title is required'),
    slug: z.string().trim(),
    image: z.string().url('Invalid image URL'),
    selectedColor: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/).optional(),
    selectedSize: productSizeSchema.optional(),
    price: z.number().positive('Price must be greater than 0'),
    quantity: z.number().int().positive('Quantity must be at least 1').default(1),
    tenantId: z.string().uuid().optional(),
})

export const cartSummarySchema = z.object({
    subtotal: z.number().nonnegative(),
    shippingFee: z.number().nonnegative().default(0),
    discountAmount: z.number().nonnegative().default(0),
    couponCode: z.string().trim().uppercase().optional(),
    total: z.number().nonnegative(),
})

export const cartSchema = z.object({
    tenant_id: z.string().uuid('Invalid Tenant ID'),
    id: z.string().uuid().optional(),
    userId: z.string().uuid().nullable().optional(),
    tenantId: z.string().uuid().optional(),
    items: z.array(cartItemSchema).default([]),
    summary: cartSummarySchema,
    updatedAt: z.coerce.date().optional(),
})

export const addToCartSchema = z.object({
    productId: z.string().uuid().or(z.number()),
    variantId: z.string().uuid().optional(),
    quantity: z.number().int().positive().default(1),
    selectedColor: z.string().optional(),
    selectedSize: productSizeSchema.optional(),
})

export const updateCartItemQuantitySchema = z.object({
    cartItemId: z.string().uuid().or(z.number()),
    quantity: z.number().int().min(0, 'Quantity cannot be negative'),
})

export const applyCouponSchema = z.object({
    code: z.string().trim().min(2, 'Invalid coupon code').uppercase(),
})

export type CartItem = z.infer<typeof cartItemSchema>
export type CartSummary = z.infer<typeof cartSummarySchema>
export type Cart = z.infer<typeof cartSchema>
export type AddToCartInput = z.infer<typeof addToCartSchema>
export type UpdateCartItemQuantityInput = z.infer<typeof updateCartItemQuantitySchema>
export type ApplyCouponInput = z.infer<typeof applyCouponSchema>
