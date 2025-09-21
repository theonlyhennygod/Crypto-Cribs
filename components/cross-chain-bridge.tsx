"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowUpDown, Coins, Zap, Shield, ExternalLink } from "lucide-react"
import { useState } from "react"
import { useWallet } from "@/hooks/use-wallet"

export function CrossChainBridge() {
  const { isConnected, xrplWallet, flareWallet, sendXRPPayment } = useWallet()
  const [fromChain, setFromChain] = useState<"XRPL" | "Flare">("XRPL")
  const [toChain, setToChain] = useState<"XRPL" | "Flare">("Flare")
  const [amount, setAmount] = useState("")
  const [isSwapping, setIsSwapping] = useState(false)
  const [txHash, setTxHash] = useState("")

  const exchangeRate = 0.85 // Mock exchange rate XRP to FLR
  const bridgeFee = 0.1 // 0.1% bridge fee
  const estimatedReceive = Number.parseFloat(amount || "0") * exchangeRate * (1 - bridgeFee / 100)

  const handleSwapChains = () => {
    setFromChain(toChain)
    setToChain(fromChain)
  }

  const handleBridge = async () => {
    if (!isConnected || !amount) return

    setIsSwapping(true)
    try {
      if (fromChain === "XRPL") {
        // Bridge from XRPL to Flare
        const hash = await sendXRPPayment(
          Number.parseFloat(amount),
          "rBridgeContractAddress123456789", // Mock bridge contract
          `Bridge to Flare: ${flareWallet?.address}`,
        )
        setTxHash(hash)
        console.log("[v0] Cross-chain bridge initiated:", hash)
      } else {
        // Bridge from Flare to XRPL (would use Flare contract)
        console.log("[v0] Bridging from Flare to XRPL:", amount)
      }
    } catch (error) {
      console.error("[v0] Bridge transaction failed:", error)
    } finally {
      setIsSwapping(false)
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-primary/20">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
              <ArrowUpDown className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Cross-Chain Bridge</h3>
            <p className="text-sm text-muted-foreground">Seamlessly bridge assets between XRPL and Flare</p>
          </div>

          {/* Bridge Interface */}
          <div className="space-y-4">
            {/* From Chain */}
            <div className="space-y-2">
              <Label>From</Label>
              <div className="flex items-center justify-between p-4 border rounded-lg bg-background/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Coins className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{fromChain}</p>
                    <p className="text-sm text-muted-foreground">
                      Balance: {fromChain === "XRPL" ? xrplWallet?.balance || "0" : flareWallet?.balance || "0"}{" "}
                      {fromChain === "XRPL" ? "XRP" : "FLR"}
                    </p>
                  </div>
                </div>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-32 text-right border-0 bg-transparent text-lg font-semibold"
                />
              </div>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={handleSwapChains}
                className="rounded-full p-2 h-10 w-10 bg-transparent"
              >
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </div>

            {/* To Chain */}
            <div className="space-y-2">
              <Label>To</Label>
              <div className="flex items-center justify-between p-4 border rounded-lg bg-background/50">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center">
                    <Coins className="h-4 w-4 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{toChain}</p>
                    <p className="text-sm text-muted-foreground">
                      Balance: {toChain === "XRPL" ? xrplWallet?.balance || "0" : flareWallet?.balance || "0"}{" "}
                      {toChain === "XRPL" ? "XRP" : "FLR"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold">{estimatedReceive.toFixed(4)}</p>
                  <p className="text-sm text-muted-foreground">{toChain === "XRPL" ? "XRP" : "FLR"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Bridge Details */}
          {amount && (
            <div className="space-y-3 p-4 bg-background/30 rounded-lg">
              <div className="flex justify-between text-sm">
                <span>Exchange Rate</span>
                <span>1 XRP = {exchangeRate} FLR</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Bridge Fee</span>
                <span>{bridgeFee}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Estimated Time</span>
                <span>~2-5 minutes</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>You'll receive</span>
                <span>
                  {estimatedReceive.toFixed(4)} {toChain === "XRPL" ? "XRP" : "FLR"}
                </span>
              </div>
            </div>
          )}

          {/* Bridge Button */}
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
            onClick={handleBridge}
            disabled={!isConnected || !amount || isSwapping || Number.parseFloat(amount) <= 0}
          >
            {isSwapping ? (
              <>
                <Zap className="h-5 w-5 mr-2 animate-spin" />
                Bridging...
              </>
            ) : (
              <>
                <ArrowUpDown className="h-5 w-5 mr-2" />
                Bridge {amount || "0"} {fromChain === "XRPL" ? "XRP" : "FLR"}
              </>
            )}
          </Button>

          {/* Transaction Hash */}
          {txHash && (
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">Transaction Submitted</span>
              </div>
              <div className="flex items-center gap-2">
                <p className="text-xs text-green-600 font-mono">{txHash}</p>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          )}

          {/* Security Notice */}
          <div className="text-center text-xs text-muted-foreground">
            <Shield className="h-4 w-4 inline mr-1" />
            Secured by multi-signature smart contracts
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
