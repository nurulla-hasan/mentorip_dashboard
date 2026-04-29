"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { serverFetch } from "@/lib/fetcher";
import { updateTag } from "next/cache";
import { FieldValues } from "react-hook-form";

// GET ALL OUR TEAM (admin/superadmin)
export const getOurTeam = async (
  query: Record<string, string | string[] | undefined> = {}
) => {
  try {
    return await serverFetch(`/our-team-comp/retrieve${buildQueryString(query)}`, {
      revalidate: 300,
      tags: ["OUR-TEAM"],
    });
  } catch {
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  }
};

// CREATE OUR TEAM 
export const createOurTeam = async (data: FormData | FieldValues) => {
  try {
    const result = await serverFetch(`/our-team-comp/create`, {
      method: "POST",
      body: data,
    });

    if (result?.success) updateTag("OUR-TEAM");
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create our team";
    return { success: false, message };
  }
};

// UPDATE OUR TEAM (superadmin only)
export const updateOurTeam = async (
  id: string,
  data: FieldValues
) => {
  try {
    const result = await serverFetch(`/our-team-comp/update/${id}`, {
      method: "PATCH",
      body: data,
    });

    if (result?.success) updateTag("OUR-TEAM");
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update our team";
    return { success: false, message };
  }
};

// DELETE OUR TEAM (superadmin only)
export const deleteOurTeam = async (id: string) => {
  try {
    const result = await serverFetch(`/our-team-comp/delete/${id}`, {
      method: "DELETE",
    });

    if (result?.success) updateTag("OUR-TEAM");
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete our team";
    return { success: false, message };
  }
};
