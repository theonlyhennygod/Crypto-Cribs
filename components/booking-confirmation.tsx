"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, Calendar, MapPin, Users, Download, Share, MessageCircle, Star, Coins } from "lucide-react"
import { useState } from "react"

interface BookingConfirmationProps {
  booking: {
    id: string
    property: {
      title: string
      location: string
      image: string
      rating: number
      reviews: number
    }
    checkIn: string
    checkOut: string
    guests: number
    nights: number
    total: number
    totalXRP?: number
    currency: "XRP" | "FLR"
    transactionHash: string
    status: "confirmed" | "pending" | "pending_payment" | "payment_verified" | "active" | "completed" | "cancelled"
    xrplAddress?: string
    paymentVerified?: boolean
  }
}

export function BookingConfirmation({ booking }: BookingConfirmationProps) {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          {/* Success Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <CheckCircle className="h-10 w-10 text-white" />
            </motion.div>
            <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground">Your reservation has been secured on the blockchain</p>
          </div>

          {/* Booking Details Card */}
          <Card className="p-6 mb-6">
            <div className="space-y-6">
              {/* Property Info */}
              <div className="flex gap-4">
                <img
                  src={booking.property.image || "/placeholder.svg"}
                  alt={booking.property.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{booking.property.title}</h3>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <MapPin className="h-4 w-4" />
                    <span>{booking.property.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{booking.property.rating}</span>
                    <span className="text-muted-foreground">({booking.property.reviews} reviews)</span>
                  </div>
                </div>
                <Badge
                  variant={booking.status === "confirmed" ? "default" : "secondary"}
                  className={booking.status === "confirmed" ? "bg-green-500" : ""}
                >
                  {booking.status === "confirmed" ? "Confirmed" : "Pending"}
                </Badge>
              </div>

              <Separator />

              {/* Booking Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Check-in</p>
                    <p className="font-medium">{booking.checkIn}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Check-out</p>
                    <p className="font-medium">{booking.checkOut}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Guests</p>
                    <p className="font-medium">{booking.guests} guests</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Paid</p>
                    <p className="font-medium">
                      {booking.total} {booking.currency}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Transaction Details */}
              <div className="bg-muted/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Transaction Hash</span>
                  <Button variant="ghost" size="sm" onClick={() => setShowDetails(!showDetails)}>
                    {showDetails ? "Hide" : "Show"} Details
                  </Button>
                </div>
                <p className="text-sm font-mono text-muted-foreground">
                  {showDetails
                    ? booking.transactionHash
                    : `${booking.transactionHash.slice(0, 10)}...${booking.transactionHash.slice(-10)}`}
                </p>
                {showDetails && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 pt-3 border-t border-border"
                  >
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Network</p>
                        <p className="font-medium">XRPL Testnet</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Block</p>
                        <p className="font-medium">#87,234,567</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Gas Fee</p>
                        <p className="font-medium">0.00001 XRP</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Confirmations</p>
                        <p className="font-medium">12/12</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download Receipt
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <Share className="h-4 w-4" />
              Share Booking
            </Button>
          </div>

          {/* Next Steps */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">What's Next?</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Check your email</p>
                  <p className="text-sm text-muted-foreground">
                    We've sent you a confirmation email with all the details
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Contact your host</p>
                  <p className="text-sm text-muted-foreground">Get check-in instructions and local recommendations</p>
                  <Button variant="ghost" size="sm" className="mt-1 p-0 h-auto">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message Host
                  </Button>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Prepare for your trip</p>
                  <p className="text-sm text-muted-foreground">
                    Check local weather, pack accordingly, and get excited!
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
