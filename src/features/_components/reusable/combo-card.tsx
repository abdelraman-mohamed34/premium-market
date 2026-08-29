import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type ComboCardItem = {
    id: number
    title: string
    subtitle?: string
    buttonText?: string
    image: string | string[]
    badge?: string
    colSpan?: string
    rowSpan?: string
}

type ComboCardProps = {
    item: ComboCardItem
    colSpan?: string
    rowSpan?: string
}

function ComboCard({ item, colSpan, rowSpan }: ComboCardProps) {
    const images = Array.isArray(item.image) ? item.image : [item.image]
    const hasMultipleImages = images.length > 1

    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [direction, setDirection] = useState<number>(1)

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!hasMultipleImages) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const width = rect.width

        const newIndex = Math.min(
            Math.floor((x / width) * images.length),
            images.length - 1
        )

        if (newIndex !== currentImageIndex) {
            setDirection(newIndex > currentImageIndex ? 1 : -1)
            setCurrentImageIndex(newIndex)
        }
    }

    const handleMouseLeave = () => {
        setDirection(-1)
        setCurrentImageIndex(0)
    }

    const variants = {
        enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
    }

    // دمج الـ Grid Spans المبعوثة أو استخدام المكتوبة في البيانات
    const finalColSpan = colSpan || item.colSpan || 'col-span-1'
    const finalRowSpan = rowSpan || item.rowSpan || 'row-span-1'

    return (
        <div
            className={`group relative overflow-hidden cursor-pointer bg-gray-900 w-full h-full min-h-[250px] ${finalColSpan} ${finalRowSpan}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            {/* أنيميشن الترانزيشن بين الصور */}
            <AnimatePresence initial={false} custom={direction}>
                <motion.img
                    key={currentImageIndex}
                    src={images[currentImageIndex]}
                    alt={`${item.title} - ${currentImageIndex + 1}`}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                    }}
                    className="absolute inset-0 h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
            </AnimatePresence>

            {/* طبقة التظليل */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 z-10" />

            {/* البادج */}
            {item.badge && (
                <span className="absolute top-3 left-3 bg-white text-black text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 z-20">
                    {item.badge}
                </span>
            )}

            {/* العنوان بمنتصف الكارت */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 z-20">
                <h2 className="text-white text-3xl md:text-5xl font-black uppercase tracking-tight px-4 py-1 mb-2">
                    {item.title}
                </h2>
                {item.subtitle && (
                    <p className="text-white/80 text-xs md:text-sm uppercase tracking-widest font-medium">
                        {item.subtitle}
                    </p>
                )}
            </div>

            {/* نقط التنقل (Dots) */}
            {hasMultipleImages && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                    {images.map((_, index) => (
                        <span
                            key={index}
                            className={`h-1.5 rounded-full transition-all duration-300 ${index === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                                }`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default ComboCard