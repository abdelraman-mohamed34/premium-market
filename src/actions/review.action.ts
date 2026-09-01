'use server'
import { createReviewSchema } from '@/schemas/review.schema'
import { authContext } from './action-utils'
import { createReview, getProductReviews } from '@/services/review.service'
export async function getProductReviewsAction(productId: string) { try { const c = await authContext(); return { success: true as const, data: await getProductReviews(c.tenantId, productId) } } catch (error) { return { success: false as const, error: error instanceof Error ? error.message : 'Unable to load reviews' } } }
export async function createReviewAction(input: unknown) { const parsed = createReviewSchema.safeParse(input); if (!parsed.success) return { success: false as const, error: 'Invalid review details' }; try { const c = await authContext(); return { success: true as const, data: await createReview(c.tenantId, c.userId, parsed.data) } } catch (error) { const message = error instanceof Error ? error.message : ''; return { success: false as const, error: message.includes('Authentication') ? 'يجب تسجيل الدخول أولاً لإضافة تقييم' : message || 'Unable to create review' } } }
