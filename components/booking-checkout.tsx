"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Calendar, 
  MapPin, 
  Users, 
  CreditCard, 
  Shield, 
  Check,
  Clock,
  ExternalLink,
  Wallet,
  AlertCircle,
  Info
} from "lucide-react"
import { useBookingWrite, useXRPPrice } from "@/hooks/use-contract"
import { useAccount } from "wagmi"
import { formatXRPAmount, usdToXRP } from "@/lib/xrpl-client"
import { toast } from "sonner"

interface PropertyBookingProps {
  property: {
    id: bigint
    name: string
    location: string
    pricePerNightUSD: bigint
    maxGuests: bigint
    amenities: string[]
    available: boolean
    owner: string
  }
  checkIn: Date
  checkOut: Date
  guests: number
}

interface BookingFormData {
  xrplAddress: string
  guestName: string
  email: string
  phone: string
  specialRequests: string
}

export function BookingCheckout({ property, checkIn, checkOut, guests }: PropertyBookingProps) {
  const { address } = useAccount()
  const { createBooking, isPending, isConfirming, isSuccess, error } = useBookingWrite()
  const { data: xrpPriceData } = useXRPPrice()
  
  const [formData, setFormData] = useState<BookingFormData>({
    xrplAddress: "",
    guestName: "",
    email: "",
    phone: "",
    specialRequests: ""
  })
  
  const [bookingStep, setBookingStep] = useState<"details" | "payment" | "confirmation">("details")
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  // Calculate booking details
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  const pricePerNight = Number(property.pricePerNightUSD) / 100 // Convert from cents
  const subtotal = pricePerNight * nights
  const serviceFee = subtotal * 0.03 // 3% service fee
  const taxesFees = subtotal * 0.12 // 12% taxes and fees
  const totalUSD = subtotal + serviceFee + taxesFees

  // Convert to XRP using current price
  const xrpPrice = xrpPriceData ? Number(xrpPriceData) / 100 : 0.50 // Fallback price
  const totalXRP = parseFloat(usdToXRP(totalUSD.toString(), xrpPrice))

  const handleInputChange = (field: keyof BookingFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const validateForm = () => {
    if (!address) {
      toast.error("Please connect your wallet")
      return false
    }
    
    if (!formData.xrplAddress || !formData.guestName || !formData.email) {
      toast.error("Please fill in all required fields")
      return false
    }

    if (!formData.xrplAddress.startsWith('r')) {
      toast.error("Please enter a valid XRPL address (starting with 'r')")
      return false
    }

    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions")
      return false
    }

    return true
  }

  const handleCreateBooking = async () => {
    if (!validateForm()) return

    try {
      const checkInTimestamp = BigInt(Math.floor(checkIn.getTime() / 1000))
      const checkOutTimestamp = BigInt(Math.floor(checkOut.getTime() / 1000))

      createBooking(
        property.id,
        formData.xrplAddress,
        checkInTimestamp,
        checkOutTimestamp
      )

      toast.success("Booking transaction submitted! Please confirm in your wallet.")
      
    } catch (error) {
      console.error("Error creating booking:", error)
      toast.error("Failed to create booking")
    }
  }

  // Handle successful booking creation
  useEffect(() => {
    if (isSuccess) {
      setBookingStep("payment")
      toast.success("Booking created successfully! Please complete payment in XRP.")
    }
  }, [isSuccess])

  useEffect(() => {
    if (error) {
      toast.error(`Booking failed: ${error.message}`)
    }
  }, [error])

  if (!property.available) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          This property is currently unavailable for booking.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Complete Your Booking</h1>
        <p className="text-muted-foreground">
          Secure your stay with blockchain technology and pay with XRP
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-center items-center space-x-4 mb-8">
        {[
          { step: "details", label: "Details", icon: Users },
          { step: "payment", label: "Payment", icon: CreditCard },
          { step: "confirmation", label: "Confirmation", icon: Check }
        ].map((item, index) => (
          <div key={item.step} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
              bookingStep === item.step || (index === 0 && bookingStep === "details") || 
              (index === 1 && bookingStep === "payment") || 
              (index === 2 && bookingStep === "confirmation")
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground"
            }`}>
              <item.icon className="h-4 w-4" />
            </div>
            <span className="ml-2 text-sm font-medium">{item.label}</span>
            {index < 2 && <div className="w-8 h-px bg-muted mx-4" />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {bookingStep === "details" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Property Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Property Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-muted rounded-lg flex-shrink-0">
                      <img
                        src={`/property-${property.id}.jpg`}
                        alt={property.name}
                        className="w-full h-full object-cover rounded-lg"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-property.jpg"
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{property.name}</h3>
                      <p className="text-muted-foreground">{property.location}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline">{guests} guests</Badge>
                        <Badge variant="outline">{nights} nights</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Guest Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Guest Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="guestName">Full Name *</Label>
                      <Input
                        id="guestName"
                        value={formData.guestName}
                        onChange={(e) => handleInputChange("guestName", e.target.value)}
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="xrplAddress">XRPL Address for Payment *</Label>
                      <Input
                        id="xrplAddress"
                        value={formData.xrplAddress}
                        onChange={(e) => handleInputChange("xrplAddress", e.target.value)}
                        placeholder="rExample123456789..."
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="specialRequests">Special Requests</Label>
                    <Input
                      id="specialRequests"
                      value={formData.specialRequests}
                      onChange={(e) => handleInputChange("specialRequests", e.target.value)}
                      placeholder="Any special requests or notes..."
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Terms and Conditions */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                      I agree to the{" "}
                      <a href="#" className="text-primary hover:underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-primary hover:underline">
                        Cancellation Policy
                      </a>
                      . I understand that payment will be made in XRP on the XRPL network.
                    </label>
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handleCreateBooking}
                disabled={!address || isPending || isConfirming}
                className="w-full"
                size="lg"
              >
                {isPending ? "Confirm in Wallet..." :
                 isConfirming ? "Creating Booking..." :
                 "Create Booking on Blockchain"}
              </Button>
            </motion.div>
          )}

          {bookingStep === "payment" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Complete Payment in XRP
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Your booking has been created on the blockchain. Complete payment in XRP to confirm your reservation.
                    </AlertDescription>
                  </Alert>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Amount to Pay:</span>
                      <span className="font-semibold">{totalXRP.toFixed(6)} XRP</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>USD Equivalent:</span>
                      <span>${totalUSD.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Host Wallet:</span>
                      <span className="font-mono">{property.owner}</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="text-sm text-muted-foreground">
                    <h4 className="font-semibold mb-2">Payment Instructions:</h4>
                    <ol className="list-decimal list-inside space-y-1">
                      <li>Open your XRPL wallet (Gem Wallet recommended)</li>
                      <li>Send exactly {totalXRP.toFixed(6)} XRP to the host wallet above</li>
                      <li>Include your booking ID in the memo field</li>
                      <li>Wait for payment verification (usually 3-5 seconds)</li>
                    </ol>
                  </div>

                  <Button variant="outline" className="w-full">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open XRPL Explorer
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Booking Summary Sidebar */}
        <div className="lg:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Booking Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Check-in:</span>
                  <span>{checkIn.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Check-out:</span>
                  <span>{checkOut.toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Guests:</span>
                  <span>{guests}</span>
                </div>
                <div className="flex justify-between">
                  <span>Nights:</span>
                  <span>{nights}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>${pricePerNight.toFixed(2)} × {nights} nights</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Service fee</span>
                  <span>${serviceFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxes & fees</span>
                  <span>${taxesFees.toFixed(2)}</span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Total (USD):</span>
                  <span>${totalUSD.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold text-primary">
                  <span>Total (XRP):</span>
                  <span>{totalXRP.toFixed(6)} XRP</span>
                </div>
                {xrpPrice && (
                  <div className="text-xs text-muted-foreground text-center">
                    XRP Price: ${xrpPrice.toFixed(2)} USD
                  </div>
                )}
              </div>

              <div className="pt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Secured by blockchain technology</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Instant payment verification</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
