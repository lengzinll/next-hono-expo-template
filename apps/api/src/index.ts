import { formatDate } from "@repo/utils";
import { serve } from "bun";
import { Hono } from "hono";
import { cors } from "hono/cors";
import {
  CATEGORIES,
  type ItineraryDay,
  TOUR_ITINERARIES,
  TRIPS,
  type Tour,
  type Trip,
  UPCOMING_TOURS,
} from "./data";

const app = new Hono();

// Enable CORS for web and mobile clients
app.use("*", cors());

// Health / Hello Response type
type HelloResponse = {
  message: string;
  date: string;
};

// Define RPC routes
const routes = app
  .get("/hello", (c) => {
    return c.json<HelloResponse>({
      message: "Hello from TripGlide API!",
      date: formatDate(new Date()),
    });
  })
  .get("/api/categories", (c) => {
    return c.json<string[]>(CATEGORIES);
  })
  .get("/api/trips", (c) => {
    const category = c.req.query("category");
    const search = c.req.query("search")?.toLowerCase().trim();

    let results = TRIPS;

    if (category && category !== "All") {
      results = results.filter((t) => t.category.toLowerCase() === category.toLowerCase());
    }

    if (search) {
      results = results.filter(
        (t) =>
          t.title.toLowerCase().includes(search) ||
          t.country.toLowerCase().includes(search) ||
          t.description.toLowerCase().includes(search)
      );
    }

    return c.json<Trip[]>(results);
  })
  .get("/api/trips/:id", (c) => {
    const id = c.req.param("id");
    const trip = TRIPS.find((t) => t.id === id) || null;
    return c.json<{ trip: Trip | null }>({ trip });
  })
  .get("/api/tours", (c) => {
    const tripId = c.req.query("tripId");
    let results = UPCOMING_TOURS;
    if (tripId) {
      results = results.filter((tour) => tour.tripId === tripId);
    }
    return c.json<Tour[]>(results);
  })
  .get("/api/tours/:id", (c) => {
    const id = c.req.param("id");
    const tour = UPCOMING_TOURS.find((t) => t.id === id) || null;
    const itinerary = TOUR_ITINERARIES[id] || TOUR_ITINERARIES["tour-1"] || [];
    return c.json<{ tour: Tour | null; itinerary: ItineraryDay[] }>({
      tour,
      itinerary,
    });
  })
  .post("/api/tours/:id/book", async (c) => {
    const id = c.req.param("id");
    const tour = UPCOMING_TOURS.find((t) => t.id === id);
    return c.json<{ success: boolean; message: string }>({
      success: true,
      message: tour ? `Successfully booked ${tour.title}!` : "Booking placed successfully!",
    });
  });

// Export the type of your API for Hono RPC Client
export type AppType = typeof routes;
export * from "./data";

serve({
  fetch: app.fetch,
  port: 8000,
});
