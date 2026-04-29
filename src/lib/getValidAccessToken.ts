/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { getNewAccessToken, logOut } from '@/services/auth';
import { jwtDecode } from 'jwt-decode';
import { cookies } from 'next/headers';

// isTokenExpired
export const isTokenExpired = async (token: string): Promise<boolean> => {
  if (!token) return true;

  try {
    const decoded: { exp: number } = await jwtDecode(token);

    return decoded.exp * 1000 < Date.now();
  } catch (err: any) {
    console.error(err);
    return true;
  }
};

// getValidAccessTokenForServerActions
export const getValidAccessTokenForServerActions = async (): Promise<
  string | void
> => {
  const cookieStore = await cookies();

  let accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken || (await isTokenExpired(accessToken))) {
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      await logOut();
      return;
    }

    const { data } = await getNewAccessToken(refreshToken);

    accessToken = data?.accessToken;

    if (!data?.accessToken || !accessToken) {
      await logOut();
      return;
    }

    cookieStore.set('accessToken', accessToken);
  }

  return accessToken;
};

// getValidAccessTokenForServerHandlerGet
let cachedAccessToken: string | null = null; // for not getting new token again and again
let tokenExpiry: number | null = null; // for not getting new token again and again
export const getValidAccessTokenForServerHandlerGet = async (
  clientCompCall = false
): Promise<string | null> => {
  const now = Date.now();

  // ✅ Step 1: if cached token is still valid
  if (cachedAccessToken && tokenExpiry && now < tokenExpiry) {
    return cachedAccessToken;
  }

  // ✅ Step 2: get refreshToken from cookies
  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;

  if (!accessToken) {
    return null; // 🚫 user not logged in
  }

  if (accessToken && (await isTokenExpired(accessToken))) {
    const refreshToken = cookieStore.get('refreshToken')!.value;

    // ✅ Step 3: get new access token from server
    const { data } = await getNewAccessToken(refreshToken);

    if (!data?.accessToken) {
      return null; // 🚫 refresh failed
    }

    const newAccessToken: string = data?.accessToken;

    // ✅ Step 4: decode expiry from JWT payload
    const payload: { exp: number } = jwtDecode(newAccessToken);
    tokenExpiry = payload.exp * 1000; // convert sec → ms

    // ✅ Step 5: save in cookie if clientCall = true
    if (clientCompCall) {
      (await cookies()).set('accessToken', newAccessToken);
    }

    cachedAccessToken = newAccessToken;

    return cachedAccessToken;
  }

  return accessToken;
};
