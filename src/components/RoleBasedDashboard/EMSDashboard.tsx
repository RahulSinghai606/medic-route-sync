
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, MapPin, Clock, User, Heart, Activity, Navigation } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EMSDashboard: React.FC = () => {
  const [activePatients, setActivePatients] = useState([
    {
      id: 'P001',
      name: 'John Doe',
      condition: 'Cardiac Arrest',
      severity: 'Critical',
      location: 'Downtown Plaza',
      eta: 8,
      vitals: { hr: 45, bp: '90/60', spo2: 88 }
    },
    {
      id: 'P002', 
      name: 'Sarah Wilson',
      condition: 'Trauma',
      severity: 'Urgent',
      location: 'Highway 101',
      eta: 12,
      vitals: { hr: 95, bp: '110/70', spo2: 94 }
    }
  ]);

  const nearbyHospitals = [
    { name: 'City General', distance: '2.3 km', eta: '8 min', icuBeds: 3, status: 'Available' },
    { name: 'Metro Hospital', distance: '3.1 km', eta: '12 min', icuBeds: 1, status: 'Limited' },
    { name: 'Regional Medical', distance: '4.5 km', eta: '15 min', icuBeds: 5, status: 'Available' }
  ];

  return (
    <div className="space-y-6">
      {/* EMS Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">EMS Command Center</h1>
          <p className="text-muted-foreground">Patient triage and hospital routing</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <Activity className="h-4 w-4 mr-1" />
            Unit AMB-07 Active
          </Badge>
          <Button className="bg-red-600 hover:bg-red-700">
            <AlertCircle className="h-4 w-4 mr-2" />
            Emergency Alert
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Active Patients</p>
                <p className="text-2xl font-bold">{activePatients.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Available Hospitals</p>
                <p className="text-2xl font-bold">7</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Response Time</p>
                <p className="text-2xl font-bold">6.2m</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm text-muted-foreground">Success Rate</p>
                <p className="text-2xl font-bold">94%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patients">Active Patients</TabsTrigger>
          <TabsTrigger value="routing">Hospital Routing</TabsTrigger>
          <TabsTrigger value="dispatch">Dispatch Queue</TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="space-y-4">
          <div className="grid gap-4">
            {activePatients.map((patient) => (
              <Card key={patient.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{patient.name}</h3>
                        <Badge variant={patient.severity === 'Critical' ? 'destructive' : 'secondary'}>
                          {patient.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{patient.condition}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {patient.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          ETA: {patient.eta}min
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm space-y-1">
                        <div>HR: {patient.vitals.hr}</div>
                        <div>BP: {patient.vitals.bp}</div>
                        <div>SpO2: {patient.vitals.spo2}%</div>
                      </div>
                      <Button size="sm" className="mt-2">
                        <Navigation className="h-4 w-4 mr-1" />
                        Route
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="routing" className="space-y-4">
          <div className="grid gap-4">
            {nearbyHospitals.map((hospital, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{hospital.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{hospital.distance}</span>
                        <span>ETA: {hospital.eta}</span>
                        <span>ICU Beds: {hospital.icuBeds}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={hospital.status === 'Available' ? 'default' : 'secondary'}>
                        {hospital.status}
                      </Badge>
                      <Button size="sm">Select</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dispatch">
          <Card>
            <CardHeader>
              <CardTitle>Dispatch Queue</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No pending dispatch requests</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EMSDashboard;
