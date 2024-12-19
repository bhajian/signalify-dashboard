import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import axios from 'axios';

// Create an Axios instance for authenticated requests
const axiosInstance = axios.create();

// Attach a request interceptor to handle authorization headers for authenticated requests
axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = localStorage.getItem('serviceToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// The fetcher function for SWR, which uses our authenticated Axios instance
const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const API_BASE = `${import.meta.env.VITE_APP_API_URL}api/profile`;

export function useGetProfile() {
  const { data, isLoading, error, isValidating } = useSWR(API_BASE, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      profile: data?.profile,
      profileLoading: isLoading,
      profileError: error,
      profileValidating: isValidating,
      profileEmpty: !isLoading && !data?.profile
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function insertProfile(newProfile) {
  // Insert profile without needing authorization (e.g., registration)
  // Using plain axios here to ensure no token is attached, even if present
  await axios.post(API_BASE, newProfile);
  // No mutate call here since the user may not be authenticated yet,
  // and we don't have a profile to update locally.
}

export async function updateProfile(updatedProfile) {
  // Optimistically update the cached profile
  mutate(
    API_BASE,
    (current) => {
      return { ...current, profile: { ...current.profile, ...updatedProfile } };
    },
    false
  );

  // Update server (PUT /api/profile)
  await axiosInstance.put(API_BASE, updatedProfile);

  // Revalidate data from the server
  mutate(API_BASE);
}

export async function disableProfile() {
  // Optimistically mark the profile as disabled locally
  mutate(
    API_BASE,
    (current) => {
      return { ...current, profile: { ...current.profile, disabled: true } };
    },
    false
  );

  // Update server (POST /api/profile/disable)
  await axiosInstance.post(`${API_BASE}/disable`);

  // Revalidate data from the server
  mutate(API_BASE);
}
