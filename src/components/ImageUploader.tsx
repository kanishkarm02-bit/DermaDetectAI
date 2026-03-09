import React, { useCallback, useState, useRef } from 'react';
import { useDropzone, DropzoneOptions } from 'react-dropzone';
import Webcam from 'react-webcam';
import { Upload, Image as ImageIcon, X, Loader2, Camera, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';

interface ImageUploaderProps {
  onAnalyze: (image: string) => void;
  isAnalyzing: boolean;
}

export function ImageUploader({ onAnalyze, isAnalyzing }: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'camera'>('upload');
  const webcamRef = useRef<Webcam>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setPreview(result);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: { 
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 1,
    maxSize: 5 * 1024 * 1024, // 5MB limit
    multiple: false,
    disabled: isAnalyzing,
  } as unknown as DropzoneOptions);

  const fileRejectionItems = fileRejections.map(({ file, errors }) => (
    <div key={file.name} className="mt-2 text-sm text-rose-400 bg-rose-500/10 p-2 rounded border border-rose-500/20">
      {errors.map(e => (
        <p key={e.code}>{e.message}</p>
      ))}
    </div>
  ));

  const handleCapture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setPreview(imageSrc);
    }
  }, [webcamRef]);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
  };

  const handleAnalyze = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (preview) {
      onAnalyze(preview);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Mode Switcher */}
      {!preview && (
        <div className="flex justify-center mb-6 bg-slate-900 p-1 rounded-xl border border-slate-800 w-fit mx-auto">
          <button
            onClick={() => setMode('upload')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
              mode === 'upload' 
                ? "bg-teal-600 text-white shadow-lg" 
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Upload size={16} />
            Upload
          </button>
          <button
            onClick={() => setMode('camera')}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
              mode === 'camera' 
                ? "bg-teal-600 text-white shadow-lg" 
                : "text-slate-400 hover:text-slate-200"
            )}
          >
            <Camera size={16} />
            Camera
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            key={mode}
            className="w-full"
          >
            {mode === 'upload' ? (
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 bg-slate-900/50",
                  isDragActive
                    ? "border-teal-500 bg-teal-500/10"
                    : "border-slate-700 hover:border-teal-500 hover:bg-slate-800"
                )}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-slate-800 rounded-full text-teal-500">
                    <Upload size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-200">
                      Upload a photo
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Drag & drop or click to select
                    </p>
                  </div>
                  <p className="text-xs text-slate-600">
                    Supports JPG, PNG, WEBP (Max 5MB)
                  </p>
                  {fileRejectionItems}
                </div>
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden bg-black border border-slate-800 aspect-[4/3]">
                <Webcam
                  audio={false}
                  ref={webcamRef}
                  screenshotFormat="image/jpeg"
                  className="w-full h-full object-cover"
                  videoConstraints={{ facingMode: "environment" }}
                  disablePictureInPicture={false}
                  forceScreenshotSourceSize={false}
                  imageSmoothing={true}
                  mirrored={false}
                  onUserMedia={() => {}}
                  onUserMediaError={() => {}}
                  screenshotQuality={0.92}
                />
                <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                  <button
                    onClick={handleCapture}
                    className="w-16 h-16 rounded-full border-4 border-white bg-white/20 hover:bg-white/40 transition-colors backdrop-blur-sm flex items-center justify-center"
                  >
                    <div className="w-12 h-12 bg-white rounded-full" />
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            key="preview-zone"
            className="relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800"
          >
            <img
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
            
            {/* Overlay Controls */}
            <div className="absolute top-2 right-2">
              <button
                onClick={handleClear}
                disabled={isAnalyzing}
                className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-full backdrop-blur-sm transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4 bg-slate-900">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-800 disabled:text-teal-400 text-white rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-teal-500/20"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <ImageIcon size={20} />
                    Analyze Skin Condition
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
