import type { SWRConfiguration } from "swr";
import { apiClient } from "./api";

export const fetcher = async <T = unknown>(url: string): Promise<T> => {
  const response = await apiClient.get<T>(url);
  return response.data;
};

export const defaultSWRConfig: SWRConfiguration = {
  fetcher,
  revalidateOnFocus: false,
  shouldRetryOnError: true,
};
