// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "script/ProductRegistry.sol";

// Mock verifier for deployment
contract DummyVerifier is IZKVerifier {
    function verifyTx(uint256[2] memory, uint256[2][2] memory, uint256[2] memory, uint256[] memory)
        external
        pure
        override
        returns (bool)
    {
        return true;
    }
}

contract DeployScript is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy a dummy ZK verifier (replace with real one in production)
        DummyVerifier verifier = new DummyVerifier();

        // Deploy ProductRegistry with verifier address
        ProductRegistry registry = new ProductRegistry(address(verifier));

        console2.log("ProductRegistry deployed at:", address(registry));
        console2.log("Verifier deployed at:", address(verifier));

        vm.stopBroadcast();
    }
}
