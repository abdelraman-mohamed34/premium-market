import React from 'react'
import ProductCard, { Product } from './reusable/product-card'
import { isSandboxTenant, useStoreProducts } from '@/hooks/use-store-data'
import { useTenantSlug } from '@/app/shared/lib/providers/providers'
import { useGraphood } from '@/app/shared/lib/graphood/hooks/use-graphood'
import PaginatedWrapper from '@/components/ui/PaginatedWrapper'

type ProductsRowsProps = {
    title?: string
    data: Product[]
}

function ProductsRows({ title, data }: ProductsRowsProps) {
    const tenantSlug = useTenantSlug() ?? ''
    const sandbox = isSandboxTenant(tenantSlug)
    const { tenantId } = useGraphood({ tenantSlug, enabled: !sandbox })
    const { data: products, isLoading, error } = useStoreProducts(tenantSlug, tenantId)

    const displayedData = (products.length > 0 || products) ? products : data

    return (
        <section className="w-full max-w-8xl">
            <h1 className='font-bold mb-1 text-2xl'>{title}</h1>
            <PaginatedWrapper items={displayedData} pageSize={30}>
                {(paginatedProducts) => (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                        {paginatedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </PaginatedWrapper>
        </section>
    )
}

export default ProductsRows
