import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
    const url = request.nextUrl;

    if (
        url.pathname.startsWith("/_next") ||
        url.pathname.includes(".")
    ) {
        return NextResponse.next();
    }

    const hostHeader =
        request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
        request.headers.get("host") ||
        "";

    const hostname = hostHeader.replace(/^\[|\](:\d+)?$/g, "").split(":")[0].toLowerCase();
    const rootDomain = (process.env.NEXT_PUBLIC_ROOT_DOMAIN || "localhost")
        .replace(/^https?:\/\//, "")
        .split(":")[0]
        .toLowerCase();

    const queryTenantSlug = url.searchParams.get("tenantSlug");
    let tenantSlug = queryTenantSlug || "";

    if (!tenantSlug) {
        if (hostname === rootDomain || hostname === "127.0.0.1" || hostname === "::1" || hostname === "localhost") {
            tenantSlug = process.env.NEXT_PUBLIC_DEMO_TENANT_SLUG || "sandbox";
        } else if (hostname.endsWith(`.${rootDomain}`)) {
            tenantSlug = hostname.slice(0, -(rootDomain.length + 1));
        } else {
            tenantSlug = hostname;
        }
    }

    const requestHeaders = new Headers(request.headers);
    if (tenantSlug) {
        requestHeaders.set("X-tenant-slug", tenantSlug.toLowerCase().trim());
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico).*)",
    ],
};