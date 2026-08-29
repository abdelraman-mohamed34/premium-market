'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import ProductsRows from '@/features/_components/products-rows'
import { useTenantSlug } from '@/app/shared/lib/providers/providers'
import { useGraphood } from '@/app/shared/lib/graphood/hooks/use-graphood'
import { isSandboxTenant, useStoreProducts } from '@/hooks/use-store-data'

function ProductsPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const tenantSlug = useTenantSlug() ?? ''
    const sandbox = isSandboxTenant(tenantSlug)
    const { tenantId } = useGraphood({ tenantSlug, enabled: !sandbox })
    const { data: products, isLoading, error } = useStoreProducts(tenantSlug, tenantId)

    const searchQuery = searchParams.get('search')?.trim().toLowerCase() || ''

    const filteredProducts = searchQuery
        ? products.filter((product) =>
            product.tags?.some((tag) => tag.toLowerCase().includes(searchQuery))
        )
        : products

    const hasNoResults = searchQuery.length > 0 && filteredProducts.length === 0

    const displayProducts = hasNoResults ? products : filteredProducts

    const handleClearFilter = () => {
        router.push('/products')
    }

    return (
        <div className="p-5 space-y-6">
            {isLoading && <div className="py-16 text-center text-sm text-gray-500">Loading products...</div>}
            {error && <div className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error.message}</div>}
            {searchQuery && (
                <div className="flex items-center justify-between bg-gray-100 p-3 rounded-md border border-gray-200">
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Filtered by Tag:</span>
                        <span className="bg-black text-white text-xs font-semibold px-2.5 py-1 rounded-full uppercase">
                            {searchQuery}
                        </span>
                        <span className="text-xs text-gray-500">
                            ({filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found)
                        </span>
                    </div>

                    <button
                        onClick={handleClearFilter}
                        className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium transition-colors"
                    >
                        Clear filter
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            )}

            {hasNoResults && (
                <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300 space-y-2">
                    <p className="text-gray-800 font-semibold text-base">
                        No products found for "{searchQuery}"
                    </p>
                    <p className="text-gray-500 text-xs">
                        Check out our full collection below instead!
                    </p>
                </div>
            )}

            <ProductsRows
                data={displayProducts}
                title="Explore All Products"
            />
        </div>
    )
}

export default ProductsPage
