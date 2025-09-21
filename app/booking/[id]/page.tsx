'use client'

import { BookingConfirmation } from "@/components/booking-confirmation"
import { useBooking, useProperty } from "@/hooks/use-contract"
import { useParams } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { BookingStatus } from "@/lib/contracts/types"

export default function BookingConfirmationPage() {
  const params = useParams()
  const bookingId = BigInt(params.id as string)
  
  const { data: booking, isLoading: bookingLoading, error: bookingError } = useBooking(bookingId)
  const { data: property, isLoading: propertyLoading } = useProperty(booking?.propertyId || 0n)

  if (bookingLoading || propertyLoading) {
    return (
      <div className="container mx-auto px-6 py-24 space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-6">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (bookingError || !booking) {
    return (
      <div className="container mx-auto px-6 py-24">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Booking not found or failed to load. Please check the booking ID.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="container mx-auto px-6 py-24">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Property information not found.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // Convert blockchain data to component format
  const bookingData = {
    id: booking.id.toString(),
    property: {
      title: property.name,
      location: property.location,
      image: `/property-${property.id}.jpg`, // You could store image URLs in IPFS
      rating: 4.8, // Could be calculated from reviews stored on-chain
      reviews: 127, // Could be fetched from additional review contract
    },
    checkIn: new Date(Number(booking.checkIn) * 1000).toLocaleDateString(),
    checkOut: new Date(Number(booking.checkOut) * 1000).toLocaleDateString(),
    guests: Number(property.maxGuests), // Or store guests in booking
    nights: Math.ceil((Number(booking.checkOut) - Number(booking.checkIn)) / 86400),
    total: Number(booking.totalPriceUSD) / 100, // Convert from cents
    totalXRP: Number(booking.totalPriceXRP) / 1000000, // Convert from drops
    currency: "XRP" as const,
    transactionHash: booking.expectedXrplTxHash,
    status: getBookingStatusString(booking.status),
    xrplAddress: booking.xrplAddress,
    paymentVerified: booking.paymentVerified,
  }

  return <BookingConfirmation booking={bookingData} />
}

function getBookingStatusString(status: number): string {
  switch (status) {
    case BookingStatus.PENDING_PAYMENT:
      return "pending_payment"
    case BookingStatus.PAYMENT_VERIFIED:
      return "payment_verified"  
    case BookingStatus.ACTIVE:
      return "confirmed"
    case BookingStatus.COMPLETED:
      return "completed"
    case BookingStatus.CANCELLED:
      return "cancelled"
    default:
      return "unknown"
  }
}
