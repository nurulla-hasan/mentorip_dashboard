"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { serverFetch } from "@/lib/fetcher";
import { updateTag } from "next/cache";

// GET ALL GALLERY IMAGES
export const getAllGalleryImages = async (
  query: Record<string, string | string[] | undefined> = {}
) => {
  try {
    return await serverFetch(`/gallery/retrieve${buildQueryString(query)}`, {
      revalidate: 300,
      tags: ["GALLERY-LIST"],
    });
  } catch {
    return {
      success: false,
      data: [],
    };
  }
};

// CREATE GALLERY IMAGE
export const createGalleryImage = async (data: FormData) => {
  try {
    const result = await serverFetch(`/gallery/create`, {
      method: "POST",
      body: data,
    });

    if (result?.success) updateTag("GALLERY-LIST");
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to upload image";
    return { success: false, message };
  }
};

// DELETE GALLERY IMAGE
export const deleteGalleryImage = async (id: string) => {
  try {
    const result = await serverFetch(`/gallery/${id}`, {
      method: "DELETE",
    });

    if (result?.success) updateTag("GALLERY-LIST");
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete image";
    return { success: false, message };
  }
};
