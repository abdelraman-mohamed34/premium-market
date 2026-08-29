import { z } from 'zod'
import { addressSchema } from './user.schema'
import { productSizeSchema } from './product.schema'

export const orderStatusSchema = z.enum([
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
    'refunded',
])

export const paymentStatusSchema = z.enum(['pending', 'paid', 'failed', 'refunded'])
export const paymentMethodSchema = z.enum(['cod', 'card', 'wallet'])

export const orderItemSchema = z.object({
    id: z.string().uuid().optional(),
    productId: z.string().uuid().or(z.number()),
    variantId: z.string().uuid().optional(),
    title: z.string(),
    image: z.string().url(),
    selectedColor: z.string().optional(),
    selectedSize: productSizeSchema.optional(),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
})

export const orderSchema = z.object({
    id: z.string().uuid().or(z.number()),
    tenant_id: z.string().uuid('Invalid Tenant ID'),
    orderNumber: z.string().trim(),
    userId: z.string().uuid(),
    tenantId: z.string().uuid().optional(),
    items: z.array(orderItemSchema).min(1),
    shippingAddress: addressSchema,
    paymentMethod: paymentMethodSchema,
    paymentStatus: paymentStatusSchema.default('pending'),
    orderStatus: orderStatusSchema.default('pending'),
    subtotal: z.number().nonnegative(),
    shippingFee: z.number().nonnegative(),
    discountAmount: z.number().nonnegative().default(0),
    total: z.number().nonnegative(),
    notes: z.string().optional(),
    createdAt: z.string().datetime().or(z.date()).optional(),
    updatedAt: z.coerce.date().optional(),
})

export const checkoutInputSchema = z.object({
    shippingAddress: addressSchema.omit({ id: true, userId: true }),
    paymentMethod: paymentMethodSchema,
    notes: z.string().optional(),
    couponCode: z.string().optional(),
})

export type OrderStatus = z.infer<typeof orderStatusSchema>
export type PaymentStatus = z.infer<typeof paymentStatusSchema>
export type PaymentMethod = z.infer<typeof paymentMethodSchema>
export type OrderItem = z.infer<typeof orderItemSchema>
export type Order = z.infer<typeof orderSchema>
export type CheckoutInput = z.infer<typeof checkoutInputSchema>
