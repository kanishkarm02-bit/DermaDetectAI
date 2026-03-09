import { useState, useRef, useCallback } from 'react';
import { motion } from 'motion/react';
import { ScanFace, CheckCircle2, XCircle, Loader2, Camera } from 'lucide-react';
import Webcam from 'react-webcam';
import { verifyHuman } from '@/services/analysisService';

interface HumanVerificationProps {
  onVerify: (success: boolean) => void;
}

export function HumanVerification({ onVerify }: HumanVerificationProps) {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'analyzing' | 'success' | 'failed'>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const webcamRef = useRef<Webcam>(null);

  const captureAndVerify = useCallback(async () => {
    if (!webcamRef.current) return;
    
    setStatus('scanning');
    
    // Short delay to simulate scanning UI
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) {
      setStatus('failed');
      setErrorMsg("Could not capture image");
      return;
    }

    setStatus('analyzing');
    
    try {
      const result = await verifyHuman(imageSrc);
      
      if (result.isHuman) {
        setStatus('success');
        setTimeout(() => onVerify(true), 1500);
      } else {
        setStatus('failed');
        setErrorMsg(result.reason || "Verification failed. Please try again.");
        setTimeout(() => {
          setStatus('idle');
          setErrorMsg('');
        }, 3000);
      }
    } catch (error) {
      console.error(error);
      setStatus('failed');
      setErrorMsg("Verification error. Please try again.");
      setTimeout(() => {
        setStatus('idle');
        setErrorMsg('');
      }, 3000);
    }
  }, [onVerify]);

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center relative overflow-hidden"
      >
        <h2 className="text-2xl font-bold text-white mb-2">Security Check</h2>
        <p className="text-slate-400 mb-6">Please look at the camera to verify you are human.</p>

        <div className="relative w-64 h-64 mb-8 rounded-full overflow-hidden border-4 border-slate-800 bg-black">
          {/* Webcam Feed */}
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover"
            videoConstraints={{ facingMode: "user" }}
            disablePictureInPicture={false}
            forceScreenshotSourceSize={false}
            imageSmoothing={true}
            mirrored={true}
            screenshotQuality={0.92}
            minScreenshotHeight={480}
            minScreenshotWidth={640}
            onUserMedia={() => {}}
            onUserMediaError={() => {}}
          />

          {/* Scanning Overlay */}
          {status === 'scanning' && (
            <motion.div 
              initial={{ top: 0 }}
              animate={{ top: "100%" }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              className="absolute left-0 right-0 h-1 bg-teal-500/80 shadow-[0_0_15px_rgba(20,184,166,0.8)] z-10"
            />
          )}
          
          {/* Status Overlay */}
          {(status === 'success' || status === 'failed') && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-20">
              {status === 'success' && <CheckCircle2 size={80} className="text-emerald-500" />}
              {status === 'failed' && <XCircle size={80} className="text-red-500" />}
            </div>
          )}
        </div>

        {status === 'idle' && (
          <button
            onClick={captureAndVerify}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <Camera size={20} />
            Verify Me
          </button>
        )}

        {status === 'scanning' && (
          <div className="text-teal-400 font-mono text-sm animate-pulse flex items-center gap-2">
            <ScanFace size={16} />
            Scanning facial features...
          </div>
        )}

        {status === 'analyzing' && (
          <div className="text-indigo-400 font-mono text-sm animate-pulse flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Verifying with AI...
          </div>
        )}

        {status === 'success' && (
          <div className="text-emerald-400 font-bold">
            Verification Successful
          </div>
        )}

        {status === 'failed' && (
          <div className="text-red-400 font-medium text-sm">
            {errorMsg}
          </div>
        )}
      </motion.div>
    </div>
  );
}
