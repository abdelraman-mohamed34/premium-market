"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ComponentProps, Suspense } from "react";
import { withTenantSlug } from "@/shared/navigation/tenant-url";

function TenantLinkContent({ href, ...props }: ComponentProps<typeof Link>) {
    const searchParams = useSearchParams();
    const tenantSlug = searchParams.get("tenantSlug");

    return <Link href={withTenantSlug(href, tenantSlug)} {...props} />;
}

export function TenantLink(props: ComponentProps<typeof Link>) {
    return (
        <Suspense fallback={<Link {...props} />}>
            <TenantLinkContent {...props} />
        </Suspense>
    );
}

export default TenantLink;