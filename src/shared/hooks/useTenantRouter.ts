"use client";
import { useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { withTenantSlug } from "@/shared/navigation/tenant-url";

export function useTenantRouter() {
    const router = useRouter();
    const tenantSlug = useSearchParams().get("tenantSlug");
    const attach = useCallback((href: string) => String(withTenantSlug(href, tenantSlug)), [tenantSlug]);
    return useMemo(() => ({ ...router, push: (href: string, options?: { scroll?: boolean }) => router.push(attach(href), options), replace: (href: string, options?: { scroll?: boolean }) => router.replace(attach(href), options), prefetch: (href: string, options?: Parameters<typeof router.prefetch>[1]) => router.prefetch(attach(href), options) }), [attach, router]);
}
