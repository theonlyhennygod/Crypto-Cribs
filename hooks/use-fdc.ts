"use client"

import { useState, useEffect } from "react"
import { usePublicClient } from "wagmi"
import { encodePacked, keccak256 } from "viem"

// Flare Data Connector (FDC) configuration for Coston2 testnet
const FDC_CONTRACTS = {
  StateConnector: "0x0c13aDA1C7143Cf0a0795FFaB93eEBb6FAD6e4e3",
  AttestationClient: "0xA90Db6D10F856799b10ef2A77EBCbF460aC71e52",
}

// XRPL Payment attestation type
const XRPL_PAYMENT_ATTESTATION_TYPE = "0x5061796d656e7400000000000000000000000000000000000000000000000000" // "Payment" in hex

interface AttestationRequest {
  attestationType: `0x${string}`
  sourceId: `0x${string}`
  requestBody: `0x${string}`
}

interface AttestationResponse {
  attestationType: `0x${string}`
  sourceId: `0x${string}`
  votingRound: bigint
  lowestUsedTimestamp: bigint
  request: `0x${string}`
  response: `0x${string}`
}

interface PaymentAttestation {
  transactionId: string
  sourceAddress: string
  receivingAddress: string
  amount: string
  timestamp: number
  blockNumber?: number
  status: "pending" | "attested" | "failed"
}

interface FDCState {
  isConnected: boolean
  currentVotingRound: number
  pendingAttestations: PaymentAttestation[]
  attestedPayments: Map<string, PaymentAttestation>
  error: string | null
}

export function useFDC() {
  const [state, setState] = useState<FDCState>({
    isConnected: false,
    currentVotingRound: 0,
    pendingAttestations: [],
    attestedPayments: new Map(),
    error: null,
  })
  
  const publicClient = usePublicClient()

  const clearError = () => {
    setState(prev => ({ ...prev, error: null }))
  }

  // Initialize FDC connection
  useEffect(() => {
    if (publicClient) {
      setState(prev => ({ ...prev, isConnected: true }))
      getCurrentVotingRound()
    }
  }, [publicClient])

  const getCurrentVotingRound = async () => {
    try {
      if (!publicClient) return

      // Get current voting round from StateConnector
      const result = await publicClient.readContract({
        address: FDC_CONTRACTS.StateConnector as `0x${string}`,
        abi: [
          {
            name: "getCurrentVotingRoundId",
            type: "function",
            stateMutability: "view",
            inputs: [],
            outputs: [{ type: "uint256", name: "" }],
          },
        ],
        functionName: "getCurrentVotingRoundId",
      })

      setState(prev => ({
        ...prev,
        currentVotingRound: Number(result),
      }))
      
      return Number(result)
    } catch (error: any) {
      console.error("Failed to get current voting round:", error)
      return 0
    }
  }

  const preparePaymentAttestationRequest = (
    xrplTxId: string,
    sourceAddress: string,
    receivingAddress: string,
    amount: string
  ): AttestationRequest => {
    // Encode XRPL payment data according to FDC specification
    const requestBody = encodePacked(
      ["string", "string", "string", "string"],
      [xrplTxId, sourceAddress, receivingAddress, amount]
    )

    return {
      attestationType: XRPL_PAYMENT_ATTESTATION_TYPE as `0x${string}`,
      sourceId: "0x5852504c00000000000000000000000000000000000000000000000000000000", // "XRPL" in hex
      requestBody,
    }
  }

  const submitAttestationRequest = async (
    xrplTxId: string,
    sourceAddress: string,
    receivingAddress: string,
    amount: string
  ): Promise<void> => {
    try {
      if (!publicClient) {
        throw new Error("Not connected to Flare network")
      }

      setState(prev => ({ ...prev, error: null }))

      const request = preparePaymentAttestationRequest(
        xrplTxId,
        sourceAddress,
        receivingAddress,
        amount
      )

      // In a real implementation, this would submit to FDC via a relayer or directly
      // For now, we'll simulate the attestation process
      const attestation: PaymentAttestation = {
        transactionId: xrplTxId,
        sourceAddress,
        receivingAddress,
        amount,
        timestamp: Date.now(),
        status: "pending",
      }

      setState(prev => ({
        ...prev,
        pendingAttestations: [...prev.pendingAttestations, attestation],
      }))

      // Simulate attestation processing (in real app this would be handled by FDC)
      setTimeout(() => {
        processAttestation(xrplTxId)
      }, 5000)

      console.log("Attestation request submitted for XRPL transaction:", xrplTxId)
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        error: error.message || "Failed to submit attestation request",
      }))
      throw error
    }
  }

  const processAttestation = async (xrplTxId: string) => {
    try {
      // Find pending attestation
      const pending = state.pendingAttestations.find(
        att => att.transactionId === xrplTxId
      )
      
      if (!pending) return

      // Simulate successful attestation
      const attestedPayment: PaymentAttestation = {
        ...pending,
        status: "attested",
        blockNumber: await publicClient?.getBlockNumber(),
      }

      setState(prev => {
        const newAttestations = prev.pendingAttestations.filter(
          att => att.transactionId !== xrplTxId
        )
        const newAttestedPayments = new Map(prev.attestedPayments)
        newAttestedPayments.set(xrplTxId, attestedPayment)

        return {
          ...prev,
          pendingAttestations: newAttestations,
          attestedPayments: newAttestedPayments,
        }
      })

      console.log("XRPL payment attested:", xrplTxId)
    } catch (error: any) {
      console.error("Failed to process attestation:", error)
      
      setState(prev => ({
        ...prev,
        pendingAttestations: prev.pendingAttestations.map(att =>
          att.transactionId === xrplTxId
            ? { ...att, status: "failed" }
            : att
        ),
      }))
    }
  }

  const verifyAttestation = async (
    attestationResponse: AttestationResponse,
    merkleProof: `0x${string}`[]
  ): Promise<boolean> => {
    try {
      if (!publicClient) {
        throw new Error("Not connected to Flare network")
      }

      // Verify the attestation using StateConnector
      const isValid = await publicClient.readContract({
        address: FDC_CONTRACTS.StateConnector as `0x${string}`,
        abi: [
          {
            name: "verifyAttestation",
            type: "function",
            stateMutability: "view",
            inputs: [
              {
                type: "tuple",
                name: "response",
                components: [
                  { type: "bytes32", name: "attestationType" },
                  { type: "bytes32", name: "sourceId" },
                  { type: "uint64", name: "votingRound" },
                  { type: "uint64", name: "lowestUsedTimestamp" },
                  { type: "bytes", name: "request" },
                  { type: "bytes", name: "response" },
                ],
              },
              { type: "bytes32[]", name: "merkleProof" },
            ],
            outputs: [{ type: "bool", name: "" }],
          },
        ],
        functionName: "verifyAttestation",
        args: [attestationResponse, merkleProof],
      })

      return Boolean(isValid)
    } catch (error: any) {
      console.error("Failed to verify attestation:", error)
      return false
    }
  }

  const getAttestationByTxId = (txId: string): PaymentAttestation | null => {
    return state.attestedPayments.get(txId) || null
  }

  const isPaymentAttested = (txId: string): boolean => {
    const attestation = state.attestedPayments.get(txId)
    return attestation?.status === "attested"
  }

  const getPendingAttestations = (): PaymentAttestation[] => {
    return state.pendingAttestations
  }

  const getAttestedPayments = (): PaymentAttestation[] => {
    return Array.from(state.attestedPayments.values())
  }

  // Monitor for new attestations periodically
  useEffect(() => {
    if (state.isConnected) {
      const interval = setInterval(() => {
        getCurrentVotingRound()
      }, 30000) // Check every 30 seconds

      return () => clearInterval(interval)
    }
  }, [state.isConnected])

  return {
    ...state,
    clearError,
    getCurrentVotingRound,
    submitAttestationRequest,
    verifyAttestation,
    getAttestationByTxId,
    isPaymentAttested,
    getPendingAttestations,
    getAttestedPayments,
  }
}
