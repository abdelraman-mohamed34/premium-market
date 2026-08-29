'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/use-auth'
import { useTenantSlug } from '@/app/shared/lib/providers/providers'
import { toast } from 'sonner'
import { useGraphood } from '@/app/shared/lib/graphood/hooks/use-graphood'

const registerSchema = z.object({ fullName: z.string().trim().min(3, 'Name must be at least 3 characters'), email: z.email('Invalid email address'), password: z.string().min(8, 'Password must be at least 8 characters'), confirmPassword: z.string().min(1, 'Please confirm your password'), acceptTerms: z.boolean().refine(Boolean, 'You must accept the terms and conditions') }).refine((data) => data.password === data.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] })
type RegisterFormData = z.infer<typeof registerSchema>

function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const rawTenantSlug = useTenantSlug();
    const tenantSlug = rawTenantSlug ?? "";
    const { tenant } = useGraphood({ tenantSlug: tenantSlug })
    const auth = useAuth()
    const [submitError, setSubmitError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            fullName: '',
            email: '',
            password: '',
            confirmPassword: '',
            acceptTerms: false,
        },
    })

    const { mutate, isPending, isError, error } = auth.signUp

    const onSubmit = (values: RegisterFormData) => {
        setSubmitError(null)
        const tenantId = tenant?.data.tenant.id
        if (!tenantId) {
            setSubmitError('This store is not ready for registration yet.')
            toast.error('This store is not ready for registration yet.')
            return
        }
        mutate({ fullName: values.fullName, email: values.email, password: values.password, role: 'student', tenantId }, { onSuccess: (result) => { if (result.success) router.push('/login?registered=1'); else setSubmitError(result.error) } })
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8">

                {/* العنوان */}
                <div className="text-center">
                    <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">
                        Create Account
                    </h1>
                    <p className="mt-2 text-xs text-gray-500">
                        Enter your details below to create your account.
                    </p>
                </div>

                {isError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600 text-center font-medium">
                        {error?.message || submitError || 'Something went wrong. Please try again.'}
                    </div>
                )}

                <form className="mt-8 space-y-4" onSubmit={handleSubmit(onSubmit, () => toast.error('Please complete all required fields'))} noValidate>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                            Full Name
                        </label>
                        <input
                            type="text"
                            disabled={isPending}
                            placeholder="John Doe"
                            {...register('fullName')}
                            className={`w-full px-4 py-3 text-sm border rounded focus:outline-none transition-colors disabled:bg-gray-50 disabled:opacity-60 ${errors.fullName
                                ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-1 focus:ring-black focus:border-black'
                                }`}
                        />
                        {errors.fullName && (
                            <p className="mt-1 text-xs text-red-500">{errors.fullName.message}</p>
                        )}
                    </div>

                    {/* البريد الإلكتروني */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            disabled={isPending}
                            placeholder="name@example.com"
                            {...register('email')}
                            className={`w-full px-4 py-3 text-sm border rounded focus:outline-none transition-colors disabled:bg-gray-50 disabled:opacity-60 ${errors.email
                                ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-1 focus:ring-black focus:border-black'
                                }`}
                        />
                        {errors.email && (
                            <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
                        )}
                    </div>

                    {/* كلمة المرور */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                disabled={isPending}
                                placeholder="••••••••"
                                {...register('password')}
                                className={`w-full px-4 py-3 text-sm border rounded focus:outline-none transition-colors disabled:bg-gray-50 disabled:opacity-60 ${errors.password
                                    ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                                    : 'border-gray-300 focus:ring-1 focus:ring-black focus:border-black'
                                    }`}
                            />
                            <button
                                type="button"
                                disabled={isPending}
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-semibold uppercase"
                            >
                                {showPassword ? 'Hide' : 'Show'}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
                        )}
                    </div>

                    {/* تأكيد كلمة المرور */}
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-gray-700 mb-2">
                            Confirm Password
                        </label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            disabled={isPending}
                            placeholder="••••••••"
                            {...register('confirmPassword')}
                            className={`w-full px-4 py-3 text-sm border rounded focus:outline-none transition-colors disabled:bg-gray-50 disabled:opacity-60 ${errors.confirmPassword
                                ? 'border-red-500 focus:ring-1 focus:ring-red-500'
                                : 'border-gray-300 focus:ring-1 focus:ring-black focus:border-black'
                                }`}
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>
                        )}
                    </div>

                    {/* الشروط والأحكام */}
                    <div>
                        <div className="flex items-center">
                            <input
                                id="terms"
                                type="checkbox"
                                disabled={isPending}
                                {...register('acceptTerms')}
                                className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer"
                            />
                            <label htmlFor="terms" className="ml-2 block text-xs text-gray-600 cursor-pointer">
                                I agree to the{' '}
                                <Link href="/terms" className="font-bold text-black hover:underline">
                                    Terms & Conditions
                                </Link>
                            </label>
                        </div>
                        {errors.acceptTerms && (
                            <p className="mt-1 text-xs text-red-500">{errors.acceptTerms.message}</p>
                        )}
                    </div>

                    {/* زر التسجيل */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-black text-white py-3.5 text-xs font-bold uppercase tracking-widest rounded hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                    >
                        {isPending ? (
                            <>
                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Creating Account...
                            </>
                        ) : (
                            'Sign Up'
                        )}
                    </button>
                </form>

                <p className="text-center text-xs text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="font-bold text-black hover:underline uppercase">
                        Sign in
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default RegisterPage
