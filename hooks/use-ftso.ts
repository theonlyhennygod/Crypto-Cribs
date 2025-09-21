"use client";

import { useState, useEffect, useCallback } from "react";
import { usePublicClient } from "wagmi";

// FTSOv2 contract address on Coston2
const FTSO_V2_ADDRESS = "0xC4e9c78EA53db782E28f28Fdf80BaF59336B304d";

// Feed IDs for different currencies
const FEED_IDS = {
  XRP_USD: "0x015852500000000000000000000000000000000000", // XRP/USD
  FLR_USD: "0x01464c520000000000000000000000000000000000", // FLR/USD
  ETH_USD: "0x014554480000000000000000000000000000000000", // ETH/USD
  BTC_USD: "0x014254430000000000000000000000000000000000", // BTC/USD
} as const;

interface FeedData {
  id: string;
  symbol: string;
  value: number;
  decimals: number;
  timestamp: number;
  roundId: number;
}

interface PriceConversion {
  from: string;
  to: string;
  rate: number;
  timestamp: number;
}

interface FTSOState {
  isConnected: boolean;
  feeds: Map<string, FeedData>;
  lastUpdate: number;
  error: string | null;
  isLoading: boolean;
}

export function useFTSO() {
  const [state, setState] = useState<FTSOState>({
    isConnected: false,
    feeds: new Map(),
    lastUpdate: 0,
    error: null,
    isLoading: false,
  });

  const publicClient = usePublicClient();

  const clearError = () => {
    setState((prev) => ({ ...prev, error: null }));
  };

  // Initialize FTSO connection
  useEffect(() => {
    if (publicClient) {
      setState((prev) => ({ ...prev, isConnected: true }));
      // Temporarily disabled FTSO feeds to prevent errors during demo
      // fetchAllFeeds()
    }
  }, [publicClient]);

  const fetchFeedById = async (feedId: string): Promise<FeedData | null> => {
    try {
      if (!publicClient) {
        throw new Error("Not connected to Flare network");
      }

      const result = (await publicClient.readContract({
        address: FTSO_V2_ADDRESS as `0x${string}`,
        abi: [
          {
            name: "getFeedById",
            type: "function",
            stateMutability: "view",
            inputs: [{ type: "bytes21", name: "_feedId" }],
            outputs: [
              {
                type: "tuple",
                name: "_feedData",
                components: [
                  { type: "uint32", name: "votingRoundId" },
                  { type: "bytes21", name: "id" },
                  { type: "int32", name: "value" },
                  { type: "uint16", name: "turnoutBIPS" },
                  { type: "int8", name: "decimals" },
                ],
              },
            ],
          },
        ],
        functionName: "getFeedById",
        args: [feedId as `0x${string}`],
      })) as any;

      if (!result || result.value === 0) {
        return null;
      }

      const symbol = getFeedSymbol(feedId);
      const decimals = Number(result.decimals);
      const rawValue = Number(result.value);

      // Convert value based on decimals
      const value = rawValue / Math.pow(10, Math.abs(decimals));

      return {
        id: feedId,
        symbol,
        value,
        decimals,
        timestamp: Date.now(),
        roundId: Number(result.votingRoundId),
      };
    } catch (error: any) {
      // Don't spam console with FTSO errors since they're not critical for demo
      if (error.message?.includes("returned no data")) {
        console.log(`FTSO feed ${feedId}: Feed not available on this network`);
      } else {
        console.error(
          `Failed to fetch FTSO feed ${feedId}:`,
          error.message || error
        );
      }
      return null;
    }
  };

  const fetchAllFeeds = async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const feedPromises = Object.values(FEED_IDS).map((feedId) =>
        fetchFeedById(feedId)
      );

      const results = await Promise.all(feedPromises);
      const newFeeds = new Map<string, FeedData>();

      results.forEach((feed) => {
        if (feed) {
          newFeeds.set(feed.id, feed);
        }
      });

      setState((prev) => ({
        ...prev,
        feeds: newFeeds,
        lastUpdate: Date.now(),
        isLoading: false,
      }));

      console.log("Updated price feeds:", newFeeds.size, "feeds");
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message || "Failed to fetch price feeds",
        isLoading: false,
      }));
    }
  };

  const getFeedSymbol = (feedId: string): string => {
    const symbols: Record<string, string> = {
      [FEED_IDS.XRP_USD]: "XRP/USD",
      [FEED_IDS.FLR_USD]: "FLR/USD",
      [FEED_IDS.ETH_USD]: "ETH/USD",
      [FEED_IDS.BTC_USD]: "BTC/USD",
    };
    return symbols[feedId] || "UNKNOWN";
  };

  const getPrice = (symbol: string): FeedData | null => {
    for (const [feedId, feed] of state.feeds) {
      if (feed.symbol === symbol) {
        return feed;
      }
    }
    return null;
  };

  const getXRPPrice = (): number => {
    const feed = getPrice("XRP/USD");
    return feed?.value || 0;
  };

  const getFLRPrice = (): number => {
    const feed = getPrice("FLR/USD");
    return feed?.value || 0;
  };

  const getXRPtoFLRRate = (): PriceConversion => {
    const xrpPrice = getXRPPrice();
    const flrPrice = getFLRPrice();

    const rate = flrPrice > 0 ? xrpPrice / flrPrice : 1;

    return {
      from: "XRP",
      to: "FLR",
      rate,
      timestamp: Date.now(),
    };
  };

  const getFLRtoXRPRate = (): PriceConversion => {
    const xrpPrice = getXRPPrice();
    const flrPrice = getFLRPrice();

    const rate = xrpPrice > 0 ? flrPrice / xrpPrice : 1;

    return {
      from: "FLR",
      to: "XRP",
      rate,
      timestamp: Date.now(),
    };
  };

  const convertAmount = (
    amount: number,
    fromCurrency: "XRP" | "FLR" | "USD",
    toCurrency: "XRP" | "FLR" | "USD"
  ): number => {
    if (fromCurrency === toCurrency) return amount;

    const xrpPrice = getXRPPrice();
    const flrPrice = getFLRPrice();

    // Convert to USD first, then to target currency
    let usdAmount = amount;

    if (fromCurrency === "XRP") {
      usdAmount = amount * xrpPrice;
    } else if (fromCurrency === "FLR") {
      usdAmount = amount * flrPrice;
    }

    if (toCurrency === "USD") {
      return usdAmount;
    } else if (toCurrency === "XRP") {
      return xrpPrice > 0 ? usdAmount / xrpPrice : 0;
    } else if (toCurrency === "FLR") {
      return flrPrice > 0 ? usdAmount / flrPrice : 0;
    }

    return 0;
  };

  const calculateBookingCost = (
    priceInUSD: number,
    preferredCurrency: "XRP" | "FLR"
  ): { amount: number; currency: string; usdValue: number } => {
    const amount = convertAmount(priceInUSD, "USD", preferredCurrency);

    return {
      amount,
      currency: preferredCurrency,
      usdValue: priceInUSD,
    };
  };

  const isDataFresh = (maxAgeMs: number = 60000): boolean => {
    return Date.now() - state.lastUpdate < maxAgeMs;
  };

  const getAllPrices = (): FeedData[] => {
    return Array.from(state.feeds.values());
  };

  // Auto-refresh feeds every 30 seconds (disabled for demo due to feed availability issues)
  useEffect(() => {
    if (state.isConnected) {
      // Temporarily disabled to avoid console spam from unavailable feeds
      // const interval = setInterval(() => {
      //   fetchAllFeeds();
      // }, 30000);
      // return () => clearInterval(interval);
    }
  }, [state.isConnected]);

  // Refresh feeds when they become stale (disabled for demo)
  const refreshIfStale = useCallback(() => {
    if (!isDataFresh(60000) && !state.isLoading) {
      // Temporarily disabled to avoid console spam from unavailable feeds
      // fetchAllFeeds();
    }
  }, [state.lastUpdate, state.isLoading]);

  return {
    ...state,
    clearError,
    fetchAllFeeds,
    fetchFeedById,
    getPrice,
    getXRPPrice,
    getFLRPrice,
    getXRPtoFLRRate,
    getFLRtoXRPRate,
    convertAmount,
    calculateBookingCost,
    isDataFresh,
    getAllPrices,
    refreshIfStale,
  };
}
