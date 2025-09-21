"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useHostProperties, useProperty, useBookingWrite } from "@/hooks/use-contract"
import { useAccount } from "wagmi"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Building2,
  Plus,
  TrendingUp,
  DollarSign,
  Shield,
  Users,
  Star,
  MapPin,
  Wallet,
  Lock,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Ban,
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { ListPropertyModal } from "@/components/list-property-modal"
import { FraudPreventionDashboard } from "@/components/fraud-prevention-dashboard"
import { formatXRPAmount } from "@/lib/xrpl-client"

// Component to display individual property card
function PropertyCard({ propertyId }: { propertyId: bigint }) {
  const { data: property } = useProperty(propertyId)
  const { togglePropertyAvailability } = useBookingWrite()

  if (!property) {
    return (
      <Card className="p-6">
        <Skeleton className="h-48 w-full" />
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 bg-gray-200">
        <img
          src={`/property-${property.id}.jpg`}
          alt={property.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "/placeholder-property.jpg"
          }}
        />
        <Badge 
          className={`absolute top-2 right-2 ${
            property.available 
              ? "bg-green-500/20 text-green-700 border-green-500/20"
              : "bg-red-500/20 text-red-700 border-red-500/20"
          }`}
        >
          {property.available ? "Available" : "Unavailable"}
        </Badge>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold mb-1">{property.name}</h3>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {property.location}
            </p>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold">
              ${(Number(property.pricePerNightUSD) / 100).toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">per night</div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>Max {property.maxGuests.toString()} guests</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {property.amenities.slice(0, 3).map((amenity, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {property.amenities.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{property.amenities.length - 3} more
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant={property.available ? "outline" : "default"}
            size="sm"
            onClick={() => togglePropertyAvailability(property.id)}
            className="flex-1"
          >
            {property.available ? "Set Unavailable" : "Set Available"}
          </Button>
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="outline" size="sm">
            View
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default function HostDashboard() {
  const { address } = useAccount()
  const { data: hostPropertyIds, isLoading, error } = useHostProperties(address)

  // Calculate stats from blockchain data
  const totalProperties = hostPropertyIds?.length || 0
  
  // Note: In a full implementation, you'd calculate these from booking data
  const monthlyRevenue = "$24,580" // Would be calculated from completed bookings
  const occupancyRate = "87%" // Would be calculated from booking ratios
  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
        <Navigation />
        <div className="container mx-auto px-6 py-24">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to access your host dashboard.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const stats = [
    {
      title: "Total Properties",
      value: totalProperties.toString(),
      change: totalProperties > 0 ? `${totalProperties} active` : "No properties yet",
      icon: Building2,
      color: "text-blue-400",
    },
    {
      title: "Monthly Revenue",
      value: "$24,580",
      change: "+18% from last month",
      icon: DollarSign,
      color: "text-green-400",
    },
    {
      title: "Occupancy Rate",
      value: "87%",
      change: "+5% from last month",
      icon: TrendingUp,
      color: "text-purple-400",
    },
    {
      title: "Guest Rating",
      value: "4.8",
      change: "Based on 156 reviews",
      icon: Star,
      color: "text-yellow-400",
    },
  ]

  const properties = [
    {
      id: 1,
      name: "Luxury Beachfront Villa",
      location: "Malibu, CA",
      type: "Villa",
      status: "verified",
      revenue: "$8,420",
      bookings: 12,
      rating: 4.9,
      image: "/luxury-beachfront-villa.png",
    },
    {
      id: 2,
      name: "Downtown Penthouse",
      location: "New York, NY",
      type: "Apartment",
      status: "pending",
      revenue: "$6,200",
      bookings: 8,
      rating: 4.7,
      image: "/modern-penthouse.png",
    },
    {
      id: 3,
      name: "Mountain Cabin Retreat",
      location: "Aspen, CO",
      type: "Cabin",
      status: "verified",
      revenue: "$4,890",
      bookings: 15,
      rating: 4.8,
      image: "/mountain-cabin-retreat.png",
    },
  ]

  const recentBookings = [
    {
      id: 1,
      guest: "Sarah Johnson",
      property: "Luxury Beachfront Villa",
      dates: "Dec 15-22, 2024",
      amount: "$2,800",
      status: "confirmed",
    },
    {
      id: 2,
      guest: "Michael Chen",
      property: "Downtown Penthouse",
      dates: "Dec 20-25, 2024",
      amount: "$1,950",
      status: "pending",
    },
    {
      id: 3,
      guest: "Emma Davis",
      property: "Mountain Cabin Retreat",
      dates: "Jan 5-12, 2025",
      amount: "$1,680",
      status: "confirmed",
    },
  ]

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
                <h1 className="text-4xl font-bold text-foreground mb-2">Host Dashboard</h1>
                <p className="text-muted-foreground text-lg">
                  Manage your properties, track earnings, and grow your hosting business
                </p>
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Shield className="h-4 w-4" />
                  Verify Properties
                </Button>
                <ListPropertyModal>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    List New Property
                  </Button>
                </ListPropertyModal>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </div>
                    <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}>
                      <stat.icon className="h-6 w-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Main Content Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Tabs defaultValue="properties" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5 lg:w-[750px]">
                <TabsTrigger value="properties">Properties</TabsTrigger>
                <TabsTrigger value="bookings">Bookings</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
                <TabsTrigger value="fraud-prevention">Security</TabsTrigger>
              </TabsList>

              {/* Properties Tab */}
              <TabsContent value="properties" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-foreground">Your Properties</h2>
                  <ListPropertyModal>
                    <Button className="gap-2">
                      <Plus className="h-4 w-4" />
                      Add Property
                    </Button>
                  </ListPropertyModal>
                </div>

                {isLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                      <Card key={i} className="p-6">
                        <Skeleton className="h-48 w-full mb-4" />
                        <Skeleton className="h-4 w-2/3 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                      </Card>
                    ))}
                  </div>
                ) : error ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Failed to load properties. Please try again.
                    </AlertDescription>
                  </Alert>
                ) : !hostPropertyIds || hostPropertyIds.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="mb-4">
                      <Building2 className="h-16 w-16 mx-auto text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">No properties listed yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start earning by listing your first property on the blockchain!
                    </p>
                    <ListPropertyModal>
                      <Button>List Your First Property</Button>
                    </ListPropertyModal>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hostPropertyIds.map((propertyId) => (
                      <PropertyCard key={propertyId.toString()} propertyId={propertyId} />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Bookings Tab */}
              <TabsContent value="bookings" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-foreground">Recent Bookings</h2>
                  <Button variant="outline">View All</Button>
                </div>

                <Card className="bg-card border-border">
                  <CardContent className="p-0">
                    <div className="divide-y divide-border">
                      {recentBookings.map((booking) => (
                        <div key={booking.id} className="p-6 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                              <Users className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{booking.guest}</p>
                              <p className="text-sm text-muted-foreground">{booking.property}</p>
                              <p className="text-xs text-muted-foreground">{booking.dates}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-foreground">{booking.amount}</p>
                            <Badge
                              variant={booking.status === "confirmed" ? "default" : "secondary"}
                              className={booking.status === "confirmed" ? "bg-green-600" : "bg-yellow-600"}
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Performance Analytics</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">Revenue Trends</CardTitle>
                      <CardDescription>Monthly revenue over the past 6 months</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        Revenue Chart Placeholder
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground">Booking Patterns</CardTitle>
                      <CardDescription>Occupancy rates by property type</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-muted-foreground">
                        Occupancy Chart Placeholder
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Blockchain Tab */}
              <TabsContent value="blockchain" className="space-y-6">
                <h2 className="text-2xl font-semibold text-foreground">Blockchain Integration</h2>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Shield className="h-5 w-5" />
                        Property Verification
                      </CardTitle>
                      <CardDescription>Mint your properties as NFTs for blockchain verification</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                        <div>
                          <p className="font-semibold text-foreground">Verified Properties</p>
                          <p className="text-sm text-muted-foreground">8 of 12 properties verified</p>
                        </div>
                        <Badge className="bg-green-600">67% Complete</Badge>
                      </div>
                      <Button className="w-full gap-2">
                        <Shield className="h-4 w-4" />
                        Verify Remaining Properties
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-foreground flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        Escrow Management
                      </CardTitle>
                      <CardDescription>Manage listing fees and security deposits</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Total Escrowed</span>
                          <span className="font-semibold text-foreground">$12,450</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Pending Release</span>
                          <span className="font-semibold text-foreground">$3,200</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Available Balance</span>
                          <span className="font-semibold text-green-400">$9,250</span>
                        </div>
                      </div>
                      <Button variant="outline" className="w-full gap-2 bg-transparent">
                        <Wallet className="h-4 w-4" />
                        Manage Escrow
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-foreground">Smart Contract Status</CardTitle>
                    <CardDescription>Overview of your blockchain integrations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                        <CheckCircle className="h-8 w-8 text-green-400" />
                        <div>
                          <p className="font-semibold text-foreground">Property NFTs</p>
                          <p className="text-sm text-muted-foreground">8 minted</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                        <Clock className="h-8 w-8 text-yellow-400" />
                        <div>
                          <p className="font-semibold text-foreground">Escrow Contracts</p>
                          <p className="text-sm text-muted-foreground">3 active</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                        <AlertCircle className="h-8 w-8 text-blue-400" />
                        <div>
                          <p className="font-semibold text-foreground">Pending Actions</p>
                          <p className="text-sm text-muted-foreground">2 required</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Fraud Prevention Tab */}
              <TabsContent value="fraud-prevention" className="space-y-6">
                <FraudPreventionDashboard />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
