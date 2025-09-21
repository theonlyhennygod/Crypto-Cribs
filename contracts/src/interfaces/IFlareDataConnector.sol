// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IFlareDataConnector
 * @dev Interface for Flare Data Connector (FDC) to verify XRPL transactions
 */
interface IFlareDataConnector {
    struct AttestationRequest {
        bytes32 attestationType;
        bytes32 sourceId;
        bytes requestBody;
    }

    struct AttestationResponse {
        bytes32 attestationType;
        bytes32 sourceId;
        uint64 votingRound;
        uint64 lowestUsedTimestamp;
        bytes request;
        bytes response;
    }

    /**
     * @dev Verify an attestation response
     * @param _response The attestation response to verify
     * @return True if the attestation is valid
     */
    function verifyAttestation(
        AttestationResponse calldata _response
    ) external view returns (bool);

    /**
     * @dev Get the Merkle root for a specific voting round
     * @param _votingRound The voting round to query
     * @return The Merkle root for that round
     */
    function getMerkleRoot(uint256 _votingRound) external view returns (bytes32);
}
