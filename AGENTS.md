<!-- BEGIN:nextjs-agent-rules -->
# Agent Instructions
IMPORTANT: Read and follow all guidelines in this document before generating or modifying code in this repository.

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Graphood Market Agent Guide

## Project shape

This is a private Next.js 16 App Router storefront for Graphood's multi-tenant
platform. TypeScript is strict, the `@/*` alias maps to `src/*`, and Tailwind
CSS v4 is loaded from `src/app/globals.css`. The root layout resolves the
tenant, prefetches Graphood data, hydrates React Query, and wraps the route UI
in `Providers`.

Important directories:

- `src/app`: App Router layouts and pages. Route groups `(auth)`, `(main)`, and
  `(dashboard)` do not appear in URLs. `_components` and `features/_components`
  contain UI components; `src/app/shared` contains Graphood integration and
  providers.
- `src/hooks`: client React Query hooks for actions and Graphood data.
- `src/actions`: `"use server"` functions; the application server boundary.
- `src/services`: server-only Supabase/domain operations.
- `src/schemas`: Zod input and domain schemas; `src/types/database.types.ts`
  supplies the Supabase TypeScript shape.
- `src/lib`: Supabase clients, tenant auth/session helpers, action results,
  query keys, and cart catalog utilities.
- `src/shared`: tenant-aware links/router helpers.
- `supabase/migrations`: database schema, triggers, RLS policies, and the
  checkout RPC. There are no API route handlers, test files, or storage helpers
  in the current tree.

## Required architecture

Preserve this flow for application functionality:

**Client -> Hook -> Action -> Service -> Supabase**

- **Client**: Pages/components are mostly Client Components when they use
  hooks, forms, navigation, or browser state. They call hooks, render query
  state, and do not call Supabase directly. Use `TenantLink` or
  `useTenantRouter` for navigation so the tenant context survives.
- **Hook**: `src/hooks` wraps Server Actions with TanStack React Query. Queries
  define tenant-scoped keys, mutations show Sonner toasts, and successful
  mutations invalidate or optimistically update relevant keys. Graphood's
  `useGraphood` is a separate query wrapper around the public Graphood client.
- **Graphood integration exception**: tenant health, tenant, membership,
  subscription, and developer-me queries intentionally use
  `useGraphood -> graphoodClient -> external Graphood API` on the client (or
  the matching server client from the root layout/session helpers), rather than
  the commerce action/service path.
- **Action**: Public action modules begin with `"use server"`; `action-utils.ts`
  is a `server-only` helper. Parse `unknown` input with the appropriate Zod
  schema before doing work, establish `authContext()` for tenant commerce
  operations, call a service, and return a discriminated
  `{ success: true, data } | { success: false, error }` result.
  Auth actions use the shared `ActionResult`/`actionError` wrapper. Do not rely
  on a page, layout, or proxy check as the only authorization check.
- **Service**: Keep domain/database operations in `src/services`; files are
  server-only where they handle credentials or Supabase. Use `tenantClient()`
  and `unwrap()` for Supabase calls, filter by `tenant_id` and user ownership
  as appropriate, and parse returned rows with the domain schema. Convert DB
  snake_case fields to app camelCase in the service mapping functions.
- **Supabase**: Use `createSupabaseServerClient()` in server code so auth
  cookies participate in the request. Use `createSupabaseBrowserClient()` only
  for explicitly browser-side Supabase work. `createSupabaseAdminClient()` is
  server-only and uses `SUPABASE_SECRET_KEY`; it is currently used for the
  tenant-membership upsert during session resolution, not general data access.

An intentional exception is sandbox/demo mode: an empty or `sandbox` tenant
uses the static `Products` catalog and an in-memory React Query cart in
`use-store-data.ts`/`use-cart.ts`; it does not call the commerce actions.

## Representative workflows

- **Sign-in**: the login Client Component calls `useAuth().signIn` ->
  `signInAction` validates credentials and the tenant header -> `AuthService`
  calls Supabase password auth -> `resolveTenantSession` resolves the active
  Graphood tenant/role, upserts membership, and updates auth metadata -> the
  hook toasts the result and invalidates `auth.session`.
- **Product listing**: the products page uses `useGraphood` to obtain the
  tenant id -> `useProducts` calls `listProductsAction` -> `authContext`
  authenticates and resolves the tenant -> `product.service` selects and
  schema-parses tenant rows -> React Query stores them under the tenant product
  key. Sandbox listing stops at the static catalog exception above.
- **Cart mutation**: a product card calls `useStoreAddToCart` ->
  `addToCartAction` validates options, authenticates, validates the item against
  `cartCatalog`, reads the cart, and saves it through `cart.service` -> the hook
  shows a toast and invalidates the tenant cart key. Quantity changes use an
  optimistic cache update with rollback; sandbox changes stay in memory.
- **Checkout**: the checkout Client Component validates the form locally ->
  `useCreateOrder` calls `createOrderAction` -> the action authenticates,
  re-reads the cart, revalidates catalog prices/options, and calls
  `order.service.checkoutCart` -> Supabase `checkout_cart` atomically inserts
  the order/items and clears the cart -> the hook invalidates cart/order keys
  and the page navigates to the confirmation route. Action/service failures
  return the discriminated error result and are shown through Sonner.

## Tenant resolution and authentication

`src/proxy.ts` derives a slug from `tenantSlug`, the host/subdomain, or the
configured demo slug and forwards it as `x-tenant-slug`. The root layout uses
that header to resolve an active tenant through the server Graphood client.
`NEXT_PUBLIC_ROOT_DOMAIN` defaults to `localhost`; the root host maps to
`NEXT_PUBLIC_DEMO_TENANT_SLUG` or `sandbox`.

`authContext()` reads `x-tenant-slug`, calls `supabase.auth.getUser()`, and
resolves the tenant through Graphood before returning `{ tenantId, userId }`.
`resolveTenantSession()` additionally determines `TEACHER`, `ASSISTANT`, or
`STUDENT` from the Graphood tenant owner/membership data, persists an active
`tenant_memberships` row with the admin client, and can write tenant claims to
Supabase auth metadata. `requireTenantSession()` and `requireTenantRole()` are
available for stricter server checks. The dashboard layout currently contains
only a TODO and is not an authorization guard; add checks in the action/service
that owns a privileged operation.

Authentication is implemented by `AuthService` and `auth.action.ts` for
password sign-up/sign-in, Google OAuth initiation, sign-out, reset, and password
update. Sign-in requires the proxy tenant header and resolves a tenant session.
Do not conflate local profile roles (`customer`, `assistant`, `admin`) with
Graphood tenant roles (`STUDENT`, `ASSISTANT`, `TEACHER`).

## Supabase, RLS, and database rules

The migrations create tenant-scoped `profiles`, `categories`, `products`,
`coupons`, `carts`, `wishlists`, `orders`, `order_items`, and
`tenant_memberships` tables plus enum types. RLS is enabled. The base
`tenant_isolation` policies compare `tenant_id` with the `tenant_id` JWT claim;
additional self/owner policies restrict profiles, carts, wishlists, and order
reads to `auth.uid()`. Keep both the explicit service filters and RLS checks.
`src/types/database.types.ts` currently declares only a subset of these tables;
`tenantClient()` therefore uses a deliberately loose client type for the
commerce services. Preserve runtime schema parsing and explicit filters rather
than assuming the type file is a complete generated schema.

`handle_new_user` is a `security definer` trigger on `auth.users` that creates
or updates `public.profiles` from user metadata. The `checkout_cart` RPC is a
`security definer` transaction: it requires `auth.uid()`, validates a non-empty
cart, inserts an order and `order_items`, clears the user's tenant cart, and is
granted only to `authenticated`. Checkout must continue using this RPC through
`order.service.ts`; do not recreate the multi-write sequence in a client.

There is no Supabase Storage integration in the current source. Do not expose
secret keys to client code, commit `.env*` files, or use the admin client for
ordinary user queries.

## Validation, forms, and errors

Zod schemas in `src/schemas` are the input/domain contract. Client forms use
`react-hook-form` with `zodResolver` where established (notably auth); checkout
also calls `checkoutInputSchema.safeParse` before invoking its mutation. Actions
must validate again because they are directly invokable server endpoints.

Services throw on Supabase/API failures via `unwrap()` or explicit checks.
Actions translate failures to stable user-facing error strings; hooks surface
them with Sonner. Preserve the discriminated action result instead of throwing
raw errors across the client boundary. Server diagnostics use `console.warn`
or `console.error` with contextual prefixes; do not log credentials or tokens.

## State, fetching, and cache keys

TanStack React Query is configured in `src/app/shared/lib/providers/providers.tsx`
with a one-minute default `staleTime` and server dehydration/hydration. Reuse
the existing key factories (`src/lib/react-query/query-keys.ts` and
`src/app/shared/lib/graphood/query-keys.ts`) and include tenant identity in
commerce keys. Mutations generally invalidate the affected query; cart quantity
updates use optimistic changes with rollback and refetch on settle.

The server Graphood client uses `NEXT_PUBLIC_GRAPHOOD_BASE_URL` plus the
server-only `GRAPHOOD_SERVER_API_KEY`, revalidating requests for 60 seconds
unless `cache: "no-store"` is requested. The browser Graphood client uses the
public API key. Health and membership lookups intentionally use no-store in
the paths that determine session/role state.

## Routing, localization, and UI boundaries

Use App Router `page.tsx`/`layout.tsx` conventions and dynamic segments such as
`[product_id]` and `[order_id]`. There are no route handlers, middleware, or
custom API endpoints in this repository; the Next rewrite in `next.config.ts`
only proxies `/graphood-api/:path*` to the external Graphood deployment.

Tenant-aware links append `tenantSlug` to internal URLs. Preserve this behavior
when adding links or router calls. The app currently has no i18n package or
locale routing: the root document is `lang="en"`, Arabic text appears in some
dashboard/status UI, selected surfaces use `dir="rtl"`, and currency formatting
uses `ar-EG`/`EGP`. Follow the local direction and formatting of the surface
being changed; do not invent a new localization system in a feature.

## Commands and verification

- `npm run dev` starts the Next development server.
- `npm run lint` runs the flat ESLint configuration.
- `npm run build` creates a production build.
- `npm start` serves a built application.

There is no test script or test suite currently present. For a change, run the
most relevant lint/build check available and manually exercise the affected
tenant/auth flow when it crosses Supabase or Graphood boundaries.

## Naming and organization

Use kebab-case filenames for hooks/services/schemas/actions and PascalCase for
React components. Keep one domain concern per service/action file and prefer
the existing named exports and small barrel files (`schemas/index.ts` and the
Graphood services index). Use the `@/` alias for `src` imports. Do not add a
new data-access abstraction when an existing hook, action, service utility,
query-key factory, or schema already owns that concern.

## Standard task workflow

1. Locate the owning route/domain and search for an existing hook, action,
   service, schema, query key, and migration pattern.
2. Decide which layer owns the change and preserve Client -> Hook -> Action ->
   Service -> Supabase boundaries.
3. Verify tenant identity, authenticated user, role/ownership requirements,
   and RLS implications before changing data access.
4. Reuse the existing Zod, action-result, service mapping, React Query, and
   tenant-navigation conventions.
5. Run the relevant lint/build checks and inspect the final diff. Do not alter
   generated/dependency output or unrelated user changes.

## Git and AGENTS.md safety

Never reset, checkout, or discard unrelated work in a dirty tree. Keep secrets
and environment files untracked. Update this file only when a durable
architecture, security, dependency, performance, or workflow rule changes;
do not turn it into feature history. If a domain needs rules specific to a
subtree, prefer a nearer `AGENTS.md` rather than growing this root guide.
