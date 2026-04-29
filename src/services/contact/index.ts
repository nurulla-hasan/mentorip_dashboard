/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { buildQueryString } from "@/lib/buildQueryString";
import { serverFetch } from "@/lib/fetcher";
import { FieldValues } from "react-hook-form";

// GET ALL CONTACT MESSAGES (admin/superadmin)
export const getAllContacts = async (
  query: Record<string, string | string[] | undefined> = {}
) => {
  try {
    return await serverFetch<any>(`/contact${buildQueryString(query)}`, {
      revalidate: 300,
      tags: ["CONTACT-LIST"],
    });
  } catch {
    return {
      success: false,
      data: [],
      meta: { total: 0, page: 1, limit: 10, totalPages: 0 },
    };
  }
};

// SEND CONTACT MESSAGE (public)
export const sendContactEmail = async (data: FieldValues) => {
  try {
    const result = await serverFetch<any>(`/contact/send-email`, {
      method: "POST",
      body: data,
      updateTag: "CONTACT-LIST",
    });
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to send message";
    return { success: false, message };
  } 
};

// RETRIEVE OFFICE CARDS DATA
export const getOfficeCards = async () => {
  try {
    return await serverFetch<any>(`/office-cards-comp/retrieve`, {
      revalidate: 300,
      tags: ["OFFICE-CARDS-COMP"],
    });
  } catch {
    return {
      success: false,
      data: null,
    };
  }
};

// UPSERT (CREATE OR UPDATE) OFFICE CARDS DATA
export const upsertOfficeCards = async (data: FieldValues) => {
  try {
    const result = await serverFetch<any>(`/office-cards-comp/create-or-update`, {
      method: "PUT",
      body: data,
      updateTag: "OFFICE-CARDS-COMP",
    });
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update office cards";
    return { success: false, message };
  }
};

// GET HOTLINE AND SOCIALS
export const getHotlineAndSocials = async () => {
  try {
    return await serverFetch<any>(`/contact-us-comp/retrieve`, {
      revalidate: 300,
      tags: ["HOTLINE-AND-SOCIALS"],
    });
  } catch {
    return {
      success: false,
      data: null,
    };
  }
};

// UPSERT (CREATE OR UPDATE) HOTLINE AND SOCIALS
export const upsertHotlineAndSocials = async (data: FieldValues) => {
  try {
    const result = await serverFetch<any>(`/contact-us-comp/create-or-update`, {
      method: "PUT",
      body: data,
      updateTag: "HOTLINE-AND-SOCIALS",
    });
    return result;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Failed to update hotline and socials";
    return { success: false, message };
  }
};