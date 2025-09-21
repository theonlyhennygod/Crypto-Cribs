// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";
import "./interfaces/IFTSOv2.sol";

/**
 * @title PropertyNFT
 * @dev Real World Asset (RWA) NFT contract for tokenizing real estate properties
 * Features property valuation, fractionalization, and revenue distribution
 */
contract PropertyNFT is ERC721, ERC721URIStorage, Ownable, ReentrancyGuard, Pausable {
    // Flare FTSO integration
    address public constant FTSO_V2 = 0xC4e9c78EA53db782E28f28Fdf80BaF59336B304d;
    
    // FTSO Feed IDs for real estate valuation
    bytes21 public constant USD_USD_FEED_ID = hex"015553440000000000000000000000000000000000";

    struct PropertyMetadata {
        string name;
        string description;
        string location;
        uint256 sqft;
        uint256 bedrooms;
        uint256 bathrooms;
        uint256 pricePerNight;
        bool isVerified;
        string[] amenities;
        string[] imageHashes;
        uint256 valuationUSD;
        uint256 lastValuationUpdate;
        uint256 qualityScore; // 1-100
        string propertyType; // "apartment", "house", "villa", etc.
    }

    struct PropertyShares {
        uint256 totalShares;
        mapping(address => uint256) ownerShares;
        address[] shareholders;
        uint256 totalRevenue;
        uint256 lastDistribution;
        bool isFragmentalized;
    }

    struct RentalListing {
        bool isListed;
        uint256 pricePerNight;
        bool available;
        uint256 totalBookings;
        uint256 totalRevenue;
        address[] authorizedManagers;
    }

    // State variables
    uint256 public nextTokenId = 1;
    uint256 public verificationFee = 0.1 ether;
    uint256 public platformFeePercentage = 250; // 2.5%
    
    mapping(uint256 => PropertyMetadata) public properties;
    mapping(uint256 => PropertyShares) public propertyShares;
    mapping(uint256 => RentalListing) public rentalListings;
    mapping(address => bool) public verifiers;
    mapping(uint256 => string[]) public propertyDocuments;
    mapping(uint256 => bool) public verificationStatus;
    mapping(address => uint256[]) public ownerProperties;
    mapping(string => uint256) public locationPriceIndex; // location => price per sqft
    mapping(address => bool) public authorizedContracts; // Allow other contracts to manage properties

    // Events
    event PropertyMinted(uint256 indexed tokenId, address indexed owner, string name, uint256 valuation);
    event PropertyVerified(uint256 indexed tokenId, address verifier);
    event PropertyValuationUpdated(uint256 indexed tokenId, uint256 oldValuation, uint256 newValuation);
    event PropertyFramentalized(uint256 indexed tokenId, uint256 totalShares);
    event SharesPurchased(uint256 indexed tokenId, address buyer, uint256 shares, uint256 price);
    event RevenueDistributed(uint256 indexed tokenId, uint256 totalAmount, uint256 shareholders);
    event PropertyListed(uint256 indexed tokenId, uint256 pricePerNight);
    event DocumentsSubmitted(uint256 indexed tokenId, uint256 documentCount);

    constructor() ERC721("CryptoCribsProperty", "CCP") Ownable(msg.sender) {
        // Initialize location price indices (mock data)
        locationPriceIndex["New York, NY"] = 500; // $500 per sqft
        locationPriceIndex["Los Angeles, CA"] = 400;
        locationPriceIndex["Miami, FL"] = 300;
        locationPriceIndex["Austin, TX"] = 200;
        locationPriceIndex["Denver, CO"] = 250;
    }

    // ========== PROPERTY MINTING FUNCTIONS ==========

    /**
     * @dev Mint a property NFT with metadata
     */
    function mintProperty(
        address to,
        string memory uri,
        PropertyMetadata memory metadata
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = nextTokenId++;
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        
        properties[tokenId] = metadata;
        properties[tokenId].lastValuationUpdate = block.timestamp;
        ownerProperties[to].push(tokenId);

        emit PropertyMinted(tokenId, to, metadata.name, metadata.valuationUSD);
        return tokenId;
    }

    /**
     * @dev Mint property with automatic valuation
     */
    function mintPropertyWithValuation(
        address to,
        PropertyMetadata memory metadata
    ) external payable nonReentrant returns (uint256) {
        require(msg.value >= verificationFee, "Insufficient verification fee");
        
        uint256 tokenId = nextTokenId++;
        
        // Calculate initial valuation
        uint256 valuation = calculatePropertyValue(
            metadata.sqft,
            metadata.location,
            metadata.qualityScore
        );
        
        metadata.valuationUSD = valuation;
        metadata.lastValuationUpdate = block.timestamp;
        
        _safeMint(to, tokenId);
        properties[tokenId] = metadata;
        ownerProperties[to].push(tokenId);

        // Initialize shares structure
        propertyShares[tokenId].totalShares = 1000000; // 1M shares = 100%
        propertyShares[tokenId].ownerShares[to] = 1000000;
        propertyShares[tokenId].shareholders.push(to);

        emit PropertyMinted(tokenId, to, metadata.name, valuation);
        return tokenId;
    }

    /**
     * @dev Update property metadata
     */
    function updatePropertyMetadata(
        uint256 tokenId,
        PropertyMetadata memory newMetadata
    ) external {
        require(_isAuthorizedToUpdate(tokenId, msg.sender), "Not authorized");
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        
        properties[tokenId] = newMetadata;
        properties[tokenId].lastValuationUpdate = block.timestamp;
    }

    /**
     * @dev Verify property (only verifiers)
     */
    function verifyProperty(uint256 tokenId, bytes32 verificationHash) external {
        require(verifiers[msg.sender], "Not authorized verifier");
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        
        properties[tokenId].isVerified = true;
        verificationStatus[tokenId] = true;
        
        emit PropertyVerified(tokenId, msg.sender);
    }

    // ========== FTSO VALUATION FUNCTIONS ==========

    /**
     * @dev Get current property valuation using FTSO data
     */
    function getPropertyValuation(uint256 tokenId) external view returns (uint256 valuationUSD) {
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        
        PropertyMetadata memory property = properties[tokenId];
        return calculatePropertyValue(property.sqft, property.location, property.qualityScore);
    }

    /**
     * @dev Update property valuation using current market data
     */
    function updatePropertyValuation(uint256 tokenId) external nonReentrant {
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        require(
            block.timestamp >= properties[tokenId].lastValuationUpdate + 1 days,
            "Valuation updated recently"
        );
        
        PropertyMetadata storage property = properties[tokenId];
        uint256 oldValuation = property.valuationUSD;
        
        uint256 newValuation = calculatePropertyValue(
            property.sqft,
            property.location,
            property.qualityScore
        );
        
        property.valuationUSD = newValuation;
        property.lastValuationUpdate = block.timestamp;
        
        emit PropertyValuationUpdated(tokenId, oldValuation, newValuation);
    }

    /**
     * @dev Get market price per square foot for location
     */
    function getMarketPricePerSqFt(string memory location) external view returns (uint256) {
        uint256 basePrice = locationPriceIndex[location];
        if (basePrice == 0) {
            basePrice = 150; // Default $150 per sqft
        }
        
        // Apply market conditions from FTSO (simplified)
        uint256 marketMultiplier = getMarketConditionMultiplier();
        return (basePrice * marketMultiplier) / 1e18;
    }

    /**
     * @dev Calculate property value using FTSO data
     */
    function calculatePropertyValue(
        uint256 sqft,
        string memory location,
        uint256 qualityScore
    ) public view returns (uint256) {
        uint256 pricePerSqFt = locationPriceIndex[location];
        if (pricePerSqFt == 0) {
            pricePerSqFt = 150; // Default
        }
        
        // Apply market conditions and quality score
        uint256 baseValue = sqft * pricePerSqFt;
        uint256 qualityMultiplier = (qualityScore * 1e18) / 100; // Convert to 18 decimals
        uint256 marketMultiplier = getMarketConditionMultiplier();
        
        return (baseValue * qualityMultiplier * marketMultiplier) / (1e18 * 1e18);
    }

    // ========== PROPERTY MANAGEMENT FUNCTIONS ==========

    /**
     * @dev List property for rent
     */
    function listPropertyForRent(uint256 tokenId, uint256 pricePerNight) external {
        require(_isAuthorizedToUpdate(tokenId, msg.sender), "Not authorized");
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        
        rentalListings[tokenId] = RentalListing({
            isListed: true,
            pricePerNight: pricePerNight,
            available: true,
            totalBookings: 0,
            totalRevenue: 0,
            authorizedManagers: new address[](0)
        });
        
        properties[tokenId].pricePerNight = pricePerNight;
        
        emit PropertyListed(tokenId, pricePerNight);
    }

    /**
     * @dev Unlist property from rental
     */
    function unlistProperty(uint256 tokenId) external {
        require(_isAuthorizedToUpdate(tokenId, msg.sender), "Not authorized");
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        
        rentalListings[tokenId].isListed = false;
        rentalListings[tokenId].available = false;
    }

    /**
     * @dev Update rental price
     */
    function updateRentalPrice(uint256 tokenId, uint256 newPrice) external {
        require(_isAuthorizedToUpdate(tokenId, msg.sender), "Not authorized");
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        require(rentalListings[tokenId].isListed, "Property not listed");
        
        rentalListings[tokenId].pricePerNight = newPrice;
        properties[tokenId].pricePerNight = newPrice;
    }

    /**
     * @dev Set property availability
     */
    function setPropertyAvailability(uint256 tokenId, bool available) external {
        require(_isAuthorizedToUpdate(tokenId, msg.sender), "Not authorized");
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        
        rentalListings[tokenId].available = available;
    }

    // ========== FRACTIONALIZATION FUNCTIONS ==========

    /**
     * @dev Fractionalize property into shares
     */
    function fractionalize(uint256 tokenId, uint256 shares) external nonReentrant {
        require(ownerOf(tokenId) == msg.sender, "Not property owner");
        require(!propertyShares[tokenId].isFragmentalized, "Already fractionalized");
        require(shares >= 1000 && shares <= 10000000, "Invalid share count");
        
        propertyShares[tokenId].totalShares = shares;
        propertyShares[tokenId].ownerShares[msg.sender] = shares;
        propertyShares[tokenId].shareholders.push(msg.sender);
        propertyShares[tokenId].isFragmentalized = true;
        
        emit PropertyFramentalized(tokenId, shares);
    }

    /**
     * @dev Buy fractional shares of property
     */
    function buyFraction(uint256 tokenId, uint256 shares) external payable nonReentrant {
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        require(propertyShares[tokenId].isFragmentalized, "Property not fractionalized");
        require(shares > 0, "Invalid share amount");
        
        uint256 sharePrice = calculateSharePrice(tokenId);
        uint256 totalCost = shares * sharePrice;
        require(msg.value >= totalCost, "Insufficient payment");
        
        address currentOwner = ownerOf(tokenId);
        require(propertyShares[tokenId].ownerShares[currentOwner] >= shares, "Not enough shares available");
        
        // Transfer shares
        propertyShares[tokenId].ownerShares[currentOwner] -= shares;
        propertyShares[tokenId].ownerShares[msg.sender] += shares;
        
        // Add to shareholders if new
        if (propertyShares[tokenId].ownerShares[msg.sender] == shares) {
            propertyShares[tokenId].shareholders.push(msg.sender);
        }
        
        // Transfer payment
        payable(currentOwner).transfer(totalCost);
        
        // Refund excess
        if (msg.value > totalCost) {
            payable(msg.sender).transfer(msg.value - totalCost);
        }
        
        emit SharesPurchased(tokenId, msg.sender, shares, totalCost);
    }

    /**
     * @dev Claim rental revenue (for shareholders)
     */
    function claimRentalRevenue(uint256 tokenId) external nonReentrant {
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        require(propertyShares[tokenId].ownerShares[msg.sender] > 0, "No shares owned");
        
        uint256 userShares = propertyShares[tokenId].ownerShares[msg.sender];
        uint256 totalShares = propertyShares[tokenId].totalShares;
        uint256 totalRevenue = rentalListings[tokenId].totalRevenue;
        
        uint256 userRevenue = (totalRevenue * userShares) / totalShares;
        require(userRevenue > 0, "No revenue to claim");
        
        // Reset user's claimable revenue
        rentalListings[tokenId].totalRevenue -= userRevenue;
        
        payable(msg.sender).transfer(userRevenue);
    }

    /**
     * @dev Distribute dividends to all shareholders
     */
    function distributeDividends(uint256 tokenId) external payable nonReentrant {
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        require(msg.value > 0, "No dividends to distribute");
        require(propertyShares[tokenId].isFragmentalized, "Property not fractionalized");
        
        uint256 totalShares = propertyShares[tokenId].totalShares;
        address[] memory shareholders = propertyShares[tokenId].shareholders;
        
        for (uint256 i = 0; i < shareholders.length; i++) {
            address shareholder = shareholders[i];
            uint256 shares = propertyShares[tokenId].ownerShares[shareholder];
            
            if (shares > 0) {
                uint256 dividend = (msg.value * shares) / totalShares;
                if (dividend > 0) {
                    payable(shareholder).transfer(dividend);
                }
            }
        }
        
        propertyShares[tokenId].lastDistribution = block.timestamp;
        emit RevenueDistributed(tokenId, msg.value, shareholders.length);
    }

    // ========== VIEW FUNCTIONS ==========

    /**
     * @dev Get property metadata
     */
    function getProperty(uint256 tokenId) external view returns (PropertyMetadata memory) {
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        return properties[tokenId];
    }

    /**
     * @dev Get ownership shares for an address
     */
    function getPropertyOwnershipShares(uint256 tokenId, address owner) external view returns (uint256) {
        return propertyShares[tokenId].ownerShares[owner];
    }

    /**
     * @dev Get total revenue for property
     */
    function getTotalRevenue(uint256 tokenId) external view returns (uint256) {
        return rentalListings[tokenId].totalRevenue;
    }

    /**
     * @dev Check if property is verified
     */
    function isPropertyVerified(uint256 tokenId) external view returns (bool) {
        return properties[tokenId].isVerified;
    }

    /**
     * @dev Get properties owned by address
     */
    function getPropertiesByOwner(address owner) external view returns (uint256[] memory) {
        return ownerProperties[owner];
    }

    // ========== VERIFICATION FUNCTIONS ==========

    /**
     * @dev Submit property documents
     */
    function submitPropertyDocuments(uint256 tokenId, string[] memory documentHashes) external {
        require(_isAuthorizedToUpdate(tokenId, msg.sender), "Not authorized");
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        
        propertyDocuments[tokenId] = documentHashes;
        emit DocumentsSubmitted(tokenId, documentHashes.length);
    }

    /**
     * @dev Approve property verification
     */
    function approvePropertyVerification(uint256 tokenId) external {
        require(verifiers[msg.sender], "Not authorized verifier");
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        
        properties[tokenId].isVerified = true;
        verificationStatus[tokenId] = true;
        
        emit PropertyVerified(tokenId, msg.sender);
    }

    /**
     * @dev Reject property verification
     */
    function rejectPropertyVerification(uint256 tokenId, string memory reason) external {
        require(verifiers[msg.sender], "Not authorized verifier");
        require(_ownerOf(tokenId) != address(0), "Property does not exist");
        
        properties[tokenId].isVerified = false;
        verificationStatus[tokenId] = false;
        
        // Could emit rejection event with reason
    }

    // ========== ADMIN FUNCTIONS ==========

    /**
     * @dev Add verifier
     */
    function addVerifier(address verifier) external onlyOwner {
        verifiers[verifier] = true;
    }

    /**
     * @dev Remove verifier
     */
    function removeVerifier(address verifier) external onlyOwner {
        verifiers[verifier] = false;
    }

    /**
     * @dev Set verification fee
     */
    function setVerificationFee(uint256 newFee) external onlyOwner {
        verificationFee = newFee;
    }

    /**
     * @dev Update location price index
     */
    function updateLocationPrice(string memory location, uint256 pricePerSqFt) external onlyOwner {
        locationPriceIndex[location] = pricePerSqFt;
    }

    /**
     * @dev Authorize a contract to manage properties
     */
    function authorizeContract(address contractAddress) external onlyOwner {
        authorizedContracts[contractAddress] = true;
    }

    /**
     * @dev Remove authorization from a contract
     */
    function unauthorizeContract(address contractAddress) external onlyOwner {
        authorizedContracts[contractAddress] = false;
    }

    // ========== INTERNAL FUNCTIONS ==========

    function _isAuthorizedToUpdate(uint256 tokenId, address user) internal view returns (bool) {
        return ownerOf(tokenId) == user || 
               propertyShares[tokenId].ownerShares[user] > 0 || 
               authorizedContracts[user];
    }

    function calculateSharePrice(uint256 tokenId) internal view returns (uint256) {
        uint256 propertyValue = properties[tokenId].valuationUSD;
        uint256 totalShares = propertyShares[tokenId].totalShares;
        return propertyValue / totalShares;
    }

    function getMarketConditionMultiplier() internal view returns (uint256) {
        // Simplified market condition based on timestamp (would use real FTSO data)
        uint256 timeVariation = (block.timestamp % 86400) * 1e18 / 86400; // 0-1e18 based on time of day
        return 8e17 + (timeVariation * 4e17 / 1e18); // 0.8x to 1.2x multiplier
    }

    // Override required functions
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function _update(address to, uint256 tokenId, address auth) internal override returns (address) {
        return super._update(to, tokenId, auth);
    }
}
