import { z } from 'zod'

export const categorySchema = z.object({
    tenant_id: z.string().uuid('Invalid Tenant ID'),
    id: z.string().uuid().or(z.number()),
    tenantId: z.string().uuid('Invalid Tenant ID'),
    name: z.string().trim().min(2, 'Category name is required'),
    slug: z.string().trim().lowercase(),
    parentId: z.string().uuid().or(z.number()).nullable().optional(),
    description: z.string().optional(),
    image: z.string().url().optional(),
})

export type Category = z.infer<typeof categorySchema>
