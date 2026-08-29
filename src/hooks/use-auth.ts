"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { googleSignInAction, resetPasswordAction, signInAction, signOutAction, signUpAction, updatePasswordAction } from "@/actions/auth.action";
import { queryKeys } from "@/lib/react-query/query-keys";
import { toast } from "sonner";

export function useAuth() {
    const client = useQueryClient();
    const invalidate = () => client.invalidateQueries({ queryKey: queryKeys.auth.session });
    const notify = (successMessage: string, failureMessage: string) => ({
        onSuccess: (result: { success: boolean; error?: string }) => {
            if (result.success) toast.success(successMessage);
            else toast.error(result.error || failureMessage);
            if (result.success) invalidate();
        },
        onError: (error: Error) => toast.error(error.message || failureMessage),
    });
    return {
        signIn: useMutation({ mutationFn: signInAction, ...notify("Signed in successfully", "Unable to sign in") }),
        signUp: useMutation({ mutationFn: signUpAction, ...notify("Account created successfully", "Unable to create account") }),
        signInWithGoogle: useMutation({ mutationFn: googleSignInAction }),
        signOut: useMutation({ mutationFn: signOutAction, ...notify("Signed out successfully", "Unable to sign out") }),
        resetPassword: useMutation({ mutationFn: resetPasswordAction }),
        updatePassword: useMutation({ mutationFn: updatePasswordAction, onSuccess: invalidate }),
    };
}
