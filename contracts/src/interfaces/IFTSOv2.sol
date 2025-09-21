// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title IFTSOv2
 * @dev Interface for Flare Time Series Oracle v2 (FTSOv2) price feeds
 */
interface IFTSOv2 {
    struct FeedData {
        uint32 votingRoundId;
        bytes21 id;
        int32 value;
        uint16 turnoutBIPS;
        int8 decimals;
    }

    /**
     * @dev Get feeds by ID for current voting round
     * @param _feedIds Array of feed IDs to query
     * @return _feedsData Array of feed data
     */
    function getFeedsByIdInRange(
        bytes21[] calldata _feedIds,
        uint256 _startVotingRoundId,
        uint256 _endVotingRoundId
    ) external view returns (FeedData[] memory _feedsData);

    /**
     * @dev Get single feed by ID for current voting round
     * @param _feedId The feed ID to query
     * @return _feedData The feed data
     */
    function getFeedById(
        bytes21 _feedId
    ) external view returns (FeedData memory _feedData);

    /**
     * @dev Get current voting round ID
     * @return Current voting round ID
     */
    function getCurrentVotingRoundId() external view returns (uint32);
}
