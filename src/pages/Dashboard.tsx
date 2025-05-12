import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Clock,
  ClipboardList,
  MapPin,
  Users,
  ArrowRight,
  AlertTriangle,
  Activity,
  RefreshCw,
  BadgePercent,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { calculateHospitalMatch, Location } from "@/utils/hospitalUtils";
import { jaipurHospitals, calculateDistanceAndETA } from "@/data/hospitals";
import MapView from "@/components/MapView";
import HebbalHospitalList from "@/components/HebbalHospitalList";
import { useLanguage } from "@/contexts/LanguageContext";
import { getHebbalHospitals, getMatchIndicator } from "@/data/hebbalHospitals";

// Function to match hospitals to patient needs based on location
const matchHospitalsToPatient = (hospitals, specialties = [], isCritical = false, userLocation = null) => {
  return hospitals.map(hospital => {
    const matchResult = calculateHospitalMatch(hospital, specialties, isCritical, userLocation);
    return {
      ...hospital,
      matchScore: matchResult.matchScore,
      matchReason: matchResult.matchReason,
      promoted: matchResult.promoted,
      matchedSpecialties: matchResult.matchedSpecialties || [],
      promotedDueToSpecialty: matchResult.promoted
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [locationPermissionStatus, setLocationPermissionStatus] = useState<PermissionState | null>(null);
  const [reverseGeocodingAttempted, setReverseGeocodingAttempted] = useState(false);
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const hebbalHospitals = getHebbalHospitals().slice(0, 3); // Get top 3 Hebbal hospitals

  useEffect(() => {
    checkLocationPermission();
  }, []);

  // Update nearby hospitals whenever location changes
  useEffect(() => {
    if (currentLocation) {
      try {
        // Calculate distances for all hospitals
        const hospitalsWithDistance = calculateDistanceAndETA(jaipurHospitals, currentLocation);
        
        // Sort by distance
        const sortedHospitals = hospitalsWithDistance.sort((a, b) => a.distance - b.distance);
        
        // Take the nearest 3 hospitals
        setNearbyHospitals(sortedHospitals.slice(0, 3));
      } catch (error) {
        console.error("Error updating nearby hospitals:", error);
      }
    }
  }, [currentLocation]);

  const checkLocationPermission = async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const result = await navigator.permissions.query({ name: 'geolocation' });
        setLocationPermissionStatus(result.state);
        
        result.onchange = () => {
          setLocationPermissionStatus(result.state);
          
          if (result.state === 'granted' && !currentLocation) {
            getCurrentLocation();
          }
        };
        
        if (result.state === 'granted') {
          getCurrentLocation();
        } else if (result.state === 'prompt') {
          setIsLoadingLocation(false);
          setLocationError("Location permission not yet granted. Click Refresh to allow access.");
        } else if (result.state === 'denied') {
          setIsLoadingLocation(false);
          setLocationError("Location access has been blocked. Please update your browser settings to allow location access.");
        }
      } else {
        getCurrentLocation();
      }
    } catch (error) {
      console.error("Error checking location permission:", error);
      getCurrentLocation();
    }
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Successfully got current position:", position.coords);
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

  const handleLocationError = (error: GeolocationPositionError) => {
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
    setIsLoadingLocation(false);
    
    toast({
      title: "Location Error",
      description: errorMessage,
      variant: "destructive",
    });
  };

  const reverseGeocode = async (location: { lat: number, lng: number }) => {
    try {
      setReverseGeocodingAttempted(true);
      console.log("Attempting reverse geocoding for:", location);
      
      // Using Nominatim OpenStreetMap service instead of Google Maps
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
        
        try {
          // Update hospital matches based on new location
          const hospitalMatches = matchHospitalsToPatient(jaipurHospitals, [], false, { 
            lat: location.lat, 
            lng: location.lng, 
            address 
          });
          
          // You can dispatch this to your state management or handle as needed
          console.log("Updated hospital matches:", hospitalMatches);
        } catch (error) {
          console.error("Error updating hospital matches:", error);
        }
      } else {
        console.warn("No results from geocoding API");
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const formatLocation = (location: { lat: number; lng: number }) => {
    return `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`;
  };

  const refreshLocation = () => {
    getCurrentLocation();
    toast({
      title: "Refreshing Location",
      description: "Getting your current coordinates...",
    });
  };

  const goToAssessment = () => {
    navigate("/assessment");
  };

  const goToHospitals = () => {
    navigate("/hospitals");
  };

  const renderLocationPermissionGuidance = () => {
    if (locationPermissionStatus === 'denied') {
      return (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Location Permission Blocked</AlertTitle>
          <AlertDescription>
            Location access has been blocked in your browser. To enable:
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Click the lock/info icon in your browser's address bar</li>
              <li>Find "Location" and change it to "Allow"</li>
              <li>Refresh this page after changing the permission</li>
            </ul>
          </AlertDescription>
        </Alert>
      );
    }
    return null;
  };
  
  // Generate navigation link to nearest hospital
  const navigateToNearestHospital = () => {
    if (nearbyHospitals.length > 0 && currentLocation) {
      navigate(`/hospitals`);
    } else {
      toast({
        title: "Location Required",
        description: "Please enable location services to find nearby hospitals.",
        variant: "destructive"
      });
    }
  };

  // Function to get matching score display style
  const getHospitalScoreStyle = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    if (score >= 60) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>{t('dashboard')}</h1>
        <p className="text-muted-foreground">{t('dashboard')}</p>
      </div>

      {renderLocationPermissionGuidance()}

      <Card className="border-medical">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-medical" />
              {t('location.title')}
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshLocation}
              disabled={isLoadingLocation}
              className="h-8 flex items-center gap-1"
            >
              <RefreshCw className={`h-3 w-3 ${isLoadingLocation ? 'animate-spin' : ''}`} />
              {t('location.refresh')}
            </Button>
          </div>
          <CardDescription>{t('location.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingLocation ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-medical"></div>
            </div>
          ) : locationError ? (
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-md text-red-800 dark:text-red-300 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">{t('location.error')}</p>
                <p className="text-sm">{locationError}</p>
              </div>
            </div>
          ) : currentLocation ? (
            <div className="space-y-3">
              {currentLocation.address && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <p className="font-medium">{t('location.current')}</p>
                  <p className="text-sm mt-1">{currentLocation.address}</p>
                </div>
              )}
              <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                <p className="font-mono text-sm">
                  {t('location.gps')} {formatLocation(currentLocation)}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                Location data is being used to optimize hospital matching and routing
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md text-amber-800 dark:text-amber-300 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">No Location Data</p>
                <p className="text-sm">Click the Refresh button to share your location.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Hebbal Hospital List */}
      <HebbalHospitalList />

      {/* Real-time map with nearby hospitals */}
      {currentLocation && (
        <Card>
          <CardHeader>
            <CardTitle>{t('hospitals.nearby')}</CardTitle>
            <CardDescription>{t('hospitals.description')}</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <MapView userLocation={currentLocation} />
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full medical-btn flex items-center gap-2"
              onClick={navigateToNearestHospital}
            >
              <MapPin className="h-4 w-4" />
              {t('hospitals.find')}
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button
              variant="outline"
              className="w-full justify-between hover:bg-gray-50 dark:hover:bg-gray-800 py-6 text-left"
              onClick={goToAssessment}
            >
              <div className="flex gap-3 items-center">
                <div className="h-9 w-9 rounded-md bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                  <ClipboardList className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium">New Patient Assessment</p>
                  <p className="text-xs text-muted-foreground">
                    Record vital signs and patient info
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Button>

            <Button
              variant="outline"
              className="w-full justify-between hover:bg-gray-50 dark:hover:bg-gray-800 py-6 text-left"
              onClick={goToHospitals}
            >
              <div className="flex gap-3 items-center">
                <div className="h-9 w-9 rounded-md bg-medical/10 flex items-center justify-center">
                  <Activity className="h-5 w-5 text-medical" />
                </div>
                <div>
                  <p className="font-medium">Find Hospital</p>
                  <p className="text-xs text-muted-foreground">
                    Locate suitable facilities for patient care
                  </p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Overview</CardTitle>
            <CardDescription>Today's activities and alerts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <Users className="h-5 w-5 text-gray-500 dark:text-gray-400 mb-2" />
                <h3 className="text-2xl font-bold">3</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Patients Today
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                <Clock className="h-5 w-5 text-gray-500 dark:text-gray-400 mb-2" />
                <h3 className="text-2xl font-bold">45m</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Avg. Response Time
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="text-sm font-medium mb-2">Hebbal Hospitals (Courtyard Bengaluru)</h3>
              <div className="space-y-2">
                {hebbalHospitals.map(hospital => (
                  <div 
                    key={hospital.id}
                    className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                    onClick={() => navigate(`/hospitals`)}
                  >
                    <MapPin className="h-4 w-4 text-medical mt-0.5" />
                    <div className="flex-grow">
                      <p className="text-sm font-medium flex items-center gap-1">
                        {hospital.name}
                        <span>{getMatchIndicator(hospital.matchScore)}</span>
                      </p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span>{hospital.distance} km</span>
                        <span className="mx-1">•</span>
                        <span>{hospital.eta} min</span>
                        <span className="ml-1">•</span>
                        <span className="ml-1 flex items-center gap-0.5">
                          <BadgePercent className="h-3 w-3" />
                          <span className={`font-medium ${getHospitalScoreStyle(hospital.matchScore)}`}>{hospital.matchScore}%</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full text-xs" onClick={goToHospitals}>
              View All Hospitals
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
