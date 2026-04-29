/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { serverFetch } from "@/lib/fetcher";
import { FieldValues } from "react-hook-form";

// GET ALL CLIENTS
export const getAllClients = async (
  query: Record<string, string | string[] | undefined> = {},
) => {
  try {
    return await serverFetch<any>(`/client${buildQueryString(query)}`, {
      revalidate: 300,
      tags: ["CLIENT-LIST"],
    });
  } catch {
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  }
};

// CREATE CLIENT [multipart/form-data]
export const createClient = async (data: FormData | FieldValues) => {
  try {
    const result = await serverFetch<any>(`/client`, {
      method: "POST",
      body: data,
      updateTag: "CLIENT-LIST",
    });

    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to create client";
    return { success: false, message };
  }
};

// UPDATE CLIENT [multipart/form-data]
export const updateClient = async (
  id: string,
  data: FormData | FieldValues,
): Promise<any> => {
  try {
    const result = await serverFetch<any>(`/client/${id}`, {
      method: "PATCH",
      body: data,
      updateTag: "CLIENT-LIST",
    });

    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update client";
    return { success: false, message };
  }
};

// DELETE CLIENT
export const deleteClient = async (id: string): Promise<any> => {
  try {
    const result = await serverFetch<any>(`/client/${id}`, {
      method: "DELETE",
      updateTag: "CLIENT-LIST",
    });

    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to delete client";
    return { success: false, message };
  }
};

// GET CLIENTELE
export const getClientele = async () => {
  try {
    return await serverFetch<any>(`/our-clientele-comp/retrieve`, {
      revalidate: 300,
      tags: ["CLIENTELE"],
    });
  } catch {
    return {
      success: false,
      data: {},
    };
  }
};

// UPDATE CLIENTELE
export const updateClientele = async (data: FieldValues) => {
  try {
    const result = await serverFetch<any>(`/our-clientele-comp/create-or-update`, {
      method: "PUT",
      body: data,
      updateTag: "CLIENTELE",
    });

    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update clientele";
    return { success: false, message };
  }
};

// GET JURISDICTIONS
export const getJurisdictions = async () => {
  try {
    return await serverFetch<any>(`/jurisdictions-comp/retrieve`, {
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

// UPDATE JURISDICTIONS
export const updateJurisdictions = async (data: FieldValues) => {
  try {
    const result = await serverFetch<any>(`/jurisdictions-comp/create-or-update`, {
      method: "PUT",
      body: data,
      updateTag: "JURISDICTIONS-COMP",
    });

    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update jurisdictions section";
    return { success: false, message };
  }
};

// WE SERVE
export const getWeServe = async () => {
  try {
    return await serverFetch<any>(`/industries-we-serve-comp/retrieve`, {
      revalidate: 300,
      tags: ["WE-SERVE-COMP"],
    });
  } catch {
    return {
      success: false,
      data: null,
    };
  }
};

// UPDATE WE SERVE
export const updateWeServe = async (data: FieldValues) => {
  try {
    const result = await serverFetch<any>(`/industries-we-serve-comp/create-or-update`, {
      method: "PUT",
      body: data,
      updateTag: "WE-SERVE-COMP",
    });

    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to update we serve section";
    return { success: false, message };
  }
};
