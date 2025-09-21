"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Star,
  MapPin,
  Users,
  Wifi,
  Car,
  Coffee,
  PenTool as Pool,
  Dumbbell,
  Shield,
  Heart,
  Share,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { useState } from "react"
import { BookingCard } from "@/components/booking-card"
import { StakingCard } from "@/components/staking-card"
import { useRouter } from "next/navigation"

// Mock property data - in real app this would come from API
const mockProperty = {
  id: "1",
  title: "Luxury Beachfront Villa with Private Pool",
  location: "Maldives, Indian Ocean",
  price: 450,
  originalPrice: 650,
  currency: "XRP" as const,
  rating: 4.9,
  reviews: 127,
  guests: 8,
  bedrooms: 4,
  bathrooms: 3,
  images: ["/luxury-beachfront-villa-maldives.jpg", "/villa-pool-maldives.jpg", "/villa-bedroom-luxury.jpg"],
  amenities: ["WiFi", "Pool", "Kitchen", "Parking", "Gym", "Beach Access", "Air Conditioning", "Hot Tub"],
  host: "Sarah Chen",
  isVerified: true,
  discount: 30,
  description:
    "Experience paradise in this stunning beachfront villa featuring panoramic ocean views, private infinity pool, and direct beach access. Perfect for families or groups seeking luxury and tranquility.",
  houseRules: ["No smoking", "No pets", "Check-in after 3 PM", "Check-out before 11 AM"],
  cancellationPolicy: "Free cancellation up to 48 hours before check-in",
}

export default function PropertyDetailPage() {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState(2)

  const savings = mockProperty.originalPrice - mockProperty.price

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockProperty.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mockProperty.images.length) % mockProperty.images.length)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.back()}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to listings
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIsFavorited(!isFavorited)}>
                <Heart className={`h-4 w-4 mr-2 ${isFavorited ? "fill-red-500 text-red-500" : ""}`} />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="relative aspect-[16/10] rounded-xl overflow-hidden">
              <img
                src={mockProperty.images[currentImageIndex] || "/placeholder.svg"}
                alt={mockProperty.title}
                className="w-full h-full object-cover"
              />

              {/* Navigation Buttons */}
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Image Indicators */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {mockProperty.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>

              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {mockProperty.discount && (
                  <Badge className="bg-primary text-primary-foreground">-{mockProperty.discount}%</Badge>
                )}
                {mockProperty.isVerified && (
                  <Badge className="bg-green-500 text-white">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>

            {/* Property Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-3xl font-bold">{mockProperty.title}</h1>
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{mockProperty.rating}</span>
                    <span className="text-muted-foreground">({mockProperty.reviews} reviews)</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{mockProperty.location}</span>
                </div>
              </div>

              {/* Property Details */}
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{mockProperty.guests} guests</span>
                </div>
                <div>{mockProperty.bedrooms} bedrooms</div>
                <div>{mockProperty.bathrooms} bathrooms</div>
              </div>

              <Separator />

              {/* Host Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold">
                  {mockProperty.host
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold">Hosted by {mockProperty.host}</p>
                  <p className="text-sm text-muted-foreground">Superhost • 3 years hosting</p>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold mb-3">About this place</h3>
                <p className="text-muted-foreground leading-relaxed">{mockProperty.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
                <div className="grid grid-cols-2 gap-4">
                  {mockProperty.amenities.map((amenity) => {
                    const icons: Record<string, any> = {
                      WiFi: Wifi,
                      Pool: Pool,
                      Kitchen: Coffee,
                      Parking: Car,
                      Gym: Dumbbell,
                    }
                    const Icon = icons[amenity] || Wifi
                    return (
                      <div key={amenity} className="flex items-center gap-3">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                        <span>{amenity}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <BookingCard property={mockProperty} />
            <StakingCard />
          </div>
        </div>
      </div>
    </div>
  )
}
