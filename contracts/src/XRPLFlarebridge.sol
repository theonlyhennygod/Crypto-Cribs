// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./interfaces/IFlareDataConnector.sol";
import "./interfaces/IFTSOv2.sol";

/**
 * @title XRPLFlarebridge
 * @dev Cross-chain bridge between XRPL and Flare networks with FAssets integration
 */
contract XRPLFlarebridge is Ownable, ReentrancyGuard, Pausable {
    // Flare protocol addresses
    address public constant FTSO_V2 = 0xC4e9c78EA53db782E28f28Fdf80BaF59336B304d;
    address public constant FDC_ATTESTATION_CLIENT = 0xA90Db6D10F856799b10ef2A77EBCbF460aC71e52;
    
    // Feed IDs
    bytes21 public constant XRP_USD_FEED_ID = hex"015852500000000000000000000000000000000000";
    bytes21 public constant FLR_USD_FEED_ID = hex"01464c520000000000000000000000000000000000";

    struct BridgeRequest {
        address user;
        uint256 amount;
        string destination;
        BridgeDirection direction;
        BridgeStatus status;
        uint256 createdAt;
        bytes32 proofHash;
    }

    enum BridgeDirection { XRPLToFlare, FlareToXRPL }
    enum BridgeStatus { Pending, Processing, Completed, Failed, Cancelled }

    // State variables
    uint256 public bridgeFeePercentage = 50; // 0.5%
    uint256 public minimumBridgeAmount = 1e18; // 1 FLR/XRP
    uint256 public totalFLRLocked;
    uint256 public totalXRPLocked;

    mapping(bytes32 => BridgeRequest) public bridgeRequests;
    mapping(address => bytes32[]) public userBridgeRequests;
    mapping(address => uint256) public liquidityProviders;
    mapping(string => bool) public processedXRPLTxs;

    // Events
    event BridgeRequestCreated(bytes32 indexed requestId, address user, uint256 amount, BridgeDirection direction);
    event BridgeCompleted(bytes32 indexed requestId, address user, uint256 amount);
    event LiquidityAdded(address provider, uint256 flrAmount);
    event XRPLProofVerified(string txHash, address user, uint256 amount);

    constructor() Ownable(msg.sender) {}

    // ========== CORE BRIDGING FUNCTIONS ==========

    function bridgeXRPToFlare(
        string memory xrplTxHash,
        uint256 amount,
        address flareRecipient
    ) external nonReentrant whenNotPaused {
        require(!processedXRPLTxs[xrplTxHash], "Transaction already processed");
        require(amount >= minimumBridgeAmount, "Amount below minimum");
        
        bytes32 requestId = keccak256(abi.encodePacked(xrplTxHash, block.timestamp));
        
        bridgeRequests[requestId] = BridgeRequest({
            user: flareRecipient,
            amount: amount,
            destination: "",
            direction: BridgeDirection.XRPLToFlare,
            status: BridgeStatus.Pending,
            createdAt: block.timestamp,
            proofHash: keccak256(bytes(xrplTxHash))
        });
        
        userBridgeRequests[flareRecipient].push(requestId);
        processedXRPLTxs[xrplTxHash] = true;
        
        emit BridgeRequestCreated(requestId, flareRecipient, amount, BridgeDirection.XRPLToFlare);
    }

    function bridgeFlareToXRP(
        uint256 amount,
        string memory xrplDestination
    ) external payable nonReentrant whenNotPaused {
        require(msg.value >= amount, "Insufficient FLR sent");
        require(amount >= minimumBridgeAmount, "Amount below minimum");
        
        uint256 fee = (amount * bridgeFeePercentage) / 10000;
        uint256 bridgeAmount = amount - fee;
        
        bytes32 requestId = keccak256(abi.encodePacked(msg.sender, block.timestamp));
        
        bridgeRequests[requestId] = BridgeRequest({
            user: msg.sender,
            amount: bridgeAmount,
            destination: xrplDestination,
            direction: BridgeDirection.FlareToXRPL,
            status: BridgeStatus.Processing,
            createdAt: block.timestamp,
            proofHash: bytes32(0)
        });
        
        userBridgeRequests[msg.sender].push(requestId);
        totalFLRLocked += bridgeAmount;
        
        emit BridgeRequestCreated(requestId, msg.sender, bridgeAmount, BridgeDirection.FlareToXRPL);
    }

    // ========== FDC VERIFICATION FUNCTIONS ==========

    function verifyXRPLTransaction(
        string memory txHash,
        address expectedSender,
        uint256 expectedAmount
    ) external view returns (bool) {
        // Simplified verification - would integrate with actual FDC
        return bytes(txHash).length == 64 && expectedAmount > 0;
    }

    function submitXRPLProof(
        bytes32 attestationId,
        bytes memory encodedData,
        bytes32[] memory merkleProof
    ) external nonReentrant {
        // Verify merkle proof and process bridge request
        require(verifyStateConnectorProof(attestationId, keccak256(encodedData), merkleProof), "Invalid proof");
        
        // Process the bridge request based on verified data
        // This would decode the XRPL transaction data and complete the bridge
    }

    function verifyStateConnectorProof(
        bytes32 merkleRoot,
        bytes32 leaf,
        bytes32[] memory proof
    ) public pure returns (bool) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];
            if (computedHash <= proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }
        return computedHash == merkleRoot;
    }

    // ========== FASSETS INTEGRATION ==========

    function mintFAssetXRP(uint256 amount, address recipient) external nonReentrant {
        require(amount > 0, "Invalid amount");
        // Mint FAsset XRP tokens - would integrate with FAssets protocol
        // For now, just track the minting
        totalXRPLocked += amount;
    }

    function burnFAssetXRP(uint256 amount, string memory xrplDestination) external nonReentrant {
        require(amount > 0, "Invalid amount");
        require(totalXRPLocked >= amount, "Insufficient locked XRP");
        
        totalXRPLocked -= amount;
        // Burn FAsset and initiate XRPL withdrawal
    }

    // ========== LIQUIDITY FUNCTIONS ==========

    function addLiquidity() external payable nonReentrant {
        require(msg.value > 0, "Invalid amount");
        liquidityProviders[msg.sender] += msg.value;
        emit LiquidityAdded(msg.sender, msg.value);
    }

    function removeLiquidity(uint256 amount) external nonReentrant {
        require(liquidityProviders[msg.sender] >= amount, "Insufficient liquidity");
        liquidityProviders[msg.sender] -= amount;
        payable(msg.sender).transfer(amount);
    }

    // ========== ORACLE AND PRICING ==========

    function getXRPFLRExchangeRate() external view returns (uint256 rate, uint256 timestamp) {
        IFTSOv2 ftso = IFTSOv2(FTSO_V2);
        
        try ftso.getFeedById(XRP_USD_FEED_ID) returns (IFTSOv2.FeedData memory xrpData) {
            try ftso.getFeedById(FLR_USD_FEED_ID) returns (IFTSOv2.FeedData memory flrData) {
                if (flrData.value > 0) {
                    rate = (uint256(int256(xrpData.value)) * 1e18) / uint256(int256(flrData.value));
                    timestamp = block.timestamp;
                } else {
                    rate = 1e18; // 1:1 fallback
                    timestamp = block.timestamp;
                }
            } catch {
                rate = 1e18;
                timestamp = block.timestamp;
            }
        } catch {
            rate = 1e18;
            timestamp = block.timestamp;
        }
    }

    function calculateBridgeFee(
        uint256 amount,
        BridgeDirection direction
    ) external view returns (uint256) {
        return (amount * bridgeFeePercentage) / 10000;
    }

    // ========== VIEW FUNCTIONS ==========

    function getBridgeRequest(bytes32 requestId) external view returns (BridgeRequest memory) {
        return bridgeRequests[requestId];
    }

    function getPendingBridges(address user) external view returns (bytes32[] memory) {
        bytes32[] memory userRequests = userBridgeRequests[user];
        uint256 pendingCount = 0;
        
        // Count pending requests
        for (uint256 i = 0; i < userRequests.length; i++) {
            if (bridgeRequests[userRequests[i]].status == BridgeStatus.Pending ||
                bridgeRequests[userRequests[i]].status == BridgeStatus.Processing) {
                pendingCount++;
            }
        }
        
        bytes32[] memory pending = new bytes32[](pendingCount);
        uint256 index = 0;
        
        for (uint256 i = 0; i < userRequests.length; i++) {
            if (bridgeRequests[userRequests[i]].status == BridgeStatus.Pending ||
                bridgeRequests[userRequests[i]].status == BridgeStatus.Processing) {
                pending[index] = userRequests[i];
                index++;
            }
        }
        
        return pending;
    }

    function getTotalLocked() external view returns (uint256 flrLocked, uint256 xrpLocked) {
        return (totalFLRLocked, totalXRPLocked);
    }

    function getUserLiquidity(address user) external view returns (uint256) {
        return liquidityProviders[user];
    }

    function getMinimumBridgeAmount() external view returns (uint256) {
        return minimumBridgeAmount;
    }

    // ========== ADMIN FUNCTIONS ==========

    function setBridgeFee(uint256 newFeePercentage) external onlyOwner {
        require(newFeePercentage <= 1000, "Fee too high"); // Max 10%
        bridgeFeePercentage = newFeePercentage;
    }

    function setMinimumBridgeAmount(uint256 newMinimum) external onlyOwner {
        minimumBridgeAmount = newMinimum;
    }

    function pauseBridge() external onlyOwner {
        _pause();
    }

    function unpauseBridge() external onlyOwner {
        _unpause();
    }

    function emergencyWithdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }

    // ========== INTERNAL FUNCTIONS ==========

    function processBridgeRequest(bytes32 requestId, bytes memory proof) external onlyOwner {
        BridgeRequest storage request = bridgeRequests[requestId];
        require(request.status == BridgeStatus.Pending, "Invalid status");
        
        request.status = BridgeStatus.Completed;
        
        if (request.direction == BridgeDirection.XRPLToFlare) {
            // Mint equivalent FLR tokens
            payable(request.user).transfer(request.amount);
        }
        
        emit BridgeCompleted(requestId, request.user, request.amount);
    }

    receive() external payable {
        // Accept FLR deposits
    }
}
