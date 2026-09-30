import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  type GestureResponderEvent,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fetchCategories, fetchTrips } from "../api";
import { FeatherIcon, IonIcon } from "../components/Icon";
import type { Trip } from "../types";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width * 0.76;

export default function HomeScreenRoute() {
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>([
    "All",
    "South America",
    "Asia",
    "Europe",
    "North America",
    "Africa",
  ]);
  const [selectedCategory, setSelectedCategory] = useState("South America");
  const [searchQuery, setSearchQuery] = useState("");
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

  // Fetch categories on mount
  useEffect(() => {
    let mounted = true;
    fetchCategories().then((cats) => {
      if (mounted && cats.length > 0) {
        setCategories(cats);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  // Fetch filtered trips whenever category or search query changes
  useEffect(() => {
    let mounted = true;
    setLoading(true);

    const timer = setTimeout(() => {
      fetchTrips({
        category: selectedCategory === "All" ? undefined : selectedCategory,
        search: searchQuery.trim() ? searchQuery : undefined,
      }).then((data) => {
        if (mounted) {
          setTrips(data);
          setLoading(false);
        }
      });
    }, 150); // Small debounce for smooth typing

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, [selectedCategory, searchQuery]);

  const toggleFavorite = (id: string, e: GestureResponderEvent) => {
    e.stopPropagation?.();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const navigateToDetail = (tripId: string) => {
    router.push(`/detail/${tripId}`);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F9FAFB]">
      <StatusBar barStyle="dark-content" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
        className="flex-1"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 pt-4 pb-2">
          <View>
            <Text className="text-2xl font-bold text-slate-900 tracking-tight">Hello, Vanessa</Text>
            <Text className="text-sm font-medium text-slate-400 mt-0.5">Welcome to TripGlide</Text>
          </View>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
            }}
            className="w-12 h-12 rounded-full border-2 border-white shadow-sm"
          />
        </View>

        {/* Search & Filter Bar */}
        <View className="flex-row items-center px-6 mt-4">
          <View className="flex-1 flex-row items-center bg-white rounded-full px-4 py-3 border border-slate-100 shadow-sm">
            <FeatherIcon name="search" size={18} color="#94A3B8" />
            <TextInput
              placeholder="Search destination, city, country..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              className="flex-1 ml-3 text-sm text-slate-800 font-medium p-0"
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={() => setSearchQuery("")} className="p-1">
                <IonIcon name="close-circle" size={18} color="#94A3B8" />
              </Pressable>
            )}
          </View>
          <Pressable
            onPress={() => setSelectedCategory("All")}
            className="w-12 h-12 rounded-full bg-[#181A20] items-center justify-center ml-3 shadow-md active:opacity-80"
          >
            <IonIcon name="options-outline" size={20} color="#FFFFFF" />
          </Pressable>
        </View>

        {/* Categories Section */}
        <View className="mt-7">
          <Text className="text-lg font-bold text-slate-900 px-6 mb-3">Select your next trip</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            {categories.map((category) => {
              const isSelected = selectedCategory === category;
              return (
                <Pressable
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  className={`px-5 py-2.5 rounded-full mr-2.5 ${
                    isSelected ? "bg-[#181A20]" : "bg-white border border-slate-200"
                  }`}
                >
                  <Text
                    className={`text-sm font-semibold ${
                      isSelected ? "text-white" : "text-slate-600"
                    }`}
                  >
                    {category}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Featured Trip Carousel */}
        <View className="mt-6">
          {loading ? (
            <View className="h-[380px] items-center justify-center">
              <ActivityIndicator size="large" color="#181A20" />
              <Text className="text-xs font-semibold text-slate-400 mt-3">
                Loading destinations...
              </Text>
            </View>
          ) : trips.length === 0 ? (
            <View className="h-[300px] items-center justify-center px-8 text-center">
              <IonIcon name="search-outline" size={48} color="#CBD5E1" />
              <Text className="text-base font-bold text-slate-800 mt-3">No destinations found</Text>
              <Text className="text-xs text-slate-500 text-center mt-1">
                Try searching for another keyword or change your category filter.
              </Text>
              <Pressable
                onPress={() => {
                  setSearchQuery("");
                  setSelectedCategory("All");
                }}
                className="mt-4 px-4 py-2 rounded-full bg-[#181A20]"
              >
                <Text className="text-xs font-bold text-white">Reset filters</Text>
              </Pressable>
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH + 16}
              decelerationRate="fast"
              contentContainerStyle={{ paddingHorizontal: 24 }}
            >
              {trips.map((trip) => {
                const isFav = favorites[trip.id];
                return (
                  <Pressable
                    key={trip.id}
                    onPress={() => navigateToDetail(trip.id)}
                    style={{ width: CARD_WIDTH }}
                    className="h-[380px] rounded-3xl overflow-hidden mr-4 shadow-lg bg-slate-200 active:opacity-95"
                  >
                    <ImageBackground
                      source={{ uri: trip.image }}
                      className="flex-1 justify-between p-4"
                      imageStyle={{ borderRadius: 24 }}
                    >
                      {/* Top Right Heart Button */}
                      <View className="flex-row justify-end">
                        <Pressable
                          onPress={(e) => toggleFavorite(trip.id, e)}
                          className="w-10 h-10 rounded-full bg-white/40 items-center justify-center backdrop-blur-md active:bg-white/60"
                        >
                          <IonIcon
                            name={isFav ? "heart" : "heart-outline"}
                            size={20}
                            color={isFav ? "#EF4444" : "#FFFFFF"}
                          />
                        </Pressable>
                      </View>

                      {/* Bottom Info Card */}
                      <View className="bg-[#181A20]/90 rounded-2xl p-4 backdrop-blur-md">
                        <Text className="text-xs font-medium text-slate-300">{trip.country}</Text>
                        <Text className="text-xl font-bold text-white mt-0.5">{trip.title}</Text>

                        {/* Rating Row */}
                        <View className="flex-row items-center mt-1.5">
                          <IonIcon name="star" size={13} color="#FBBF24" />
                          <Text className="text-xs font-bold text-white ml-1">{trip.rating}</Text>
                          <Text className="text-xs font-medium text-slate-400 ml-2">
                            {trip.reviews}
                          </Text>
                        </View>

                        {/* See More Button */}
                        <Pressable
                          onPress={() => navigateToDetail(trip.id)}
                          className="flex-row items-center justify-between bg-white/10 rounded-full pl-4 pr-1.5 py-1.5 mt-3 active:bg-white/20"
                        >
                          <Text className="text-sm font-semibold text-white">See more</Text>
                          <View className="w-7 h-7 rounded-full bg-white items-center justify-center">
                            <IonIcon name="chevron-forward" size={16} color="#181A20" />
                          </View>
                        </Pressable>
                      </View>
                    </ImageBackground>
                  </Pressable>
                );
              })}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      {/* Floating Bottom Navigation Bar */}
      <View className="absolute bottom-6 left-6 right-6">
        <View className="bg-[#181A20] rounded-full flex-row items-center justify-around py-2 px-3 shadow-2xl">
          <Pressable
            onPress={() => setActiveTab("home")}
            className={`w-11 h-11 rounded-full items-center justify-center ${
              activeTab === "home" ? "bg-white" : ""
            }`}
          >
            <IonIcon
              name={activeTab === "home" ? "home" : "home-outline"}
              size={20}
              color={activeTab === "home" ? "#181A20" : "#94A3B8"}
            />
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("explore")}
            className={`w-11 h-11 rounded-full items-center justify-center ${
              activeTab === "explore" ? "bg-white" : ""
            }`}
          >
            <IonIcon
              name={activeTab === "explore" ? "compass" : "compass-outline"}
              size={22}
              color={activeTab === "explore" ? "#181A20" : "#94A3B8"}
            />
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("favorites")}
            className={`w-11 h-11 rounded-full items-center justify-center ${
              activeTab === "favorites" ? "bg-white" : ""
            }`}
          >
            <IonIcon
              name={activeTab === "favorites" ? "heart" : "heart-outline"}
              size={22}
              color={activeTab === "favorites" ? "#181A20" : "#94A3B8"}
            />
          </Pressable>

          <Pressable
            onPress={() => setActiveTab("grid")}
            className={`w-11 h-11 rounded-full items-center justify-center ${
              activeTab === "grid" ? "bg-white" : ""
            }`}
          >
            <IonIcon
              name={activeTab === "grid" ? "apps" : "apps-outline"}
              size={20}
              color={activeTab === "grid" ? "#181A20" : "#94A3B8"}
            />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
