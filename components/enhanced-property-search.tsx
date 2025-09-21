"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  MapPin,
  Calendar,
  Users,
  SlidersHorizontal,
  Wifi,
  Car,
  Coffee,
  Waves,
  Dumbbell,
  Shield,
  Coins,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";

export function EnhancedPropertySearch() {
  const [location, setLocation] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);
  const [priceRange, setPriceRange] = useState([50, 500]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [propertyTypes, setPropertyTypes] = useState<string[]>([]);
  const [currency, setCurrency] = useState<"XRP" | "FLR">("XRP");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);

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
    "Zermatt, Switzerland",
  ];

  const amenities = [
    { id: "wifi", label: "WiFi", icon: Wifi },
    { id: "parking", label: "Parking", icon: Car },
    { id: "kitchen", label: "Kitchen", icon: Coffee },
    { id: "pool", label: "Pool", icon: Waves },
    { id: "gym", label: "Gym", icon: Dumbbell },
    { id: "verified", label: "Verified Host", icon: Shield },
  ];

  const types = ["Entire place", "Private room", "Shared room", "Hotel room"];

  const handleAmenityChange = (amenityId: string, checked: boolean) => {
    if (checked) {
      setSelectedAmenities([...selectedAmenities, amenityId]);
    } else {
      setSelectedAmenities(selectedAmenities.filter((id) => id !== amenityId));
    }
  };

  const handlePropertyTypeChange = (type: string, checked: boolean) => {
    if (checked) {
      setPropertyTypes([...propertyTypes, type]);
    } else {
      setPropertyTypes(propertyTypes.filter((t) => t !== type));
    }
  };

  const selectLocation = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setShowLocationDropdown(false);
  };

  const filteredLocations = availableLocations.filter((loc) =>
    loc.toLowerCase().includes(location.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <Card className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-1">
            <Label htmlFor="location">Where</Label>
            <div className="relative">
              <Input
                id="location"
                placeholder="Search destinations"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onFocus={() => setShowLocationDropdown(true)}
                onBlur={() =>
                  setTimeout(() => setShowLocationDropdown(false), 200)
                }
                className="pl-10 pr-10"
              />
              <MapPin className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <ChevronDown
                className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground cursor-pointer"
                onClick={() => setShowLocationDropdown(!showLocationDropdown)}
              />

              {/* Location Dropdown */}
              {showLocationDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                  {filteredLocations.length > 0 ? (
                    filteredLocations.map((locationOption) => (
                      <button
                        key={locationOption}
                        onClick={() => selectLocation(locationOption)}
                        className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center gap-2"
                      >
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {locationOption}
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

          <div>
            <Label htmlFor="checkin">Check-in</Label>
            <div className="relative">
              <Input
                id="checkin"
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="pl-10"
              />
              <Calendar className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div>
            <Label htmlFor="checkout">Check-out</Label>
            <div className="relative">
              <Input
                id="checkout"
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="pl-10"
              />
              <Calendar className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          <div>
            <Label htmlFor="guests">Guests</Label>
            <div className="relative">
              <Input
                id="guests"
                type="number"
                min="1"
                max="16"
                value={guests}
                onChange={(e) => setGuests(Number.parseInt(e.target.value))}
                className="pl-10"
              />
              <Users className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
            {(selectedAmenities.length > 0 || propertyTypes.length > 0) && (
              <Badge variant="secondary" className="ml-2">
                {selectedAmenities.length + propertyTypes.length}
              </Badge>
            )}
          </Button>

          <Button className="bg-primary hover:bg-primary/90 px-8">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
        </div>
      </Card>

      {/* Advanced Filters */}
      {showFilters && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Card className="p-6">
            <div className="space-y-6">
              {/* Currency Selection */}
              <div>
                <Label className="text-base font-semibold">
                  Payment Currency
                </Label>
                <div className="flex gap-4 mt-3">
                  <Button
                    variant={currency === "XRP" ? "default" : "outline"}
                    onClick={() => setCurrency("XRP")}
                    className="flex items-center gap-2"
                  >
                    <Coins className="h-4 w-4" />
                    XRP
                  </Button>
                  <Button
                    variant={currency === "FLR" ? "default" : "outline"}
                    onClick={() => setCurrency("FLR")}
                    className="flex items-center gap-2"
                  >
                    <Coins className="h-4 w-4" />
                    FLR
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Price Range */}
              <div>
                <Label className="text-base font-semibold">
                  Price Range ({currency}) per night
                </Label>
                <div className="mt-4 px-3">
                  <Slider
                    value={priceRange}
                    onValueChange={setPriceRange}
                    max={1000}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                  <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                    <span>
                      {priceRange[0]} {currency}
                    </span>
                    <span>
                      {priceRange[1]} {currency}
                    </span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Property Types */}
              <div>
                <Label className="text-base font-semibold">Property Type</Label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {types.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox
                        id={type}
                        checked={propertyTypes.includes(type)}
                        onCheckedChange={(checked) =>
                          handlePropertyTypeChange(type, checked as boolean)
                        }
                      />
                      <Label htmlFor={type} className="text-sm font-normal">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Amenities */}
              <div>
                <Label className="text-base font-semibold">Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {amenities.map((amenity) => {
                    const Icon = amenity.icon;
                    return (
                      <div
                        key={amenity.id}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={amenity.id}
                          checked={selectedAmenities.includes(amenity.id)}
                          onCheckedChange={(checked) =>
                            handleAmenityChange(amenity.id, checked as boolean)
                          }
                        />
                        <Label
                          htmlFor={amenity.id}
                          className="text-sm font-normal flex items-center gap-2"
                        >
                          <Icon className="h-4 w-4" />
                          {amenity.label}
                        </Label>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Filter Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setSelectedAmenities([]);
                    setPropertyTypes([]);
                    setPriceRange([50, 500]);
                    setCurrency("XRP");
                  }}
                >
                  Clear all
                </Button>
                <Button className="bg-primary hover:bg-primary/90">
                  Apply Filters
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
