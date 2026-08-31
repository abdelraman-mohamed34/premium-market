import React from "react";
import {
    TrendingUp,
    ShoppingBag,
    Users,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    Eye
} from "lucide-react";
import TenantLink from "@/shared/components/TenantLink";

const stats = [
    {
        title: "إجمالي المبيعات",
        value: "45,231 ج.م",
        change: "+12.5%",
        isPositive: true,
        icon: DollarSign,
    },
    {
        title: "إجمالي الطلبات",
        value: "354",
        change: "+8.2%",
        isPositive: true,
        icon: ShoppingBag,
    },
    {
        title: "العملاء الجدد",
        value: "1,205",
        change: "-2.1%",
        isPositive: false,
        icon: Users,
    },
    {
        title: "معدل التحويل",
        value: "3.2%",
        change: "+4.1%",
        isPositive: true,
        icon: TrendingUp,
    },
];

const recentOrders = [
    { id: "#ORD-9582", customer: "أحمد محمود", status: "مكتمل", amount: "1,200 ج.م", date: "منذ 10 دقائق" },
    { id: "#ORD-9581", customer: "سارة علي", status: "قيد المعالجة", amount: "450 ج.م", date: "منذ 45 دقيقة" },
    { id: "#ORD-9580", customer: "محمد حسن", status: "قيد الانتظار", amount: "890 ج.م", date: "منذ ساعتين" },
    { id: "#ORD-9579", customer: "منى السيد", status: "مكتمل", amount: "3,100 ج.م", date: "منذ 5 ساعات" },
];

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50/50 p-6 space-y-8 dir-rtl" dir="rtl">

            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">لوحة التحكم</h1>
                    <p className="text-sm text-gray-500">مرحباً بك مجدداً، إليك نظرة عامة على أداء متجرك اليوم.</p>
                </div>
                <div className="flex items-center gap-3">
                    <TenantLink
                        href="/products/new"
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-gray-800"
                    >
                        <Plus className="h-4 w-4" />
                        إضافة منتج جديد
                    </TenantLink>
                </div>
            </div>

            {/* Stats Cards Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <div
                            key={index}
                            className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-500">{stat.title}</span>
                                <div className="rounded-lg bg-gray-50 p-2 text-gray-600">
                                    <Icon className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="mt-4 flex items-baseline justify-between">
                                <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
                                <span
                                    className={`inline-flex items-center gap-1 text-xs font-semibold ${stat.isPositive ? "text-emerald-600" : "text-rose-600"
                                        }`}
                                >
                                    {stat.isPositive ? (
                                        <ArrowUpRight className="h-3.5 w-3.5" />
                                    ) : (
                                        <ArrowDownRight className="h-3.5 w-3.5" />
                                    )}
                                    {stat.change}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Main Content Grid */}
            <div className="grid gap-6 lg:grid-cols-3">

                {/* Recent Orders Table (2 Cols) */}
                <div className="lg:col-span-2 rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">أحدث الطلبات</h2>
                            <p className="text-xs text-gray-500">عرض الطلبات التي تم إجراؤها مؤخراً</p>
                        </div>
                        <TenantLink
                            href="/orders"
                            className="text-xs font-semibold text-gray-600 hover:text-black transition-colors"
                        >
                            عرض الكل
                        </TenantLink>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-right text-sm">
                            <thead className="bg-gray-50/50 text-xs font-semibold text-gray-500">
                                <tr>
                                    <th className="px-6 py-3">رقم الطلب</th>
                                    <th className="px-6 py-3">العميل</th>
                                    <th className="px-6 py-3">الحالة</th>
                                    <th className="px-6 py-3">المبلغ</th>
                                    <th className="px-6 py-3 text-left">إجراء</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                                {recentOrders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-semibold text-gray-900">{order.id}</td>
                                        <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${order.status === "مكتمل"
                                                    ? "bg-emerald-50 text-emerald-700"
                                                    : order.status === "قيد المعالجة"
                                                        ? "bg-amber-50 text-amber-700"
                                                        : "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">{order.amount}</td>
                                        <td className="px-6 py-4 text-left">
                                            <TenantLink
                                                href={`/orders/${order.id}`}
                                                className="inline-flex items-center justify-center rounded-md p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </TenantLink>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions / Store Status (1 Col) */}
                <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold text-gray-900">حالة المتجر</h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                            <span className="text-sm font-medium text-gray-600">رابط المتجر</span>
                            <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">نشط</span>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-gray-500 font-medium">
                                <span>المساحة المستهلكة</span>
                                <span>65%</span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-black w-[65%] rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-100" />

                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-900">اختصارات سريعة</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <TenantLink
                                href="/settings"
                                className="p-3 text-center rounded-lg border border-gray-100 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                إعدادات الهوية
                            </TenantLink>
                            <TenantLink
                                href="/products"
                                className="p-3 text-center rounded-lg border border-gray-100 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                إدارة المنتجات
                            </TenantLink>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}