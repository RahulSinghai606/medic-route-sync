
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Navigation, Clock, Bed, BadgePercent, Phone, AlertTriangle, Loader2, Copy, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { comprehensiveHospitals, calculateDistanceAndETA, ComprehensiveHospital } from '@/data/comprehensiveHospitals';
import { calculateHospitalMatch } from '@/utils/hospitalUtils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Mysuru', lat: 12.2958, lng: 76.6394 },
    { name: 'Mandya', lat: 12.5230, lng: 76.8958 }
  ];
  
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
          getAddressFromCoords(userLocation);
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
  
  const fetchNearbyHospitals = (location: Location) => {
    const mysuruHospitals: ComprehensiveHospital[] = [
      {
        id: 1001,
        name: 'JSS Hospital Mysuru',
        lat: 12.3037,
        lng: 76.6421,
        type: 'Trust',
        specialties: ['Cardiology', 'Neurology', 'Oncology', 'Emergency Medicine', 'Orthopedics'],
        availableBeds: 45,
        icuBeds: 12,
        waitTime: 15,
        address: 'JSS Medical College, SS Nagara, Mysuru, Karnataka 570015',
        phone: '+91-821-2548000',
        city: 'Mysuru',
        state: 'Karnataka',
        pincode: '570015',
        emergencyServices: true,
        traumaCenter: true,
        accreditation: ['NABH']
      },
      {
        id: 1002,
        name: 'Apollo BGS Hospitals Mysuru',
        lat: 12.2677,
        lng: 76.6476,
        type: 'Private',
        specialties: ['Cardiac Care', 'Neurosurgery', 'Gastroenterology', 'Emergency Medicine'],
        availableBeds: 32,
        icuBeds: 8,
        waitTime: 12,
        address: 'Adichunchanagiri Road, Kuvempunagar, Mysuru, Karnataka 570023',
        phone: '+91-821-2566000',
        city: 'Mysuru',
        state: 'Karnataka',
        pincode: '570023',
        emergencyServices: true,
        traumaCenter: true,
        accreditation: ['NABH', 'JCI']
      },
      {
        id: 1003,
        name: 'Columbia Asia Hospital Mysuru',
        lat: 12.2847,
        lng: 76.6519,
        type: 'Private',
        specialties: ['General Medicine', 'Pediatrics', 'Orthopedics', 'Emergency Medicine'],
        availableBeds: 28,
        icuBeds: 6,
        waitTime: 18,
        address: 'Kims Hospital Road, V V Mohalla, Mysuru, Karnataka 570002',
        phone: '+91-821-3989999',
        city: 'Mysuru',
        state: 'Karnataka',
        pincode: '570002',
        emergencyServices: true,
        traumaCenter: false,
        accreditation: ['NABH']
      },
      {
        id: 1004,
        name: 'Vikram Hospital Mysuru',
        lat: 12.3156,
        lng: 76.6554,
        type: 'Private',
        specialties: ['Emergency Medicine', 'General Surgery', 'Gynecology', 'Pediatrics'],
        availableBeds: 18,
        icuBeds: 4,
        waitTime: 20,
        address: 'No. 2847/1, Kantharaj Urs Road, Lakshmipuram, Mysuru, Karnataka 570004',
        phone: '+91-821-4006666',
        city: 'Mysuru',
        state: 'Karnataka',
        pincode: '570004',
        emergencyServices: true,
        traumaCenter: false,
        accreditation: ['NABH']
      },
      {
        id: 1005,
        name: 'Care Hospital Mysuru',
        lat: 12.2836,
        lng: 76.6473,
        type: 'Private',
        specialties: ['Cardiology', 'Emergency Medicine', 'Critical Care', 'Trauma Care', 'Neurology'],
        availableBeds: 38,
        icuBeds: 10,
        waitTime: 14,
        address: 'No. 85-86, Bannur Road, Siddarthanagar, Mysuru, Karnataka 570011',
        phone: '+91-821-4203333',
        city: 'Mysuru',
        state: 'Karnataka',
        pincode: '570011',
        emergencyServices: true,
        traumaCenter: true,
        accreditation: ['NABH', 'JCI']
      },
      {
        id: 1006,
        name: 'Basappa Memorial Hospital',
        lat: 12.2958, 
        lng: 76.6242,
        type: 'Government',
        specialties: ['General Medicine', 'Emergency Medicine', 'Trauma Care', 'Orthopedics'],
        availableBeds: 25,
        icuBeds: 5,
        waitTime: 25,
        address: 'Vinoba Road, Jayalakshmipuram, Mysuru, Karnataka 570012',
        phone: '+91-821-2423800',
        city: 'Mysuru',
        state: 'Karnataka',
        pincode: '570012',
        emergencyServices: true,
        traumaCenter: true,
        accreditation: ['NABH']
      }
    ];

    const mandyaHospitals: ComprehensiveHospital[] = [
      {
        id: 2001,
        name: 'Mandya Institute of Medical Sciences',
        lat: 12.5230,
        lng: 76.8958,
        type: 'Government',
        specialties: ['Emergency Medicine', 'General Medicine', 'Surgery', 'Pediatrics'],
        availableBeds: 42,
        icuBeds: 8,
        waitTime: 30,
        address: 'MIMS Campus, Mandya, Karnataka 571401',
        phone: '+91-8232-220008',
        city: 'Mandya',
        state: 'Karnataka',
        pincode: '571401',
        emergencyServices: true,
        traumaCenter: true,
        accreditation: ['NABH']
      },
      {
        id: 2002,
        name: 'District Hospital Mandya',
        lat: 12.5247,
        lng: 76.8945,
        type: 'Government',
        specialties: ['Emergency Medicine', 'General Medicine', 'Trauma Care'],
        availableBeds: 35,
        icuBeds: 6,
        waitTime: 35,
        address: 'Hospital Road, Mandya, Karnataka 571401',
        phone: '+91-8232-222456',
        city: 'Mandya',
        state: 'Karnataka',
        pincode: '571401',
        emergencyServices: true,
        traumaCenter: true,
        accreditation: ['Government']
      },
      {
        id: 2003,
        name: 'Adichunchanagiri Hospital',
        lat: 12.5198,
        lng: 76.8876,
        type: 'Trust',
        specialties: ['Emergency Medicine', 'Cardiology', 'Neurology', 'General Surgery'],
        availableBeds: 28,
        icuBeds: 5,
        waitTime: 22,
        address: 'BG Nagara, Mandya, Karnataka 571448',
        phone: '+91-8232-267676',
        city: 'Mandya',
        state: 'Karnataka',
        pincode: '571448',
        emergencyServices: true,
        traumaCenter: false,
        accreditation: ['NABH']
      }
    ];

    const allHospitals = [...comprehensiveHospitals, ...mysuruHospitals, ...mandyaHospitals];
    const hospitalsWithDistance = calculateDistanceAndETA(allHospitals, location);
    
    const nearbyHospitals = hospitalsWithDistance
      .filter(hospital => (hospital.distance || 0) <= 50)
      .map(hospital => {
        const matchResult = calculateHospitalMatch(hospital, [], false, location);
        return {
          ...hospital,
          matchScore: matchResult.matchScore,
          matchReason: matchResult.matchReason,
          promoted: matchResult.promoted,
          distance: matchResult.distance
        };
      })
      .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
    
    setHospitals(nearbyHospitals);
  };
  
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
  
  const getMatchScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-500 text-white";
    if (score >= 60) return "bg-yellow-500 text-white";
    return "bg-red-500 text-white";
  };
  
  const getDirections = (hospital: ComprehensiveHospital) => {
    if (!currentLocation) {
      toast({
        variant: "destructive",
        title: t('error.no.location'),
        description: t('error.directions')
      });
      return;
    }
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${currentLocation.lat},${currentLocation.lng}&destination=${hospital.lat},${hospital.lng}&travelmode=driving`;
    window.open(url, '_blank');
    
    toast({
      title: t('error.opening.directions'),
      description: `${t('hospitals.getting.directions')} ${hospital.name}`
    });
  };
  
  const callHospital = (phone: string, hospitalName: string) => {
    // Try to initiate a call directly
    const telLink = document.createElement('a');
    telLink.href = `tel:${phone}`;
    telLink.click();
    
    toast({
      title: "Calling Hospital",
      description: `Attempting to call ${hospitalName}`,
    });
  };

  const copyPhoneNumber = (phone: string) => {
    navigator.clipboard.writeText(phone).then(() => {
      toast({
        title: "Phone Number Copied",
        description: `${phone} copied to clipboard`,
      });
    }).catch(() => {
      toast({
        variant: "destructive",
        title: "Copy Failed",
        description: "Unable to copy phone number",
      });
    });
  };

  const CallDialog = ({ hospital }: { hospital: ComprehensiveHospital }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="w-full sm:w-auto"
        >
          <Phone className="h-3.5 w-3.5 mr-1" />
          {t('hospitals.call')}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-medical" />
            Call Hospital
          </DialogTitle>
          <DialogDescription>
            Contact {hospital.name} for emergency services
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted/30 p-4 rounded-lg">
            <h4 className="font-medium text-lg mb-2">{hospital.name}</h4>
            <p className="text-sm text-muted-foreground mb-3">{hospital.address}</p>
            <div className="text-xl font-mono font-bold text-center py-2 bg-white rounded border">
              {hospital.phone}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Button 
              onClick={() => callHospital(hospital.phone, hospital.name)}
              className="medical-btn"
            >
              <Phone className="h-4 w-4 mr-2" />
              Call Now
            </Button>
            <Button 
              variant="outline"
              onClick={() => copyPhoneNumber(hospital.phone)}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Number
            </Button>
          </div>
          <p className="text-xs text-center text-muted-foreground">
            If direct calling doesn't work, use the copied number to dial manually
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
  
  useEffect(() => {
    getUserLocation();
  }, []);
  
  return (
    <Card className="mb-6 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <MapPin className="h-5 w-5 text-medical" />
          {t('hospitals.nearby')}
        </CardTitle>
        <CardDescription className="text-base">{t('hospitals.description')}</CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div>
            {currentLocation && currentLocation.address && (
              <div className="bg-gradient-to-r from-medical/10 to-emergency/10 p-4 rounded-lg flex items-center gap-3 border">
                <MapPin className="h-5 w-5 text-medical" />
                <div className="text-sm">
                  <div className="font-semibold text-base">{t('your.location')}</div>
                  <div className="text-muted-foreground">{currentLocation.address}</div>
                </div>
              </div>
            )}
            
            {error && (
              <div className="bg-destructive/10 p-4 rounded-lg flex items-center gap-3 border border-destructive/20">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                <div className="text-sm text-destructive">{error}</div>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button 
              onClick={getUserLocation} 
              variant="outline" 
              className="flex items-center gap-2 h-11"
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
              {isLoading ? t('getting.location') : t('use.location')}
            </Button>
            
            <Select value={selectedLocation || ""} onValueChange={handleLocationSelect}>
              <SelectTrigger className="w-full sm:w-[200px] h-11">
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
        
        {isLoading && (
          <div className="flex justify-center items-center p-12">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-medical mx-auto mb-4" />
              <p className="text-muted-foreground">Finding nearby hospitals...</p>
            </div>
          </div>
        )}
        
        {!isLoading && hospitals.length > 0 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity className="h-5 w-5 text-medical" />
              {t('hospitals.nearby')} ({hospitals.length} hospitals found):
            </h3>
            
            <div className="space-y-4">
              {hospitals.map(hospital => (
                <div 
                  key={hospital.id} 
                  className="border rounded-xl p-6 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-white to-muted/20"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h4 className="font-semibold text-xl flex items-center gap-2 mb-2">
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
                        {hospital.promoted && (
                          <Badge className="bg-green-500 text-white ml-1">
                            ⭐ {t('promoted')}
                          </Badge>
                        )}
                      </h4>
                      
                      <div className="text-sm text-muted-foreground flex items-center flex-wrap gap-x-6 gap-y-2">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {(hospital.distance || 0).toFixed(1)} {t('km')}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {t('eta.label')}: {hospital.eta || 0} {t('min')}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          {hospital.availableBeds} {t('hospitals.beds').toLowerCase()}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mt-2">{hospital.address}</p>
                    </div>
                    
                    <div className="flex gap-2 w-full sm:w-auto">
                      <CallDialog hospital={hospital} />
                      
                      <Button 
                        size="sm" 
                        className="w-full sm:w-auto medical-btn"
                        onClick={() => getDirections(hospital)}
                      >
                        <Navigation className="h-3.5 w-3.5 mr-1" />
                        {t('hospitals.directions')}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
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
          <div className="text-center p-12 border rounded-lg bg-muted/20">
            <AlertTriangle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">{t('no.hospitals.found')}</h3>
            <p className="text-muted-foreground">
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
          className="text-medical hover:text-medical/80"
        >
          <MapPin className="h-4 w-4 mr-2" />
          {t('hospitals.refresh')}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NearbyHospitals;
