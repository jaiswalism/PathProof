// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IZKVerifier {
    function verifyTx(uint256[2] memory a, uint256[2][2] memory b, uint256[2] memory c, uint256[] memory input)
        external
        view
        returns (bool);
}

contract ProductRegistry {
    struct Checkpoint {
        string location;
        uint256 timestamp;
        bytes32 proofHash;
        address[] witnesses;
        bool verified;
    }

    struct Product {
        string cid; // latest metadata CID
        Checkpoint[] checkpoints;
        bool isRegistered;
    }

    mapping(string => Product) public products;
    IZKVerifier public verifier;

    event ProductRegistered(string indexed productId, string cid);
    event CheckpointAdded(string indexed productId, uint256 index);
    event WitnessAdded(string indexed productId, uint256 checkpointIndex, address witness);
    event CheckpointVerified(string indexed productId, uint256 checkpointIndex);

    constructor(address verifierAddress) {
        verifier = IZKVerifier(verifierAddress);
    }

    function registerProduct(string memory productId, string memory initialCid) external {
        require(!products[productId].isRegistered, "Product already exists");
        products[productId].cid = initialCid;
        products[productId].isRegistered = true;
        emit ProductRegistered(productId, initialCid);
    }

    function addCheckpoint(string memory productId, string memory location, bytes32 proofHash, uint256 timestamp)
        external
    {
        require(products[productId].isRegistered, "Product not found");
        Checkpoint memory newCheckpoint = Checkpoint({
            location: location,
            timestamp: timestamp,
            proofHash: proofHash,
            witnesses: new address[](0),
            verified: false
        });
        products[productId].checkpoints.push(newCheckpoint);
        emit CheckpointAdded(productId, products[productId].checkpoints.length - 1);
    }

    function addWitness(string memory productId, uint256 checkpointIndex) external {
        require(products[productId].isRegistered, "Product not found");
        require(checkpointIndex < products[productId].checkpoints.length, "Invalid checkpoint");
        products[productId].checkpoints[checkpointIndex].witnesses.push(msg.sender);
        emit WitnessAdded(productId, checkpointIndex, msg.sender);
    }

    function verifyCheckpoint(
        string memory productId,
        uint256 checkpointIndex,
        uint256[2] memory a,
        uint256[2][2] memory b,
        uint256[2] memory c,
        uint256[] memory input
    ) external {
        require(products[productId].isRegistered, "Product not found");
        require(checkpointIndex < products[productId].checkpoints.length, "Invalid checkpoint");
        Checkpoint storage cp = products[productId].checkpoints[checkpointIndex];
        require(cp.witnesses.length >= 3, "Not enough witnesses");
        require(!cp.verified, "Already verified");

        bool isValid = verifier.verifyTx(a, b, c, input);
        require(isValid, "Invalid ZK proof");
        cp.verified = true;
        emit CheckpointVerified(productId, checkpointIndex);
    }

    function getCheckpointCount(string memory productId) external view returns (uint256) {
        return products[productId].checkpoints.length;
    }

    function getCheckpoint(string memory productId, uint256 checkpointIndex)
        external
        view
        returns (string memory, uint256, bytes32, address[] memory, bool)
    {
        Checkpoint memory cp = products[productId].checkpoints[checkpointIndex];
        return (cp.location, cp.timestamp, cp.proofHash, cp.witnesses, cp.verified);
    }

    function updateMetadataCID(string memory productId, string memory newCid) external {
        require(products[productId].isRegistered, "Product not found");
        products[productId].cid = newCid;
    }

    function getMetadataCID(string memory productId) external view returns (string memory) {
        return products[productId].cid;
    }
}
