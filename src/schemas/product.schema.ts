import { z } from 'zod'

export const productSizeSchema = z.enum(['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL', '7XL'])

export const productReviewSchema = z.object({
    id: z.string().uuid().or(z.number()),
    productId: z.string().uuid().optional(),
    userId: z.string().uuid().optional(),
    author: z.string().trim().min(2, 'Author name is required'),
    rating: z.number().min(1, 'Minimum rating is 1').max(5, 'Maximum rating is 5'),
    comment: z.string().trim().min(3, 'Comment must be at least 3 characters'),
    date: z.string().or(z.date()),
})

export const productVariantSchema = z.object({
    id: z.string().uuid().optional(),
    sku: z.string().trim().optional(),
    colorHex: z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid Hex color code'),
    colorName: z.string().optional(), // e.g. "Forest Green"
    size: productSizeSchema,
    stock: z.number().int().nonnegative('Stock cannot be negative').default(0),
    priceOverride: z.number().positive().optional(),
})

export const productSchema = z.object({
    id: z.string().uuid().or(z.number()),
    tenant_id: z.string().uuid('Invalid Tenant ID'),
    title: z.string().trim().min(3, 'Product title must be at least 3 characters'),
    slug: z.string().trim().toLowerCase(),
    description: z.string().min(5, "description too short"),

    price: z.number().positive('Price must be greater than 0'),
    compareAtPrice: z.number().positive().nullable().optional(),
    discountLabel: z.string().optional(),

    images: z.array(z.string().url('Invalid image URL')).min(1, 'At least one image is required'),

    colors: z.array(z.string().regex(/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/)).default([]),

    tags: z.array(z.string()).default([]),
    categoryId: z.string().uuid().nullable().optional(),

    rating: z.number().min(0).max(5).default(0),
    reviewsCount: z.number().int().nonnegative().default(0),
    reviews: z.array(productReviewSchema).default([]),

    variants: z.array(productVariantSchema).default([]),
    inStock: z.boolean().default(true),
    isFeatured: z.boolean().default(false),

    createdAt: z.preprocess((value) => {
        if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value.toISOString()
        if (typeof value === 'string') {
            const date = new Date(value)
            return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
        }
        return value
    }, z.string().datetime({ offset: true }).optional()),
    updatedAt: z.preprocess((value) => {
        if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value.toISOString()
        if (typeof value === 'string') {
            const date = new Date(value)
            return Number.isNaN(date.getTime()) ? undefined : date.toISOString()
        }
        return value
    }, z.string().datetime({ offset: true }).optional()),
})

export const createProductSchema = productSchema
    .omit({
        id: true,
        rating: true,
        reviewsCount: true,
        reviews: true,
        createdAt: true,
        updatedAt: true,
        tenant_id: true,
        slug: true,
    })

    .extend({
        title: z.string().trim().min(3, 'Title is required'),
        price: z.preprocess((value) => value === '' || (typeof value === 'number' && Number.isNaN(value)) ? undefined : value, z.number().positive('Price is required')),
        images: z.array(z.string().url()).min(1, 'Provide at least one image'),
    })

export const createProductInputSchema = createProductSchema
export type CreateProductInput = z.infer<typeof createProductInputSchema>

export const updateProductSchema = createProductSchema.partial()

export const createReviewSchema = productReviewSchema.pick({
    rating: true,
    comment: true,
    author: true,
})

// Exported Types
export type ProductSize = z.infer<typeof productSizeSchema>
export type ProductReview = z.infer<typeof productReviewSchema>
export type ProductVariant = z.infer<typeof productVariantSchema>
export type Product = z.infer<typeof productSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
export type CreateReviewInput = z.infer<typeof createReviewSchema>
