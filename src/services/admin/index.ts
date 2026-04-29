/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { serverFetch } from "@/lib/fetcher";
import { FieldValues } from "react-hook-form";

// GET ALL ADMINS (admin/superadmin)
export const getAllAdmins = async (
  query: Record<string, string | string[] | undefined> = {}
) => {
  try {
    return await serverFetch<any>(`/admin${buildQueryString(query)}`, {
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
    const result = await serverFetch<any>(`/admin`, {
      method: "POST",
      body: data,
      updateTag: "ADMIN-LIST",
    });
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
    const result = await serverFetch<any>(`/admin/${id}`, {
      method: "PATCH",
      body: data,
      updateTag: "ADMIN-LIST",
    });
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
    const result = await serverFetch<any>(`/admin/${id}`, {
      method: "DELETE",
      updateTag: "ADMIN-LIST",
    });
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete admin";
    return { success: false, message };
  }
};
