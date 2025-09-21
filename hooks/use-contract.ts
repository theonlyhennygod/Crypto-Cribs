import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
} from "wagmi";
import { CONTRACT_ADDRESSES, NETWORK_CONFIG } from "@/lib/contracts/types";
import { CRYPTO_CRIBS_BOOKING_ABI, FTSO_V2_ABI } from "@/lib/contracts/abis";
import { useChainId } from "wagmi";
import { parseEther } from "viem";

// Hook for reading from the booking contract
export function useBookingContract() {
  const chainId = useChainId();

  // Determine which network we're on
  const networkKey = chainId === 114 ? "coston2" : "flare";
  const contractAddress = CONTRACT_ADDRESSES[networkKey]
    .BOOKING_CONTRACT as `0x${string}`;

  return {
    address: contractAddress,
    abi: CRYPTO_CRIBS_BOOKING_ABI,
    chainId,
  };
}

// Hook for reading property data
export function useProperty(propertyId: bigint) {
  const contract = useBookingContract();

  return useReadContract({
    ...contract,
    functionName: "getProperty",
    args: [propertyId],
    query: {
      enabled: !!propertyId && !!contract.address,
    },
  });
}

// Hook for reading booking data
export function useBooking(bookingId: bigint) {
  const contract = useBookingContract();

  return useReadContract({
    ...contract,
    functionName: "getBooking",
    args: [bookingId],
    query: {
      enabled: !!bookingId && !!contract.address,
    },
  });
}

// Hook for reading user's bookings
export function useUserBookings(userAddress: `0x${string}` | undefined) {
  const contract = useBookingContract();

  return useReadContract({
    ...contract,
    functionName: "getUserBookings",
    args: userAddress ? [userAddress] : undefined,
    query: {
      enabled: !!userAddress && !!contract.address,
    },
  });
}

// Hook for reading host's properties
export function useHostProperties(hostAddress: `0x${string}` | undefined) {
  const contract = useBookingContract();

  return useReadContract({
    ...contract,
    functionName: "getHostProperties",
    args: hostAddress ? [hostAddress] : undefined,
    query: {
      enabled: !!hostAddress && !!contract.address,
    },
  });
}

// Hook for reading XRP price
export function useXRPPrice() {
  const contract = useBookingContract();

  return useReadContract({
    ...contract,
    functionName: "getXRPPrice",
    query: {
      enabled: !!contract.address,
      refetchInterval: 30000, // Refetch every 30 seconds
    },
  });
}

// Hook for writing to the booking contract
export function useBookingWrite() {
  const contract = useBookingContract();
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  const listProperty = (
    name: string,
    location: string,
    pricePerNightUSD: bigint,
    amenities: string[],
    maxGuests: bigint,
    options?: { value?: bigint }
  ) => {
    writeContract({
      ...contract,
      functionName: "listProperty",
      args: [name, location, pricePerNightUSD, amenities, maxGuests],
      value: options?.value ?? parseEther("0.1"), // Default verification fee
    });
  };

  const createBooking = (
    propertyId: bigint,
    checkIn: bigint,
    checkOut: bigint,
    options?: { value?: bigint }
  ) => {
    writeContract({
      ...contract,
      functionName: "createBooking",
      args: [propertyId, checkIn, checkOut],
      value: options?.value || parseEther("0.01"), // Small payment for booking
    });
  };

  const togglePropertyAvailability = (propertyId: bigint) => {
    writeContract({
      ...contract,
      functionName: "togglePropertyAvailability",
      args: [propertyId],
    });
  };

  const completeBooking = (bookingId: bigint) => {
    writeContract({
      ...contract,
      functionName: "completeBooking",
      args: [bookingId],
    });
  };

  return {
    listProperty,
    createBooking,
    togglePropertyAvailability,
    completeBooking,
    hash,
    error,
    isPending,
    isConfirming,
    isSuccess,
  };
}
