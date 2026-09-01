'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { ImagePlus, Loader2, Trash2, UploadCloud } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useGraphood } from '@/app/shared/lib/graphood/hooks/use-graphood'
import { useTenantSlug } from '@/app/shared/lib/providers/providers'
import { useCreateProduct } from '@/hooks/use-products'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { createProductInputSchema } from '@/schemas/product.schema'
import { useTenantRouter } from '@/shared/hooks/useTenantRouter'

type ProductFormValues = z.input<typeof createProductInputSchema>
type Preview = { file: File; url: string }
const defaults: ProductFormValues = { title: '', description: '', price: 0, images: [], colors: [], tags: [], variants: [], inStock: true, isFeatured: false }
function slugify(value: string) { return value.trim().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-+|-+$/g, '') }

export default function NewProductPage() {
    const tenantSlug = useTenantSlug() ?? ''; const { tenantId } = useGraphood({ tenantSlug, enabled: Boolean(tenantSlug && tenantSlug !== 'sandbox') }); const router = useTenantRouter(); const mutation = useCreateProduct(tenantId ?? '')
    const [previews, setPreviews] = useState<Preview[]>([]); const [isDragging, setIsDragging] = useState(false); const [uploadError, setUploadError] = useState<string | null>(null)
    const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<ProductFormValues>({ resolver: zodResolver(createProductInputSchema), defaultValues: defaults })
    useEffect(() => () => previews.forEach((preview) => URL.revokeObjectURL(preview.url)), [previews])
    const addFiles = (files: FileList | File[]) => {
        const valid = Array.from(files).filter((file) => file.type.startsWith('image/'))
        const added = valid.map((file) => ({ file, url: URL.createObjectURL(file) }))
        setPreviews((current) => {
            const updated = [...current, ...added]
            setValue('images', updated.map((preview) => preview.url), { shouldValidate: true, shouldDirty: true })
            return updated
        })
        setUploadError(null)
    }
    const removePreview = (index: number) => {
        setPreviews((current) => {
            const updated = current.filter((_, itemIndex) => itemIndex !== index)
            setValue('images', updated.map((preview) => preview.url), { shouldValidate: true, shouldDirty: true })
            return updated
        })
    }
    const onSubmit = async (data: ProductFormValues) => { if (!tenantId) return; try { const supabase = createSupabaseBrowserClient(); const images = await Promise.all(previews.map(async ({ file }) => { const path = `${tenantId}/${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`; const uploaded = await supabase.storage.from('product-images').upload(path, file, { upsert: false, contentType: file.type }); if (uploaded.error) throw new Error(uploaded.error.message); return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl })); if (!images.length) { setUploadError('أضف صورة واحدة على الأقل'); return } const payload = { title: data.title.trim(), description: data.description.trim(), price: Number(data.price), images, ...(data.compareAtPrice == null || Number.isNaN(Number(data.compareAtPrice)) ? {} : { compareAtPrice: Number(data.compareAtPrice) }), ...(data.categoryId ? { categoryId: data.categoryId } : {}), colors: data.colors ?? [], tags: data.tags ?? [], variants: data.variants ?? [], inStock: data.inStock ?? true, isFeatured: data.isFeatured ?? false }; mutation.mutate(payload, { onSuccess: (result) => { if (result.success) router.push(`/products/${result.data.id}`) } }) } catch (error) { setUploadError(error instanceof Error ? error.message : 'تعذر رفع الصور') } }
    return <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6" dir="rtl"><div className="mx-auto max-w-3xl"><div className="mb-6"><p className="text-sm font-medium text-primary">المنتجات</p><h1 className="mt-1 text-2xl font-bold text-gray-950">إضافة منتج جديد</h1><p className="mt-2 text-sm text-gray-500">أدخل تفاصيل المنتج وأضف صوره قبل نشره في متجرك.</p></div><form onSubmit={handleSubmit(onSubmit)} className="space-y-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8"><section className="space-y-4"><h2 className="text-base font-semibold text-gray-900">معلومات المنتج</h2><label className="block text-sm font-medium text-gray-700">اسم المنتج<input {...register('title')} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />{errors.title && <span className="mt-1 block text-xs text-red-600">{errors.title.message}</span>}</label><label className="block text-sm font-medium text-gray-700">الوصف<textarea {...register('description')} className="mt-2 min-h-32 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />{errors.description && <span className="mt-1 block text-xs text-red-600">{errors.description.message}</span>}</label><label className="block text-sm font-medium text-gray-700">السعر (ج.م)<input type="number" step="0.01" {...register('price', { valueAsNumber: true })} className="mt-2 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />{errors.price && <span className="mt-1 block text-xs text-red-600">{errors.price.message}</span>}</label></section><section className="space-y-3"><h2 className="text-base font-semibold text-gray-900">صور المنتج</h2><label onDragOver={(event) => { event.preventDefault(); setIsDragging(true) }} onDragLeave={() => setIsDragging(false)} onDrop={(event) => { event.preventDefault(); setIsDragging(false); addFiles(event.dataTransfer.files) }} className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-5 py-10 text-center ${isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-gray-400'}`}><input type="file" accept="image/*" multiple className="sr-only" onChange={(event) => event.target.files && addFiles(event.target.files)} /><UploadCloud className="h-8 w-8 text-gray-400" /><span className="mt-3 text-sm font-semibold text-gray-800">اسحب الصور هنا أو اختر ملفات</span><span className="mt-1 text-xs text-gray-500">يمكنك اختيار عدة صور دفعة واحدة</span></label>{previews.length > 0 && <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{previews.map((preview, index) => <div key={`${preview.url}-${index}`} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200"><img src={preview.url} alt="" className="h-full w-full object-cover" /><button type="button" onClick={() => removePreview(index)} aria-label="حذف الصورة" className="absolute left-2 top-2 rounded-md bg-white/90 p-1.5 text-gray-700 opacity-0 shadow group-hover:opacity-100"><Trash2 className="h-4 w-4" /></button></div>)}</div>}{uploadError && <p className="text-sm text-red-600">{uploadError}</p>}{errors.images && <p className="text-sm text-red-600">{errors.images.message}</p>}</section><div className="flex flex-wrap gap-4 border-t border-gray-100 pt-5"><label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" {...register('inStock')} className="h-4 w-4" />متوفر في المخزون</label><label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" {...register('isFeatured')} className="h-4 w-4" />منتج مميز</label></div><div className="flex justify-start gap-3"><button type="button" onClick={() => router.push('/products')} className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700">إلغاء</button><button type="submit" disabled={mutation.isPending || !tenantId || previews.length === 0} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50">{mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}حفظ المنتج</button></div></form></div></main>
}
