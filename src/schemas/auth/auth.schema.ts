import { z } from "zod";

export const AuthRoleSchema = z.enum(["student", "teacher", "assistant"]);
export const SignInSchema = z.object({ email: z.email(), password: z.string().min(8) });
export const SignUpSchema = SignInSchema.extend({
    role: AuthRoleSchema,
    fullName: z.string().trim().min(2).max(100),
    tenantId: z.string().uuid('A valid tenant ID is required'),
});
export const ResetPasswordSchema = z.object({ email: z.email(), redirectTo: z.url() });
export const UpdatePasswordSchema = z.object({ password: z.string().min(8) });
export const OAuthSchema = z.object({ redirectTo: z.url(), tenantId: z.string().uuid(), tenantSlug: z.string().min(1) });

export type SignInInput = z.infer<typeof SignInSchema>;
export type SignUpInput = z.infer<typeof SignUpSchema>;
export type ResetPasswordInput = z.infer<typeof ResetPasswordSchema>;
export type OAuthInput = z.infer<typeof OAuthSchema>;
