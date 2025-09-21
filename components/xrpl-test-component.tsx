"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useXRPL } from "@/hooks/use-xrpl"
import { useFTSO } from "@/hooks/use-ftso"
import { 
  CheckCircle, 
  AlertCircle, 
  RefreshCw, 
  Wallet,
  TrendingUp,
  Network,
  Zap
} from "lucide-react"

export function XRPLTestComponent() {
  const xrpl = useXRPL()
  const ftso = useFTSO()
  const [testResults, setTestResults] = useState<any[]>([])
  const [isRunningTests, setIsRunningTests] = useState(false)

  // Monitor connection status
  useEffect(() => {
    const results = [
      {
        name: "XRPL Testnet Connection",
        status: xrpl.isConnected ? "success" : xrpl.isConnecting ? "loading" : "error",
        details: xrpl.isConnected 
          ? "Connected to wss://s.altnet.rippletest.net:51233"
          : xrpl.error || "Not connected"
      },
      {
        name: "FTSO Price Feed Connection", 
        status: ftso.isConnected ? "success" : ftso.isLoading ? "loading" : "error",
        details: ftso.isConnected
          ? `${ftso.getAllPrices().length} price feeds available`
          : ftso.error || "Not connected"
      },
      {
        name: "XRPL Wallet Status",
        status: xrpl.wallet ? "success" : "pending",
        details: xrpl.wallet 
          ? `Address: ${xrpl.address?.slice(0, 12)}...`
          : "No wallet created"
      },
      {
        name: "Real-time Price Data",
        status: ftso.isDataFresh() ? "success" : "warning",
        details: `Last update: ${new Date(ftso.lastUpdate).toLocaleTimeString()}`
      }
    ]
    
    setTestResults(results)
  }, [xrpl.isConnected, xrpl.wallet, xrpl.error, ftso.isConnected, ftso.lastUpdate])

  const runXRPLTests = async () => {
    setIsRunningTests(true)
    
    try {
      // Test 1: Connect if not connected
      if (!xrpl.isConnected) {
        console.log("Connecting to XRPL...")
        await xrpl.connect()
      }

      // Test 2: Create wallet if none exists
      if (!xrpl.wallet) {
        console.log("Creating XRPL wallet...")
        await xrpl.createWallet()
      }

      // Test 3: Get account info
      if (xrpl.wallet) {
        console.log("Getting account info...")
        await xrpl.getAccountInfo()
      }

      // Test 4: Refresh price feeds
      console.log("Refreshing price feeds...")
      await ftso.fetchAllFeeds()

      console.log("All tests completed successfully!")
    } catch (error) {
      console.error("Test failed:", error)
    } finally {
      setIsRunningTests(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "loading":
        return <RefreshCw className="h-4 w-4 text-blue-500 animate-spin" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-300" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "border-green-500 bg-green-50"
      case "loading": return "border-blue-500 bg-blue-50"
      case "warning": return "border-yellow-500 bg-yellow-50"
      case "error": return "border-red-500 bg-red-50"
      default: return "border-gray-300 bg-gray-50"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="h-5 w-5" />
            XRPL Ledger Integration Test
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Test Results */}
          <div className="grid gap-3">
            {testResults.map((result, index) => (
              <div
                key={index}
                className={`p-3 border rounded-lg ${getStatusColor(result.status)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(result.status)}
                    <span className="font-medium">{result.name}</span>
                  </div>
                  <Badge variant={result.status === "success" ? "default" : "secondary"}>
                    {result.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{result.details}</p>
              </div>
            ))}
          </div>

          {/* XRPL Wallet Info */}
          {xrpl.wallet && (
            <Alert>
              <Wallet className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <div><strong>Address:</strong> {xrpl.address}</div>
                  <div><strong>Balance:</strong> {xrpl.balance} XRP</div>
                  <div className="text-xs text-muted-foreground">
                    ⚠️ This is a testnet wallet. Seed was logged to console.
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Price Feed Info */}
          {ftso.isConnected && (
            <Alert>
              <TrendingUp className="h-4 w-4" />
              <AlertDescription>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <strong>XRP/USD:</strong> ${ftso.getXRPPrice().toFixed(4)}
                  </div>
                  <div>
                    <strong>FLR/USD:</strong> ${ftso.getFLRPrice().toFixed(6)}
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Test Button */}
          <Button
            onClick={runXRPLTests}
            disabled={isRunningTests}
            className="w-full"
            size="lg"
          >
            {isRunningTests ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Running Tests...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Run XRPL Integration Tests
              </>
            )}
          </Button>

          {/* Network Info */}
          <div className="text-xs text-muted-foreground text-center space-y-1">
            <div>XRPL Testnet: wss://s.altnet.rippletest.net:51233</div>
            <div>Explorer: https://testnet.xrpl.org</div>
            <div>Flare Coston2: Chain ID 114</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
