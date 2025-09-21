"use client"

import { motion } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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

  const handleMetaMaskConnect = async () => {
    clearError()
    await connectMetaMask()
  }

  const handleGemWalletConnect = async () => {
    clearError()
    await connectGemWallet()
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
              <AlertDescription>{error}</AlertDescription>
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
              disabled={connectionStatus === "connecting" || metamaskConnected}
              className="w-full"
              variant={metamaskConnected ? "secondary" : "default"}
            >
              {connectionStatus === "connecting" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : metamaskConnected ? (
                "Connected"
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
              disabled={connectionStatus === "connecting" || gemConnected}
              className="w-full"
              variant={gemConnected ? "secondary" : "default"}
            >
              {connectionStatus === "connecting" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : gemConnected ? (
                "Connected"
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
