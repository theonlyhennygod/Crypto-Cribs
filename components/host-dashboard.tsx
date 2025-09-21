"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHostData } from "@/hooks/use-host-data";
import { useAccount } from "wagmi";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";
import { ListPropertyModal } from "@/components/list-property-modal";
import { useState } from "react";

export function HostDashboard() {
  const { address, isConnected } = useAccount();
  const {
    currentHost,
    isHost,
    hostProperties,
    hostBookings,
    earnings,
    analytics,
    loading,
    error,
  } = useHostData();

  const [showListModal, setShowListModal] = useState(false);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load host data: {error}
        </AlertDescription>
      </Alert>
    );
  }

  if (!isConnected) {
    return (
      <Card className="p-8 text-center">
        <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">Connect Your Wallet</h3>
        <p className="text-muted-foreground mb-4">
          Connect your wallet to access your host dashboard
        </p>
        <Button>Connect Wallet</Button>
      </Card>
    );
  }

  if (!isHost) {
    return (
      <Card className="p-8 text-center">
        <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-xl font-semibold mb-2">Become a Host</h3>
        <p className="text-muted-foreground mb-4">
          Start earning by listing your property on Crypto Cribs
        </p>
        <Button onClick={() => setShowListModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          List Your Property
        </Button>
        <ListPropertyModal 
          open={showListModal} 
          onOpenChange={setShowListModal} 
        />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Host Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  <Building2 className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Welcome back, {currentHost?.profile.name}!
                  </CardTitle>
                  <CardDescription>
                    {currentHost?.stats.superhost ? "Superhost" : "Host"} since{" "}
                    {new Date(currentHost?.stats.joinedDate || "").getFullYear()}
                  </CardDescription>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {currentHost?.stats.superhost && (
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    <Star className="mr-1 h-3 w-3" />
                    Superhost
                  </Badge>
                )}
                {currentHost?.stats.verified && (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {earnings?.allTime || 0} {earnings?.currency || "XRP"}
            </div>
            <p className="text-xs text-muted-foreground">
              +{earnings?.thisMonth || 0} this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Properties</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{hostProperties.length}</div>
            <p className="text-xs text-muted-foreground">
              {hostProperties.filter(p => p.status === "active").length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalBookings || 0}</div>
            <p className="text-xs text-muted-foreground">
              {hostBookings.filter(b => b.status === "confirmed").length} confirmed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.averageRating || 0}</div>
            <p className="text-xs text-muted-foreground">
              {analytics?.responseRate || 0}% response rate
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Tabs defaultValue="properties" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Your Properties</h3>
              <Button onClick={() => setShowListModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Property
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hostProperties.map((property) => (
                <Card key={property.id} className="overflow-hidden">
                  <div className="aspect-video relative">
                    <img
                      src={property.images[0] || "/placeholder.svg"}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge 
                      className="absolute top-2 right-2"
                      variant={property.status === "active" ? "default" : "secondary"}
                    >
                      {property.status}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{property.title}</CardTitle>
                    <CardDescription className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      {property.location.city}, {property.location.country}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold">
                        {property.pricing.pricePerNight} {property.pricing.currency}
                      </div>
                      <div className="flex items-center">
                        <Star className="mr-1 h-4 w-4 text-yellow-500" />
                        <span className="text-sm">{property.ratings.overall}</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm text-muted-foreground">
                      <div>{property.details.bedrooms} beds</div>
                      <div>{property.details.bathrooms} baths</div>
                      <div>{property.details.maxGuests} guests</div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Eye className="mr-1 h-3 w-3" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <h3 className="text-lg font-semibold">Recent Bookings</h3>
            
            <div className="space-y-4">
              {hostBookings.length === 0 ? (
                <Card className="p-8 text-center">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h4 className="text-lg font-semibold mb-2">No bookings yet</h4>
                  <p className="text-muted-foreground">
                    Your bookings will appear here once guests start booking your properties.
                  </p>
                </Card>
              ) : (
                hostBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <h4 className="font-semibold">{booking.guestName}</h4>
                          <p className="text-sm text-muted-foreground">
                            {booking.dates.checkIn} - {booking.dates.checkOut} ({booking.dates.nights} nights)
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {booking.guests.total} guests
                          </p>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="text-lg font-bold">
                            {booking.pricing.total} {booking.pricing.currency}
                          </div>
                          <Badge 
                            variant={
                              booking.status === "confirmed" ? "default" :
                              booking.status === "pending" ? "secondary" :
                              "destructive"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <h3 className="text-lg font-semibold">Earnings Overview</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">This Month</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {earnings?.thisMonth || 0} {earnings?.currency || "XRP"}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">This Year</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {earnings?.thisYear || 0} {earnings?.currency || "XRP"}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">All Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {earnings?.allTime || 0} {earnings?.currency || "XRP"}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h3 className="text-lg font-semibold">Host Settings</h3>
            
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Manage your host profile and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <p className="text-sm text-muted-foreground">
                      {currentHost?.profile.name}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Response Time</label>
                    <p className="text-sm text-muted-foreground">
                      {currentHost?.profile.responseTime}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Bio</label>
                  <p className="text-sm text-muted-foreground">
                    {currentHost?.profile.bio}
                  </p>
                </div>
                <Button variant="outline">Edit Profile</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      <ListPropertyModal 
        open={showListModal} 
        onOpenChange={setShowListModal} 
      />
    </div>
  );
}
