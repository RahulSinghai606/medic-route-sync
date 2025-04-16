
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Location } from '@/utils/hospitalUtils';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Updated Mapbox token - this is a temporary public token that should work better
mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

interface MapViewProps {
  userLocation?: Location | null;
  destination?: Location | null;
  hospitalName?: string;
}

const MapView: React.FC<MapViewProps> = ({ userLocation, destination, hospitalName }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [isRouteFetched, setIsRouteFetched] = useState(false);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const destinationMarker = useRef<mapboxgl.Marker | null>(null);
  const [routeInfo, setRouteInfo] = useState<{
    distance: string;
    duration: string;
  } | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current) return;
    
    try {
      // If map already exists, remove it first
      if (map.current) map.current.remove();
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [75.8057, 26.9124], // Jaipur center coordinates
        zoom: 11,
        attributionControl: true // Make sure attribution is visible
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      
      // Add error handler for map loading
      map.current.on('error', (e) => {
        console.error('Map error:', e.error);
        setError('Failed to load the map: ' + e.error?.message || 'Unknown error');
      });
      
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        setIsMapLoaded(true);
      });

      return () => {
        map.current?.remove();
      };
    } catch (err) {
      console.error('Error initializing map:', err);
      setError('Failed to load the map. Please refresh the page.');
    }
  }, []);

  // Add markers and fit bounds when locations change
  useEffect(() => {
    if (!map.current || !isMapLoaded) return;

    // Clear existing markers
    if (userMarker.current) userMarker.current.remove();
    if (destinationMarker.current) destinationMarker.current.remove();

    const bounds = new mapboxgl.LngLatBounds();
    
    // Add user location marker if available
    if (userLocation && userLocation.lat && userLocation.lng) {
      userMarker.current = new mapboxgl.Marker({ color: '#3b82f6' })
        .setLngLat([userLocation.lng, userLocation.lat])
        .addTo(map.current);
      
      // Add popup for user location
      new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat([userLocation.lng, userLocation.lat])
        .setHTML('<div class="font-bold">Your Location</div>')
        .addTo(map.current);
      
      bounds.extend([userLocation.lng, userLocation.lat]);
    }
    
    // Add destination marker if available
    if (destination && destination.lat && destination.lng) {
      destinationMarker.current = new mapboxgl.Marker({ color: '#ef4444' })
        .setLngLat([destination.lng, destination.lat])
        .addTo(map.current);
      
      // Add popup for hospital
      new mapboxgl.Popup({ closeOnClick: false })
        .setLngLat([destination.lng, destination.lat])
        .setHTML(`<div class="font-bold">${hospitalName || 'Hospital'}</div>`)
        .addTo(map.current);
      
      bounds.extend([destination.lng, destination.lat]);
    }
    
    // If we have both points, fit the map to show both
    if (userLocation && destination && !bounds.isEmpty()) {
      map.current.fitBounds(bounds, {
        padding: 70,
        maxZoom: 15
      });
    }
  }, [userLocation, destination, hospitalName, isMapLoaded]);

  // Get directions when both locations are available
  useEffect(() => {
    const getDirections = async () => {
      if (!userLocation || !destination || !isMapLoaded || isRouteFetched) return;
      
      try {
        // Remove any existing route layers
        if (map.current?.getLayer('route')) {
          map.current.removeLayer('route');
        }
        if (map.current?.getSource('route')) {
          map.current.removeSource('route');
        }

        // Fetch directions from Mapbox Directions API
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${userLocation.lng},${userLocation.lat};${destination.lng},${destination.lat}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`
        );
        
        if (!response.ok) throw new Error('Failed to fetch directions');
        
        const data = await response.json();
        
        if (data.routes && data.routes.length > 0) {
          const route = data.routes[0];
          const distance = (route.distance / 1000).toFixed(1); // Convert to km
          const duration = Math.round(route.duration / 60); // Convert to minutes
          
          setRouteInfo({
            distance: `${distance} km`,
            duration: `${duration} min`
          });
          
          // Add the route to the map
          map.current?.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: route.geometry
            }
          });
          
          map.current?.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#3b82f6',
              'line-width': 5,
              'line-opacity': 0.8
            }
          });
          
          setIsRouteFetched(true);
        }
      } catch (err) {
        console.error('Error fetching directions:', err);
        setError('Failed to fetch directions. Please try again later.');
      }
    };

    getDirections();
  }, [userLocation, destination, isMapLoaded, isRouteFetched]);

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
