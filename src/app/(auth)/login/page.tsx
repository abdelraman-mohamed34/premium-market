'use client'

import React, { useState } from 'react'
import TenantLink from '@/shared/components/TenantLink' // التعديل هنا: استبدال next/link بـ TenantLink
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { SignInSchema } from '@/schemas/auth/auth'
import { useAuth } from '@/hooks/use-auth'
import { toast } from 'sonner'

const loginSchema = SignInSchema.extend({ rememberMe: z.boolean().default(false) })
type LoginFormData = z.infer<typeof loginSchema>

function LoginPage() {
    const [showPassword, setShowPassword] = useState(false)
    const router = useRouter()
    const auth = useAuth()
    const [submitError, setSubmitError] = useState<string | null>(null)

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<z.input<typeof loginSchema>, unknown, LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            rememberMe: false,
        },
    })

    const { mutate, isPending, isError, error } = auth.signIn

    const onSubmit = (values: LoginFormData) => {
        setSubmitError(null)
        mutate(
            { email: values.email, password: values.password },
            {
                onSuccess: (result) => {
                    if (result.success) router.push('/')
                    else setSubmitError(result.error)
                },
            }
        )
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-2xl font-black uppercase tracking-tight text-gray-900">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-xs text-gray-500">
                        Please enter your details to sign in to your account.
                    </p>
                </div>

                {/* عرض خطأ الـ API */}
                {isError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded text-xs text-red-600 text-center font-medium">
                        {error?.message || submitError || 'Something went wrong. Please try again.'}
                    </div>
                )}

                <form
                    className="mt-8 space-y-5"
                    onSubmit={handleSubmit(onSubmit, () =>
                        toast.error('Please check your email and password')
                    )}
                    noValidate
                >
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

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                                Password
                            </label>
                            {/* تحديث الرابط هنا */}
                            <TenantLink
                                href="/forgot-password"
                                className="text-xs text-gray-500 hover:text-black hover:underline"
                            >
                                Forgot Password?
                            </TenantLink>
                        </div>
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

                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            type="checkbox"
                            disabled={isPending}
                            {...register('rememberMe')}
                            className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black accent-black cursor-pointer"
                        />
                        <label
                            htmlFor="remember-me"
                            className="ml-2 block text-xs text-gray-600 cursor-pointer"
                        >
                            Remember me on this device
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isPending}
                        className="w-full bg-primary text-primary-foreground py-3.5 text-xs font-bold uppercase tracking-widest rounded hover:bg-primary/90 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isPending ? (
                            <>
                                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white px-2 text-gray-400 font-semibold">
                            Or continue with
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <button
                        type="button"
                        disabled={isPending}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                            />
                        </svg>
                        Google
                    </button>

                    <button
                        type="button"
                        disabled={isPending}
                        className="flex items-center justify-center gap-2 py-2.5 px-4 border border-gray-300 rounded text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                    >
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.27c.61-.75 1.04-1.8 0.92-2.85-.9.04-2.02.6-2.66 1.34-.57.65-1.08 1.73-.94 2.76 1.02.08 2.07-.5 2.68-1.25z" />
                        </svg>
                        Apple
                    </button>
                </div>

                <p className="text-center text-xs text-gray-600">
                    Don&apos;t have an account?{' '}
                    {/* تحديث الرابط هنا */}
                    <TenantLink
                        href="/register"
                        className="font-bold text-black hover:underline uppercase"
                    >
                        Sign up
                    </TenantLink>
                </p>
            </div>
        </div>
    )
}

export default LoginPage
