# 🧭 PathProof

**PathProof** is a decentralized, privacy-preserving supply chain tracking platform that uses **zk-SNARKs** to prove physical location checkpoints **without revealing raw GPS coordinates**. Built on **Ethereum Sepolia** with **Foundry**, powered by the **Poseidon hash function**, and deployed with a live React frontend — PathProof demonstrates real-world zero-knowledge cryptography beyond privacy coins.

🔗 **Live Demo:** [pathproof-sepolia.vercel.app](https://pathproof-sepolia.vercel.app)

---

## 📌 The Problem

Traditional supply chain tracking forces a difficult tradeoff:

- **Too transparent** — exposing exact GPS coordinates leaks sensitive facility locations, trade routes, and competitive intelligence
- **Too opaque** — unverifiable location claims can be forged, enabling counterfeit goods and compliance fraud

## 💡 The Solution: Zero-Knowledge Proof of Location (zkPoL)

PathProof uses **Groth16 zk-SNARKs** to let a prover demonstrate *"this product passed through an authorized checkpoint"* without revealing *"here is the exact location of that checkpoint."*

The proof is generated off-chain, stored on **IPFS**, and its hash is committed on-chain — giving you cryptographic authenticity with zero coordinate exposure.

---

## ✨ Features

- ✅ **zkPoL circuits** — Circom + SnarkJS (Groth16) with Poseidon hashing
- ✅ **On-chain verification** — custom Solidity verifier deployed on Sepolia
- ✅ **IPFS proof storage** — proofs stored off-chain, hashes anchored on-chain
- ✅ **QR-based checkpoint scanning** — scan product QR codes to trigger checkpoint updates
- ✅ **Full supply chain lifecycle** — create product → log checkpoints → verify provenance
- ✅ **Gas-optimized contracts** — built and tested with Foundry
- ✅ **TypeScript frontend** — React + TailwindCSS + Vite, wallet-connected via ethers.js

---

## 🌍 Real-World Applications

| Industry | Use Case |
|---|---|
| Pharmaceuticals | Preventing counterfeit medicines via verifiable origin |
| Luxury Goods | Proving genuine manufacture without leaking factory location |
| Food Safety | Farm-to-table checkpoint verification |
| Electronics | Component authenticity across complex supply chains |

---

## ⚙️ Tech Stack

| Layer | Stack |
|---|---|
| Smart Contracts | Solidity, Foundry (Forge + Anvil + Cast) |
| ZK Circuits | Circom, SnarkJS (Groth16), Poseidon hash |
| Frontend | React, TypeScript, TailwindCSS, Vite |
| Wallet / Chain | ethers.js, Ethereum Sepolia testnet |
| Storage | IPFS (Pinata / Web3.Storage) |
| Backend | Node.js + Express (proof generation server) |

---

## 📁 Project Structure

```
pathproof/
├── src/
│   ├── pages/           # UI pages: Create, Scan, Verify, History
│   ├── components/      # Reusable components (QRScanner, Header, etc.)
│   ├── services/        # IPFS, zkSNARK, blockchain, geolocation logic
│   ├── abis/            # Smart contract ABIs
│   ├── contracts/       # Solidity source (Verifier.sol, ProductRegistry.sol)
│   ├── layouts/         # Page layouts (MainLayout.tsx)
│   └── types/           # Custom TS types for Circom/SnarkJS
├── server/
│   ├── app.ts           # Express entry point
│   ├── routes/          # API endpoints (proof generation)
│   └── zkpol/           # Compiled circuit files, verifier, proof generator
├── script/
│   ├── Deploy.s.sol     # Foundry deployment script
│   └── ProductRegistry.sol
├── broadcast/           # Foundry broadcast logs
├── .env.example
├── foundry.toml
└── package.json
```

---

## 🧪 Metadata Format

Each checkpoint proof is stored as JSON on IPFS with the following schema:

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
        "proof": { "pi_a": [...], "pi_b": [...], "pi_c": [...] },
        "publicSignals": ["..."]
      }
    }
  ]
}
```

---

## 🛠️ Local Development

### Prerequisites

- [Foundry](https://book.getfoundry.sh/getting-started/installation)
- [Node.js](https://nodejs.org/) ≥ 18
- [Circom](https://docs.circom.io/getting-started/installation/)
- [SnarkJS](https://github.com/iden3/snarkjs) — `npm install -g snarkjs`
- Pinata or Web3.Storage API key (for IPFS)

### 1. Clone & Install

```bash
git clone https://github.com/jaiswalism/PathProof.git
cd PathProof
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Fill in: RPC_URL, PRIVATE_KEY, PINATA_API_KEY, CONTRACT_ADDRESS
```

### 3. Build & Deploy Contracts

```bash
# Build
forge build

# Start local chain (for local testing)
anvil

# Deploy to Sepolia (or local)
forge script script/Deploy.s.sol:DeployScript \
  --rpc-url $RPC_URL \
  --private-key $PRIVATE_KEY \
  --broadcast
```

### 4. ZK Circuit Setup

```bash
# Compile the circuit
circom circuits/zkpol.circom --r1cs --wasm --sym --c

# Powers of Tau ceremony
snarkjs powersoftau new bn128 14 pot14_0000.ptau -v
snarkjs powersoftau contribute pot14_0000.ptau pot14_final.ptau --name="Initial"

# Groth16 setup
snarkjs groth16 setup zkpol.r1cs pot14_final.ptau zkpol_0000.zkey
snarkjs zkey contribute zkpol_0000.zkey zkpol_final.zkey --name="ZK contributor"
snarkjs zkey export verificationkey zkpol_final.zkey verification_key.json

# Export Solidity verifier
snarkjs zkey export solidityverifier zkpol_final.zkey src/contracts/Verifier.sol
```

### 5. Start the Proof Server

```bash
cd server
npm install
npm run dev
```

### 6. Start the Frontend

```bash
# From project root
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and connect your wallet to Sepolia.

---

## 🔗 Deployment

| Component | URL |
|---|---|
| Frontend | [pathproof-sepolia.vercel.app](https://pathproof-sepolia.vercel.app) |
| Network | Ethereum Sepolia Testnet |

---

## ⚠️ License & Usage Notice

This project is intended solely for **educational and demonstration purposes**.  
Reproduction, duplication, or reuse of the codebase without explicit permission is strictly prohibited.

All rights reserved © 2025 Priya Jaiswal.