import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, MapPin, Clock, Loader2 } from 'lucide-react';
import NearbyHospitals from '@/components/NearbyHospitals';
import { useLanguage } from '@/contexts/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();
  const [location, setLocation] = useState<{lat: number, lng: number, address?: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          
          // Try to get address from coordinates
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
            .then(response => response.json())
            .then(data => {
              if (data && data.display_name) {
                setLocation(prev => prev ? {...prev, address: data.display_name} : null);
              }
            })
            .catch(error => console.error('Error fetching address:', error))
            .finally(() => setIsLoading(false));
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoading(false);
        }
      );
    } else {
      console.error('Geolocation not supported');
      setIsLoading(false);
    }
  }, []);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to TERO: Triage and Emergency Routing Optimization
          </p>
        </div>
        <div>
          <Badge variant="outline" className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400">
            <Home className="h-3.5 w-3.5" />
            <span>Paramedic View</span>
          </Badge>
        </div>
      </div>
      
      {/* Paramedic Location Card */}
      <Card>
        <CardHeader>
          <CardTitle>{t('location.title')}</CardTitle>
          <CardDescription>{t('location.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>{t('location.loading')}</span>
            </div>
          ) : location ? (
            <div className="space-y-4">
              {location.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-5 w-5 text-medical mt-0.5" />
                  <div>
                    <div className="font-medium">{t('location.current')}</div>
                    <div className="text-sm text-muted-foreground">{location.address}</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-start gap-2">
                <Clock className="h-5 w-5 text-medical mt-0.5" />
                <div>
                  <div className="font-medium">Local Time:</div>
                  <div className="text-sm text-muted-foreground">
                    {new Date().toLocaleTimeString()} - {new Date().toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-muted/50 rounded flex items-center justify-between">
                <span className="text-sm">
                  <strong>{t('location.gps')}</strong> {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-destructive/10 p-4 rounded-md text-destructive">
              {t('location.error')}
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Nearby Hospitals Component */}
      <NearbyHospitals />
      
      {/* Keep other content as needed */}
    </div>
  );
};

export default Dashboard;
