"use client";
import { useQuery } from "@tanstack/react-query";
import { listOrdersAction } from "@/actions/order.action";
export function useOrders(tenantId: string) { return useQuery({ queryKey: ["orders", tenantId], queryFn: listOrdersAction }); }
