'use client'

import { useTenantSlug } from '@/app/shared/lib/providers/providers'
import { useGraphood } from '@/app/shared/lib/graphood/hooks/use-graphood'
import { useTenantOrders, useUpdateOrderStatus } from '@/hooks/use-orders'
import type { OrderStatus } from '@/schemas/order.schema'

const statuses: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded']

export default function DashboardOrdersPage() {
    const tenantSlug = useTenantSlug() ?? ''
    const { tenantId } = useGraphood({ tenantSlug, enabled: Boolean(tenantSlug) })
    const orders = useTenantOrders(tenantId)
    const updateStatus = useUpdateOrderStatus(tenantId)
    const list = orders.data?.success ? orders.data.data : []

    return <main className="space-y-6 p-6" dir="rtl"><div><h1 className="text-2xl font-bold">إدارة الطلبات</h1><p className="text-sm text-gray-500">جميع طلبات متجرك.</p></div><div className="overflow-x-auto rounded-xl border border-gray-200 bg-white"><table className="w-full text-right text-sm"><thead className="bg-gray-50 text-xs text-gray-500"><tr><th className="px-5 py-3">رقم الطلب</th><th className="px-5 py-3">العميل</th><th className="px-5 py-3">الإجمالي</th><th className="px-5 py-3">الحالة</th><th className="px-5 py-3">التاريخ</th></tr></thead><tbody className="divide-y divide-gray-100">{list.map((order) => <tr key={String(order.id)}><td className="px-5 py-4 font-semibold">{order.orderNumber}</td><td className="px-5 py-4">{String((order.shippingAddress as { fullName?: string }).fullName ?? 'عميل')}</td><td className="px-5 py-4">{order.total.toLocaleString('ar-EG')} ج.م</td><td className="px-5 py-4"><select value={order.orderStatus} onChange={(event) => updateStatus.mutate({ orderId: String(order.id), status: event.target.value })} className="border border-gray-300 px-2 py-1 text-xs" disabled={updateStatus.isPending}>{statuses.map((status) => <option key={status} value={status}>{status}</option>)}</select></td><td className="px-5 py-4 text-gray-500">{order.createdAt ? new Date(order.createdAt).toLocaleDateString('ar-EG') : '-'}</td></tr>)}</tbody></table></div></main>
}
