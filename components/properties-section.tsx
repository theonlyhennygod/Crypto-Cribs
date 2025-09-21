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
    images: ["/traditional-ryokan-kyoto-garden.jpg", "/japanese-garden-ryokan.jpg", "/traditional-japanese-room.jpg"],
    amenities: ["WiFi", "Kitchen", "Garden", "Traditional Bath"],
    host: "Yuki Sato",
    isVerified: true,
    discount: 31,
  },
]

export function PropertiesSection() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [filteredProperties, setFilteredProperties] = useState(mockProperties)
  const [sortBy, setSortBy] = useState("recommended")

  const handleFiltersChange = (filters: any) => {
    // In a real app, this would filter the properties based on the filters
    // For now, we'll just keep all properties
    setFilteredProperties(mockProperties)
  }

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
            <span className="text-lg font-semibold">{filteredProperties.length} properties found</span>
            <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">
              Total savings: {totalSavings} XRP/FLR
            </Badge>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
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
          {filteredProperties.map((property, index) => (
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Button variant="outline" size="lg" className="px-8 bg-transparent">
            Load More Properties
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
