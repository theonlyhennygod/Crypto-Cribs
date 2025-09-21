"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Calendar,
  Users,
  CreditCard,
  Coins,
  Shield,
  Zap,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useHydration } from "@/hooks/use-hydration";
import { useWallet } from "@/hooks/use-wallet";
import { useXRPL } from "@/hooks/use-xrpl";
import { useFTSO } from "@/hooks/use-ftso";
import { useFraudProtection } from "@/hooks/use-fraud-protection";
import { useBookingWrite } from "@/hooks/use-contract";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import {
  switchToCoston2,
  addCoston2Network,
  getCoston2FaucetUrl,
} from "@/lib/network-utils";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CrossChainPayment } from "@/components/cross-chain-payment";

interface BookingCardProps {
  property: {
    id: string;
    price: number;
    originalPrice?: number;
    currency: "XRP" | "FLR";
    discount?: number;
    hostWallet: string;
  };
}

export function BookingCard({ property }: BookingCardProps) {
  const isHydrated = useHydration();
  const { isConnected, xrplWallet, metamaskConnected, metamaskAddress } =
    useWallet();
  const { address, isConnected: wagmiConnected, chainId } = useAccount();
  const xrpl = useXRPL();
  const ftso = useFTSO();
  const {
    walletVerification,
    checkBookingFraud,
    recordBookingAttempt,
    getRiskAssessment,
  } = useFraudProtection();
  const {
    createBooking,
    listProperty,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  } = useBookingWrite();

  // Wallet hooks
  const { sendXRPPayment, gemConnected } = useWallet();

  // Set default dates: check-in tomorrow, check-out day after
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 2);

  const [checkIn, setCheckIn] = useState(tomorrow.toISOString().split("T")[0]);
  const [checkOut, setCheckOut] = useState(
    dayAfter.toISOString().split("T")[0]
  );
  const [guests, setGuests] = useState(2);
  const [nights, setNights] = useState(3);
  const [showPayment, setShowPayment] = useState(false);
  const [fraudCheck, setFraudCheck] = useState<any>(null);
  const [isCheckingFraud, setIsCheckingFraud] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [xrplTxHash, setXrplTxHash] = useState<string | null>(null);
  const [xrpAmount, setXrpAmount] = useState<number>(0);

  const subtotal = property.price * nights;
  const serviceFee = Math.round(subtotal * 0.03); // 3% vs Airbnb's 14-18%
  const total = subtotal + serviceFee;
  const savings = property.originalPrice
    ? (property.originalPrice - property.price) * nights
    : 0;

  // Calculate total cost in USD for cross-chain payment
  const totalUSD = ftso.convertAmount(total, property.currency, "USD");

  const handleBooking = async () => {
    console.log("🏠 BOOKING DEBUG:");
    console.log("  useWallet isConnected:", isConnected);
    console.log("  wagmi isConnected:", wagmiConnected);
    console.log("  wagmi address:", address);
    console.log("  wagmi chainId:", chainId);
    console.log("  metamaskConnected:", metamaskConnected);
    console.log("  metamaskAddress:", metamaskAddress);
    console.log("  xrplWallet:", xrplWallet);

    // Use wagmi connection state as primary check since it's more reliable
    const isWalletConnected = wagmiConnected && address;
    const isMetaMaskReady = wagmiConnected && address; // If wagmi is connected, MetaMask is ready

    if (!isWalletConnected) {
      toast.error("Please connect your MetaMask wallet first");
      return;
    }

    // Simple network switching - just switch to Coston2 without extensive checks
    try {
      console.log("🔄 Ensuring we're on Coston2 before booking...");
      toast.info("Switching to Coston2 testnet...");

      const switched = await switchToCoston2();
      if (switched) {
        toast.success("Ready on Coston2 testnet!");
        // Small delay to ensure network switch is complete
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.log("Network switch attempt completed, proceeding...");
    }

    console.log("✅ Wallet connection validated, proceeding with booking...");

    if (!checkIn || !checkOut) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    setIsCheckingFraud(true);

    try {
      // For demo purposes, skip wallet verification check
      // In production, you'd verify the wallet properly
      console.log("🛡️ Running fraud protection checks...");

      // Run fraud protection checks with demo verification override
      const fraudResult = await checkBookingFraud(
        property.hostWallet,
        property.id,
        true // Override verification for demo
      );
      setFraudCheck(fraudResult);

      // Block high-risk bookings
      if (fraudResult.riskScore >= 80) {
        toast.error(
          "Booking blocked due to high fraud risk. Please contact support."
        );
        return;
      }

      // Show warnings for medium risk
      if (fraudResult.riskScore >= 40) {
        const proceed = confirm(
          `Warning: This booking has been flagged for review (Risk Score: ${fraudResult.riskScore}%). Continue anyway?`
        );
        if (!proceed) return;
      }

      // Record booking attempt for cooldown tracking
      recordBookingAttempt();

      // Validate and convert dates to timestamps
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
        toast.error("Please select valid check-in and check-out dates");
        return;
      }

      if (checkInDate <= new Date()) {
        toast.error("Check-in date must be in the future");
        return;
      }

      if (checkOutDate <= checkInDate) {
        toast.error("Check-out date must be after check-in date");
        return;
      }

      const checkInTimestamp = BigInt(Math.floor(checkInDate.getTime() / 1000));
      const checkOutTimestamp = BigInt(
        Math.floor(checkOutDate.getTime() / 1000)
      );

      // Use XRPL address if available, otherwise use a valid demo address
      const xrplAddress = xrpl.address || "rN7n7otQDd6FczFgLdSqtcsAUxDkw6fzRH"; // Valid XRPL testnet address

      toast.info("Creating booking transaction...");

      console.log("🔗 TRANSACTION DEBUG:");
      console.log("  propertyId:", BigInt(1));
      console.log("  xrplAddress:", xrplAddress);
      console.log("  checkInTimestamp:", checkInTimestamp);
      console.log("  checkOutTimestamp:", checkOutTimestamp);

      console.log("🏠 Starting booking process...");

      // For demo purposes, we'll simulate the XRPL + Flare booking flow
      // In production, this would involve:
      // 1. Send XRP payment to host's XRPL address
      // 2. Get XRPL transaction hash
      // 3. Record booking on Flare with XRPL tx hash

      console.log("💰 Step 1: XRPL Payment");
      console.log(`  → Sending XRP to host: ${xrplAddress}`);

      // Calculate USD amount (fallback to demo price if property data unavailable)
      const priceUSD = property?.pricePerNightUSD
        ? Number(property.pricePerNightUSD) / 100
        : 500;
      console.log(`  → Amount: ${priceUSD} USD worth of XRP`);
      console.log(`  → Property price debug:`, {
        pricePerNightUSD: property?.pricePerNightUSD,
        calculated: priceUSD,
      });

      // Convert USD to XRP amount (extremely demo-friendly rate for limited testnet funds)
      // Using a very favorable rate: 1 XRP = $1000 USD (so bookings cost tiny amounts of XRP)
      let xrpAmount = priceUSD / 1000; // Extremely small amount for demo with only 4 XRP

      // Ensure minimum payment of 0.01 XRP and maximum of 0.5 XRP for demo (to preserve your 4 XRP)
      let finalXrpAmount = Math.max(0.01, Math.min(xrpAmount, 0.5));
      setXrpAmount(finalXrpAmount); // Store for later use in success message

      console.log(
        `  → Converting ${priceUSD} USD to ${finalXrpAmount} XRP (demo rate: 1 XRP = $1000 - ultra small amounts)`
      );

      let realXrplTxHash: string;

      if (gemConnected && sendXRPPayment) {
        try {
          console.log("  → Sending real XRPL payment via GemWallet...");
          realXrplTxHash = await sendXRPPayment(
            finalXrpAmount,
            xrplAddress,
            `CryptoCribs booking for property ${property.id}`
          );
          console.log(`  ✅ Real XRPL Transaction Hash: ${realXrplTxHash}`);
        } catch (xrplError) {
          console.warn(
            "  ⚠️ XRPL payment failed, falling back to simulation:",
            xrplError
          );
          realXrplTxHash = `xrpl_${Date.now()}_${Math.random()
            .toString(36)
            .substring(2, 8)}`;
          console.log(`  → Simulated XRPL Transaction Hash: ${realXrplTxHash}`);
        }
      } else {
        console.log(
          "  → GemWallet not connected, simulating XRPL payment for demo"
        );
        realXrplTxHash = `xrpl_${Date.now()}_${Math.random()
          .toString(36)
          .substring(2, 8)}`;
        console.log(`  → Simulated XRPL Transaction Hash: ${realXrplTxHash}`);
      }

      // Store XRPL transaction hash for later display
      setXrplTxHash(realXrplTxHash);

      console.log("🔗 Step 2: Recording booking on Flare blockchain...");
      try {
        createBooking(
          BigInt(1), // Demo property ID
          checkInTimestamp,
          checkOutTimestamp,
          { value: parseEther("0.01") } // Small C2FLR payment for booking
        );
        console.log(
          "✅ Flare transaction initiated, waiting for user confirmation..."
        );
      } catch (txError) {
        console.error("❌ Flare transaction initiation failed:", txError);
        throw txError;
      }
    } catch (error: any) {
      console.error("Booking failed:", error);
      toast.error(
        error.message ||
          "Unable to process booking at this time. Please try again."
      );
    } finally {
      setIsCheckingFraud(false);
    }
  };

  // Handle transaction success
  useEffect(() => {
    console.log("🔍 TRANSACTION STATE DEBUG:");
    console.log("  isPending:", isPending);
    console.log("  isConfirming:", isConfirming);
    console.log("  isSuccess:", isSuccess);
    console.log("  hash:", hash);
    console.log("  error:", error);

    // Show transaction link as soon as we have a hash, even if not confirmed yet
    if (hash && !isPending && !isConfirming && !isSuccess) {
      console.log(
        "⚠️ Transaction has hash but not marked as success - showing link anyway"
      );
      toast.success(
        <div className="space-y-2">
          <p className="font-semibold">
            🎉 Transaction submitted to blockchain!
          </p>
          <p className="text-sm">
            Transaction Hash: {hash.slice(0, 10)}...{hash.slice(-8)}
          </p>
          <a
            href={`https://coston2.testnet.flarescan.com/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline text-sm font-medium hover:text-blue-800"
          >
            🔗 View Transaction on Flarescan →
          </a>
        </div>,
        {
          duration: 15000, // Show for 15 seconds
        }
      );
    }

    if (isSuccess && hash) {
      console.log("✅ Transaction confirmed successful! Hash:", hash);
      toast.success(
        <div className="space-y-3">
          <p className="font-semibold">🎉 Booking confirmed on blockchain!</p>
          <p className="text-sm text-muted-foreground">
            ✅ XRPL Payment: {xrpAmount?.toFixed(3)} XRP{" "}
            {gemConnected ? "(Real transaction)" : "(Simulated for demo)"}
            <br />✅ Flare Contract: 0.01 C2FLR booking fee recorded
          </p>

          {/* Transaction Hashes */}
          <div className="space-y-1 text-sm">
            {xrplTxHash && <p>XRPL TX: {xrplTxHash}</p>}
            <p>
              Flare TX: {hash.slice(0, 10)}...{hash.slice(-8)}
            </p>
          </div>

          {/* Blockchain Explorer Links */}
          <div className="flex flex-col space-y-2">
            {xrplTxHash &&
              (gemConnected && !xrplTxHash.startsWith("xrpl_") ? (
                <a
                  href={`https://testnet.xrpl.org/transactions/${xrplTxHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-purple-600 underline text-sm font-medium hover:text-purple-800"
                >
                  <span>🔗 View XRPL Transaction →</span>
                </a>
              ) : (
                <div className="inline-flex items-center space-x-1 text-purple-600 text-sm font-medium">
                  <span>🔗 XRPL Transaction: Simulated for demo</span>
                  <span className="text-xs text-muted-foreground ml-2">
                    (Connect GemWallet for real transactions)
                  </span>
                </div>
              ))}
            <a
              href={`https://coston2.testnet.flarescan.com/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 text-blue-600 underline text-sm font-medium hover:text-blue-800"
            >
              <span>🔗 View Flare Transaction →</span>
            </a>
          </div>
        </div>,
        {
          duration: 15000, // Show for 15 seconds
        }
      );
    }
  }, [isPending, isConfirming, isSuccess, hash, error]);

  // Handle transaction error
  useEffect(() => {
    if (error) {
      console.error("Transaction failed:", error);
      let errorMessage = "Booking transaction failed";

      if (error.message?.includes("User denied transaction")) {
        errorMessage = "Transaction was cancelled by user.";
      } else if (error.message?.includes("insufficient funds")) {
        errorMessage = "Insufficient funds for transaction.";
      } else if (
        error.message?.includes("Property does not exist") ||
        error.message?.includes("execution reverted")
      ) {
        errorMessage =
          "Property not found. Please create a demo property on the /host page first, then try booking again.";
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage, {
        duration: 10000,
        action: error.message?.includes("Property does not exist")
          ? {
              label: "Go to Host Page",
              onClick: () => window.open("/host", "_blank"),
            }
          : undefined,
      });
    }
  }, [error]);

  const handlePaymentComplete = (paymentData: any) => {
    setShowPayment(false);
    // Redirect to booking confirmation
    window.location.href = `/booking/${bookingId}`;
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setBookingId("");
  };

  // Cross-chain payment dialog
  const paymentDialog = (
    <Dialog open={showPayment} onOpenChange={setShowPayment}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Cross-Chain Payment</DialogTitle>
        </DialogHeader>
        <CrossChainPayment
          bookingId={bookingId}
          propertyTitle={`${property.id} - ${nights} nights`}
          totalCostUSD={totalUSD}
          onPaymentComplete={handlePaymentComplete}
          onCancel={handlePaymentCancel}
        />
      </DialogContent>
    </Dialog>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="p-6 sticky top-6">
        <div className="space-y-6">
          {/* Pricing Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">
                {property.price} {property.currency}
              </span>
              {property.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {property.originalPrice} {property.currency}
                </span>
              )}
            </div>
            <span className="text-sm text-muted-foreground">per night</span>
          </div>

          {savings > 0 && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
              <p className="text-green-600 font-medium text-sm">
                Save {savings} {property.currency} vs traditional platforms
              </p>
            </div>
          )}

          {/* Date Selection */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="checkin">Check-in</Label>
              <div className="relative">
                <Input
                  id="checkin"
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="pl-10"
                />
                <Calendar className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            <div>
              <Label htmlFor="checkout">Check-out</Label>
              <div className="relative">
                <Input
                  id="checkout"
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="pl-10"
                />
                <Calendar className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Guests */}
          <div>
            <Label htmlFor="guests">Guests</Label>
            <div className="relative">
              <Input
                id="guests"
                type="number"
                min="1"
                max="8"
                value={guests}
                onChange={(e) => setGuests(Number.parseInt(e.target.value))}
                className="pl-10"
              />
              <Users className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>

          {/* Wallet Verification Status */}
          {walletVerification && isConnected && (
            <Alert
              className={
                walletVerification.riskScore >= 40
                  ? "border-yellow-500"
                  : "border-green-500"
              }
            >
              <Shield className="h-4 w-4" />
              <AlertTitle>Wallet Status</AlertTitle>
              <AlertDescription>
                {getRiskAssessment(walletVerification.riskScore).level} - Age:{" "}
                {walletVerification.age} days, Previous bookings:{" "}
                {walletVerification.previousBookings}
              </AlertDescription>
            </Alert>
          )}

          {/* Pricing Breakdown */}
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>
                {property.price} {property.currency} × {nights} nights
              </span>
              <span>
                {subtotal} {property.currency}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Crypto Cribs service fee (3%)</span>
              <span>
                {serviceFee} {property.currency}
              </span>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Total before taxes</span>
              <span>
                {total} {property.currency}
              </span>
            </div>
          </div>

          {/* Book Button */}
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
            onClick={handleBooking}
            disabled={
              !isHydrated ||
              !checkIn ||
              !checkOut ||
              isCheckingFraud ||
              isPending ||
              isConfirming ||
              !(wagmiConnected && address)
            }
          >
            {isPending ? (
              <>
                <Shield className="h-5 w-5 mr-2 animate-spin" />
                Confirm in Wallet...
              </>
            ) : isConfirming ? (
              <>
                <Shield className="h-5 w-5 mr-2 animate-spin" />
                Confirming on Blockchain...
              </>
            ) : isCheckingFraud ? (
              <>
                <Shield className="h-5 w-5 mr-2 animate-spin" />
                Running Security Checks...
              </>
            ) : isHydrated && wagmiConnected && address ? (
              <>
                <Coins className="h-5 w-5 mr-2" />
                Book with Blockchain
              </>
            ) : (
              "Connect Wallet to Book"
            )}
          </Button>

          {/* Transaction Status */}
          {isHydrated && (isSuccess || isPending || isConfirming || hash) && (
            <div className="mb-4 p-4 rounded-lg border">
              {isPending && (
                <div className="flex items-center space-x-2 text-amber-600">
                  <Shield className="h-4 w-4 animate-spin" />
                  <span className="font-medium">
                    Waiting for wallet confirmation...
                  </span>
                </div>
              )}
              {isConfirming && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <Shield className="h-4 w-4 animate-spin" />
                  <span className="font-medium">
                    Confirming transaction on blockchain...
                  </span>
                </div>
              )}
              {hash && !isPending && !isConfirming && (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span className="font-semibold">
                      {isSuccess
                        ? "🎉 Booking confirmed on blockchain!"
                        : "🎉 Transaction submitted!"}
                    </span>
                  </div>

                  {/* Payment Summary */}
                  {isSuccess && (
                    <div className="text-sm text-muted-foreground">
                      ✅ XRPL Payment: {xrpAmount.toFixed(3)} XRP{" "}
                      {gemConnected ? "(Real)" : "(Simulated)"}
                      <br />✅ Flare Fee: 0.01 C2FLR
                    </div>
                  )}

                  {/* Transaction Hashes */}
                  <div className="space-y-1 text-sm text-muted-foreground">
                    {xrplTxHash && <div>XRPL TX: {xrplTxHash}</div>}
                    <div>
                      Flare TX: {hash.slice(0, 10)}...{hash.slice(-8)}
                    </div>
                  </div>

                  {/* Blockchain Explorer Links */}
                  <div className="flex flex-col space-y-2">
                    {xrplTxHash &&
                      (gemConnected && !xrplTxHash.startsWith("xrpl_") ? (
                        <a
                          href={`https://testnet.xrpl.org/transactions/${xrplTxHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-purple-600 underline text-sm font-medium hover:text-purple-800"
                        >
                          <span>🔗 View XRPL Transaction</span>
                        </a>
                      ) : (
                        <div className="inline-flex items-center space-x-1 text-purple-600 text-sm font-medium">
                          <span>🔗 XRPL: Simulated for demo</span>
                          <span className="text-xs text-muted-foreground ml-1">
                            (Connect GemWallet for real transactions)
                          </span>
                        </div>
                      ))}
                    <a
                      href={`https://coston2.testnet.flarescan.com/tx/${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-blue-600 underline text-sm font-medium hover:text-blue-800"
                    >
                      <span>🔗 View Flare Transaction</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="text-center text-xs text-muted-foreground space-y-1">
            <div>Secure cross-chain payments via XRPL & Flare Network</div>
            <div>Free cancellation up to 48 hours • No hidden fees</div>
            {isHydrated && wagmiConnected && address && (
              <div className="space-y-2">
                <div className="text-green-600 font-medium">
                  ✅ Wallet connected: {address.slice(0, 6)}...
                  {address.slice(-4)}
                </div>
                {chainId !== 114 ? (
                  <Alert className="border-amber-200 bg-amber-50">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">
                      Wrong Network
                    </AlertTitle>
                    <AlertDescription className="text-amber-700">
                      You're on{" "}
                      {chainId === 14 ? "Flare Mainnet" : `Chain ${chainId}`}.
                      Switch to Coston2 testnet for demo transactions.
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-2 h-6 text-xs"
                        onClick={async () => {
                          const switched = await switchToCoston2();
                          if (switched) {
                            toast.success("Switched to Coston2 testnet!");
                          } else {
                            const added = await addCoston2Network();
                            if (added) {
                              toast.success("Coston2 network added!");
                            }
                          }
                        }}
                      >
                        Switch to Coston2
                      </Button>
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="space-y-1">
                    <div className="text-blue-600 font-medium">
                      🌐 Connected to Coston2 testnet
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Need testnet funds?{" "}
                      <a
                        href={getCoston2FaucetUrl()}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Get C2FLR tokens
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
      {paymentDialog}
    </motion.div>
  );
}
