"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProductAction, listProductsAction, updateProductAction } from "@/actions/product.action";
import { toast } from "sonner";
export const productKeys = { all: ["products"] as const, list: (tenantId: string) => ["products", tenantId] as const };
export function useProducts(tenantId: string, enabled = true) { return useQuery({ queryKey: productKeys.list(tenantId), queryFn: async () => { const result = await listProductsAction(); if (!result.success) throw new Error(result.error); return result.data; }, enabled }); }
export function useCreateProduct(tenantId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: createProductAction, onSuccess: (result) => { if (result.success) { toast.success("Product created successfully"); qc.invalidateQueries({ queryKey: productKeys.list(tenantId) }); } else toast.error(result.error); }, onError: (error: Error) => toast.error(error.message || "Unable to create product") }); }
export function useUpdateProduct(tenantId: string) { const qc = useQueryClient(); return useMutation({ mutationFn: ({ id, input }: { id: string; input: unknown }) => updateProductAction(id, input), onSuccess: () => qc.invalidateQueries({ queryKey: productKeys.list(tenantId) }) }); }
