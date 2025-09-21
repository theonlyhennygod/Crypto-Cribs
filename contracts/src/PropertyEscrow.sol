// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./interfaces/IFlareDataConnector.sol";
import "./interfaces/IFTSOv2.sol";

/**
 * @title PropertyEscrow
 * @dev Advanced escrow contract for property bookings with cross-chain verification
 * Handles payments, disputes, and automated releases with Flare Network integration
 */
contract PropertyEscrow is Ownable, ReentrancyGuard, Pausable {
    // Flare protocol addresses (Coston2 testnet)
    address public constant FLARE_CONTRACT_REGISTRY = 0xaD67FE66660Fb8dFE9d6b1b4240d8650e30F6019;
    address public constant FTSO_V2 = 0xC4e9c78EA53db782E28f28Fdf80BaF59336B304d;
    address public constant FDC_ATTESTATION_CLIENT = 0xA90Db6D10F856799b10ef2A77EBCbF460aC71e52;
    
    // XRPL verification constants
    bytes32 public constant XRPL_PAYMENT_ATTESTATION_TYPE = hex"50617974656e7400000000000000000000000000000000000000000000000000";
    bytes32 public constant XRPL_SOURCE_ID = hex"746573746e657400000000000000000000000000000000000000000000000000";

    // FTSO Feed IDs (only needed ones)
    bytes21 public constant XRP_USD_FEED_ID = hex"015852500000000000000000000000000000000000";
    bytes21 public constant FLR_USD_FEED_ID = hex"01464c520000000000000000000000000000000000";

    struct Booking {
        address guest;
        address host;
        uint256 propertyId;
        uint256 amount;
        uint256 checkInTime;
        uint256 checkOutTime;
        uint256 createdAt;
        uint256 disputeDeadline;
        uint256 escrowBalance;
        uint256 securityDeposit;
        BookingStatus status;
        bool autoReleaseEnabled;
        string xrplTxHash;
    }

    enum BookingStatus { 
        Created, 
        Confirmed, 
        CheckedIn, 
        Completed, 
        Disputed, 
        Cancelled, 
        Refunded 
    }

    // State variables
    uint256 public nextBookingId = 1;
    uint256 public disputeWindow = 7 days;
    uint256 public autoReleaseDelay = 1 days;
    uint256 public platformFeePercentage = 250; // 2.5%
    uint256 public securityDepositPercentage = 1000; // 10%

    mapping(uint256 => Booking) public bookings;
    mapping(address => uint256[]) public guestBookings;
    mapping(address => uint256[]) public hostBookings;
    mapping(uint256 => string) public disputeReasons;
    uint256 public totalEscrowBalance;

    // Events
    event BookingCreated(uint256 indexed bookingId, address indexed guest, address indexed host, uint256 amount);
    event BookingConfirmed(uint256 indexed bookingId, string xrplTxHash);
    event CheckInConfirmed(uint256 indexed bookingId, uint256 timestamp);
    event PaymentReleased(uint256 indexed bookingId, uint256 amount, address recipient);
    event BookingCancelled(uint256 indexed bookingId, string reason);
    event DisputeRaised(uint256 indexed bookingId, address disputer, string reason);
    event DisputeResolved(uint256 indexed bookingId, bool refundGuest, uint256 hostAmount, uint256 guestRefund);
    event XRPLProofSubmitted(uint256 indexed bookingId, bytes32 merkleRoot, string txData);

    constructor() Ownable(msg.sender) {}

    // ========== CORE ESCROW FUNCTIONS ==========

    /**
     * @dev Create a booking with escrow
     */
    function createBooking(
        uint256 propertyId, 
        uint256 checkInTime, 
        uint256 checkOutTime
    ) external payable nonReentrant whenNotPaused {
        require(msg.value > 0, "Payment required");
        require(checkInTime > block.timestamp, "Check-in must be in future");
        require(checkOutTime > checkInTime, "Invalid checkout time");

        uint256 securityDeposit = (msg.value * securityDepositPercentage) / 10000;
        uint256 bookingAmount = msg.value - securityDeposit;

        uint256 bookingId = nextBookingId++;
        
        bookings[bookingId] = Booking({
            guest: msg.sender,
            host: address(0), // Will be set when property owner confirms
            propertyId: propertyId,
            amount: bookingAmount,
            checkInTime: checkInTime,
            checkOutTime: checkOutTime,
            status: BookingStatus.Created,
            xrplTxHash: "",
            createdAt: block.timestamp,
            disputeDeadline: checkOutTime + disputeWindow,
            escrowBalance: msg.value,
            autoReleaseEnabled: true,
            securityDeposit: securityDeposit
        });

        guestBookings[msg.sender].push(bookingId);
        totalEscrowBalance += msg.value;

        emit BookingCreated(bookingId, msg.sender, address(0), msg.value);
    }

    /**
     * @dev Confirm check-in (can be called by guest or host)
     */
    function confirmCheckIn(uint256 bookingId) external nonReentrant {
        Booking storage booking = bookings[bookingId];
        require(booking.guest != address(0), "Booking does not exist");
        require(
            msg.sender == booking.guest || msg.sender == booking.host,
            "Only guest or host can confirm"
        );
        require(booking.status == BookingStatus.Confirmed, "Booking not confirmed");
        require(block.timestamp >= booking.checkInTime, "Check-in time not reached");
        require(block.timestamp <= booking.checkInTime + 1 days, "Check-in window expired");

        booking.status = BookingStatus.CheckedIn;
        
        emit CheckInConfirmed(bookingId, block.timestamp);
    }

    /**
     * @dev Release payment to host (automated or manual)
     */
    function releasePayment(uint256 bookingId) external nonReentrant {
        Booking storage booking = bookings[bookingId];
        require(booking.guest != address(0), "Booking does not exist");
        require(
            booking.status == BookingStatus.CheckedIn || booking.status == BookingStatus.Completed,
            "Invalid status for payment release"
        );
        
        // Check if auto-release conditions are met
        bool canAutoRelease = booking.autoReleaseEnabled && 
                             block.timestamp >= booking.checkOutTime + autoReleaseDelay;
        
        // Manual release by guest or auto-release
        require(
            msg.sender == booking.guest || 
            msg.sender == booking.host || 
            canAutoRelease,
            "Not authorized to release payment"
        );

        uint256 platformFee = (booking.amount * platformFeePercentage) / 10000;
        uint256 hostPayment = booking.amount - platformFee;

        booking.status = BookingStatus.Completed;
        booking.escrowBalance = booking.securityDeposit; // Keep security deposit

        totalEscrowBalance -= booking.amount;

        // Transfer payments
        payable(booking.host).transfer(hostPayment);
        payable(owner()).transfer(platformFee);

        emit PaymentReleased(bookingId, hostPayment, booking.host);
    }

    /**
     * @dev Cancel booking with refund logic
     */
    function cancelBooking(uint256 bookingId) external nonReentrant {
        Booking storage booking = bookings[bookingId];
        require(booking.guest != address(0), "Booking does not exist");
        require(
            msg.sender == booking.guest || msg.sender == booking.host,
            "Only guest or host can cancel"
        );
        require(
            booking.status == BookingStatus.Created || booking.status == BookingStatus.Confirmed,
            "Cannot cancel at this stage"
        );

        uint256 refundAmount = calculateCancellationRefund(bookingId);
        booking.status = BookingStatus.Cancelled;
        booking.escrowBalance = 0;

        totalEscrowBalance -= booking.amount + booking.securityDeposit;

        if (refundAmount > 0) {
            payable(booking.guest).transfer(refundAmount);
        }

        emit BookingCancelled(bookingId, "Cancelled by user");
    }

    /**
     * @dev Raise a dispute
     */
    function disputeBooking(uint256 bookingId, string memory reason) external nonReentrant {
        Booking storage booking = bookings[bookingId];
        require(booking.guest != address(0), "Booking does not exist");
        require(
            msg.sender == booking.guest || msg.sender == booking.host,
            "Only guest or host can dispute"
        );
        require(block.timestamp <= booking.disputeDeadline, "Dispute window expired");
        require(
            booking.status == BookingStatus.CheckedIn || booking.status == BookingStatus.Completed,
            "Invalid status for dispute"
        );

        booking.status = BookingStatus.Disputed;
        disputeReasons[bookingId] = reason;

        emit DisputeRaised(bookingId, msg.sender, reason);
    }

    /**
     * @dev Resolve dispute (only owner/admin)
     */
    function resolveDispute(uint256 bookingId, bool refundGuest) external onlyOwner nonReentrant {
        Booking storage booking = bookings[bookingId];
        require(booking.status == BookingStatus.Disputed, "No active dispute");

        uint256 totalAmount = booking.amount + booking.securityDeposit;
        uint256 platformFee = (booking.amount * platformFeePercentage) / 10000;
        
        uint256 hostAmount;
        uint256 guestRefund;

        if (refundGuest) {
            // Guest wins dispute - full refund minus platform fee
            guestRefund = totalAmount - platformFee;
            hostAmount = 0;
        } else {
            // Host wins dispute - gets payment, guest loses security deposit
            hostAmount = booking.amount - platformFee;
            guestRefund = 0;
        }

        booking.status = BookingStatus.Refunded;
        booking.escrowBalance = 0;
        totalEscrowBalance -= totalAmount;

        // Transfer funds
        if (hostAmount > 0) {
            payable(booking.host).transfer(hostAmount);
        }
        if (guestRefund > 0) {
            payable(booking.guest).transfer(guestRefund);
        }
        payable(owner()).transfer(platformFee);

        emit DisputeResolved(bookingId, refundGuest, hostAmount, guestRefund);
    }

    // ========== FTSO INTEGRATION FUNCTIONS ==========

    /**
     * @dev Get property price in USD using FTSO
     */
    function getPropertyPriceInUSD(uint256 propertyId) external view returns (uint256) {
        // This would integrate with PropertyNFT contract to get base price
        // For now, return a calculated price based on market data
        uint256 basePrice = 100 * 1e18; // $100 base price
        uint256 locationMultiplier = getLocationPriceMultiplier(propertyId);
        return (basePrice * locationMultiplier) / 1e18;
    }

    /**
     * @dev Get FLR price in USD from FTSO
     */
    function getFLRPriceInUSD() external view returns (uint256) {
        return getFTSOPrice(FLR_USD_FEED_ID);
    }

    /**
     * @dev Get XRP price in USD from FTSO
     */
    function getXRPPriceInUSD() external view returns (uint256) {
        return getFTSOPrice(XRP_USD_FEED_ID);
    }

    /**
     * @dev Calculate dynamic pricing based on demand
     */
    function calculateDynamicPrice(
        uint256 basePrice, 
        uint256 demandMultiplier
    ) external view returns (uint256) {
        require(demandMultiplier >= 5000, "Demand multiplier too low"); // Min 0.5x
        require(demandMultiplier <= 30000, "Demand multiplier too high"); // Max 3.0x
        
        return (basePrice * demandMultiplier) / 10000;
    }

    // ========== FDC INTEGRATION FUNCTIONS ==========

    /**
     * @dev Verify XRPL payment using FDC
     */
    function verifyXRPLPayment(
        string memory xrplTxHash,
        address expectedSender,
        uint256 expectedAmount
    ) external view returns (bool) {
        // This would integrate with FDC to verify the XRPL transaction
        // For now, return true for valid-looking hashes
        bytes memory hashBytes = bytes(xrplTxHash);
        return hashBytes.length == 64; // Basic validation
    }

    /**
     * @dev Submit XRPL proof via FDC
     */
    function submitXRPLProof(
        bytes32 merkleRoot,
        bytes32[] memory proof,
        string memory txData
    ) external nonReentrant {
        // Verify merkle proof
        require(verifyMerkleProof(merkleRoot, proof, keccak256(bytes(txData))), "Invalid proof");
        
        // Parse transaction data and update booking status
        uint256 bookingId = parseBookingIdFromTxData(txData);
        Booking storage booking = bookings[bookingId];
        
        require(booking.status == BookingStatus.Created, "Invalid booking status");
        booking.status = BookingStatus.Confirmed;
        booking.xrplTxHash = txData;

        emit XRPLProofSubmitted(bookingId, merkleRoot, txData);
    }

    // ========== VIEW FUNCTIONS ==========

    /**
     * @dev Get booking details
     */
    function getBooking(uint256 bookingId) external view returns (Booking memory) {
        return bookings[bookingId];
    }

    /**
     * @dev Get bookings by guest
     */
    function getBookingsByGuest(address guest) external view returns (uint256[] memory) {
        return guestBookings[guest];
    }

    /**
     * @dev Get bookings by host
     */
    function getBookingsByHost(address host) external view returns (uint256[] memory) {
        return hostBookings[host];
    }

    /**
     * @dev Get escrow balance for a booking
     */
    function getEscrowBalance(uint256 bookingId) external view returns (uint256) {
        return bookings[bookingId].escrowBalance;
    }

    // ========== ADMIN FUNCTIONS ==========

    /**
     * @dev Set dispute window
     */
    function setDisputeWindow(uint256 newWindow) external onlyOwner {
        require(newWindow >= 1 days && newWindow <= 30 days, "Invalid dispute window");
        disputeWindow = newWindow;
    }

    /**
     * @dev Set auto-release delay
     */
    function setAutoReleaseDelay(uint256 newDelay) external onlyOwner {
        require(newDelay >= 1 hours && newDelay <= 7 days, "Invalid auto-release delay");
        autoReleaseDelay = newDelay;
    }

    /**
     * @dev Withdraw platform fees
     */
    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance - totalEscrowBalance;
        require(balance > 0, "No fees to withdraw");
        payable(owner()).transfer(balance);
    }

    /**
     * @dev Emergency pause
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause
     */
    function unpause() external onlyOwner {
        _unpause();
    }

    // ========== INTERNAL HELPER FUNCTIONS ==========

    function getFTSOPrice(bytes21 feedId) internal view returns (uint256) {
        IFTSOv2 ftso = IFTSOv2(FTSO_V2);
        try ftso.getFeedById(feedId) returns (IFTSOv2.FeedData memory feedData) {
            return uint256(int256(feedData.value)) * 10**(18 - uint256(int256(feedData.decimals)));
        } catch {
            return 0;
        }
    }

    function getLocationPriceMultiplier(uint256 propertyId) internal pure returns (uint256) {
        // Simple location-based pricing (would be more sophisticated in production)
        uint256 locationHash = uint256(keccak256(abi.encodePacked(propertyId))) % 5;
        if (locationHash == 0) return 2e18; // 2x for premium locations
        if (locationHash == 1) return 15e17; // 1.5x for good locations
        return 1e18; // 1x for standard locations
    }

    function calculateCancellationRefund(uint256 bookingId) internal view returns (uint256) {
        Booking storage booking = bookings[bookingId];
        uint256 totalPaid = booking.amount + booking.securityDeposit;
        
        if (block.timestamp < booking.checkInTime - 7 days) {
            return totalPaid; // Full refund
        } else if (block.timestamp < booking.checkInTime - 1 days) {
            return (totalPaid * 50) / 100; // 50% refund
        } else {
            return booking.securityDeposit; // Only security deposit refund
        }
    }

    function verifyMerkleProof(
        bytes32 root,
        bytes32[] memory proof,
        bytes32 leaf
    ) internal pure returns (bool) {
        bytes32 computedHash = leaf;
        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];
            if (computedHash <= proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }
        return computedHash == root;
    }

    function parseBookingIdFromTxData(string memory txData) internal pure returns (uint256) {
        // Simple parsing - in production would parse actual XRPL transaction data
        return 1; // Placeholder
    }

    receive() external payable {
        totalEscrowBalance += msg.value;
    }
}
