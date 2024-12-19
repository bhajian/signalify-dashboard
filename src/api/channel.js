import useSWR, { mutate } from 'swr';
import { useMemo } from 'react';
import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create();

// Attach a request interceptor to handle authorization headers
axiosInstance.interceptors.request.use(async (config) => {
  const accessToken = localStorage.getItem('serviceToken');
  if (accessToken) {
    config.headers['Authorization'] = `Bearer ${accessToken}`;
  }
  return config;
});

// The fetcher function for SWR, which uses our Axios instance
const fetcher = (url) => axiosInstance.get(url).then((res) => res.data);

const API_BASE = `${import.meta.env.VITE_APP_API_URL}api/channel`;

export function useGetChannels() {
  const { data, isLoading, error, isValidating } = useSWR(`${API_BASE}/all`, fetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });

  const memoizedValue = useMemo(
    () => ({
      channels: data?.channels,
      channelsLoading: isLoading,
      channelsError: error,
      channelsValidating: isValidating,
      channelsEmpty: !isLoading && (!data?.channels || data.channels.length === 0)
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export async function insertChannel(newChannel) {
  // Optimistically update local cache for `${API_BASE}/all`
  mutate(
    `${API_BASE}/all`,
    (current) => {
      const updatedChannels = current?.channels
        ? [...current.channels, { ...newChannel, id: current.channels.length + 1 }]
        : [{ ...newChannel, id: 1 }];
      return { ...current, channels: updatedChannels };
    },
    false
  );

  // Update server (POST /api/channel)
  await axiosInstance.post(API_BASE, newChannel);

  // Revalidate data from the server
  mutate(`${API_BASE}/all`);
}

export async function updateChannel(channelId, updatedChannel) {
  // Optimistically update local cache
  mutate(
    `${API_BASE}/all`,
    (current) => {
      const updatedChannels = current.channels.map((channel) =>
        channel.id === channelId ? { ...channel, ...updatedChannel } : channel
      );
      return { ...current, channels: updatedChannels };
    },
    false
  );

  // Update server (PUT /api/channel/:id)
  await axiosInstance.put(`${API_BASE}/${channelId}`, updatedChannel);

  // Revalidate data
  mutate(`${API_BASE}/all`);
}

export async function deleteChannel(channelId) {
  // Optimistically update local cache
  mutate(
    `${API_BASE}/all`,
    (current) => {
      const remainingChannels = current.channels.filter((channel) => channel.id !== channelId);
      return { ...current, channels: remainingChannels };
    },
    false
  );

  // Update server (DELETE /api/channel/:id)
  await axiosInstance.delete(`${API_BASE}/${channelId}`);

  // Revalidate data
  mutate(`${API_BASE}/all`);
}
