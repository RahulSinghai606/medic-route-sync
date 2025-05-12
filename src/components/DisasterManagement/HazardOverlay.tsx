
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Cloud, Mountain } from 'lucide-react';

interface HazardOverlayProps {
  type: 'landslide' | 'flood' | 'earthquake';
  region: string;
}

const HazardOverlay: React.FC<HazardOverlayProps> = ({ type, region }) => {
  // This component would normally fetch and display hazard data
  // For the prototype, we'll show mock data
  
  const renderHazardInfo = () => {
    switch (type) {
      case 'landslide':
        return (
          <div className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md text-amber-800 dark:text-amber-300">
              <div className="flex items-center gap-2 mb-1">
                <Mountain className="h-4 w-4" />
                <h3 className="font-medium">Landslide Risk Zones - {region}</h3>
              </div>
              <p className="text-sm">
                Several areas in {region} are experiencing high risk of additional landslides due to 
                unstable terrain and continued rainfall.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Hazard Patterns:</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  <span className="font-medium">High Risk Areas:</span> Tawang Town, Jang, Zemithang
                </li>
                <li>
                  <span className="font-medium">Slope Instability:</span> Several mountain roads showing signs of collapse
                </li>
                <li>
                  <span className="font-medium">Road Closures:</span> Tawang-Bomdila highway blocked at multiple points
                </li>
              </ul>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Safety Instructions:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Evacuate to established medical camps</li>
                <li>• Avoid steep terrain during rescue operations</li>
                <li>• Use helicopter evacuation where possible</li>
              </ul>
            </div>
          </div>
        );
        
      case 'flood':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-blue-800 dark:text-blue-300">
              <div className="flex items-center gap-2 mb-1">
                <Cloud className="h-4 w-4" />
                <h3 className="font-medium">Flood Risk Zones - {region}</h3>
              </div>
              <p className="text-sm">
                Brahmaputra and tributary rivers have breached banks in multiple locations 
                with continued rainfall expected.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Hazard Patterns:</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  <span className="font-medium">Submerged Areas:</span> Barpeta Town, Howli, Sarthebari
                </li>
                <li>
                  <span className="font-medium">Water Levels:</span> 2.5m above danger mark and rising
                </li>
                <li>
                  <span className="font-medium">Bridge Damage:</span> 3 bridges damaged, 7 villages cut off
                </li>
              </ul>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Safety Instructions:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Use boats for medical transport</li>
                <li>• Establish medical camps on elevated ground only</li>
                <li>• Test water quality before distributing</li>
              </ul>
            </div>
          </div>
        );
        
      case 'earthquake':
        return (
          <div className="space-y-4">
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-red-800 dark:text-red-300">
              <div className="flex items-center gap-2 mb-1">
                <AlertTriangle className="h-4 w-4" />
                <h3 className="font-medium">Earthquake Impact - {region}</h3>
              </div>
              <p className="text-sm">
                6.2 magnitude earthquake with epicenter near Gangtok has caused widespread 
                structural damage and casualties.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Hazard Patterns:</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>
                  <span className="font-medium">Damaged Structures:</span> Gangtok, Namchi, Mangan districts
                </li>
                <li>
                  <span className="font-medium">Aftershocks:</span> 12 recorded aftershocks above 4.0 magnitude
                </li>
                <li>
                  <span className="font-medium">Infrastructure:</span> 60% of Gangtok without electricity, water systems damaged
                </li>
              </ul>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Safety Instructions:</h3>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Avoid damaged buildings during rescue</li>
                <li>• Be prepared for aftershocks</li>
                <li>• Use open ground for medical triage</li>
              </ul>
            </div>
          </div>
        );
        
      default:
        return <p>No hazard data available.</p>;
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-5 w-5 text-destructive" />
        <h2 className="text-lg font-semibold">Hazard Assessment</h2>
      </div>
      {renderHazardInfo()}
    </div>
  );
};

export default HazardOverlay;
