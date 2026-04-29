"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { serverFetch } from "@/lib/fetcher";
import { updateTag } from "next/cache";
import { FieldValues } from "react-hook-form";

// GET ALL ADMINS (admin/superadmin)
export const getAllAdmins = async (
  query: Record<string, string | string[] | undefined> = {}
) => {
  try {
    return await serverFetch(`/admin${buildQueryString(query)}`, {
      revalidate: 300,
      tags: ["ADMIN-LIST"],
    });
  } catch {
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  }
};

// CREATE ADMIN (superadmin only)
export const createAdmin = async (data: FieldValues) => {
  try {
    const result = await serverFetch(`/admin`, {
      method: "POST",
      body: data,
    });

    if (result?.success) updateTag("ADMIN-LIST");
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create admin";
    return { success: false, message };
  }
};

// UPDATE ADMIN (superadmin only)
export const updateAdmin = async (
  id: string,
  data: FieldValues
) => {
  try {
    const result = await serverFetch(`/admin/${id}`, {
      method: "PATCH",
      body: data,
    });

    if (result?.success) updateTag("ADMIN-LIST");
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update admin";
    return { success: false, message };
  }
};

// DELETE ADMIN (superadmin only)
export const deleteAdmin = async (id: string) => {
  try {
    const result = await serverFetch(`/admin/${id}`, {
      method: "DELETE",
    });

    if (result?.success) updateTag("ADMIN-LIST");
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete admin";
    return { success: false, message };
  }
};
