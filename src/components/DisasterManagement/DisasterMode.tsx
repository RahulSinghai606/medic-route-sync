
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Tent, MapPin, Users, Activity, ArrowRight, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import DisasterPatientList from './DisasterPatientList';
import DisasterMap from './DisasterMap';
import HazardOverlay from './HazardOverlay';

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
  medicalCamps: {
    name: string;
    organization: string;
    capacity: number;
    availableResources: string[];
    coordinates: {
      lat: number;
      lng: number;
    };
  }[];
}

// Mock data for Northeast India disaster scenarios
const disasterLocations: DisasterLocation[] = [
  {
    name: 'Tawang Landslide',
    type: 'landslide',
    region: 'Arunachal Pradesh',
    affectedArea: 'Tawang District, Jang-Mukto Area',
    casualties: 12,
    coordinates: {
      lat: 27.5859,
      lng: 91.8580
    },
    medicalCamps: [
      {
        name: 'Army Medical Camp - Tawang',
        organization: 'Indian Army',
        capacity: 50,
        availableResources: ['Ventilators (5)', 'Emergency Supplies', 'Trauma Unit'],
        coordinates: {
          lat: 27.5850,
          lng: 91.8590
        }
      },
      {
        name: 'NDRF Relief Camp',
        organization: 'NDRF',
        capacity: 30,
        availableResources: ['First Aid', 'Rescue Equipment', 'Temporary Shelter'],
        coordinates: {
          lat: 27.5870,
          lng: 91.8560
        }
      }
    ]
  },
  {
    name: 'Barpeta Floods',
    type: 'flood',
    region: 'Assam',
    affectedArea: 'Barpeta District, Brahmaputra Valley',
    casualties: 8,
    coordinates: {
      lat: 26.3154,
      lng: 91.0093
    },
    medicalCamps: [
      {
        name: 'Red Cross Relief Camp',
        organization: 'Indian Red Cross Society',
        capacity: 75,
        availableResources: ['Boats (10)', 'Medical Supplies', 'Food Packets'],
        coordinates: {
          lat: 26.3160,
          lng: 91.0100
        }
      },
      {
        name: 'State Medical Response Unit',
        organization: 'Assam Govt.',
        capacity: 40,
        availableResources: ['Mobile Medical Unit', 'Water Purification', 'Vaccines'],
        coordinates: {
          lat: 26.3140,
          lng: 91.0080
        }
      }
    ]
  },
  {
    name: 'Sikkim Earthquake',
    type: 'earthquake',
    region: 'Sikkim',
    affectedArea: 'Gangtok & Surrounding Areas',
    casualties: 27,
    coordinates: {
      lat: 27.3389,
      lng: 88.6065
    },
    medicalCamps: [
      {
        name: 'Army Field Hospital',
        organization: 'Indian Army',
        capacity: 100,
        availableResources: ['Surgery Unit', 'Ventilators (12)', 'X-Ray Machines'],
        coordinates: {
          lat: 27.3380,
          lng: 88.6070
        }
      },
      {
        name: 'Doctors Without Borders Camp',
        organization: 'MSF',
        capacity: 60,
        availableResources: ['International Medical Team', 'Trauma Care', 'Emergency Supplies'],
        coordinates: {
          lat: 27.3400,
          lng: 88.6050
        }
      }
    ]
  }
];

const DisasterMode: React.FC = () => {
  const { t } = useLanguage();
  const [disasterModeEnabled, setDisasterModeEnabled] = useState(false);
  const [selectedDisaster, setSelectedDisaster] = useState<DisasterLocation>(disasterLocations[0]);
  const [activeTab, setActiveTab] = useState('triage');

  // Simulate patients for triage
  const [triagePatients] = useState(() => {
    // Generate northeastern names
    const neNames = [
      "Tenzin Wangchuk", "Passang Dorjee", "Bhaichung Bhutia", "Lalsangzuali Sailo",
      "Tarundeep Rai", "Dipa Karmakar", "Chekrovolu Swuro", "Mary Kom",
      "Hima Das", "Bimal Gurung", "Lovlina Borgohain", "Laishram Sarita Devi"
    ];
    
    // Create mock patient data with northeastern names
    return Array.from({ length: 15 }, (_, i) => {
      const severityScores = [1, 2, 3, 4, 5]; // 1: Critical, 5: Minor
      const severity = severityScores[Math.floor(Math.random() * severityScores.length)];
      
      return {
        id: i + 1,
        name: neNames[i % neNames.length],
        age: Math.floor(Math.random() * 60) + 15,
        gender: Math.random() > 0.5 ? 'Male' : 'Female',
        location: selectedDisaster.affectedArea,
        condition: severity <= 2 ? 'Critical' : severity === 3 ? 'Moderate' : 'Stable',
        needsVentilator: severity <= 2,
        severity: severity,
        injuries: severity <= 2 
          ? ['Head Trauma', 'Internal Bleeding'] 
          : severity === 3 
            ? ['Fractures', 'Dehydration'] 
            : ['Minor Cuts', 'Bruises']
      };
    });
  });

  const handleDisasterModeToggle = () => {
    setDisasterModeEnabled(!disasterModeEnabled);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1>Disaster Management</h1>
          <p className="text-muted-foreground">Mass casualty triage and resource management</p>
        </div>
        <div className="flex gap-3 items-center">
          <Label htmlFor="disaster-mode">Disaster Mode</Label>
          <Switch 
            id="disaster-mode" 
            checked={disasterModeEnabled}
            onCheckedChange={handleDisasterModeToggle}
            className={disasterModeEnabled ? "bg-destructive" : ""}
          />
        </div>
      </div>

      {disasterModeEnabled ? (
        <>
          <Alert variant="destructive" className="border-destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="text-destructive font-bold">DISASTER MODE ACTIVE</AlertTitle>
            <AlertDescription>
              System is operating in mass casualty triage mode. Emergency protocols are in effect.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <div className="flex justify-between">
                <div>
                  <CardTitle>{selectedDisaster.name}</CardTitle>
                  <CardDescription>{selectedDisaster.region} - {selectedDisaster.affectedArea}</CardDescription>
                </div>
                <Badge variant="destructive" className="h-fit flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {selectedDisaster.type.toUpperCase()}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4" />
                    Casualties
                  </h3>
                  <p className="text-2xl font-bold text-destructive">{selectedDisaster.casualties}</p>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-1">
                    <Tent className="h-4 w-4" />
                    Medical Camps
                  </h3>
                  <p className="text-2xl font-bold">{selectedDisaster.medicalCamps.length}</p>
                </div>
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="text-sm font-medium flex items-center gap-2 mb-1">
                    <Activity className="h-4 w-4" />
                    Patients in Triage
                  </h3>
                  <p className="text-2xl font-bold">{triagePatients.length}</p>
                </div>
              </div>

              <div>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="triage" className="flex-1">Triage</TabsTrigger>
                    <TabsTrigger value="map" className="flex-1">Map</TabsTrigger>
                    <TabsTrigger value="resources" className="flex-1">Resources</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="triage">
                    <DisasterPatientList patients={triagePatients} />
                  </TabsContent>
                  
                  <TabsContent value="map">
                    <div className="h-[400px] relative">
                      <DisasterMap 
                        disasterLocation={selectedDisaster}
                        medicalCamps={selectedDisaster.medicalCamps} 
                      />
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="resources">
                    <div className="space-y-4">
                      <h3 className="font-medium">Medical Camps</h3>
                      <div className="space-y-3">
                        {selectedDisaster.medicalCamps.map((camp, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between">
                              <h4 className="font-medium">{camp.name}</h4>
                              <Badge>{camp.organization}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">Capacity: {camp.capacity} patients</p>
                            <div className="mt-2">
                              <p className="text-sm font-medium mb-1">Available Resources:</p>
                              <div className="flex flex-wrap gap-1">
                                {camp.availableResources.map((resource, i) => (
                                  <Badge key={i} variant="outline" className="bg-green-50 text-green-700 border-green-200">
                                    {resource}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
            <CardFooter className="justify-end">
              <Button variant="outline" className="mr-2">
                Request Additional Resources
              </Button>
              <Button>
                Update Status
              </Button>
            </CardFooter>
          </Card>
          
          {activeTab === 'map' && (
            <HazardOverlay type={selectedDisaster.type} region={selectedDisaster.region} />
          )}
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Disaster Management Module</CardTitle>
            <CardDescription>
              Activate disaster mode to enable mass casualty triage system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-md text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Disaster Mode is Currently Disabled</p>
                <p className="text-sm">
                  Enable Disaster Mode during mass casualty incidents to:
                </p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-sm">
                  <li>Process large patient groups simultaneously</li>
                  <li>Coordinate with emergency response teams</li>
                  <li>View hazard overlays on maps</li>
                  <li>Locate medical camps and NGO relief centers</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="w-full justify-between hover:bg-gray-50 dark:hover:bg-gray-800 py-6 text-left"
              >
                <div className="flex gap-3 items-center">
                  <div className="h-9 w-9 rounded-md bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                    <Tent className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium">NE India Disaster Protocols</p>
                    <p className="text-xs text-muted-foreground">
                      Protocols for landslides, floods & earthquakes
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </Button>

              <Button 
                variant="outline" 
                className="w-full justify-between hover:bg-gray-50 dark:hover:bg-gray-800 py-6 text-left"
              >
                <div className="flex gap-3 items-center">
                  <div className="h-9 w-9 rounded-md bg-medical/10 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-medical" />
                  </div>
                  <div>
                    <p className="font-medium">Mass Casualty Training</p>
                    <p className="text-xs text-muted-foreground">
                      Training modules for disaster response
                    </p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full" 
              variant="destructive"
              onClick={handleDisasterModeToggle}
            >
              Activate Disaster Mode
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default DisasterMode;
