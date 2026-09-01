"use client"

import { DollarSign, Package, Plus, ShoppingBag } from "lucide-react"
import { useTenantSlug } from "@/app/shared/lib/providers/providers"
import { useGraphood } from "@/app/shared/lib/graphood/hooks/use-graphood"
import { useDashboardStats } from "@/hooks/use-orders"
import TenantLink from "@/shared/components/TenantLink"

export default function DashboardPage() {
    const tenantSlug = useTenantSlug() ?? ""
    const { tenantId } = useGraphood({ tenantSlug, enabled: Boolean(tenantSlug) })
    const query = useDashboardStats(tenantId)
    const stats = query.data?.success ? query.data.data : null
    const cards = [["إجمالي المبيعات", `${(stats?.revenue ?? 0).toLocaleString("ar-EG")} ج.م`, DollarSign], ["إجمالي الطلبات", String(stats?.ordersCount ?? 0), ShoppingBag], ["إجمالي المنتجات", String(stats?.productsCount ?? 0), Package]] as const

    return <main className="min-h-screen space-y-8 bg-gray-50/50 p-6" dir="rtl">
        <header className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1><p className="text-sm text-gray-500">نظرة عامة على أداء متجرك.</p></div><TenantLink href="/products/new" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" />إضافة منتج</TenantLink></header>
        {query.error || (query.data && !query.data.success) ? <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{query.error?.message ?? (query.data && !query.data.success ? query.data.error : "")}</p> : null}
        <section className="grid gap-4 sm:grid-cols-3">{cards.map(([label, value, Icon]) => <div key={label} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm text-gray-500">{label}</span><Icon className="h-5 w-5 text-gray-500" /></div><strong className="mt-4 block text-2xl text-gray-900">{value}</strong></div>)}</section>
        <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-gray-100 p-6"><h2 className="text-lg font-bold">أحدث الطلبات</h2><TenantLink href="/orders" className="text-xs font-semibold text-gray-600">عرض الكل</TenantLink></div><div className="overflow-x-auto"><table className="w-full text-right text-sm"><thead className="bg-gray-50 text-xs text-gray-500"><tr><th className="px-6 py-3">الطلب</th><th className="px-6 py-3">العميل</th><th className="px-6 py-3">الحالة</th><th className="px-6 py-3">المبلغ</th></tr></thead><tbody className="divide-y divide-gray-100">{stats?.recentOrders.map((order) => <tr key={order.id}><td className="px-6 py-4 font-semibold">{order.orderNumber}</td><td className="px-6 py-4 text-gray-600">{order.customerName || "عميل"}</td><td className="px-6 py-4"><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs">{order.status}</span></td><td className="px-6 py-4">{order.total.toLocaleString("ar-EG")} ج.م</td></tr>)}</tbody></table></div></section>
    </main>
}
