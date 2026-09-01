"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { dashboardStatsAction, listOrdersAction, listTenantOrdersAction, updateOrderStatusAction } from "@/actions/order.action";
export function useOrders(tenantId: string) { return useQuery({ queryKey: ["orders", tenantId], queryFn: listOrdersAction }); }
export function useTenantOrders(tenantId?: string | null) { return useQuery({ queryKey: ["tenant-orders", tenantId], queryFn: listTenantOrdersAction, enabled: Boolean(tenantId) }); }
export function useDashboardStats(tenantId?: string | null) { return useQuery({ queryKey: ["dashboard-stats", tenantId], queryFn: dashboardStatsAction, enabled: Boolean(tenantId) }); }
export function useUpdateOrderStatus(tenantId?: string | null) { const qc = useQueryClient(); return useMutation({ mutationFn: updateOrderStatusAction, onSuccess: (result) => { if (result.success) { toast.success("تم تحديث حالة الطلب بنجاح"); qc.invalidateQueries({ queryKey: ["tenant-orders", tenantId] }); qc.invalidateQueries({ queryKey: ["dashboard-stats", tenantId] }); } else toast.error(result.error); }, onError: (error) => toast.error(error instanceof Error ? error.message : "حدث خطأ أثناء تحديث حالة الطلب") }); }
