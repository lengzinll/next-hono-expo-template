import type { AppType, Tour, Trip } from "@repo/api";
import { hc } from "hono/client";
import { TripGlideWeb } from "../components/TripGlideWeb";

const client = hc<AppType>("http://localhost:8000");

export default async function Home() {
  let categories: string[] = ["All", "South America", "Asia", "Europe", "North America", "Africa"];
  let trips: Trip[] = [];
  let tours: Tour[] = [];

  try {
    const [catRes, tripsRes, toursRes] = await Promise.all([
      client.api.categories.$get(),
      client.api.trips.$get({ query: {} }),
      client.api.tours.$get({ query: {} }),
    ]);

    if (catRes.ok) {
      categories = await catRes.json();
    }
    if (tripsRes.ok) {
      trips = await tripsRes.json();
    }
    if (toursRes.ok) {
      tours = await toursRes.json();
    }
  } catch (err) {
    console.warn("SSR API fetch failed, client will fetch or use fallback:", err);
  }

  return <TripGlideWeb initialCategories={categories} initialTrips={trips} initialTours={tours} />;
}
