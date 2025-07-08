import { BrowserProvider, Contract } from "ethers";
import ProductRegistryABI from "../abis/ProductRegistry.json";

// ✅ Contract deployed to Sepolia
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as string;

/**
 * 🌐 Get MetaMask-injected provider
 */
const getProvider = (): BrowserProvider => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }
  return new BrowserProvider(window.ethereum);
};

/**
 * 🧠 Return connected contract instance
 */
const getContract = async (): Promise<Contract> => {
  const provider = getProvider();
  const signer = await provider.getSigner();
  return new Contract(CONTRACT_ADDRESS, ProductRegistryABI as any, signer);
};

/**
 * ⬆️ Register or update product CID on-chain
 */
export const updateProductCID = async (
  productId: string,
  cid: string
): Promise<boolean> => {
  try {
    const contract = await getContract();
    const tx = await contract.updateMetadataCID(productId, cid); // ✅ Correct method
    await tx.wait();
    console.log(`✅ Blockchain updated for ${productId} with CID ${cid}`);
    return true;
  } catch (error) {
    console.error("❌ Blockchain update failed:", error);
    return false;
  }
};


/**
 * 🔽 Retrieve current CID from blockchain
 */
export const getProductCID = async (
  productId: string
): Promise<string | null> => {
  try {
    const contract = await getContract();
    const cid: string = await contract.getMetadataCID(productId);
    return cid;
  } catch (error) {
    console.error("❌ Failed to get product CID:", error);
    return null;
  }
};

/**
 * 🆔 Generate unique product ID
 */
export const generateProductId = (): string => {
  const prefix = "PROD";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${prefix}-${timestamp}-${random}`;
};
