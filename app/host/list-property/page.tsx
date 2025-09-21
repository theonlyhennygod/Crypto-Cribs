"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import {
  ArrowLeft,
  Upload,
  MapPin,
  Home,
  DollarSign,
  Shield,
  Coins,
  Lock,
  CheckCircle,
  AlertCircle,
  Camera,
} from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"

export default function ListProperty() {
  const { isConnected, address } = useWallet()
  const [currentStep, setCurrentStep] = useState(1)
  const [propertyData, setPropertyData] = useState({
    title: "",
    description: "",
    location: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    maxGuests: "",
    pricePerNight: "",
    amenities: [],
    images: [],
  })
  const [mintingStatus, setMintingStatus] = useState("idle") // idle, minting, success, error
  const [escrowStatus, setEscrowStatus] = useState("idle")

  const propertyTypes = ["Apartment", "House", "Villa", "Condo", "Cabin", "Loft", "Studio", "Penthouse"]

  const amenitiesList = [
    "WiFi",
    "Kitchen",
    "Parking",
    "Pool",
    "Gym",
    "Balcony",
    "Garden",
    "Hot Tub",
    "Air Conditioning",
    "Heating",
    "Washer/Dryer",
    "TV",
    "Fireplace",
    "Beach Access",
  ]

  const handleAmenityToggle = (amenity: string) => {
    setPropertyData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }))
  }

  const handleMintProperty = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first")
      return
    }

    setMintingStatus("minting")
    // Simulate minting process
    setTimeout(() => {
      setMintingStatus("success")
    }, 3000)
  }

  const handleEscrowDeposit = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first")
      return
    }

    setEscrowStatus("processing")
    // Simulate escrow deposit
    setTimeout(() => {
      setEscrowStatus("success")
    }, 2000)
  }

  const steps = [
    { id: 1, title: "Property Details", icon: Home },
    { id: 2, title: "Pricing & Amenities", icon: DollarSign },
    { id: 3, title: "Blockchain Verification", icon: Shield },
    { id: 4, title: "Review & Publish", icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-20 pb-12">
        <div className="container mx-auto px-6 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" className="gap-2" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">List New Property</h1>
            <p className="text-muted-foreground text-lg">Create a verified listing with blockchain security</p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center gap-3 ${
                      currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        currentStep >= step.id
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-muted-foreground"
                      }`}
                    >
                      {currentStep > step.id ? <CheckCircle className="h-5 w-5" /> : <step.icon className="h-5 w-5" />}
                    </div>
                    <span className="font-medium hidden md:block">{step.title}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-12 h-0.5 mx-4 ${currentStep > step.id ? "bg-primary" : "bg-muted-foreground"}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-card border-border">
              <CardContent className="p-8">
                {/* Step 1: Property Details */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">Property Details</h2>
                      <p className="text-muted-foreground mb-6">
                        Tell us about your property to create an attractive listing
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <Label htmlFor="title">Property Title</Label>
                        <Input
                          id="title"
                          placeholder="e.g., Luxury Beachfront Villa with Ocean Views"
                          value={propertyData.title}
                          onChange={(e) => setPropertyData((prev) => ({ ...prev, title: e.target.value }))}
                          className="mt-2"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your property, its unique features, and what makes it special..."
                          value={propertyData.description}
                          onChange={(e) => setPropertyData((prev) => ({ ...prev, description: e.target.value }))}
                          className="mt-2 min-h-[120px]"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="relative mt-2">
                          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="location"
                            placeholder="City, State, Country"
                            value={propertyData.location}
                            onChange={(e) => setPropertyData((prev) => ({ ...prev, location: e.target.value }))}
                            className="pl-10"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="propertyType">Property Type</Label>
                        <Select
                          value={propertyData.propertyType}
                          onValueChange={(value) => setPropertyData((prev) => ({ ...prev, propertyType: value }))}
                        >
                          <SelectTrigger className="mt-2">
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent>
                            {propertyTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="maxGuests">Max Guests</Label>
                        <Input
                          id="maxGuests"
                          type="number"
                          placeholder="4"
                          value={propertyData.maxGuests}
                          onChange={(e) => setPropertyData((prev) => ({ ...prev, maxGuests: e.target.value }))}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="bedrooms">Bedrooms</Label>
                        <Input
                          id="bedrooms"
                          type="number"
                          placeholder="2"
                          value={propertyData.bedrooms}
                          onChange={(e) => setPropertyData((prev) => ({ ...prev, bedrooms: e.target.value }))}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="bathrooms">Bathrooms</Label>
                        <Input
                          id="bathrooms"
                          type="number"
                          placeholder="2"
                          value={propertyData.bathrooms}
                          onChange={(e) => setPropertyData((prev) => ({ ...prev, bathrooms: e.target.value }))}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Property Images</Label>
                      <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center">
                        <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground mb-2">Drag and drop images here, or click to browse</p>
                        <Button variant="outline">
                          <Camera className="h-4 w-4 mr-2" />
                          Upload Images
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button onClick={() => setCurrentStep(2)} className="gap-2">
                        Next: Pricing & Amenities
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 2: Pricing & Amenities */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">Pricing & Amenities</h2>
                      <p className="text-muted-foreground mb-6">
                        Set your pricing and highlight what makes your property special
                      </p>
                    </div>

                    <div>
                      <Label htmlFor="pricePerNight">Price per Night (USD)</Label>
                      <div className="relative mt-2">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="pricePerNight"
                          type="number"
                          placeholder="150"
                          value={propertyData.pricePerNight}
                          onChange={(e) => setPropertyData((prev) => ({ ...prev, pricePerNight: e.target.value }))}
                          className="pl-10"
                        />
                      </div>
                    </div>

                    <div>
                      <Label>Amenities</Label>
                      <p className="text-sm text-muted-foreground mb-4">
                        Select all amenities available at your property
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {amenitiesList.map((amenity) => (
                          <div
                            key={amenity}
                            onClick={() => handleAmenityToggle(amenity)}
                            className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                              propertyData.amenities.includes(amenity)
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <span className="text-sm font-medium">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep(1)}>
                        Back
                      </Button>
                      <Button onClick={() => setCurrentStep(3)} className="gap-2">
                        Next: Blockchain Verification
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Blockchain Verification */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">Blockchain Verification</h2>
                      <p className="text-muted-foreground mb-6">
                        Mint your property as an NFT and set up escrow for secure transactions
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Property Minting */}
                      <Card className="bg-secondary border-border">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Property NFT Minting
                          </CardTitle>
                          <CardDescription>
                            Create a unique NFT for your property to ensure authenticity and ownership verification
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                            <div>
                              <p className="font-medium text-foreground">Minting Fee</p>
                              <p className="text-sm text-muted-foreground">One-time blockchain fee</p>
                            </div>
                            <Badge variant="outline">0.05 ETH</Badge>
                          </div>

                          {mintingStatus === "idle" && (
                            <Button onClick={handleMintProperty} className="w-full gap-2" disabled={!isConnected}>
                              <Coins className="h-4 w-4" />
                              {isConnected ? "Mint Property NFT" : "Connect Wallet First"}
                            </Button>
                          )}

                          {mintingStatus === "minting" && (
                            <Button disabled className="w-full gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                              Minting in Progress...
                            </Button>
                          )}

                          {mintingStatus === "success" && (
                            <div className="text-center space-y-2">
                              <CheckCircle className="h-8 w-8 text-green-400 mx-auto" />
                              <p className="text-green-400 font-medium">Property NFT Minted Successfully!</p>
                              <p className="text-xs text-muted-foreground">Token ID: #12847</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      {/* Escrow Setup */}
                      <Card className="bg-secondary border-border">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Lock className="h-5 w-5" />
                            Escrow Setup
                          </CardTitle>
                          <CardDescription>
                            Deposit listing fee to activate your property on the platform
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                            <div>
                              <p className="font-medium text-foreground">Listing Fee</p>
                              <p className="text-sm text-muted-foreground">Refundable security deposit</p>
                            </div>
                            <Badge variant="outline">$200 USDC</Badge>
                          </div>

                          {escrowStatus === "idle" && (
                            <Button
                              onClick={handleEscrowDeposit}
                              className="w-full gap-2"
                              disabled={!isConnected || mintingStatus !== "success"}
                            >
                              <Lock className="h-4 w-4" />
                              {mintingStatus !== "success" ? "Complete Minting First" : "Deposit to Escrow"}
                            </Button>
                          )}

                          {escrowStatus === "processing" && (
                            <Button disabled className="w-full gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                              Processing Deposit...
                            </Button>
                          )}

                          {escrowStatus === "success" && (
                            <div className="text-center space-y-2">
                              <CheckCircle className="h-8 w-8 text-green-400 mx-auto" />
                              <p className="text-green-400 font-medium">Escrow Deposit Successful!</p>
                              <p className="text-xs text-muted-foreground">Contract: 0x1234...5678</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>

                    {/* Wallet Connection Status */}
                    {!isConnected && (
                      <Card className="bg-yellow-500/10 border-yellow-500/20">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <AlertCircle className="h-5 w-5 text-yellow-400" />
                            <div>
                              <p className="font-medium text-foreground">Wallet Connection Required</p>
                              <p className="text-sm text-muted-foreground">
                                Please connect your wallet to proceed with blockchain verification
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep(2)}>
                        Back
                      </Button>
                      <Button
                        onClick={() => setCurrentStep(4)}
                        className="gap-2"
                        disabled={mintingStatus !== "success" || escrowStatus !== "success"}
                      >
                        Next: Review & Publish
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 4: Review & Publish */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-semibold text-foreground mb-4">Review & Publish</h2>
                      <p className="text-muted-foreground mb-6">
                        Review your listing details before publishing to the platform
                      </p>
                    </div>

                    <Card className="bg-secondary border-border">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <h3 className="font-semibold text-foreground mb-3">Property Details</h3>
                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="text-muted-foreground">Title:</span>{" "}
                                {propertyData.title || "Not specified"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Location:</span>{" "}
                                {propertyData.location || "Not specified"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Type:</span>{" "}
                                {propertyData.propertyType || "Not specified"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Guests:</span>{" "}
                                {propertyData.maxGuests || "Not specified"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Bedrooms:</span>{" "}
                                {propertyData.bedrooms || "Not specified"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Bathrooms:</span>{" "}
                                {propertyData.bathrooms || "Not specified"}
                              </p>
                            </div>
                          </div>

                          <div>
                            <h3 className="font-semibold text-foreground mb-3">Pricing & Verification</h3>
                            <div className="space-y-2 text-sm">
                              <p>
                                <span className="text-muted-foreground">Price per night:</span> $
                                {propertyData.pricePerNight || "Not specified"}
                              </p>
                              <p>
                                <span className="text-muted-foreground">Amenities:</span>{" "}
                                {propertyData.amenities.length} selected
                              </p>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">NFT Status:</span>
                                <Badge className="bg-green-600">Minted</Badge>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-muted-foreground">Escrow Status:</span>
                                <Badge className="bg-green-600">Deposited</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="flex justify-between">
                      <Button variant="outline" onClick={() => setCurrentStep(3)}>
                        Back
                      </Button>
                      <Button className="gap-2">
                        <CheckCircle className="h-4 w-4" />
                        Publish Property
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
