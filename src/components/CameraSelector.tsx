
import React, { useState, useEffect } from 'react';
import { Check, ChevronsUpDown, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Mock camera data
const mockCameras = [
  { id: 'cam-000001', name: 'Front Entrance', location: 'Main Building' },
  { id: 'cam-000002', name: 'Parking Lot', location: 'East Side' },
  { id: 'cam-000003', name: 'Hallway A', location: 'Main Building' },
  { id: 'cam-000004', name: 'Lobby', location: 'Reception Area' },
  { id: 'cam-000005', name: 'Warehouse', location: 'Storage Facility' },
  { id: 'cam-000006', name: 'Backyard', location: 'Perimeter' },
];

type Camera = {
  id: string;
  name: string;
  location: string;
};

interface CameraSelectorProps {
  onSelectCamera: (camera: Camera) => void;
  selectedCameras?: string[];
  maxSelection?: number;
}

const CameraSelector: React.FC<CameraSelectorProps> = ({
  onSelectCamera,
  selectedCameras = [],
  maxSelection = Infinity,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    // In a real app, this would fetch cameras from an API
    const loadCameras = async () => {
      setIsLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        setCameras(mockCameras);
      } catch (error) {
        console.error('Failed to load cameras:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCameras();
  }, []);

  const refreshCameras = () => {
    setIsLoading(true);
    
    // Simulate refreshing cameras list
    setTimeout(() => {
      setCameras([...mockCameras]);
      setIsLoading(false);
    }, 1000);
  };

  const handleSelectCamera = (camera: Camera) => {
    if (selectedCameras.includes(camera.id)) {
      return;
    }
    
    if (selectedCameras.length >= maxSelection) {
      alert(`You can only select up to ${maxSelection} cameras`);
      return;
    }
    
    onSelectCamera(camera);
    setOpen(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium">Select Cameras</label>
        <Button
          variant="ghost"
          size="sm"
          onClick={refreshCameras}
          disabled={isLoading}
          className="h-8 w-8 p-0"
        >
          <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
        </Button>
      </div>
      
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            {selectedCameras.length > 0
              ? `${selectedCameras.length} camera${selectedCameras.length !== 1 ? 's' : ''} selected`
              : "Select cameras..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start" side="bottom">
          <Command>
            <CommandInput 
              placeholder="Search cameras..." 
              value={searchValue} 
              onValueChange={setSearchValue} 
            />
            <CommandList>
              <CommandEmpty>No cameras found.</CommandEmpty>
              <CommandGroup>
                {cameras.map((camera) => (
                  <CommandItem
                    key={camera.id}
                    onSelect={() => handleSelectCamera(camera)}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCameras.includes(camera.id) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{camera.name}</span>
                      <span className="text-xs text-muted-foreground">{camera.location} - {camera.id}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CameraSelector;
