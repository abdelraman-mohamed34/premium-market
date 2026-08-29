'use client';

import Hero from "./_components/hero";
import ViewProducts from "./_components/view-products";
import { useGraphood } from "./shared/lib/graphood/hooks/use-graphood";
import { useTenantSlug } from "./shared/lib/providers/providers";

export default function Home() {
  const rawTenantSlug = useTenantSlug();
  const tenantSlug = rawTenantSlug ?? "";
  const { tenant, me, subscription, memberships, health, isLoading } = useGraphood({ tenantSlug: tenantSlug });
  console.log(tenant)

  return (
    <main className="">
      <Hero />
      <ViewProducts />
    </main>
  );
}