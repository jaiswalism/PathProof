// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../script/ProductRegistry.sol";

contract MockVerifier is IZKVerifier {
    function verifyTx(
        uint[2] memory,
        uint[2][2] memory,
        uint[2] memory,
        uint[] memory
    ) external pure override returns (bool) {
        return true;
    }
}

contract ProductRegistryTest is Test {
    ProductRegistry public registry;
    MockVerifier public mockVerifier;

    string public productId = "PROD123";
    string public initialCid = "QmInitialCID";

    function setUp() public {
        mockVerifier = new MockVerifier();
        registry = new ProductRegistry(address(mockVerifier));
    }

    function testRegisterProduct() public {
        registry.registerProduct(productId, initialCid);
    }

    function testAddCheckpoint() public {
        registry.registerProduct(productId, initialCid);
        registry.addCheckpoint(productId, "Mumbai", keccak256("proof"), block.timestamp);
    }

    function testAddWitness() public {
        registry.registerProduct(productId, initialCid);
        registry.addCheckpoint(productId, "Delhi", keccak256("proof"), block.timestamp);
        registry.addWitness(productId, 0);
        // Simulate 2 more witnesses
        vm.prank(address(0xBEEF));
        registry.addWitness(productId, 0);
        vm.prank(address(0xCAFE));
        registry.addWitness(productId, 0);
    }
function testVerifyCheckpoint() public {
    registry.registerProduct(productId, initialCid);
    registry.addCheckpoint(productId, "Chennai", keccak256("proof"), block.timestamp);
    
    // Add 3 witnesses
    registry.addWitness(productId, 0);
    vm.prank(address(0xBEEF));
    registry.addWitness(productId, 0);
    vm.prank(address(0xCAFE));
    registry.addWitness(productId, 0);

    // Dummy zkSNARK proof input
    uint[2] memory a = [uint(1), uint(2)];
    uint[2][2] memory b = [[uint(1), uint(2)], [uint(3), uint(4)]];
    uint[2] memory c = [uint(5), uint(6)];
    uint[] memory input = new uint[](1); // Initialize array with length 1
    input[0] = 7;

    registry.verifyCheckpoint(productId, 0, a, b, c, input);
}


    function testUpdateMetadataCID() public {
        registry.registerProduct(productId, initialCid);
        registry.updateMetadataCID(productId, "QmNewCID");
    }

    function testGetMetadataCID() public {
        registry.registerProduct(productId, initialCid);
        string memory cid = registry.getMetadataCID(productId);
        assertEq(cid, initialCid);
    }
}
