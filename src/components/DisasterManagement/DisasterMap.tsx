
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tent, AlertTriangle, MapPin } from 'lucide-react';

interface MedicalCamp {
  name: string;
  organization: string;
  capacity: number;
  availableResources: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface DisasterLocation {
  name: string;
  type: 'landslide' | 'flood' | 'earthquake';
  region: string;
  affectedArea: string;
  casualties: number;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface DisasterMapProps {
  medicalCamps: MedicalCamp[];
  disasterLocation: DisasterLocation;
}

const DisasterMap: React.FC<DisasterMapProps> = ({ medicalCamps, disasterLocation }) => {
  // In a real implementation, this would use a mapping library like Leaflet or Google Maps
  // For this prototype, we're simulating a map view
  
  return (
    <Card className="h-full relative flex flex-col items-center justify-center p-4 border-2 border-dashed">
      <div className="absolute top-4 left-4 z-10 bg-background/90 p-2 rounded-md border shadow-sm">
        <h3 className="text-sm font-medium mb-1">{disasterLocation.name}</h3>
        <p className="text-xs text-muted-foreground">{disasterLocation.region}</p>
        
        <div className="mt-2 space-y-1">
          <div className="flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-destructive" />
            <span className="text-xs">{disasterLocation.type.toUpperCase()}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Tent className="h-3 w-3 text-medical" />
            <span className="text-xs">{medicalCamps.length} Medical Camps</span>
          </div>
        </div>
      </div>
      
      <div className="text-center mb-2">
        <p className="text-sm">Map Simulation</p>
        <p className="text-xs text-muted-foreground">
          Displaying {disasterLocation.region} area with {medicalCamps.length} medical camps
        </p>
      </div>
      
      {/* Simplified map visualization */}
      <div className="relative w-full flex-1 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden">
        {/* Disaster epicenter */}
        <div 
          className="absolute p-2 bg-destructive/20 border-2 border-destructive rounded-full animate-pulse"
          style={{
            top: '40%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100px',
            height: '100px'
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
        </div>
        
        {/* Camps visualization */}
        {medicalCamps.map((camp, index) => {
          // Simulate position based on index for demo purposes
          const positions = [
            { top: '30%', left: '30%' },
            { top: '50%', left: '70%' },
            { top: '70%', left: '40%' }
          ];
          const pos = positions[index % positions.length];
          
          return (
            <div 
              key={index}
              className="absolute bg-white dark:bg-gray-700 p-2 rounded-md border shadow-sm w-32"
              style={{
                top: pos.top,
                left: pos.left,
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="flex items-center gap-1 mb-1">
                <Tent className="h-3 w-3 text-medical" />
                <span className="text-xs font-medium truncate">{camp.name}</span>
              </div>
              <div className="text-xs text-muted-foreground">{camp.organization}</div>
            </div>
          );
        })}
        
        <div className="absolute bottom-4 right-4 text-xs text-muted-foreground">
          In a full implementation, this would be an interactive map using Leaflet or Google Maps
        </div>
      </div>
    </Card>
  );
};

export default DisasterMap;
