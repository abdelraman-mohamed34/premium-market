'use client'

import { useMemo, type ReactNode } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

export interface PaginatedWrapperProps<T> {
    items: T[]
    pageSize?: number
    pageParamName?: string
    renderItem?: (item: T, index: number) => ReactNode
    children?: (paginatedItems: T[]) => ReactNode
    className?: string
}

export default function PaginatedWrapper<T>({
    items,
    pageSize = 10,
    pageParamName = 'page',
    renderItem,
    children,
    className,
}: PaginatedWrapperProps<T>) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const totalPages = Math.max(1, Math.ceil(items.length / pageSize))
    const requestedPage = Number.parseInt(searchParams.get(pageParamName) ?? '1', 10)
    const currentPage = Number.isFinite(requestedPage)
        ? Math.min(Math.max(requestedPage, 1), totalPages)
        : 1
    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize
        return items.slice(start, start + pageSize)
    }, [currentPage, items, pageSize])

    const goToPage = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        if (page <= 1) {
            params.delete(pageParamName)
        } else {
            params.set(pageParamName, String(page))
        }

        const query = params.toString()
        router.push(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }

    return (
        <div className={className}>
            {children
                ? children(paginatedItems)
                : renderItem?.(paginatedItems[0], (currentPage - 1) * pageSize)}
            {renderItem && !children && paginatedItems.slice(1).map((item, index) => renderItem(item, (currentPage - 1) * pageSize + index + 1))}

            {items.length > 0 && (
                <nav className="mt-5 flex items-center justify-center gap-3" aria-label="Pagination">
                    <button
                        type="button"
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="grid h-9 w-9 place-items-center border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="الصفحة السابقة"
                    >
                        ←
                    </button>
                    <span className="text-sm text-gray-600">صفحة {currentPage} من {totalPages}</span>
                    <button
                        type="button"
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="grid h-9 w-9 place-items-center border border-gray-300 text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label="الصفحة التالية"
                    >
                        →
                    </button>
                </nav>
            )}
        </div>
    )
}
