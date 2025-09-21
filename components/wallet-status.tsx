"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useWallet } from "@/hooks/use-wallet";
import { Wallet, ChevronDown, Copy, ExternalLink, Power, History, Clock } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { WalletConnectModal } from "./wallet-connect-modal";

export function WalletStatus() {
  const [isMounted, setIsMounted] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <Button disabled className="bg-primary/50 text-primary-foreground/50">
        <Wallet className="mr-2 h-4 w-4" />
        Loading...
      </Button>
    );
  }

  return (
    <WalletStatusContent
      showConnectModal={showConnectModal}
      setShowConnectModal={setShowConnectModal}
    />
  );
}

function WalletStatusContent({
  showConnectModal,
  setShowConnectModal,
}: {
  showConnectModal: boolean;
  setShowConnectModal: (show: boolean) => void;
}) {
  const {
    metamaskAddress,
    metamaskBalance,
    metamaskConnected,
    gemAddress,
    gemBalance,
    gemConnected,
    activeWallet,
    switchWallet,
    disconnectWallet,
    getWalletHistory,
    refreshBalances,
  } = useWallet();

  const [walletHistory, setWalletHistory] = useState<Array<{walletType: any; timestamp: number; url: string}>>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load wallet history and listen for wallet switches
  useEffect(() => {
    const loadHistory = () => {
      const history = getWalletHistory();
      setWalletHistory(history);
    };

    // Load initial history
    loadHistory();

    // Listen for wallet switch events
    const handleWalletSwitch = (event: CustomEvent) => {
      console.log("📊 Wallet switched detected:", event.detail);
      loadHistory(); // Reload history when wallet switches
    };

    window.addEventListener('walletSwitched', handleWalletSwitch as EventListener);

    return () => {
      window.removeEventListener('walletSwitched', handleWalletSwitch as EventListener);
    };
  }, [getWalletHistory]);

  const isConnected = metamaskConnected || gemConnected;
  const currentAddress =
    activeWallet === "metamask" ? metamaskAddress : gemAddress;
  const currentBalance =
    activeWallet === "metamask" ? metamaskBalance : gemBalance;
  const currentCurrency =
    activeWallet === "metamask" ? "C2FLR" : "XRP";

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (!isConnected) {
    return (
      <>
        <Button
          onClick={() => setShowConnectModal(true)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Wallet className="mr-2 h-4 w-4" />
          Connect Wallets
        </Button>
        <WalletConnectModal
          open={showConnectModal}
          onOpenChange={setShowConnectModal}
        />
      </>
    );
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-card border-border hover:bg-secondary"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <div className="flex flex-col items-start">
                <span className="font-mono text-sm">
                  {currentAddress && formatAddress(currentAddress)}
                </span>
                {currentBalance && (
                  <span className="text-xs text-muted-foreground">
                    {currentBalance} {currentCurrency}
                  </span>
                )}
              </div>
              <ChevronDown className="h-4 w-4" />
            </div>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-80 bg-card border-border">
          <div className="p-4 space-y-4">
            {/* Active Wallet Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Active Wallet</span>
                <Badge variant="outline" className="text-xs">
                  {activeWallet === "metamask" ? "Flare" : "XRPL"}
                </Badge>
              </div>
              <Card className="p-3 bg-secondary/50">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      {currentAddress}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                      onClick={() =>
                        currentAddress && copyToClipboard(currentAddress)
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  {currentBalance && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-green-600">
                        {currentBalance} {currentCurrency}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-6 text-xs"
                        onClick={() => refreshBalances()}
                      >
                        Refresh
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Connected Wallets */}
            <div className="space-y-2">
              <span className="text-sm font-medium">Connected Wallets</span>

              {metamaskConnected && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                    activeWallet === "metamask"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-secondary/50"
                  }`}
                  onClick={() => switchWallet("metamask")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">M</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm">MetaMask</span>
                        {metamaskBalance && (
                          <span className="text-xs text-muted-foreground">
                            {metamaskBalance} C2FLR
                          </span>
                        )}
                      </div>
                    </div>
                    {activeWallet === "metamask" && (
                      <Badge variant="default" className="text-xs">Active</Badge>
                    )}
                  </div>
                </motion.div>
              )}

              {gemConnected && (
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                    activeWallet === "gem"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:bg-secondary/50"
                  }`}
                  onClick={() => switchWallet("gem")}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                        <span className="text-white text-xs font-bold">G</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm">Gem Wallet</span>
                        {gemBalance && (
                          <span className="text-xs text-muted-foreground">
                            {gemBalance} XRP
                          </span>
                        )}
                      </div>
                    </div>
                    {activeWallet === "gem" && (
                      <Badge variant="default" className="text-xs">Active</Badge>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Wallet Activity History */}
            {walletHistory.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Recent Activity</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                    onClick={() => setShowHistory(!showHistory)}
                  >
                    <History className="h-3 w-3" />
                  </Button>
                </div>

                {showHistory && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-1 max-h-32 overflow-y-auto"
                  >
                    {walletHistory.slice(0, 3).map((entry, index) => (
                      <div
                        key={index}
                        className="text-xs p-2 bg-secondary/30 rounded border"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {entry.walletType === "metamask" ? "MetaMask" : "GemWallet"}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {entry.walletType === "metamask" ? "Flare" : "XRPL"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground mt-1">
                          <Clock className="h-3 w-3" />
                          <span>{new Date(entry.timestamp).toLocaleTimeString()}</span>
                          <span>•</span>
                          <span>{entry.url}</span>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>
            )}
          </div>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setShowConnectModal(true)}
            className="cursor-pointer"
          >
            <Wallet className="mr-2 h-4 w-4" />
            Manage Wallets
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <a
              href={
                activeWallet === "metamask"
                  ? "https://flare-explorer.flare.network/"
                  : "https://xrpscan.com/"
              }
              target="_blank"
              rel="noopener noreferrer"
              className="cursor-pointer"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View on Explorer
            </a>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {metamaskConnected && (
            <DropdownMenuItem
              onClick={() => disconnectWallet("metamask")}
              className="cursor-pointer text-destructive"
            >
              <Power className="mr-2 h-4 w-4" />
              Disconnect MetaMask
            </DropdownMenuItem>
          )}

          {gemConnected && (
            <DropdownMenuItem
              onClick={() => disconnectWallet("gem")}
              className="cursor-pointer text-destructive"
            >
              <Power className="mr-2 h-4 w-4" />
              Disconnect Gem Wallet
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      <WalletConnectModal
        open={showConnectModal}
        onOpenChange={setShowConnectModal}
      />
    </>
  );
}
