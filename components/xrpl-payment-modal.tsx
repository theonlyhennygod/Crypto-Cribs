"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  ExternalLink,
  Copy,
  Wallet,
  ArrowRight,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { useFDC } from "@/hooks/use-fdc";
import { toast } from "sonner";

interface XRPLPaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bookingDetails: {
    propertyTitle: string;
    checkIn: string;
    checkOut: string;
    guests: number;
    nights: number;
    totalAmount: number;
    hostWallet: string;
  };
  onPaymentSuccess: (txHash: string, attestationData?: any) => void;
}

interface PaymentStep {
  id: string;
  title: string;
  description: string;
  status: "pending" | "active" | "completed" | "failed";
}

export function XRPLPaymentModal({
  open,
  onOpenChange,
  bookingDetails,
  onPaymentSuccess,
}: XRPLPaymentModalProps) {
  const {
    gemConnected,
    gemAddress,
    gemBalance,
    sendXRPPayment,
    connectGemWallet,
  } = useWallet();

  const { submitAttestationRequest } = useFDC();

  const [paymentSteps, setPaymentSteps] = useState<PaymentStep[]>([
    {
      id: "connect",
      title: "Connect GemWallet",
      description: "Connect your GemWallet for XRPL testnet",
      status: "pending",
    },
    {
      id: "payment",
      title: "Send XRP Payment",
      description: `Send ${bookingDetails.totalAmount} XRP to host via GemWallet`,
      status: "pending",
    },
    {
      id: "verification",
      title: "Verify Transaction",
      description: "Verify payment on XRPL testnet ledger",
      status: "pending",
    },
    {
      id: "attestation",
      title: "Cross-Chain Attestation",
      description: "Submit transaction proof to Flare Network via FDC",
      status: "pending",
    },
  ]);

  const [currentStep, setCurrentStep] = useState(0);
  const [paymentTxHash, setPaymentTxHash] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [attestationId, setAttestationId] = useState<string>("");

  // Update steps based on GemWallet connection
  useEffect(() => {
    if (gemConnected && gemAddress) {
      updateStepStatus("connect", "completed");
      setCurrentStep(1);
    }
  }, [gemConnected, gemAddress]);

  // Handle payment completion
  const handlePaymentComplete = async (txHash: string) => {
    setPaymentTxHash(txHash);
    updateStepStatus("payment", "completed");
    updateStepStatus("verification", "completed");
    setCurrentStep(3);
    
    // Wait a moment for transaction to propagate, then handle attestation
    setTimeout(() => {
      handleAttestation(txHash);
    }, 2000);
  };

  const updateStepStatus = (stepId: string, status: PaymentStep["status"]) => {
    setPaymentSteps(prev =>
      prev.map(step =>
        step.id === stepId ? { ...step, status } : step
      )
    );
  };

  const handleConnectWallet = async () => {
    try {
      setIsProcessing(true);
      updateStepStatus("connect", "active");
      
      if (!gemConnected) {
        await connectGemWallet();
      }
      
      toast.success("GemWallet connected successfully!");
    } catch (error: any) {
      console.error("GemWallet connection error:", error);
      updateStepStatus("connect", "failed");
      toast.error(`Failed to connect GemWallet: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendPayment = async () => {
    if (!gemConnected || !gemAddress) {
      toast.error("Please connect your GemWallet first");
      return;
    }

    try {
      setIsProcessing(true);
      updateStepStatus("payment", "active");

      const memo = `Crypto Cribs Booking - ${bookingDetails.propertyTitle}`;
      
      const result = await sendXRPPayment(
        bookingDetails.hostWallet,
        bookingDetails.totalAmount,
        memo
      );

      if (result.success && result.txHash) {
        toast.success("Payment sent successfully!");
        handlePaymentComplete(result.txHash);
      } else {
        throw new Error(result.error || "Payment failed");
      }
      
    } catch (error: any) {
      console.error("Payment error:", error);
      updateStepStatus("payment", "failed");
      toast.error(`Payment failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleAttestation = async (txHash: string) => {
    try {
      setIsProcessing(true);
      updateStepStatus("attestation", "active");

      // Submit transaction for FDC attestation
      const attestationResult = await submitAttestationRequest(
        txHash,
        gemAddress || "",
        bookingDetails.hostWallet,
        bookingDetails.totalAmount.toString()
      );

      if (attestationResult.success) {
        setAttestationId(attestationResult.attestationId || "");
        updateStepStatus("attestation", "completed");
        
        toast.success("Payment verified and attested on Flare Network!");
        onPaymentSuccess(txHash, attestationResult);
      } else {
        throw new Error(attestationResult.error || "Attestation failed");
      }
      
    } catch (error: any) {
      console.error("Attestation error:", error);
      updateStepStatus("attestation", "failed");
      toast.error(`Attestation failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const getStepIcon = (step: PaymentStep) => {
    switch (step.status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "active":
        return <Clock className="h-5 w-5 text-blue-500 animate-pulse" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-muted-foreground" />;
    }
  };

  const progress = (paymentSteps.filter(s => s.status === "completed").length / paymentSteps.length) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            XRPL Payment - {bookingDetails.propertyTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Payment Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Check-in:</span>
                  <p className="font-medium">{bookingDetails.checkIn}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Check-out:</span>
                  <p className="font-medium">{bookingDetails.checkOut}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Guests:</span>
                  <p className="font-medium">{bookingDetails.guests}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Nights:</span>
                  <p className="font-medium">{bookingDetails.nights}</p>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold">Total Amount:</span>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {bookingDetails.totalAmount} XRP
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Payment Steps */}
          <div className="space-y-4">
            {paymentSteps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-start gap-4 p-4 rounded-lg border ${
                  step.status === "active" ? "border-primary bg-primary/5" :
                  step.status === "completed" ? "border-green-500 bg-green-50" :
                  step.status === "failed" ? "border-red-500 bg-red-50" :
                  "border-muted"
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getStepIcon(step)}
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="font-medium">{step.title}</h4>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  
                  {/* Step-specific content */}
                  {step.id === "connect" && step.status === "active" && (
                    <div className="mt-3 space-y-2">
                      {!gemConnected && (
                        <Button 
                          onClick={handleConnectWallet}
                          disabled={isProcessing}
                          size="sm"
                        >
                          <Wallet className="mr-2 h-4 w-4" />
                          {isProcessing ? "Connecting..." : "Connect GemWallet"}
                        </Button>
                      )}
                      {gemConnected && gemAddress && (
                        <div className="space-y-2">
                          <div className="text-xs text-green-600">
                            ✅ Connected: {gemAddress}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Balance: {gemBalance || "0"} XRP
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {step.id === "payment" && step.status === "active" && (
                    <div className="mt-3">
                      <Button 
                        onClick={handleSendPayment}
                        disabled={isProcessing || !gemConnected}
                        size="sm"
                      >
                        <ArrowRight className="mr-2 h-4 w-4" />
                        {isProcessing ? "Sending..." : `Send ${bookingDetails.totalAmount} XRP`}
                      </Button>
                    </div>
                  )}

                  {step.id === "verification" && step.status === "completed" && paymentTxHash && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Transaction ID:</span>
                        <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                          {paymentTxHash.slice(0, 8)}...{paymentTxHash.slice(-8)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(paymentTxHash)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://testnet.xrpl.org/transactions/${paymentTxHash}`, '_blank')}
                      >
                        <ExternalLink className="mr-2 h-3 w-3" />
                        View on XRPL Testnet
                      </Button>
                    </div>
                  )}

                  {step.id === "attestation" && step.status === "completed" && attestationId && (
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Attestation ID:</span>
                        <code className="bg-muted px-2 py-1 rounded text-xs font-mono">
                          {attestationId}
                        </code>
                      </div>
                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Payment successfully verified and recorded on both XRPL and Flare networks!
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Wallet Status */}
          {gemConnected && gemAddress && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">GemWallet Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Address:</span>
                  <code className="text-xs">{gemAddress}</code>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Balance:</span>
                  <span>{gemBalance || "0"} XRP</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Network:</span>
                  <Badge variant="outline" className="text-xs">XRPL Testnet</Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            
            {progress === 100 && (
              <Button onClick={() => onOpenChange(false)}>
                Complete Booking
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
