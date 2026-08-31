'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Loader2, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { isSandboxTenant, useStoreCart } from '@/hooks/use-store-data'
import { useTenantSlug } from '@/app/shared/lib/providers/providers'
import { useGraphood } from '@/app/shared/lib/graphood/hooks/use-graphood'
import TenantLink from '@/shared/components/TenantLink'

const currencyFormatter = new Intl.NumberFormat('ar-EG', {
    style: 'currency',
    currency: 'EGP',
    maximumFractionDigits: 2,
})

export default function CartPage() {
    const tenantSlug = useTenantSlug() ?? ''
    const sandbox = isSandboxTenant(tenantSlug)
    const { tenantId, tenantQuery } = useGraphood({ tenantSlug, enabled: !sandbox })
    const { data: cart, isLoading, error, updateItem, removeItem, clear } = useStoreCart(tenantSlug, tenantId)

    const isMutating = removeItem.isPending || clear.isPending || updateItem.isPending

    // Global loading state
    if ((!sandbox && tenantQuery.isLoading) || isLoading) {
        return (
            <div className="flex min-h-[55vh] items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" aria-label="Loading cart" />
            </div>
        )
    }

    // Error boundary / Auth prompt
    if (error) {
        const requiresLogin = error.message.toLowerCase().includes('authentication')
        return (
            <main className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-6 text-center">
                <ShoppingBag className="mb-5 h-10 w-10 text-gray-400" />
                <h1 className="text-2xl font-bold text-gray-950">
                    {requiresLogin ? 'Sign in to view your cart' : 'Unable to load your cart'}
                </h1>
                <p className="mt-2 text-sm text-gray-500">
                    {requiresLogin ? 'Your saved items will be available after you sign in.' : error.message}
                </p>
                <TenantLink
                    href={requiresLogin ? '/login' : '/products'}
                    className="mt-6 inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                    {requiresLogin ? 'Sign in' : 'Browse products'} <ArrowRight className="h-4 w-4" />
                </TenantLink>
            </main>
        )
    }

    // Empty cart view
    if (!cart?.items || cart.items.length === 0) {
        return (
            <main className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-6 text-center">
                <ShoppingBag className="mb-5 h-10 w-10 text-gray-400" />
                <h1 className="text-2xl font-bold text-gray-950">Your cart is empty</h1>
                <p className="mt-2 text-sm text-gray-500">
                    Browse the collection and add the products you want to order.
                </p>
                <TenantLink
                    href="/products"
                    className="mt-6 inline-flex items-center gap-2 bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                    Browse products <ArrowRight className="h-4 w-4" />
                </TenantLink>
            </main>
        )
    }

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            {/* Page Header */}
            <div className="mb-8 flex items-end justify-between gap-4 border-b border-gray-200 pb-5">
                <div>
                    <h1 className="text-3xl font-bold text-gray-950">Shopping cart</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => clear.mutate()}
                    disabled={isMutating}
                    className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50 transition-colors"
                >
                    Clear cart
                </button>
            </div>

            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
                {/* Cart Item Listing */}
                <section className="divide-y divide-gray-200 border-y border-gray-200" aria-label="Cart items">
                    {cart.items.map((item) => {
                        const isUpdatingThis = updateItem.isPending && String(updateItem.variables?.cartItemId) === String(item.id)
                        const isRemovingThis = removeItem.isPending && String(removeItem.variables) === String(item.id)
                        const isItemPending = isUpdatingThis || isRemovingThis

                        return (
                            <article
                                key={item.id}
                                className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[112px_minmax(0,1fr)_auto] sm:items-center"
                            >
                                {/* Product Image */}
                                <div className="relative aspect-square overflow-hidden bg-gray-100 rounded">
                                    <Image
                                        src={item.image || '/placeholder.png'}
                                        alt={item.title || 'Product Image'}
                                        fill
                                        sizes="(max-width: 640px) 88px, 112px"
                                        unoptimized
                                        className="object-cover"
                                    />
                                </div>

                                {/* Info & Variants */}
                                <div className="min-w-0">
                                    <TenantLink
                                        href={`/products/${item.productId}`}
                                        className="line-clamp-2 font-semibold text-gray-950 hover:underline"
                                    >
                                        {item.title}
                                    </TenantLink>
                                    <div className="mt-1 flex flex-wrap gap-x-3 text-xs text-gray-500">
                                        {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                                        {item.selectedColor && (
                                            <span className="inline-flex items-center gap-1.5">
                                                <span
                                                    className="h-3 w-3 rounded-full border border-gray-300"
                                                    style={{ backgroundColor: item.selectedColor }}
                                                />
                                                Color
                                            </span>
                                        )}
                                    </div>
                                    <p className="mt-3 text-sm font-semibold text-gray-900">
                                        {currencyFormatter.format(item.price)}
                                    </p>
                                </div>

                                {/* Quantity Controls & Remove */}
                                <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:flex-col sm:items-end sm:gap-4">
                                    <div
                                        className="grid h-10 grid-cols-[40px_42px_40px] border border-gray-300 rounded overflow-hidden"
                                        aria-label={`Quantity for ${item.title}`}
                                    >
                                        <button
                                            type="button"
                                            title="Decrease quantity"
                                            aria-label="Decrease quantity"
                                            disabled={isMutating || isItemPending || item.quantity <= 1}
                                            onClick={() => updateItem.mutate({ cartItemId: item.id, quantity: item.quantity - 1 })}
                                            className="grid place-items-center hover:bg-gray-100 disabled:opacity-40 transition-colors"
                                        >
                                            <Minus className="h-4 w-4" />
                                        </button>

                                        <span className="grid place-items-center border-x border-gray-300 text-sm font-medium">
                                            {isUpdatingThis ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin text-gray-500" />
                                            ) : (
                                                item.quantity
                                            )}
                                        </span>

                                        <button
                                            type="button"
                                            title="Increase quantity"
                                            aria-label="Increase quantity"
                                            disabled={isMutating || isItemPending}
                                            onClick={() => updateItem.mutate({ cartItemId: item.id, quantity: item.quantity + 1 })}
                                            className="grid place-items-center hover:bg-gray-100 disabled:opacity-40 transition-colors"
                                        >
                                            <Plus className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <button
                                        type="button"
                                        title="Remove item"
                                        aria-label={`Remove ${item.title}`}
                                        disabled={isMutating || isItemPending}
                                        onClick={() => removeItem.mutate(item.id)}
                                        className="grid h-10 w-10 place-items-center rounded text-gray-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-40 transition-colors"
                                    >
                                        {isRemovingThis ? (
                                            <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </article>
                        )
                    })}
                </section>

                {/* Order Summary Sidebar */}
                <aside className="h-fit border border-gray-200 p-5 rounded">
                    <h2 className="text-lg font-bold text-gray-950">Order summary</h2>

                    <dl className="mt-5 space-y-3 text-sm">
                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500">Subtotal</dt>
                            <dd className="font-medium">{currencyFormatter.format(cart.summary.subtotal)}</dd>
                        </div>

                        <div className="flex justify-between gap-4">
                            <dt className="text-gray-500">Shipping</dt>
                            <dd className="font-medium">
                                {cart.summary.shippingFee
                                    ? currencyFormatter.format(cart.summary.shippingFee)
                                    : 'Calculated at checkout'}
                            </dd>
                        </div>

                        {cart.summary.discountAmount > 0 && (
                            <div className="flex justify-between gap-4 text-green-700">
                                <dt>Discount</dt>
                                <dd>-{currencyFormatter.format(cart.summary.discountAmount)}</dd>
                            </div>
                        )}

                        <div className="flex justify-between gap-4 border-t border-gray-200 pt-4 text-base font-bold text-gray-950">
                            <dt>Total</dt>
                            <dd>{currencyFormatter.format(cart.summary.total)}</dd>
                        </div>
                    </dl>

                    <TenantLink
                        href="/checkout"
                        className="mt-6 block w-full rounded bg-primary px-5 py-3 text-center text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        Proceed to checkout
                    </TenantLink>

                    <TenantLink
                        href="/products"
                        className="mt-3 flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-700 hover:text-black transition-colors"
                    >
                        Continue shopping <ArrowRight className="h-4 w-4" />
                    </TenantLink>
                </aside>
            </div>
        </main>
    )
}
