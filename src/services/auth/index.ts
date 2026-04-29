/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { cookies } from 'next/headers';
import { jwtDecode } from 'jwt-decode';
import { FieldValues } from 'react-hook-form';
import { serverFetch } from '@/lib/fetcher';

// signInUser (With Role Check)
export const signInUser = async (userData: FieldValues): Promise<any> => {
  try {
    const result = await serverFetch<any>('/user/signin', {
      method: 'POST',
      body: userData,
      isPublic: true,
    });

    if (result?.success) {
      const accessToken = result?.data?.accessToken;
      const decodedData: any = jwtDecode(accessToken);

      // ROLE CHECK
      if (decodedData?.role !== 'ADMIN' && decodedData?.role !== 'SUPER_ADMIN') {
        return {
          success: false,
          message: "You are not authorized to access this panel!",
        };
      }

      const cookieStore = await cookies();
      cookieStore.set('accessToken', accessToken);
      cookieStore.set('refreshToken', result?.data?.refreshToken);
    }

    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Login failed" };
  }
};

// updateProfilePhoto
export const updateProfilePhoto = async (data: FormData): Promise<any> => {
  try {
    const result = await serverFetch<any>('/user/update-profile-photo', {
      method: 'PUT',
      body: data, // FormData Handle by serverFetch
    });

    if (result?.success) {
      (await cookies()).set('accessToken', result?.data?.accessToken);
    }

    return result;
  } catch (error: any) {
    return { success: false, message: error?.message };
  }
};

// changePassword
export const changePassword = async (data: FieldValues): Promise<any> => {
  try {
    const result = await serverFetch<any>('/user/change-password', {
      method: 'PATCH',
      body: data,
    });

    if (result?.success) {
      const cookieStore = await cookies();
      cookieStore.set('accessToken', result?.data?.accessToken);
      cookieStore.set('refreshToken', result?.data?.refreshToken);
    }

    return result;
  } catch (error: any) {
    return { success: false, message: error?.message };
  }
};

// forgotPassword
export const forgotPassword = async (email: string): Promise<any> => {
  try {
    const result = await serverFetch<any>('/user/forgot-password', {
      method: 'POST',
      body: { email },
      isPublic: true,
    });

    if (result?.success) {
      (await cookies()).set('forgotPassToken', result?.data?.token);
    }

    return result;
  } catch (error: any) {
    return { success: false, message: error?.message };
  }
};

// sendForgotPasswordOtpAgain
export const sendForgotPasswordOtpAgain = async (): Promise<any> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('forgotPassToken')?.value;

  try {
    const result = await serverFetch<any>('/user/send-forgot-password-otp-again', {
      method: 'POST',
      body: { token },
      isPublic: true,
    });

    return result;
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to resend OTP" };
  }
};

// verifyOtpForForgotPassword
export const verifyOtpForForgotPassword = async (otp: string): Promise<any> => {
  const cookieStore = await cookies();
  const token = cookieStore.get('forgotPassToken')?.value;

  try {
    const result = await serverFetch<any>('/user/verify-forgot-password-otp', {
      method: 'POST',
      body: { token, otp },
      isPublic: true,
    });

    if (result?.success) {
      cookieStore.set('resetPasswordToken', result?.data?.resetPasswordToken);
    }

    return result;
  } catch (error: any) {
    return { success: false, message: error?.message };
  }
};

// setNewPassword
export const setNewPassword = async (newPassword: string): Promise<any> => {
  const cookieStore = await cookies();
  const resetPasswordToken = cookieStore.get('resetPasswordToken')?.value;

  try {
    const result = await serverFetch<any>('/user/reset-password', {
      method: 'POST',
      body: { resetPasswordToken, newPassword },
      isPublic: true,
    });

    if (result?.success) {
      cookieStore.delete('forgotPassToken');
      cookieStore.delete('resetPasswordToken');
    }

    return result;
  } catch (error: any) {
    return { success: false, message: error?.message };
  }
};

// fetchMyProfile
export const fetchMyProfile = async (): Promise<any> => {
  try {
    return await serverFetch<any>('/user/profile', { method: 'GET' });
  } catch (error: any) {
    return { success: false, message: error?.message };
  }
};

// getNewAccessToken
export const getNewAccessToken = async (refreshToken: string): Promise<any> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/user/access-token`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${refreshToken}`,
        },
      }
    );

    return await res.json();
  } catch (error: any) {
    return { success: false, message: error?.message || "Failed to get new token" };
  }
};

// updateUserData
export const updateUserData = async (userData: FieldValues): Promise<any> => {
  try {
    const result = await serverFetch<any>('/user/update-user-data', {
      method: 'PATCH',
      body: userData,
    });

    if (result?.success) {
      (await cookies()).set('accessToken', result?.data?.accessToken);
    }

    return result;
  } catch (error: any) {
    return { success: false, message: error?.message };
  }
};

// getCurrentUser
export const getCurrentUser = async (): Promise<any> => {
  const accessToken = (await cookies()).get('accessToken')?.value;
  if (accessToken) {
    return jwtDecode(accessToken);
  }
  return null;
};

// logOut
export const logOut = async (): Promise<void> => {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  allCookies.forEach(cookie => {
    cookieStore.delete(cookie.name);
  });
};