"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin, Users, Wifi, Car, Coffee, Heart } from "lucide-react"
import { useState } from "react"

interface PropertyCardProps {
  property: {
    id: string
    title: string
    location: string
    price: number
    originalPrice?: number
    currency: "XRP" | "FLR"
    rating: number
    reviews: number
    guests: number
    bedrooms: number
    bathrooms: number
    images: string[]
    amenities: string[]
    host: string
    hostWallet?: string
    isVerified: boolean
    discount?: number
    instantBook?: boolean
    tags?: string[]
  }
  viewMode?: "grid" | "list"
}

export function PropertyCard({ property, viewMode = "grid" }: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const savings = property.originalPrice ? property.originalPrice - property.price : 0

  if (viewMode === "list") {
    return (
      <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.3 }}>
        <Card className="overflow-hidden bg-card border-border hover:border-primary/20 transition-all duration-300 group">
          <div className="flex flex-col md:flex-row">
            {/* Image */}
            <div className="relative md:w-80 aspect-[4/3] md:aspect-square overflow-hidden">
              <img
                src={property.images[currentImageIndex] || "/placeholder.svg"}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              
              {/* Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-2">
                {property.discount && (
                  <Badge className="bg-green-500 hover:bg-green-600 text-white">
                    -{property.discount}%
                  </Badge>
                )}
                {property.instantBook && (
                  <Badge variant="secondary">
                    Instant Book
                  </Badge>
                )}
              </div>

              {/* Favorite Button */}
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-3 right-3 bg-white/90 hover:bg-white text-gray-600 hover:text-red-500"
                onClick={() => setIsFavorited(!isFavorited)}
              >
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-lg font-semibold mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                    {property.title}
                  </h3>
                  <div className="flex items-center text-muted-foreground text-sm mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {property.price} {property.currency}
                    </span>
                    {property.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        {property.originalPrice}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">per night</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                  {property.rating} ({property.reviews} reviews)
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1" />
                  {property.guests} guests
                </div>
                <div>{property.bedrooms} bed • {property.bathrooms} bath</div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {property.amenities.slice(0, 4).map((amenity) => (
                  <Badge key={amenity} variant="outline" className="text-xs">
                    {amenity}
                  </Badge>
                ))}
                {property.amenities.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{property.amenities.length - 4} more
                  </Badge>
                )}
              </div>

              <div className="flex justify-between items-center">
                <div className="text-sm">
                  <span className="text-muted-foreground">Hosted by </span>
                  <span className="font-medium">{property.host}</span>
                  {property.isVerified && (
                    <Badge variant="secondary" className="ml-2 text-xs">
                      ✓ Verified
                    </Badge>
                  )}
                </div>
                <Button asChild>
                  <a href={`/property/${property.id}`}>
                    View Details
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div whileHover={{ y: -8, scale: 1.02 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden bg-card border-border hover:border-primary/20 transition-all duration-300 group h-full flex flex-col">
        {/* Image Carousel */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={property.images[currentImageIndex] || "/placeholder.svg"}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Image Navigation Dots */}
          {property.images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1">
              {property.images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex ? "bg-white" : "bg-white/50 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          )}

          {/* Favorite Button */}
          <button
            onClick={() => setIsFavorited(!isFavorited)}
            className="absolute top-3 right-3 p-2 rounded-full bg-black/20 backdrop-blur-sm hover:bg-black/40 transition-colors"
          >
            <Heart className={`h-4 w-4 ${isFavorited ? "fill-red-500 text-red-500" : "text-white"}`} />
          </button>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {property.discount && (
              <Badge className="bg-primary text-primary-foreground">-{property.discount}%</Badge>
            )}
            {property.instantBook && (
              <Badge variant="secondary" className="bg-blue-500/90 text-white">
                Instant Book
              </Badge>
            )}
          </div>

          {/* Verified Badge */}
          {property.isVerified && (
            <Badge variant="secondary" className="absolute bottom-3 right-3 bg-green-500/90 text-white">
              ✓ Verified
            </Badge>
          )}
        </div>

        <div className="p-6 space-y-4 flex-grow flex flex-col">
          {/* Location & Rating */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{property.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{property.rating}</span>
              <span className="text-sm text-muted-foreground">({property.reviews})</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors h-14 flex items-center">
            {property.title}
          </h3>

          {/* Property Details */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{property.guests} guests</span>
            </div>
            <div>{property.bedrooms} bed</div>
            <div>{property.bathrooms} bath</div>
          </div>

          {/* Amenities */}
          <div className="flex items-start gap-2 flex-grow min-h-[2rem]">
            {property.amenities.slice(0, 3).map((amenity) => {
              const icons: Record<string, any> = {
                WiFi: Wifi,
                Parking: Car,
                Kitchen: Coffee,
              }
              const Icon = icons[amenity] || Wifi
              return (
                <div key={amenity} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Icon className="h-3 w-3" />
                  <span>{amenity}</span>
                </div>
              )
            })}
            {property.amenities.length > 3 && (
              <span className="text-xs text-muted-foreground">+{property.amenities.length - 3} more</span>
            )}
          </div>

          {/* Pricing */}
          <div className="space-y-2 mt-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  {property.price} {property.currency}
                </span>
                {property.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {property.originalPrice} {property.currency}
                  </span>
                )}
              </div>
              <span className="text-sm text-muted-foreground">per night</span>
            </div>

            {savings > 0 && (
              <div className="text-sm text-green-500 font-medium">
                Save {savings} {property.currency} vs traditional platforms
              </div>
            )}
          </div>

          {/* Host Info */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <span className="text-sm text-muted-foreground">Hosted by {property.host}</span>
            <Button
              size="sm"
              className="bg-primary hover:bg-primary/90"
              onClick={() => (window.location.href = `/property/${property.id}`)}
            >
              Book Now
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
