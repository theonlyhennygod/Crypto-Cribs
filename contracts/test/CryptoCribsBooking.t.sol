// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/CryptoCribsBooking.sol";
import "../src/PropertyEscrow.sol";
import "../src/PropertyNFT.sol";
import "../src/XRPLFlarebridge.sol";

contract CryptoCribsBookingTest is Test {
    CryptoCribsBooking public booking;
    PropertyEscrow public escrow;
    PropertyNFT public nft;
    XRPLFlarebridge public bridge;
    address public owner;
    address public host;
    address public guest;

    function setUp() public {
        owner = address(this);
        host = makeAddr("host");
        guest = makeAddr("guest");
        
        // Deploy specialized contracts first
        escrow = new PropertyEscrow();
        nft = new PropertyNFT();
        bridge = new XRPLFlarebridge();
        
        // Deploy coordinator
        booking = new CryptoCribsBooking(
            payable(address(escrow)),
            address(nft),
            payable(address(bridge))
        );
        
        // Authorize the booking contract to manage properties
        nft.authorizeContract(address(booking));
    }

    function testListProperty() public {
        vm.prank(host);
        vm.deal(host, 1 ether); // Give host some ETH for verification fee
        
        string[] memory amenities = new string[](3);
        amenities[0] = "WiFi";
        amenities[1] = "Pool";
        amenities[2] = "Kitchen";

        booking.listProperty{value: 0.1 ether}(
            "Luxury Beach Villa",
            "Maldives",
            50000, // $500.00 per night
            amenities,
            8
        );

        // Test that property was created (check host properties)
        uint256[] memory hostProperties = booking.getHostProperties(host);
        assertEq(hostProperties.length, 1);
        assertEq(hostProperties[0], 1);
    }

    function testCreateBooking() public {
        // First create a property
        vm.prank(host);
        vm.deal(host, 1 ether);
        
        string[] memory amenities = new string[](2);
        amenities[0] = "WiFi";
        amenities[1] = "Pool";

        booking.listProperty{value: 0.1 ether}(
            "Test Property",
            "Test Location",
            30000, // $300.00 per night
            amenities,
            4
        );
        
        // Now test booking creation
        vm.prank(guest);
        vm.deal(guest, 1 ether);
        
        uint256 checkIn = block.timestamp + 86400; // Tomorrow
        uint256 checkOut = checkIn + (86400 * 3); // 3 nights
        
        // This should work with the new architecture
        booking.createBooking{value: 0.1 ether}(
            1,
            checkIn,
            checkOut
        );
    }

    function testGetUserBookings() public {
        uint256[] memory userBookings = booking.getUserBookings(guest);
        assertEq(userBookings.length, 0);
    }

    function testGetHostProperties() public {
        uint256[] memory hostProperties = booking.getHostProperties(host);
        assertEq(hostProperties.length, 0);
    }

    function testTogglePropertyAvailability() public {
        // First create a property
        vm.prank(host);
        vm.deal(host, 1 ether);
        
        string[] memory amenities = new string[](1);
        amenities[0] = "WiFi";

        booking.listProperty{value: 0.1 ether}(
            "Test Property",
            "Test Location",
            25000,
            amenities,
            2
        );
        
        // Test availability toggle (delegates to NFT contract)
        vm.prank(host);
        booking.togglePropertyAvailability(1, false);
        
        // Test passes if no revert
        assertTrue(true);
    }

    function testSetPlatformFee() public {
        booking.setPlatformFee(300); // 3%
        
        // Test that fee over 10% is rejected
        vm.expectRevert("Fee cannot exceed 10%");
        booking.setPlatformFee(1100); // 11%
    }

    function testPauseUnpause() public {
        booking.pause();
        
        // Should revert when paused
        vm.prank(guest);
        vm.deal(guest, 1 ether);
        vm.expectRevert();
        booking.createBooking{value: 0.1 ether}(1, block.timestamp + 86400, block.timestamp + 172800);
        
        booking.unpause();
        
        // Should work after unpause (but will still fail due to missing property)
        vm.prank(guest);
        vm.expectRevert("Property does not exist");
        booking.createBooking{value: 0.1 ether}(1, block.timestamp + 86400, block.timestamp + 172800);
    }
}
