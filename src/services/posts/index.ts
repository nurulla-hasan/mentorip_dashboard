/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { serverFetch } from "@/lib/fetcher";
import { updateTag } from "next/cache";
import { FieldValues } from "react-hook-form";

const POST_LIST_TAG = "POST-LIST";

type ActionResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages?: number;
    totalPage?: number;
  };
};

async function revalidateWebsitePosts() {
  const websiteUrl = process.env.WEBSITE_URL;
  const secret = process.env.REVALIDATE_SECRET;

  if (!websiteUrl || !secret) {
    console.warn(
      "Website revalidate skipped: WEBSITE_URL or REVALIDATE_SECRET is missing"
    );
    return;
  }

  try {
    const res = await fetch(`${websiteUrl}/api/revalidate`, {
      method: "POST",
      headers: {
        "x-revalidate-secret": secret,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Website revalidate failed:", {
        status: res.status,
        error: errorText,
      });
    }
  } catch (error) {
    console.error("Website revalidate request failed:", error);
  }
}

async function refreshPostCaches() {
  updateTag(POST_LIST_TAG);
  await revalidateWebsitePosts();
}

// GET ALL POSTS
export const getAllPosts = async (
  query: Record<string, string | string[] | undefined> = {}
): Promise<ActionResponse> => {
  try {
    return await serverFetch<any>(
      `/post/admin/all${buildQueryString(query)}`,
      {
        revalidate: 0,
        tags: [POST_LIST_TAG],
      }
    );
  } catch {
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  }
};

// GET POST BY SLUG (published only)
export const getPostBySlug = async (slug: string): Promise<ActionResponse> => {
  try {
    return await serverFetch<any>(`/post/${slug}`, {
      revalidate: 0,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to load post";

    return { success: false, message };
  }
};

// CREATE POST (admin/superadmin) [multipart/form-data]
export const createPost = async (
  data: FieldValues
): Promise<ActionResponse> => {
  try {
    const result = await serverFetch<any>(`/post?v=${Date.now()}`, {
      method: "POST",
      body: data,
      updateTag: POST_LIST_TAG,
    });

    if (result?.success) {
      await refreshPostCaches();
    }

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
): Promise<ActionResponse> => {
  try {
    const result = await serverFetch<any>(`/post/${id}?v=${Date.now()}`, {
      method: "PATCH",
      body: data,
      updateTag: POST_LIST_TAG,
    });

    if (result?.success) {
      await refreshPostCaches();
    }

    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update post";

    return { success: false, message };
  }
};

// DELETE POST (admin/superadmin)
export const deletePost = async (id: string): Promise<ActionResponse> => {
  try {
    const result = await serverFetch<any>(`/post/${id}?v=${Date.now()}`, {
      method: "DELETE",
      updateTag: POST_LIST_TAG,
    });

    if (result?.success) {
      await refreshPostCaches();
    }

    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete post";

    return { success: false, message };
  }
};