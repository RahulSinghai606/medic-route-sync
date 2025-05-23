
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
  ListFilter,
  Map as MapIcon,
  ArrowUp,
  Tag,
  Navigation,
  BadgePercent,
  Loader2
} from 'lucide-react';
import { calculateHospitalMatch, Location } from '@/utils/hospitalUtils';
import { comprehensiveHospitals, calculateDistanceAndETA, ComprehensiveHospital } from '@/data/comprehensiveHospitals';
import MapView from '@/components/MapView';
import { useToast } from '@/hooks/use-toast';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { fetchPatients } from '@/lib/patientUtils';
import { useLanguage } from '@/contexts/LanguageContext';

const Hospitals = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [rankedHospitals, setRankedHospitals] = useState<ComprehensiveHospital[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<ComprehensiveHospital | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [patientVitals, setPatientVitals] = useState(null);
  const [isLoadingPatient, setIsLoadingPatient] = useState(true);

  // Get user's location on component mount
  useEffect(() => {
    getCurrentLocation();
    fetchLatestPatientData();
  }, []);

  // Fetch latest patient data to use for hospital matching
  const fetchLatestPatientData = async () => {
    setIsLoadingPatient(true);
    try {
      const { data } = await fetchPatients();
      if (data && data.length > 0) {
        const sortedPatients = data.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        
        const latestPatient = sortedPatients[0];
        const latestVitals = latestPatient.vitals?.reduce((latest, current) => {
          if (!latest) return current;
          return new Date(current.created_at) > new Date(latest.created_at) ? current : latest;
        }, null);
        
        if (latestVitals) {
          setPatientVitals(latestVitals);
          toast({
            title: "Patient Data Loaded",
            description: `Using vital signs from ${latestPatient.name || 'recent patient'}`,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setIsLoadingPatient(false);
    }
  };

  // Load and rank hospitals when location changes
  useEffect(() => {
    if (!currentLocation) return;

    try {
      const specialtyTags = searchParams.get('specialties')?.split(',') || [];
      const criticalCase = searchParams.get('critical') === 'true' || 
                          (patientVitals && (
                            (patientVitals.heart_rate > 120 || patientVitals.heart_rate < 50) ||
                            (patientVitals.bp_systolic > 180 || patientVitals.bp_systolic < 90) ||
                            (patientVitals.spo2 < 92) ||
                            (patientVitals.gcs < 9)
                          ));
      
      // Calculate distances for all hospitals
      const hospitalsWithDistance = calculateDistanceAndETA(comprehensiveHospitals, currentLocation);
      
      // Filter hospitals within 30km radius
      const nearbyHospitals = hospitalsWithDistance.filter(hospital => (hospital.distance || 0) <= 30);
      
      // Apply hospital matching algorithm
      const matchedHospitals = nearbyHospitals.map(hospital => {
        const matchResult = calculateHospitalMatch(hospital, specialtyTags, criticalCase, currentLocation);
        return {
          ...hospital,
          matchScore: matchResult.matchScore,
          matchReason: matchResult.matchReason,
          promoted: matchResult.promoted,
          matchedSpecialties: matchResult.matchedSpecialties || [],
          promotedDueToSpecialty: matchResult.promoted
        };
      }).sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));
      
      setRankedHospitals(matchedHospitals);
      setSelectedHospital(matchedHospitals[0] || null);
      
      if (matchedHospitals.length === 0) {
        toast({
          title: t('hospitals.none'),
          description: t('hospitals.none'),
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error ranking hospitals:", error);
      toast({
        title: "Error",
        description: "Failed to rank hospitals. Please try again.",
        variant: "destructive"
      });
    }
  }, [currentLocation, searchParams, patientVitals]);

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
            title: t('location.updated'),
            description: t('location.success'),
          });
        },
        (error) => {
          console.error("Geolocation error:", error);
          handleLocationError(error);
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
    }
  };

  const handleLocationError = (error) => {
    let errorMessage = t('location.error');
    
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
      title: t('location.error.title'),
      description: errorMessage,
      variant: "destructive",
    });
  };

  const reverseGeocode = async (location) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${location.lat}&lon=${location.lng}`
      );

      const data = await response.json();

      if (data.display_name) {
        const address = data.display_name;
        setCurrentLocation((prev) =>
          prev ? { ...prev, address } : { ...location, address }
        );
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
        title: t('location.required'),
        description: t('location.enable'),
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

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'bg-medical text-white';
    if (score >= 80) return 'bg-green-500 text-white';
    if (score >= 70) return 'bg-blue-500 text-white';
    if (score >= 60) return 'bg-amber-500 text-white';
    return 'bg-gray-500 text-white';
  };

  const getMatchScoreClass = (score, isPromoted) => {
    const baseClass = getMatchScoreColor(score);
    const sizeClass = 'text-base font-bold px-3 py-1.5';
    const promotedClass = isPromoted ? 'ring-2 ring-medical ring-offset-1' : '';
    
    return `${baseClass} ${sizeClass} ${promotedClass} flex items-center gap-1.5 rounded-full`;
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">{t('hospitals.matching')}</h1>
          <p className="text-muted-foreground">{t('hospitals.find')}</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder={t('hospitals.search')} 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={() => {
              getCurrentLocation();
              fetchLatestPatientData();
            }}
            disabled={isLoadingLocation}
          >
            {isLoadingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />}
            <span className="hidden sm:inline">{t('hospitals.update')}</span>
          </Button>
        </div>
      </div>

      {/* Show patient data being used */}
      {patientVitals && (
        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-blue-800 dark:text-blue-300 flex items-start gap-2">
          <BadgePercent className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{t('vitals.based')}</p>
            <p className="text-sm">
              {t('heart.rate')}: {patientVitals.heart_rate || 'N/A'} • 
              {t('blood.pressure')}: {patientVitals.bp_systolic || 'N/A'}/{patientVitals.bp_diastolic || 'N/A'} • 
              {t('oxygen.saturation')}: {patientVitals.spo2 || 'N/A'}% • 
              {t('glasgow.coma')}: {patientVitals.gcs || 'N/A'}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={fetchLatestPatientData}
            className="ml-auto"
          >
            {t('refresh')}
          </Button>
        </div>
      )}

      {locationError && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start gap-2">
          <MapPin className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">{t('location.error.title')}</p>
            <p className="text-sm">{locationError}</p>
          </div>
        </div>
      )}

      {currentLocation?.address && (
        <div className="bg-muted/50 p-3 rounded-md flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-medical" />
            <div>
              <p className="text-sm font-medium">{t('your.location')}</p>
              <p className="text-xs text-muted-foreground">{currentLocation.address}</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={getCurrentLocation}
            disabled={isLoadingLocation}
          >
            {isLoadingLocation ? <Loader2 className="h-4 w-4 animate-spin" /> : t('refresh')}
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
          <Card className="border-medical">
            <CardHeader className="bg-medical/10 pb-2">
              <CardTitle className="text-medical flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t('hospitals.recommended')}
              </CardTitle>
              <CardDescription>
                {t('hospitals.ranked')}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 py-0">
              <div className="divide-y">
                {isLoadingLocation ? (
                  <div className="p-6 text-center">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-medical" />
                    <p className="text-muted-foreground">{t('hospitals.wait')}</p>
                  </div>
                ) : filteredHospitals.length > 0 ? (
                  filteredHospitals.map(hospital => {
                    const isPromoted = hospital.promotedDueToSpecialty || false;
                    const matchedSpecialties = hospital.matchedSpecialties || [];
                    
                    return (
                      <div 
                        key={hospital.id}
                        onClick={() => setSelectedHospital(hospital)}
                        className={`p-4 cursor-pointer transition-colors hover:bg-gray-50 flex justify-between items-center ${selectedHospital?.id === hospital.id ? 'bg-gray-50 border-l-4 border-medical' : ''}`}
                      >
                        <div className="flex-grow">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{hospital.name}</h3>
                            <Badge className="bg-muted text-muted-foreground text-xs">
                              {t(`hospitals.type.${hospital.type.toLowerCase()}`)}
                            </Badge>
                            {isPromoted && (
                              <Badge className="bg-medical/20 text-medical border-medical flex items-center gap-1 p-1">
                                <ArrowUp className="h-3 w-3" />
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              <span>{hospital.distance || 0} {t('km')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{t('eta.label')} {hospital.eta || 0} {t('min')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Bed className="h-3 w-3" />
                              <span>{hospital.availableBeds} {t('hospitals.beds').toLowerCase()}</span>
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
                        <div className="ml-3 flex-shrink-0">
                          <div className={getMatchScoreClass(hospital.matchScore || 0, isPromoted)}>
                            <BadgePercent className="h-4 w-4" />
                            {hospital.matchScore || 0}%
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-muted-foreground">
                    {currentLocation ? t('hospitals.none') : 'Unable to load hospitals without location access'}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">{t('hospitals.details')}</TabsTrigger>
              <TabsTrigger value="map">{t('hospitals.map')}</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="mt-4">
              {selectedHospital ? (
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
                        <div className={getMatchScoreClass(selectedHospital.matchScore || 0, selectedHospital.promotedDueToSpecialty || false)}>
                          <BadgePercent className="h-4 w-4" />
                          {selectedHospital.matchScore || 0}% {t('match')}
                        </div>
                        
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
                          {t('distance')}
                        </div>
                        <div className="font-medium mt-1">{selectedHospital.distance || 0} {t('km')}</div>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {t('eta.label')}
                        </div>
                        <div className="font-medium mt-1">{selectedHospital.eta || 0} {t('min')}</div>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          {t('available.beds')}
                        </div>
                        <div className="font-medium mt-1">{selectedHospital.availableBeds}</div>
                      </div>
                      <div className="bg-muted/50 p-3 rounded-md">
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {t('wait.time')}
                        </div>
                        <div className="font-medium mt-1">{selectedHospital.waitTime} {t('min')}</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-3">{t('hospitals.specialties')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedHospital.specialties.map((specialty, index) => {
                          let icon;
                          if (specialty.includes('Cardiac') || specialty.includes('Cardio')) icon = <Heart className="h-4 w-4" />;
                          else if (specialty.includes('Neuro') || specialty.includes('Stroke')) icon = <Brain className="h-4 w-4" />;
                          else if (specialty.includes('Trauma') || specialty.includes('Ortho')) icon = <Bone className="h-4 w-4" />;
                          else icon = <Bed className="h-4 w-4" />;

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
                        <h3 className="text-lg font-semibold">{t('hospitals.contact')}</h3>
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
                        <h3 className="text-lg font-semibold">{t('hospitals.emergency')}</h3>
                        <p className="text-sm">
                          {selectedHospital.traumaCenter 
                            ? t('hospitals.trauma')
                            : t('hospitals.services')}
                        </p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <h3 className="text-lg font-semibold mb-3">{t('hospitals.patient.matching')}</h3>
                      <p className="text-sm mb-4">
                        {selectedHospital.promotedDueToSpecialty 
                          ? `${t('hospitals.prioritized')} ${selectedHospital.matchedSpecialties?.join(', ')}.`
                          : t('hospitals.proximity')
                        }
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <Button 
                          className="medical-btn flex-1 flex items-center gap-2" 
                          onClick={() => getDirections(selectedHospital)}
                        >
                          <Navigation className="h-4 w-4" />
                          {t('hospitals.route')}
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
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">{t('hospitals.no.selection')}</h3>
                    <p className="text-muted-foreground">
                      {isLoadingLocation 
                        ? t('hospitals.wait')
                        : t('hospitals.select.from.list')
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            <TabsContent value="map" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapIcon className="h-5 w-5" />
                    {t('hospitals.locations')}
                  </CardTitle>
                  <CardDescription>
                    {t('hospitals.navigate')}
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
                    onClick={() => selectedHospital && getDirections(selectedHospital)}
                    disabled={!selectedHospital}
                  >
                    <Navigation className="h-4 w-4" />
                    {t('hospitals.get.directions')} {selectedHospital?.name || t('hospitals.nearby')}
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
              {t('hospitals.open.google')}
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
