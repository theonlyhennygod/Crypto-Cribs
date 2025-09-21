"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, CreditCard, Coins, Shield, Zap, AlertTriangle, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useWallet } from "@/hooks/use-wallet"
import { useFraudProtection } from "@/hooks/use-fraud-protection"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface BookingCardProps {
  property: {
    id: string
    price: number
    originalPrice?: number
    currency: "XRP" | "FLR"
    discount?: number
    hostWallet: string
  }
}

export function BookingCard({ property }: BookingCardProps) {
  const { isConnected, xrplWallet } = useWallet()
  const { 
    walletVerification, 
    checkBookingFraud, 
    recordBookingAttempt, 
    getRiskAssessment 
  } = useFraudProtection()
  const [checkIn, setCheckIn] = useState("")
  const [checkOut, setCheckOut] = useState("")
  const [guests, setGuests] = useState(2)
  const [nights, setNights] = useState(3)
  const [showCheckout, setShowCheckout] = useState(false)
  const [fraudCheck, setFraudCheck] = useState<any>(null)
  const [isCheckingFraud, setIsCheckingFraud] = useState(false)

  const subtotal = property.price * nights
  const serviceFee = Math.round(subtotal * 0.03) // 3% vs Airbnb's 14-18%
  const total = subtotal + serviceFee
  const savings = property.originalPrice ? (property.originalPrice - property.price) * nights : 0

  const handleBooking = async () => {
    if (!isConnected) {
      // Trigger wallet connection
      return
    }

    setIsCheckingFraud(true)
    
    try {
      // Run fraud protection checks
      const fraudResult = await checkBookingFraud(property.hostWallet, property.id)
      setFraudCheck(fraudResult)
      
      // Block high-risk bookings
      if (fraudResult.riskScore >= 80) {
        alert("Booking blocked due to high fraud risk. Please contact support.")
        return
      }
      
      // Show warnings for medium risk
      if (fraudResult.riskScore >= 40) {
        const proceed = confirm(
          `Warning: This booking has been flagged for review (Risk Score: ${fraudResult.riskScore}%). Continue anyway?`
        )
        if (!proceed) return
      }
      
      // Record booking attempt for cooldown tracking
      recordBookingAttempt()
      
      setShowCheckout(true)
    } catch (error) {
      console.error("Fraud check failed:", error)
      alert("Unable to process booking at this time. Please try again.")
    } finally {
      setIsCheckingFraud(false)
    }
  }

  if (showCheckout) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card className="p-6 sticky top-6">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-2">Complete Your Booking</h3>
              <p className="text-sm text-muted-foreground">Pay with XRPL for instant confirmation</p>
            </div>

            {/* Fraud Detection Results */}
            {fraudCheck && (
              <Alert className={fraudCheck.riskScore >= 40 ? "border-yellow-500" : "border-green-500"}>
                <Shield className="h-4 w-4" />
                <AlertTitle>Security Check Complete</AlertTitle>
                <AlertDescription>
                  Risk Score: {fraudCheck.riskScore}% - {getRiskAssessment(fraudCheck.riskScore).level}
                  {fraudCheck.isSelfBooking && (
                    <div className="mt-2 text-red-600 font-medium">
                      ⚠️ Self-booking detected - this is not allowed
                    </div>
                  )}
                  {fraudCheck.cooldownViolation && (
                    <div className="mt-2 text-yellow-600 font-medium">
                      ⚠️ Please wait before making another booking
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            )}

            {/* Payment Method */}
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-primary rounded-lg bg-primary/5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <Coins className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">XRPL Wallet</p>
                    <p className="text-sm text-muted-foreground">
                      {xrplWallet?.address?.slice(0, 8)}...{xrplWallet?.address?.slice(-6)}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                  <Shield className="h-3 w-3 mr-1" />
                  Secure
                </Badge>
              </div>
            </div>

            {/* Booking Summary */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>
                  {property.price} {property.currency} × {nights} nights
                </span>
                <span>
                  {subtotal} {property.currency}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Crypto Cribs service fee</span>
                <span>
                  {serviceFee} {property.currency}
                </span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between text-green-600 font-medium">
                  <span>You save vs Airbnb</span>
                  <span>
                    -{savings} {property.currency}
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>
                  {total} {property.currency}
                </span>
              </div>
            </div>

            {/* Payment Button */}
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
              onClick={() => {
                // Implement XRPL payment logic
                console.log("[v0] Processing XRPL payment for", total, property.currency)
                // Simulate payment processing
                setTimeout(() => {
                  // Redirect to confirmation page
                  window.location.href = "/booking/1"
                }, 2000)
              }}
            >
              <Zap className="h-5 w-5 mr-2" />
              Pay {total} {property.currency} with XRPL
            </Button>

            <div className="text-center text-xs text-muted-foreground">
              <Shield className="h-4 w-4 inline mr-1" />
              Secured by blockchain technology. No hidden fees.
            </div>
          </div>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="p-6 sticky top-6">
        <div className="space-y-6">
          {/* Pricing Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                {property.price} {property.currency}
              </span>
              {property.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {property.originalPrice} {property.currency}
                </span>
              )}
            </div>
            <span className="text-sm text-muted-foreground">per night</span>
          </div>

          {savings > 0 && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-green-600 font-medium text-sm">
                Save {savings} {property.currency} vs traditional platforms
              </p>
            </div>
          )}

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="checkin">Check-in</Label>
              <div className="relative">
                <Input
                  id="checkin"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="pl-10"
                />
                <Calendar className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div>
              <Label htmlFor="checkout">Check-out</Label>
              <div className="relative">
                <Input
                  id="checkout"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="pl-10"
                />
                <Calendar className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Guests */}
          <div>
            <Label htmlFor="guests">Guests</Label>
            <div className="relative">
              <Input
                id="guests"
                type="number"
                min="1"
                max="8"
                value={guests}
                onChange={(e) => setGuests(Number.parseInt(e.target.value))}
                className="pl-10"
              />
              <Users className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Wallet Verification Status */}
          {walletVerification && isConnected && (
            <Alert className={walletVerification.riskScore >= 40 ? "border-yellow-500" : "border-green-500"}>
              <Shield className="h-4 w-4" />
              <AlertTitle>Wallet Status</AlertTitle>
              <AlertDescription>
                {getRiskAssessment(walletVerification.riskScore).level} - 
                Age: {walletVerification.age} days, 
                Previous bookings: {walletVerification.previousBookings}
              </AlertDescription>
            </Alert>
          )}

          {/* Pricing Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>
                {property.price} {property.currency} × {nights} nights
              </span>
              <span>
                {subtotal} {property.currency}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Crypto Cribs service fee (3%)</span>
              <span>
                {serviceFee} {property.currency}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total before taxes</span>
              <span>
                {total} {property.currency}
              </span>
            </div>
          </div>

          {/* Book Button */}
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
            onClick={handleBooking}
            disabled={!checkIn || !checkOut || isCheckingFraud}
          >
            {isCheckingFraud ? (
              <>
                <Shield className="h-5 w-5 mr-2 animate-spin" />
                Running Security Checks...
              </>
            ) : isConnected ? (
              <>
                <CreditCard className="h-5 w-5 mr-2" />
                Reserve with XRPL
              </>
            ) : (
              "Connect Wallet to Book"
            )}
          </Button>

          <div className="text-center text-xs text-muted-foreground">
            You won't be charged yet. Free cancellation up to 48 hours.
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
