"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Navigation } from "@/components/navigation"
import { PropertyCard } from "@/components/property-card"
import { PropertyFilters } from "@/components/property-filters"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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
  Coins
} from "lucide-react"

// Extended mock property data
const mockProperties = [
  {
    id: "1",
    title: "Luxury Beachfront Villa",
    location: "Maldives",
    price: 450,
    originalPrice: 650,
    currency: "XRP" as const,
    rating: 4.9,
    reviews: 127,
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    images: ["/luxury-beachfront-villa-maldives.jpg", "/villa-pool-maldives.jpg", "/villa-bedroom-luxury.jpg"],
    amenities: ["WiFi", "Pool", "Kitchen", "Parking", "Air conditioning"],
    host: "Sarah Chen",
    hostWallet: "0x1234567890abcdef1234567890abcdef12345678",
    isVerified: true,
    discount: 30,
    instantBook: true,
    tags: ["Beachfront", "Luxury", "Family-Friendly"],
    coordinates: { lat: 3.2028, lng: 73.2207 }
  },
  {
    id: "2",
    title: "Modern Downtown Loft",
    location: "Tokyo, Japan",
    price: 180,
    originalPrice: 280,
    currency: "FLR" as const,
    rating: 4.7,
    reviews: 89,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    images: ["/modern-loft-tokyo-city-view.jpg", "/loft-interior-modern.jpg", "/tokyo-skyline-view.jpg"],
    amenities: ["WiFi", "Kitchen", "Gym", "Air conditioning"],
    host: "Kenji Tanaka",
    hostWallet: "0x2345678901bcdef1234567890abcdef12345679",
    isVerified: true,
    discount: 35,
    instantBook: false,
    tags: ["City", "Modern", "Business Travel"],
    coordinates: { lat: 35.6762, lng: 139.6503 }
  },
  {
    id: "3",
    title: "Mountain Cabin Retreat",
    location: "Swiss Alps",
    price: 320,
    originalPrice: 480,
    currency: "XRP" as const,
    rating: 4.8,
    reviews: 156,
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    images: ["/mountain-cabin-swiss-alps.jpg", "/cabin-hot-tub-mountains.jpg", "/cozy-cabin-interior.png"],
    amenities: ["WiFi", "Kitchen", "Heating", "Hot Tub"],
    host: "Hans Mueller",
    hostWallet: "0x3456789012cdef1234567890abcdef1234567a",
    isVerified: true,
    discount: 33,
    instantBook: true,
    tags: ["Mountain", "Cozy", "Hot Tub"],
    coordinates: { lat: 46.2044, lng: 6.1432 }
  },
  {
    id: "4",
    title: "Historic District Studio",
    location: "Barcelona, Spain",
    price: 95,
    originalPrice: 140,
    currency: "FLR" as const,
    rating: 4.6,
    reviews: 203,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    images: ["/stylish-studio-barcelona-historic.jpg", "/barcelona-apartment-interior.jpg", "/historic-district-barcelona.jpg"],
    amenities: ["WiFi", "Kitchen", "Air conditioning"],
    host: "Maria Rodriguez",
    hostWallet: "0x456789013def1234567890abcdef1234567ab",
    isVerified: false,
    discount: 32,
    instantBook: false,
    tags: ["Historic", "Studio", "City Center"],
    coordinates: { lat: 41.3851, lng: 2.1734 }
  },
  {
    id: "5",
    title: "Oceanfront Penthouse",
    location: "Miami Beach, USA",
    price: 680,
    originalPrice: 950,
    currency: "XRP" as const,
    rating: 4.9,
    reviews: 78,
    guests: 10,
    bedrooms: 5,
    bathrooms: 4,
    images: ["/oceanfront-penthouse-miami-beach.jpg", "/infinity-pool-ocean-view.png", "/luxury-penthouse-interior.png"],
    amenities: ["WiFi", "Pool", "Kitchen", "Parking", "Gym", "Air conditioning"],
    host: "David Johnson",
    hostWallet: "0x56789014ef1234567890abcdef1234567abc",
    isVerified: true,
    discount: 28,
    instantBook: true,
    tags: ["Oceanfront", "Luxury", "Penthouse"],
    coordinates: { lat: 25.7617, lng: -80.1918 }
  },
  {
    id: "6",
    title: "Traditional Japanese Ryokan",
    location: "Kyoto, Japan",
    price: 240,
    originalPrice: 350,
    currency: "FLR" as const,
    rating: 4.8,
    reviews: 134,
    guests: 4,
    bedrooms: 2,
    bathrooms: 1,
    images: ["/traditional-ryokan-kyoto-garden.jpg", "/japanese-garden-ryokan.jpg", "/traditional-japanese-room.jpg"],
    amenities: ["WiFi", "Kitchen", "Garden", "Traditional Bath"],
    host: "Yuki Sato",
    hostWallet: "0x6789015f1234567890abcdef1234567abcd",
    isVerified: true,
    discount: 31,
    instantBook: false,
    tags: ["Traditional", "Garden", "Cultural"],
    coordinates: { lat: 35.0116, lng: 135.7681 }
  },
  {
    id: "7",
    title: "Desert Luxury Resort",
    location: "Dubai, UAE",
    price: 520,
    originalPrice: 750,
    currency: "XRP" as const,
    rating: 4.7,
    reviews: 92,
    guests: 6,
    bedrooms: 3,
    bathrooms: 3,
    images: ["/desert-oasis-resort-dubai.jpg", "/luxury-spa-desert.jpg", "/dubai-skyline-resort.jpg"],
    amenities: ["WiFi", "Pool", "Spa", "Kitchen", "Parking", "Air conditioning"],
    host: "Ahmed Al-Mansouri",
    hostWallet: "0x789016f1234567890abcdef1234567abcde",
    isVerified: true,
    discount: 30,
    instantBook: true,
    tags: ["Desert", "Luxury", "Spa"],
    coordinates: { lat: 25.2048, lng: 55.2708 }
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
    images: ["/charming-cottage-cotswolds.jpg", "/english-countryside-cottage.jpg", "/cozy-cottage-interior.jpg"],
    amenities: ["WiFi", "Kitchen", "Garden", "Fireplace"],
    host: "Emma Thompson",
    hostWallet: "0x89017f1234567890abcdef1234567abcdef",
    isVerified: true,
    discount: 27,
    instantBook: false,
    tags: ["Countryside", "Charming", "Historic"],
    coordinates: { lat: 51.8330, lng: -1.8433 }
  }
]

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recommended")
  const [filters, setFilters] = useState({
    priceRange: [0, 1000],
    currency: "all",
    guests: 1,
    bedrooms: 0,
    amenities: [] as string[],
    instantBook: false,
    verifiedOnly: false,
    minRating: 0
  })
  const [showFilters, setShowFilters] = useState(false)

  // Filter and sort properties
  const filteredAndSortedProperties = useMemo(() => {
    let filtered = mockProperties.filter(property => {
      // Search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        const matchesSearch = property.title.toLowerCase().includes(searchLower) ||
                            property.location.toLowerCase().includes(searchLower) ||
                            property.tags.some(tag => tag.toLowerCase().includes(searchLower))
        if (!matchesSearch) return false
      }

      // Price filter
      if (property.price < filters.priceRange[0] || property.price > filters.priceRange[1]) {
        return false
      }

      // Currency filter
      if (filters.currency !== "all" && property.currency !== filters.currency) {
        return false
      }

      // Guests filter
      if (property.guests < filters.guests) {
        return false
      }

      // Bedrooms filter
      if (filters.bedrooms > 0 && property.bedrooms < filters.bedrooms) {
        return false
      }

      // Instant book filter
      if (filters.instantBook && !property.instantBook) {
        return false
      }

      // Verified only filter
      if (filters.verifiedOnly && !property.isVerified) {
        return false
      }

      // Rating filter
      if (property.rating < filters.minRating) {
        return false
      }

      return true
    })

    // Sort properties
    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-high":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "rating":
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case "reviews":
        filtered.sort((a, b) => b.reviews - a.reviews)
        break
      case "discount":
        filtered.sort((a, b) => b.discount - a.discount)
        break
      default:
        // Keep original order for "recommended"
        break
    }

    return filtered
  }, [searchQuery, filters, sortBy])

  const totalSavings = filteredAndSortedProperties.reduce((sum, property) => {
    const savings = property.originalPrice ? property.originalPrice - property.price : 0
    return sum + savings
  }, 0)

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-20">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 py-12">
          <div className="container mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-4"
            >
              <h1 className="text-4xl md:text-5xl font-bold">Explore Properties</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover unique accommodations worldwide with crypto payments and transparent pricing
              </p>
              
              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mt-8">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    placeholder="Search by location, property name, or amenities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-6 text-lg"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            {/* Results Info */}
            <div className="flex items-center gap-4">
              <div>
                <p className="text-lg font-semibold">
                  {filteredAndSortedProperties.length} properties found
                </p>
                {totalSavings > 0 && (
                  <p className="text-sm text-green-600">
                    Total savings: {totalSavings} crypto vs traditional platforms
                  </p>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Filters Toggle */}
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="gap-2"
              >
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </Button>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recommended">Recommended</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="discount">Best Discounts</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border rounded-lg">
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
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card>
                <CardContent className="p-6">
                  <PropertyFilters
                    filters={filters}
                    onFiltersChange={setFilters}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Properties Grid/List */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {filteredAndSortedProperties.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No properties found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or filters
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery("")
                    setFilters({
                      priceRange: [0, 1000],
                      currency: "all",
                      guests: 1,
                      bedrooms: 0,
                      amenities: [],
                      instantBook: false,
                      verifiedOnly: false,
                      minRating: 0
                    })
                  }}
                >
                  Clear all filters
                </Button>
              </div>
            ) : (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }>
                {filteredAndSortedProperties.map((property, index) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PropertyCard 
                      property={property} 
                      viewMode={viewMode}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Load More Button (for pagination in real app) */}
          {filteredAndSortedProperties.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Properties
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
