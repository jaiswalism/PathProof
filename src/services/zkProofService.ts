// import { generateZkProof } from "./generateZkProof";
import * as snarkjs from "snarkjs";
import { ethers } from "ethers";
import ProductRegistryABI from "../abis/ProductRegistry.json";

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;


/**
 * Converts snarkjs proof + publicSignals to Solidity format.
 */
export const parseProofForSolidity = async (proof: any, publicSignals: string[]) => {
  const calldataStr = await snarkjs.groth16.exportSolidityCallData(proof, publicSignals);

  const argv = calldataStr
    .replace(/["[\]\s]/g, "")
    .split(",")
    .map((x: string) => BigInt(x).toString());

  const a = [argv[0], argv[1]];
  const b = [
    [argv[2], argv[3]],
    [argv[4], argv[5]]
  ];
  const c = [argv[6], argv[7]];
  const input = argv.slice(8);

  return { a, b, c, input };
};

/**
 * Poseidon-based proof.
 */
export const generateProof = async (
  lat: number,
  lng: number,
  timestamp: number,
  deviceId: number,
  returnFull = false
): Promise<any> => {

  const res = await fetch("/api/proof", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ lat, lng, timestamp, deviceId }),
  });

  if (!res.ok) {
    const msg = await res.text();
    console.error("❌ Backend failed:", msg);
    throw new Error("Proof fetch failed");
  }

  let data;
  try {
    data = await res.json(); // 👈 This is where it may be stuck
  } catch (e) {
    console.error("❌ Failed to parse JSON:", e);
    throw new Error("Invalid JSON response from backend");
  }

  if (!data || !data.proof || !data.publicSignals) {
    console.error("❌ Invalid proof response:", data);
    throw new Error("zkProof server response malformed");
  }

  if (returnFull) return data;
  return data.publicSignals[0];
};


export const verifyCheckpointOnChain = async (
  productId: string,
  checkpointIndex: number,
  a: string[],
  b: string[][],
  c: string[],
  input: string[]
) => {
  if (!window.ethereum) throw new Error("Wallet not found");
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  const contract = new ethers.Contract(CONTRACT_ADDRESS, ProductRegistryABI, signer);

  const tx = await contract.verifyCheckpoint(productId, checkpointIndex, a, b, c, input);
  await tx.wait();
  return tx.hash;
};


/*
 *    ============ NO LONGER NEEDED ============
 *    Simulated function to verify a zkPoL proof
 *    Simulated hashing function
 */

export const verifyProof = async (
  proof: string,
  productId: string,
  checkpoint: string,
  location: string
): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return Math.random() > 0.05; // 95% success rate
};

const simulateHash = async (input: string): Promise<string> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  
  // Use SubtleCrypto for a more realistic hash if available
  if (window.crypto && window.crypto.subtle) {
    try {
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return `0x${hashHex}`;
    } catch (e) {
      // Fall back to simpler hash if SubtleCrypto fails
      console.warn('SubtleCrypto failed, using fallback hash', e);
    }
  }
  
  // Fallback simple hash
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  // Convert to hex string with 0x prefix
  return `0x${Math.abs(hash).toString(16).padStart(64, '0')}`;
};