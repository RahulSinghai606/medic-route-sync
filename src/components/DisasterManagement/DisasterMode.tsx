import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { 
  Cloud, Waves, Mountain, Wind, Flame, Shield, AlertTriangle, Users, Map, BookOpen, Phone, 
  Activity, Building, FileText, MessageSquare, Clock, Radio, CheckSquare, LucideIcon
} from 'lucide-react';
import HazardOverlay from './HazardOverlay';
import DisasterMap from './DisasterMap';
import DisasterPatientList from './DisasterPatientList';

// Types for disaster data
interface DisasterType {
  id: string;
  name: string;
  icon: LucideIcon;
  activePatients: number;
  color: string;
}

interface Protocol {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'standby' | 'completed';
}

// Sample data for medical camps and disaster locations
const medicalCamps = [
  {
    name: "NER Medical Camp Alpha",
    organization: "Red Cross",
    capacity: 150,
    availableResources: ["Field Surgery", "Ventilators", "Trauma Team"],
    coordinates: {
      lat: 26.1158,
      lng: 91.7086
    }
  },
  {
    name: "NER Medical Camp Beta",
    organization: "Doctors Without Borders",
    capacity: 100,
    availableResources: ["Emergency Triage", "Ambulances", "Medical Supplies"],
    coordinates: {
      lat: 25.5788,
      lng: 91.8933
    }
  },
  {
    name: "NER Relief Center",
    organization: "Government",
    capacity: 200,
    availableResources: ["Food Supplies", "Shelter", "Basic Medical Aid"],
    coordinates: {
      lat: 27.3314,
      lng: 88.6138
    }
  }
];

// Disaster locations based on type
const disasterLocations = {
  flood: {
    name: "Floods",
    type: "flood" as const,
    region: "Brahmaputra Valley",
    affectedArea: "12 districts",
    casualties: 28,
    coordinates: {
      lat: 26.2006,
      lng: 92.9376
    }
  },
  landslide: {
    name: "Landslides",
    type: "landslide" as const,
    region: "Arunachal Pradesh",
    affectedArea: "5 districts",
    casualties: 12,
    coordinates: {
      lat: 27.1004,
      lng: 93.6167
    }
  },
  earthquake: {
    name: "Earthquakes",
    type: "earthquake" as const,
    region: "Meghalaya",
    affectedArea: "3 districts",
    casualties: 15,
    coordinates: {
      lat: 25.4670,
      lng: 91.3662
    }
  }
};

// Sample patient data for each disaster type
const patientsByDisaster = {
  flood: [
    {
      id: 1,
      name: "Mohan Singh",
      age: 45,
      gender: "Male",
      location: "Majuli Island",
      condition: "Stable" as const,
      needsVentilator: false,
      severity: 3,
      injuries: ["Water aspiration", "Minor cuts"]
    },
    {
      id: 2,
      name: "Priya Gogoi",
      age: 32,
      gender: "Female",
      location: "Dibrugarh",
      condition: "Critical" as const,
      needsVentilator: true,
      severity: 1,
      injuries: ["Respiratory distress", "Hypothermia"]
    }
  ],
  landslide: [
    {
      id: 3,
      name: "Rajesh Kumar",
      age: 28,
      gender: "Male",
      location: "Itanagar",
      condition: "Moderate" as const,
      needsVentilator: false,
      severity: 2,
      injuries: ["Crush injury", "Fractured tibia"]
    },
    {
      id: 4,
      name: "Divya Sharma",
      age: 19,
      gender: "Female",
      location: "Ziro Valley",
      condition: "Moderate" as const,
      needsVentilator: false,
      severity: 3,
      injuries: ["Concussion", "Lacerations"]
    }
  ],
  earthquake: [
    {
      id: 5,
      name: "Ankit Roy",
      age: 52,
      gender: "Male",
      location: "Shillong",
      condition: "Critical" as const,
      needsVentilator: true,
      severity: 1,
      injuries: ["Spinal injury", "Internal bleeding"]
    },
    {
      id: 6,
      name: "Meena Barua",
      age: 67,
      gender: "Female",
      location: "Cherrapunji",
      condition: "Stable" as const,
      needsVentilator: false,
      severity: 4,
      injuries: ["Minor fractures", "Dehydration"]
    }
  ]
};

const DisasterMode = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedDisaster, setSelectedDisaster] = useState<string | null>(null);
  const [protocolsVisible, setProtocolsVisible] = useState(false);
  const [trainingVisible, setTrainingVisible] = useState(false);
  
  // Available disaster types
  const disasterTypes: DisasterType[] = [
    { id: 'flood', name: 'Floods', icon: Waves, activePatients: 32, color: 'blue' },
    { id: 'landslide', name: 'Landslides', icon: Mountain, activePatients: 18, color: 'amber' },
    { id: 'cyclone', name: 'Cyclones', icon: Wind, activePatients: 24, color: 'cyan' },
    { id: 'earthquake', name: 'Earthquakes', icon: Mountain, activePatients: 45, color: 'orange' },
    { id: 'fire', name: 'Wildfires', icon: Flame, activePatients: 12, color: 'red' },
  ];

  // NER Protocols
  const nerProtocols: Protocol[] = [
    {
      id: 'evac',
      title: 'NER Emergency Evacuation Protocol',
      description: 'Guidelines for safe evacuation in the Northeast region, including helicopter landing zones, boat usage, and mountain rescue techniques.',
      status: 'active'
    },
    {
      id: 'triage',
      title: 'NER Special Triage Protocol',
      description: 'Modified triage protocols for multi-casualty incidents in remote areas with limited resources and transport options.',
      status: 'active'
    },
    {
      id: 'comms',
      title: 'Communication Protocol',
      description: 'Emergency communication systems with satellite backup for areas with poor network connectivity.',
      status: 'standby'
    },
    {
      id: 'transport',
      title: 'Transportation Protocol',
      description: 'Guidelines for patient movement in difficult terrain including air evacuation criteria.',
      status: 'completed'
    }
  ];

  // Training modules
  const trainingModules = [
    {
      id: 'mci',
      title: 'Mass Casualty Incident Management',
      description: 'Training on handling multiple patients in disaster scenarios with limited resources.',
      completion: '85%'
    },
    {
      id: 'terrain',
      title: 'Terrain-Specific Medical Response',
      description: 'Specialized training for medical emergencies in mountainous regions, floodplains, and forest areas.',
      completion: '70%'
    },
    {
      id: 'cultural',
      title: 'Cultural Sensitivity in Emergency Response',
      description: 'Training on respecting local customs and traditions during emergency operations.',
      completion: '90%'
    }
  ];

  const handleDisasterSelect = (disasterId: string) => {
    setSelectedDisaster(disasterId);
    const disasterName = disasterTypes.find(d => d.id === disasterId)?.name;
    
    toast({
      title: `${disasterName} response activated`,
      description: "Loading disaster-specific protocols and resources...",
    });
  };

  const handleNERProtocolClick = (protocol: Protocol) => {
    setProtocolsVisible(true);
    
    toast({
      title: `${protocol.title} activated`,
      description: "Loading protocol details and guidelines...",
    });
  };
  
  const handleTrainingClick = (trainingModule: any) => {
    setTrainingVisible(true);
    
    toast({
      title: `${trainingModule.title} materials loaded`,
      description: "Access training resources and simulations...",
    });
  };
  
  const protocolStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'standby': return 'bg-yellow-500 text-white';
      case 'completed': return 'bg-gray-500 text-white';
      default: return 'bg-gray-200';
    }
  };

  // Get the current disaster location based on selection
  const getCurrentDisasterLocation = () => {
    if (selectedDisaster && disasterLocations[selectedDisaster as keyof typeof disasterLocations]) {
      return disasterLocations[selectedDisaster as keyof typeof disasterLocations];
    }
    // Default disaster location if none selected
    return disasterLocations.flood;
  };

  // Get patients for the selected disaster
  const getDisasterPatients = () => {
    if (selectedDisaster && patientsByDisaster[selectedDisaster as keyof typeof patientsByDisaster]) {
      return patientsByDisaster[selectedDisaster as keyof typeof patientsByDisaster];
    }
    return [];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Disaster Management Mode</h1>
        <p className="text-muted-foreground">Coordinate emergency response for disaster scenarios</p>
      </div>
      
      {/* Disaster Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Select Disaster Type</CardTitle>
          <CardDescription>Choose the type of disaster to activate specific response protocols</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {disasterTypes.map((disaster) => (
              <Button
                key={disaster.id}
                variant={selectedDisaster === disaster.id ? "default" : "outline"}
                className={`h-auto py-4 flex-col items-center justify-center gap-2 ${selectedDisaster === disaster.id ? 'border-2' : ''}`}
                onClick={() => handleDisasterSelect(disaster.id)}
              >
                <disaster.icon className={`h-8 w-8 ${selectedDisaster === disaster.id ? 'text-white' : `text-${disaster.color}-500`}`} />
                <span>{disaster.name}</span>
                <Badge variant="secondary" className="mt-1">{disaster.activePatients}</Badge>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Tabs for different functional areas */}
      <Tabs defaultValue="map">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="map">Disaster Map</TabsTrigger>
          <TabsTrigger value="protocols">Response Protocols</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="space-y-4">
          {/* Map integration */}
          <Card className="border-warning">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Map className="h-5 w-5 text-warning" />
                Disaster Zone Map
              </CardTitle>
              <CardDescription>Live view of disaster area with responder locations</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative h-[400px] w-full">
                <DisasterMap 
                  medicalCamps={medicalCamps} 
                  disasterLocation={getCurrentDisasterLocation()} 
                />
                {selectedDisaster && 
                  <HazardOverlay 
                    type={selectedDisaster as "flood" | "landslide" | "earthquake"} 
                  />
                }
              </div>
            </CardContent>
          </Card>
          
          {/* Patient list */}
          <DisasterPatientList patients={getDisasterPatients()} />
        </TabsContent>
        
        <TabsContent value="protocols" className="space-y-4">
          {/* NER Protocols */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-medical" />
                North East Region Protocols
              </CardTitle>
              <CardDescription>Emergency response guidelines specific to NER</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {nerProtocols.map((protocol) => (
                <div 
                  key={protocol.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleNERProtocolClick(protocol)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{protocol.title}</h3>
                    <Badge className={protocolStatusColor(protocol.status)}>{protocol.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{protocol.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {protocolsVisible && (
            <Card>
              <CardHeader>
                <CardTitle>Protocol Guidelines</CardTitle>
                <CardDescription>Detailed instructions for selected protocol</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Initial Response</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Establish command post at safe location</li>
                      <li>Deploy rapid assessment teams</li>
                      <li>Set up communications network</li>
                      <li>Coordinate with local authorities</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Medical Response</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Implement modified START triage system</li>
                      <li>Establish casualty collection points</li>
                      <li>Deploy mobile medical teams</li>
                      <li>Activate helicopter evacuation plan if needed</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="resources" className="space-y-4">
          {/* Training Modules */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                Mass Casualty Training
              </CardTitle>
              <CardDescription>Specialized training modules for disaster response</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {trainingModules.map((module) => (
                <div 
                  key={module.id}
                  className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => handleTrainingClick(module)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-medium">{module.title}</h3>
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                      {module.completion}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{module.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
          
          {trainingVisible && (
            <Card>
              <CardHeader>
                <CardTitle>Training Resources</CardTitle>
                <CardDescription>Access training materials and simulations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <h3 className="font-medium mb-2">Available Resources</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Video tutorials and procedural guides</li>
                      <li>Interactive triage simulation</li>
                      <li>Field exercise documentation</li>
                      <li>Equipment checklists and guides</li>
                    </ul>
                  </div>
                  
                  <div className="flex justify-center py-4">
                    <Button variant="default">Access Training Portal</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Resource Management */}
          <Card>
            <CardHeader>
              <CardTitle>Available Resources</CardTitle>
              <CardDescription>Equipment and personnel available for deployment</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Medical Equipment</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <Badge variant="outline" className="justify-between">
                      Field Kits <span className="font-bold">24</span>
                    </Badge>
                    <Badge variant="outline" className="justify-between">
                      Stretchers <span className="font-bold">18</span>
                    </Badge>
                    <Badge variant="outline" className="justify-between">
                      Oxygen Units <span className="font-bold">12</span>
                    </Badge>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="font-medium mb-2">Vehicles</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <Badge variant="outline" className="justify-between">
                      Ambulances <span className="font-bold">8</span>
                    </Badge>
                    <Badge variant="outline" className="justify-between">
                      4x4 Vehicles <span className="font-bold">6</span>
                    </Badge>
                    <Badge variant="outline" className="justify-between">
                      Mobile Clinics <span className="font-bold">2</span>
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DisasterMode;
