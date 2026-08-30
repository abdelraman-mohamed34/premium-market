import type { UrlObject } from "url";

export function withTenantSlug(
    href: string | UrlObject,
    tenantSlug: string | null
): string | UrlObject {
    if (!tenantSlug) return href;

    if (typeof href !== "string") {
        const currentQuery =
            typeof href.query === "object" && href.query !== null
                ? href.query
                : typeof href.query === "string"
                    ? new URLSearchParams(href.query)
                    : {};

        return {
            ...href,
            query: {
                ...(currentQuery instanceof URLSearchParams
                    ? Object.fromEntries(currentQuery.entries())
                    : currentQuery),
                tenantSlug,
            },
        };
    }

    if (
        href.startsWith("#") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:")
    ) {
        return href;
    }

    let cleanHref = href;

    const malformedMatch = cleanHref.match(/^([^?]*)\?tenantSlug=([^/]+)(\/.*)$/);
    if (malformedMatch) {
        const [, origin, , extraPath] = malformedMatch;
        cleanHref = `${origin}${extraPath}`;
    }

    const hashIndex = cleanHref.indexOf("#");
    const hash = hashIndex >= 0 ? cleanHref.slice(hashIndex) : "";
    const pathAndQuery = hashIndex >= 0 ? cleanHref.slice(0, hashIndex) : cleanHref;

    const queryIndex = pathAndQuery.indexOf("?");
    const pathname = queryIndex >= 0 ? pathAndQuery.slice(0, queryIndex) : pathAndQuery;
    const queryString = queryIndex >= 0 ? pathAndQuery.slice(queryIndex + 1) : "";

    const params = new URLSearchParams(queryString);
    params.set("tenantSlug", tenantSlug);

    return `${pathname}?${params.toString()}${hash}`;
}