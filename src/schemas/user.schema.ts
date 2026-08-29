import { z } from 'zod'

// 1. Roles & Status Schemas
export const userRoleSchema = z.enum(['customer', 'assistant', 'admin'])
export const accountStatusSchema = z.enum(['active', 'suspended', 'pending'])

// 2. Base Validation Schemas
export const emailSchema = z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Invalid email address')

export const passwordSchema = z
    .string()
    .min(6, 'Password must be at least 6 characters')

export const phoneSchema = z
    .string()
    .trim()
    .regex(/^01[0125][0-9]{8}$/, 'Invalid Egyptian phone number')

// 3. Complete Profile Schema (DB Model / Full User Data)
export const userProfileSchema = z.object({
    id: z.string().uuid('Invalid user ID'), // Foreign Key to auth.users.id
    tenant_id: z.string().uuid('Invalid Tenant ID'),
    email: emailSchema,
    fullName: z.string().trim().min(3, 'Full name must be at least 3 characters'),
    phone: phoneSchema.nullable().optional(),
    avatarUrl: z.string().url('Invalid URL').nullable().optional(),
    role: userRoleSchema.default('customer'),
    status: accountStatusSchema.default('active'),
    isEmailVerified: z.boolean().default(false),
    createdAt: z.string().datetime().or(z.date()),
    updatedAt: z.coerce.date(),
})

// 4. Action Schemas
export const createProfileSchema = userProfileSchema.pick({
    id: true,
    email: true,
    fullName: true,
    phone: true,
    avatarUrl: true,
    role: true,
})

export const updateProfileSchema = z.object({
    fullName: z
        .string()
        .trim()
        .min(3, 'Full name must be at least 3 characters'),
    phone: phoneSchema.optional().or(z.literal('')),
    avatarUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
})

export const changePasswordSchema = z
    .object({
        currentPassword: passwordSchema,
        newPassword: passwordSchema,
        confirmNewPassword: z.string().min(1, 'Please confirm your new password'),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
        message: 'New passwords do not match',
        path: ['confirmNewPassword'],
    })
    .refine((data) => data.currentPassword !== data.newPassword, {
        message: 'New password must be different from current password',
        path: ['newPassword'],
    })

export const addressSchema = z.object({
    id: z.string().uuid().optional(),
    userId: z.string().uuid('Invalid user ID'), // Foreign key referencing profile.id
    title: z.string().min(1, 'Address label is required (e.g. Home, Office)'),
    fullName: z.string().min(3, 'Recipient name is required'),
    phone: phoneSchema,
    governorate: z.string().min(2, 'Governorate is required'),
    city: z.string().min(2, 'City/Area is required'),
    streetAddress: z.string().min(5, 'Detailed street address is required'),
    buildingNo: z.string().optional(),
    floorNo: z.string().optional(),
    apartmentNo: z.string().optional(),
    nearestLandmark: z.string().optional(),
    isDefault: z.boolean().default(false),
})

// Use this for Client-Side Forms
export const createAddressInputSchema = addressSchema.omit({
    id: true,
    userId: true
})


// Exported Types
export type UserRole = z.infer<typeof userRoleSchema>
export type AccountStatus = z.infer<typeof accountStatusSchema>
export type UserProfile = z.infer<typeof userProfileSchema>
export type CreateProfileInput = z.infer<typeof createProfileSchema>
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type CreateAddressInput = z.infer<typeof createAddressInputSchema>
