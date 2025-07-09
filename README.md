# 🧭 PathProof

**PathProof** is a decentralized, privacy-preserving supply chain tracking platform that leverages **zk-SNARKs** and **IPFS** to prove physical location checkpoints **without revealing raw coordinates**. Built on **Ethereum** with **Foundry** and powered by the **Poseidon hash**, this project showcases verifiable proof-of-location without compromising privacy.

---

## ✨ Features

- ✅ Zero-knowledge proof of location (zkPoL) using Circom + Groth16
- ✅ Proofs stored off-chain (IPFS) with hashes on-chain (EVM)
- ✅ On-chain verification via custom Solidity Verifier
- ✅ End-to-end supply chain updates with checkpointing
- ✅ Gas-optimized smart contracts via Foundry
- ✅ zkSNARK-compatible Poseidon hashing
- ✅ Integrated frontend with QR scan, location verification, IPFS sync

---

## 🔍 The Problem & Solution

### Why zkPoL (Zero-Knowledge Proof of Location)?

Traditional supply chain tracking faces a critical dilemma:
- **Too much transparency**: Revealing exact GPS coordinates exposes sensitive business locations, trade routes, and competitive advantages
- **Too little verification**: Simple location claims lack cryptographic proof and can be easily forged or manipulated

### How PathProof Solves This

PathProof bridges this gap using **zero-knowledge proofs** to enable companies to prove "yes, this product was at our authorized facility" without revealing "here's exactly where our facility is located."

**Key Benefits:**
- ✅ **Verifiable authenticity** without location exposure
- ✅ **Cryptographic proof** that can't be forged
- ✅ **Privacy-preserving** for sensitive business operations
- ✅ **Regulatory compliance** with location verification requirements

### Real-World Applications
- **Pharmaceutical supply chains** (preventing counterfeit medicines)
- **Luxury goods authentication** (proving genuine origin)
- **Food safety tracking** (farm-to-table verification)
- **Electronics manufacturing** (component authenticity)

This demonstrates a practical application of zero-knowledge cryptography beyond privacy coins, showing how zk-SNARKs can enable new forms of verifiable business processes.

---
2. Alternative: Create a dedicated section before "Tech Stack"
You could also place it as a standalone section called "🚀 Why Choose PathProof?" right before the Tech Stack section for better flow.
This placement works well because it:

Comes after the feature overview (so readers know what it does)
Comes before the technical details (so they understand the motivation)
Provides context for why the complex tech stack is necessary

Would you like me to help you refine the wording or placement further?RetryClaude does not have the ability to run the code it generates yet.Claude can make mistakes. Please double-check responses.

---

## ⚙️ Tech Stack

| Layer | Stack |
|------|-------|
| Smart Contracts | [Foundry](https://book.getfoundry.sh/), Solidity, Poseidon hash |
| zk Circuits | Circom, SnarkJS (Groth16 setup) |
| Frontend | React + TypeScript + TailwindCSS |
| Storage | IPFS (via Pinata or Web3.Storage) |
| Tools | Anvil (local node), Cast (EVM utils), Forge (testing/building) |

---

## 📁 Project Structure

### Root Stucture
```bash
jaiswalism-pathproof/
├── src/
├── server/
├── script/
├── broadcast/
├── cache/
├── .env.example
├── foundry.toml
├── README.md
├── package.json

```

### src/
```bash
src/
├── pages/           # UI pages: Create, Scan, Verify, etc.
├── components/      # Reusable UI components (QRScanner, Header, etc.)
├── services/        # Logic for IPFS, zkSNARKs, blockchain, geolocation
├── abis/            # Smart contract ABIs (ProductRegistry.json)
├── contracts/       # Solidity sources (Verifier.sol, Registry.sol)
├── layouts/         # Page layouts (e.g., MainLayout.tsx)
└── types/           # Custom TS types for Circom, SnarkJS, etc.
```

### server/
```bash
server/
├── app.ts                 # Express app entry
├── routes/                # API endpoints (zkProof, generation)
└── zkpol/                 # Compiled circuit files, verifier, proof generator
```

### script/
```bash
script/
├── Deploy.s.sol          # Foundry deployment script
├── ProductRegistry.sol   
```


---

## 🧪 📄 Metadata Format
```json
{
  "productId": "PROD-123456",
  "name": "Genuine Medicine",
  "batchNumber": "BATCH-001",
  "manufactureDate": "2025-07-01",
  "proofs": [
    {
      "checkpoint": "Factory",
      "timestamp": 1752000000,
      "location": "Jaipur, India",
      "proofHash": "123abc...",
      "zkProof": {
        "proof": { ... },
        "publicSignals": [ ... ]
      }
    }
  ]
}
```

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Node.js](https://nodejs.org/)
- [SnarkJS](https://github.com/iden3/snarkjs)
- [Circom](https://docs.circom.io/getting-started/installation/)
- Pinata / Web3.Storage API key for IPFS

---

## 🛠️ Usage

### 🧱 Smart Contracts

#### Build Contracts
```bash
forge build
```

#### Deploy Contracts
```bash
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url <YOUR_RPC_URL> \
  --private-key <YOUR_PRIVATE_KEY> \
  --broadcast
```

---

### 📦 Start Local Chain
```bash
anvil
```
Use the Anvil private key + endpoint for local testing.

--- 

### 🔐 Zero-Knowledge Setup

1. Compile the Circuit
```bash
circom circuits/zkpol.circom --r1cs --wasm --sym --c
```
2. Setup Powers of Tau
```bash
snarkjs powersoftau new bn128 14 pot14_0000.ptau -v
snarkjs powersoftau contribute pot14_0000.ptau pot14_final.ptau --name="Initial contribution"
```

3. Generate Proving & Verification Keys
```bash
snarkjs groth16 setup zkpol.r1cs pot14_final.ptau zkpol_0000.zkey
snarkjs zkey contribute zkpol_0000.zkey zkpol_final.zkey --name="ZK contributor"
snarkjs zkey export verificationkey zkpol_final.zkey verification_key.json
```


4. Export Solidity Verifier
```bash
snarkjs zkey export solidityverifier zkpol_final.zkey contracts/Verifier.sol
```

---

### ⚠️ License & Usage Notice
This project is intended solely for educational and demonstration purposes.
Reproduction, duplication, or reuse of the codebase without explicit permission is strictly prohibited.

All rights reserved © 2025.
