"use client"

import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { useWallet } from "@/hooks/use-wallet"
import { Wallet, ExternalLink, AlertCircle, CheckCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface WalletConnectModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WalletConnectModal({ open, onOpenChange }: WalletConnectModalProps) {
  const { connectMetaMask, connectGemWallet, connectionStatus, error, clearError, metamaskConnected, gemConnected } =
    useWallet()
  
  const [metamaskAvailable, setMetamaskAvailable] = useState(false)
  const [gemWalletAvailable, setGemWalletAvailable] = useState(false)

  // Check wallet availability
  useEffect(() => {
    setMetamaskAvailable(typeof window !== 'undefined' && !!window.ethereum)
    setGemWalletAvailable(typeof window !== 'undefined' && !!window.gemWallet)
  }, [])

  const handleMetaMaskConnect = async () => {
    clearError()
    try {
      await connectMetaMask()
    } catch (err: any) {
      // Error is handled in the hook, but we can add UI feedback here
      console.error("MetaMask connection failed:", err)
    }
  }

  const handleGemWalletConnect = async () => {
    clearError()
    try {
      await connectGemWallet()
    } catch (err: any) {
      // Error is handled in the hook, but we can add UI feedback here
      console.error("GemWallet connection failed:", err)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Wallet className="h-6 w-6 text-primary" />
            Connect Your Wallets
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-muted-foreground text-sm">
            Connect both wallets to access the full Crypto Cribs experience with cross-chain payments.
          </p>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                <span>{error}</span>
                <Button size="sm" variant="outline" onClick={clearError}>
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* MetaMask Connection */}
          <motion.div whileHover={{ scale: 1.02 }} className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <div>
                  <h3 className="font-semibold">MetaMask</h3>
                  <p className="text-sm text-muted-foreground">For Flare Network (EVM)</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Flare
                </Badge>
                {metamaskConnected && <CheckCircle className="h-5 w-5 text-green-500" />}
              </div>
            </div>

            <Button
              onClick={handleMetaMaskConnect}
              disabled={connectionStatus === "connecting" || metamaskConnected || !metamaskAvailable}
              className="w-full"
              variant={metamaskConnected ? "secondary" : metamaskAvailable ? "default" : "outline"}
            >
              {connectionStatus === "connecting" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : metamaskConnected ? (
                "Connected"
              ) : !metamaskAvailable ? (
                "MetaMask Not Detected"
              ) : (
                "Connect MetaMask"
              )}
            </Button>

            {!metamaskConnected && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Don't have MetaMask?</span>
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  Install here
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </motion.div>

          {/* Gem Wallet Connection */}
          <motion.div whileHover={{ scale: 1.02 }} className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">G</span>
                </div>
                <div>
                  <h3 className="font-semibold">Gem Wallet</h3>
                  <p className="text-sm text-muted-foreground">For XRPL Network</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  XRPL
                </Badge>
                {gemConnected && <CheckCircle className="h-5 w-5 text-green-500" />}
              </div>
            </div>

            <Button
              onClick={handleGemWalletConnect}
              disabled={connectionStatus === "connecting" || gemConnected || !gemWalletAvailable}
              className="w-full"
              variant={gemConnected ? "secondary" : gemWalletAvailable ? "default" : "outline"}
            >
              {connectionStatus === "connecting" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : gemConnected ? (
                "Connected"
              ) : !gemWalletAvailable ? (
                "Gem Wallet Not Detected"
              ) : (
                "Connect Gem Wallet"
              )}
            </Button>

            {!gemConnected && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Don't have Gem Wallet?</span>
                <a
                  href="https://gemwallet.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-1"
                >
                  Install here
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            )}
          </motion.div>

          {/* Demo Mode for Testing */}
          {!metamaskAvailable && !gemWalletAvailable && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  No wallets detected. Install MetaMask or GemWallet to connect, or continue in demo mode.
                </AlertDescription>
              </Alert>
              <Button 
                onClick={() => onOpenChange(false)} 
                variant="outline" 
                className="w-full mt-4"
              >
                Continue in Demo Mode
              </Button>
            </motion.div>
          )}

          {(metamaskConnected || gemConnected) && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center pt-4">
              <Button onClick={() => onOpenChange(false)} className="w-full bg-primary hover:bg-primary/90">
                Continue to dApp
              </Button>
            </motion.div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
