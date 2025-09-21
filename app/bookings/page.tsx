"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import {
  Calendar,
  MapPin,
  Search,
  Filter,
  MoreHorizontal,
  Star,
  MessageCircle,
  Download,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Plane,
  Camera,
  Heart,
  Share2,
  CreditCard,
  Shield,
} from "lucide-react"
import { useState } from "react"

const mockBookings = [
  {
    id: "1",
    property: {
      title: "Luxury Beachfront Villa",
      location: "Maldives, Indian Ocean",
      image: "/luxury-beachfront-villa-maldives.jpg",
      rating: 4.9,
      reviews: 127,
      type: "Villa",
      amenities: ["Private Pool", "Beach Access", "WiFi", "Kitchen"],
    },
    checkIn: "Dec 15, 2024",
    checkOut: "Dec 22, 2024",
    guests: 4,
    nights: 7,
    total: 3150,
    currency: "XRP" as const,
    status: "upcoming" as const,
    transactionHash: "0x1234567890abcdef1234567890abcdef12345678",
    bookingDate: "Nov 1, 2024",
    confirmationCode: "VYG-2024-001",
    hostName: "Marina Resort",
    carbonOffset: 2.4,
    insurance: true,
  },
  {
    id: "2",
    property: {
      title: "Modern City Apartment",
      location: "Tokyo, Japan",
      image: "/tokyo-cityscape-neon-lights.jpg",
      rating: 4.7,
      reviews: 89,
      type: "Apartment",
      amenities: ["City View", "Metro Access", "WiFi", "Workspace"],
    },
    checkIn: "Nov 10, 2024",
    checkOut: "Nov 15, 2024",
    guests: 2,
    nights: 5,
    total: 1250,
    currency: "XRP" as const,
    status: "completed" as const,
    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef12",
    bookingDate: "Oct 15, 2024",
    confirmationCode: "VYG-2024-002",
    hostName: "Tokyo Stays",
    carbonOffset: 1.8,
    insurance: false,
  },
  {
    id: "3",
    property: {
      title: "Alpine Ski Chalet",
      location: "Swiss Alps, Switzerland",
      image: "/swiss-alps-mountain-resort-snow.jpg",
      rating: 4.8,
      reviews: 156,
      type: "Chalet",
      amenities: ["Ski Access", "Fireplace", "Mountain View", "Hot Tub"],
    },
    checkIn: "Jan 5, 2025",
    checkOut: "Jan 12, 2025",
    guests: 6,
    nights: 7,
    total: 2800,
    currency: "XRP" as const,
    status: "upcoming" as const,
    transactionHash: "0x567890abcdef1234567890abcdef1234567890ab",
    bookingDate: "Nov 20, 2024",
    confirmationCode: "VYG-2024-003",
    hostName: "Alpine Retreats",
    carbonOffset: 3.2,
    insurance: true,
  },
]

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null)

  const filteredBookings = mockBookings.filter((booking) => {
    const matchesSearch =
      booking.property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.property.location.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "upcoming") return matchesSearch && booking.status === "upcoming"
    if (activeTab === "completed") return matchesSearch && booking.status === "completed"
    return matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500"
      case "completed":
        return "bg-green-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "upcoming":
        return <Clock className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "cancelled":
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-blue-500/5">
      <Navigation />

      <div className="container mx-auto px-4 py-8 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent mb-4">
              My Journeys
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Track and manage your travel adventures across the blockchain
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{mockBookings.length}</div>
              <div className="text-sm text-muted-foreground">Total Trips</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {mockBookings.filter((b) => b.status === "completed").length}
              </div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {mockBookings.reduce((sum, b) => sum + b.carbonOffset, 0).toFixed(1)}t
              </div>
              <div className="text-sm text-muted-foreground">CO₂ Offset</div>
            </Card>
          </div>

          <Card className="p-6 mb-6">
            <div className="flex gap-4 items-center">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by destination, property name, or confirmation code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <Filter className="h-4 w-4" />
                Advanced Filters
              </Button>
              <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                <RefreshCw className="h-4 w-4" />
                Sync Blockchain
              </Button>
            </div>
          </Card>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-4 h-12 bg-muted/50">
              <TabsTrigger
                value="all"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Calendar className="h-4 w-4" />
                All ({mockBookings.length})
              </TabsTrigger>
              <TabsTrigger
                value="upcoming"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <Clock className="h-4 w-4" />
                Upcoming ({mockBookings.filter((b) => b.status === "upcoming").length})
              </TabsTrigger>
              <TabsTrigger
                value="completed"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <CheckCircle className="h-4 w-4" />
                Completed ({mockBookings.filter((b) => b.status === "completed").length})
              </TabsTrigger>
              <TabsTrigger
                value="cancelled"
                className="flex items-center gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
              >
                <XCircle className="h-4 w-4" />
                Cancelled (0)
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-6">
                {filteredBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-l-4 border-l-primary">
                      <div className="p-6">
                        <div className="flex gap-6">
                          {/* Property Image */}
                          <div className="relative">
                            <img
                              src={booking.property.image || "/placeholder.svg"}
                              alt={booking.property.title}
                              className="w-40 h-32 rounded-lg object-cover flex-shrink-0"
                            />
                            <Badge className="absolute top-2 left-2 bg-black/70 text-white">
                              {booking.property.type}
                            </Badge>
                          </div>

                          {/* Booking Details */}
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-bold text-xl mb-1">{booking.property.title}</h3>
                                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                  <MapPin className="h-4 w-4" />
                                  <span>{booking.property.location}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="font-medium">{booking.property.rating}</span>
                                    <span className="text-muted-foreground">({booking.property.reviews} reviews)</span>
                                  </div>
                                  <div className="text-sm text-muted-foreground">Host: {booking.hostName}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-3">
                                <Badge className={`${getStatusColor(booking.status)} flex items-center gap-1`}>
                                  {getStatusIcon(booking.status)}
                                  {booking.status}
                                </Badge>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Amenities */}
                            <div className="flex flex-wrap gap-2">
                              {booking.property.amenities.map((amenity) => (
                                <Badge key={amenity} variant="secondary" className="text-xs">
                                  {amenity}
                                </Badge>
                              ))}
                            </div>

                            {/* Trip Details Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Check-in</p>
                                <p className="font-medium">{booking.checkIn}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Check-out</p>
                                <p className="font-medium">{booking.checkOut}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Guests</p>
                                <p className="font-medium">{booking.guests} guests</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Total Cost</p>
                                <p className="font-medium text-lg">
                                  {booking.total} {booking.currency}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Confirmation</p>
                                <p className="font-medium text-xs">{booking.confirmationCode}</p>
                              </div>
                            </div>

                            {/* Additional Info */}
                            <div className="flex items-center justify-between pt-2 border-t">
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Shield className="h-4 w-4" />
                                  <span>{booking.insurance ? "Insured" : "No Insurance"}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Plane className="h-4 w-4" />
                                  <span>{booking.carbonOffset}t CO₂ offset</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <CreditCard className="h-4 w-4" />
                                  <span>Paid with {booking.currency}</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm">
                                  <MessageCircle className="h-4 w-4 mr-2" />
                                  Message Host
                                </Button>
                                <Button variant="outline" size="sm">
                                  <Download className="h-4 w-4 mr-2" />
                                  Receipt
                                </Button>
                                {booking.status === "upcoming" && (
                                  <Button variant="outline" size="sm">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Modify
                                  </Button>
                                )}
                                {booking.status === "completed" && (
                                  <Button variant="outline" size="sm">
                                    <Camera className="h-4 w-4 mr-2" />
                                    Review
                                  </Button>
                                )}
                                <Button variant="ghost" size="sm">
                                  <Heart className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Share2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {filteredBookings.length === 0 && (
            <Card className="p-12 text-center">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? "Try adjusting your search terms" : "Start planning your next adventure!"}
              </p>
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-teal-600">
                <Plane className="h-4 w-4 mr-2" />
                Explore Destinations
              </Button>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
