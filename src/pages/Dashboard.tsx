
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Home, MapPin, Clock, Loader2, Activity, Users, Ambulance, Heart, Shield, AlertTriangle, Navigation, Phone } from 'lucide-react';
import NearbyHospitals from '@/components/NearbyHospitals';
import { useLanguage } from '@/contexts/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [location, setLocation] = useState<{lat: number, lng: number, address?: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          
          setLocation(userLocation);
          
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

    return () => clearInterval(timer);
  }, []);

  const emergencyStats = [
    { label: 'Response Time', value: '< 8 min', icon: Clock, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Active Units', value: '12/15', icon: Ambulance, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Cases Today', value: '47', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Hospitals Online', value: '8/10', icon: Shield, color: 'text-medical', bg: 'bg-medical/10' }
  ];
  
  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-medical to-emergency rounded-xl text-white">
              <Home className="h-6 w-6" />
            </div>
            Welcome back, {profile?.full_name || 'Paramedic'}
          </h1>
          <p className="text-muted-foreground text-lg mt-1">
            TERO Emergency Response Dashboard • {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-medical/10 to-emergency/10 border-medical/30">
            <Ambulance className="h-4 w-4 text-medical" />
            <span className="font-medium">Paramedic Active</span>
          </Badge>
          <Button size="sm" className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Emergency Mode
          </Button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {emergencyStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Enhanced Location Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-medical" />
            {t('location.title')} - Current Position
          </CardTitle>
          <CardDescription className="text-base">{t('location.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-3 text-muted-foreground p-6 bg-muted/30 rounded-xl">
              <Loader2 className="h-5 w-5 animate-spin text-medical" />
              <span className="font-medium">{t('location.loading')}</span>
            </div>
          ) : location ? (
            <div className="space-y-4">
              {location.address && (
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-medical/5 to-emergency/5 rounded-xl border border-medical/20">
                  <MapPin className="h-6 w-6 text-medical mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{t('location.current')}</div>
                    <div className="text-sm text-muted-foreground mt-1">{location.address}</div>
                  </div>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Navigation className="h-4 w-4" />
                    Share Location
                  </Button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Local Time</div>
                    <div className="text-sm text-muted-foreground">
                      {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <Activity className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">System Status</div>
                    <div className="text-sm text-green-600 font-medium">All Systems Online</div>
                  </div>
                </div>
              </div>
              
              <div className="px-4 py-3 bg-muted/50 rounded-xl border-2 border-dashed border-muted-foreground/20">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    <strong>{t('location.gps')}</strong> {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                  </span>
                  <Button size="sm" variant="ghost" className="text-xs">
                    <MapPin className="h-3 w-3 mr-1" />
                    Copy Coordinates
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-red-800 dark:text-red-200">Location Access Required</div>
                  <div className="text-sm text-red-600 dark:text-red-300 mt-1">{t('location.error')}</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-medical" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-16 flex-col bg-gradient-to-r from-medical to-medical/80 hover:from-medical/90 hover:to-medical/70">
              <Ambulance className="h-6 w-6 mb-1" />
              <span>Emergency Call</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col border-2">
              <Users className="h-6 w-6 mb-1" />
              <span>Patient Registry</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col border-2">
              <Heart className="h-6 w-6 mb-1" />
              <span>Health Assessment</span>
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Nearby Hospitals Component */}
      <NearbyHospitals />
    </div>
  );
};

export default Dashboard;
