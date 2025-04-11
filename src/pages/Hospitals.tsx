
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Search,
  MapPin,
  Clock,
  Heart,
  Brain,
  Bone,
  Bed,
  Phone,
  SendHorizontal,
  ListFilter,
  Map as MapIcon
} from 'lucide-react';

// Mock hospital data
const hospitalData = [
  {
    id: 1,
    name: 'Memorial General Hospital',
    distance: 2.4,
    eta: 8,
    specialties: ['Trauma Center', 'Cardiac Care'],
    availableBeds: 5,
    waitTime: 12,
    address: '123 Medical Ave, Metropolis',
    phone: '(555) 123-4567',
    matchScore: 95,
  },
  {
    id: 2,
    name: 'City Medical Center',
    distance: 3.8,
    eta: 12,
    specialties: ['Stroke Center', 'Pediatric'],
    availableBeds: 8,
    waitTime: 15,
    address: '456 Health Blvd, Metropolis',
    phone: '(555) 987-6543',
    matchScore: 87,
  },
  {
    id: 3,
    name: 'University Hospital',
    distance: 5.2,
    eta: 17,
    specialties: ['Neuro Center', 'Burn Unit'],
    availableBeds: 2,
    waitTime: 20,
    address: '789 University Dr, College Town',
    phone: '(555) 789-0123',
    matchScore: 81,
  },
  {
    id: 4,
    name: 'Westside Medical',
    distance: 6.7,
    eta: 22,
    specialties: ['General Care', 'Orthopedics'],
    availableBeds: 12,
    waitTime: 8,
    address: '321 West Ave, Westside',
    phone: '(555) 456-7890',
    matchScore: 73,
  }
];

const Hospitals = () => {
  const [selectedHospital, setSelectedHospital] = useState(hospitalData[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredHospitals = hospitalData.filter(hospital => 
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1>Hospital Matching</h1>
          <p className="text-muted-foreground">Find the best hospital for your patient</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search hospitals..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <ListFilter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-medical">
            <CardHeader className="bg-medical/10 pb-2">
              <CardTitle className="text-medical flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Recommended Hospitals
              </CardTitle>
              <CardDescription>
                Ranked by match to patient needs
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <div className="divide-y">
                {filteredHospitals.map(hospital => (
                  <div 
                    key={hospital.id}
                    onClick={() => setSelectedHospital(hospital)}
                    className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 flex justify-between items-center ${selectedHospital.id === hospital.id ? 'bg-gray-50 border-l-4 border-medical' : ''}`}
                  >
                    <div>
                      <h3 className="font-medium">{hospital.name}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          <span>{hospital.distance} mi</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>ETA {hospital.eta} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bed className="h-3 w-3" />
                          <span>{hospital.availableBeds} beds</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={`${hospital.matchScore >= 90 ? 'bg-medical' : hospital.matchScore >= 80 ? 'bg-success' : 'bg-muted'}`}>
                      {hospital.matchScore}%
                    </Badge>
                  </div>
                ))}
                {filteredHospitals.length === 0 && (
                  <div className="p-6 text-center text-muted-foreground">
                    No hospitals match your search criteria
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">Hospital Details</TabsTrigger>
              <TabsTrigger value="map">Map View</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedHospital.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1 mt-1">
                        <MapPin className="h-3 w-3" />
                        {selectedHospital.address}
                      </CardDescription>
                    </div>
                    <Badge className={`${selectedHospital.matchScore >= 90 ? 'bg-medical' : selectedHospital.matchScore >= 80 ? 'bg-success' : 'bg-muted'}`}>
                      {selectedHospital.matchScore}% Match
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="vital-card">
                      <div className="vital-label flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Distance
                      </div>
                      <div className="vital-value">{selectedHospital.distance} mi</div>
                    </div>
                    <div className="vital-card">
                      <div className="vital-label flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        ETA
                      </div>
                      <div className="vital-value">{selectedHospital.eta} min</div>
                    </div>
                    <div className="vital-card">
                      <div className="vital-label flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        Available Beds
                      </div>
                      <div className="vital-value">{selectedHospital.availableBeds}</div>
                    </div>
                    <div className="vital-card">
                      <div className="vital-label flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Wait Time
                      </div>
                      <div className="vital-value">{selectedHospital.waitTime} min</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Hospital Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedHospital.specialties.map((specialty, index) => {
                        let icon;
                        if (specialty.includes('Cardiac')) icon = <Heart className="h-4 w-4" />;
                        else if (specialty.includes('Neuro') || specialty.includes('Stroke')) icon = <Brain className="h-4 w-4" />;
                        else if (specialty.includes('Trauma') || specialty.includes('Orthopedics')) icon = <Bone className="h-4 w-4" />;
                        else icon = <Bed className="h-4 w-4" />;

                        return (
                          <Badge key={index} variant="outline" className="flex items-center gap-1 py-1 px-3">
                            {icon}
                            {specialty}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Contact Information</h3>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-medical" />
                        {selectedHospital.phone}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold">Emergency Department</h3>
                      <p className="text-sm">
                        Level II Trauma Center with 24/7 emergency services
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h3 className="text-lg font-semibold mb-3">Patient Matching</h3>
                    <p className="text-sm mb-4">
                      This hospital has specialties matching the patient's cardiac symptoms
                      with available capacity for immediate care.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button className="medical-btn flex-1 flex items-center gap-2">
                        <SendHorizontal className="h-4 w-4" />
                        Route to This Hospital
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Contact ED
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="map" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapIcon className="h-5 w-5" />
                    Hospital Locations
                  </CardTitle>
                  <CardDescription>
                    View recommended hospitals on the map
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-96 bg-gray-100 relative rounded-md flex items-center justify-center">
                  <div className="text-center">
                    <MapIcon className="h-16 w-16 text-muted-foreground mb-4 mx-auto" />
                    <p className="text-muted-foreground">
                      Interactive map will be available in the next update
                    </p>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full medical-btn">
                    Get Directions to {selectedHospital.name}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Hospitals;
