
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
  Tag,
  Navigation
} from 'lucide-react';
import { calculateHospitalMatch, Location } from '@/utils/hospitalUtils';
import { jaipurHospitals, calculateDistanceAndETA } from '@/data/hospitals';
import MapView from '@/components/MapView';
import { useToast } from '@/hooks/use-toast';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';

const Hospitals = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [rankedHospitals, setRankedHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false);

  // Get user's location on component mount
  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Load and rank hospitals when location or search params change
  useEffect(() => {
    if (!currentLocation) return;

    try {
      // Check if we have specialty tags from the URL
      const specialtyTags = searchParams.get('specialties')?.split(',') || [];
      const criticalCase = searchParams.get('critical') === 'true';
      
      // Calculate distances for all hospitals
      const hospitalsWithDistance = calculateDistanceAndETA(jaipurHospitals, currentLocation);
      
      // Apply hospital matching algorithm
      const matchedHospitals = hospitalsWithDistance.map(hospital => {
        const matchResult = calculateHospitalMatch(hospital, specialtyTags, criticalCase, currentLocation);
        return {
          ...hospital,
          matchScore: matchResult.matchScore,
          matchReason: matchResult.matchReason,
          promoted: matchResult.promoted,
          matchedSpecialties: matchResult.matchedSpecialties || [],
          promotedDueToSpecialty: matchResult.promoted
        };
      }).sort((a, b) => b.matchScore - a.matchScore);
      
      setRankedHospitals(matchedHospitals);
      setSelectedHospital(matchedHospitals[0] || null);
    } catch (error) {
      console.error("Error ranking hospitals:", error);
      toast({
        title: "Error",
        description: "Failed to rank hospitals. Please try again.",
        variant: "destructive"
      });
    }
  }, [currentLocation, searchParams]);

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          setCurrentLocation(location);
          reverseGeocode(location);
          setIsLoadingLocation(false);
          
          toast({
            title: "Location Updated",
            description: "Your current location has been successfully retrieved.",
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          handleLocationError(error);
          // Fallback to a default Jaipur location
          setCurrentLocation({ lat: 26.9124, lng: 75.7873 });
          setIsLoadingLocation(false);
        },
        { 
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError("Geolocation is not supported by this browser.");
      setIsLoadingLocation(false);
      // Fallback to a default Jaipur location
      setCurrentLocation({ lat: 26.9124, lng: 75.7873 });
    }
  };

  const handleLocationError = (error) => {
    let errorMessage = "Unable to retrieve your location.";
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "Location access was denied. Please enable location services in your browser settings.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information is unavailable. Please try again later.";
        break;
      case error.TIMEOUT:
        errorMessage = "Location request timed out. Please try again.";
        break;
      default:
        errorMessage = `Location error: ${error.message}`;
    }
    
    setLocationError(errorMessage);
    
    toast({
      title: "Location Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const reverseGeocode = async (location) => {
    try {
      console.log("Attempting reverse geocoding for:", location);
      
      // Using Nominatim OpenStreetMap service
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
      );

      const data = await response.json();
      console.log("Geocoding API response:", data);

      if (data.display_name) {
        const address = data.display_name;
        console.log("Found address:", address);
        setCurrentLocation((prev) =>
          prev ? { ...prev, address } : { ...location, address }
        );
      } else {
        console.warn("No results from geocoding API");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const filteredHospitals = rankedHospitals.filter(hospital => 
    hospital.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    hospital.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleRouteClick = (hospital) => {
    if (!currentLocation) {
      toast({
        title: "Location Required",
        description: "Please enable location services to get directions.",
        variant: "destructive"
      });
      return;
    }
    
    setSelectedHospital(hospital);
    setIsMapOpen(true);
  };

  const handleCallHospital = (phone) => {
    window.open(`tel:${phone}`, '_self');
  };

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
          <Button variant="outline" className="flex items-center gap-2" onClick={getCurrentLocation}>
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Update Location</span>
          </Button>
        </div>
      </div>

      {locationError && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start gap-2">
          <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Location Error</p>
            <p className="text-sm">{locationError}</p>
          </div>
        </div>
      )}

      {currentLocation?.address && (
        <div className="bg-muted/50 p-3 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-medical" />
            <div>
              <p className="text-sm font-medium">Your Location</p>
              <p className="text-xs text-muted-foreground">{currentLocation.address}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={getCurrentLocation}
            disabled={isLoadingLocation}
          >
            Refresh
          </Button>
        </div>
      )}

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
                {filteredHospitals.length > 0 ? (
                  filteredHospitals.map(hospital => {
                    const isPromoted = hospital.promotedDueToSpecialty;
                    const matchedSpecialties = hospital.matchedSpecialties || [];
                    
                    return (
                      <div 
                        key={hospital.id}
                        onClick={() => setSelectedHospital(hospital)}
                        className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 flex justify-between items-center ${selectedHospital?.id === hospital.id ? 'bg-gray-50 border-l-4 border-medical' : ''}`}
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
                              <span>{hospital.distance} km</span>
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
                              {matchedSpecialties.slice(0, 2).map((specialty, index) => (
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
                  })
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    {isLoadingLocation ? 'Loading hospitals...' : 'No hospitals match your search criteria'}
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
              {selectedHospital && (
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
                          ${selectedHospital.promotedDueToSpecialty ? 'border-2 border-white outline outline-1 outline-medical' : ''}
                        `}>
                          {selectedHospital.matchScore}% Match
                        </Badge>
                        
                        {selectedHospital.promotedDueToSpecialty && (
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
                      <div className="bg-muted/50 p-3 rounded-md">
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          Distance
                        </div>
                        <div className="font-medium mt-1">{selectedHospital.distance} km</div>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          ETA
                        </div>
                        <div className="font-medium mt-1">{selectedHospital.eta} min</div>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          Available Beds
                        </div>
                        <div className="font-medium mt-1">{selectedHospital.availableBeds}</div>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Wait Time
                        </div>
                        <div className="font-medium mt-1">{selectedHospital.waitTime} min</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">Hospital Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedHospital.specialties.map((specialty, index) => {
                          let icon;
                          if (specialty.includes('Cardiac') || specialty.includes('Cardio')) icon = <Heart className="h-4 w-4" />;
                          else if (specialty.includes('Neuro') || specialty.includes('Stroke')) icon = <Brain className="h-4 w-4" />;
                          else if (specialty.includes('Trauma') || specialty.includes('Ortho')) icon = <Bone className="h-4 w-4" />;
                          else icon = <Bed className="h-4 w-4" />;

                          // Check if this specialty is one of the matched ones for highlighting
                          const isMatchedSpecialty = selectedHospital.matchedSpecialties?.includes(specialty);

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
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-2 w-full justify-start"
                          onClick={() => handleCallHospital(selectedHospital.phone)}
                        >
                          <Phone className="h-4 w-4 text-medical" />
                          {selectedHospital.phone}
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-semibold">Emergency Department</h3>
                        <p className="text-sm">
                          {selectedHospital.specialties.includes('Trauma Center') 
                            ? 'Trauma Center with 24/7 emergency services'
                            : '24/7 emergency services available'}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold mb-3">Patient Matching</h3>
                      <p className="text-sm mb-4">
                        {selectedHospital.promotedDueToSpecialty 
                          ? `This hospital has been prioritized due to specialty match with the patient's needs: ${selectedHospital.matchedSpecialties?.join(', ')}.`
                          : `This hospital is recommended based on proximity and available capacity for immediate care.`
                        }
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          className="medical-btn flex-1 flex items-center gap-2" 
                          onClick={() => handleRouteClick(selectedHospital)}
                        >
                          <Navigation className="h-4 w-4" />
                          Route to This Hospital
                        </Button>
                        <Button 
                          variant="outline" 
                          className="flex-1"
                          onClick={() => handleCallHospital(selectedHospital.phone)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Contact ED
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="map" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapIcon className="h-5 w-5" />
                    Hospital Locations
                  </CardTitle>
                  <CardDescription>
                    View and navigate to recommended hospitals
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-[400px] relative rounded-md">
                  <MapView 
                    userLocation={currentLocation} 
                    destination={selectedHospital ? { lat: selectedHospital.lat, lng: selectedHospital.lng } : null}
                    hospitalName={selectedHospital?.name}
                  />
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full medical-btn flex items-center gap-2"
                    onClick={() => handleRouteClick(selectedHospital)}
                    disabled={!selectedHospital}
                  >
                    <Navigation className="h-4 w-4" />
                    Get Directions to {selectedHospital?.name || 'Hospital'}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Full screen map drawer for mobile */}
      <Drawer open={isMapOpen} onOpenChange={setIsMapOpen}>
        <DrawerContent className="h-[90vh]">
          <DrawerHeader>
            <DrawerTitle>Route to {selectedHospital?.name}</DrawerTitle>
            <DrawerDescription>Real-time navigation and directions</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 h-[calc(90vh-8rem)]">
            <MapView 
              userLocation={currentLocation} 
              destination={selectedHospital ? { lat: selectedHospital.lat, lng: selectedHospital.lng } : null}
              hospitalName={selectedHospital?.name}
            />
          </div>
          <DrawerFooter>
            <Button 
              className="medical-btn"
              onClick={() => {
                if (!currentLocation || !selectedHospital) return;
                
                const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.lat},${currentLocation.lng}&destination=${selectedHospital.lat},${selectedHospital.lng}&travelmode=driving`;
                window.open(url, '_blank');
              }}
            >
              Open in Google Maps
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};

export default Hospitals;
