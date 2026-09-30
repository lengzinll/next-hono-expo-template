import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { bookTour, fetchTourDetails } from "../../api";
import { IonIcon } from "../../components/Icon";
import type { ItineraryDay, Tour } from "../../types";

export default function TourScreenRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [tour, setTour] = useState<Tour | null>(null);
  const [itinerary, setItinerary] = useState<ItineraryDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"schedule" | "accommodation" | "booking">("schedule");
  const [isFavorite, setIsFavorite] = useState(false);
  const [expandedDays, setExpandedDays] = useState<{ [key: number]: boolean }>({
    1: true,
  });

  useEffect(() => {
    let mounted = true;
    if (id) {
      fetchTourDetails(id).then((data) => {
        if (mounted) {
          setTour(data.tour);
          setItinerary(data.itinerary);
          setLoading(false);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [id]);

  const toggleDay = (day: number) => {
    setExpandedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const handleBookTour = () => {
    if (!tour) return;

    Alert.alert(
      "🎉 Tour Booking",
      `Would you like to reserve "${tour.title}" for ${tour.days} (${tour.price})?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Confirm Booking",
          style: "default",
          onPress: async () => {
            setBookingLoading(true);
            const res = await bookTour(tour.id);
            setBookingLoading(false);
            Alert.alert("Success!", res.message);
          },
        },
      ]
    );
  };

  if (loading || !tour) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#181A20" />
        <Text className="text-xs font-semibold text-slate-400 mt-3">Loading tour schedule...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <StatusBar barStyle="dark-content" />

      {/* Top Header */}
      <View className="flex-row items-center justify-between px-6 py-3 bg-[#F9FAFB] border-b border-slate-100">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center shadow-sm active:bg-slate-100"
        >
          <IonIcon name="chevron-back" size={20} color="#181A20" />
        </Pressable>

        <View className="items-center">
          <Text className="text-base font-bold text-slate-900">{tour.title}</Text>
          <Text className="text-xs font-medium text-slate-400 mt-0.5">{tour.dateRange}</Text>
        </View>

        <Pressable
          onPress={() => setIsFavorite(!isFavorite)}
          className="w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center shadow-sm active:bg-slate-100"
        >
          <IonIcon
            name={isFavorite ? "heart" : "heart-outline"}
            size={18}
            color={isFavorite ? "#EF4444" : "#181A20"}
          />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="flex-1 px-6 pt-4"
      >
        {/* Tab Filters (Tour schedule / Accommodation / Booking details) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="flex-row mt-1 mb-6 -mx-6 px-6"
        >
          <Pressable
            onPress={() => setActiveTab("schedule")}
            className={`px-5 py-2.5 rounded-full mr-2.5 ${
              activeTab === "schedule" ? "bg-[#181A20]" : "bg-white border border-slate-200"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === "schedule" ? "text-white" : "text-slate-600"
              }`}
            >
              Tour schedule
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("accommodation")}
            className={`px-5 py-2.5 rounded-full mr-2.5 ${
              activeTab === "accommodation" ? "bg-[#181A20]" : "bg-white border border-slate-200"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === "accommodation" ? "text-white" : "text-slate-600"
              }`}
            >
              Accommodation
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("booking")}
            className={`px-5 py-2.5 rounded-full mr-2.5 ${
              activeTab === "booking" ? "bg-[#181A20]" : "bg-white border border-slate-200"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                activeTab === "booking" ? "text-white" : "text-slate-600"
              }`}
            >
              Booking details
            </Text>
          </Pressable>
        </ScrollView>

        {activeTab === "schedule" && (
          <>
            {/* Section Title */}
            <Text className="text-xl font-bold text-slate-900 mb-4">
              {tour.days} {tour.title} Adventure
            </Text>

            {/* Days Accordion List */}
            <View className="space-y-4">
              {itinerary.map((day) => {
                const isExpanded = !!expandedDays[day.day];
                return (
                  <View
                    key={`day-${day.day}`}
                    className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-3"
                  >
                    {/* Header Row */}
                    <Pressable
                      onPress={() => toggleDay(day.day)}
                      className="flex-row items-center justify-between p-3.5"
                    >
                      <View className="flex-row items-center flex-1 mr-2">
                        <Image
                          source={{ uri: day.image }}
                          className="w-14 h-14 rounded-xl mr-3 bg-slate-100"
                          resizeMode="cover"
                        />
                        <View className="flex-1">
                          <Text className="text-xs font-bold text-slate-400">Day {day.day}</Text>
                          <Text
                            numberOfLines={1}
                            className="text-base font-bold text-slate-900 mt-0.5"
                          >
                            {day.title}
                          </Text>
                        </View>
                      </View>

                      <View className="w-8 h-8 items-center justify-center">
                        <IonIcon
                          name={isExpanded ? "chevron-up" : "chevron-down"}
                          size={18}
                          color="#64748B"
                        />
                      </View>
                    </Pressable>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <View className="px-4 pb-4 pt-1 border-t border-slate-50 space-y-3">
                        {day.items.map((item) => (
                          <View key={`${day.day}-${item.time}`} className="mt-2.5">
                            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                              {item.time}
                            </Text>
                            <Text className="text-sm font-medium text-slate-700 mt-0.5 leading-5">
                              {item.description}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </>
        )}

        {activeTab === "accommodation" && (
          <View className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mt-2">
            <Text className="text-lg font-bold text-slate-900 mb-2">Hotel & Lodging</Text>
            <Text className="text-sm text-slate-600 leading-6">
              Stay in handpicked 4-star boutique beachfront hotels in Copacabana and eco-lodges near
              Tijuca rainforest. Includes daily complimentary breakfast, rooftop pool access, and
              high-speed Wi-Fi.
            </Text>
          </View>
        )}

        {activeTab === "booking" && (
          <View className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mt-2">
            <Text className="text-lg font-bold text-slate-900 mb-2">Included & Inclusions</Text>
            <Text className="text-sm text-slate-600 leading-6">
              • All ground transportation and airport transfers{"\n"}• English & Portuguese
              certified tour guide{"\n"}• Entry tickets to Christ the Redeemer & Sugarloaf{"\n"}•
              Free cancellation up to 48 hours before departure
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Floating Bottom Button: Book a tour */}
      <View className="absolute bottom-6 left-6 right-6">
        <Pressable
          onPress={handleBookTour}
          disabled={bookingLoading}
          className="bg-[#181A20] rounded-full py-4 items-center justify-center shadow-2xl active:opacity-90"
        >
          {bookingLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="text-white font-bold text-base tracking-wide">Book a tour</Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
