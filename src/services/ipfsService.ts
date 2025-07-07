import pinataSDK from '@pinata/sdk';

// Load Pinata credentials from environment variables
const pinata = new pinataSDK(import.meta.env.VITE_PINATA_API_KEY,
  import.meta.env.VITE_PINATA_API_SECRET);

/**
 * Uploads a metadata JSON object to IPFS via Pinata.
 * @param metadata - JSON metadata object (e.g., product info)
 * @returns CID string from IPFS
 */
 export const uploadMetadata = async (metadata: any): Promise<string> => {
  const PINATA_JWT = import.meta.env.VITE_PINATA_API_KEY; // Use JWT token

  const response = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(metadata),
  });

  if (!response.ok) {
    console.error("Pinata upload failed", await response.text());
    throw new Error("Failed to upload metadata to Pinata");
  }

  const result = await response.json();
  return result.IpfsHash; // This is the CID
};


/**
 * Fetches metadata from IPFS using Pinata gateway and CID.
 * @param cid - IPFS CID
 * @returns Parsed JSON metadata object
 */
export const fetchMetadata = async (cid: string): Promise<any> => {
  try {
    const url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch metadata from IPFS (status: ${response.status})`);
    }
    return await response.json();
  } catch (error) {
    console.error('❌ Error fetching metadata from IPFS:', error);
    throw error;
  }
};
