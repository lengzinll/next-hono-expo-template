import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  type GestureResponderEvent,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchTours, fetchTripById } from "../../api";
import { IonIcon } from "../../components/Icon";
import type { Tour, Trip } from "../../types";

export default function DetailScreenRoute() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [tourFavorites, setTourFavorites] = useState<{ [key: string]: boolean }>({});
  const [expandedText, setExpandedText] = useState(false);

  useEffect(() => {
    let mounted = true;
    if (id) {
      Promise.all([fetchTripById(id), fetchTours(id)]).then(([tripData, toursData]) => {
        if (mounted) {
          setTrip(tripData);
          setTours(toursData);
          setLoading(false);
        }
      });
    }
    return () => {
      mounted = false;
    };
  }, [id]);

  const toggleTourFavorite = (tourId: string, e: GestureResponderEvent) => {
    e.stopPropagation?.();
    setTourFavorites((prev) => ({ ...prev, [tourId]: !prev[tourId] }));
  };

  const navigateToTour = (tourId: string) => {
    router.push(`/tour/${tourId}`);
  };

  if (loading || !trip) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#181A20" />
        <Text className="text-xs font-semibold text-slate-400 mt-3">
          Loading destination details...
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Top Hero Image */}
        <View className="h-[340px] w-full relative">
          <Image source={{ uri: trip.image }} className="w-full h-full" resizeMode="cover" />

          {/* Top Floating Action Bar */}
          <SafeAreaView className="absolute top-2 left-6 right-6 flex-row items-center justify-between">
            <Pressable
              onPress={() => router.back()}
              className="w-11 h-11 rounded-full bg-white/70 backdrop-blur-md items-center justify-center shadow-md active:bg-white"
            >
              <IonIcon name="chevron-back" size={22} color="#181A20" />
            </Pressable>

            <Pressable
              onPress={() => setIsFavorite(!isFavorite)}
              className="w-11 h-11 rounded-full bg-white/70 backdrop-blur-md items-center justify-center shadow-md active:bg-white"
            >
              <IonIcon
                name={isFavorite ? "heart" : "heart-outline"}
                size={22}
                color={isFavorite ? "#EF4444" : "#181A20"}
              />
            </Pressable>
          </SafeAreaView>
        </View>

        {/* Content Sheet */}
        <View className="-mt-8 rounded-t-[32px] bg-white px-6 pt-6 pb-12 shadow-2xl">
          {/* Header Row: Title & Rating */}
          <View className="flex-row items-start justify-between">
            <View className="flex-1 pr-4">
              <Text className="text-2xl font-bold text-slate-900 tracking-tight">{trip.title}</Text>
              <View className="flex-row items-center mt-1.5">
                <Text className="text-base mr-1.5">{trip.countryFlag || "🇧🇷"}</Text>
                <Text className="text-sm font-semibold text-slate-600">{trip.country}</Text>
              </View>
            </View>

            <View className="items-end">
              <View className="flex-row items-center bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <IonIcon name="star" size={13} color="#F59E0B" />
                <Text className="text-xs font-bold text-amber-900 ml-1">{trip.rating}</Text>
              </View>
              <Text className="text-xs text-slate-400 underline font-medium mt-1">
                {trip.reviews}
              </Text>
            </View>
          </View>

          {/* Description */}
          <View className="mt-5">
            <Text
              numberOfLines={expandedText ? undefined : 3}
              className="text-sm text-slate-600 leading-6"
            >
              {trip.description}
            </Text>
            <Pressable onPress={() => setExpandedText(!expandedText)} className="mt-1">
              <Text className="text-sm font-bold text-slate-900 underline">
                {expandedText ? "Read less" : "Read more"}
              </Text>
            </Pressable>
          </View>

          {/* Upcoming Tours Section */}
          <View className="mt-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-bold text-slate-900">Upcoming tours</Text>
              <Pressable>
                <Text className="text-xs font-semibold text-slate-400">See all</Text>
              </Pressable>
            </View>

            {/* Tour Cards Horizontal Scroll */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-6 px-6">
              {tours.map((tour) => {
                const isFav = tourFavorites[tour.id];
                return (
                  <Pressable
                    key={tour.id}
                    onPress={() => navigateToTour(tour.id)}
                    className="w-[200px] bg-white rounded-2xl border border-slate-100 p-3 mr-4 shadow-sm active:opacity-95"
                  >
                    {/* Tour Image with Favorite Button */}
                    <View className="h-[120px] w-full rounded-xl overflow-hidden relative bg-slate-100">
                      <Image
                        source={{ uri: tour.image }}
                        className="w-full h-full"
                        resizeMode="cover"
                      />
                      <Pressable
                        onPress={(e) => toggleTourFavorite(tour.id, e)}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/70 backdrop-blur-md items-center justify-center"
                      >
                        <IonIcon
                          name={isFav ? "heart" : "heart-outline"}
                          size={16}
                          color={isFav ? "#EF4444" : "#181A20"}
                        />
                      </Pressable>
                    </View>

                    {/* Tour Title & Info */}
                    <Text numberOfLines={1} className="text-base font-bold text-slate-900 mt-2.5">
                      {tour.title}
                    </Text>
                    <Text className="text-xs text-slate-400 font-medium mt-0.5">
                      {tour.days} • {tour.price}
                    </Text>

                    {/* Rating & Arrow Action Row */}
                    <View className="flex-row items-center justify-between mt-3">
                      <View className="flex-row items-center">
                        <IonIcon name="star" size={12} color="#FBBF24" />
                        <Text className="text-xs font-bold text-slate-800 ml-1">{tour.rating}</Text>
                        <Text className="text-[11px] text-slate-400 ml-1.5">{tour.reviews}</Text>
                      </View>

                      <View className="w-8 h-8 rounded-full bg-[#181A20] items-center justify-center">
                        <IonIcon name="arrow-forward" size={16} color="#FFFFFF" />
                      </View>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
