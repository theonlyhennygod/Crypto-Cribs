"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Navigation } from "@/components/navigation";
import { PropertyCard } from "@/components/property-card";
import { PropertyFilters } from "@/components/property-filters";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Grid,
  List,
  Search,
  MapPin,
  Calendar,
  Users,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronDown,
  Star,
  Coins,
} from "lucide-react";

// Complete mock property data - 18 properties
const mockProperties = [
  {
    id: "1",
    title: "Luxury Beachfront Villa with Private Pool",
    location: "Maldives",
    price: 450,
    originalPrice: 650,
    currency: "XRP" as const,
    rating: 4.9,
    reviews: 127,
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    images: [
      "/luxury-beachfront-villa-maldives.jpg",
      "/villa-pool-maldives.jpg",
      "/villa-bedroom-luxury.jpg",
    ],
    amenities: ["WiFi", "Pool", "Kitchen", "Parking", "Air conditioning"],
    host: "Sarah Chen",
    hostWallet: "0x1234567890abcdef1234567890abcdef12345678",
    isVerified: true,
    discount: 30,
    instantBook: true,
  },
  {
    id: "2",
    title: "Modern Downtown Loft with City Views",
    location: "Tokyo, Japan",
    price: 180,
    originalPrice: 280,
    currency: "FLR" as const,
    rating: 4.7,
    reviews: 89,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    images: [
      "/modern-loft-tokyo-city-view.jpg",
      "/loft-interior-modern.jpg",
      "/tokyo-skyline-view.jpg",
    ],
    amenities: ["WiFi", "Kitchen", "Gym", "Air conditioning"],
    host: "Kenji Tanaka",
    hostWallet: "0x2345678901bcdef1234567890abcdef12345679",
    isVerified: true,
    discount: 35,
    instantBook: false,
  },
  {
    id: "3",
    title: "Cozy Mountain Cabin with Hot Tub",
    location: "Swiss Alps",
    price: 320,
    originalPrice: 480,
    currency: "XRP" as const,
    rating: 4.8,
    reviews: 156,
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    images: [
      "/mountain-cabin-swiss-alps.jpg",
      "/cabin-hot-tub-mountains.jpg",
      "/cozy-cabin-interior.png",
    ],
    amenities: ["WiFi", "Kitchen", "Heating", "Hot Tub"],
    host: "Hans Mueller",
    hostWallet: "0x3456789012cdef1234567890abcdef1234567a",
    isVerified: true,
    discount: 33,
    instantBook: true,
  },
  {
    id: "4",
    title: "Stylish Studio in Historic District",
    location: "Barcelona, Spain",
    price: 95,
    originalPrice: 140,
    currency: "FLR" as const,
    rating: 4.6,
    reviews: 203,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: [
      "/stylish-studio-barcelona-historic.jpg",
      "/barcelona-apartment-interior.jpg",
      "/historic-district-barcelona.jpg",
    ],
    amenities: ["WiFi", "Kitchen", "Air conditioning"],
    host: "Maria Rodriguez",
    hostWallet: "0x456789013def1234567890abcdef1234567ab",
    isVerified: false,
    discount: 32,
    instantBook: false,
  },
  {
    id: "5",
    title: "Oceanfront Penthouse with Infinity Pool",
    location: "Miami Beach, USA",
    price: 680,
    originalPrice: 950,
    currency: "XRP" as const,
    rating: 4.9,
    reviews: 78,
    guests: 10,
    bedrooms: 5,
    bathrooms: 4,
    images: [
      "/oceanfront-penthouse-miami-beach.jpg",
      "/infinity-pool-ocean-view.png",
      "/luxury-penthouse-interior.png",
    ],
    amenities: [
      "WiFi",
      "Pool",
      "Kitchen",
      "Parking",
      "Gym",
      "Air conditioning",
    ],
    host: "David Johnson",
    hostWallet: "0x56789014ef1234567890abcdef1234567abc",
    isVerified: true,
    discount: 28,
    instantBook: true,
  },
  {
    id: "6",
    title: "Traditional Ryokan with Garden Views",
    location: "Kyoto, Japan",
    price: 240,
    originalPrice: 350,
    currency: "FLR" as const,
    rating: 4.8,
    reviews: 134,
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    images: [
      "/traditional-ryokan-kyoto-garden.jpg",
      "/japanese-garden-ryokan.jpg",
      "/traditional-japanese-room.jpg",
    ],
    amenities: ["WiFi", "Kitchen", "Garden", "Traditional Bath"],
    host: "Yuki Sato",
    hostWallet: "0x6789015f1234567890abcdef1234567abcd",
    isVerified: true,
    discount: 31,
    instantBook: false,
  },
  {
    id: "7",
    title: "Desert Luxury Resort Villa",
    location: "Dubai, UAE",
    price: 520,
    originalPrice: 750,
    currency: "XRP" as const,
    rating: 4.7,
    reviews: 92,
    guests: 6,
    bedrooms: 3,
    bathrooms: 3,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    amenities: ["WiFi", "Pool", "Kitchen", "Parking", "Air conditioning"],
    host: "Ahmed Al-Mansouri",
    hostWallet: "0x789016f1234567890abcdef1234567abcde",
    isVerified: true,
    discount: 30,
    instantBook: true,
  },
  {
    id: "8",
    title: "English Countryside Cottage",
    location: "Cotswolds, UK",
    price: 160,
    originalPrice: 220,
    currency: "FLR" as const,
    rating: 4.5,
    reviews: 167,
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    amenities: ["WiFi", "Kitchen", "Garden", "Fireplace"],
    host: "Emma Thompson",
    hostWallet: "0x89017f1234567890abcdef1234567abcdef",
    isVerified: true,
    discount: 27,
    instantBook: false,
  },
  {
    id: "9",
    title: "Scandinavian Lakeside Cabin",
    location: "Stockholm, Sweden",
    price: 220,
    originalPrice: 310,
    currency: "XRP" as const,
    rating: 4.6,
    reviews: 112,
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    amenities: ["WiFi", "Kitchen", "Heating", "Sauna"],
    host: "Erik Lindqvist",
    hostWallet: "0x90128f1234567890abcdef1234567abcdef0",
    isVerified: true,
    discount: 29,
    instantBook: true,
  },
  {
    id: "10",
    title: "Moroccan Riad with Rooftop Terrace",
    location: "Marrakech, Morocco",
    price: 140,
    originalPrice: 200,
    currency: "FLR" as const,
    rating: 4.4,
    reviews: 98,
    guests: 8,
    bedrooms: 4,
    bathrooms: 2,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    amenities: ["WiFi", "Kitchen", "Air conditioning", "Terrace"],
    host: "Amina Benali",
    hostWallet: "0xa1239f1234567890abcdef1234567abcdef01",
    isVerified: true,
    discount: 30,
    instantBook: false,
  },
  {
    id: "11",
    title: "Australian Outback Lodge",
    location: "Uluru, Australia",
    price: 380,
    originalPrice: 520,
    currency: "XRP" as const,
    rating: 4.8,
    reviews: 76,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    amenities: ["WiFi", "Kitchen", "Air conditioning", "Stargazing"],
    host: "Jack Thompson",
    hostWallet: "0xb234af1234567890abcdef1234567abcdef02",
    isVerified: true,
    discount: 27,
    instantBook: true,
  },
  {
    id: "12",
    title: "Tuscan Vineyard Villa",
    location: "Tuscany, Italy",
    price: 420,
    originalPrice: 600,
    currency: "FLR" as const,
    rating: 4.9,
    reviews: 145,
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    amenities: ["WiFi", "Pool", "Kitchen", "Garden", "Wine Cellar"],
    host: "Giuseppe Rossi",
    hostWallet: "0xc345bf1234567890abcdef1234567abcdef03",
    isVerified: true,
    discount: 30,
    instantBook: false,
  },
  {
    id: "13",
    title: "Icelandic Glass Igloo",
    location: "Reykjavik, Iceland",
    price: 350,
    originalPrice: 480,
    currency: "XRP" as const,
    rating: 4.7,
    reviews: 89,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    amenities: ["WiFi", "Heating", "Northern Lights View"],
    host: "Björk Sigurdsson",
    hostWallet: "0xd456cf1234567890abcdef1234567abcdef04",
    isVerified: true,
    discount: 27,
    instantBook: true,
  },
  {
    id: "14",
    title: "Balinese Treehouse Retreat",
    location: "Ubud, Bali",
    price: 180,
    originalPrice: 250,
    currency: "FLR" as const,
    rating: 4.6,
    reviews: 123,
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    amenities: ["WiFi", "Kitchen", "Garden", "Yoga Platform"],
    host: "Made Wijaya",
    hostWallet: "0xe567df1234567890abcdef1234567abcdef05",
    isVerified: true,
    discount: 28,
    instantBook: false,
  },
  {
    id: "15",
    title: "Canadian Mountain Chalet",
    location: "Banff, Canada",
    price: 290,
    originalPrice: 420,
    currency: "XRP" as const,
    rating: 4.8,
    reviews: 167,
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    amenities: ["WiFi", "Kitchen", "Heating", "Fireplace", "Ski Access"],
    host: "Sarah MacDonald",
    hostWallet: "0xf678ef1234567890abcdef1234567abcdef06",
    isVerified: true,
    discount: 31,
    instantBook: true,
  },
  {
    id: "16",
    title: "Greek Island Villa",
    location: "Santorini, Greece",
    price: 480,
    originalPrice: 680,
    currency: "FLR" as const,
    rating: 4.9,
    reviews: 201,
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    amenities: ["WiFi", "Pool", "Kitchen", "Sea View"],
    host: "Dimitris Papadopoulos",
    hostWallet: "0x0789ff1234567890abcdef1234567abcdef07",
    isVerified: true,
    discount: 29,
    instantBook: false,
  },
  {
    id: "17",
    title: "New Zealand Coastal Cabin",
    location: "Queenstown, New Zealand",
    price: 240,
    originalPrice: 340,
    currency: "XRP" as const,
    rating: 4.7,
    reviews: 134,
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    amenities: ["WiFi", "Kitchen", "Heating", "Lake View"],
    host: "Emma Wilson",
    hostWallet: "0x189a0f1234567890abcdef1234567abcdef08",
    isVerified: true,
    discount: 29,
    instantBook: true,
  },
  {
    id: "18",
    title: "Brazilian Beach House",
    location: "Rio de Janeiro, Brazil",
    price: 320,
    originalPrice: 450,
    currency: "FLR" as const,
    rating: 4.5,
    reviews: 156,
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    images: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"],
    amenities: ["WiFi", "Pool", "Kitchen", "Beach Access"],
    host: "Carlos Silva",
    hostWallet: "0x29ab1f1234567890abcdef1234567abcdef09",
    isVerified: true,
    discount: 29,
    instantBook: false,
  },
];

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("recommended");
  const [displayedCount, setDisplayedCount] = useState(9);
  const [isLoading, setIsLoading] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);

  const handleFiltersChange = (filters: any) => {
    let filtered = [...mockProperties];

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter((property) =>
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filter by price range
    if (filters.priceRange) {
      filtered = filtered.filter((property) => {
        const price = property.price;
        return price >= filters.priceRange[0] && price <= filters.priceRange[1];
      });
    }

    // Filter by currency
    if (filters.currency && filters.currency !== "both") {
      filtered = filtered.filter(
        (property) => property.currency === filters.currency
      );
    }

    // Filter by property types
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filtered = filtered.filter((property) => {
        return filters.propertyTypes.includes(property.propertyType);
      });
    }

    // Filter by amenities
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter((property) =>
        filters.amenities.every((amenity: string) =>
          property.amenities.some((propAmenity) =>
            propAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        )
      );
    }

    // Filter by guests
    if (filters.guests) {
      filtered = filtered.filter(
        (property) => property.guests >= filters.guests
      );
    }

    setFilteredProperties(filtered);
    setDisplayedCount(9); // Reset to show first 9 properties when filters change
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    // Simulate loading delay for better UX
    setTimeout(() => {
      setDisplayedCount((prev) =>
        Math.min(prev + 9, filteredProperties.length)
      );
      setIsLoading(false);
    }, 500);
  };

  const sortProperties = (
    properties: typeof mockProperties,
    sortBy: string
  ) => {
    const sorted = [...properties];

    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price);
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price);
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating);
      case "reviews":
        return sorted.sort((a, b) => b.reviews - a.reviews);
      case "discount":
        return sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0));
      case "newest":
        // Sort by ID (assuming higher ID = newer property)
        return sorted.sort((a, b) => parseInt(b.id) - parseInt(a.id));
      case "recommended":
      default:
        // Recommended: Mix of rating, reviews, and discount
        return sorted.sort((a, b) => {
          const scoreA =
            a.rating * 0.4 +
            (a.reviews / 100) * 0.3 +
            ((a.discount || 0) / 100) * 0.3;
          const scoreB =
            b.rating * 0.4 +
            (b.reviews / 100) * 0.3 +
            ((b.discount || 0) / 100) * 0.3;
          return scoreB - scoreA;
        });
    }
  };

  const sortedProperties = sortProperties(filteredProperties, sortBy);
  const displayedProperties = sortedProperties.slice(0, displayedCount);
  const hasMoreProperties = displayedCount < filteredProperties.length;

  const setFilters = handleFiltersChange;

  const totalSavings = filteredProperties.reduce((sum, property) => {
    const savings = property.originalPrice
      ? property.originalPrice - property.price
      : 0;
    return sum + savings;
  }, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-16">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-6"
            >
              <Badge
                variant="outline"
                className="mb-4 text-primary border-primary/20"
              >
                Property Listings
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
                Discover Amazing
                <br />
                <span className="text-primary">Places to Stay</span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
                Browse verified properties with transparent pricing and save up
                to 50% compared to traditional booking platforms.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Simple Filters */}
        <div className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <PropertyFilters onFiltersChange={setFilters} />
          </motion.div>

          {/* Results Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center justify-between mb-8"
          >
            <div className="flex items-center gap-4">
              <span className="text-lg font-semibold">
                {displayedProperties.length} of {filteredProperties.length}{" "}
                properties shown
              </span>
              <Badge
                variant="secondary"
                className="bg-green-500/10 text-green-500 border-green-500/20"
              >
                Total savings: {totalSavings} XRP/FLR
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setDisplayedCount(9); // Reset to show first 9 properties when sorting changes
                }}
                className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
              >
                <option value="recommended">Recommended</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="reviews">Most Reviews</option>
                <option value="newest">Newest</option>
              </select>

              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Properties Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`grid gap-8 ${
              viewMode === "grid"
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1"
            }`}
          >
            {displayedProperties.map((property, index) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <PropertyCard property={property} viewMode={viewMode} />
              </motion.div>
            ))}
          </motion.div>

          {/* Load More */}
          {hasMoreProperties && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-center mt-12"
            >
              <Button
                variant="outline"
                size="lg"
                className="px-8 bg-transparent"
                onClick={handleLoadMore}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                    Loading...
                  </>
                ) : (
                  `Load More Properties (${
                    filteredProperties.length - displayedCount
                  } remaining)`
                )}
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
