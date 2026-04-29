/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { serverFetch } from "@/lib/fetcher";
import { updateTag } from "next/cache";
import { FieldValues } from "react-hook-form";

/**
 * RETRIEVE PAGE CONTENT BY TYPE
 * Common types: home, terms-and-conditions, privacy-policy, about-us, etc.
 */
export const getPageByType = async (type: string) => {
  try {
    return await serverFetch<any>(`/page/retrieve/${type}`, {
      revalidate: 3600, // Pages don't change often, so 1 hour cache is fine
      tags: [`PAGE-${type.toUpperCase()}`],
    });
  } catch {
    return {
      success: false,
      data: null,
    };
  }
};

/**
 * CREATE OR UPDATE PAGE CONTENT
 * payload: { type: string, content: object }
 */
export const upsertPage = async (data: FieldValues) => {
  try {
    const result = await serverFetch<any>(`/page/create-or-update`, {
      method: "PUT",
      body: data,
    });

    if (result?.success && data.type) {
      updateTag(`PAGE-${data.type.toUpperCase()}`);
    }
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update page content";
    return { success: false, message };
  }
};
