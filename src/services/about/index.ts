"use server";

import { serverFetch } from "@/lib/fetcher";
import { updateTag } from "next/cache";
import { FieldValues } from "react-hook-form";

// RETRIEVE WHO WE ARE DATA
export const getWhoWeAre = async () => {
  try {
    return await serverFetch(`/about-who-we-are-comp/retrieve`, {
      revalidate: 300,
      tags: ["WHO-WE-ARE-COMP"],
    });
  } catch {
    return {
      success: false,
      data: null,
    };
  }
};

// UPSERT (CREATE OR UPDATE) WHO WE ARE DATA
export const upsertWhoWeAre = async (data: FieldValues) => {
  try {
    const result = await serverFetch(`/about-who-we-are-comp/create-or-update`, {
      method: "PUT",
      body: data,
    });

    if (result?.success) updateTag("WHO-WE-ARE-COMP");
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update who we are section";
    return { success: false, message };
  }
};
