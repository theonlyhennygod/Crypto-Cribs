"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Users, 
  Eye,
  Clock,
  TrendingUp,
  MapPin,
  Wallet,
  Ban,
  Flag
} from "lucide-react"

interface PendingListing {
  id: string
  title: string
  host: string
  walletAddress: string
  location: string
  depositAmount: number
  riskScore: number
  submittedAt: string
  checks: {
    walletAge: boolean
    gpsVerification: boolean
    deviceFingerprint: boolean
    duplicateCheck: boolean
  }
  flags: string[]
}

interface SuspiciousActivity {
  id: string
  type: 'self_booking' | 'fake_review' | 'sybil_attack' | 'listing_spam'
  description: string
  walletAddress: string
  severity: 'low' | 'medium' | 'high'
  detectedAt: string
  status: 'investigating' | 'confirmed' | 'false_positive'
}

export function FraudPreventionDashboard() {
  const [pendingListings] = useState<PendingListing[]>([
    {
      id: "1",
      title: "Luxury Beachfront Villa",
      host: "John Doe",
      walletAddress: "0x742d35Cc6634C0532925a3b8D4",
      location: "Miami, FL",
      depositAmount: 50,
      riskScore: 15,
      submittedAt: "2024-12-20T10:30:00Z",
      checks: {
        walletAge: true,
        gpsVerification: true,
        deviceFingerprint: true,
        duplicateCheck: false
      },
      flags: ["New host", "High-value property"]
    },
    {
      id: "2", 
      title: "Downtown Apartment",
      host: "Sarah Wilson",
      walletAddress: "0x8ba1f109551bD432803012645a2b39",
      location: "New York, NY",
      depositAmount: 30,
      riskScore: 75,
      submittedAt: "2024-12-20T09:15:00Z",
      checks: {
        walletAge: false,
        gpsVerification: true,
        deviceFingerprint: false,
        duplicateCheck: true
      },
      flags: ["Wallet <7 days old", "Similar listing detected", "Suspicious device"]
    }
  ])

  const [suspiciousActivities] = useState<SuspiciousActivity[]>([
    {
      id: "1",
      type: "self_booking",
      description: "Wallet 0x742d...32925 booked own property multiple times",
      walletAddress: "0x742d35Cc6634C0532925a3b8D4",
      severity: "high",
      detectedAt: "2024-12-20T08:45:00Z",
      status: "investigating"
    },
    {
      id: "2",
      type: "fake_review",
      description: "Pattern detected: Multiple 5-star reviews from new wallets",
      walletAddress: "0x8ba1f109551bD432803012645a2b39",
      severity: "medium", 
      detectedAt: "2024-12-20T07:20:00Z",
      status: "confirmed"
    },
    {
      id: "3",
      type: "sybil_attack",
      description: "Device fingerprint matches 5+ wallet addresses",
      walletAddress: "0x1234567890abcdef1234567890abcdef",
      severity: "high",
      detectedAt: "2024-12-19T22:10:00Z",
      status: "confirmed"
    }
  ])

  const handleApproveListing = (listingId: string) => {
    console.log("[v0] Approving listing:", listingId)
    // Implement approval logic
  }

  const handleRejectListing = (listingId: string) => {
    console.log("[v0] Rejecting listing:", listingId)
    // Implement rejection logic
  }

  const handleBanWallet = (walletAddress: string) => {
    console.log("[v0] Banning wallet:", walletAddress)
    // Implement wallet banning logic
  }

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-red-500"
    if (score >= 40) return "text-yellow-500"
    return "text-green-500"
  }

  const getRiskBadge = (score: number) => {
    if (score >= 70) return <Badge variant="destructive">High Risk</Badge>
    if (score >= 40) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Medium Risk</Badge>
    return <Badge className="bg-green-100 text-green-800">Low Risk</Badge>
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-500'
      case 'medium': return 'text-yellow-500'
      case 'low': return 'text-blue-500'
      default: return 'text-gray-500'
    }
  }

  const fraudStats = [
    {
      title: "Blocked Fraudulent Listings",
      value: "47",
      change: "+12 this week",
      icon: Shield,
      color: "text-green-400",
    },
    {
      title: "Suspicious Activities",
      value: "23",
      change: "Active investigations",
      icon: AlertTriangle,
      color: "text-yellow-400",
    },
    {
      title: "Banned Wallets",
      value: "156",
      change: "+8 this month",
      icon: Ban,
      color: "text-red-400",
    },
    {
      title: "Prevention Rate",
      value: "94.2%",
      change: "+2.1% from last month",
      icon: TrendingUp,
      color: "text-blue-400",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Fraud Prevention Dashboard</h2>
          <p className="text-muted-foreground">Monitor and manage platform security</p>
        </div>
        <Alert className="max-w-md">
          <Shield className="h-4 w-4" />
          <AlertTitle>Security Status: Active</AlertTitle>
          <AlertDescription>
            All fraud prevention systems are operational
          </AlertDescription>
        </Alert>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {fraudStats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-secondary ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending">Pending Reviews ({pendingListings.length})</TabsTrigger>
          <TabsTrigger value="suspicious">Suspicious Activity ({suspiciousActivities.length})</TabsTrigger>
          <TabsTrigger value="settings">Security Settings</TabsTrigger>
        </TabsList>

        {/* Pending Listings Review */}
        <TabsContent value="pending" className="space-y-4">
          {pendingListings.map((listing) => (
            <Card key={listing.id} className="border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{listing.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      {listing.host} • {listing.walletAddress.slice(0, 10)}...
                      <MapPin className="h-3 w-3 ml-2" />
                      {listing.location}
                    </div>
                  </div>
                  <div className="text-right">
                    {getRiskBadge(listing.riskScore)}
                    <p className="text-sm text-muted-foreground mt-1">
                      Risk Score: <span className={getRiskColor(listing.riskScore)}>{listing.riskScore}%</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    {listing.checks.walletAge ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    Wallet Age
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {listing.checks.gpsVerification ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    GPS Verified
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {listing.checks.deviceFingerprint ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    Device Check
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {!listing.checks.duplicateCheck ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                    No Duplicates
                  </div>
                </div>

                {listing.flags.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Security Flags:</p>
                    <div className="flex flex-wrap gap-2">
                      {listing.flags.map((flag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          <Flag className="h-3 w-3 mr-1" />
                          {flag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Wallet className="h-3 w-3" />
                    Deposit: {listing.depositAmount} FXRP
                    <Clock className="h-3 w-3 ml-2" />
                    {new Date(listing.submittedAt).toLocaleDateString()}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRejectListing(listing.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <XCircle className="h-3 w-3 mr-1" />
                      Reject
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handleApproveListing(listing.id)}
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Approve
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Suspicious Activity */}
        <TabsContent value="suspicious" className="space-y-4">
          {suspiciousActivities.map((activity) => (
            <Card key={activity.id} className="border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant={activity.severity === 'high' ? 'destructive' : activity.severity === 'medium' ? 'secondary' : 'outline'}>
                        {activity.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">{activity.type.replace('_', ' ').toUpperCase()}</Badge>
                    </div>
                    <p className="font-medium">{activity.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Wallet: {activity.walletAddress}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      activity.status === 'confirmed' ? 'destructive' :
                      activity.status === 'investigating' ? 'secondary' :
                      'outline'
                    }>
                      {activity.status.replace('_', ' ')}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(activity.detectedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-3 w-3 mr-1" />
                    Investigate
                  </Button>
                  {activity.severity === 'high' && (
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => handleBanWallet(activity.walletAddress)}
                    >
                      <Ban className="h-3 w-3 mr-1" />
                      Ban Wallet
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fraud Detection Thresholds</CardTitle>
                <CardDescription>Configure automatic fraud detection sensitivity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Risk Score Threshold (Auto-reject if above)</label>
                  <div className="mt-1 text-2xl font-bold text-red-500">85%</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Minimum Wallet Age (days)</label>
                  <div className="mt-1 text-2xl font-bold">7</div>
                </div>
                <div>
                  <label className="text-sm font-medium">Required Listing Deposit (FXRP)</label>
                  <div className="mt-1 text-2xl font-bold">10-50</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Active Protection Features</CardTitle>
                <CardDescription>Real-time fraud prevention systems</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  "GPS Image Verification",
                  "Device Fingerprinting", 
                  "Wallet Age Verification",
                  "Duplicate Listing Detection",
                  "Self-Booking Prevention",
                  "Sybil Attack Detection",
                  "Review Manipulation Detection",
                  "IPFS Metadata Immutability"
                ].map((feature) => (
                  <div key={feature} className="flex items-center justify-between">
                    <span className="text-sm">{feature}</span>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
