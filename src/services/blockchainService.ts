import { BrowserProvider, Contract } from "ethers";
import ProductRegistryABI from "../abis/ProductRegistry.json";

// ✅ Make sure this is correctly set in your .env file as VITE_CONTRACT_ADDRESS
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS as string;

// MetaMask provider
const getProvider = (): BrowserProvider => {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }
  return new BrowserProvider(window.ethereum);
};

// Smart contract instance
const getContract = async (): Promise<Contract> => {
  const provider = getProvider();
  const signer = await provider.getSigner();
  return new Contract(CONTRACT_ADDRESS, ProductRegistryABI as any, signer);
};

/**
 * ⬆️ Updates a product's CID on the blockchain using `registerProduct(string id, string cid)`
 */
export const updateProductCID = async (
  productId: string,
  cid: string
): Promise<boolean> => {
  try {
    const contract = await getContract();
    const tx = await contract.registerProduct(productId, cid); // 🔁 Use correct contract method
    await tx.wait();
    console.log(`✅ Blockchain updated for ${productId} with CID ${cid}`);
    return true;
  } catch (error) {
    console.error("❌ Blockchain update failed:", error);
    return false;
  }
  
};

/**
 * 🔽 Retrieves CID from the chain using `getMetadataCID(string id)`
 */
export const getProductCID = async (
  productId: string
): Promise<string | null> => {
  try {
    const contract = await getContract();
    const cid: string = await contract.getMetadataCID(productId); // 🔁 Use correct read method
    return cid;
  } catch (error) {
    console.error("❌ Failed to get product CID:", error);
    return null;
  }
};

/**
 * 🆔 Generates a unique product ID like `PROD-492233-1983`
 */
export const generateProductId = (): string => {
  const prefix = "PROD";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
  return `${prefix}-${timestamp}-${random}`;
};
