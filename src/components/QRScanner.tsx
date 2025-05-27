import React, { useState, useEffect, useRef } from 'react';
import Webcam from 'react-webcam';
import { Camera, CameraOff } from 'lucide-react';

interface QRScannerProps {
  onScan: (data: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const [isActive, setIsActive] = useState(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const scanInterval = useRef<number | null>(null);
  
  const toggleScanner = () => {
    if (isActive) {
      stopScanner();
    } else {
      startScanner();
    }
  };
  
  const startScanner = async () => {
    setIsActive(true);
    setErrorMessage(null);
    
    try {
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Browser does not support camera access');
      }
      
      // Request camera permission
      await navigator.mediaDevices.getUserMedia({ video: true });
      setHasPermission(true);
      
      // Start scanning after a short delay to allow camera to initialize
      setTimeout(() => {
        if (scanInterval.current === null) {
          scanInterval.current = window.setInterval(scanQRCode, 500);
        }
      }, 1000);
    } catch (error) {
      console.error('Camera permission error:', error);
      setHasPermission(false);
      setErrorMessage('Camera access denied or not available');
      setIsActive(false);
    }
  };
  
  const stopScanner = () => {
    setIsActive(false);
    if (scanInterval.current !== null) {
      clearInterval(scanInterval.current);
      scanInterval.current = null;
    }
  };
  
  const scanQRCode = async () => {
    if (!webcamRef.current || !canvasRef.current || !isActive) return;
    
    const webcam = webcamRef.current;
    const canvas = canvasRef.current;
    
    // Check if webcam is ready
    if (!webcam.video || !webcam.video.readyState === 4) return;
    
    const video = webcam.video;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) return;
    
    // Set canvas dimensions
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw current video frame to canvas
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    try {
      // In a real application, we would use a QR code detection library here
      // For simulation, we'll check if there's a simulated QR code in the URL
      const params = new URLSearchParams(window.location.search);
      const simulatedQR = params.get('qr');
      
      if (simulatedQR) {
        // Simulate successful QR code detection
        stopScanner();
        onScan(simulatedQR);
        return;
      }
      
      // If we're testing, randomly detect a QR code after some time
      if (process.env.NODE_ENV === 'development' && Math.random() < 0.05) {
        const testProductId = `PROD-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        stopScanner();
        onScan(testProductId);
      }
      
      // Draw scanning effect
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const size = Math.min(canvas.width, canvas.height) * 0.6;
      
      ctx.strokeStyle = '#0D9488';
      ctx.lineWidth = 4;
      ctx.setLineDash([15, 15]);
      ctx.beginPath();
      ctx.rect(centerX - size/2, centerY - size/2, size, size);
      ctx.stroke();
      
      // Animate the dashed line
      ctx.lineDashOffset = -Date.now() / 100 % 30;
    } catch (error) {
      console.error('QR scan error:', error);
    }
  };
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (scanInterval.current !== null) {
        clearInterval(scanInterval.current);
      }
    };
  }, []);
  
  return (
    <div className="qr-scanner">
      <div className="mb-4 flex justify-center">
        <button
          className={`btn ${isActive ? 'btn-danger' : 'btn-primary'} flex items-center`}
          onClick={toggleScanner}
        >
          {isActive ? (
            <>
              <CameraOff size={18} className="mr-2" />
              Stop Scanner
            </>
          ) : (
            <>
              <Camera size={18} className="mr-2" />
              Start Scanner
            </>
          )}
        </button>
      </div>
      
      {errorMessage && (
        <div className="mb-4 rounded-md bg-red-50 p-4 text-red-700">
          <p>{errorMessage}</p>
        </div>
      )}
      
      <div className={`relative overflow-hidden rounded-lg ${isActive ? 'block' : 'hidden'}`}>
        {isActive && hasPermission && (
          <>
            <Webcam
              ref={webcamRef}
              className="mx-auto max-h-[70vh] rounded-lg"
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: "environment"
              }}
            />
            <canvas 
              ref={canvasRef} 
              className="absolute left-0 top-0 h-full w-full"
              style={{ display: 'none' }}
            />
            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center">
              <div className="text-center text-white">
                <div className="mb-2 rounded-full bg-slate-800/70 p-2">
                  <Camera size={24} />
                </div>
                <p className="rounded bg-slate-800/70 px-3 py-1 text-sm">
                  Position QR code in the center
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      
      {!isActive && (
        <div className="flex h-60 items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50">
          <div className="text-center text-slate-500">
            <Camera size={48} className="mx-auto mb-2 opacity-40" />
            <p>Click "Start Scanner" to scan a QR code</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;