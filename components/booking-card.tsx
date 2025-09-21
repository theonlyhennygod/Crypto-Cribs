"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Users, CreditCard, Coins, Shield, Zap, AlertTriangle, CheckCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { useWallet } from "@/hooks/use-wallet"
import { useXRPL } from "@/hooks/use-xrpl"
import { useFTSO } from "@/hooks/use-ftso"
import { useFraudProtection } from "@/hooks/use-fraud-protection"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CrossChainPayment } from "@/components/cross-chain-payment"

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
  const { isConnected, xrplWallet, metamaskConnected } = useWallet()
  const xrpl = useXRPL()
  const ftso = useFTSO()
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
  const [showPayment, setShowPayment] = useState(false)
  const [fraudCheck, setFraudCheck] = useState<any>(null)
  const [isCheckingFraud, setIsCheckingFraud] = useState(false)
  const [bookingId, setBookingId] = useState("")

  const subtotal = property.price * nights
  const serviceFee = Math.round(subtotal * 0.03) // 3% vs Airbnb's 14-18%
  const total = subtotal + serviceFee
  const savings = property.originalPrice ? (property.originalPrice - property.price) * nights : 0

  // Calculate total cost in USD for cross-chain payment
  const totalUSD = ftso.convertAmount(total, property.currency, "USD")

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
      
      // Generate booking ID
      const newBookingId = `booking_${property.id}_${Date.now()}`
      setBookingId(newBookingId)
      
      setShowPayment(true)
    } catch (error) {
      console.error("Fraud check failed:", error)
      alert("Unable to process booking at this time. Please try again.")
    } finally {
      setIsCheckingFraud(false)
    }
  }

  const handlePaymentComplete = (paymentData: any) => {
    setShowPayment(false)
    // Redirect to booking confirmation
    window.location.href = `/booking/${bookingId}`
  }

  const handlePaymentCancel = () => {
    setShowPayment(false)
    setBookingId("")
  }

  // Cross-chain payment dialog
  const paymentDialog = (
    <Dialog open={showPayment} onOpenChange={setShowPayment}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cross-Chain Payment</DialogTitle>
        </DialogHeader>
        <CrossChainPayment
          bookingId={bookingId}
          propertyTitle={`${property.id} - ${nights} nights`}
          totalCostUSD={totalUSD}
          onPaymentComplete={handlePaymentComplete}
          onCancel={handlePaymentCancel}
        />
      </DialogContent>
    </Dialog>
  )

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
                <Coins className="h-5 w-5 mr-2" />
                Pay with Cross-Chain
              </>
            ) : (
              "Connect Wallet to Book"
            )}
          </Button>

          <div className="text-center text-xs text-muted-foreground space-y-1">
            <div>Secure cross-chain payments via XRPL & Flare Network</div>
            <div>Free cancellation up to 48 hours • No hidden fees</div>
          </div>
        </div>
      </Card>
      {paymentDialog}
    </motion.div>
  )
}
