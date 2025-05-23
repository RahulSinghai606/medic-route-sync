
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Navigation, Clock, Bed, BadgePercent, Phone, AlertTriangle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { comprehensiveHospitals, calculateDistanceAndETA, ComprehensiveHospital } from '@/data/comprehensiveHospitals';

interface Location {
  lat: number;
  lng: number;
  address?: string;
}

const NearbyHospitals = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [hospitals, setHospitals] = useState<ComprehensiveHospital[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  const predefinedLocations = [
    { name: 'Mumbai', lat: 19.0760, lng: 72.8777 },
    { name: 'Delhi', lat: 28.7041, lng: 77.1025 },
    { name: 'Bengaluru', lat: 12.9716, lng: 77.5946 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 }
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
            title: t('location.updated'),
            description: t('location.success'),
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          setError(t('location.error'));
          setIsLoading(false);
          
          toast({
            variant: "destructive",
            title: t('location.error.title'),
            description: t('location.error')
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
  
  // Function to fetch nearby hospitals using comprehensive hospital data
  const fetchNearbyHospitals = (location: Location) => {
    const hospitalsWithDistance = calculateDistanceAndETA(comprehensiveHospitals, location);
    
    // Filter hospitals within 30km and sort by distance
    const nearbyHospitals = hospitalsWithDistance
      .filter(hospital => (hospital.distance || 0) <= 30)
      .sort((a, b) => (a.distance || 0) - (b.distance || 0))
      .map(hospital => ({
        ...hospital,
        matchScore: Math.max(20, Math.min(95, Math.round(100 - (hospital.distance || 0) * 3 + Math.random() * 20)))
      }));
    
    setHospitals(nearbyHospitals);
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
        title: t('location.updated'),
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
  
  // Function to get directions to hospital (FIXED)
  const getDirections = (hospital: ComprehensiveHospital) => {
    if (!currentLocation) {
      toast({
        variant: "destructive",
        title: t('error.no.location'),
        description: t('error.directions')
      });
      return;
    }
    
    // Create proper Google Maps directions URL
    const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.lat},${currentLocation.lng}&destination=${hospital.lat},${hospital.lng}&travelmode=driving`;
    window.open(url, '_blank');
    
    toast({
      title: t('error.opening.directions'),
      description: `${t('hospitals.getting.directions')} ${hospital.name}`
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
                  <div className="font-medium">{t('your.location')}</div>
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
              {isLoading ? t('getting.location') : t('use.location')}
            </Button>
            
            <Select value={selectedLocation || ""} onValueChange={handleLocationSelect}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('select.city')} />
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
            <h3 className="text-lg font-medium">{t('hospitals.nearby')} ({t('within.radius')}):</h3>
            
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
                        <Badge className="bg-muted text-muted-foreground text-xs">
                          {t(`hospitals.type.${hospital.type.toLowerCase()}`)}
                        </Badge>
                        <Badge 
                          className={`${getMatchScoreColor(hospital.matchScore || 0)} ml-2 flex items-center gap-1`}
                        >
                          <BadgePercent className="h-3 w-3" />
                          {hospital.matchScore || 0}% {t('match')}
                        </Badge>
                      </h4>
                      
                      <div className="text-sm text-muted-foreground flex items-center flex-wrap gap-x-4 gap-y-1 mt-1">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {hospital.distance || 0} {t('km')}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {t('eta.label')}: {hospital.eta || 0} {t('min')}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Bed className="h-3.5 w-3.5" />
                          {hospital.availableBeds} {t('hospitals.beds').toLowerCase()}
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
                        {t('hospitals.call')}
                      </Button>
                      
                      <Button 
                        size="sm" 
                        className="w-full sm:w-auto"
                        onClick={() => getDirections(hospital)}
                      >
                        <Navigation className="h-3.5 w-3.5 mr-1" />
                        {t('hospitals.directions')}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-2 flex flex-wrap gap-1">
                    {hospital.specialties.slice(0, 4).map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {hospital.specialties.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{hospital.specialties.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {!isLoading && hospitals.length === 0 && !error && (
          <div className="text-center p-8 border rounded-lg bg-muted/20">
            <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <h3 className="text-lg font-medium mb-1">{t('no.hospitals.found')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('no.hospitals.description')}
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
          {t('hospitals.refresh')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NearbyHospitals;
