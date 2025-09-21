"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Shield, Coins, CheckCircle, AlertCircle, ExternalLink, Copy } from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"

interface PropertyMintingProps {
  propertyId?: string
  propertyTitle?: string
  onMintSuccess?: (tokenId: string) => void
}

export function PropertyMinting({ propertyId, propertyTitle, onMintSuccess }: PropertyMintingProps) {
  const { isConnected, address } = useWallet()
  const [mintingStep, setMintingStep] = useState(0) // 0: ready, 1: preparing, 2: minting, 3: success
  const [tokenId, setTokenId] = useState("")
  const [transactionHash, setTransactionHash] = useState("")

  const mintingSteps = [
    "Preparing metadata",
    "Uploading to IPFS",
    "Creating NFT contract",
    "Minting property NFT",
    "Finalizing on blockchain",
  ]

  const handleMintProperty = async () => {
    if (!isConnected) {
      alert("Please connect your wallet first")
      return
    }

    setMintingStep(1)

    // Simulate minting process with steps
    for (let i = 0; i < mintingSteps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMintingStep(i + 1)
    }

    // Simulate successful minting
    const mockTokenId = `VCP${Math.floor(Math.random() * 10000)}`
    const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`

    setTokenId(mockTokenId)
    setTransactionHash(mockTxHash)
    setMintingStep(3)

    if (onMintSuccess) {
      onMintSuccess(mockTokenId)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Property NFT Minting
        </CardTitle>
        <CardDescription>
          Create a unique NFT for your property to ensure authenticity and ownership verification
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Property Info */}
        {propertyTitle && (
          <div className="p-4 bg-secondary rounded-lg">
            <p className="font-medium text-foreground">{propertyTitle}</p>
            <p className="text-sm text-muted-foreground">Property ID: {propertyId || "Pending"}</p>
          </div>
        )}

        {/* Minting Cost */}
        <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
          <div>
            <p className="font-medium text-foreground">Minting Cost</p>
            <p className="text-sm text-muted-foreground">One-time blockchain fee</p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="mb-1">
              0.05 ETH
            </Badge>
            <p className="text-xs text-muted-foreground">≈ $120 USD</p>
          </div>
        </div>

        {/* Minting Status */}
        {mintingStep === 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <Shield className="h-5 w-5 text-blue-400" />
              <div>
                <p className="font-medium text-foreground">Ready to Mint</p>
                <p className="text-sm text-muted-foreground">
                  Your property will be minted as a unique NFT on the blockchain
                </p>
              </div>
            </div>

            <Button onClick={handleMintProperty} className="w-full gap-2" disabled={!isConnected}>
              <Coins className="h-4 w-4" />
              {isConnected ? "Mint Property NFT" : "Connect Wallet First"}
            </Button>
          </div>
        )}

        {/* Minting in Progress */}
        {mintingStep > 0 && mintingStep < 3 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-400"></div>
              <div>
                <p className="font-medium text-foreground">Minting in Progress</p>
                <p className="text-sm text-muted-foreground">
                  {mintingStep <= mintingSteps.length ? mintingSteps[mintingStep - 1] : "Finalizing..."}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="text-foreground">
                  {Math.min(mintingStep, mintingSteps.length)}/{mintingSteps.length}
                </span>
              </div>
              <Progress value={(mintingStep / mintingSteps.length) * 100} className="h-2" />
            </div>

            <Button disabled className="w-full gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              Minting Property NFT...
            </Button>
          </div>
        )}

        {/* Minting Success */}
        {mintingStep === 3 && (
          <div className="space-y-4">
            <div className="text-center space-y-3">
              <CheckCircle className="h-12 w-12 text-green-400 mx-auto" />
              <div>
                <p className="text-lg font-semibold text-green-400">Property NFT Minted Successfully!</p>
                <p className="text-sm text-muted-foreground">Your property is now verified on the blockchain</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm text-muted-foreground">Token ID</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-foreground">{tokenId}</span>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(tokenId)} className="h-6 w-6 p-0">
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <span className="text-sm text-muted-foreground">Transaction</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm text-foreground">
                    {transactionHash.slice(0, 8)}...{transactionHash.slice(-6)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(transactionHash)}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-400" />
              <div>
                <p className="font-medium text-foreground">Verification Complete</p>
                <p className="text-sm text-muted-foreground">
                  Your property is now blockchain-verified and ready for listing
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Wallet Connection Warning */}
        {!isConnected && (
          <div className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-yellow-400" />
            <div>
              <p className="font-medium text-foreground">Wallet Connection Required</p>
              <p className="text-sm text-muted-foreground">Please connect your wallet to mint your property NFT</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
