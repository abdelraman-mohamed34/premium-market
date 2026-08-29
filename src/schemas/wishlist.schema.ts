import { z } from 'zod'

export const wishlistSchema = z.object({
    tenant_id: z.string().uuid('Invalid Tenant ID'),
    id: z.string().uuid().optional(),
    userId: z.string().uuid('Invalid user ID'),
    productId: z.string().uuid().or(z.number()),
    tenantId: z.string().uuid().optional(),
    createdAt: z.string().datetime().or(z.date()).optional(),
})

export const toggleWishlistSchema = z.object({
    productId: z.string().uuid().or(z.number()),
})

export type Wishlist = z.infer<typeof wishlistSchema>
export type ToggleWishlistInput = z.infer<typeof toggleWishlistSchema>
