"use client"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Camera, 
  MapPin, 
  CheckCircle, 
  Clock, 
  Shield,
  Upload,
  AlertTriangle,
  Smartphone,
  UserCheck
} from "lucide-react"
import { useFraudProtection } from "@/hooks/use-fraud-protection"

interface CheckInData {
  guestPhoto?: string
  hostConfirmation?: boolean
  gpsCoordinates?: { lat: number; lng: number }
  timestamp: number
  verificationHash?: string
}

interface CheckInVerificationProps {
  bookingId: string
  propertyAddress: string
  expectedCoordinates: { lat: number; lng: number }
  isHost?: boolean
  onCheckInComplete: (data: CheckInData) => void
}

export function CheckInVerification({ 
  bookingId, 
  propertyAddress, 
  expectedCoordinates, 
  isHost = false,
  onCheckInComplete 
}: CheckInVerificationProps) {
  const [step, setStep] = useState(1)
  const [checkInData, setCheckInData] = useState<CheckInData>({ timestamp: Date.now() })
  const [isVerifying, setIsVerifying] = useState(false)
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const { walletVerification, getRiskAssessment } = useFraudProtection()

  // Get user's current location
  const getCurrentLocation = (): Promise<{ lat: number; lng: number; accuracy: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy
          })
        },
        (error) => reject(error),
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })
  }

  // Verify location is close to expected coordinates
  const verifyLocation = (current: { lat: number; lng: number }, expected: { lat: number; lng: number }): boolean => {
    const distance = calculateDistance(current.lat, current.lng, expected.lat, expected.lng)
    return distance < 100 // Within 100 meters
  }

  // Calculate distance between coordinates
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371e3 // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180
    const φ2 = lat2 * Math.PI/180
    const Δφ = (lat2-lat1) * Math.PI/180
    const Δλ = (lng2-lng1) * Math.PI/180

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))

    return R * c
  }

  // Start camera for photo verification
  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user" },
        audio: false 
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (error) {
      console.error("Failed to start camera:", error)
    }
  }

  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current
      const video = videoRef.current
      const context = canvas.getContext('2d')
      
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      
      context?.drawImage(video, 0, 0)
      const photoData = canvas.toDataURL('image/jpeg')
      
      setCheckInData(prev => ({ ...prev, guestPhoto: photoData }))
      
      // Stop camera
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
        setStream(null)
      }
      
      setStep(3)
    }
  }

  // Guest check-in process
  const handleGuestCheckIn = async () => {
    setIsVerifying(true)

    try {
      // Step 1: Get GPS location
      const location = await getCurrentLocation()
      setGpsAccuracy(location.accuracy)
      
      // Verify location is near property
      const isLocationValid = verifyLocation(
        { lat: location.lat, lng: location.lng },
        expectedCoordinates
      )

      if (!isLocationValid) {
        throw new Error("Location verification failed. You must be at the property to check in.")
      }

      setCheckInData(prev => ({ 
        ...prev, 
        gpsCoordinates: { lat: location.lat, lng: location.lng }
      }))
      
      setStep(2)
      await startCamera()
    } catch (error) {
      console.error("Check-in failed:", error)
      alert(error instanceof Error ? error.message : "Check-in failed")
    } finally {
      setIsVerifying(false)
    }
  }

  // Host confirmation
  const handleHostConfirmation = async () => {
    setIsVerifying(true)
    
    // Simulate MetaMask confirmation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    setCheckInData(prev => ({ 
      ...prev, 
      hostConfirmation: true,
      verificationHash: `0x${Math.random().toString(16).substr(2, 8)}`
    }))
    
    setIsVerifying(false)
    setStep(4)
  }

  // Complete check-in process
  const completeCheckIn = () => {
    const finalData: CheckInData = {
      ...checkInData,
      timestamp: Date.now()
    }
    
    onCheckInComplete(finalData)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {isHost ? "Host Check-In Confirmation" : "Guest Check-In Verification"}
        </h2>
        <p className="text-muted-foreground">
          Complete the dual verification process to prevent no-show fraud
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4">
        {[1, 2, 3, 4].map((stepNum) => (
          <div key={stepNum} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNum ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {stepNum}
            </div>
            {stepNum < 4 && (
              <div className={`w-12 h-1 mx-2 ${step > stepNum ? "bg-primary" : "bg-muted"}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Location Verification */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Verification
              </CardTitle>
              <CardDescription>
                Verify you are at the property location: {propertyAddress}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Anti-Fraud Protection</AlertTitle>
                <AlertDescription>
                  GPS verification prevents false check-in claims and ensures you're actually at the property.
                </AlertDescription>
              </Alert>

              {walletVerification && (
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">Wallet Verification</span>
                    <Badge className={getRiskAssessment(walletVerification.riskScore).color}>
                      {getRiskAssessment(walletVerification.riskScore).level}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getRiskAssessment(walletVerification.riskScore).description}
                  </p>
                </div>
              )}

              <Button 
                onClick={handleGuestCheckIn} 
                disabled={isVerifying}
                className="w-full"
                size="lg"
              >
                {isVerifying ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Verifying Location...
                  </>
                ) : (
                  <>
                    <MapPin className="h-4 w-4 mr-2" />
                    Verify My Location
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 2: Photo Capture */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Photo Verification
              </CardTitle>
              <CardDescription>
                Take a selfie to confirm your presence at the property
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {gpsAccuracy && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800 dark:text-green-200">
                    Location Verified
                  </AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    GPS accuracy: ±{Math.round(gpsAccuracy)} meters
                  </AlertDescription>
                </Alert>
              )}

              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full rounded-lg"
                />
                <canvas ref={canvasRef} className="hidden" />
              </div>

              <Button 
                onClick={capturePhoto}
                className="w-full"
                size="lg"
              >
                <Camera className="h-4 w-4 mr-2" />
                Capture Photo
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 3: Host Confirmation */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                Awaiting Host Confirmation
              </CardTitle>
              <CardDescription>
                The host must confirm your check-in within 2 hours
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-8">
                <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Check-in Submitted</h3>
                <p className="text-muted-foreground mb-4">
                  Your location and photo have been verified. Waiting for host confirmation.
                </p>
                
                {isHost && (
                  <Button 
                    onClick={handleHostConfirmation}
                    disabled={isVerifying}
                    size="lg"
                  >
                    {isVerifying ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Confirming...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Confirm Guest Check-In
                      </>
                    )}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Step 4: Completion */}
      {step === 4 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Check-In Complete!</h3>
              <p className="text-muted-foreground mb-6">
                Both guest and host have confirmed the check-in. Escrow funds will be released according to the booking terms.
              </p>
              
              {checkInData.verificationHash && (
                <div className="bg-muted p-4 rounded-lg mb-6">
                  <p className="text-sm font-medium mb-1">Verification Hash:</p>
                  <code className="text-xs break-all">{checkInData.verificationHash}</code>
                </div>
              )}

              <Button onClick={completeCheckIn} size="lg" className="w-full">
                Continue to Booking
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
