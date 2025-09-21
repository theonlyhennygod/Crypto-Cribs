"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  Search,
  MapPin,
  Users,
  Home,
  Sliders,
  ChevronDown,
  X,
} from "lucide-react";

interface PropertyFiltersProps {
  onFiltersChange?: (filters: any) => void;
}

export function PropertyFilters({ onFiltersChange }: PropertyFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    priceRange: [0, 1000] as [number, number],
    currency: "both",
    propertyTypes: [] as string[],
    amenities: [] as string[],
    guests: 1,
  });

  const locations = [
    "All Locations",
    "Maldives",
    "Tokyo, Japan",
    "Swiss Alps",
    "Barcelona, Spain",
    "Miami Beach, USA",
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
  ];

  const propertyTypes = [
    "Villa",
    "Loft",
    "House",
    "Studio",
    "Condo",
    "Apartment",
  ];

  const amenities = [
    "WiFi",
    "Pool",
    "Kitchen",
    "Parking",
    "Gym",
    "Air conditioning",
    "Heating",
    "Hot Tub",
    "Garden",
    "Beach Access",
    "City View",
    "Mountain View",
    "Workspace",
    "Traditional Bath",
  ];

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFiltersChange?.(updated);
  };

  const togglePropertyType = (type: string) => {
    const newTypes = filters.propertyTypes.includes(type)
      ? filters.propertyTypes.filter((t) => t !== type)
      : [...filters.propertyTypes, type];
    updateFilters({ propertyTypes: newTypes });
  };

  const toggleAmenity = (amenity: string) => {
    const newAmenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    updateFilters({ amenities: newAmenities });
  };

  const selectLocation = (location: string) => {
    updateFilters({ location: location === "All Locations" ? "" : location });
    setShowLocationDropdown(false);
  };

  const filteredLocations = locations.filter((location) =>
    location.toLowerCase().includes(filters.location.toLowerCase())
  );

  const clearAllFilters = () => {
    const clearedFilters = {
      location: "",
      priceRange: [0, 1000] as [number, number],
      currency: "both",
      propertyTypes: [] as string[],
      amenities: [] as string[],
      guests: 1,
    };
    setFilters(clearedFilters);
    onFiltersChange?.(clearedFilters);
  };

  const hasActiveFilters =
    filters.location ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 1000 ||
    filters.currency !== "both" ||
    filters.propertyTypes.length > 0 ||
    filters.amenities.length > 0 ||
    filters.guests > 1;

  return (
    <Card
      className="bg-card/50 backdrop-blur border-border/50 relative"
      style={{ zIndex: 100000 }}
    >
      <CardContent className="p-6">
        {/* Main Search Row */}
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          {/* Location Search */}
          <div className="flex-1 relative" style={{ zIndex: 100000 }}>
            <div className="relative">
              <MapPin className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                value={filters.location}
                onChange={(e) => updateFilters({ location: e.target.value })}
                onFocus={() => setShowLocationDropdown(true)}
                onBlur={() =>
                  setTimeout(() => setShowLocationDropdown(false), 200)
                }
                className="pl-10 pr-10"
              />
              <ChevronDown
                className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer"
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              />

              {/* Location Dropdown */}
              {showLocationDropdown && (
                <div
                  className="fixed top-auto left-auto right-auto mt-1 bg-background border border-border rounded-md shadow-xl z-[99999] max-h-60 overflow-y-auto min-w-full"
                  style={{
                    position: "absolute",
                    zIndex: 99999,
                  }}
                >
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

          {/* Guests */}
          <div className="w-full md:w-48">
            <Select
              value={filters.guests.toString()}
              onValueChange={(value) =>
                updateFilters({ guests: parseInt(value) })
              }
            >
              <SelectTrigger>
                <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Advanced Filters Toggle */}
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full md:w-auto"
          >
            <Sliders className="h-4 w-4 mr-2" />
            Advanced
            <ChevronDown
              className={`h-4 w-4 ml-2 transition-transform ${
                showAdvanced ? "rotate-180" : ""
              }`}
            />
          </Button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearAllFilters}
              className="w-full md:w-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 pt-6 border-t border-border"
          >
            {/* Price Range */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  Price Range (per night)
                </span>
                <span className="text-sm text-muted-foreground">
                  {filters.priceRange[0]} - {filters.priceRange[1]}{" "}
                  {filters.currency === "both" ? "XRP/FLR" : filters.currency}
                </span>
              </div>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) =>
                  updateFilters({ priceRange: value as [number, number] })
                }
                max={1000}
                min={0}
                step={10}
                className="w-full"
              />
            </div>

            {/* Currency */}
            <div className="space-y-3">
              <span className="text-sm font-medium">Currency</span>
              <div className="flex gap-2">
                {["both", "XRP", "FLR"].map((currency) => (
                  <Badge
                    key={currency}
                    variant={
                      filters.currency === currency ? "default" : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => updateFilters({ currency })}
                  >
                    {currency === "both" ? "Both" : currency}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Property Types */}
            <div className="space-y-3">
              <span className="text-sm font-medium">Property Type</span>
              <div className="flex flex-wrap gap-2">
                {propertyTypes.map((type) => (
                  <Badge
                    key={type}
                    variant={
                      filters.propertyTypes.includes(type)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => togglePropertyType(type)}
                  >
                    {type}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3">
              <span className="text-sm font-medium">Amenities</span>
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity) => (
                  <Badge
                    key={amenity}
                    variant={
                      filters.amenities.includes(amenity)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleAmenity(amenity)}
                  >
                    {amenity}
                  </Badge>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
