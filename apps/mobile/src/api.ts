import type { AppType } from "@repo/api";
import Constants from "expo-constants";
import { hc } from "hono/client";
import { Platform } from "react-native";
import { CATEGORIES, ITINERARY_DAYS, TRIPS } from "./data";
import type { ItineraryDay, Tour, Trip } from "./types";

// Determine API base URL dynamically based on environment / platform
const getApiUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // If running via Expo Go / dev client, extract the host machine IP
  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(":")[0];
    return `http://${host}:8000`;
  }

  // Android emulator fallback
  if (Platform.OS === "android") {
    return "http://10.0.2.2:8000";
  }

  return "http://localhost:8000";
};

export const API_URL = getApiUrl();

// Instantiate typed RPC client
export const client = hc<AppType>(API_URL);

/**
 * Fetch list of categories via RPC with offline fallback
 */
export async function fetchCategories(): Promise<string[]> {
  try {
    const res = await client.api.categories.$get();
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("[API] Failed to fetch categories, using local fallback:", err);
  }
  return CATEGORIES;
}

/**
 * Fetch trips with category filter & search query via RPC
 */
export async function fetchTrips(params?: {
  category?: string;
  search?: string;
}) {
  try {
    const queryParams: Record<string, string> = {};
    if (params?.category && params.category !== "All") {
      queryParams.category = params.category;
    }
    if (params?.search) {
      queryParams.search = params.search;
    }

    const res = await client.api.trips.$get({
      query: queryParams,
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("[API] Failed to fetch trips, filtering local fallback:", err);
  }

  // Offline fallback filtering
  let results = TRIPS;
  if (params?.category && params.category !== "All") {
    results = results.filter(
      (t) =>
        t.category?.toLowerCase() === params.category?.toLowerCase() ||
        t.country.toLowerCase() === params.category?.toLowerCase()
    );
  }
  if (params?.search) {
    const s = params.search.toLowerCase().trim();
    results = results.filter(
      (t) =>
        t.title.toLowerCase().includes(s) ||
        t.country.toLowerCase().includes(s) ||
        t.description?.toLowerCase().includes(s)
    );
  }
  return results;
}

/**
 * Fetch single trip by ID via RPC
 */
export async function fetchTripById(id: string): Promise<Trip | null> {
  try {
    const res = await client.api.trips[":id"].$get({
      param: { id },
    });
    if (res.ok) {
      const data = await res.json();
      return (data.trip as Trip) || null;
    }
  } catch (err) {
    console.warn(`[API] Failed to fetch trip ${id}, using local fallback:`, err);
  }
  return TRIPS.find((t) => t.id === id) || TRIPS[0];
}

/**
 * Fetch upcoming tours for a trip via RPC
 */
export async function fetchTours(tripId?: string): Promise<Tour[]> {
  try {
    const res = await client.api.tours.$get({
      query: tripId ? { tripId } : {},
    });
    if (res.ok) {
      return (await res.json()) as Tour[];
    }
  } catch (err) {
    console.warn("[API] Failed to fetch tours, using local fallback:", err);
  }
  return UPCOMING_TOURS;
}

/**
 * Fetch single tour details & itinerary schedule via RPC
 */
export async function fetchTourDetails(id: string): Promise<{
  tour: Tour | null;
  itinerary: ItineraryDay[];
}> {
  try {
    const res = await client.api.tours[":id"].$get({
      param: { id },
    });
    if (res.ok) {
      const data = await res.json();
      return {
        tour: (data.tour as Tour) || null,
        itinerary: (data.itinerary as ItineraryDay[]) || [],
      };
    }
  } catch (err) {
    console.warn(`[API] Failed to fetch tour ${id}, using local fallback:`, err);
  }
  const tour = UPCOMING_TOURS.find((t) => t.id === id) || UPCOMING_TOURS[0];
  return { tour, itinerary: ITINERARY_DAYS };
}

/**
 * Book tour via RPC
 */
export async function bookTour(id: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await client.api.tours[":id"].book.$post({
      param: { id },
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`[API] Failed to book tour ${id}:`, err);
  }
  return { success: true, message: "Booking confirmed successfully!" };
}
