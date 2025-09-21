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

// Mock property data - aaaaaain real app this would come from API
const mockProperties = [
  {
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
    propertyType: "Villa",
    images: ["/luxury-beachfront-villa-maldives.jpg", "/villa-pool-maldives.jpg", "/villa-bedroom-luxury.jpg"],
    amenities: ["WiFi", "Pool", "Kitchen", "Parking", "Gym", "Beach Access", "Air Conditioning", "Hot Tub"],
    host: "Sarah Chen",
    isVerified: true,
    discount: 30,
    description: "Experience paradise in this stunning beachfront villa featuring panoramic ocean views, private infinity pool, and direct beach access. Perfect for families or groups seeking luxury and tranquility.",
    houseRules: ["No smoking", "No pets", "Check-in after 3 PM", "Check-out before 11 AM"],
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
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
    description: "Modern loft in the heart of Tokyo with stunning city views. Perfect for urban explorers and business travelers.",
    houseRules: ["No smoking", "No pets", "Check-in after 2 PM", "Check-out before 10 AM"],
    cancellationPolicy: "Free cancellation up to 24 hours before check-in",
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
    description: "Escape to the mountains in this charming cabin with private hot tub and breathtaking alpine views.",
    houseRules: ["No smoking", "Pets allowed", "Check-in after 4 PM", "Check-out before 11 AM"],
    cancellationPolicy: "Free cancellation up to 72 hours before check-in",
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
    description: "Charming studio in Barcelona's historic district, perfect for couples exploring the city.",
    houseRules: ["No smoking", "No pets", "Check-in after 3 PM", "Check-out before 11 AM"],
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
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
    description: "Luxury penthouse with infinity pool overlooking the ocean. Perfect for large groups and special occasions.",
    houseRules: ["No smoking", "No pets", "Check-in after 4 PM", "Check-out before 11 AM"],
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
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
    description: "Authentic Japanese ryokan experience with traditional garden views and cultural immersion.",
    houseRules: ["No smoking", "No pets", "Check-in after 2 PM", "Check-out before 10 AM"],
    cancellationPolicy: "Free cancellation up to 24 hours before check-in",
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
    description: "Stunning Manhattan penthouse with panoramic city views. Perfect for business travelers and city explorers.",
    houseRules: ["No smoking", "No pets", "Check-in after 3 PM", "Check-out before 11 AM"],
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
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
    description: "Modern loft in downtown LA with industrial design and city views. Perfect for creative professionals.",
    houseRules: ["No smoking", "No pets", "Check-in after 2 PM", "Check-out before 10 AM"],
    cancellationPolicy: "Free cancellation up to 24 hours before check-in",
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
    description: "Charming Victorian house in San Francisco with period details and modern amenities. Perfect for families.",
    houseRules: ["No smoking", "Pets allowed", "Check-in after 3 PM", "Check-out before 11 AM"],
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
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
    description: "Luxury apartment in Chicago's Loop district with modern amenities and city views.",
    houseRules: ["No smoking", "No pets", "Check-in after 3 PM", "Check-out before 11 AM"],
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
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
    images: ["/historic-district-barcelona.jpg", "/mountain-cabin-retreat.png", "/cozy-cabin-interior.png"],
    amenities: ["WiFi", "Kitchen", "Heating", "Garden", "Parking"],
    host: "Robert Thompson",
    isVerified: true,
    discount: 27,
    description: "Historic brownstone in Boston with traditional charm and modern conveniences.",
    houseRules: ["No smoking", "No pets", "Check-in after 3 PM", "Check-out before 11 AM"],
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
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
    description: "Modern studio in Seattle's downtown with tech-friendly amenities and city views.",
    houseRules: ["No smoking", "No pets", "Check-in after 2 PM", "Check-out before 10 AM"],
    cancellationPolicy: "Free cancellation up to 24 hours before check-in",
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
    description: "Luxury condo in Austin's downtown with pool access and modern amenities.",
    houseRules: ["No smoking", "No pets", "Check-in after 3 PM", "Check-out before 11 AM"],
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
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
    description: "Cozy mountain cabin near Denver with hot tub and stunning mountain views.",
    houseRules: ["No smoking", "Pets allowed", "Check-in after 4 PM", "Check-out before 11 AM"],
    cancellationPolicy: "Free cancellation up to 72 hours before check-in",
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
    description: "Luxury beachfront villa in San Diego with private pool and direct beach access.",
    houseRules: ["No smoking", "No pets", "Check-in after 4 PM", "Check-out before 11 AM"],
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
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
    description: "Modern apartment in Portland's Pearl District with urban amenities and city views.",
    houseRules: ["No smoking", "No pets", "Check-in after 2 PM", "Check-out before 10 AM"],
    cancellationPolicy: "Free cancellation up to 24 hours before check-in",
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
    description: "Luxury penthouse on the Las Vegas Strip with pool access and city views.",
    houseRules: ["No smoking", "No pets", "Check-in after 4 PM", "Check-out before 11 AM"],
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
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
    description: "Historic townhouse in Philadelphia with traditional charm and modern amenities.",
    houseRules: ["No smoking", "No pets", "Check-in after 3 PM", "Check-out before 11 AM"],
    cancellationPolicy: "Free cancellation up to 48 hours before check-in",
  },
]


export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFavorited, setIsFavorited] = useState(false)
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState(2)

  // Find the property by ID - in real app this would be an API call
  const property = mockProperties.find(p => p.id === params.id) || mockProperties[0]
  const savings = property.originalPrice - property.price

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length)
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
                src={property.images[currentImageIndex] || "/placeholder.svg"}
                alt={property.title}
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
                {property.images.map((_, index) => (
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
                {property.discount && (
                  <Badge className="bg-primary text-primary-foreground">-{property.discount}%</Badge>
                )}
                {property.isVerified && (
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
                  <h1 className="text-3xl font-bold">{property.title}</h1>
                  <div className="flex items-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{property.rating}</span>
                    <span className="text-muted-foreground">({property.reviews} reviews)</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{property.location}</span>
                </div>
              </div>

              {/* Property Details */}
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{property.guests} guests</span>
                </div>
                <div>{property.bedrooms} bedrooms</div>
                <div>{property.bathrooms} bathrooms</div>
              </div>

              <Separator />

              {/* Host Info */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-semibold">
                  {property.host
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div>
                  <p className="font-semibold">Hosted by {property.host}</p>
                  <p className="text-sm text-muted-foreground">Superhost • 3 years hosting</p>
                </div>
              </div>

              <Separator />

              {/* Description */}
              <div>
                <h3 className="text-xl font-semibold mb-3">About this place</h3>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-xl font-semibold mb-4">What this place offers</h3>
                <div className="grid grid-cols-2 gap-4">
                  {property.amenities.map((amenity) => {
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
            <BookingCard property={property} />
            <StakingCard />
          </div>
        </div>
      </div>
    </div>
  )
}
