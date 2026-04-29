"use server";

import { serverFetch } from "@/lib/fetcher";
import { updateTag } from "next/cache";
import { FieldValues } from "react-hook-form";

// RETRIEVE JURISDICTIONS DATA
export const getJurisdictions = async () => {
  try {
    return await serverFetch(`/jurisdictions-comp/retrieve`, {
      revalidate: 300,
      tags: ["JURISDICTIONS-COMP"],
    });
  } catch {
    return {
      success: false,
      data: null,
    };
  }
};

// UPSERT (CREATE OR UPDATE) JURISDICTIONS DATA
export const upsertJurisdictions = async (data: FieldValues) => {
  try {
    const result = await serverFetch(`/jurisdictions-comp/create-or-update`, {
      method: "PUT",
      body: data,
    });

    if (result?.success) updateTag("JURISDICTIONS-COMP");
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update jurisdictions section";
    return { success: false, message };
  }
};
