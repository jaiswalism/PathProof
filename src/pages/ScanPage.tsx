import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Upload, MapPin, Clock, Loader2 } from 'lucide-react';

import QRScanner from '../components/QRScanner';
import { getProductCID } from '../services/blockchainService';
import { fetchMetadata, uploadMetadata } from '../services/ipfsService';
import { generateProof } from '../services/zkProofService';
import { updateProductCID } from '../services/blockchainService';

interface ProductMetadata {
  productId: string;
  name: string;
  batchNumber: string;
  manufactureDate: string;
  proofs: Array<{
    checkpoint: string;
    timestamp: string;
    location: string;
    proofHash: string;
  }>;
}

const ScanPage: React.FC = () => {
  const [productId, setProductId] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ProductMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkpointData, setCheckpointData] = useState({
    checkpoint: '',
    location: '',
  });
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleScan = async (scannedData: string) => {
    if (!scannedData) return;
    
    setProductId(scannedData);
    setLoading(true);
    setMetadata(null);
    setSuccess(false);
    
    try {
      toast.loading('Retrieving product data...', { id: 'fetch' });
      
      // Get CID from blockchain
      const cid = await getProductCID(scannedData);
      
      if (!cid) {
        toast.error('Product not found on blockchain', { id: 'fetch' });
        return;
      }
      
      // Fetch metadata from IPFS
      const productMetadata = await fetchMetadata(cid);
      setMetadata(productMetadata);
      
      toast.success('Product data retrieved successfully', { id: 'fetch' });
    } catch (error) {
      console.error('Error fetching product data:', error);
      toast.error('Failed to retrieve product data', { id: 'fetch' });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCheckpointData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!metadata || !productId) return;
    
    if (!checkpointData.checkpoint || !checkpointData.location) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setUpdating(true);
    
    try {
      // Generate new zkPoL proof
      toast.loading('Generating proof of location...', { id: 'proof' });
      const proofHash = await generateProof(
        productId,
        checkpointData.checkpoint,
        checkpointData.location
      );
      toast.success('Proof generated successfully', { id: 'proof' });
      
      // Update metadata with new proof
      const updatedMetadata = {
        ...metadata,
        proofs: [
          ...metadata.proofs,
          {
            checkpoint: checkpointData.checkpoint,
            timestamp: new Date().toISOString(),
            location: checkpointData.location,
            proofHash: proofHash,
          }
        ]
      };
      
      // Upload updated metadata to IPFS
      toast.loading('Updating IPFS metadata...', { id: 'ipfs' });
      const newCid = await uploadMetadata(updatedMetadata);
      toast.success('Metadata updated on IPFS', { id: 'ipfs' });
      
      // Update blockchain record
      toast.loading('Updating blockchain record...', { id: 'blockchain' });
      await updateProductCID(productId, newCid);
      toast.success('Blockchain record updated', { id: 'blockchain' });
      
      // Update local state
      setMetadata(updatedMetadata);
      setCheckpointData({ checkpoint: '', location: '' });
      setSuccess(true);
      
      toast.success('Product journey updated successfully');
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error('Failed to update product journey');
    } finally {
      setUpdating(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-center">Scan & Update Product</h1>
        
        <div className="card mb-8">
          <h2 className="mb-6 text-xl font-semibold">Scan Product QR Code</h2>
          <QRScanner onScan={handleScan} />
        </div>
        
        {loading && (
          <div className="card flex flex-col items-center justify-center py-12">
            <Loader2 size={48} className="mb-4 animate-spin text-teal-600" />
            <p className="text-lg text-slate-600">Retrieving product data...</p>
          </div>
        )}
        
        {metadata && !loading && (
          <div className="card mt-8">
            <h2 className="mb-6 text-xl font-semibold">Product Information</h2>
            
            <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500">Product ID</p>
                <p className="font-medium">{metadata.productId}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Product Name</p>
                <p className="font-medium">{metadata.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Batch Number</p>
                <p className="font-medium">{metadata.batchNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Manufacture Date</p>
                <p className="font-medium">
                  {new Date(metadata.manufactureDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            
            <div className="mb-8">
              <h3 className="mb-4 text-lg font-medium">Current Journey</h3>
              <div className="relative pl-8">
                <div className="timeline-line"></div>
                {metadata.proofs.map((proof, index) => (
                  <div key={index} className="mb-6 relative">
                    <div className="timeline-dot absolute -left-6 top-0"></div>
                    <div className="rounded-lg bg-slate-50 p-4">
                      <h4 className="mb-2 font-semibold">{proof.checkpoint}</h4>
                      <div className="mb-2 flex items-center text-sm text-slate-600">
                        <Clock size={16} className="mr-2" />
                        {new Date(proof.timestamp).toLocaleString()}
                      </div>
                      <div className="flex items-center text-sm text-slate-600">
                        <MapPin size={16} className="mr-2" />
                        {proof.location}
                      </div>
                      <div className="mt-2 overflow-hidden overflow-ellipsis text-xs text-slate-500">
                        <span className="font-mono">{proof.proofHash.substring(0, 18)}...</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {success ? (
              <div className="rounded-lg bg-green-50 p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-green-100 p-3">
                    <Check size={32} className="text-green-600" />
                  </div>
                </div>
                <h3 className="mb-2 text-lg font-semibold text-green-800">
                  Product Updated Successfully
                </h3>
                <p className="text-green-700">
                  The product journey has been updated on the blockchain
                </p>
                <button
                  className="btn btn-primary mt-4"
                  onClick={() => setSuccess(false)}
                >
                  Add Another Checkpoint
                </button>
              </div>
            ) : (
              <div>
                <h3 className="mb-4 text-lg font-medium">Add New Checkpoint</h3>
                <form onSubmit={handleUpdate}>
                  <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="checkpoint" className="mb-2 block font-medium text-slate-700">
                        Checkpoint Name
                      </label>
                      <input
                        type="text"
                        id="checkpoint"
                        name="checkpoint"
                        className="input w-full"
                        value={checkpointData.checkpoint}
                        onChange={handleInputChange}
                        placeholder="e.g., Distribution Center"
                        disabled={updating}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="location" className="mb-2 block font-medium text-slate-700">
                        Location
                      </label>
                      <input
                        type="text"
                        id="location"
                        name="location"
                        className="input w-full"
                        value={checkpointData.location}
                        onChange={handleInputChange}
                        placeholder="e.g., Warehouse B, Frankfurt"
                        disabled={updating}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={updating}
                    >
                      {updating ? (
                        <>
                          <Loader2 size={20} className="mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Upload size={20} className="mr-2" />
                          Update Product Journey
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Import Check icon for success state
import { Check } from 'lucide-react';

export default ScanPage;