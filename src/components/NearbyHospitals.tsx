
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Navigation, Clock, Bed, BadgePercent, Phone, AlertTriangle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Hospital {
  id: number;
  name: string;
  address: string;
  distance: number; // in km
  lat: number;
  lng: number;
  matchScore: number;
  availableBeds: number;
  icuBeds: number;
  waitTime: number; // in minutes
  eta: number; // in minutes
  phone: string;
  specialties: string[];
}

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

const NearbyHospitals = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  const predefinedLocations = [
    { name: 'Mysore', lat: 12.2958, lng: 76.6394 },
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
    { name: 'Guwahati', lat: 26.1445, lng: 91.7362 },
    { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 }
  ];
  
  // Function to get user's current location
  const getUserLocation = () => {
    setIsLoading(true);
    setError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          setCurrentLocation(userLocation);
          
          // Fetch address from coordinates
          getAddressFromCoords(userLocation);
          
          // Fetch nearby hospitals
          fetchNearbyHospitals(userLocation);
          
          setIsLoading(false);
          
          toast({
            title: "Location accessed",
            description: "Found your current location. Showing nearby hospitals.",
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError('Unable to access your location. Please allow location access or select a city manually.');
          setIsLoading(false);
          
          toast({
            variant: "destructive",
            title: "Location error",
            description: "Could not access your location. Please allow location access or select a city."
          });
        }
      );
    } else {
      setError('Geolocation is not supported by your browser. Please select a city manually.');
      setIsLoading(false);
      
      toast({
        variant: "destructive",
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation. Please select a city manually."
      });
    }
  };
  
  // Function to get address from coordinates using Nominatim OpenStreetMap service
  const getAddressFromCoords = async (location: Location) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
      );
      
      const data = await response.json();
      
      if (data && data.display_name) {
        setCurrentLocation({
          ...location,
          address: data.display_name
        });
      }
    } catch (error) {
      console.error('Error getting address:', error);
    }
  };
  
  // Function to fetch nearby hospitals (mock data for now)
  const fetchNearbyHospitals = (location: Location) => {
    // Sample mock data for hospitals
    const mockHospitals: Hospital[] = [
      {
        id: 1,
        name: "Apex Trauma Center",
        address: "123 Medical Blvd, Cityville",
        distance: 2.1,
        lat: location.lat + 0.01,
        lng: location.lng + 0.02,
        matchScore: 93,
        availableBeds: 12,
        icuBeds: 3,
        waitTime: 5,
        eta: 8,
        phone: "+91 9876543210",
        specialties: ["Trauma Care", "Emergency Medicine", "Neurology"]
      },
      {
        id: 2,
        name: "CityCare Hospital",
        address: "456 Health Street, Townsburg",
        distance: 4.6,
        lat: location.lat - 0.02,
        lng: location.lng + 0.03,
        matchScore: 70,
        availableBeds: 8,
        icuBeds: 1,
        waitTime: 15,
        eta: 16,
        phone: "+91 9876543211",
        specialties: ["Cardiology", "General Surgery", "Pediatrics"]
      },
      {
        id: 3,
        name: "Global Health Hub",
        address: "789 Wellness Road, Metropolis",
        distance: 7.9,
        lat: location.lat + 0.04,
        lng: location.lng - 0.01,
        matchScore: 40,
        availableBeds: 3,
        icuBeds: 0,
        waitTime: 25,
        eta: 22,
        phone: "+91 9876543212",
        specialties: ["Internal Medicine", "Gynecology", "Dermatology"]
      },
      {
        id: 4,
        name: "Community Medical Center",
        address: "101 Care Drive, Villagetown",
        distance: 3.5,
        lat: location.lat - 0.01,
        lng: location.lng - 0.02,
        matchScore: 85,
        availableBeds: 6,
        icuBeds: 2,
        waitTime: 10,
        eta: 12,
        phone: "+91 9876543213",
        specialties: ["Emergency Medicine", "Orthopedics", "Family Medicine"]
      },
      {
        id: 5,
        name: "Sunshine Memorial Hospital",
        address: "202 Healing Path, Sunnyville",
        distance: 9.2,
        lat: location.lat + 0.03,
        lng: location.lng + 0.04,
        matchScore: 55,
        availableBeds: 15,
        icuBeds: 4,
        waitTime: 8,
        eta: 25,
        phone: "+91 9876543214",
        specialties: ["Oncology", "Cardiology", "Rehabilitation"]
      }
    ];
    
    // Calculate random distances based on actual location
    const hospitalsWithUpdatedDistances = mockHospitals.map(hospital => {
      // Random distance between 1-15 km
      const randomDistance = parseFloat((1 + Math.random() * 14).toFixed(1));
      // ETA: roughly 2 mins per km + some variation
      const eta = Math.round(randomDistance * 2 + Math.random() * 5);
      
      return {
        ...hospital,
        distance: randomDistance,
        eta: eta
      };
    });
    
    // Sort by distance
    const sortedHospitals = hospitalsWithUpdatedDistances.sort((a, b) => a.distance - b.distance);
    
    setHospitals(sortedHospitals);
  };
  
  // Handle manual location selection
  const handleLocationSelect = (locationName: string) => {
    const selectedLoc = predefinedLocations.find(loc => loc.name === locationName);
    
    if (selectedLoc) {
      setSelectedLocation(locationName);
      setCurrentLocation({
        lat: selectedLoc.lat,
        lng: selectedLoc.lng,
        address: `${locationName}, India`
      });
      
      fetchNearbyHospitals({
        lat: selectedLoc.lat,
        lng: selectedLoc.lng
      });
      
      toast({
        title: "Location updated",
        description: `Showing hospitals near ${locationName}`
      });
    }
  };
  
  // Get match score color
  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500 text-white";
    if (score >= 60) return "bg-yellow-500 text-white";
    return "bg-red-500 text-white";
  };
  
  // Get match indicator emoji
  const getMatchIndicator = (score: number) => {
    if (score >= 80) return "🟢";
    if (score >= 60) return "🟡";
    return "🔴";
  };
  
  // Function to get directions to hospital
  const getDirections = (hospital: Hospital) => {
    if (!currentLocation) {
      toast({
        variant: "destructive",
        title: "No location",
        description: "Your current location is needed to get directions."
      });
      return;
    }
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.lat},${currentLocation.lng}&destination=${hospital.lat},${hospital.lng}&travelmode=driving`;
    window.open(url, '_blank');
    
    toast({
      title: "Opening directions",
      description: `Getting directions to ${hospital.name}`
    });
  };
  
  // Call hospital
  const callHospital = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };
  
  // Initialize location on component mount
  useEffect(() => {
    getUserLocation();
  }, []);
  
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{t('hospitals.nearby')}</CardTitle>
        <CardDescription>{t('hospitals.description')}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Location section */}
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            {currentLocation && currentLocation.address && (
              <div className="bg-muted/50 p-3 rounded-md flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <div className="text-sm">
                  <div className="font-medium">Your Location</div>
                  <div className="text-muted-foreground text-xs">{currentLocation.address}</div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-destructive/10 p-3 rounded-md flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <div className="text-sm text-destructive">{error}</div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={getUserLocation} 
              variant="outline" 
              className="flex items-center gap-2"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              {isLoading ? "Getting location..." : "Use my location"}
            </Button>
            
            <Select value={selectedLocation || ""} onValueChange={handleLocationSelect}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select city" />
              </SelectTrigger>
              <SelectContent>
                {predefinedLocations.map(location => (
                  <SelectItem key={location.name} value={location.name}>{location.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
        
        {/* Hospitals list */}
        {!isLoading && hospitals.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Hospitals near you (within 10 km):</h3>
            
            <div className="space-y-3">
              {hospitals.map(hospital => (
                <div 
                  key={hospital.id} 
                  className="border rounded-lg p-4 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <h4 className="font-medium text-lg flex items-center gap-2">
                        {hospital.name} 
                        <Badge 
                          className={`${getMatchScoreColor(hospital.matchScore)} ml-2 flex items-center gap-1`}
                        >
                          <BadgePercent className="h-3 w-3" />
                          {hospital.matchScore}% match
                        </Badge>
                      </h4>
                      
                      <div className="text-sm text-muted-foreground flex items-center flex-wrap gap-x-4 gap-y-1 mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {hospital.distance} km
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          ETA: {hospital.eta} min
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Bed className="h-3.5 w-3.5" />
                          {hospital.availableBeds} beds available
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full sm:w-auto"
                        onClick={() => callHospital(hospital.phone)}
                      >
                        <Phone className="h-3.5 w-3.5 mr-1" />
                        Call
                      </Button>
                      
                      <Button 
                        size="sm" 
                        className="w-full sm:w-auto"
                        onClick={() => getDirections(hospital)}
                      >
                        <Navigation className="h-3.5 w-3.5 mr-1" />
                        Directions
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {hospital.specialties.map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!isLoading && hospitals.length === 0 && !error && (
          <div className="text-center p-8 border rounded-lg bg-muted/20">
            <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <h3 className="text-lg font-medium mb-1">No hospitals found</h3>
            <p className="text-sm text-muted-foreground">
              Try changing your location or increasing the search radius.
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Button 
          variant="ghost" 
          onClick={getUserLocation}
          disabled={isLoading}
        >
          <MapPin className="h-4 w-4 mr-2" />
          Refresh Hospital List
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NearbyHospitals;
