"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight, Wallet, Globe, Gift } from "lucide-react"
import { useState } from "react"
import { WalletConnectModal } from "./wallet-connect-modal"
import { useWallet } from "@/hooks/use-wallet"

export function HeroSection() {
  const [showConnectModal, setShowConnectModal] = useState(false)
  const { metamaskConnected, gemConnected } = useWallet()

  const isConnected = metamaskConnected || gemConnected

  const handleLaunchDApp = () => {
    if (!isConnected) {
      setShowConnectModal(true)
    } else {
      // Navigate to dApp interface
      window.location.href = "#properties"
    }
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px]" />

      {/* Floating Elements */}
      <motion.div
        className="absolute top-20 left-20 w-4 h-4 bg-primary rounded-full animate-float"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-40 right-32 w-6 h-6 bg-primary/60 rounded-full animate-float"
        animate={{ y: [0, -30, 0] }}
        transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute bottom-32 left-32 w-3 h-3 bg-primary/40 rounded-full animate-float"
        animate={{ y: [0, -15, 0] }}
        transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut", delay: 2 }}
      />

      <div className="container mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6"
        >
          <span className="text-sm font-mono text-muted-foreground tracking-wider uppercase">
            Cross-Chain Travel Revolution
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl font-bold mb-8 text-balance leading-tight"
        >
          Travel Without
          <br />
          <span className="text-primary">Limitation</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto text-pretty leading-relaxed"
        >
          Disrupt the travel industry with transparent fees, instant cross-chain payments via XRPL & Flare, and
          exclusive rewards that make every journey extraordinary.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
        >
          <Button
            size="lg"
            className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg"
            onClick={handleLaunchDApp}
          >
            {isConnected ? "Enter dApp" : "Launch dApp"}
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="px-8 py-4 text-lg border-border hover:bg-secondary bg-transparent"
          >
            View Demo
          </Button>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-card border border-border rounded-xl p-6 backdrop-blur-sm"
          >
            <Wallet className="h-12 w-12 text-primary mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Dual Wallet Support</h3>
            <p className="text-muted-foreground">MetaMask for Flare EVM & Gem Wallet for XRPL integration</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-card border border-border rounded-xl p-6 backdrop-blur-sm"
          >
            <Globe className="h-12 w-12 text-primary mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Transparent Fees</h3>
            <p className="text-muted-foreground">Cut Airbnb's massive fees in half with blockchain efficiency</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-card border border-border rounded-xl p-6 backdrop-blur-sm"
          >
            <Gift className="h-12 w-12 text-primary mb-4 mx-auto" />
            <h3 className="text-xl font-semibold mb-2">Daily Rewards</h3>
            <p className="text-muted-foreground">Win free vacations, NFTs, and exclusive discounts</p>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-16 text-center"
        >
          <p className="text-sm text-muted-foreground font-mono tracking-wider">SCROLL TO REVEAL</p>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-px h-16 bg-gradient-to-b from-primary to-transparent mx-auto mt-4"
          />
        </motion.div>
      </div>

      {/* Wallet Connect Modal */}
      <WalletConnectModal open={showConnectModal} onOpenChange={setShowConnectModal} />
    </section>
  )
}
