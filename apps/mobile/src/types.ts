import type { InferRequestType, InferResponseType } from "hono/client";
import type { client } from "./api";

// 1. Re-export domain models directly from the backend API (@repo/api)
export type {
  Trip,
  Tour,
  ItineraryDay,
  ItineraryItem,
} from "@repo/api";

// 2. Infer types directly from the Hono RPC Client endpoints:
export type TripsResponse = InferResponseType<(typeof client)["api"]["trips"]["$get"]>;
export type SingleTripResponse = InferResponseType<(typeof client)["api"]["trips"][":id"]["$get"]>;
export type ToursResponse = InferResponseType<(typeof client)["api"]["tours"]["$get"]>;
export type TourDetailResponse = InferResponseType<(typeof client)["api"]["tours"][":id"]["$get"]>;
export type BookTourResponse = InferResponseType<
  (typeof client)["api"]["tours"][":id"]["book"]["$post"]
>;
export type BookTourRequest = InferRequestType<
  (typeof client)["api"]["tours"][":id"]["book"]["$post"]
>;
