import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import type { OAuthInput, ResetPasswordInput, SignInInput, SignUpInput } from "@/schemas/auth/auth";
import { resolveTenantSession } from "@/lib/auth/tenant-session";

export class AuthService {
    constructor(private readonly supabase: SupabaseClient<Database>) { }

    async signUp(input: SignUpInput) {
        const { data, error } = await this.supabase.auth.signUp({
            email: input.email,
            password: input.password,
            options: {
                data: {
                    full_name: input.fullName,
                    role: input.role,
                    tenant_id: input.tenantId,
                }
            },
        });

        if (error) {
            console.error("SUPABASE SIGNUP ERROR:", error);
            throw new Error(error.message);
        }

        return { userId: data.user?.id ?? null, requiresEmailConfirmation: !data.session };
    }

    async signIn(input: SignInInput, tenantSlug: string) {
        const { data, error } = await this.supabase.auth.signInWithPassword(input);
        if (error) throw new Error("Invalid email or password");
        const tenantSession = await resolveTenantSession(tenantSlug, { user: data.user, updateAuthMetadata: true });
        if (!tenantSession) throw new Error("Unable to resolve the tenant session");
        return { userId: data.user.id, tenantSession };
    }

    async signInWithGoogle(input: OAuthInput) {
        const callback = new URL(input.redirectTo);
        callback.searchParams.set("tenant_id", input.tenantId);
        callback.searchParams.set("tenant_slug", input.tenantSlug);
        const { data, error } = await this.supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: callback.toString() } });
        if (error) throw new Error("Google sign-in failed");
        return { url: data.url };
    }

    async signOut() {
        const { error } = await this.supabase.auth.signOut();
        if (error) throw new Error("Sign out failed");
        return null;
    }

    async resetPassword(input: ResetPasswordInput) {
        const { error } = await this.supabase.auth.resetPasswordForEmail(input.email, { redirectTo: input.redirectTo });
        if (error) throw new Error("Password reset could not be started");
        return null;
    }

    async updatePassword(password: string) {
        const { error } = await this.supabase.auth.updateUser({ password });
        if (error) throw new Error("Password update failed");
        return null;
    }
}
