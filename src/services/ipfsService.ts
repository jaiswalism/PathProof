import { Web3Storage } from 'web3.storage';

// This is a placeholder API key. In a production app, this should be in environment variables
// and proper authentication should be implemented
const API_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDVGOWE0OEM2NzE1MEQyQjMxNDgzMjYwMkNCRTAzZkRhZEY1NUIyQmQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzEwMzM2MTc1MDYsIm5hbWUiOiJTaW11bGF0ZWQgS2V5In0.TEST_KEY_SIMULATE';

// For simulation purposes - typically you'd use the actual web3.storage client
class SimulatedWeb3Storage {
  constructor(private token: string) {}
  
  async put(files: File[]): Promise<string> {
    // Simulate a CID creation based on file content
    const randomCID = 'bafybeig' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    console.log('Uploaded files to IPFS with CID:', randomCID);
    return randomCID;
  }
  
  async get(cid: string): Promise<any> {
    console.log('Retrieved files from IPFS with CID:', cid);
    // This would normally return the files, but we'll simulate it
    return { 
      files: async () => [] 
    };
  }
}

// Factory function to create either a real or simulated client
const getClient = () => {
  try {
    // In a real application, we would use the actual Web3Storage client
    // return new Web3Storage({ token: API_TOKEN });
    
    // For the purpose of this demo, we'll use the simulated client
    return new SimulatedWeb3Storage(API_TOKEN);
  } catch (error) {
    console.error('Error creating Web3Storage client:', error);
    throw new Error('Failed to initialize IPFS client');
  }
};

// Upload JSON metadata to IPFS
export const uploadMetadata = async (metadata: any): Promise<string> => {
  try {
    const client = getClient();
    const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
    const file = new File([blob], 'metadata.json');
    const cid = await client.put([file]);
    return cid;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload metadata to IPFS');
  }
};

// Retrieve JSON metadata from IPFS
export const fetchMetadata = async (cid: string): Promise<any> => {
  try {
    // In a simulation, we'll return mock data based on the CID
    // In a real application, we would fetch the actual data from IPFS
    
    // Generate deterministic but random-looking data based on the CID
    const hashCode = (s: string) => {
      let h = 0;
      for(let i = 0; i < s.length; i++)
        h = Math.imul(31, h) + s.charCodeAt(i) | 0;
      return h;
    };
    
    const hash = hashCode(cid);
    
    // Simulate a delay to mimic network request
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      productId: `PROD-${Math.abs(hash % 10000)}`,
      name: `Product ${Math.abs(hash % 100)}`,
      batchNumber: `BATCH-${Math.abs(hash % 1000)}`,
      manufactureDate: new Date(Date.now() - Math.abs(hash % 30) * 24 * 60 * 60 * 1000).toISOString(),
      proofs: [
        {
          checkpoint: 'Manufacturing',
          timestamp: new Date(Date.now() - Math.abs(hash % 30) * 24 * 60 * 60 * 1000).toISOString(),
          location: 'Factory A, Singapore',
          proofHash: `0x${Math.abs(hash).toString(16).padStart(64, '0')}`,
        },
        // If the CID is "long enough", add more checkpoints
        ...(cid.length > 50 ? [
          {
            checkpoint: 'Distribution Center',
            timestamp: new Date(Date.now() - Math.abs(hash % 20) * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Warehouse B, Frankfurt',
            proofHash: `0x${Math.abs(hash * 2).toString(16).padStart(64, '0')}`,
          }
        ] : []),
        // If the CID contains more 'a's than 'b's, add another checkpoint
        ...((cid.match(/a/g) || []).length > (cid.match(/b/g) || []).length ? [
          {
            checkpoint: 'Retail Delivery',
            timestamp: new Date(Date.now() - Math.abs(hash % 10) * 24 * 60 * 60 * 1000).toISOString(),
            location: 'Store C, New York',
            proofHash: `0x${Math.abs(hash * 3).toString(16).padStart(64, '0')}`,
          }
        ] : []),
      ]
    };
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw new Error('Failed to fetch metadata from IPFS');
  }
};