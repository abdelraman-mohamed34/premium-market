"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserAction, updateUserAction } from "@/actions/user.action";
export function useUser(tenantId: string) { const qc = useQueryClient(); const query = useQuery({ queryKey: ["user", tenantId], queryFn: getUserAction }); const update = useMutation({ mutationFn: updateUserAction, onSuccess: () => qc.invalidateQueries({ queryKey: ["user", tenantId] }) }); return { ...query, update }; }
