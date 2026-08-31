'use client';

import {
    HydrationBoundary,
    QueryClientProvider,
    type DehydratedState,
} from '@tanstack/react-query';
import { ReactNode, useState, createContext, useContext } from 'react';
import { getQueryClient } from '../react-query/get-query-client';
import { Toaster } from 'sonner';
import { useGraphood } from '../graphood/hooks/use-graphood';

const TenantContext = createContext<string | null>(null);

interface ProvidersProps {
    children: ReactNode;
    dehydratedState: DehydratedState;
    tenantSlug?: string;
    initialPrimaryColor?: string | null;
}

const FALLBACK_PRIMARY = '#000000';
const HEX_COLOR = /^#[\da-f]{3}(?:[\da-f]{3})?$/i;

function normalizeColor(value: string | null | undefined) {
    return value && HEX_COLOR.test(value) ? value : FALLBACK_PRIMARY;
}

function foregroundFor(color: string) {
    const hex = color.length === 4
        ? color.slice(1).split('').map((part) => part + part).join('')
        : color.slice(1);
    const [r, g, b] = [0, 2, 4].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
    return (0.299 * r + 0.587 * g + 0.114 * b) > 160 ? '#000000' : '#ffffff';
}

function TenantTheme({ children, tenantSlug, initialPrimaryColor }: Pick<ProvidersProps, 'children' | 'tenantSlug' | 'initialPrimaryColor'>) {
    const { tenant } = useGraphood({ tenantSlug: tenantSlug ?? '', enabled: Boolean(tenantSlug && tenantSlug !== 'sandbox') });
    const primary = normalizeColor(tenant?.data.tenant.branding?.primaryColor ?? initialPrimaryColor);

    return (
        <TenantContext.Provider value={tenantSlug ?? ''}>
            <div style={{ '--primary': primary, '--primary-foreground': foregroundFor(primary) } as React.CSSProperties} className="contents">
                {children}
            </div>
        </TenantContext.Provider>
    );
}

export default function Providers({
    children,
    dehydratedState,
    tenantSlug = '',
    initialPrimaryColor,
}: ProvidersProps) {
    const [queryClient] = useState(getQueryClient);
    return (
        <QueryClientProvider client={queryClient}>
            <Toaster richColors position="bottom-right" />
            <HydrationBoundary state={dehydratedState}>
                <TenantTheme tenantSlug={tenantSlug} initialPrimaryColor={initialPrimaryColor}>
                    {children}
                </TenantTheme>
            </HydrationBoundary>
        </QueryClientProvider>
    );
}

export const useTenantSlug = () => {
    const context = useContext(TenantContext);
    if (context === undefined) {
        throw new Error('useTenantSlug must be used within a Providers component');
    }
    return context;
};
