
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useSearchParams } from 'react-router-dom';
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
  Map as MapIcon,
  ArrowUp,
  Tag
} from 'lucide-react';
import { matchHospitalsToPatient } from '@/lib/patientUtils';

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
  const [searchParams] = useSearchParams();
  const [selectedHospital, setSelectedHospital] = useState(hospitalData[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [rankedHospitals, setRankedHospitals] = useState(hospitalData);

  useEffect(() => {
    // Check if we have specialty tags from the URL
    const specialtyTags = searchParams.get('specialties')?.split(',') || [];
    const criticalCase = searchParams.get('critical') === 'true';
    
    // Demo vital signs for testing
    const demoVitals = criticalCase ? {
      heart_rate: 130,
      bp_systolic: 90,
      bp_diastolic: 60,
      spo2: 91,
      temperature: 38.5,
      respiratory_rate: 24,
      gcs: 12,
      pain_level: 8
    } : null;
    
    // Demo AI assessment
    const demoAssessment = specialtyTags.length > 0 ? {
      clinical_probability: searchParams.get('assessment') || "Probable case requiring specialized care",
      care_recommendations: "Transfer to appropriate specialty unit. Monitor vital signs closely.",
      specialty_tags: specialtyTags
    } : undefined;
    
    // Use the hospital matching algorithm
    const matchedHospitals = matchHospitalsToPatient(hospitalData, demoVitals, demoAssessment);
    setRankedHospitals(matchedHospitals);
    setSelectedHospital(matchedHospitals[0]);
  }, [searchParams]);

  const filteredHospitals = rankedHospitals.filter(hospital => 
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
                {filteredHospitals.map(hospital => {
                  const isPromoted = (hospital as any).promotedDueToSpecialty;
                  const matchedSpecialties = (hospital as any).matchedSpecialties || [];
                  
                  return (
                    <div 
                      key={hospital.id}
                      onClick={() => setSelectedHospital(hospital)}
                      className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 flex justify-between items-center ${selectedHospital.id === hospital.id ? 'bg-gray-50 border-l-4 border-medical' : ''}`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{hospital.name}</h3>
                          {isPromoted && (
                            <Badge className="bg-medical/20 text-medical border-medical flex items-center gap-1 p-1">
                              <ArrowUp className="h-3 w-3" />
                            </Badge>
                          )}
                        </div>
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
                        {isPromoted && matchedSpecialties.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {matchedSpecialties.slice(0, 2).map((specialty: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs py-0 px-1 bg-medical/5 text-medical border-medical/20">
                                {specialty}
                              </Badge>
                            ))}
                            {matchedSpecialties.length > 2 && (
                              <Badge variant="outline" className="text-xs py-0 px-1">
                                +{matchedSpecialties.length - 2} more
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                      <Badge className={`
                        ${hospital.matchScore >= 90 ? 'bg-medical' : 
                        hospital.matchScore >= 80 ? 'bg-success' : 
                        'bg-muted'} 
                        ${isPromoted ? 'border-2 border-white outline outline-1 outline-medical' : ''}
                      `}>
                        {hospital.matchScore}%
                      </Badge>
                    </div>
                  );
                })}
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
                    <div className="flex flex-col items-end gap-1">
                      <Badge className={`
                        ${selectedHospital.matchScore >= 90 ? 'bg-medical' : 
                        selectedHospital.matchScore >= 80 ? 'bg-success' : 
                        'bg-muted'}
                        ${(selectedHospital as any).promotedDueToSpecialty ? 'border-2 border-white outline outline-1 outline-medical' : ''}
                      `}>
                        {selectedHospital.matchScore}% Match
                      </Badge>
                      
                      {(selectedHospital as any).promotedDueToSpecialty && (
                        <Badge variant="outline" className="flex items-center gap-1 bg-medical/10 text-medical border-medical/20">
                          <Tag className="h-3 w-3" />
                          <span>Specialty Promoted</span>
                        </Badge>
                      )}
                    </div>
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

                        // Check if this specialty is one of the matched ones for highlighting
                        const isMatchedSpecialty = (selectedHospital as any).matchedSpecialties?.includes(specialty);

                        return (
                          <Badge 
                            key={index} 
                            variant="outline" 
                            className={`flex items-center gap-1 py-1 px-3 ${
                              isMatchedSpecialty ? 'bg-medical/10 text-medical border-medical' : ''
                            }`}
                          >
                            {icon}
                            {specialty}
                            {isMatchedSpecialty && <ArrowUp className="h-3 w-3 ml-1" />}
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
                      {(selectedHospital as any).promotedDueToSpecialty 
                        ? `This hospital has been prioritized due to specialty match with the patient's needs: ${(selectedHospital as any).matchedSpecialties?.join(', ')}.`
                        : `This hospital is recommended based on proximity and available capacity for immediate care.`
                      }
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
