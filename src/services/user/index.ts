"use server";

import { IDashboardResponse } from "@/types/dashboard.types";
import { buildQueryString } from "@/lib/buildQueryString";
import { serverFetch } from "@/lib/fetcher";
import { updateTag } from "next/cache";
import { FieldValues } from "react-hook-form";

// GET ALL USERS (admin/superadmin)
export const getAllUsers = async (
  query: Record<string, string | string[] | undefined> = {}
) => {
  try {
    return await serverFetch(`/user/admin-get-all${buildQueryString(query)}`, {
      revalidate: 300,
      tags: ["USER-LIST"],
    });
  } catch {
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  }
};

// GET ADMIN META DATA
export const getAdminMetaData = async (): Promise<IDashboardResponse> => {
  try {
    return await serverFetch(`/user/meta-data`, {
      revalidate: 300,
      tags: ["USER-META"],
    });
  } catch {
    return {
      success: false,
      message: "Failed to fetch dashboard data",
      data: {
        stats: {
          totalCategories: 0,
          totalPosts: 0,
          totalUsers: 0,
          totalViews: 0,
        },
        userGrowthSeries: [],
        viewGrowthSeries: [],
      },
    };
  }
};

// UPDATE USER DATA (admin/superadmin)
export const updateUserData = async (data: FieldValues) => {
  try {
    const result = await serverFetch(`/user/update-user-data`, {
      method: "PATCH",
      body: data,
    });

    if (result?.success) {
      updateTag("USER-LIST");
      updateTag("USER-META");
    }
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update user data";
    return { success: false, message };
  }
};
