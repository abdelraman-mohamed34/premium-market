import React from 'react'
import ProductCard, { Product } from './reusable/product-card'

type ProductsRowsProps = {
    title?: string
    data: Product[]
}

function ProductsRows({ title, data }: ProductsRowsProps) {
    return (
        <section className="w-full max-w-8xl">
            <h1 className='font-bold mb-1 text-2xl'>{title}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {data.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    )
}

export default ProductsRows