import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Activity, Users, Heart, Stethoscope } from 'lucide-react';
import TriageTable from './TriageTable';
import VentilatorAvailability from './VentilatorAvailability';
import DisasterMap from './DisasterMap';
import HazardOverlay from './HazardOverlay';

interface EnhancedDisasterModeProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

const EnhancedDisasterMode: React.FC<EnhancedDisasterModeProps> = ({ 
  isActive, 
  onToggle 
}) => {
  const [activeIncidents, setActiveIncidents] = useState([
    {
      id: 'INC001',
      type: 'Mass Casualty',
      location: 'Highway NH-37, Guwahati',
      casualties: 15,
      timeReported: new Date(Date.now() - 30 * 60000),
      status: 'active',
      priority: 'critical' as const
    },
    {
      id: 'INC002', 
      type: 'Building Collapse',
      location: 'Fancy Bazaar, Guwahati',
      casualties: 8,
      timeReported: new Date(Date.now() - 45 * 60000),
      status: 'responding',
      priority: 'high' as const
    }
  ]);

  const medicalCamps = [
    {
      name: "Emergency Response Camp Alpha",
      organization: "Red Cross",
      capacity: 50,
      availableResources: ["Field Surgery", "Ventilators", "Trauma Team"],
      coordinates: { lat: 26.1158, lng: 91.7086 }
    },
    {
      name: "Mobile Medical Unit Beta", 
      organization: "Disaster Management",
      capacity: 30,
      availableResources: ["Triage", "Ambulances", "Medical Supplies"],
      coordinates: { lat: 26.1445, lng: 91.7362 }
    }
  ];

  const disasterLocation = {
    name: "Multi-site Emergency Response",
    type: "earthquake" as const,
    region: "Greater Guwahati Area",
    affectedArea: "Multiple locations",
    casualties: 23,
    coordinates: { lat: 26.1445, lng: 91.7362 }
  };

  if (!isActive) {
    return (
      <Card className="border-orange-200 bg-orange-50/50">
        <CardContent className="p-6">
          <div className="text-center">
            <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-orange-800 mb-2">
              Disaster Mode Inactive
            </h3>
            <p className="text-orange-700 mb-4">
              Activate disaster mode to enable mass casualty protocols and triage workflows
            </p>
            <Button 
              onClick={() => onToggle(true)}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <AlertTriangle className="h-4 w-4 mr-2" />
              Activate Disaster Mode
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Disaster Mode Header */}
      <Card className="border-red-200 bg-red-50/80 animate-pulse">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="font-semibold text-red-800">
                  Disaster Protocol Active
                </h3>
                <p className="text-red-700">
                  Mass casualty incident • Triage protocols engaged • All departments coordinating
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-red-300" size="sm">
                <Users className="h-4 w-4 mr-1" />
                Command Center
              </Button>
              <Button variant="outline" onClick={() => onToggle(false)} className="border-red-300">
                Deactivate
              </Button>
            </div>
          </div>
          
          {/* Active Incidents Summary */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <div className="text-red-800 font-semibold">Active Incidents</div>
              <div className="text-2xl font-bold text-red-700">{activeIncidents.length}</div>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <div className="text-red-800 font-semibold">Total Casualties</div>
              <div className="text-2xl font-bold text-red-700">
                {activeIncidents.reduce((sum, inc) => sum + inc.casualties, 0)}
              </div>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <div className="text-red-800 font-semibold">Response Teams</div>
              <div className="text-2xl font-bold text-red-700">6 Active</div>
            </div>
            <div className="bg-white/20 p-3 rounded-lg">
              <div className="text-red-800 font-semibold">Medical Camps</div>
              <div className="text-2xl font-bold text-red-700">{medicalCamps.length} Deployed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Disaster Management Interface */}
      <Tabs defaultValue="triage" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="triage" className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4" />
            Triage Center
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Incident Map
          </TabsTrigger>
          <TabsTrigger value="coordination" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Coordination
          </TabsTrigger>
        </TabsList>

        <TabsContent value="triage" className="space-y-4">
          <TriageTable />
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <VentilatorAvailability />
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Incident Response Map</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px]">
                  <DisasterMap 
                    medicalCamps={medicalCamps}
                    disasterLocation={disasterLocation}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <HazardOverlay 
                  type="flood"
                  region="Greater Guwahati Area"
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="coordination" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Active Incidents */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Active Incidents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeIncidents.map((incident) => (
                    <Card key={incident.id} className="border">
                      <CardContent className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{incident.type}</h4>
                          <Badge 
                            variant={incident.priority === 'critical' ? 'destructive' : 'secondary'}
                          >
                            {incident.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{incident.location}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span>Casualties: {incident.casualties}</span>
                          <span>{Math.floor((Date.now() - incident.timeReported.getTime()) / 60000)}min ago</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Response Teams */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-500" />
                  Response Teams
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Alpha Team', 'Bravo Team', 'Charlie Team', 'Medical Unit 1', 'Medical Unit 2', 'Air Rescue'].map((team, index) => (
                    <div key={team} className="flex items-center justify-between p-2 border rounded">
                      <span className="font-medium">{team}</span>
                      <Badge variant={index < 4 ? 'default' : 'secondary'}>
                        {index < 4 ? 'Deployed' : 'Standby'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EnhancedDisasterMode;
