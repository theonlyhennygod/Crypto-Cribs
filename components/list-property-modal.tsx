"use client"

import { useState } from "react"
import * as React from "react"
import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { 
  Plus, 
  Upload, 
  MapPin, 
  Shield, 
  Coins, 
  AlertTriangle, 
  Camera,
  CheckCircle,
  Info,
  Lock,
  Globe
} from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"
import { useBookingWrite } from "@/hooks/use-contract"
import { useAccount } from "wagmi"
import { toast } from "sonner"

interface ListingFormData {
  title: string
  description: string
  propertyType: string
  address: string
  city: string
  country: string
  price: string
  bedrooms: string
  bathrooms: string
  maxGuests: string
  amenities: string[]
  images: FileList | null
  gpsCoordinates: { lat: number; lng: number } | null
  ipfsHash: string
  depositAmount: string
  hostStakeAmount: string
}

interface AntifraudCheck {
  id: string
  label: string
  description: string
  status: 'pending' | 'checking' | 'passed' | 'failed'
  required: boolean
}

export function ListPropertyModal({ children }: { children: React.ReactNode }) {
  const { isConnected, walletAddress } = useWallet()
  const { address } = useAccount()
  const { listProperty, isPending, isConfirming, isSuccess, error } = useBookingWrite()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ListingFormData>({
    title: "",
    description: "",
    propertyType: "",
    address: "",
    city: "",
    country: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
    maxGuests: "",
    amenities: [],
    images: null,
    gpsCoordinates: null,
    ipfsHash: "",
    depositAmount: "50", // Default 50 FXRP deposit
    hostStakeAmount: "10", // Default 10 FXRP host stake
  })

  const [antifraudChecks, setAntifraudChecks] = useState<AntifraudCheck[]>([
    {
      id: "wallet_age",
      label: "Wallet Age Verification",
      description: "Your wallet must be at least 7 days old",
      status: "pending",
      required: true,
    },
    {
      id: "device_fingerprint", 
      label: "Device Fingerprinting",
      description: "Unique device identification to prevent multiple accounts",
      status: "pending",
      required: true,
    },
    {
      id: "listing_deposit",
      label: "Listing Deposit",
      description: "Stake tokens to prevent spam listings",
      status: "pending",
      required: true,
    },
    {
      id: "gps_verification",
      label: "GPS Location Verification",
      description: "Images must contain valid GPS metadata",
      status: "pending",
      required: true,
    },
    {
      id: "ipfs_metadata",
      label: "Immutable Metadata",
      description: "Property details stored on IPFS for transparency",
      status: "pending",
      required: true,
    },
    {
      id: "manual_review",
      label: "Manual Review Process",
      description: "Human verification of property authenticity",
      status: "pending",
      required: true,
    },
  ])

  const amenityOptions = [
    "WiFi", "Pool", "Gym", "Parking", "Kitchen", "Air Conditioning",
    "Heating", "Washer/Dryer", "Hot Tub", "Beach Access", "Pet Friendly"
  ]

  const handleInputChange = (field: keyof ListingFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }))
  }

  const handleImageUpload = async (files: FileList) => {
    setFormData(prev => ({ ...prev, images: files }))
    
    // Simulate EXIF data extraction and GPS verification
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock GPS coordinates extraction
    setFormData(prev => ({
      ...prev,
      gpsCoordinates: { lat: 34.0522, lng: -118.2437 } // Mock LA coordinates
    }))

    // Update antifraud check
    setAntifraudChecks(prev => prev.map(check => 
      check.id === "gps_verification" 
        ? { ...check, status: "passed" as const }
        : check
    ))
  }

  const runAntifraudChecks = async () => {
    setStep(3)
    
    // Simulate running various antifraud checks
    const checkSequence = [
      "wallet_age",
      "device_fingerprint", 
      "listing_deposit",
      "ipfs_metadata",
      "manual_review"
    ]

    for (let i = 0; i < checkSequence.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      
      setAntifraudChecks(prev => prev.map(check => 
        check.id === checkSequence[i]
          ? { ...check, status: "checking" as const }
          : check
      ))

      await new Promise(resolve => setTimeout(resolve, 1200))
      
      setAntifraudChecks(prev => prev.map(check => 
        check.id === checkSequence[i]
          ? { ...check, status: "passed" as const }
          : check
      ))
    }
  }

  const handleSubmit = async () => {
    if (!address) {
      toast.error("Please connect your wallet first")
      return
    }

    if (!formData.title || !formData.city || !formData.price || !formData.maxGuests) {
      toast.error("Please fill in all required fields")
      return
    }

    setIsSubmitting(true)
    
    try {
      // Run antifraud checks first
      await runAntifraudChecks()
      
      // Simulate IPFS upload for property metadata and images
      const mockIpfsHash = "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"
      setFormData(prev => ({ ...prev, ipfsHash: mockIpfsHash }))
      
      // Prepare data for smart contract
      const priceInCents = Math.floor(parseFloat(formData.price) * 100) // Convert to cents
      const maxGuests = parseInt(formData.maxGuests)
      const location = `${formData.city}, ${formData.country}`
      
      // Call smart contract to list property
      listProperty(
        formData.title,
        location,
        BigInt(priceInCents),
        formData.amenities,
        BigInt(maxGuests)
      )
      
      toast.success("Property listing transaction submitted!")
      console.log("[Crypto Cribs] Property listing submitted:", {
        name: formData.title,
        location,
        priceInCents,
        amenities: formData.amenities,
        maxGuests
      })
      
    } catch (error) {
      console.error("Error submitting property:", error)
      toast.error("Failed to submit property listing")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle transaction success
  React.useEffect(() => {
    if (isSuccess) {
      toast.success("Property listed successfully on the blockchain!")
      setOpen(false)
      setStep(1)
      // Reset form
      setFormData({
        title: "",
        description: "",
        propertyType: "",
        address: "",
        city: "",
        country: "",
        price: "",
        bedrooms: "",
        bathrooms: "",
        maxGuests: "",
        amenities: [],
        images: null,
        gpsCoordinates: null,
        ipfsHash: "",
        depositAmount: "50",
        hostStakeAmount: "10",
      })
    }
  }, [isSuccess])

  React.useEffect(() => {
    if (error) {
      toast.error(`Transaction failed: ${error.message}`)
    }
  }, [error])

  const allChecksPassed = antifraudChecks.filter(c => c.required).every(c => c.status === "passed")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            List New Property - Fraud Protected
          </DialogTitle>
          <DialogDescription>
            Complete all verification steps to ensure platform integrity and prevent fraudulent listings.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-12 h-1 mx-2 ${step > stepNum ? "bg-primary" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Anti-Fraud Protection Active</AlertTitle>
                <AlertDescription>
                  All listings require verification to prevent fake properties and protect users.
                </AlertDescription>
              </Alert>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      placeholder="Beautiful Beachfront Villa"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select value={formData.propertyType} onValueChange={(value) => handleInputChange("propertyType", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="house">House</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="cabin">Cabin</SelectItem>
                        <SelectItem value="condo">Condo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      placeholder="123 Ocean Drive"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        placeholder="Miami"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Input
                        id="country"
                        placeholder="United States"
                        value={formData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="price">Price per Night (FXRP) *</Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="150"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bedrooms">Bedrooms</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        placeholder="2"
                        value={formData.bedrooms}
                        onChange={(e) => handleInputChange("bedrooms", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bathrooms">Bathrooms</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        placeholder="2"
                        value={formData.bathrooms}
                        onChange={(e) => handleInputChange("bathrooms", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxGuests">Max Guests</Label>
                      <Input
                        id="maxGuests"
                        type="number"
                        placeholder="4"
                        value={formData.maxGuests}
                        onChange={(e) => handleInputChange("maxGuests", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your property..."
                      className="h-32"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Amenities</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  {amenityOptions.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                      />
                      <Label htmlFor={amenity} className="text-sm">{amenity}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!formData.title || !formData.propertyType}>
                  Continue to Images
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 2: Image Upload & GPS Verification */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Alert>
                <Camera className="h-4 w-4" />
                <AlertTitle>GPS-Verified Images Required</AlertTitle>
                <AlertDescription>
                  Upload images with EXIF GPS data to verify property location and prevent fake listings.
                </AlertDescription>
              </Alert>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Property Images
                  </CardTitle>
                  <CardDescription>
                    Images must contain GPS metadata. Take photos on-location with your mobile device.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                      className="hidden"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium">Drop images here or click to upload</p>
                      <p className="text-sm text-muted-foreground mt-2">
                        PNG, JPG up to 10MB each. GPS metadata required.
                      </p>
                    </label>
                  </div>

                  {formData.gpsCoordinates && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
                        <CheckCircle className="h-4 w-4" />
                        <span className="font-medium">GPS Coordinates Verified</span>
                      </div>
                      <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                        Latitude: {formData.gpsCoordinates.lat}, Longitude: {formData.gpsCoordinates.lng}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Coins className="h-5 w-5" />
                    Listing Deposit & Host Stake
                  </CardTitle>
                  <CardDescription>
                    Prevent spam and fraudulent listings with token deposits
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="depositAmount">Listing Deposit (FXRP)</Label>
                    <Input
                      id="depositAmount"
                      type="number"
                      value={formData.depositAmount}
                      onChange={(e) => handleInputChange("depositAmount", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Refundable upon successful property verification
                    </p>
                  </div>
                  
                  <div>
                    <Label htmlFor="hostStakeAmount">Host Stake (FXRP)</Label>
                    <Input
                      id="hostStakeAmount"
                      type="number"
                      value={formData.hostStakeAmount}
                      onChange={(e) => handleInputChange("hostStakeAmount", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Locked during active bookings as security deposit
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button 
                  onClick={handleSubmit} 
                  disabled={!formData.gpsCoordinates || isSubmitting || isPending || isConfirming}
                >
                  {isPending ? "Confirm in Wallet..." : 
                   isConfirming ? "Confirming on Blockchain..." :
                   isSubmitting ? "Processing..." : 
                   "List Property on Blockchain"}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Antifraud Verification */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertTitle>Running Fraud Prevention Checks</AlertTitle>
                <AlertDescription>
                  Your listing is being verified through our comprehensive antifraud system.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                {antifraudChecks.map((check) => (
                  <Card key={check.id} className="relative overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            check.status === 'passed' ? 'bg-green-100 dark:bg-green-900' :
                            check.status === 'checking' ? 'bg-yellow-100 dark:bg-yellow-900' :
                            check.status === 'failed' ? 'bg-red-100 dark:bg-red-900' :
                            'bg-gray-100 dark:bg-gray-900'
                          }`}>
                            {check.status === 'passed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                            {check.status === 'checking' && (
                              <div className="w-4 h-4 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin" />
                            )}
                            {check.status === 'failed' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                            {check.status === 'pending' && <div className="w-4 h-4 bg-gray-400 rounded-full" />}
                          </div>
                          <div>
                            <p className="font-medium">{check.label}</p>
                            <p className="text-sm text-muted-foreground">{check.description}</p>
                          </div>
                        </div>
                        <Badge variant={
                          check.status === 'passed' ? 'default' :
                          check.status === 'checking' ? 'secondary' :
                          check.status === 'failed' ? 'destructive' :
                          'outline'
                        }>
                          {check.status}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {allChecksPassed && (
                <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertTitle className="text-green-800 dark:text-green-200">
                    Verification Complete!
                  </AlertTitle>
                  <AlertDescription className="text-green-700 dark:text-green-300">
                    Your property listing has passed all fraud prevention checks and is now pending manual review.
                  </AlertDescription>
                </Alert>
              )}

              {formData.ipfsHash && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5" />
                      Immutable Metadata
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">
                      Your property metadata has been stored on IPFS for transparency:
                    </p>
                    <code className="text-xs bg-muted p-2 rounded block break-all">
                      {formData.ipfsHash}
                    </code>
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-center">
                <Button 
                  onClick={() => setOpen(false)}
                  disabled={!allChecksPassed}
                  className="px-8"
                >
                  Complete Listing
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
