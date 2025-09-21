"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X, MapPin, Calendar, Users, ChevronDown } from "lucide-react"
import { useState } from "react"

interface FilterState {
  location: string
  checkIn: string
  checkOut: string
  guests: number
  priceRange: [number, number]
  currency: "XRP" | "FLR" | "both"
  propertyTypes: string[]
  amenities: string[]
}

interface PropertyFiltersProps {
  onFiltersChange: (filters: FilterState) => void
}

export function PropertyFilters({ onFiltersChange }: PropertyFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showLocationDropdown, setShowLocationDropdown] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
    priceRange: [0, 1000],
    currency: "both",
    propertyTypes: [],
    amenities: [],
  })

  const availableLocations = [
    "Maldives",
    "Maldives, Indian Ocean",
    "Tokyo, Japan", 
    "Swiss Alps",
    "Swiss Alps, Switzerland",
    "Barcelona, Spain",
    "Miami Beach, USA",
    "Miami, FL",
    "Kyoto, Japan",
    "New York, NY",
    "Los Angeles, CA",
    "San Francisco, CA",
    "Chicago, IL",
    "Boston, MA",
    "Seattle, WA",
    "Austin, TX",
    "Denver, CO",
    "San Diego, CA",
    "Portland, OR",
    "Las Vegas, NV",
    "Philadelphia, PA",
    "Malibu, CA",
    "Aspen, CO",
    "Zermatt, Switzerland"
  ]

  const propertyTypes = ["Apartment", "House", "Villa", "Condo", "Loft", "Studio"]

  const amenities = [
    "WiFi",
    "Kitchen",
    "Parking",
    "Pool",
    "Gym",
    "Pet-friendly",
    "Air conditioning",
    "Heating",
    "Washer",
    "Dryer",
  ]

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters }
    setFilters(updated)
    onFiltersChange(updated)
  }

  const clearFilters = () => {
    const cleared: FilterState = {
      location: "",
      checkIn: "",
      checkOut: "",
      guests: 1,
      priceRange: [0, 1000],
      currency: "both",
      propertyTypes: [],
      amenities: [],
    }
    setFilters(cleared)
    onFiltersChange(cleared)
  }

  const togglePropertyType = (type: string) => {
    const updated = filters.propertyTypes.includes(type)
      ? filters.propertyTypes.filter((t) => t !== type)
      : [...filters.propertyTypes, type]
    updateFilters({ propertyTypes: updated })
  }

  const toggleAmenity = (amenity: string) => {
    const updated = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity]
    updateFilters({ amenities: updated })
  }

  const selectLocation = (location: string) => {
    updateFilters({ location })
    setShowLocationDropdown(false)
  }

  const filteredLocations = availableLocations.filter(location =>
    location.toLowerCase().includes(filters.location.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <Card className="p-6 bg-card border-border">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Where to?"
                value={filters.location}
                onChange={(e) => updateFilters({ location: e.target.value })}
                onFocus={() => setShowLocationDropdown(true)}
                onBlur={() => setTimeout(() => setShowLocationDropdown(false), 200)}
                className="pl-10 pr-10"
              />
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground cursor-pointer" 
                onClick={() => setShowLocationDropdown(!showLocationDropdown)} />
              
              {/* Location Dropdown */}
              {showLocationDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((location) => (
                      <button
                        key={location}
                        onClick={() => selectLocation(location)}
                        className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {location}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-muted-foreground text-sm">
                      No locations found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkin" className="text-sm font-medium">
              Check-in
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="checkin"
                type="date"
                value={filters.checkIn}
                onChange={(e) => updateFilters({ checkIn: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="checkout" className="text-sm font-medium">
              Check-out
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="checkout"
                type="date"
                value={filters.checkOut}
                onChange={(e) => updateFilters({ checkOut: e.target.value })}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="guests" className="text-sm font-medium">
              Guests
            </Label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="guests"
                type="number"
                min="1"
                max="16"
                value={filters.guests}
                onChange={(e) => updateFilters({ guests: Number.parseInt(e.target.value) || 1 })}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" onClick={() => setShowAdvanced(!showAdvanced)} className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Advanced Filters
          </Button>

          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground">
              Clear All
            </Button>
            <Button className="bg-primary hover:bg-primary/90">
              <Search className="mr-2 h-4 w-4" />
              Search Properties
            </Button>
          </div>
        </div>
      </Card>

      {/* Advanced Filters */}
      {showAdvanced && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="p-6 bg-card border-border space-y-6">
            {/* Price Range */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Price Range</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {filters.priceRange[0]} - {filters.priceRange[1]}
                  </Badge>
                  <select
                    value={filters.currency}
                    onChange={(e) => updateFilters({ currency: e.target.value as "XRP" | "FLR" | "both" })}
                    className="text-xs bg-background border border-border rounded px-2 py-1"
                  >
                    <option value="both">Both</option>
                    <option value="XRP">XRP</option>
                    <option value="FLR">FLR</option>
                  </select>
                </div>
              </div>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => updateFilters({ priceRange: value as [number, number] })}
                max={1000}
                min={0}
                step={10}
                className="w-full"
              />
            </div>

            {/* Property Types */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Property Type</Label>
              <div className="flex flex-wrap gap-2">
                {propertyTypes.map((type) => (
                  <Badge
                    key={type}
                    variant={filters.propertyTypes.includes(type) ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/20 transition-colors"
                    onClick={() => togglePropertyType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Amenities</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {amenities.map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={filters.amenities.includes(amenity)}
                      onCheckedChange={() => toggleAmenity(amenity)}
                    />
                    <Label htmlFor={amenity} className="text-sm cursor-pointer">
                      {amenity}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Active Filters */}
      {(filters.propertyTypes.length > 0 || filters.amenities.length > 0) && (
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">Active filters:</span>
            {filters.propertyTypes.map((type) => (
              <Badge key={type} variant="secondary" className="flex items-center gap-1">
                {type}
                <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => togglePropertyType(type)} />
              </Badge>
            ))}
            {filters.amenities.map((amenity) => (
              <Badge key={amenity} variant="secondary" className="flex items-center gap-1">
                {amenity}
                <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => toggleAmenity(amenity)} />
              </Badge>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
