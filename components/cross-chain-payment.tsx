"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useXRPL } from "@/hooks/use-xrpl"
import { useFDC } from "@/hooks/use-fdc"
import { useFTSO } from "@/hooks/use-ftso"
import { useWallet } from "@/hooks/use-wallet"
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ArrowRightLeft, 
  Wallet,
  ExternalLink,
  RefreshCw,
  Copy,
  TrendingUp
} from "lucide-react"
import { toast } from "sonner"

interface PaymentStep {
  id: string
  title: string
  description: string
  status: "pending" | "active" | "completed" | "failed"
  txHash?: string
}

interface CrossChainPaymentProps {
  bookingId: string
  propertyTitle: string
  totalCostUSD: number
  onPaymentComplete: (paymentData: any) => void
  onCancel: () => void
}

export function CrossChainPayment({
  bookingId,
  propertyTitle,
  totalCostUSD,
  onPaymentComplete,
  onCancel,
}: CrossChainPaymentProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<"XRP" | "FLR">("XRP")
  const [paymentMethod, setPaymentMethod] = useState<"direct" | "bridge">("direct")
  const [customAmount, setCustomAmount] = useState("")
  const [recipientAddress, setRecipientAddress] = useState("")
  const [paymentSteps, setPaymentSteps] = useState<PaymentStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const xrpl = useXRPL()
  const fdc = useFDC()
  const ftso = useFTSO()
  const wallet = useWallet()

  // Calculate amounts in different currencies
  const xrpAmount = ftso.convertAmount(totalCostUSD, "USD", "XRP")
  const flrAmount = ftso.convertAmount(totalCostUSD, "USD", "FLR")
  const selectedAmount = selectedCurrency === "XRP" ? xrpAmount : flrAmount
  const xrpPrice = ftso.getXRPPrice()
  const flrPrice = ftso.getFLRPrice()

  // Initialize payment steps
  useEffect(() => {
    const steps: PaymentStep[] = [
      {
        id: "setup",
        title: "Setup Payment",
        description: "Configure payment parameters and verify wallet connections",
        status: "active",
      },
      {
        id: "initiate",
        title: "Initiate Payment",
        description: `Send ${selectedAmount.toFixed(4)} ${selectedCurrency} to complete booking`,
        status: "pending",
      },
      {
        id: "verify",
        title: "Verify Transaction",
        description: "Verify payment on blockchain and submit attestation",
        status: "pending",
      },
      {
        id: "confirm",
        title: "Confirm Booking",
        description: "Finalize booking with verified cross-chain payment",
        status: "pending",
      },
    ]

    if (paymentMethod === "bridge") {
      steps.splice(2, 0, {
        id: "bridge",
        title: "Cross-Chain Bridge",
        description: "Bridge assets between XRPL and Flare networks",
        status: "pending",
      })
    }

    setPaymentSteps(steps)
  }, [selectedCurrency, selectedAmount, paymentMethod])

  const updateStepStatus = (stepId: string, status: PaymentStep["status"], txHash?: string) => {
    setPaymentSteps(prev => 
      prev.map(step => 
        step.id === stepId 
          ? { ...step, status, txHash }
          : step
      )
    )
  }

  const proceedToNextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, paymentSteps.length - 1))
  }

  const handleDirectXRPPayment = async () => {
    try {
      setIsProcessing(true)
      updateStepStatus("setup", "completed")
      proceedToNextStep()

      // Step 1: Initiate XRPL payment
      updateStepStatus("initiate", "active")
      
      if (!xrpl.wallet) {
        throw new Error("XRPL wallet not connected")
      }

      const memo = `booking:${bookingId}`
      const txHash = await xrpl.sendPayment(
        recipientAddress || "rHXpwL4haYpmFptUyN51Xu1fAkjkZDqAZa", // Primary wallet address
        selectedAmount.toString(),
        memo
      )

      updateStepStatus("initiate", "completed", txHash)
      proceedToNextStep()

      // Step 2: Verify transaction and submit attestation
      updateStepStatus("verify", "active")
      
      // Wait for XRPL transaction confirmation
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      const isVerified = await xrpl.verifyTransaction(txHash)
      if (!isVerified) {
        throw new Error("XRPL transaction verification failed")
      }

      // Submit attestation request to FDC
      await fdc.submitAttestationRequest(
        txHash,
        xrpl.address!,
        recipientAddress || "rHXpwL4haYpmFptUyN51Xu1fAkjkZDqAZa",
        selectedAmount.toString()
      )

      updateStepStatus("verify", "completed")
      proceedToNextStep()

      // Step 3: Confirm booking
      updateStepStatus("confirm", "active")
      
      // Wait for attestation processing
      await new Promise(resolve => setTimeout(resolve, 8000))
      
      const paymentData = {
        bookingId,
        currency: selectedCurrency,
        amount: selectedAmount,
        usdValue: totalCostUSD,
        txHash,
        attestationStatus: "attested",
        timestamp: Date.now(),
      }

      updateStepStatus("confirm", "completed")
      
      toast.success("Payment completed successfully!")
      onPaymentComplete(paymentData)

    } catch (error: any) {
      console.error("Payment failed:", error)
      toast.error(error.message || "Payment failed")
      
      const activeStepIndex = paymentSteps.findIndex(step => step.status === "active")
      if (activeStepIndex !== -1) {
        updateStepStatus(paymentSteps[activeStepIndex].id, "failed")
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleFlarePayment = async () => {
    try {
      setIsProcessing(true)
      updateStepStatus("setup", "completed")
      proceedToNextStep()

      // Step 1: Initiate Flare payment
      updateStepStatus("initiate", "active")
      
      if (!wallet.metamaskConnected) {
        throw new Error("MetaMask not connected")
      }

      // This would integrate with your smart contract
      const txHash = await wallet.stakeFlare(selectedAmount)

      updateStepStatus("initiate", "completed", txHash)
      proceedToNextStep()

      // Step 2: Confirm on Flare network
      updateStepStatus("confirm", "active")
      
      await new Promise(resolve => setTimeout(resolve, 5000))
      
      const paymentData = {
        bookingId,
        currency: selectedCurrency,
        amount: selectedAmount,
        usdValue: totalCostUSD,
        txHash,
        network: "Flare",
        timestamp: Date.now(),
      }

      updateStepStatus("confirm", "completed")
      
      toast.success("Payment completed successfully!")
      onPaymentComplete(paymentData)

    } catch (error: any) {
      console.error("Payment failed:", error)
      toast.error(error.message || "Payment failed")
      
      const activeStepIndex = paymentSteps.findIndex(step => step.status === "active")
      if (activeStepIndex !== -1) {
        updateStepStatus(paymentSteps[activeStepIndex].id, "failed")
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePayment = async () => {
    if (selectedCurrency === "XRP") {
      await handleDirectXRPPayment()
    } else {
      await handleFlarePayment()
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success("Copied to clipboard")
  }

  const getStepIcon = (step: PaymentStep) => {
    switch (step.status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "active":
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      default:
        return <div className="h-5 w-5 rounded-full bg-gray-300" />
    }
  }

  if (!ftso.isConnected || (!xrpl.isConnected && selectedCurrency === "XRP")) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Connecting to Networks
          </CardTitle>
          <CardDescription>
            Establishing connections to XRPL and Flare networks...
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>XRPL Testnet</span>
              <Badge variant={xrpl.isConnected ? "default" : "secondary"}>
                {xrpl.isConnected ? "Connected" : "Connecting..."}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span>Flare Network</span>
              <Badge variant={ftso.isConnected ? "default" : "secondary"}>
                {ftso.isConnected ? "Connected" : "Connecting..."}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5" />
            Cross-Chain Payment
          </CardTitle>
          <CardDescription>
            Pay for "{propertyTitle}" using XRPL or Flare Network
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Total Cost (USD)</Label>
              <div className="text-2xl font-bold">${totalCostUSD.toFixed(2)}</div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Label>Select Currency</Label>
              <Select 
                value={selectedCurrency} 
                onValueChange={(value: "XRP" | "FLR") => setSelectedCurrency(value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XRP">
                    <div className="flex items-center justify-between w-full">
                      <span>XRP</span>
                      <div className="text-right ml-4">
                        <div className="font-medium">{xrpAmount.toFixed(4)} XRP</div>
                        <div className="text-sm text-muted-foreground">
                          ${xrpPrice.toFixed(4)} per XRP
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="FLR">
                    <div className="flex items-center justify-between w-full">
                      <span>FLR</span>
                      <div className="text-right ml-4">
                        <div className="font-medium">{flrAmount.toFixed(4)} FLR</div>
                        <div className="text-sm text-muted-foreground">
                          ${flrPrice.toFixed(6)} per FLR
                        </div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center justify-between">
                <span className="font-medium">You will pay:</span>
                <div className="text-right">
                  <div className="text-xl font-bold">
                    {selectedAmount.toFixed(4)} {selectedCurrency}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    ≈ ${totalCostUSD.toFixed(2)} USD
                  </div>
                </div>
              </div>
            </div>

            {selectedCurrency === "XRP" && (
              <div className="space-y-2">
                <Label>Recipient Address (Optional)</Label>
                <Input
                  placeholder="rHXpwL4haYpmFptUyN51Xu1fAkjkZDqAZa"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave empty to use default escrow address
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Wallet Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {selectedCurrency === "XRP" ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>XRPL Wallet</span>
                  <Badge variant={xrpl.wallet ? "default" : "destructive"}>
                    {xrpl.wallet ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
                
                {xrpl.wallet ? (
                  <>
                    <div className="space-y-1">
                      <Label className="text-xs">Address</Label>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted p-1 rounded flex-1 truncate">
                          {xrpl.address}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(xrpl.address!)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Balance</Label>
                      <div className="text-lg font-semibold">
                        {xrpl.balance} XRP
                      </div>
                    </div>
                    
                    {parseFloat(xrpl.balance || "0") < selectedAmount && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Insufficient balance. You need {selectedAmount.toFixed(4)} XRP.
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                ) : (
                  <div className="space-y-2">
                    <Button 
                      onClick={xrpl.createWallet}
                      className="w-full"
                      variant="outline"
                    >
                      Create XRPL Wallet
                    </Button>
                    <p className="text-xs text-muted-foreground">
                      Creates a new testnet wallet with 1000 XRP
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Flare Wallet</span>
                  <Badge variant={wallet.metamaskConnected ? "default" : "destructive"}>
                    {wallet.metamaskConnected ? "Connected" : "Not Connected"}
                  </Badge>
                </div>
                
                {wallet.metamaskConnected ? (
                  <>
                    <div className="space-y-1">
                      <Label className="text-xs">Address</Label>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted p-1 rounded flex-1 truncate">
                          {wallet.metamaskAddress}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyToClipboard(wallet.metamaskAddress!)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <Label className="text-xs">Balance</Label>
                      <div className="text-lg font-semibold">
                        {wallet.metamaskBalance} FLR
                      </div>
                    </div>
                    
                    {parseFloat(wallet.metamaskBalance || "0") < selectedAmount && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Insufficient balance. You need {selectedAmount.toFixed(4)} FLR.
                        </AlertDescription>
                      </Alert>
                    )}
                  </>
                ) : (
                  <Button 
                    onClick={wallet.connectMetaMask}
                    className="w-full"
                    variant="outline"
                  >
                    Connect MetaMask
                  </Button>
                )}
              </div>
            )}

            {/* Price Information */}
            <Separator />
            
            <div className="space-y-2">
              <Label className="flex items-center gap-1 text-xs">
                <TrendingUp className="h-3 w-3" />
                Current Prices
              </Label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-muted p-2 rounded">
                  <div className="font-medium">XRP/USD</div>
                  <div>${xrpPrice.toFixed(4)}</div>
                </div>
                <div className="bg-muted p-2 rounded">
                  <div className="font-medium">FLR/USD</div>
                  <div>${flrPrice.toFixed(6)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payment Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {paymentSteps.map((step, index) => (
              <div 
                key={step.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  step.status === "active" ? "border-blue-500 bg-blue-50" : ""
                }`}
              >
                {getStepIcon(step)}
                <div className="flex-1">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-sm text-muted-foreground">
                    {step.description}
                  </div>
                  {step.txHash && (
                    <div className="flex items-center gap-1 mt-1">
                      <code className="text-xs bg-muted p-1 rounded">
                        {step.txHash.slice(0, 16)}...
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(step.txHash!)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {paymentSteps.length > 0 && (
            <div className="mt-4">
              <Progress 
                value={(paymentSteps.filter(s => s.status === "completed").length / paymentSteps.length) * 100}
                className="h-2"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handlePayment}
          disabled={isProcessing || 
            (selectedCurrency === "XRP" && (!xrpl.wallet || parseFloat(xrpl.balance || "0") < selectedAmount)) ||
            (selectedCurrency === "FLR" && (!wallet.metamaskConnected || parseFloat(wallet.metamaskBalance || "0") < selectedAmount))
          }
          className="flex-1"
          size="lg"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            `Pay ${selectedAmount.toFixed(4)} ${selectedCurrency}`
          )}
        </Button>
        
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isProcessing}
          size="lg"
        >
          Cancel
        </Button>
      </div>
    </div>
  )
}
