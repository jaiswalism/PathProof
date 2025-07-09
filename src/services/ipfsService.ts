
/**
 * Uploads a metadata JSON object to IPFS via Pinata.
 * @param metadata - JSON metadata object (e.g., product info)
 * @returns CID string from IPFS
 */
 export const uploadMetadata = async (metadata: any): Promise<string> => {
  const PINATA_JWT = import.meta.env.VITE_PINATA_JWT_TOKEN; // Use JWT token

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
  console.log("✅ Uploaded to IPFS CID:", result.IpfsHash);
};




/**
 * Fetches metadata from IPFS using Pinata gateway and CID.
 * @param cid - IPFS CID
 * @returns Parsed JSON metadata object
 */
export const fetchMetadata = async (cid: string): Promise<any> => {
  const gateways = [
    `https://gateway.pinata.cloud/ipfs/${cid}`,
    `https://ipfs.io/ipfs/${cid}`,
    `https://cloudflare-ipfs.com/ipfs/${cid}`,
  ];

  for (const gateway of gateways) {
    try {
      const res = await fetch(gateway);
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn(`⚠️ Fetch failed at ${gateway}`, e);
    }
  }

  throw new Error(`❌ Failed to fetch metadata from IPFS from all known gateways`);
};
