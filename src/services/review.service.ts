import 'server-only'
import { reviewSchema, type CreateReviewInput, type Review } from '@/schemas/review.schema'
import { tenantClient, unwrap } from './service-utils'

type ProfileRow = {
    id: string
    full_name: string | null
    email: string | null
}

function profileAuthor(profile: unknown): string | undefined {
    const value = Array.isArray(profile) ? profile[0] : profile
    if (!value || typeof value !== 'object') return undefined

    const data = value as Record<string, unknown>
    const fullName = typeof data.full_name === 'string' ? data.full_name.trim() : ''
    const name = typeof data.name === 'string' ? data.name.trim() : ''
    const email = typeof data.email === 'string' ? data.email : ''

    return fullName || name || email.split('@')[0] || undefined
}

function mapReview(row: Record<string, unknown>, fallbackAuthor?: string): Review {
    return reviewSchema.parse({
        ...row,
        productId: row.product_id,
        userId: row.user_id,
        createdAt: row.created_at,
        author: profileAuthor(row.profiles) || fallbackAuthor || 'مستخدم',
    })
}

export async function getProductReviews(tenantId: string, productId: string): Promise<Review[]> {
    try {
        const { supabase } = await tenantClient(tenantId)
        const rows = unwrap(
            await supabase
                .from('product_reviews')
                .select('*')
                .eq('tenant_id', tenantId)
                .eq('product_id', productId)
                .order('created_at', { ascending: false }),
        ) as Record<string, unknown>[]
        const userIds = [...new Set(rows.map((row) => row.user_id).filter((id): id is string => typeof id === 'string'))]
        const profiles = userIds.length
            ? (unwrap(
                  await supabase
                      .from('profiles')
                      .select('id, full_name, email')
                      .eq('tenant_id', tenantId)
                      .in('id', userIds),
              ) as ProfileRow[])
            : []
        const authorByUserId = new Map(
            profiles.map((profile) => [
                profile.id,
                profile.full_name?.trim() || profile.email?.split('@')[0] || 'مستخدم',
            ]),
        )

        return rows.map((row) => mapReview(row, authorByUserId.get(String(row.user_id))))
    } catch (error) {
        console.error('Reviews Fetch Error:', error)
        throw error
    }
}
export async function createReview(tenantId: string, userId: string, input: CreateReviewInput): Promise<Review> { const { supabase } = await tenantClient(tenantId); const row = unwrap(await supabase.from('product_reviews').insert({ product_id: input.productId, tenant_id: tenantId, user_id: userId, rating: input.rating, comment: input.comment }).select().single()) as Record<string, unknown>; return mapReview(row) }
