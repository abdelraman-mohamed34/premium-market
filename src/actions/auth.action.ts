"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { actionError, type ActionResult } from "@/lib/actions/action-result";
import { OAuthSchema, ResetPasswordSchema, SignInSchema, SignUpSchema, UpdatePasswordSchema } from "@/schemas/auth/auth.schema";
import { AuthService } from "@/services/auth.service";
import { headers } from "next/headers";

async function execute<T>(operation: (service: AuthService) => Promise<T>, fallback: string): Promise<ActionResult<T>> {
    try { return { success: true, data: await operation(new AuthService(await createSupabaseServerClient())) }; }
    catch (error) { return actionError(error, fallback); }
}

export async function signUpAction(input: unknown) {
    const parsed = SignUpSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: "Invalid sign-up details" } as const;
    return execute((service) => service.signUp(parsed.data), "Unable to create account");
}
export async function signInAction(input: unknown) {
    const parsed = SignInSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: "Invalid credentials" } as const;
    const tenantSlug = (await headers()).get("x-tenant-slug") ?? "";
    if (!tenantSlug) return { success: false, error: "Tenant context is missing" } as const;
    return execute((service) => service.signIn(parsed.data, tenantSlug), "Unable to sign in");
}
export async function googleSignInAction(input: unknown) {
    const parsed = OAuthSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: "Invalid OAuth request" } as const;
    return execute((service) => service.signInWithGoogle(parsed.data), "Unable to start Google sign-in");
}
export async function signOutAction() { return execute((service) => service.signOut(), "Unable to sign out"); }
export async function resetPasswordAction(input: unknown) {
    const parsed = ResetPasswordSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: "Invalid password reset request" } as const;
    return execute((service) => service.resetPassword(parsed.data), "Unable to send password reset email");
}
export async function updatePasswordAction(input: unknown) {
    const parsed = UpdatePasswordSchema.safeParse(input);
    if (!parsed.success) return { success: false, error: "Password must be at least 8 characters" } as const;
    return execute((service) => service.updatePassword(parsed.data.password), "Unable to update password");
}
