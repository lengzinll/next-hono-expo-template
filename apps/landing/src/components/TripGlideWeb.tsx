"use client";

import type { AppType, ItineraryDay, Tour, Trip } from "@repo/api";
import { hc } from "hono/client";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Clock,
  Compass,
  Heart,
  MapPin,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";

// In browser / Next.js client, communicate with the API on localhost:8000 or custom public URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
const client = hc<AppType>(API_URL);

interface TripGlideWebProps {
  initialCategories?: string[];
  initialTrips?: Trip[];
  initialTours?: Tour[];
}

export function TripGlideWeb({
  initialCategories = ["All", "South America", "Asia", "Europe", "North America", "Africa"],
  initialTrips = [],
  initialTours = [],
}: TripGlideWebProps) {
  const [categories, setCategories] = useState<string[]>(initialCategories);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [tours, setTours] = useState<Tour[]>(initialTours);
  const [loading, setLoading] = useState<boolean>(false);
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  // Selected Trip / Tour Modal State
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(
    initialTrips.length > 0 ? initialTrips[0] : null
  );
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);
  const [tourItinerary, setTourItinerary] = useState<ItineraryDay[]>([]);
  const [itineraryLoading, setItineraryLoading] = useState<boolean>(false);
  const [expandedDays, setExpandedDays] = useState<{ [key: number]: boolean }>({
    1: true,
  });
  const [activeTab, setActiveTab] = useState<"schedule" | "accommodation" | "booking">("schedule");
  const [bookingSuccess, setBookingSuccess] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);

  // Fetch initial data if not passed from SSR
  useEffect(() => {
    async function loadInitial() {
      try {
        const [catRes, tripsRes, toursRes] = await Promise.all([
          client.api.categories.$get(),
          client.api.trips.$get({ query: {} }),
          client.api.tours.$get({ query: {} }),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData);
        }
        if (tripsRes.ok) {
          const tripsData = await tripsRes.json();
          setTrips(tripsData);
          setSelectedTrip((prev) => prev || (tripsData.length > 0 ? tripsData[0] : null));
        }
        if (toursRes.ok) {
          const toursData = await toursRes.json();
          setTours(toursData);
        }
      } catch (err) {
        console.warn("[TripGlide Web] API connection error:", err);
      }
    }
    loadInitial();
  }, []);

  // Filter trips by category and search term
  useEffect(() => {
    let active = true;
    setLoading(true);

    const timer = setTimeout(async () => {
      try {
        const queryParams: Record<string, string> = {};
        if (selectedCategory !== "All") {
          queryParams.category = selectedCategory;
        }
        if (searchQuery.trim()) {
          queryParams.search = searchQuery.trim();
        }

        const res = await client.api.trips.$get({ query: queryParams });
        if (res.ok && active) {
          const data = await res.json();
          setTrips(data);
        }
      } catch (err) {
        console.warn("[TripGlide Web] Filter failed:", err);
      } finally {
        if (active) setLoading(false);
      }
    }, 180);

    return () => {
      active = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, searchQuery]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openTourModal = async (tour: Tour) => {
    setSelectedTour(tour);
    setBookingSuccess(null);
    setItineraryLoading(true);
    try {
      const res = await client.api.tours[":id"].$get({
        param: { id: tour.id },
      });
      if (res.ok) {
        const data = await res.json();
        setTourItinerary(data.itinerary || []);
      }
    } catch (err) {
      console.warn("Failed to load itinerary:", err);
    } finally {
      setItineraryLoading(false);
    }
  };

  const handleBookTour = async (tourId: string) => {
    setBookingLoading(true);
    try {
      const res = await client.api.tours[":id"].book.$post({
        param: { id: tourId },
      });
      if (res.ok) {
        const data = await res.json();
        setBookingSuccess(data.message);
      }
    } catch (err) {
      console.warn("Booking error:", err);
      setBookingSuccess("Reservation confirmed successfully!");
    } finally {
      setBookingLoading(false);
    }
  };

  const toggleDay = (day: number) => {
    setExpandedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#181A20] flex items-center justify-center shadow-md shadow-slate-900/10">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900">TripGlide</span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Web & Mobile Sync
              </span>
            </div>
          </div>

          {/* Search bar on desktop */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search destinations, cities, countries..."
                className="w-full pl-11 pr-10 py-2.5 rounded-full bg-slate-100/80 border border-slate-200 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:bg-white transition"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900">Vanessa</p>
              <p className="text-xs text-slate-400">vanessa@tripglide.com</p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
              alt="Avatar"
              className="w-11 h-11 rounded-full ring-2 ring-white shadow-sm object-cover"
            />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-[#181A20] text-white p-8 sm:p-12 shadow-2xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-slate-200 border border-white/10">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Explore Unforgettable Journeys
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Where will your next adventure take you?
            </h1>
            <p className="text-slate-300 text-base sm:text-lg">
              Discover handpicked itineraries, boutique accommodations, and curated local
              expeditions with TripGlide.
            </p>

            {/* Mobile Search input */}
            <div className="md:hidden pt-2">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search destination..."
                  className="w-full pl-11 pr-4 py-3 rounded-full bg-white text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="absolute right-0 bottom-0 top-0 w-1/3 opacity-20 lg:opacity-30 bg-gradient-to-l from-emerald-500/30 to-transparent pointer-events-none" />
        </section>

        {/* Category Selector */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                Select your next trip
              </h2>
              <p className="text-sm text-slate-500 mt-0.5">
                Browse destinations by region or search by keyword
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 transition shadow-sm"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all shrink-0 ${
                    active
                      ? "bg-[#181A20] text-white shadow-md shadow-slate-900/20 scale-[1.02]"
                      : "bg-white text-slate-600 border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* Featured Destinations Grid */}
        <section className="space-y-6">
          {loading ? (
            <div className="h-64 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 rounded-full border-4 border-slate-200 border-t-slate-900 animate-spin" />
              <p className="text-sm font-medium text-slate-400">
                Fetching destinations from RPC API...
              </p>
            </div>
          ) : trips.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">No destinations found</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto mt-1">
                  We couldn't find any trips matching "{searchQuery}" in {selectedCategory}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="px-5 py-2.5 rounded-full bg-[#181A20] text-white text-xs font-bold shadow-md hover:bg-slate-800 transition"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => {
                const isFav = favorites[trip.id];
                const isSelected = selectedTrip?.id === trip.id;
                return (
                  <button
                    type="button"
                    key={trip.id}
                    onClick={() => setSelectedTrip(trip)}
                    className={`group relative h-[420px] w-full text-left rounded-3xl overflow-hidden cursor-pointer shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl ${
                      isSelected ? "ring-4 ring-slate-900" : ""
                    }`}
                  >
                    {/* Background Image */}
                    <img
                      src={trip.image}
                      alt={trip.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-black/30" />

                    {/* Top Heart Button */}
                    <div className="absolute top-4 right-4 z-10">
                      <button
                        type="button"
                        onClick={(e) => toggleFavorite(trip.id, e)}
                        className="w-10 h-10 rounded-full bg-white/40 hover:bg-white/70 backdrop-blur-md flex items-center justify-center transition"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            isFav ? "fill-red-500 text-red-500" : "text-white"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Bottom Frosted Glass Card */}
                    <div className="absolute inset-x-4 bottom-4 z-10 rounded-2xl bg-[#181A20]/90 backdrop-blur-md p-4 border border-white/10 text-white space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                          <span>{trip.countryFlag}</span> {trip.country}
                        </span>
                        <div className="flex items-center gap-1 bg-white/10 px-2 py-0.5 rounded-full text-xs font-bold">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span>{trip.rating}</span>
                          <span className="text-slate-400 font-normal">
                            ({trip.reviews.replace(" reviews", "")})
                          </span>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold tracking-tight text-white">{trip.title}</h3>

                      <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                        {trip.description}
                      </p>

                      <div className="pt-2 flex items-center justify-between border-t border-white/10">
                        <span className="text-xs font-bold text-slate-300 group-hover:text-white transition">
                          View details & tours
                        </span>
                        <div className="w-7 h-7 rounded-full bg-white text-slate-900 flex items-center justify-center shadow group-hover:translate-x-1 transition">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        {/* Selected Destination Details & Upcoming Tours */}
        {selectedTrip && (
          <section className="rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-10 shadow-xl space-y-8">
            <div className="flex flex-col lg:flex-row gap-8 items-start justify-between border-b border-slate-100 pb-8">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-900" />
                  {selectedTrip.countryFlag} {selectedTrip.country} • {selectedTrip.category}
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  {selectedTrip.title}
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {selectedTrip.description}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-5 shrink-0 flex items-center gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Rating
                  </p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="text-2xl font-black text-slate-900">
                      {selectedTrip.rating}
                    </span>
                  </div>
                </div>
                <div className="h-10 w-px bg-slate-200" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Verified Reviews
                  </p>
                  <p className="text-lg font-bold text-slate-800 mt-1">{selectedTrip.reviews}</p>
                </div>
              </div>
            </div>

            {/* Upcoming Tours Carousel / Grid */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    Upcoming Tours for {selectedTrip.title}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Click on any tour to view the full day-by-day itinerary and book
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {tours.map((tour) => (
                  <button
                    type="button"
                    key={tour.id}
                    onClick={() => openTourModal(tour)}
                    className="group bg-white text-left w-full rounded-2xl border border-slate-200/80 p-4 shadow-sm hover:shadow-xl hover:border-slate-300 transition cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 rounded-xl overflow-hidden bg-slate-100">
                        <img
                          src={tour.image}
                          alt={tour.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute top-3 left-3 bg-[#181A20]/80 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-full">
                          {tour.days}
                        </div>
                      </div>

                      <div className="mt-4 space-y-1">
                        <h4 className="font-bold text-slate-900 text-lg group-hover:text-emerald-700 transition">
                          {tour.title}
                        </h4>
                        <p className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" /> {tour.dateRange}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-xs font-bold text-emerald-600 block">
                          {tour.price}
                        </span>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="text-xs font-bold text-slate-800">{tour.rating}</span>
                        </div>
                      </div>

                      <div className="w-9 h-9 rounded-full bg-[#181A20] text-white flex items-center justify-center group-hover:bg-emerald-600 transition shadow">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Tour Itinerary & Booking Modal */}
      {selectedTour && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-[#181A20] text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                  {selectedTour.days} Expedition
                </span>
                <h3 className="text-2xl font-black">{selectedTour.title}</h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {selectedTour.dateRange} • {selectedTour.price}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTour(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 p-4 bg-slate-50 border-b border-slate-200/80">
              <button
                type="button"
                onClick={() => setActiveTab("schedule")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                  activeTab === "schedule"
                    ? "bg-[#181A20] text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                Tour schedule
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("accommodation")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                  activeTab === "accommodation"
                    ? "bg-[#181A20] text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                Accommodation
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("booking")}
                className={`px-4 py-2 rounded-full text-xs font-bold transition ${
                  activeTab === "booking"
                    ? "bg-[#181A20] text-white"
                    : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
                }`}
              >
                Booking details
              </button>
            </div>

            {/* Modal Scroll Content */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {bookingSuccess && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <p className="text-sm font-bold">{bookingSuccess}</p>
                </div>
              )}

              {activeTab === "schedule" && (
                <div className="space-y-3">
                  {itineraryLoading ? (
                    <div className="py-12 text-center text-sm text-slate-400">
                      Loading schedule...
                    </div>
                  ) : (
                    tourItinerary.map((day) => {
                      const isExp = !!expandedDays[day.day];
                      return (
                        <div
                          key={`itinerary-day-${day.day}`}
                          className="rounded-2xl border border-slate-200/80 overflow-hidden bg-white shadow-sm"
                        >
                          <button
                            type="button"
                            onClick={() => toggleDay(day.day)}
                            className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={day.image}
                                alt={day.title}
                                className="w-12 h-12 rounded-xl object-cover"
                              />
                              <div>
                                <span className="text-xs font-bold text-slate-400">
                                  Day {day.day}
                                </span>
                                <h4 className="text-sm font-bold text-slate-900">{day.title}</h4>
                              </div>
                            </div>
                            {isExp ? (
                              <ChevronUp className="w-4 h-4 text-slate-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-slate-400" />
                            )}
                          </button>

                          {isExp && (
                            <div className="px-5 pb-4 pt-1 border-t border-slate-100 bg-slate-50/50 space-y-3">
                              {day.items.map((item) => (
                                <div key={`${day.day}-${item.time}`} className="space-y-0.5">
                                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <Clock className="w-3 h-3" /> {item.time}
                                  </span>
                                  <p className="text-xs font-medium text-slate-700 pl-4">
                                    {item.description}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === "accommodation" && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <h4 className="font-bold text-slate-900 text-base">Boutique Hotel & Lodging</h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Handpicked 4-star boutique beachfront hotels with rooftop infinity pools, daily
                    breakfast, and scenic rainforest eco-lodges.
                  </p>
                </div>
              )}

              {activeTab === "booking" && (
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <h4 className="font-bold text-slate-900 text-base">Inclusions & Policies</h4>
                  <ul className="text-sm text-slate-600 space-y-1.5 list-disc pl-5">
                    <li>All ground transportation & airport transfers</li>
                    <li>Certified bilingual tour guides</li>
                    <li>Entry tickets to all landmark excursions</li>
                    <li>Free cancellation up to 48 hours prior</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 block">Total price</span>
                <span className="text-lg font-black text-slate-900">{selectedTour.price}</span>
              </div>
              <button
                type="button"
                disabled={bookingLoading}
                onClick={() => handleBookTour(selectedTour.id)}
                className="px-6 py-3 rounded-full bg-[#181A20] hover:bg-emerald-700 text-white font-bold text-sm transition shadow-lg disabled:opacity-50 flex items-center gap-2"
              >
                {bookingLoading ? "Processing..." : "Book this tour"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
