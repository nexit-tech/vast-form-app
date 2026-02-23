"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateRequestStatus(id: string, newStatus: "approved" | "rejected" | "pending") {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const userRole = user.user_metadata?.role || "admin";
  if (userRole === "viewer") {
    throw new Error("Forbidden: Viewers cannot update status");
  }

  const updateData: { status: string; approved_at?: string | null } = { status: newStatus };

  if (newStatus === "approved") {
    updateData.approved_at = new Date().toISOString();
  } else {
    updateData.approved_at = null;
  }

  const { error } = await supabase
    .from("access_requests")
    .update(updateData)
    .eq("id", id);

  if (error) {
    console.error("Error updating status:", error);
    throw new Error("Failed to update status");
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteRequest(id: string) {
  const supabase = createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error("Unauthorized");
  }

  const userRole = user.user_metadata?.role || "admin";
  if (userRole === "viewer") {
    throw new Error("Forbidden: Viewers cannot delete requests");
  }

  const { error } = await supabase
    .from("access_requests")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Error deleting request:", error);
    throw new Error("Failed to delete request");
  }

  revalidatePath("/dashboard");
  return { success: true };
}