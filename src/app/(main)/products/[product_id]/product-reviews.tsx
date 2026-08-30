'use client'

import React from 'react'
import { Review } from '@/features/_components/reusable/product-card'
import { useGraphood } from '@/app/shared/lib/graphood/hooks/use-graphood'
import { useTenantSlug } from '@/app/shared/lib/providers/providers'

type ProductReviewsProps = {
    rating?: number
    reviewsCount?: number
    reviews?: Review[]
}

export function StarRating({ rating = 0, size = 'w-4 h-4' }: { rating: number; size?: string }) {
    return (
        <div className="flex items-center gap-0.5 text-amber-400">
            {[1, 2, 3, 4, 5].map((star) => (
                <svg
                    key={star}
                    className={`${size} ${star <= Math.round(rating) ? 'fill-current' : 'fill-gray-200 text-gray-200'}`}
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    )
}

export default function ProductReviews({ rating = 0, reviewsCount = 0, reviews = [] }: ProductReviewsProps) {

    const tenant_slug = useTenantSlug()
    const slug = tenant_slug ?? ""
    const { tenant, health } = useGraphood({ tenantSlug: slug })
    console.log(tenant_slug)

    return (
        <section className="mt-16 pt-10 border-t border-gray-200 flex justify-center gap-8">
            <div className="space-y-4 w-full max-w-5xl">
                <h2 className="text-xl font-bold uppercase text-gray-900 tracking-tight mb-2">
                    Customer Reviews ({reviewsCount})
                </h2>
                {reviews.length > 0 ? (
                    reviews.map((rev) => (
                        <div key={rev.id} className="p-4 bg-white rounded border border-gray-100 shadow-sm space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm text-gray-900">{rev.author}</span>
                                    <StarRating rating={rev.rating} size="w-3.5 h-3.5" />
                                </div>
                                <span className="text-xs text-gray-400">{rev.date}</span>
                            </div>
                            <p className="text-xs text-gray-600 leading-relaxed">{rev.comment}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-sm text-gray-500 italic">No reviews yet for this product.</p>
                )}
            </div>
        </section>
    )
}