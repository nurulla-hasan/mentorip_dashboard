/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { serverFetch } from "@/lib/fetcher";
import { updateTag } from "next/cache";
import { FieldValues } from "react-hook-form";

// GET ALL CATEGORIES
export const getAllCategories = async (
  query: Record<string, string | string[] | undefined> = {}
) => {
  try {
    return await serverFetch(`/category${buildQueryString(query)}`, {
      revalidate: 300,
      tags: ["CATEGORY-LIST"],
    });
  } catch {
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  }
};

// CREATE CATEGORY [multipart/form-data]
export const createCategory = async (data: FormData | FieldValues): Promise<any> => {
  try {
    const result = await serverFetch(`/category`, {
      method: "POST",
      body: data,
    });

    if (result?.success) updateTag("CATEGORY-LIST");
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create category";
    return { success: false, message };
  }
};

// UPDATE CATEGORY [multipart/form-data]
export const updateCategory = async (
  id: string,
  data: FormData | FieldValues
): Promise<any> => {
  try {
    const result = await serverFetch(`/category/${id}`, {
      method: "PUT",
      body: data,
    });

    if (result?.success) updateTag("CATEGORY-LIST");
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update category";
    return { success: false, message };
  }
};

// DELETE CATEGORY
export const deleteCategory = async (id: string): Promise<any> => {
  try {
    const result = await serverFetch(`/category/${id}`, {
      method: "DELETE",
    });

    if (result?.success) updateTag("CATEGORY-LIST");
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete category";
    return { success: false, message };
  }
};
