"use client"

import { useState, useEffect } from "react"
import { useWallet } from "@/hooks/use-wallet"

interface WalletVerification {
  age: number // in days
  isVerified: boolean
  riskScore: number
  deviceFingerprint: string
  previousBookings: number
  hasCompletedBookings: boolean
  isBanned: boolean
}

interface DeviceFingerprint {
  userAgent: string
  screen: string
  timezone: string
  language: string
  platform: string
  webgl: string
  canvas: string
}

interface BookingFraudCheck {
  isSelfBooking: boolean
  deviceMatch: boolean
  ipMatch: boolean
  walletAge: number
  cooldownViolation: boolean
  riskScore: number
}

export function useFraudProtection() {
  const { walletAddress, isConnected } = useWallet()
  const [walletVerification, setWalletVerification] = useState<WalletVerification | null>(null)
  const [deviceFingerprint, setDeviceFingerprint] = useState<DeviceFingerprint | null>(null)
  const [loading, setLoading] = useState(false)

  // Generate device fingerprint
  useEffect(() => {
    const generateFingerprint = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      ctx?.fillText('Device fingerprint', 0, 10)
      const canvasFingerprint = canvas.toDataURL()

      const fingerprint: DeviceFingerprint = {
        userAgent: navigator.userAgent,
        screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        platform: navigator.platform,
        webgl: 'mock-webgl-signature', // In real implementation, would get WebGL fingerprint
        canvas: btoa(canvasFingerprint).slice(0, 20)
      }

      setDeviceFingerprint(fingerprint)
    }

    generateFingerprint()
  }, [])

  // Verify wallet and check for fraud indicators
  const verifyWallet = async (address: string): Promise<WalletVerification> => {
    setLoading(true)

    // Simulate wallet verification checks
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock wallet age calculation (in real app, check blockchain history)
    const mockWalletAge = Math.floor(Math.random() * 365) + 1
    
    // Mock risk score calculation
    let riskScore = 0
    
    // Increase risk for new wallets
    if (mockWalletAge < 7) riskScore += 30
    if (mockWalletAge < 1) riskScore += 50

    // Check device fingerprint against known bad actors
    const deviceHash = btoa(JSON.stringify(deviceFingerprint)).slice(0, 16)
    const knownBadDevices = ['YmFkZGV2aWNl', 'c3VzcGljaW91cw=='] // Mock bad device hashes
    if (knownBadDevices.includes(deviceHash)) riskScore += 70

    // Mock previous bookings check
    const mockPreviousBookings = Math.floor(Math.random() * 10)
    const hasCompletedBookings = mockPreviousBookings > 0

    if (!hasCompletedBookings) riskScore += 20

    // Check banned wallets list
    const bannedWallets = [
      '0x1234567890abcdef1234567890abcdef12345678',
      '0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef'
    ]
    const isBanned = bannedWallets.includes(address.toLowerCase())
    if (isBanned) riskScore = 100

    const verification: WalletVerification = {
      age: mockWalletAge,
      isVerified: riskScore < 70 && !isBanned,
      riskScore: Math.min(riskScore, 100),
      deviceFingerprint: deviceHash,
      previousBookings: mockPreviousBookings,
      hasCompletedBookings,
      isBanned
    }

    setWalletVerification(verification)
    setLoading(false)
    
    return verification
  }

  // Check for booking fraud indicators
  const checkBookingFraud = async (
    propertyHostWallet: string,
    propertyId: string
  ): Promise<BookingFraudCheck> => {
    if (!walletAddress || !walletVerification) {
      throw new Error("Wallet not verified")
    }

    // Check if user is booking their own property
    const isSelfBooking = walletAddress.toLowerCase() === propertyHostWallet.toLowerCase()

    // Mock device/IP matching (in real app, check against database)
    const deviceMatch = Math.random() < 0.1 // 10% chance of device match
    const ipMatch = Math.random() < 0.05 // 5% chance of IP match

    // Check cooldown period (mock)
    const lastBookingTime = localStorage.getItem(`lastBooking_${walletAddress}`)
    const cooldownHours = 2
    const cooldownViolation = lastBookingTime ? 
      (Date.now() - parseInt(lastBookingTime)) < (cooldownHours * 60 * 60 * 1000) : false

    // Calculate booking risk score
    let bookingRiskScore = walletVerification.riskScore * 0.5 // Base from wallet risk

    if (isSelfBooking) bookingRiskScore += 90
    if (deviceMatch) bookingRiskScore += 40
    if (ipMatch) bookingRiskScore += 30
    if (cooldownViolation) bookingRiskScore += 25
    if (walletVerification.age < 1) bookingRiskScore += 30

    return {
      isSelfBooking,
      deviceMatch,
      ipMatch,
      walletAge: walletVerification.age,
      cooldownViolation,
      riskScore: Math.min(bookingRiskScore, 100)
    }
  }

  // Check for review fraud
  const checkReviewFraud = (bookingId: string, rating: number): boolean => {
    if (!walletVerification) return false

    // High risk if new wallet giving perfect rating
    if (walletVerification.age < 7 && rating === 5) return true
    
    // High risk if wallet has no previous completed bookings
    if (!walletVerification.hasCompletedBookings) return true

    return false
  }

  // Record booking attempt for cooldown tracking
  const recordBookingAttempt = () => {
    if (walletAddress) {
      localStorage.setItem(`lastBooking_${walletAddress}`, Date.now().toString())
    }
  }

  // Check if wallet can participate in raffles
  const canParticipateInRaffle = (): boolean => {
    if (!walletVerification) return false
    
    return walletVerification.age >= 7 && 
           walletVerification.hasCompletedBookings && 
           !walletVerification.isBanned &&
           walletVerification.riskScore < 70
  }

  // Get human-readable risk assessment
  const getRiskAssessment = (riskScore: number): { level: string; color: string; description: string } => {
    if (riskScore >= 80) {
      return {
        level: "High Risk",
        color: "text-red-500",
        description: "Multiple fraud indicators detected. Manual review required."
      }
    } else if (riskScore >= 50) {
      return {
        level: "Medium Risk", 
        color: "text-yellow-500",
        description: "Some suspicious activity. Enhanced monitoring recommended."
      }
    } else if (riskScore >= 20) {
      return {
        level: "Low Risk",
        color: "text-blue-500", 
        description: "Minor risk factors present. Standard processing."
      }
    } else {
      return {
        level: "Verified User",
        color: "text-green-500",
        description: "Low fraud risk. Trusted user with good history."
      }
    }
  }

  // Initialize wallet verification on connection
  useEffect(() => {
    if (isConnected && walletAddress && !walletVerification) {
      verifyWallet(walletAddress)
    }
  }, [isConnected, walletAddress])

  return {
    walletVerification,
    deviceFingerprint,
    loading,
    verifyWallet,
    checkBookingFraud,
    checkReviewFraud,
    recordBookingAttempt,
    canParticipateInRaffle,
    getRiskAssessment
  }
}
