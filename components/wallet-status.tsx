"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useWallet } from "@/hooks/use-wallet";
import { Wallet, ChevronDown, Copy, ExternalLink, Power } from "lucide-react";
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
    metamaskConnected,
    gemAddress,
    gemConnected,
    activeWallet,
    switchWallet,
    disconnectWallet,
  } = useWallet();

  const isConnected = metamaskConnected || gemConnected;
  const currentAddress =
    activeWallet === "metamask" ? metamaskAddress : gemAddress;

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
              <span className="font-mono text-sm">
                {currentAddress && formatAddress(currentAddress)}
              </span>
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
                      <span className="text-sm">MetaMask</span>
                    </div>
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
                      <span className="text-sm">Gem Wallet</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
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
