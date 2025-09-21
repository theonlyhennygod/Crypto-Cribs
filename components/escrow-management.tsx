"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Lock,
  Unlock,
  DollarSign,
  Clock,
  CheckCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  ExternalLink,
} from "lucide-react"
import { useWallet } from "@/hooks/use-wallet"

interface EscrowTransaction {
  id: string
  type: "deposit" | "withdrawal" | "release"
  amount: string
  currency: string
  status: "pending" | "completed" | "failed"
  date: string
  description: string
  txHash?: string
}

interface EscrowBalance {
  total: string
  available: string
  locked: string
  pending: string
}

export function EscrowManagement() {
  const { isConnected, address } = useWallet()
  const [activeTab, setActiveTab] = useState("overview")
  const [depositAmount, setDepositAmount] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const escrowBalance: EscrowBalance = {
    total: "12,450.00",
    available: "9,250.00",
    locked: "2,800.00",
    pending: "400.00",
  }

  const transactions: EscrowTransaction[] = [
    {
      id: "1",
      type: "deposit",
      amount: "500.00",
      currency: "USDC",
      status: "completed",
      date: "2024-12-15",
      description: "Listing fee deposit - Luxury Villa",
      txHash: "0x1234567890abcdef",
    },
    {
      id: "2",
      type: "release",
      amount: "200.00",
      currency: "USDC",
      status: "pending",
      date: "2024-12-14",
      description: "Security deposit release - Downtown Penthouse",
    },
    {
      id: "3",
      type: "deposit",
      amount: "300.00",
      currency: "USDC",
      status: "completed",
      date: "2024-12-12",
      description: "Listing fee deposit - Mountain Cabin",
      txHash: "0xabcdef1234567890",
    },
  ]

  const handleDeposit = async (amount: string) => {
    if (!isConnected) {
      alert("Please connect your wallet first")
      return
    }

    setIsProcessing(true)
    // Simulate deposit process
    setTimeout(() => {
      setIsProcessing(false)
      alert(`Successfully deposited ${amount} USDC to escrow`)
    }, 3000)
  }

  const handleWithdraw = async (amount: string) => {
    if (!isConnected) {
      alert("Please connect your wallet first")
      return
    }

    setIsProcessing(true)
    // Simulate withdrawal process
    setTimeout(() => {
      setIsProcessing(false)
      alert(`Successfully withdrew ${amount} USDC from escrow`)
    }, 3000)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-600"
      case "pending":
        return "bg-yellow-600"
      case "failed":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownLeft className="h-4 w-4 text-green-400" />
      case "withdrawal":
        return <ArrowUpRight className="h-4 w-4 text-blue-400" />
      case "release":
        return <Unlock className="h-4 w-4 text-purple-400" />
      default:
        return <DollarSign className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Escrow Management</h2>
          <p className="text-muted-foreground">Manage your listing fees and security deposits</p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Lock className="h-3 w-3" />
          Secured by Smart Contract
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="manage">Manage Funds</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Balance</p>
                    <p className="text-2xl font-bold text-foreground">${escrowBalance.total}</p>
                  </div>
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Available</p>
                    <p className="text-2xl font-bold text-green-400">${escrowBalance.available}</p>
                  </div>
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Locked</p>
                    <p className="text-2xl font-bold text-yellow-400">${escrowBalance.locked}</p>
                  </div>
                  <div className="p-2 bg-yellow-500/10 rounded-lg">
                    <Lock className="h-5 w-5 text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold text-blue-400">${escrowBalance.pending}</p>
                  </div>
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Escrow Distribution</CardTitle>
              <CardDescription>Breakdown of your escrowed funds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Available for withdrawal</span>
                  <span className="font-semibold text-green-400">${escrowBalance.available}</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Locked in active listings</span>
                  <span className="font-semibold text-yellow-400">${escrowBalance.locked}</span>
                </div>
                <Progress value={23} className="h-2" />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Pending transactions</span>
                  <span className="font-semibold text-blue-400">${escrowBalance.pending}</span>
                </div>
                <Progress value={3} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>All your escrow transactions and their status</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-secondary rounded-lg">{getTransactionIcon(transaction.type)}</div>
                      <div>
                        <p className="font-semibold text-foreground capitalize">
                          {transaction.type} - {transaction.amount} {transaction.currency}
                        </p>
                        <p className="text-sm text-muted-foreground">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right space-y-2">
                      <Badge className={getStatusColor(transaction.status)}>{transaction.status}</Badge>
                      {transaction.txHash && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">
                            {transaction.txHash.slice(0, 8)}...{transaction.txHash.slice(-6)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(transaction.txHash!)}
                            className="h-6 w-6 p-0"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Funds Tab */}
        <TabsContent value="manage" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Deposit Card */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDownLeft className="h-5 w-5 text-green-400" />
                  Deposit Funds
                </CardTitle>
                <CardDescription>
                  Add funds to your escrow account for listing fees and security deposits
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Amount (USDC)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="number"
                      placeholder="500.00"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="p-3 bg-secondary rounded-lg">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Network Fee</span>
                    <span className="text-foreground">~$2.50</span>
                  </div>
                  <div className="flex justify-between text-sm mt-1">
                    <span className="text-muted-foreground">Total Cost</span>
                    <span className="font-semibold text-foreground">
                      ${depositAmount ? (Number.parseFloat(depositAmount) + 2.5).toFixed(2) : "0.00"}
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => handleDeposit(depositAmount)}
                  className="w-full gap-2"
                  disabled={!isConnected || !depositAmount || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowDownLeft className="h-4 w-4" />
                      Deposit to Escrow
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Withdraw Card */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUpRight className="h-5 w-5 text-blue-400" />
                  Withdraw Funds
                </CardTitle>
                <CardDescription>Withdraw available funds from your escrow account to your wallet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-secondary rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Available Balance</span>
                    <span className="font-semibold text-green-400">${escrowBalance.available} USDC</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Withdrawal Amount (USDC)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="number"
                      placeholder="1000.00"
                      max={escrowBalance.available}
                      className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    25%
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    50%
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    75%
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    Max
                  </Button>
                </div>

                <Button
                  onClick={() => handleWithdraw("1000")}
                  className="w-full gap-2"
                  disabled={!isConnected || isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowUpRight className="h-4 w-4" />
                      Withdraw from Escrow
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Smart Contract Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Smart Contract Information
              </CardTitle>
              <CardDescription>Your funds are secured by audited smart contracts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-secondary rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Contract Address</span>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard("0x742d35Cc6634C0532925a3b8D")}
                        className="h-6 w-6 p-0"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <span className="font-mono text-sm text-foreground">0x742d35Cc6634C0532925a3b8D</span>
                </div>

                <div className="p-4 bg-secondary rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Security Status</span>
                    <Badge className="bg-green-600">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Audited
                    </Badge>
                  </div>
                  <span className="text-sm text-foreground">Multi-signature protection enabled</span>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <Lock className="h-5 w-5 text-blue-400" />
                <div>
                  <p className="font-medium text-foreground">Funds are SAFU</p>
                  <p className="text-sm text-muted-foreground">
                    Your deposits are protected by smart contracts and can only be released according to predefined
                    conditions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Wallet Connection Warning */}
      {!isConnected && (
        <Card className="bg-yellow-500/10 border-yellow-500/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div>
                <p className="font-medium text-foreground">Wallet Connection Required</p>
                <p className="text-sm text-muted-foreground">Please connect your wallet to manage your escrow funds</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
