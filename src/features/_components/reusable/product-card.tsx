import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import TenantLink from '@/shared/components/TenantLink'

export type Review = {
    id: number
    author: string
    rating: number
    comment: string
    date: string
}

export type Product = {
    id: number
    tenant_id?: string
    title: string
    price: string
    originalPrice?: string
    discount?: string
    image: string | string[]
    colors?: string[]
    tags?: string[]
    rating?: number
    reviewsCount?: number
    reviews?: Review[]
}

type ProductCardProps = {
    product: Product
    hideWishlist?: boolean
    hideFooter?: boolean
    className?: string
}

function ProductCard({ product, hideWishlist = false, hideFooter = false, className = "" }: ProductCardProps) {
    const productImages = Array.isArray(product.image) ? product.image : [product.image]
    const hasMultipleImages = productImages.length > 1

    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const [direction, setDirection] = useState<number>(1)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!hasMultipleImages) return

        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const width = rect.width

        const newIndex = Math.min(
            Math.floor((x / width) * productImages.length),
            productImages.length - 1
        )

        if (newIndex !== currentImageIndex) {
            setDirection(newIndex > currentImageIndex ? 1 : -1)
            setCurrentImageIndex(newIndex)
        }
    }

    const handleMouseLeave = () => {
        setIsHovered(false)
        setDirection(-1)
        setCurrentImageIndex(0)
    }

    const variants = {
        enter: (dir: number) => ({
            x: dir > 0 ? '100%' : '-100%',
            opacity: 0,
        }),
        center: {
            x: 0,
            opacity: 1,
        },
        exit: (dir: number) => ({
            x: dir < 0 ? '100%' : '-100%',
            opacity: 0,
        }),
    }

    return (
        <TenantLink href={`/products/${product.id}`}>
            <div
                className="group relative flex flex-col bg-gray-50 rounded overflow-hidden transition-all duration-300 h-full w-full"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={handleMouseLeave}
            >
                <div
                    className={`relative w-full overflow-hidden bg-gray-900 cursor-pointer ${hideFooter ? 'h-full flex-1' : 'h-100 flex-shrink-0'
                        }`}
                    onMouseMove={handleMouseMove}
                >
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.img
                            key={currentImageIndex}
                            src={productImages[currentImageIndex]}
                            alt={`${product.title} - view ${currentImageIndex + 1}`}
                            custom={direction}
                            variants={variants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: 'spring', stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 },
                            }}
                            className="absolute inset-0 h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                    </AnimatePresence>

                    {hasMultipleImages && isHovered && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                            {productImages.map((_, index) => (
                                <span
                                    key={index}
                                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'bg-white scale-110' : 'bg-white/50'
                                        }`}
                                />
                            ))}
                        </div>
                    )}

                    {product.discount && (
                        <span className="absolute top-2 left-2 bg-black text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 z-10">
                            {product.discount}
                        </span>
                    )}

                    {/* زر الـ Wishlist يختفي إذا كانت hideWishlist بـ true */}
                    {!hideWishlist && (
                        <button
                            aria-label="Add to wishlist"
                            className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 text-gray-700 hover:bg-white hover:text-red-500 transition-colors shadow-sm z-10"
                        >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                        </button>
                    )}
                </div>

                {/* الفوتر يختفي بالكامل إذا كانت hideFooter بـ true */}
                {!hideFooter && (
                    <div className="flex flex-col justify-between flex-1 p-3 text-left">
                        {product.colors && (
                            <div className="flex items-center gap-1 mb-2">
                                {product.colors.map((color, idx) => (
                                    <span
                                        key={idx}
                                        className="w-2.5 h-2.5 rounded-full border border-gray-300"
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                        )}

                        <div className="flex justify-between items-end gap-2">
                            <h3 className="text-xs font-semibold text-gray-900 line-clamp-2 tracking-tight uppercase">
                                {product.title}
                            </h3>

                            <div className="flex flex-col items-end text-xs font-bold text-gray-900 leading-none shrink-0">
                                <span>{product.price}</span>
                                {product.originalPrice && (
                                    <span className="text-[10px] text-gray-400 line-through font-normal mt-1">
                                        {product.originalPrice}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </TenantLink>
    )
}

export default ProductCard