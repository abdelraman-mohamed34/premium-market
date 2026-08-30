'use client'

import React, { useState } from 'react'
import TenantLink from '@/shared/components/TenantLink' // التعديل هنا: استبدال next/link
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react'
import { useTenantSlug } from '@/app/shared/lib/providers/providers'
import { useGraphood } from '@/app/shared/lib/graphood/hooks/use-graphood'
import { isSandboxTenant, useStoreCart } from '@/hooks/use-store-data'

export default function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const tenantSlug = useTenantSlug() ?? ''
    const sandbox = isSandboxTenant(tenantSlug)
    const { tenantId } = useGraphood({ tenantSlug, enabled: !sandbox })
    const { data: cart } = useStoreCart(tenantSlug, tenantId)

    const itemCount = cart?.items?.length ?? 0

    return (
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-md">
            <div className="mx-auto flex h-16 items-center justify-between px-4 sm:px-5">

                {/* Mobile menu button */}
                <button
                    type="button"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="inline-flex items-center justify-center p-2 text-gray-700 hover:text-black md:hidden"
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>

                {/* Store Brand / Logo */}
                <div className="flex items-center gap-8">
                    <TenantLink href="/" className="text-xl font-bold tracking-tight text-black uppercase">
                        {tenantSlug || 'Store'}
                    </TenantLink>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden md:flex md:items-center md:gap-6 text-sm font-medium text-gray-700">
                        <TenantLink href="/products" className="transition hover:text-black">
                            المنتجات
                        </TenantLink>
                        <TenantLink href="/categories" className="transition hover:text-black">
                            التصنيفات
                        </TenantLink>
                        <TenantLink href="/offers" className="transition hover:text-black">
                            العروض
                        </TenantLink>
                    </nav>
                </div>

                {/* User Actions */}
                <div className="flex items-center gap-4">
                    <button
                        type="button"
                        aria-label="Search"
                        className="p-2 text-gray-700 transition hover:text-black"
                    >
                        <Search className="h-5 w-5" />
                    </button>

                    <TenantLink
                        href="/profile"
                        aria-label="Account"
                        className="p-2 text-gray-700 transition hover:text-black"
                    >
                        <User className="h-5 w-5" />
                    </TenantLink>

                    {/* Cart Icon with Badge */}
                    <TenantLink
                        href="/cart"
                        className="relative p-2 text-gray-700 transition hover:text-black"
                        aria-label="Cart"
                    >
                        <ShoppingBag className="h-5 w-5" />
                        {itemCount > 0 && (
                            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[10px] font-bold text-white">
                                {itemCount}
                            </span>
                        )}
                    </TenantLink>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {mobileMenuOpen && (
                <div className="border-b border-gray-200 bg-white px-4 pt-2 pb-4 md:hidden">
                    <nav className="flex flex-col gap-3 text-sm font-medium text-gray-700">
                        <TenantLink
                            href="/products"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1 transition hover:text-black"
                        >
                            المنتجات
                        </TenantLink>
                        <TenantLink
                            href="/categories"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1 transition hover:text-black"
                        >
                            التصنيفات
                        </TenantLink>
                        <TenantLink
                            href="/offers"
                            onClick={() => setMobileMenuOpen(false)}
                            className="py-1 transition hover:text-black"
                        >
                            العروض
                        </TenantLink>
                    </nav>
                </div>
            )}
        </header>
    )
}