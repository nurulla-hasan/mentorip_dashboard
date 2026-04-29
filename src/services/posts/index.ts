/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { serverFetch } from "@/lib/fetcher";
import { updateTag } from "next/cache";
import { FieldValues } from "react-hook-form";

// GET ALL POSTS
export const getAllPosts = async (
  query: Record<string, string | string[] | undefined> = {}
) => {
  try {
    return await serverFetch(`/post/admin/all${buildQueryString(query)}`, { 
      revalidate: 300,
      tags: ["POST-LIST"],
    });
  } catch {
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  }
};

// GET POST BY SLUG (published only)
export const getPostBySlug = async (slug: string): Promise<any> => {
  try {
    return await serverFetch(`/post/${slug}`, {});
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to load post";
    return { success: false, message };
  }
};

// CREATE POST (admin/superadmin) [multipart/form-data]
export const createPost = async (data: FieldValues): Promise<any> => {
  try {
    const result = await serverFetch(`/post`, {
      method: "POST",
      body: data,
    });

    if (result?.success) updateTag("POST-LIST");
    return result;
  } catch (error: unknown) {
    console.error(error);
    const message =
      error instanceof Error ? error.message : "Failed to create post";
    return { success: false, message };
  }
};
// UPDATE POST (admin/superadmin) [multipart/form-data]
export const updatePost = async (
  id: string,
  data: FieldValues
): Promise<any> => {
  try {
    const result = await serverFetch(`/post/${id}`, {
      method: "PATCH",
      body: data,
    });

    if (result?.success) updateTag("POST-LIST");
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update post";
    return { success: false, message };
  }
};

// DELETE POST (admin/superadmin)
export const deletePost = async (id: string): Promise<any> => {
  try {
    const result = await serverFetch(`/post/${id}`, {
      method: "DELETE",
    });

    if (result?.success) updateTag("POST-LIST");
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete post";
    return { success: false, message };
  }
};
