'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Loader2, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { isSandboxTenant, useStoreCart } from '@/hooks/use-store-data'
import { useTenantSlug } from '@/app/shared/lib/providers/providers'
import { useGraphood } from '@/app/shared/lib/graphood/hooks/use-graphood'

const money = new Intl.NumberFormat('ar-EG', { style: 'currency', currency: 'EGP', maximumFractionDigits: 2 })

export default function CartPage() {
    const tenantSlug = useTenantSlug() ?? ''
    const sandbox = isSandboxTenant(tenantSlug)
    const { tenantId, tenantQuery } = useGraphood({ tenantSlug, enabled: !sandbox })
    const { data: cart, isLoading, error, updateItem, removeItem, clear } = useStoreCart(tenantSlug, tenantId)
    const isMutating = removeItem.isPending || clear.isPending

    if ((!sandbox && tenantQuery.isLoading) || isLoading) return <div className="flex min-h-[55vh] items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" aria-label="Loading cart" /></div>

    if (error) {
        const requiresLogin = error.message.toLowerCase().includes('authentication')
        return <main className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-6 text-center"><ShoppingBag className="mb-5 h-10 w-10 text-gray-400" /><h1 className="text-2xl font-bold text-gray-950">{requiresLogin ? 'Sign in to view your cart' : 'Unable to load your cart'}</h1><p className="mt-2 text-sm text-gray-500">{requiresLogin ? 'Your saved items will be available after you sign in.' : error.message}</p><Link href={requiresLogin ? '/login' : '/products'} className="mt-6 inline-flex items-center gap-2 bg-black px-5 py-3 text-sm font-semibold text-white">{requiresLogin ? 'Sign in' : 'Browse products'} <ArrowRight className="h-4 w-4" /></Link></main>
    }

    if (!cart?.items.length) {
        return <main className="mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-6 text-center"><ShoppingBag className="mb-5 h-10 w-10 text-gray-400" /><h1 className="text-2xl font-bold text-gray-950">Your cart is empty</h1><p className="mt-2 text-sm text-gray-500">Browse the collection and add the products you want to order.</p><Link href="/products" className="mt-6 inline-flex items-center gap-2 bg-black px-5 py-3 text-sm font-semibold text-white">Browse products <ArrowRight className="h-4 w-4" /></Link></main>
    }

    return (
        <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-4 border-b border-gray-200 pb-5"><div><h1 className="text-3xl font-bold text-gray-950">Shopping cart</h1><p className="mt-1 text-sm text-gray-500">{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}</p></div><button type="button" onClick={() => clear.mutate()} disabled={isMutating} className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50">Clear cart</button></div>
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
                <section className="divide-y divide-gray-200 border-y border-gray-200" aria-label="Cart items">
                    {cart.items.map((item) => {
                        const pendingItem = (updateItem.isPending && String(updateItem.variables?.cartItemId) === String(item.id)) || (removeItem.isPending && String(removeItem.variables) === String(item.id))
                        return (
                            <article key={item.id} className="grid grid-cols-[88px_minmax(0,1fr)] gap-4 py-5 sm:grid-cols-[112px_minmax(0,1fr)_auto] sm:items-center">
                                <div className="relative aspect-square overflow-hidden bg-gray-100"><Image src={item.image} alt={item.title} fill sizes="(max-width: 640px) 88px, 112px" unoptimized className="object-cover" /></div>
                                <div className="min-w-0"><Link href={`/products/${item.productId}`} className="line-clamp-2 font-semibold text-gray-950 hover:underline">{item.title}</Link><div className="mt-1 flex flex-wrap gap-x-3 text-xs text-gray-500">{item.selectedSize && <span>Size: {item.selectedSize}</span>}{item.selectedColor && <span className="inline-flex items-center gap-1.5"><span className="h-3 w-3 border border-gray-300" style={{ backgroundColor: item.selectedColor }} /> Color</span>}</div><p className="mt-3 text-sm font-semibold text-gray-900">{money.format(item.price)}</p></div>
                                <div className="col-span-2 flex items-center justify-between sm:col-span-1 sm:flex-col sm:items-end sm:gap-4">
                                    <div className="grid h-10 grid-cols-[40px_42px_40px] border border-gray-300" aria-label={`Quantity for ${item.title}`}><button type="button" title="Decrease quantity" aria-label="Decrease quantity" disabled={isMutating || pendingItem || item.quantity <= 1} onClick={() => updateItem.mutate({ cartItemId: item.id, quantity: item.quantity - 1 })} className="grid place-items-center hover:bg-gray-100 disabled:opacity-40"><Minus className="h-4 w-4" /></button><span className="grid place-items-center border-x border-gray-300 text-sm font-medium">{item.quantity}</span><button type="button" title="Increase quantity" aria-label="Increase quantity" disabled={isMutating || pendingItem} onClick={() => updateItem.mutate({ cartItemId: item.id, quantity: item.quantity + 1 })} className="grid place-items-center hover:bg-gray-100 disabled:opacity-40"><Plus className="h-4 w-4" /></button></div>
                                    <button type="button" title="Remove item" aria-label={`Remove ${item.title}`} disabled={isMutating || pendingItem} onClick={() => removeItem.mutate(item.id)} className="grid h-10 w-10 place-items-center text-gray-500 hover:bg-red-50 hover:text-red-700 disabled:opacity-40"><Trash2 className="h-4 w-4" /></button>
                                </div>
                            </article>
                        )
                    })}
                </section>
                <aside className="h-fit border border-gray-200 p-5"><h2 className="text-lg font-bold text-gray-950">Order summary</h2><dl className="mt-5 space-y-3 text-sm"><div className="flex justify-between gap-4"><dt className="text-gray-500">Subtotal</dt><dd className="font-medium">{money.format(cart.summary.subtotal)}</dd></div><div className="flex justify-between gap-4"><dt className="text-gray-500">Shipping</dt><dd className="font-medium">{cart.summary.shippingFee ? money.format(cart.summary.shippingFee) : 'Calculated at checkout'}</dd></div>{cart.summary.discountAmount > 0 && <div className="flex justify-between gap-4 text-green-700"><dt>Discount</dt><dd>-{money.format(cart.summary.discountAmount)}</dd></div>}<div className="flex justify-between gap-4 border-t border-gray-200 pt-4 text-base font-bold"><dt>Total</dt><dd>{money.format(cart.summary.total)}</dd></div></dl><Link href="/checkout" className="mt-6 block w-full bg-black px-5 py-3 text-center text-sm font-semibold text-white">Proceed to checkout</Link><Link href="/products" className="mt-3 flex items-center justify-center gap-2 py-2 text-sm font-medium text-gray-700 hover:text-black">Continue shopping <ArrowRight className="h-4 w-4" /></Link></aside>
            </div>
        </main>
    )
}
