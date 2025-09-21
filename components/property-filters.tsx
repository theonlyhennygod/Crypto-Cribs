"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Users, Home } from "lucide-react"

interface FilterState {
  priceRange: [number, number]
  currency: string
  guests: number
  bedrooms: number
  amenities: string[]
  instantBook: boolean
  verifiedOnly: boolean
  minRating: number
}

interface PropertyFiltersProps {
  filters?: FilterState
  onFiltersChange: (filters: FilterState) => void
}

export function PropertyFilters({ filters, onFiltersChange }: PropertyFiltersProps) {
  const availableAmenities = [
    "WiFi",
    "Kitchen", 
    "Parking",
    "Pool",
    "Gym",
    "Air conditioning",
    "Heating",
    "Hot Tub",
    "Garden"
  ]

  // Provide default values if filters is undefined
  const safeFilters = filters || {
    priceRange: [0, 1000] as [number, number],
    currency: "all",
    guests: 1,
    bedrooms: 0,
    amenities: [],
    instantBook: false,
    verifiedOnly: false,
    minRating: 0
  }

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...safeFilters, ...updates })
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Price Range */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Price Range</Label>
        <div className="px-3">
          <Slider
            value={safeFilters.priceRange}
            onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
            max={1000}
            min={0}
            step={10}
            className="w-full"
          />
        </div>
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{safeFilters.priceRange[0]} crypto</span>
          <span>{safeFilters.priceRange[1]} crypto</span>
        </div>
      </div>

      {/* Currency */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Currency</Label>
        <Select value={safeFilters.currency} onValueChange={(value) => updateFilters({ currency: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Currencies</SelectItem>
            <SelectItem value="XRP">XRP Only</SelectItem>
            <SelectItem value="FLR">FLR Only</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Guests */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Guests</Label>
        <Select value={safeFilters.guests.toString()} onValueChange={(value) => updateFilters({ guests: parseInt(value) })}>
          <SelectTrigger>
            <Users className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1,2,3,4,5,6,7,8,9,10].map(num => (
              <SelectItem key={num} value={num.toString()}>{num} {num === 1 ? 'Guest' : 'Guests'}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Bedrooms */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Bedrooms</Label>
        <Select value={safeFilters.bedrooms.toString()} onValueChange={(value) => updateFilters({ bedrooms: parseInt(value) })}>
          <SelectTrigger>
            <Home className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="0">Any</SelectItem>
            {[1,2,3,4,5].map(num => (
              <SelectItem key={num} value={num.toString()}>{num}+ {num === 1 ? 'Bedroom' : 'Bedrooms'}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Minimum Rating</Label>
        <div className="flex gap-1">
          {[0, 3, 4, 4.5, 4.8].map((rating) => (
            <Button
              key={rating}
              variant={safeFilters.minRating === rating ? "default" : "outline"}
              size="sm"
              onClick={() => updateFilters({ minRating: rating })}
              className="flex items-center gap-1"
            >
              <Star className="h-3 w-3" />
              {rating === 0 ? 'Any' : rating}
            </Button>
          ))}
        </div>
      </div>

      {/* Quick Filters */}
      <div className="space-y-3">
        <Label className="text-sm font-medium">Quick Filters</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="instantBook"
              checked={safeFilters.instantBook}
              onCheckedChange={(checked) => updateFilters({ instantBook: !!checked })}
            />
            <Label htmlFor="instantBook" className="text-sm">Instant Book</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="verified"
              checked={safeFilters.verifiedOnly}
              onCheckedChange={(checked) => updateFilters({ verifiedOnly: !!checked })}
            />
            <Label htmlFor="verified" className="text-sm">Verified Hosts Only</Label>
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="space-y-3 md:col-span-2">
        <Label className="text-sm font-medium">Amenities</Label>
        <div className="flex flex-wrap gap-2">
          {availableAmenities.map((amenity) => (
            <Badge
              key={amenity}
              variant={safeFilters.amenities.includes(amenity) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                const newAmenities = safeFilters.amenities.includes(amenity)
                  ? safeFilters.amenities.filter(a => a !== amenity)
                  : [...safeFilters.amenities, amenity]
                updateFilters({ amenities: newAmenities })
              }}
            >
              {amenity}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}
