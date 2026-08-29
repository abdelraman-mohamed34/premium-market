"use server";
import { updateProfileSchema } from "@/schemas/user.schema";
import { authContext } from "./action-utils";
import { getUserProfile, updateUserProfile } from "@/services/user.service";
export async function getUserAction() { try { const c = await authContext(); return { success: true as const, data: await getUserProfile(c.tenantId, c.userId) }; } catch (e) { return { success: false as const, error: e instanceof Error ? e.message : "Unable to load profile" }; } }
export async function updateUserAction(input: unknown) { const p = updateProfileSchema.safeParse(input); if (!p.success) return { success: false as const, error: "Invalid profile details" }; try { const c = await authContext(); return { success: true as const, data: await updateUserProfile(c.tenantId, c.userId, p.data) }; } catch (e) { return { success: false as const, error: e instanceof Error ? e.message : "Unable to update profile" }; } }
