export interface Trip {
  id: string;
  category: string;
  country: string;
  countryFlag: string;
  title: string;
  rating: string;
  reviews: string;
  image: string;
  description: string;
}

export interface Tour {
  id: string;
  tripId: string;
  title: string;
  days: string;
  price: string;
  rating: string;
  reviews: string;
  image: string;
  dateRange: string;
}

export interface ItineraryItem {
  time: string;
  description: string;
}

export interface ItineraryDay {
  day: number;
  title: string;
  image: string;
  items: ItineraryItem[];
}

export const CATEGORIES = ["All", "South America", "Asia", "Europe", "North America", "Africa"];

export const TRIPS: Trip[] = [
  {
    id: "1",
    category: "South America",
    country: "Brazil",
    countryFlag: "🇧🇷",
    title: "Rio de Janeiro",
    rating: "5.0",
    reviews: "143 reviews",
    image:
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&auto=format&fit=crop&q=80",
    description:
      "Rio de Janeiro, often simply called Rio, is one of Brazil's most iconic cities, renowned for its dramatic mountain landscapes, world-famous beaches like Copacabana and Ipanema, and vibrant cultural energy.",
  },
  {
    id: "2",
    category: "South America",
    country: "Peru",
    countryFlag: "🇵🇪",
    title: "Machu Picchu",
    rating: "4.9",
    reviews: "98 reviews",
    image:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&auto=format&fit=crop&q=80",
    description:
      "Machu Picchu is an Incan citadel set high in the Andes Mountains in Peru, above the Urubamba River valley. Built in the 15th century and later abandoned, it's famous for its sophisticated dry-stone walls.",
  },
  {
    id: "3",
    category: "Europe",
    country: "Greece",
    countryFlag: "🇬🇷",
    title: "Santorini",
    rating: "4.8",
    reviews: "210 reviews",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800&auto=format&fit=crop&q=80",
    description:
      "Santorini is one of the Cyclades islands in the Aegean Sea. It was devastated by a volcanic eruption in the 16th century BC, forever shaping its rugged landscape with whitewashed, cubiform houses.",
  },
  {
    id: "4",
    category: "Asia",
    country: "Japan",
    countryFlag: "🇯🇵",
    title: "Kyoto Gardens",
    rating: "4.9",
    reviews: "312 reviews",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
    description:
      "Kyoto, once the capital of Japan, is a city on the island of Honshu famous for numerous classical Buddhist temples, gardens, imperial palaces, Shinto shrines, and traditional wooden houses.",
  },
  {
    id: "5",
    category: "Asia",
    country: "Indonesia",
    countryFlag: "🇮🇩",
    title: "Bali Island",
    rating: "4.7",
    reviews: "185 reviews",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&auto=format&fit=crop&q=80",
    description:
      "Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches, and coral reefs, along with sacred spiritual temples and vibrant nightlife.",
  },
  {
    id: "6",
    category: "Europe",
    country: "Switzerland",
    countryFlag: "🇨🇭",
    title: "Swiss Alps",
    rating: "4.9",
    reviews: "154 reviews",
    image:
      "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?w=800&auto=format&fit=crop&q=80",
    description:
      "The Swiss Alps feature soaring snow-capped peaks, alpine lakes, and historic valleys. Ideal for hiking, skiing, and breathtaking panoramic mountain train journeys.",
  },
  {
    id: "7",
    category: "Africa",
    country: "Tanzania",
    countryFlag: "🇹🇿",
    title: "Serengeti Safari",
    rating: "5.0",
    reviews: "92 reviews",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=800&auto=format&fit=crop&q=80",
    description:
      "Serengeti National Park is famous for its annual migration of over 1.5 million white-bearded wildebeest and 250,000 zebra, with thrilling big game safaris.",
  },
];

export const UPCOMING_TOURS: Tour[] = [
  {
    id: "tour-1",
    tripId: "1",
    title: "Iconic Brazil",
    days: "8 days",
    price: "from $659/person",
    rating: "4.6",
    reviews: "56 reviews",
    dateRange: "Wed, Oct 21 – Sun, Nov 1",
    image:
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "tour-2",
    tripId: "1",
    title: "Beach & Coast",
    days: "8 days",
    price: "from $820/person",
    rating: "4.8",
    reviews: "42 reviews",
    dateRange: "Mon, Nov 9 – Tue, Nov 17",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "tour-3",
    tripId: "1",
    title: "Amazon Rainforest",
    days: "5 days",
    price: "from $540/person",
    rating: "4.9",
    reviews: "88 reviews",
    dateRange: "Fri, Dec 4 – Wed, Dec 9",
    image:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "tour-4",
    tripId: "2",
    title: "Inca Trail Explorer",
    days: "6 days",
    price: "from $720/person",
    rating: "4.9",
    reviews: "64 reviews",
    dateRange: "Sun, Oct 18 – Fri, Oct 23",
    image:
      "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "tour-5",
    tripId: "4",
    title: "Kyoto Heritage & Temples",
    days: "7 days",
    price: "from $990/person",
    rating: "4.9",
    reviews: "110 reviews",
    dateRange: "Tue, Nov 3 – Mon, Nov 9",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&auto=format&fit=crop&q=80",
  },
];

export const TOUR_ITINERARIES: Record<string, ItineraryDay[]> = {
  "tour-1": [
    {
      day: 1,
      title: "Arrival to Rio de Janeiro",
      image:
        "https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?w=200&auto=format&fit=crop&q=80",
      items: [
        {
          time: "Morning",
          description: "Arrive in Rio de Janeiro and transfer to your hotel",
        },
        {
          time: "Afternoon",
          description: "Free time to relax or explore the nearby area",
        },
        {
          time: "Evening",
          description: "Welcome dinner at a traditional Brazilian restaurant",
        },
      ],
    },
    {
      day: 2,
      title: "Rio de Janeiro Highlights",
      image:
        "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=200&auto=format&fit=crop&q=80",
      items: [
        {
          time: "Morning",
          description: "Visit Christ the Redeemer atop Corcovado Mountain",
        },
        {
          time: "Afternoon",
          description: "Take the iconic cable car up Sugarloaf Mountain",
        },
        {
          time: "Evening",
          description: "Sunset drinks and live samba music at Copacabana",
        },
      ],
    },
    {
      day: 3,
      title: "Tijuca Rainforest Expedition",
      image:
        "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=200&auto=format&fit=crop&q=80",
      items: [
        {
          time: "Morning",
          description: "Open-top Jeep safari through Tijuca National Park",
        },
        {
          time: "Afternoon",
          description: "Guided hike to hidden waterfalls and scenic lookouts",
        },
        {
          time: "Evening",
          description: "Return to city and explore historic Santa Teresa district",
        },
      ],
    },
  ],
};
