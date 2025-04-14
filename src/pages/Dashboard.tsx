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
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [reverseGeocodingAttempted, setReverseGeocodingAttempted] = useState(false);

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
        },
        (error) => {
          console.error("Error getting location:", error);
          setLocationError(
            `Unable to retrieve your location: ${error.message}. Please check browser permissions.`
          );
          setIsLoadingLocation(false);
          
          toast({
            title: "Location Error",
            description: "Unable to get your current location. Using last known location.",
            variant: "destructive",
          });
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

  const reverseGeocode = async (location: { lat: number, lng: number }) => {
    try {
      setReverseGeocodingAttempted(true);
      console.log("Attempting reverse geocoding for:", location);
      
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location.lat},${location.lng}&key=AIzaSyBNLrJhOMz6idD05pzwk17MCHTHkOfFrlI`
      );

      const data = await response.json();
      console.log("Geocoding API response:", data);

      if (data.status === "OK" && data.results.length > 0) {
        // Get the formatted address from the first result
        const address = data.results[0].formatted_address;
        console.log("Found address:", address);
        setCurrentLocation((prev) =>
          prev ? { ...prev, address } : { ...location, address }
        );
      } else {
        console.warn("No results from geocoding API:", data.status);
        // Keep the coordinates if address lookup fails
      }
    } catch (error) {
      console.error("Error fetching address:", error);
      // Keep coordinates if address lookup fails
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const formatLocation = (location: { lat: number; lng: number }) => {
    // Show only 4 decimal places to make coordinates smaller and more readable
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

  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-muted-foreground">Ambulance operations overview</p>
      </div>

      {/* Current Location Card */}
      <Card className="border-medical">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-medical" />
              Paramedic Location
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshLocation}
              disabled={isLoadingLocation}
              className="h-8"
            >
              Refresh
            </Button>
          </div>
          <CardDescription>Your current GPS coordinates</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoadingLocation ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-medical"></div>
            </div>
          ) : locationError ? (
            <div className="bg-red-50 p-3 rounded-md text-red-800 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">Location Error</p>
                <p className="text-sm">{locationError}</p>
              </div>
            </div>
          ) : currentLocation ? (
            <div className="space-y-3">
              {currentLocation.address && (
                <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                  <p className="font-medium text-lg">
                    {currentLocation.address}
                  </p>
                </div>
              )}
              <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md">
                <p className="font-mono text-xs text-muted-foreground">
                  GPS: {formatLocation(currentLocation)}
                </p>
              </div>
              <p className="text-sm text-muted-foreground">
                This information helps optimize hospital routing and ETA
                calculations.
              </p>
            </div>
          ) : (
            <div className="bg-amber-50 p-3 rounded-md text-amber-800 flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium">No Location Data</p>
                <p className="text-sm">Unable to retrieve your location. Click refresh to try again.</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quick Actions */}
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

        {/* Status Overview */}
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
              <h3 className="text-sm font-medium mb-2">Recent Notifications</h3>
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Bell className="h-4 w-4 text-emergency mt-0.5" />
                  <div>
                    <div className="flex items-center">
                      <p className="text-sm font-medium">System Alert</p>
                      <Badge variant="outline" className="ml-2 text-xs">
                        New
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      ER capacity updates for Memorial Hospital
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-2 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800">
                  <Bell className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Traffic Update</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Route changes on Main St affecting ETAs
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full text-xs">
              View All Activity
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
