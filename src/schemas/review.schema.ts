import { z } from 'zod'

export const reviewSchema = z.object({
    id: z.string().uuid(), productId: z.string().uuid(), userId: z.string().uuid(), rating: z.number().int().min(1).max(5), comment: z.string().min(3, 'التعليق قصير جداً').max(500), createdAt: z.string().datetime({ offset: true }), author: z.string().optional(),
})
export const createReviewSchema = z.object({ productId: z.string().uuid(), rating: z.number().int().min(1).max(5), comment: z.string().trim().min(3, 'التعليق قصير جداً').max(500) })
export type Review = z.infer<typeof reviewSchema>
export type CreateReviewInput = z.infer<typeof createReviewSchema>
