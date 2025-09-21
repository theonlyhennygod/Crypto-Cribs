// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/PropertyEscrow.sol";
import "../src/PropertyNFT.sol";
import "../src/XRPLFlarebridge.sol";
import "../src/CryptoCribsBooking.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying Crypto Cribs 4-Contract Architecture...");

        // Deploy PropertyEscrow contract
        PropertyEscrow escrowContract = new PropertyEscrow();
        console.log("PropertyEscrow deployed at:", address(escrowContract));

        // Deploy PropertyNFT contract
        PropertyNFT nftContract = new PropertyNFT();
        console.log("PropertyNFT deployed at:", address(nftContract));

        // Deploy XRPLFlarebridge contract
        XRPLFlarebridge bridgeContract = new XRPLFlarebridge();
        console.log("XRPLFlarebridge deployed at:", address(bridgeContract));

        // Deploy main CryptoCribsBooking coordinator contract
        CryptoCribsBooking bookingContract = new CryptoCribsBooking(
            payable(address(escrowContract)),
            address(nftContract),
            payable(address(bridgeContract))
        );
        console.log("CryptoCribsBooking deployed at:", address(bookingContract));

        console.log("\n=== DEPLOYMENT SUMMARY ===");
        console.log("PropertyEscrow:     ", address(escrowContract));
        console.log("PropertyNFT:        ", address(nftContract));
        console.log("XRPLFlarebridge:    ", address(bridgeContract));
        console.log("CryptoCribsBooking: ", address(bookingContract));
        console.log("==========================");

        vm.stopBroadcast();
    }
}
