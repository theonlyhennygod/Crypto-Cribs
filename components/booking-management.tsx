"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
} from "lucide-react"
import { useState } from "react"

// Mock booking data
const mockBookings = [
  {
    id: "1",
    property: {
      title: "Luxury Beachfront Villa",
      location: "Maldives, Indian Ocean",
      image: "/luxury-beachfront-villa-maldives.jpg",
      rating: 4.9,
      reviews: 127,
    },
    checkIn: "Dec 15, 2024",
    checkOut: "Dec 22, 2024",
    guests: 4,
    nights: 7,
    total: 3150,
    currency: "XRP" as const,
    status: "upcoming" as const,
    transactionHash: "0x1234567890abcdef1234567890abcdef12345678",
  },
  {
    id: "2",
    property: {
      title: "Modern City Apartment",
      location: "Tokyo, Japan",
      image: "/tokyo-cityscape-neon-lights.jpg",
      rating: 4.7,
      reviews: 89,
    },
    checkIn: "Nov 10, 2024",
    checkOut: "Nov 15, 2024",
    guests: 2,
    nights: 5,
    total: 1250,
    currency: "XRP" as const,
    status: "completed" as const,
    transactionHash: "0xabcdef1234567890abcdef1234567890abcdef12",
  },
  {
    id: "3",
    property: {
      title: "Alpine Ski Chalet",
      location: "Swiss Alps, Switzerland",
      image: "/swiss-alps-mountain-resort-snow.jpg",
      rating: 4.8,
      reviews: 156,
    },
    checkIn: "Jan 5, 2025",
    checkOut: "Jan 12, 2025",
    guests: 6,
    nights: 7,
    total: 2800,
    currency: "XRP" as const,
    status: "upcoming" as const,
    transactionHash: "0x567890abcdef1234567890abcdef1234567890ab",
  },
]

export function BookingManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")

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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">My Bookings</h1>
              <p className="text-muted-foreground">Manage your travel reservations</p>
            </div>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Blockchain
            </Button>
          </div>

          {/* Search and Filter */}
          <div className="flex gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList>
              <TabsTrigger value="all">All Bookings</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-6">
              <div className="space-y-4">
                {filteredBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <div className="flex gap-6">
                        {/* Property Image */}
                        <img
                          src={booking.property.image || "/placeholder.svg"}
                          alt={booking.property.title}
                          className="w-32 h-24 rounded-lg object-cover flex-shrink-0"
                        />

                        {/* Booking Details */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-semibold text-lg">{booking.property.title}</h3>
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="h-4 w-4" />
                                <span>{booking.property.location}</span>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{booking.property.rating}</span>
                                <span className="text-muted-foreground">({booking.property.reviews} reviews)</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-4 gap-4 text-sm">
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
                              <p className="text-muted-foreground">Total</p>
                              <p className="font-medium">
                                {booking.total} {booking.currency}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
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
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
              <p className="text-muted-foreground">
                {searchQuery ? "Try adjusting your search terms" : "Start planning your next adventure!"}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
