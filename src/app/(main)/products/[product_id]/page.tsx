'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import ProductReviews, { StarRating } from './product-reviews'
import { isSandboxTenant, useStoreAddToCart, useStoreProducts } from '@/hooks/use-store-data'
import { useTenantSlug } from '@/app/shared/lib/providers/providers'
import { useGraphood } from '@/app/shared/lib/graphood/hooks/use-graphood'
import { Loader2, Minus, Plus } from 'lucide-react'

// 1. مكون الـ Skeleton الرئيسي
function DetailPageSkeleton() {
    return (
        <div className="max-w-7xl mx-auto p-5 md:p-10 animate-pulse">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {/* قسم الصور Skeleton */}
                <div className="flex flex-col-reverse md:flex-row gap-4 items-start">
                    {/* الصور المصغرة */}
                    <div className="flex md:flex-col gap-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-20 h-24 bg-gray-200 rounded flex-shrink-0" />
                        ))}
                    </div>
                    {/* الصورة الرئيسية */}
                    <div className="w-full aspect-[3/4] bg-gray-200 rounded flex-1" />
                </div>

                {/* قسم التفاصيل Skeleton */}
                <div className="flex flex-col justify-start space-y-6">
                    <div>
                        {/* الـ Tags */}
                        <div className="flex gap-2 mb-3">
                            <div className="h-5 w-16 bg-gray-200 rounded" />
                            <div className="h-5 w-20 bg-gray-200 rounded" />
                        </div>
                        {/* العنوان */}
                        <div className="h-8 w-3/4 bg-gray-200 rounded mb-3" />
                        {/* النجوم والتقييم */}
                        <div className="flex items-center gap-2">
                            <div className="h-4 w-24 bg-gray-200 rounded" />
                            <div className="h-4 w-12 bg-gray-200 rounded" />
                        </div>
                    </div>

                    {/* السعر */}
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-28 bg-gray-200 rounded" />
                        <div className="h-5 w-20 bg-gray-200 rounded" />
                    </div>

                    <hr className="border-gray-200" />

                    {/* خيارات الألوان */}
                    <div>
                        <div className="h-4 w-32 bg-gray-200 rounded mb-3" />
                        <div className="flex gap-2">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-7 h-7 rounded-full bg-gray-200" />
                            ))}
                        </div>
                    </div>

                    {/* الأزرار والكمية */}
                    <div className="flex items-center gap-4 pt-2">
                        <div className="h-11 w-28 bg-gray-200 rounded" />
                        <div className="h-11 flex-1 bg-gray-200 rounded" />
                    </div>

                    {/* بوكس الشحن */}
                    <div className="h-20 bg-gray-100 rounded mt-4" />
                </div>
            </div>

            {/* قسم المراجعات Skeleton */}
            <div className="mt-16 pt-10 border-t border-gray-200 space-y-6">
                <div className="h-7 w-48 bg-gray-200 rounded" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="h-40 bg-gray-100 rounded" />
                    <div className="lg:col-span-2 space-y-4">
                        <div className="h-24 bg-gray-100 rounded" />
                        <div className="h-24 bg-gray-100 rounded" />
                    </div>
                </div>
            </div>
        </div>
    )
}

function DetailPage() {
    const params = useParams()
    const productId = params?.product_id
    const tenantSlug = useTenantSlug() ?? ''
    const sandbox = isSandboxTenant(tenantSlug)
    const { tenantId } = useGraphood({ tenantSlug, enabled: !sandbox })
    const { data: products, isLoading } = useStoreProducts(tenantSlug, tenantId)
    const product = products.find((item) => String(item.id) === String(productId))
    const addToCart = useStoreAddToCart(tenantSlug, tenantId)

    const productImages = Array.isArray(product?.image)
        ? product.image
        : product?.image
            ? [product.image]
            : []

    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedColor, setSelectedColor] = useState(0)
    const [quantity, setQuantity] = useState(1)

    const handleAddToCart = () => {
        if (!product) return
        addToCart.mutate({
            productId: product.id,
            quantity,
            options: {},
            selectedColor: product.colors?.[selectedColor],
        })
    }

    if (isLoading) return <DetailPageSkeleton />

    if (!product) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-5">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h1>
                <p className="text-gray-500 text-sm mb-4">The product you are looking for does not exist.</p>
                <a href="/products" className="bg-black text-white px-5 py-2 rounded text-xs font-semibold uppercase">
                    Back to Products
                </a>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto p-5 md:p-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <div className="flex flex-col-reverse md:flex-row gap-4 items-start">
                    {productImages.length > 1 && (
                        <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-visible md:sticky md:top-18 self-start flex-shrink-0 z-10">
                            {productImages.map((img, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative w-20 h-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden border-2 transition-all ${selectedImage === idx ? 'border-black' : 'border-transparent opacity-70 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="relative flex-1 aspect-[3/4] bg-gray-100 rounded overflow-hidden w-full">
                        <img
                            src={productImages[selectedImage] || productImages[0]}
                            alt={product.title}
                            className="w-full h-full object-cover object-center"
                        />
                        {product.discount && (
                            <span className="absolute top-4 left-4 bg-black text-white text-xs font-bold uppercase tracking-wider px-3 py-1">
                                {product.discount}
                            </span>
                        )}
                    </div>
                </div>

                <div className="flex flex-col justify-start space-y-6">
                    <div>
                        {product.tags && product.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {product.tags.map((tag, idx) => (
                                    <span key={idx} className="text-[10px] bg-gray-100 font-semibold uppercase px-2.5 py-1 text-gray-600 rounded">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 uppercase">
                            {product.title}
                        </h1>

                        {product.rating && (
                            <div className="flex items-center gap-2 mt-2">
                                <StarRating rating={product.rating} />
                                <span className="text-xs font-bold text-gray-800">{product.rating}</span>
                                <span className="text-xs text-gray-400">({product.reviewsCount || 0} reviews)</span>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-gray-900">{product.price}</span>
                        {product.originalPrice && (
                            <span className="text-base text-gray-400 line-through font-normal">
                                {product.originalPrice}
                            </span>
                        )}
                    </div>

                    <hr className="border-gray-200" />

                    {product.colors && product.colors.length > 0 && (
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-3">
                                Color: <span className="font-normal text-gray-500">Selected Option</span>
                            </label>
                            <div className="flex items-center gap-2">
                                {product.colors.map((color, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedColor(idx)}
                                        className={`w-7 h-7 rounded-full border-2 transition-all p-0.5 ${selectedColor === idx ? 'border-black scale-110' : 'border-transparent'
                                            }`}
                                    >
                                        <span
                                            className="block w-full h-full rounded-full border border-gray-300"
                                            style={{ backgroundColor: color }}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-4 pt-2">
                        <div className="flex items-center border border-gray-300 rounded">
                            <button
                                type="button"
                                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                disabled={addToCart.isPending || quantity <= 1}
                                aria-label="Decrease quantity"
                                title="Decrease quantity"
                                className="grid h-11 w-10 place-items-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                            >
                                <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 text-sm font-semibold">{quantity}</span>
                            <button
                                type="button"
                                onClick={() => setQuantity((prev) => prev + 1)}
                                disabled={addToCart.isPending}
                                aria-label="Increase quantity"
                                title="Increase quantity"
                                className="grid h-11 w-10 place-items-center text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>

                        <button type="button" onClick={handleAddToCart} disabled={addToCart.isPending || !tenantId} className="flex min-h-11 flex-1 items-center justify-center gap-2 bg-primary px-6 py-3.5 text-xs font-bold uppercase tracking-widest text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60">
                            {addToCart.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                            {addToCart.isPending ? 'Adding...' : 'Add to Cart'}
                        </button>
                    </div>

                    <div className="bg-gray-50 p-4 rounded text-xs space-y-2 text-gray-600 border border-gray-100 mt-4">
                        <p>✓ Free shipping on orders over EGP 1000</p>
                        <p>✓ 14-day easy return policy</p>
                    </div>
                </div>
            </div>

            <ProductReviews
                rating={product.rating}
                reviewsCount={product.reviewsCount}
                reviews={product.reviews}
            />
        </div>
    )
}

export { DetailPageSkeleton }
export default DetailPage
