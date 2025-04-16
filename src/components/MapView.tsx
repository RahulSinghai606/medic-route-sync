
import React, { useEffect, useRef, useState } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from '@/utils/hospitalUtils';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// MapmyIndia API Keys
const mapmyindiaKey = "0819ad2847700368a797234bc5f56c8b"; // From the provided image

interface MapViewProps {
  userLocation?: Location | null;
  destination?: Location | null;
  hospitalName?: string;
}

const MapView: React.FC<MapViewProps> = ({ userLocation, destination, hospitalName }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isRouteFetched, setIsRouteFetched] = useState(false);
  const userMarker = useRef<any | null>(null);
  const destinationMarker = useRef<any | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    try {
      // Create MapmyIndia Map script
      const loadMapScript = () => {
        return new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = `https://apis.mapmyindia.com/advancedmaps/v1/${mapmyindiaKey}/map_load?v=1.5`;
          script.async = true;
          script.defer = true;
          
          script.onload = () => {
            console.log('MapmyIndia script loaded successfully');
            resolve();
          };
          
          script.onerror = () => {
            console.error('Failed to load MapmyIndia script');
            setError('Failed to load the map. Please refresh the page.');
            reject();
          };
          
          document.head.appendChild(script);
        });
      };

      const initializeMap = async () => {
        // Check if MapmyIndia is already loaded
        if (!(window as any).MapmyIndia) {
          await loadMapScript();
        }
        
        // Clear any existing map
        if (map.current) {
          mapContainer.current.innerHTML = '';
        }

        // Initialize the map
        const MapmyIndia = (window as any).MapmyIndia;
        
        if (MapmyIndia && MapmyIndia.Map) {
          map.current = new MapmyIndia.Map(mapContainer.current, {
            center: [26.9124, 75.8057], // Jaipur center coordinates [lat, lng]
            zoom: 11,
            search: false,
            location: true,
          });
          
          // Handle map load
          map.current.on('load', function() {
            console.log('MapmyIndia map loaded successfully');
            setIsMapLoaded(true);
            updateMarkers();
          });
          
          // Handle map error
          map.current.on('error', function(e: any) {
            console.error('Map error:', e);
            setError('Failed to load the map: ' + (e.message || 'Unknown error'));
          });
        } else {
          setError('MapmyIndia API not loaded correctly. Please refresh and try again.');
        }
      };

      initializeMap();

      return () => {
        // Clean up
        if (map.current) {
          // Remove the map if it exists
          if (map.current.remove) {
            map.current.remove();
          }
          map.current = null;
        }
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to load the map. Please refresh the page.');
    }
  }, []);

  // Function to update markers
  const updateMarkers = () => {
    if (!map.current || !isMapLoaded) return;
    const MapmyIndia = (window as any).MapmyIndia;
    
    // Clear existing markers
    if (userMarker.current) {
      map.current.removeLayer(userMarker.current);
    }
    if (destinationMarker.current) {
      map.current.removeLayer(destinationMarker.current);
    }
    
    const bounds = new MapmyIndia.LatLngBounds();
    
    // Add user location marker if available
    if (userLocation && userLocation.lat && userLocation.lng) {
      const position = new MapmyIndia.LatLng(userLocation.lat, userLocation.lng);
      
      userMarker.current = new MapmyIndia.Marker({
        map: map.current,
        position: position,
        icon: 'https://apis.mapmyindia.com/map_v3/1.png',
        draggable: false,
        title: 'Your Location'
      });
      
      // Add popup for user location
      new MapmyIndia.Popup()
        .setLatLng(position)
        .setContent('<div class="font-bold">Your Location</div>')
        .addTo(map.current);
      
      bounds.extend(position);
    }
    
    // Add destination marker if available
    if (destination && destination.lat && destination.lng) {
      const position = new MapmyIndia.LatLng(destination.lat, destination.lng);
      
      destinationMarker.current = new MapmyIndia.Marker({
        map: map.current,
        position: position,
        icon: 'https://apis.mapmyindia.com/map_v3/2.png',
        draggable: false,
        title: hospitalName || 'Hospital'
      });
      
      // Add popup for hospital
      new MapmyIndia.Popup()
        .setLatLng(position)
        .setContent(`<div class="font-bold">${hospitalName || 'Hospital'}</div>`)
        .addTo(map.current);
      
      bounds.extend(position);
    }
    
    // If we have both points, fit the map to show both
    if (userLocation && destination && bounds.isValid()) {
      map.current.fitBounds(bounds, {
        padding: 70,
        maxZoom: 15
      });
      
      // Get directions
      getRouteDirections();
    }
  };

  // Update markers when locations change
  useEffect(() => {
    if (isMapLoaded) {
      updateMarkers();
    }
  }, [userLocation, destination, hospitalName, isMapLoaded]);

  // Get directions when both locations are available
  const getRouteDirections = async () => {
    if (!userLocation || !destination || !isMapLoaded || isRouteFetched) return;
    
    try {
      const MapmyIndia = (window as any).MapmyIndia;
      
      // Remove any existing route layers
      if (map.current.getLayer && map.current.getLayer('route')) {
        map.current.removeLayer('route');
      }
      
      if (map.current.getSource && map.current.getSource('route')) {
        map.current.removeSource('route');
      }

      // Create directions service
      const directionsService = new MapmyIndia.DirectionService();
      const routeOptions = {
        origin: `${userLocation.lat},${userLocation.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        alternatives: false,
        resource: 'route_eta'
      };
      
      // Request directions
      directionsService.route(routeOptions, (result: any) => {
        if (result && result.results && result.results.trips && result.results.trips.length > 0) {
          const route = result.results.trips[0];
          
          // Get distance and duration
          const distance = (route.distance / 1000).toFixed(1); // Convert to km
          const duration = Math.round(route.duration / 60); // Convert to minutes
          
          setRouteInfo({
            distance: `${distance} km`,
            duration: `${duration} min`
          });
          
          // Draw the route on the map
          if (route.geometry && route.geometry.coordinates) {
            new MapmyIndia.Polygon({
              map: map.current,
              paths: route.geometry.coordinates,
              strokeColor: '#3b82f6',
              strokeOpacity: 0.8,
              strokeWeight: 5
            });
          }
          
          setIsRouteFetched(true);
        }
      });
    } catch (err) {
      console.error('Error fetching directions:', err);
      setError('Failed to fetch directions. Please try again later.');
    }
  };

  // Function to open directions in Google Maps
  const openInGoogleMaps = () => {
    if (!userLocation || !destination) return;
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${destination.lat},${destination.lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="relative h-full w-full rounded-md overflow-hidden">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center z-10 bg-background/90 p-4">
          <div className="bg-destructive/10 text-destructive p-4 rounded-md flex items-start gap-2 max-w-sm">
            <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">Map Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div ref={mapContainer} className="w-full h-full min-h-[300px]" />
      
      {routeInfo && (
        <div className="absolute bottom-4 left-4 right-4 bg-card shadow-lg rounded-md p-3">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-semibold">{hospitalName}</h4>
              <div className="flex gap-3 text-sm text-muted-foreground">
                <span>{routeInfo.distance}</span>
                <span>•</span>
                <span>{routeInfo.duration} drive</span>
              </div>
            </div>
            <Button 
              onClick={openInGoogleMaps} 
              className="bg-blue-600 hover:bg-blue-700"
              size="sm"
            >
              Open in Google Maps
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapView;

