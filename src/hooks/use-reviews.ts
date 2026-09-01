'use client'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createReviewAction, getProductReviewsAction } from '@/actions/review.action'
import { toast } from 'sonner'
import type { CreateReviewInput } from '@/schemas/review.schema'
export function useProductReviews(productId: string, enabled = true) { return useQuery({ queryKey: ['product-reviews', productId], queryFn: async () => { const result = await getProductReviewsAction(productId); if (!result.success) throw new Error(result.error); return result.data }, enabled: enabled && Boolean(productId) }) }
export function useCreateReview(productId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: (input: CreateReviewInput) => createReviewAction(input), onSuccess: (result) => { if (result.success) { toast.success('تم إرسال تقييمك بنجاح'); qc.invalidateQueries({ queryKey: ['product-reviews', productId] }) } else toast.error(result.error) }, onError: (error: Error) => toast.error(error.message || 'تعذر إرسال التقييم') }) }
