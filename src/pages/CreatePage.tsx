import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { ClipboardCopy, Check, Loader2 } from 'lucide-react';

import { generateProductId } from '../services/blockchainService';
import { generateProof } from '../services/zkProofService';
import { uploadMetadata } from '../services/ipfsService';
import { updateProductCID } from '../services/blockchainService';

interface FormData {
  productName: string;
  batchNumber: string;
  manufactureDate: string;
  location: string;
}

const CreatePage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    productName: '',
    batchNumber: '',
    manufactureDate: new Date().toISOString().split('T')[0],
    location: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [productId, setProductId] = useState<string | null>(null);
  const [cid, setCid] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.productName || !formData.batchNumber || !formData.manufactureDate || !formData.location) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    
    try {
      // Generate a new product ID
      const newProductId = generateProductId();
      setProductId(newProductId);
      
      // Generate initial zkPoL proof
      toast.loading('Generating proof of location...', { id: 'proof' });
      const proofHash = await generateProof(
        newProductId,
        'Manufacturing',
        formData.location
      );
      toast.success('Proof generated successfully', { id: 'proof' });
      
      // Create metadata object
      const metadata = {
        productId: newProductId,
        name: formData.productName,
        batchNumber: formData.batchNumber,
        manufactureDate: formData.manufactureDate,
        proofs: [
          {
            checkpoint: 'Manufacturing',
            timestamp: new Date().toISOString(),
            location: formData.location,
            proofHash: proofHash,
          }
        ]
      };
      
      // Upload metadata to IPFS
      toast.loading('Uploading metadata to IPFS...', { id: 'ipfs' });
      const newCid = await uploadMetadata(metadata);
      setCid(newCid);
      toast.success('Metadata uploaded to IPFS', { id: 'ipfs' });
      
      // Update blockchain record
      toast.loading('Updating blockchain record...', { id: 'blockchain' });
      await updateProductCID(newProductId, newCid);
      toast.success('Blockchain record updated', { id: 'blockchain' });
      
      toast.success('Product created successfully');
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Failed to create product');
    } finally {
      setLoading(false);
    }
  };
  
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Copied to clipboard');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-center">Create New Product</h1>
        
        <div className="card">
          <form onSubmit={handleSubmit}>
            <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label htmlFor="productName" className="mb-2 block font-medium text-slate-700">
                  Product Name
                </label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  className="input w-full"
                  value={formData.productName}
                  onChange={handleInputChange}
                  placeholder="Enter product name"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="batchNumber" className="mb-2 block font-medium text-slate-700">
                  Batch Number
                </label>
                <input
                  type="text"
                  id="batchNumber"
                  name="batchNumber"
                  className="input w-full"
                  value={formData.batchNumber}
                  onChange={handleInputChange}
                  placeholder="Enter batch number"
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="manufactureDate" className="mb-2 block font-medium text-slate-700">
                  Manufacture Date
                </label>
                <input
                  type="date"
                  id="manufactureDate"
                  name="manufactureDate"
                  className="input w-full"
                  value={formData.manufactureDate}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              
              <div>
                <label htmlFor="location" className="mb-2 block font-medium text-slate-700">
                  Manufacturing Location
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="input w-full"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="e.g., Factory A, Singapore"
                  disabled={loading}
                />
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <button
                type="submit"
                className="btn btn-primary w-full sm:w-auto"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 size={20} className="mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Generate Package'
                )}
              </button>
            </div>
          </form>
          
          {productId && cid && (
            <div className="mt-10 rounded-lg bg-slate-50 p-6">
              <h3 className="mb-4 text-center text-xl font-semibold">Product Created Successfully</h3>
              
              <div className="mb-6 flex justify-center">
                <div className="rounded-lg bg-white p-4 shadow-md">
                  <QRCodeSVG
                    value={productId}
                    size={200}
                    level="H"
                    includeMargin={true}
                    imageSettings={{
                      src: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwRDk0ODgiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1ib3giPjxwYXRoIGQ9Ik0yMSAxNlY4YTIgMiAwIDAgMC0xLTEuNzNsLTcuLTRhMiAyIDAgMCAwLTIgMGwtNyA0QTIgMiAwIDAgMCAzIDh2OGEyIDIgMCAwIDAgMSAxLjczbDcgNGEyIDIgMCAwIDAgMiAwbDctNEEyIDIgMCAwIDAgMjEgMTZ6Ii8+PHBvbHlsaW5lIHBvaW50cz0iMy4yNyA2Ljk2IDEyIDEyLjAxIDIwLjczIDYuOTYiLz48bGluZSB4MT0iMTIiIHkxPSIyMi4wOCIgeDI9IjEyIiB5Mj0iMTIiLz48L3N2Zz4=",
                      excavate: true,
                      width: 40,
                      height: 40,
                    }}
                  />
                  <p className="mt-2 text-center text-sm text-slate-500">
                    Scan this QR code to track the product
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Product ID
                  </label>
                  <div className="flex items-center rounded-md border border-slate-300 bg-white p-2">
                    <span className="flex-1 truncate font-mono text-sm">{productId}</span>
                    <button 
                      className="ml-2 rounded p-1 text-slate-500 hover:bg-slate-100"
                      onClick={() => copyToClipboard(productId)}
                      aria-label="Copy product ID"
                    >
                      {copied ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <ClipboardCopy size={18} />
                      )}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    IPFS CID
                  </label>
                  <div className="flex items-center rounded-md border border-slate-300 bg-white p-2">
                    <span className="flex-1 truncate font-mono text-sm">{cid}</span>
                    <button 
                      className="ml-2 rounded p-1 text-slate-500 hover:bg-slate-100"
                      onClick={() => copyToClipboard(cid)}
                      aria-label="Copy IPFS CID"
                    >
                      {copied ? (
                        <Check size={18} className="text-green-500" />
                      ) : (
                        <ClipboardCopy size={18} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-slate-500">
                  This information has been securely stored on IPFS and linked to the blockchain.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePage;