import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Shield, ChevronRight, Loader2, Package, Clock, MapPin, BadgeCheck } from 'lucide-react';

import QRScanner from '../components/QRScanner';
import { getProductCID } from '../services/blockchainService';
import { fetchMetadata } from '../services/ipfsService';
import { verifyProof } from '../services/zkProofService';

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

const VerifyPage: React.FC = () => {
  const [productId, setProductId] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<ProductMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  
  const handleScan = async (scannedData: string) => {
    if (!scannedData) return;
    
    setProductId(scannedData);
    setLoading(true);
    setMetadata(null);
    setVerified(false);
    
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
  
  const handleVerify = async () => {
    if (!metadata || !productId) return;
    
    setVerifying(true);
    
    try {
      toast.loading('Verifying product journey...', { id: 'verify' });
      
      // Verify each proof in the chain
      const verificationPromises = metadata.proofs.map(proof => 
        verifyProof(
          proof.proofHash,
          productId,
          proof.checkpoint,
          proof.location
        )
      );
      
      const results = await Promise.all(verificationPromises);
      const allVerified = results.every(result => result === true);
      
      if (allVerified) {
        toast.success('Product journey verified successfully', { id: 'verify' });
        setVerified(true);
      } else {
        toast.error('Verification failed - some proofs are invalid', { id: 'verify' });
        setVerified(false);
      }
    } catch (error) {
      console.error('Error verifying product:', error);
      toast.error('Failed to verify product journey', { id: 'verify' });
    } finally {
      setVerifying(false);
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return dateString;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-center">Verify Product Authenticity</h1>
        
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
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Product Information</h2>
              
              {verified ? (
                <div className="flex items-center rounded-full bg-green-100 px-4 py-1 text-green-800">
                  <BadgeCheck size={18} className="mr-2" />
                  <span className="text-sm font-medium">Verified</span>
                </div>
              ) : (
                <button
                  onClick={handleVerify}
                  className="btn btn-primary"
                  disabled={verifying}
                >
                  {verifying ? (
                    <>
                      <Loader2 size={18} className="mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    <>
                      <Shield size={18} className="mr-2" />
                      Verify
                    </>
                  )}
                </button>
              )}
            </div>
            
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
            
            <div className="mb-4">
              <h3 className="mb-4 text-lg font-medium">Product Journey</h3>
              
              <div className="rounded-lg bg-slate-50 p-6">
                <div className="relative">
                  {metadata.proofs.map((proof, index) => {
                    const isLast = index === metadata.proofs.length - 1;
                    return (
                      <div key={index} className="relative">
                        <div className="flex">
                          <div className="mr-4 flex flex-col items-center">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                              verified 
                                ? 'bg-green-100 text-green-600' 
                                : 'bg-teal-100 text-teal-600'
                            }`}>
                              {index === 0 ? (
                                <Package size={20} />
                              ) : (
                                <BadgeCheck size={20} />
                              )}
                            </div>
                            {!isLast && (
                              <div className="my-1 h-full w-0.5 bg-slate-300"></div>
                            )}
                          </div>
                          <div className={`mb-6 pb-2 ${isLast ? '' : 'border-b border-slate-200'}`}>
                            <div className="flex items-center">
                              <h4 className="font-semibold">{proof.checkpoint}</h4>
                              {verified && (
                                <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
                                  Verified
                                </span>
                              )}
                            </div>
                            <div className="mb-1 mt-2 flex items-center text-sm text-slate-600">
                              <Clock size={16} className="mr-2" />
                              {formatDate(proof.timestamp)}
                            </div>
                            <div className="flex items-center text-sm text-slate-600">
                              <MapPin size={16} className="mr-2" />
                              {proof.location}
                            </div>
                            <div className="mt-2">
                              <button
                                className="flex items-center text-xs text-slate-500 hover:text-teal-600"
                                onClick={() => {
                                  navigator.clipboard.writeText(proof.proofHash);
                                  toast.success('Proof hash copied to clipboard');
                                }}
                              >
                                <span className="font-mono">{proof.proofHash.substring(0, 10)}...{proof.proofHash.substring(proof.proofHash.length - 8)}</span>
                                <ChevronRight size={14} className="ml-1" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                {verified && (
                  <div className="mt-4 rounded-md bg-green-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <Shield className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-800">
                          This product has been verified with blockchain technology
                        </p>
                        <p className="mt-1 text-xs text-green-700">
                          All checkpoints in the supply chain have valid cryptographic proofs
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyPage;