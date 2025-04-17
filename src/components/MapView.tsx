
import React, { useEffect, useRef, useState } from 'react';
import { Location } from '@/utils/hospitalUtils';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Import marker icons to fix the missing marker issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix default icon issue in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface MapViewProps {
  userLocation?: Location | null;
  destination?: Location | null;
  hospitalName?: string;
}

const MapView: React.FC<MapViewProps> = ({ userLocation, destination, hospitalName }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const userMarker = useRef<L.Marker | null>(null);
  const destinationMarker = useRef<L.Marker | null>(null);
  const routeLine = useRef<L.Polyline | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    try {
      // If map already exists, clean it up
      if (map.current) {
        map.current.remove();
        map.current = null;
      }

      // Create a new map
      map.current = L.map(mapContainer.current).setView([26.9124, 75.8057], 11); // Jaipur center coordinates

      // Add OpenStreetMap tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map.current);

      console.log('Leaflet map initialized successfully');
      setIsMapLoaded(true);
      updateMarkers();
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to load the map. Please refresh the page.');
    }

    // Clean up on unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update markers when locations change
  useEffect(() => {
    if (isMapLoaded) {
      updateMarkers();
    }
  }, [userLocation, destination, hospitalName, isMapLoaded]);

  // Function to update markers
  const updateMarkers = () => {
    if (!map.current || !isMapLoaded) return;
    
    // Clear existing markers
    if (userMarker.current) {
      userMarker.current.remove();
      userMarker.current = null;
    }
    
    if (destinationMarker.current) {
      destinationMarker.current.remove();
      destinationMarker.current = null;
    }
    
    if (routeLine.current) {
      routeLine.current.remove();
      routeLine.current = null;
    }
    
    const bounds = new L.LatLngBounds([]);
    
    // Add user location marker if available
    if (userLocation && userLocation.lat && userLocation.lng) {
      const position = new L.LatLng(userLocation.lat, userLocation.lng);
      
      userMarker.current = L.marker(position)
        .addTo(map.current)
        .bindPopup('<div class="font-bold">Your Location</div>');
      
      bounds.extend(position);
    }
    
    // Add destination marker if available
    if (destination && destination.lat && destination.lng) {
      const position = new L.LatLng(destination.lat, destination.lng);
      
      // Custom hospital icon
      const hospitalIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
        shadowUrl: markerShadow,
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      });
      
      destinationMarker.current = L.marker(position, { icon: hospitalIcon })
        .addTo(map.current)
        .bindPopup(`<div class="font-bold">${hospitalName || 'Hospital'}</div>`);
      
      bounds.extend(position);
    }
    
    // If we have both points, fit the map to show both and get directions
    if (userLocation && destination && bounds.isValid()) {
      map.current.fitBounds(bounds, {
        padding: [70, 70],
        maxZoom: 15
      });
      
      // Calculate route using OSRM
      getRouteDirections();
    } else if (bounds.isValid()) {
      // If we only have one point, fit to it
      map.current.fitBounds(bounds, {
        padding: [70, 70],
        maxZoom: 13
      });
    }
  };

  // Function to get route directions using OSRM (OpenStreetMap Routing Machine)
  const getRouteDirections = async () => {
    if (!userLocation || !destination) return;
    
    try {
      // Use OSRM demo server for routing (for production, should use own instance or service)
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${userLocation.lng},${userLocation.lat};${destination.lng},${destination.lat}?overview=full&geometries=geojson`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch route');
      }
      
      const data = await response.json();
      
      if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        
        // Draw the route
        if (map.current && route.geometry) {
          if (routeLine.current) {
            routeLine.current.remove();
          }
          
          // Convert GeoJSON to LatLng array for Polyline
          const geoJsonLayer = L.geoJSON(route.geometry);
          const latLngs: L.LatLng[] = [];
          
          geoJsonLayer.eachLayer((layer) => {
            if (layer instanceof L.Polyline) {
              // Get all coordinate points from the polyline
              const layerLatLngs = layer.getLatLngs();
              
              // Handle nested arrays properly
              if (Array.isArray(layerLatLngs)) {
                // Process flat or nested arrays of coordinates
                const processLatLngs = (coords: any): L.LatLng[] => {
                  if (coords.lat !== undefined && coords.lng !== undefined) {
                    // This is a single LatLng object
                    return [coords as L.LatLng];
                  } else if (Array.isArray(coords)) {
                    // This is an array that might contain LatLng objects or more arrays
                    return coords.flatMap(c => processLatLngs(c));
                  }
                  return [];
                };
                
                // Process all coordinates and add them to our array
                latLngs.push(...processLatLngs(layerLatLngs));
              }
            }
          });
          
          routeLine.current = L.polyline(latLngs, {
            color: '#3b82f6',
            weight: 5,
            opacity: 0.7
          }).addTo(map.current);
        }
        
        // Calculate distance and duration
        const distance = (route.distance / 1000).toFixed(1); // Convert to km
        const duration = Math.round(route.duration / 60); // Convert to minutes
        
        setRouteInfo({
          distance: `${distance} km`,
          duration: `${duration} min`
        });
      }
    } catch (err) {
      console.error('Error fetching directions:', err);
      // Still set approximate route info based on direct line distance
      if (userLocation && destination) {
        const directDistance = calculateDirectDistance(
          userLocation.lat, userLocation.lng,
          destination.lat, destination.lng
        );
        
        // Estimate duration based on average driving speed of 50 km/h
        const estimatedDuration = Math.round((directDistance / 50) * 60);
        
        setRouteInfo({
          distance: `~${directDistance.toFixed(1)} km`,
          duration: `~${estimatedDuration} min (est.)`
        });
      }
    }
  };

  // Calculate direct distance between two points using Haversine formula
  const calculateDirectDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const deg2rad = (deg: number) => {
    return deg * (Math.PI/180);
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
