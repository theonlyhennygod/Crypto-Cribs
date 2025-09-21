// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./PropertyEscrow.sol";
import "./PropertyNFT.sol";
import "./XRPLFlarebridge.sol";
import "./interfaces/IFTSOv2.sol";

/**
 * @title CryptoCribsBooking
 * @dev Main coordinator contract for Crypto Cribs travel platform
 * Integrates PropertyEscrow, PropertyNFT, and XRPLFlarebridge contracts
 */
contract CryptoCribsBooking is Ownable, ReentrancyGuard, Pausable {
    // Contract addresses
    PropertyEscrow public immutable escrowContract;
    PropertyNFT public immutable nftContract;
    XRPLFlarebridge public immutable bridgeContract;

    // Flare protocol addresses
    address public constant FTSO_V2 = 0xC4e9c78EA53db782E28f28Fdf80BaF59336B304d;
    bytes21 public constant XRP_USD_FEED_ID = hex"015852500000000000000000000000000000000000";

    // Minimal coordinator structs - delegate to specialized contracts
    struct PropertyRef {
        uint256 nftTokenId;
        uint256 escrowPropertyId;
    }

    enum BookingStatus {
        PENDING_PAYMENT,
        PAYMENT_VERIFIED,
        ACTIVE,
        COMPLETED,
        CANCELLED
    }

    // State variables - minimal coordinator state
    uint256 public nextPropertyId = 1;
    uint256 public platformFeePercentage = 250; // 2.5% in basis points

    mapping(uint256 => PropertyRef) public propertyRefs;
    mapping(address => uint256[]) public hostProperties;

    // Events
    event PropertyListed(
        uint256 indexed propertyId,
        address indexed owner,
        string name,
        uint256 pricePerNightUSD
    );

    event BookingCreated(
        uint256 indexed bookingId,
        uint256 indexed propertyId,
        address indexed guest,
        uint256 totalPriceUSD,
        uint256 totalPriceXRP
    );

    event PaymentVerified(
        uint256 indexed bookingId,
        bytes32 xrplTxHash,
        uint256 verifiedAmount
    );

    event BookingCompleted(uint256 indexed bookingId);

    constructor(
        address payable _escrowContract,
        address _nftContract,
        address payable _bridgeContract
    ) Ownable(msg.sender) {
        escrowContract = PropertyEscrow(_escrowContract);
        nftContract = PropertyNFT(_nftContract);
        bridgeContract = XRPLFlarebridge(_bridgeContract);
    }

    /**
     * @dev List a new property (creates NFT and sets up rental)
     */
    function listProperty(
        string memory _name,
        string memory _location,
        uint256 _pricePerNightUSD,
        string[] memory _amenities,
        uint256 _maxGuests
    ) external payable whenNotPaused {
        // Create property metadata for NFT
        PropertyNFT.PropertyMetadata memory metadata = PropertyNFT.PropertyMetadata({
            name: _name,
            description: "Crypto Cribs Property",
            location: _location,
            sqft: 1000, // Default - could be parameter
            bedrooms: 2, // Default - could be parameter
            bathrooms: 1, // Default - could be parameter
            pricePerNight: _pricePerNightUSD,
            isVerified: false,
            amenities: _amenities,
            imageHashes: new string[](0),
            valuationUSD: 0,
            lastValuationUpdate: 0,
            qualityScore: 80, // Default quality score
            propertyType: "apartment"
        });
        
        // Mint property NFT
        uint256 tokenId = nftContract.mintPropertyWithValuation{value: msg.value}(msg.sender, metadata);
        
        // List for rental
        nftContract.listPropertyForRent(tokenId, _pricePerNightUSD);
        
        // Store property reference
        uint256 propertyId = nextPropertyId++;
        propertyRefs[propertyId] = PropertyRef({
            nftTokenId: tokenId,
            escrowPropertyId: propertyId
        });
        
        hostProperties[msg.sender].push(propertyId);
        
        emit PropertyListed(propertyId, msg.sender, _name, _pricePerNightUSD);
    }

    /**
     * @dev Create a booking using escrow contract
     */
    function createBooking(
        uint256 _propertyId,
        uint256 _checkIn,
        uint256 _checkOut
    ) external payable nonReentrant whenNotPaused {
        PropertyRef storage propRef = propertyRefs[_propertyId];
        require(propRef.nftTokenId != 0, "Property does not exist");
        
        // Delegate to escrow contract
        escrowContract.createBooking{value: msg.value}(_propertyId, _checkIn, _checkOut);
        
        emit BookingCreated(_propertyId, _propertyId, msg.sender, 0, msg.value);
    }

    /**
     * @dev Delegate XRPL payment verification to bridge contract
     */
    function verifyXRPLPayment(
        string memory xrplTxHash,
        address expectedSender,
        uint256 expectedAmount
    ) external view returns (bool) {
        return bridgeContract.verifyXRPLTransaction(xrplTxHash, expectedSender, expectedAmount);
    }

    /**
     * @dev Get current XRP/USD price from FTSOv2
     */
    function getXRPPrice() public view returns (uint256) {
        IFTSOv2 ftso = IFTSOv2(FTSO_V2);
        
        try ftso.getFeedById(XRP_USD_FEED_ID) returns (IFTSOv2.FeedData memory feedData) {
            if (feedData.decimals < 0) {
                return uint256(uint32(feedData.value)) / (10 ** uint8(-feedData.decimals));
            } else {
                return uint256(uint32(feedData.value)) * (10 ** uint8(feedData.decimals));
            }
        } catch {
            return 0; // Return 0 if price fetch fails
        }
    }

    // ========== DELEGATION FUNCTIONS ==========

    /**
     * @dev Get booking details from escrow contract
     */
    function getBooking(uint256 _bookingId) external view returns (PropertyEscrow.Booking memory) {
        return escrowContract.getBooking(_bookingId);
    }

    /**
     * @dev Get property details from NFT contract
     */
    function getProperty(uint256 _propertyId) external view returns (PropertyNFT.PropertyMetadata memory) {
        PropertyRef storage propRef = propertyRefs[_propertyId];
        return nftContract.getProperty(propRef.nftTokenId);
    }

    /**
     * @dev Get user's bookings from escrow contract
     */
    function getUserBookings(address _user) external view returns (uint256[] memory) {
        return escrowContract.getBookingsByGuest(_user);
    }

    /**
     * @dev Get host's properties
     */
    function getHostProperties(address _host) external view returns (uint256[] memory) {
        return hostProperties[_host];
    }

    /**
     * @dev Update platform fee (only owner)
     */
    function setPlatformFee(uint256 _feePercentage) external onlyOwner {
        require(_feePercentage <= 1000, "Fee cannot exceed 10%"); // Max 10%
        platformFeePercentage = _feePercentage;
    }

    /**
     * @dev Toggle property availability (delegate to NFT contract)
     */
    function togglePropertyAvailability(uint256 _propertyId, bool available) external {
        PropertyRef storage propRef = propertyRefs[_propertyId];
        nftContract.setPropertyAvailability(propRef.nftTokenId, available);
    }

    /**
     * @dev Emergency pause (only owner)
     */
    function pause() external onlyOwner {
        _pause();
    }

    /**
     * @dev Unpause (only owner)
     */
    function unpause() external onlyOwner {
        _unpause();
    }
}
