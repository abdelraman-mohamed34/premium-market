"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrderAction } from "@/actions/order.action";
import type { CheckoutInput } from "@/schemas/order.schema";
import { toast } from "sonner";
export function useCreateOrder(tenantId: string | null) { const qc = useQueryClient(); return useMutation({ mutationFn: (input: CheckoutInput) => createOrderAction(input), onSuccess: (result) => { if (result.success) { toast.success("Order placed successfully"); qc.invalidateQueries({ queryKey: ["cart", tenantId] }); qc.invalidateQueries({ queryKey: ["orders", tenantId] }); } else toast.error(result.error); }, onError: (error: Error) => toast.error(error.message || "Unable to place order") }); }
