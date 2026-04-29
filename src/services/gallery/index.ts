/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { serverFetch } from "@/lib/fetcher";

// GET ALL GALLERY IMAGES
export const getAllGalleryImages = async (
  query: Record<string, string | string[] | undefined> = {}
) => {
  try {
    return await serverFetch<any>(`/gallery/retrieve${buildQueryString(query)}`, {
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
    const result = await serverFetch<any>(`/gallery/create`, {
      method: "POST",
      body: data,
      updateTag: "GALLERY-LIST",
    });

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
    const result = await serverFetch<any>(`/gallery/${id}`, {
      method: "DELETE",
      updateTag: "GALLERY-LIST",
    });

    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete image";
    return { success: false, message };
  }
};
