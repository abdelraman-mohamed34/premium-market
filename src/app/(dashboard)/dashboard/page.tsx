"use client"

import { DollarSign, Package, Plus, Search, ShoppingBag } from "lucide-react"
import { useState, type FormEvent } from "react"
import { useTenantSlug } from "@/app/shared/lib/providers/providers"
import { useGraphood } from "@/app/shared/lib/graphood/hooks/use-graphood"
import { useDashboardStats } from "@/hooks/use-orders"
import TenantLink from "@/shared/components/TenantLink"
import { useTenantRouter } from "@/shared/hooks/useTenantRouter"

export default function DashboardPage() {
    const router = useTenantRouter()
    const tenantSlug = useTenantSlug() ?? ""
    const { tenantId } = useGraphood({ tenantSlug, enabled: Boolean(tenantSlug) })
    const query = useDashboardStats(tenantId)
    const stats = query.data?.success ? query.data.data : null
    const cards = [["إجمالي المبيعات", `${(stats?.revenue ?? 0).toLocaleString("ar-EG")} جنيه`, DollarSign], ["إجمالي الطلبات", String(stats?.ordersCount ?? 0), ShoppingBag], ["إجمالي المنتجات", String(stats?.productsCount ?? 0), Package]] as const
    const [search, setSearch] = useState("")
    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const query = search.trim()
        router.push(query ? `/orders?search=${encodeURIComponent(query)}` : "/orders", { scroll: false })
    }

    return <main className="min-h-screen space-y-8 bg-gray-50/50 p-6" dir="rtl">
        <header className="flex flex-wrap items-center justify-between gap-4"><div><h1 className="text-2xl font-bold text-gray-900">لوحة التحكم</h1><p className="text-sm text-gray-500">نظرة عامة على أداء متجرك.</p></div><div className="flex flex-wrap items-center gap-3"><form onSubmit={submitSearch} className="relative w-full max-w-md rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow focus-within:ring-2 focus-within:ring-purple-600 sm:w-72"><Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="ابحث برقم الطلب..." className="h-11 w-full rounded-lg bg-transparent py-2 pr-10 pl-3 text-sm text-gray-900 outline-none placeholder:text-gray-400" aria-label="البحث برقم الطلب" /><button type="submit" className="sr-only">بحث</button></form><TenantLink href="/products/new" className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"><Plus className="h-4 w-4" />إضافة منتج</TenantLink></div></header>
        {query.error || (query.data && !query.data.success) ? <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700">{query.error?.message ?? (query.data && !query.data.success ? query.data.error : "")}</p> : null}
        <section className="grid gap-4 sm:grid-cols-3">{cards.map(([label, value, Icon]) => <div key={label} className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm text-gray-500">{label}</span><Icon className="h-5 w-5 text-gray-500" /></div><strong className="mt-4 block text-2xl text-gray-900">{value}</strong></div>)}</section>
        <section className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"><div className="flex items-center justify-between border-b border-gray-100 p-6"><h2 className="text-lg font-bold">أحدث الطلبات</h2><TenantLink href="/orders" className="text-xs font-semibold text-gray-600">عرض الكل</TenantLink></div><div className="overflow-x-auto"><table className="w-full text-right text-sm"><thead className="bg-gray-50 text-xs text-gray-500"><tr><th className="px-6 py-3">الطلب</th><th className="px-6 py-3">العميل</th><th className="px-6 py-3">الحالة</th><th className="px-6 py-3">المبلغ</th></tr></thead><tbody className="divide-y divide-gray-100">{stats?.recentOrders.slice(0, 7).map((order) => <tr key={order.id}><td className="px-6 py-4 font-semibold">{order.orderNumber}</td><td className="px-6 py-4 text-gray-600">{order.customerName || "عميل"}</td><td className="px-6 py-4"><span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs">{order.status}</span></td><td className="px-6 py-4">{order.total.toLocaleString("ar-EG")} جنيه</td></tr>)}</tbody></table></div></section>
    </main>
}
