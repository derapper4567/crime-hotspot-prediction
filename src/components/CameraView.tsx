import React, { useState, useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

interface CameraViewProps {
  cameraId: string;
  name?: string;
  streamUrl?: string;
  onDetection?: (result: { cameraId: string }) => void;
}

const CameraView: React.FC<CameraViewProps> = ({
  cameraId,
  name = "Camera",
  streamUrl = "http://192.168.100.83:5000/video", // Default URL
  onDetection
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Handle image loading states
  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Camera feed unavailable');
    toast({
      title: "Camera Error",
      description: `Failed to load stream from ${name}`,
      variant: "destructive",
    });
  };

  // Auto-refresh for MJPEG stream
  useEffect(() => {
    if (!streamUrl) return;
    
    const refreshInterval = setInterval(() => {
      const img = document.getElementById(`camera-${cameraId}`) as HTMLImageElement;
      if (img) {
        img.src = `${streamUrl}?t=${Date.now()}`;
      }
    }, 100); // Refresh rate in ms

    return () => clearInterval(refreshInterval);
  }, [streamUrl, cameraId]);

  return (
    <div className="relative border rounded-md overflow-hidden shadow-lg bg-white">
      {/* Video Display Area */}
      <div className="relative aspect-video bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}

        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
            <AlertCircle className="h-10 w-10 text-red-500 mb-2" />
            <p>{error}</p>
            <p className="text-xs mt-2 text-gray-400">Camera ID: {cameraId}</p>
          </div>
        ) : (
          <img
            id={`camera-${cameraId}`}
            src={streamUrl}
            alt={`${name} live stream`}
            className="w-full h-full object-contain"
            onLoad={handleLoad}
            onError={handleError}
            crossOrigin="anonymous"
          />
        )}
      </div>

      {/* Camera Info Overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium text-white">{name}</h3>
            <p className="text-xs text-gray-300">{cameraId}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`h-2 w-2 rounded-full ${
              error ? 'bg-red-500' : isLoading ? 'bg-yellow-500' : 'bg-green-500'
            }`} />
            <span className="text-xs text-white">
              {error ? 'Offline' : isLoading ? 'Connecting' : 'Live'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraView;