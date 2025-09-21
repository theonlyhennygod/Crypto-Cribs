"use client"

import { motion } from "framer-motion"
import { PropertyCard } from "./property-card"
import { PropertyFilters } from "./property-filters"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Grid, List } from "lucide-react"

// Mock property data
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
    propertyType: "Villa",
    images: ["/luxury-beachfront-villa-maldives.jpg", "/villa-pool-maldives.jpg", "/villa-bedroom-luxury.jpg"],
    amenities: ["WiFi", "Pool", "Kitchen", "Parking", "Air conditioning"],
    host: "Sarah Chen",
    isVerified: true,
    discount: 30,
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
    propertyType: "Loft",
    images: ["/modern-loft-tokyo-city-view.jpg", "/loft-interior-modern.jpg", "/tokyo-skyline-view.jpg"],
    amenities: ["WiFi", "Kitchen", "Gym", "Air conditioning"],
    host: "Kenji Tanaka",
    isVerified: true,
    discount: 35,
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
    propertyType: "House",
    images: ["/mountain-cabin-swiss-alps.jpg", "/cabin-hot-tub-mountains.jpg", "/cozy-cabin-interior.png"],
    amenities: ["WiFi", "Kitchen", "Heating", "Hot Tub"],
    host: "Hans Mueller",
    isVerified: true,
    discount: 33,
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
    propertyType: "Studio",
    images: ["/stylish-studio-barcelona-historic.jpg", "/barcelona-apartment-interior.jpg", "/historic-district-barcelona.jpg"],
    amenities: ["WiFi", "Kitchen", "Air conditioning"],
    host: "Maria Rodriguez",
    isVerified: false,
    discount: 32,
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
    propertyType: "Condo",
    images: ["/oceanfront-penthouse-miami-beach.jpg", "/infinity-pool-ocean-view.png", "/luxury-penthouse-interior.png"],
    amenities: ["WiFi", "Pool", "Kitchen", "Parking", "Gym", "Air conditioning"],
    host: "David Johnson",
    isVerified: true,
    discount: 28,
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
    propertyType: "House",
    images: ["/traditional-ryokan-kyoto-garden.jpg", "/japanese-garden-ryokan.jpg", "/traditional-japanese-room.jpg"],
    amenities: ["WiFi", "Kitchen", "Garden", "Traditional Bath"],
    host: "Yuki Sato",
    isVerified: true,
    discount: 31,
  },
  // US Cities Properties
  {
    id: "7",
    title: "Luxury Manhattan Penthouse with City Views",
    location: "New York, NY",
    price: 520,
    originalPrice: 750,
    currency: "XRP" as const,
    rating: 4.9,
    reviews: 89,
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "Condo",
    images: ["/luxury-penthouse-interior.png", "/modern-penthouse.png", "/tokyo-skyline-view.jpg"],
    amenities: ["WiFi", "Kitchen", "Gym", "Air conditioning", "City View"],
    host: "Michael Chen",
    isVerified: true,
    discount: 30,
  },
  {
    id: "8",
    title: "Modern Loft in Downtown LA",
    location: "Los Angeles, CA",
    price: 380,
    originalPrice: 520,
    currency: "XRP" as const,
    rating: 4.7,
    reviews: 156,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "Loft",
    images: ["/loft-interior-modern.jpg", "/modern-loft-tokyo-city-view.jpg", "/tokyo-cityscape-neon-lights.jpg"],
    amenities: ["WiFi", "Kitchen", "Parking", "Air conditioning", "Workspace"],
    host: "Sarah Williams",
    isVerified: true,
    discount: 27,
  },
  {
    id: "9",
    title: "Charming Victorian House in San Francisco",
    location: "San Francisco, CA",
    price: 420,
    originalPrice: 580,
    currency: "XRP" as const,
    rating: 4.8,
    reviews: 203,
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "House",
    images: ["/barcelona-apartment-interior.jpg", "/historic-district-barcelona.jpg", "/mountain-cabin-retreat.png"],
    amenities: ["WiFi", "Kitchen", "Parking", "Heating", "Garden"],
    host: "David Rodriguez",
    isVerified: true,
    discount: 28,
  },
  {
    id: "10",
    title: "Luxury Apartment in Chicago Loop",
    location: "Chicago, IL",
    price: 290,
    originalPrice: 420,
    currency: "FLR" as const,
    rating: 4.6,
    reviews: 127,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "Apartment",
    images: ["/modern-loft-tokyo-city-view.jpg", "/luxury-penthouse-interior.png", "/tokyo-cityscape-neon-lights.jpg"],
    amenities: ["WiFi", "Kitchen", "Gym", "Air conditioning", "City View"],
    host: "Jennifer Martinez",
    isVerified: true,
    discount: 31,
  },
  {
    id: "11",
    title: "Historic Brownstone in Boston",
    location: "Boston, MA",
    price: 350,
    originalPrice: 480,
    currency: "XRP" as const,
    rating: 4.7,
    reviews: 94,
    guests: 5,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "House",
    images: ["/historic-district-barcelona.jpg", "/barcelona-apartment-interior.jpg", "/stylish-studio-barcelona-historic.jpg"],
    amenities: ["WiFi", "Kitchen", "Heating", "Garden", "Parking"],
    host: "Robert Thompson",
    isVerified: true,
    discount: 27,
  },
  {
    id: "12",
    title: "Modern Studio in Seattle Downtown",
    location: "Seattle, WA",
    price: 180,
    originalPrice: 260,
    currency: "FLR" as const,
    rating: 4.5,
    reviews: 78,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    propertyType: "Studio",
    images: ["/stylish-studio-barcelona-historic.jpg", "/modern-penthouse.png", "/tokyo-skyline-view.jpg"],
    amenities: ["WiFi", "Kitchen", "Air conditioning", "Workspace"],
    host: "Lisa Anderson",
    isVerified: true,
    discount: 31,
  },
  {
    id: "13",
    title: "Luxury Condo in Austin Downtown",
    location: "Austin, TX",
    price: 320,
    originalPrice: 450,
    currency: "XRP" as const,
    rating: 4.8,
    reviews: 145,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "Condo",
    images: ["/modern-penthouse.png", "/infinity-pool-ocean-view.png", "/tokyo-skyline-view.jpg"],
    amenities: ["WiFi", "Kitchen", "Pool", "Gym", "Air conditioning"],
    host: "James Wilson",
    isVerified: true,
    discount: 29,
  },
  {
    id: "14",
    title: "Cozy Cabin in Denver Mountains",
    location: "Denver, CO",
    price: 280,
    originalPrice: 380,
    currency: "XRP" as const,
    rating: 4.6,
    reviews: 112,
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    propertyType: "House",
    images: ["/mountain-cabin-swiss-alps.jpg", "/cabin-hot-tub-mountains.jpg", "/cozy-cabin-interior.png"],
    amenities: ["WiFi", "Kitchen", "Heating", "Hot Tub", "Mountain View"],
    host: "Amanda Davis",
    isVerified: true,
    discount: 26,
  },
  {
    id: "15",
    title: "Beachfront Villa in San Diego",
    location: "San Diego, CA",
    price: 480,
    originalPrice: 680,
    currency: "XRP" as const,
    rating: 4.9,
    reviews: 167,
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    propertyType: "Villa",
    images: ["/luxury-beachfront-villa-maldives.jpg", "/villa-pool-maldives.jpg", "/villa-bedroom-luxury.jpg"],
    amenities: ["WiFi", "Pool", "Kitchen", "Parking", "Beach Access", "Air conditioning"],
    host: "Carlos Mendez",
    isVerified: true,
    discount: 29,
  },
  {
    id: "16",
    title: "Modern Apartment in Portland Pearl District",
    location: "Portland, OR",
    price: 220,
    originalPrice: 320,
    currency: "FLR" as const,
    rating: 4.5,
    reviews: 89,
    guests: 3,
    bedrooms: 1,
    bathrooms: 1,
    propertyType: "Apartment",
    images: ["/barcelona-apartment-interior.jpg", "/mountain-cabin-retreat.png", "/cozy-cabin-interior.png"],
    amenities: ["WiFi", "Kitchen", "Air conditioning", "Workspace"],
    host: "Rachel Green",
    isVerified: true,
    discount: 31,
  },
  {
    id: "17",
    title: "Luxury Penthouse in Las Vegas Strip",
    location: "Las Vegas, NV",
    price: 450,
    originalPrice: 650,
    currency: "XRP" as const,
    rating: 4.7,
    reviews: 134,
    guests: 6,
    bedrooms: 3,
    bathrooms: 3,
    propertyType: "Condo",
    images: ["/oceanfront-penthouse-miami-beach.jpg", "/infinity-pool-ocean-view.png", "/modern-penthouse.png"],
    amenities: ["WiFi", "Pool", "Kitchen", "Gym", "Air conditioning", "City View"],
    host: "Anthony Vegas",
    isVerified: true,
    discount: 31,
  },
  {
    id: "18",
    title: "Historic Townhouse in Philadelphia",
    location: "Philadelphia, PA",
    price: 260,
    originalPrice: 380,
    currency: "FLR" as const,
    rating: 4.4,
    reviews: 76,
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    propertyType: "House",
    images: ["/historic-district-barcelona.jpg", "/mountain-cabin-retreat.png", "/cozy-cabin-interior.png"],
    amenities: ["WiFi", "Kitchen", "Heating", "Parking", "Garden"],
    host: "Patricia Brown",
    isVerified: true,
    discount: 32,
  },
]

export function PropertiesSection() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredProperties, setFilteredProperties] = useState(mockProperties)
  const [sortBy, setSortBy] = useState("recommended")
  const [displayedCount, setDisplayedCount] = useState(9)
  const [isLoading, setIsLoading] = useState(false)

  const handleFiltersChange = (filters: any) => {
    let filtered = [...mockProperties]

    // Filter by location
    if (filters.location) {
      filtered = filtered.filter(property =>
        property.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Filter by price range
    if (filters.priceRange) {
      filtered = filtered.filter(property => {
        const price = property.price
        return price >= filters.priceRange[0] && price <= filters.priceRange[1]
      })
    }

    // Filter by currency
    if (filters.currency && filters.currency !== "both") {
      filtered = filtered.filter(property => property.currency === filters.currency)
    }

    // Filter by property types
    if (filters.propertyTypes && filters.propertyTypes.length > 0) {
      filtered = filtered.filter(property => {
        return filters.propertyTypes.includes(property.propertyType)
      })
    }

    // Filter by amenities
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(property =>
        filters.amenities.every((amenity: string) =>
          property.amenities.some(propAmenity =>
            propAmenity.toLowerCase().includes(amenity.toLowerCase())
          )
        )
      )
    }

    // Filter by guests
    if (filters.guests) {
      filtered = filtered.filter(property => property.guests >= filters.guests)
    }

    setFilteredProperties(filtered)
    setDisplayedCount(9) // Reset to show first 9 properties when filters change
  }

  const handleLoadMore = () => {
    setIsLoading(true)
    // Simulate loading delay for better UX
    setTimeout(() => {
      setDisplayedCount(prev => Math.min(prev + 9, filteredProperties.length))
      setIsLoading(false)
    }, 500)
  }

  const sortProperties = (properties: typeof mockProperties, sortBy: string) => {
    const sorted = [...properties]
    
    switch (sortBy) {
      case "price-low":
        return sorted.sort((a, b) => a.price - b.price)
      case "price-high":
        return sorted.sort((a, b) => b.price - a.price)
      case "rating":
        return sorted.sort((a, b) => b.rating - a.rating)
      case "reviews":
        return sorted.sort((a, b) => b.reviews - a.reviews)
      case "discount":
        return sorted.sort((a, b) => (b.discount || 0) - (a.discount || 0))
      case "newest":
        // Sort by ID (assuming higher ID = newer property)
        return sorted.sort((a, b) => parseInt(b.id) - parseInt(a.id))
      case "recommended":
      default:
        // Recommended: Mix of rating, reviews, and discount
        return sorted.sort((a, b) => {
          const scoreA = (a.rating * 0.4) + (a.reviews / 100 * 0.3) + ((a.discount || 0) / 100 * 0.3)
          const scoreB = (b.rating * 0.4) + (b.reviews / 100 * 0.3) + ((b.discount || 0) / 100 * 0.3)
          return scoreB - scoreA
        })
    }
  }

  const sortedProperties = sortProperties(filteredProperties, sortBy)
  const displayedProperties = sortedProperties.slice(0, displayedCount)
  const hasMoreProperties = displayedCount < filteredProperties.length

  const totalSavings = filteredProperties.reduce((sum, property) => {
    const savings = property.originalPrice ? property.originalPrice - property.price : 0
    return sum + savings
  }, 0)

  return (
    <section id="properties" className="py-24 bg-background">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="outline" className="mb-4 text-primary border-primary/20">
            Property Listings
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold mb-6 text-balance">
            Discover Amazing
            <br />
            <span className="text-primary">Places to Stay</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Browse verified properties with transparent pricing and save up to 50% compared to traditional booking
            platforms.
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-8"
        >
          <PropertyFilters onFiltersChange={handleFiltersChange} />
        </motion.div>

        {/* Results Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <span className="text-lg font-semibold">{displayedProperties.length} of {filteredProperties.length} properties shown</span>
            <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
              Total savings: {totalSavings} XRP/FLR
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value)
                setDisplayedCount(9) // Reset to show first 9 properties when sorting changes
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
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
        >
          {displayedProperties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </motion.div>

        {/* Load More */}
        {hasMoreProperties && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
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
                `Load More Properties (${filteredProperties.length - displayedCount} remaining)`
              )}
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
