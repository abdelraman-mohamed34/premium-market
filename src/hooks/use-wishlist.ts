"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { listWishlistAction, toggleWishlistAction } from "@/actions/wishlist.action";
export function useWishlist(tenantId: string) { const qc = useQueryClient(); const query = useQuery({ queryKey: ["wishlist", tenantId], queryFn: listWishlistAction }); const toggle = useMutation({ mutationFn: toggleWishlistAction, onSuccess: () => qc.invalidateQueries({ queryKey: ["wishlist", tenantId] }) }); return { ...query, toggle }; }
