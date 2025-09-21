"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Navigation } from "@/components/navigation";
import {
  useUserBookings,
  useBooking,
  useProperty,
  useBookingWrite,
} from "@/hooks/use-contract";
import { useAccount } from "wagmi";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { BookingStatus } from "@/lib/contracts/types";
import { formatXRPAmount } from "@/lib/xrpl-client";
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
} from "lucide-react";
import { useState } from "react";

// Component to display individual booking card
function BookingCard({ bookingId }: { bookingId: bigint }) {
  const { data: booking } = useBooking(bookingId);
  const { data: property } = useProperty(booking?.propertyId || 0n);
  const { completeBooking } = useBookingWrite();

  if (!booking || !property) {
    return (
      <Card className="p-6">
        <Skeleton className="h-32 w-full" />
      </Card>
    );
  }

  const getStatusColor = (status: number) => {
    switch (status) {
      case BookingStatus.PENDING_PAYMENT:
        return "bg-yellow-500/20 text-yellow-700 border-yellow-500/20";
      case BookingStatus.PAYMENT_VERIFIED:
        return "bg-blue-500/20 text-blue-700 border-blue-500/20";
      case BookingStatus.ACTIVE:
        return "bg-green-500/20 text-green-700 border-green-500/20";
      case BookingStatus.COMPLETED:
        return "bg-gray-500/20 text-gray-700 border-gray-500/20";
      case BookingStatus.CANCELLED:
        return "bg-red-500/20 text-red-700 border-red-500/20";
      default:
        return "bg-gray-500/20 text-gray-700 border-gray-500/20";
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case BookingStatus.PENDING_PAYMENT:
        return "Payment Pending";
      case BookingStatus.PAYMENT_VERIFIED:
        return "Payment Verified";
      case BookingStatus.ACTIVE:
        return "Active";
      case BookingStatus.COMPLETED:
        return "Completed";
      case BookingStatus.CANCELLED:
        return "Cancelled";
      default:
        return "Unknown";
    }
  };

  const canComplete =
    booking.status === BookingStatus.PAYMENT_VERIFIED &&
    Date.now() >= Number(booking.checkOut) * 1000;

  const nights = Math.ceil(
    (Number(booking.checkOut) - Number(booking.checkIn)) / 86400
  );

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="flex">
        <div className="relative w-48 h-32 bg-gray-200 flex-shrink-0">
          <img
            src={`/property-${property.id}.jpg`}
            alt={property.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-property.jpg";
            }}
          />
          <Badge
            className={`absolute top-2 left-2 ${getStatusColor(
              booking.status
            )}`}
          >
            {getStatusText(booking.status)}
          </Badge>
        </div>
        <div className="flex-1 p-6">
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
                {formatXRPAmount(booking.totalPriceXRP.toString())}
              </div>
              <div className="text-sm text-muted-foreground">
                ${(Number(booking.totalPriceUSD) / 100).toFixed(2)} USD
              </div>
            </div>
          </div>

          <div className="flex gap-4 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(
                Number(booking.checkIn) * 1000
              ).toLocaleDateString()} -{" "}
              {new Date(Number(booking.checkOut) * 1000).toLocaleDateString()}
            </div>
            <div>
              {nights} night{nights !== 1 ? "s" : ""}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            {booking.status === BookingStatus.PENDING_PAYMENT && (
              <Button variant="outline" size="sm">
                Complete Payment
              </Button>
            )}
            {canComplete && (
              <Button size="sm" onClick={() => completeBooking(booking.id)}>
                Complete Booking
              </Button>
            )}
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default function BookingsPage() {
  const { address } = useAccount();
  const { data: userBookingIds, isLoading, error } = useUserBookings(address);
  const [searchTerm, setSearchTerm] = useState("");

  if (!address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
        <Navigation />
        <div className="container mx-auto px-6 py-24">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please connect your wallet to view your bookings.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <Navigation />
      <div className="container mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-4">
            My Bookings
          </h1>
          <p className="text-xl text-muted-foreground">
            Manage your travel bookings and view payment status
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search bookings..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <Tabs defaultValue="all" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 h-12 bg-muted/50">
            <TabsTrigger
              value="all"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              All Bookings
            </TabsTrigger>
            <TabsTrigger
              value="active"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Active
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Pending Payment
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="p-6">
                    <Skeleton className="h-32 w-full" />
                  </Card>
                ))}
              </div>
            ) : error ? (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Failed to load bookings. Please try again.
                </AlertDescription>
              </Alert>
            ) : !userBookingIds || userBookingIds.length === 0 ? (
              <div className="text-center py-12">
                <div className="mb-4">
                  <Calendar className="h-16 w-16 mx-auto text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No bookings yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start exploring amazing properties and make your first
                  booking!
                </p>
                <Button>Browse Properties</Button>
              </div>
            ) : (
              <div className="space-y-4">
                {userBookingIds.map((bookingId) => (
                  <BookingCard
                    key={bookingId.toString()}
                    bookingId={bookingId}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
