"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navigation } from "@/components/navigation"
import { PropertyMinting } from "@/components/property-minting"
import { EscrowManagement } from "@/components/escrow-management"
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Eye,
  MapPin,
  Star,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Shield,
  Coins,
} from "lucide-react"

interface Property {
  id: string
  title: string
  location: string
  type: string
  status: "active" | "pending" | "draft" | "paused"
  verificationStatus: "verified" | "pending" | "unverified"
  price: number
  bedrooms: number
  bathrooms: number
  maxGuests: number
  rating: number
  reviewCount: number
  bookings: number
  revenue: number
  occupancyRate: number
  images: string[]
  amenities: string[]
  createdAt: string
  lastBooking: string
}

export default function PropertyManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [showMinting, setShowMinting] = useState(false)
  const [showEscrow, setShowEscrow] = useState(false)

  const properties: Property[] = [
    {
      id: "1",
      title: "Luxury Beachfront Villa",
      location: "Malibu, CA",
      type: "Villa",
      status: "active",
      verificationStatus: "verified",
      price: 450,
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      rating: 4.9,
      reviewCount: 47,
      bookings: 23,
      revenue: 8420,
      occupancyRate: 85,
      images: ["/luxury-beachfront-villa.png"],
      amenities: ["Pool", "Beach Access", "WiFi", "Kitchen"],
      createdAt: "2024-01-15",
      lastBooking: "2024-12-10",
    },
    {
      id: "2",
      title: "Downtown Penthouse",
      location: "New York, NY",
      type: "Apartment",
      status: "active",
      verificationStatus: "pending",
      price: 320,
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      rating: 4.7,
      reviewCount: 32,
      bookings: 18,
      revenue: 6200,
      occupancyRate: 78,
      images: ["/modern-penthouse.png"],
      amenities: ["City View", "Gym", "WiFi", "Kitchen"],
      createdAt: "2024-02-20",
      lastBooking: "2024-12-08",
    },
    {
      id: "3",
      title: "Mountain Cabin Retreat",
      location: "Aspen, CO",
      type: "Cabin",
      status: "paused",
      verificationStatus: "verified",
      price: 280,
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      rating: 4.8,
      reviewCount: 28,
      bookings: 15,
      revenue: 4890,
      occupancyRate: 65,
      images: ["/mountain-cabin-retreat.png"],
      amenities: ["Fireplace", "Mountain View", "WiFi", "Kitchen"],
      createdAt: "2024-03-10",
      lastBooking: "2024-11-25",
    },
  ]

  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || property.status === statusFilter
    const matchesType = typeFilter === "all" || property.type.toLowerCase() === typeFilter.toLowerCase()

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-600"
      case "pending":
        return "bg-yellow-600"
      case "paused":
        return "bg-gray-600"
      case "draft":
        return "bg-blue-600"
      default:
        return "bg-gray-600"
    }
  }

  const getVerificationColor = (status: string) => {
    switch (status) {
      case "verified":
        return "bg-green-600"
      case "pending":
        return "bg-yellow-600"
      case "unverified":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getVerificationIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle className="h-3 w-3" />
      case "pending":
        return <Clock className="h-3 w-3" />
      case "unverified":
        return <AlertCircle className="h-3 w-3" />
      default:
        return <AlertCircle className="h-3 w-3" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Property Management</h1>
                <p className="text-muted-foreground text-lg">
                  Manage your listings, track performance, and optimize your hosting business
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setShowEscrow(true)} className="gap-2">
                  <Coins className="h-4 w-4" />
                  Escrow
                </Button>
                <Button variant="outline" onClick={() => setShowMinting(true)} className="gap-2">
                  <Shield className="h-4 w-4" />
                  Mint NFT
                </Button>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Property
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Filters and Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <Card className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search properties..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="paused">Paused</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="cabin">Cabin</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Properties Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8"
          >
            {filteredProperties.map((property) => (
              <Card key={property.id} className="bg-card border-border overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={property.images[0] || "/loft-interior-modern.jpg"}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge className={getStatusColor(property.status)}>{property.status}</Badge>
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className={getVerificationColor(property.verificationStatus)}>
                      {getVerificationIcon(property.verificationStatus)}
                      {property.verificationStatus}
                    </Badge>
                  </div>
                  <div className="absolute bottom-3 right-3">
                    <Button variant="secondary" size="sm" className="gap-2">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="font-semibold text-foreground mb-1">{property.title}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      {property.location}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Price/night</p>
                      <p className="font-semibold text-foreground">${property.price}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Revenue</p>
                      <p className="font-semibold text-green-400">${property.revenue.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Bookings</p>
                      <p className="font-semibold text-foreground">{property.bookings}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Occupancy</p>
                      <p className="font-semibold text-blue-400">{property.occupancyRate}%</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400" />
                      <span className="text-sm font-medium text-foreground">{property.rating}</span>
                      <span className="text-sm text-muted-foreground">({property.reviewCount})</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {property.bedrooms}bd • {property.bathrooms}ba • {property.maxGuests} guests
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1 bg-transparent">
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-1 bg-transparent">
                      <Edit className="h-3 w-3" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-1 bg-transparent">
                      <BarChart3 className="h-3 w-3" />
                      Stats
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Performance Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Portfolio Performance
                </CardTitle>
                <CardDescription>Overview of your property portfolio performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{properties.length}</p>
                    <p className="text-sm text-muted-foreground">Total Properties</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-green-400">
                      ${properties.reduce((sum, p) => sum + p.revenue, 0).toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">
                      {Math.round(properties.reduce((sum, p) => sum + p.occupancyRate, 0) / properties.length)}%
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Occupancy</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-yellow-400">
                      {(properties.reduce((sum, p) => sum + p.rating, 0) / properties.length).toFixed(1)}
                    </p>
                    <p className="text-sm text-muted-foreground">Avg Rating</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Modals */}
          {showMinting && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground">Property NFT Minting</h2>
                    <Button variant="ghost" size="sm" onClick={() => setShowMinting(false)}>
                      ×
                    </Button>
                  </div>
                  <PropertyMinting
                    propertyId="sample-property"
                    propertyTitle="Sample Property"
                    onMintSuccess={(tokenId) => {
                      console.log("Minted with token ID:", tokenId)
                      setShowMinting(false)
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {showEscrow && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-card rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground">Escrow Management</h2>
                    <Button variant="ghost" size="sm" onClick={() => setShowEscrow(false)}>
                      ×
                    </Button>
                  </div>
                  <EscrowManagement />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
