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

    // First try to register the product
    try {
      const registerTx = await contract.registerProduct(productId, cid);
      await registerTx.wait();
      console.log(`✅ Product ${productId} registered with CID ${cid}`);
      return true;
    } catch (registerError: any) {
      const errorMessage = registerError?.error?.message || registerError?.message || "";

      // Check if the error is because the product already exists
      const alreadyExists = errorMessage.toLowerCase().includes("already exists");

      if (!alreadyExists) {
        throw registerError; // Rethrow if it's not the expected error
      }

      console.log(`ℹ️ Product already exists, updating CID...`);
    }

    // If registration failed because it already exists, update it
    const updateTx = await contract.updateMetadataCID(productId, cid);
    await updateTx.wait();
    console.log(`✅ Product ${productId} metadata updated with CID ${cid}`);
    return true;

  } catch (error) {
    console.error("❌ Blockchain operation failed:", error);
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


export const verifyCheckpointOnChain = async (
  productId: string,
  checkpointIndex: number,
  a: string[],
  b: string[][],
  c: string[],
  input: string[]
): Promise<boolean> => {
  try {
    const contract = await getContract();
    const tx = await contract.verifyCheckpoint(productId, checkpointIndex, a, b, c, input);
    await tx.wait();
    console.log("✅ Proof verified on-chain");
    return true;
  } catch (err) {
    console.error("❌ Failed to verify on-chain:", err);
    return false;
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
