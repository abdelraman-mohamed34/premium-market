'use client'

import React, { useState, type FormEvent } from 'react'
import TenantLink from '@/shared/components/TenantLink' // التعديل هنا: استبدال next/link
import { ShieldCheck, Truck, RefreshCw, Send } from 'lucide-react'
import { toast } from 'sonner'
import { useTenantSlug } from '@/app/shared/lib/providers/providers'
import { useGraphood } from '@/app/shared/lib/graphood/hooks/use-graphood'
import { isSandboxTenant, useStoreProducts } from '@/hooks/use-store-data'

export default function Footer() {
    const [email, setEmail] = useState('')
    const tenantSlug = useTenantSlug() ?? ''
    const sandbox = isSandboxTenant(tenantSlug)
    const { tenantId, tenant } = useGraphood({ tenantSlug, enabled: !sandbox })
    const { data: products } = useStoreProducts(tenantSlug, tenantId)
    const categoryLinks = [...new Set(products?.flatMap(product => product.tags ?? []) ?? [])].slice(0, 3)
    const storeName = tenant?.data.tenant.name.toUpperCase() ?? 'STORE'

    const handleSubscribe = (e: FormEvent) => {
        e.preventDefault()
        if (!email || !email.includes('@')) {
            toast.error('برجاء إدخال بريد إلكتروني صحيح')
            return
        }
        toast.success('تم الاشتراك في النشرة البريدية بنجاح!')
        setEmail('')
    }

    return (
        <footer className="w-full border-t border-gray-200 bg-white text-gray-700">
            {/* Trust Badges */}
            <div className="border-b border-zinc-800 bg-primary py-8 text-white">
                <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 text-center sm:grid-cols-3 sm:px-6 lg:px-8">
                    <div className="flex flex-col items-center gap-2">
                        <Truck className="h-6 w-6 text-white" />
                        <span className="text-sm font-semibold text-white">شحن سريع وآمن</span>
                        <span className="text-xs text-zinc-400">توصيل لجميع المحافظات</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <RefreshCw className="h-6 w-6 text-white" />
                        <span className="text-sm font-semibold text-white">استبدال واسترجاع</span>
                        <span className="text-xs text-zinc-400">سياسة استرجاع مرنة خلال 14 يوم</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                        <ShieldCheck className="h-6 w-6 text-white" />
                        <span className="text-sm font-semibold text-white">دفع آمن 100%</span>
                        <span className="text-xs text-zinc-400">الدفع عند الاستلام أو إلكترونياً</span>
                    </div>
                </div>
            </div>

            {/* Main Footer Links */}
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">

                    {/* Brand Info */}
                    <div className="space-y-3">
                        <h3 className="text-xl font-bold tracking-tight text-primary">{storeName}</h3>
                        <p className="text-xs leading-relaxed text-gray-500">
                            متجرك المفضل لتسوق أحدث المنتجات والعروض بأعلى جودة وأفضل أسعار.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="mb-4 text-sm font-bold text-black uppercase">روابط سريعة</h4>
                        <ul className="space-y-2.5 text-xs">
                            <li>
                                <TenantLink href="/products" className="transition hover:text-black">جميع المنتجات</TenantLink>
                            </li>
                            <li>
                                <TenantLink href="/categories" className="transition hover:text-black">التصنيفات</TenantLink>
                            </li>
                            {categoryLinks.map(category => (
                                <li key={category}>
                                    <TenantLink href={`/products?search=${encodeURIComponent(category)}`} className="transition hover:text-black">
                                        {category}
                                    </TenantLink>
                                </li>
                            ))}
                            <li>
                                <TenantLink href="/cart" className="transition hover:text-black">سلة التسوق</TenantLink>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Support */}
                    <div>
                        <h4 className="mb-4 text-sm font-bold text-black uppercase">خدمة العملاء</h4>
                        <ul className="space-y-2.5 text-xs">
                            <li>
                                <TenantLink href="/faq" className="transition hover:text-black">الأسئلة الشائعة</TenantLink>
                            </li>
                            <li>
                                <TenantLink href="/shipping-policy" className="transition hover:text-black">سياسة الشحن</TenantLink>
                            </li>
                            <li>
                                <TenantLink href="/return-policy" className="transition hover:text-black">سياسة الاسترجاع</TenantLink>
                            </li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="mb-4 text-sm font-bold text-black uppercase">النشرة البريدية</h4>
                        <p className="mb-3 text-xs text-gray-500">اشترك للحصول على أحدث العروض والخصومات.</p>
                        <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="بريدك الإلكتروني..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full border border-gray-300 px-3 py-2 pl-9 text-xs outline-none focus:border-black"
                                />
                                <button
                                    type="submit"
                                    className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                                    aria-label="Subscribe"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </form>
                    </div>

                </div>

                {/* Bottom Bar */}
                <div className="mt-12 border-t border-gray-100 pt-6 text-center text-xs text-gray-400 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p>© {new Date().getFullYear()} {storeName}. جميع الحقوق محفوظة.</p>
                    <p className="text-[11px]">Powered by Graphood Platform</p>
                </div>
            </div>
        </footer>
    )
}