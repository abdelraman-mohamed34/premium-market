'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Eye, Search, X } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useTenantSlug } from '@/app/shared/lib/providers/providers'
import { useGraphood } from '@/app/shared/lib/graphood/hooks/use-graphood'
import { useTenantOrders, useUpdateOrderStatus } from '@/hooks/use-orders'
import type { OrderStatus } from '@/schemas/order.schema'
import { useTenantRouter } from '@/shared/hooks/useTenantRouter'

const statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

export default function DashboardOrdersPage() {
    const router = useTenantRouter()
    const searchParams = useSearchParams()
    const tenantSlug = useTenantSlug() ?? ''
    const { tenantId } = useGraphood({ tenantSlug, enabled: Boolean(tenantSlug) })

    const orders = useTenantOrders(tenantId)
    const updateStatus = useUpdateOrderStatus(tenantId)
    console.log('Raw Orders Data:', orders.data)
    // Safety check for raw list response
    const rawList = orders.data?.success ? orders.data.data : []

    const urlQuery = searchParams.get('search')?.trim() ?? ''
    const [search, setSearch] = useState(urlQuery)

    // Keep internal input state in sync with URL changes
    useEffect(() => {
        setSearch(urlQuery)
    }, [urlQuery])

    // Dynamic Filter supporting both live input state OR query parameter
    const filteredOrders = useMemo(() => {
        if (!Array.isArray(rawList)) return []

        const query = search.trim().toLowerCase()
        if (!query) return rawList

        return rawList.filter((order: any) => {
            const orderId = String(order.id ?? '').toLowerCase()
            const orderNum = String(order.orderNumber ?? order.order_number ?? '').toLowerCase()

            return orderId.includes(query) || orderNum.includes(query) || orderNum.startsWith(query)
        })
    }, [rawList, search])

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const query = search.trim()
        router.push(query ? `/orders?search=${encodeURIComponent(query)}` : '/orders', { scroll: false })
    }
    const clearSearch = () => { setSearch(''); router.push('/orders', { scroll: false }) }

    if (orders.isLoading) {
        return <div className="p-6 text-center text-gray-500">جاري تحميل الطلبات...</div>
    }

    return (
        <main className="space-y-6 p-6" dir="rtl">
            <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">إدارة الطلبات</h1>
                    <p className="text-sm text-gray-500">جميع طلبات متجرك.</p>
                </div>

                <form onSubmit={submitSearch} className="relative w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-purple-600 sm:w-80">
                    <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="ابحث برقم الطلب..."
                        className="h-11 w-full rounded-lg bg-transparent py-2 pr-10 pl-3 text-sm text-gray-900 outline-none placeholder:text-gray-400"
                        aria-label="البحث برقم الطلب"
                    />
                    {search && <button type="button" onClick={clearSearch} className="absolute left-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center text-gray-400 hover:text-gray-700" aria-label="مسح البحث"><X className="h-4 w-4" /></button>}
                    <button type="submit" className="sr-only">بحث</button>
                </form>
            </div>

            <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
                <table className="w-full text-right text-sm">
                    <thead className="bg-gray-50 text-xs text-gray-500">
                        <tr>
                            <th className="px-5 py-3">رقم الطلب</th>
                            <th className="px-5 py-3">العميل</th>
                            <th className="px-5 py-3">الإجمالي</th>
                            <th className="px-5 py-3">الحالة</th>
                            <th className="px-5 py-3">التاريخ</th>
                            <th className="px-5 py-3">التفاصيل</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredOrders.map((order: any) => (
                            <tr key={String(order.id)}>
                                <td className="px-5 py-4 font-semibold">
                                    {order.orderNumber ?? order.order_number ?? String(order.id).slice(0, 8)}
                                </td>
                                <td className="px-5 py-4">
                                    {String(
                                        (order.shippingAddress as { fullName?: string })?.fullName ??
                                        order.customer_name ??
                                        'عميل'
                                    )}
                                </td>
                                <td className="px-5 py-4">
                                    {(order.total ?? order.total_amount ?? 0).toLocaleString('ar-EG')} جنيه
                                </td>
                                <td className="px-5 py-4">
                                    <select
                                        value={order.orderStatus ?? order.status ?? 'pending'}
                                        onChange={(event) => updateStatus.mutate({ orderId: String(order.id), status: event.target.value as OrderStatus })}
                                        className="rounded border border-gray-300 px-2 py-1 text-xs outline-none focus:border-purple-600"
                                        disabled={updateStatus.isPending}
                                    >
                                        {statuses.map((status) => (
                                            <option key={status} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-5 py-4 text-gray-500">
                                    {order.createdAt || order.created_at ? new Date(order.createdAt ?? order.created_at).toLocaleDateString('ar-EG') : '-'}
                                </td>
                                <td className="px-5 py-4"><button type="button" onClick={() => router.push(`/orders?search=${encodeURIComponent(order.orderNumber ?? order.order_number ?? '')}`, { scroll: false })} className="grid h-8 w-8 place-items-center text-gray-500 hover:bg-gray-100 hover:text-gray-900" aria-label="عرض تفاصيل الطلب"><Eye className="h-4 w-4" /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {filteredOrders.length === 0 && (
                    <p className="p-5 text-center text-sm text-gray-500">
                        {search ? 'لا توجد طلبات مطابقة للبحث.' : 'لا توجد طلبات حالية.'}
                    </p>
                )}
            </div>
        </main>
    )
}
