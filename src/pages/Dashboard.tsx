
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Home, 
  MapPin, 
  Clock, 
  Loader2, 
  Activity, 
  Users, 
  Ambulance, 
  Heart, 
  Shield, 
  AlertTriangle, 
  Navigation, 
  Phone,
  Search,
  Plus,
  Radio,
  MessageSquare,
  Stethoscope,
  Timer,
  Zap
} from 'lucide-react';
import NearbyHospitals from '@/components/NearbyHospitals';
import { useLanguage } from '@/contexts/LanguageContext';

const Dashboard = () => {
  const { t } = useLanguage();
  const { profile } = useAuth();
  const [location, setLocation] = useState<{lat: number, lng: number, address?: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [onlineStatus, setOnlineStatus] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);
  
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
    { 
      label: 'Response Time', 
      value: '< 8 min', 
      icon: Timer, 
      color: 'text-green-600 dark:text-green-400', 
      bg: 'bg-green-50 dark:bg-green-950/20',
      trend: '+2min improvement'
    },
    { 
      label: 'Active Units', 
      value: '12/15', 
      icon: Ambulance, 
      color: 'text-blue-600 dark:text-blue-400', 
      bg: 'bg-blue-50 dark:bg-blue-950/20',
      trend: '3 units available'
    },
    { 
      label: 'Cases Today', 
      value: '47', 
      icon: Activity, 
      color: 'text-purple-600 dark:text-purple-400', 
      bg: 'bg-purple-50 dark:bg-purple-950/20',
      trend: '+12 from yesterday'
    },
    { 
      label: 'Hospitals Online', 
      value: '8/10', 
      icon: Shield, 
      color: 'text-medical dark:text-medical', 
      bg: 'bg-medical/10 dark:bg-medical/20',
      trend: '2 hospitals offline'
    }
  ];

  const activeEmergencies = [
    {
      id: 'EMG001',
      type: 'Cardiac Emergency',
      location: 'Downtown Plaza',
      priority: 'Critical',
      eta: '5 min',
      assignedUnit: 'AMB-07'
    },
    {
      id: 'EMG002', 
      type: 'Traffic Accident',
      location: 'Highway 101',
      priority: 'High',
      eta: '12 min',
      assignedUnit: 'AMB-03'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-950/50 dark:text-red-300';
      case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950/50 dark:text-yellow-300';
      default: return 'bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300';
    }
  };
  
  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50/30 via-white to-green-50/30 dark:from-slate-950/30 dark:via-slate-900/30 dark:to-slate-950/30 min-h-screen">
      {/* Enhanced Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-medical to-emergency rounded-xl text-white">
              <Stethoscope className="h-6 w-6" />
            </div>
            Welcome back, {profile?.full_name || 'Paramedic'}
          </h1>
          <p className="text-muted-foreground text-lg mt-1">
            TERO Emergency Response Dashboard • {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge 
            variant={onlineStatus ? "default" : "destructive"} 
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-medical/10 to-emergency/10 border-medical/30"
          >
            <div className={`h-2 w-2 rounded-full ${onlineStatus ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
            <span className="font-medium">{onlineStatus ? 'Online' : 'Offline'}</span>
          </Badge>
          <Button 
            size="sm" 
            variant={emergencyMode ? "destructive" : "outline"}
            onClick={() => setEmergencyMode(!emergencyMode)}
            className={emergencyMode ? "animate-pulse" : ""}
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            {emergencyMode ? 'Emergency Active' : 'Emergency Mode'}
          </Button>
        </div>
      </div>

      {/* Emergency Alert */}
      {emergencyMode && (
        <Alert className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
          <AlertDescription className="text-red-800 dark:text-red-200 font-medium">
            Emergency mode activated. All non-critical operations suspended. Priority dispatch enabled.
          </AlertDescription>
        </Alert>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {emergencyStats.map((stat, index) => (
          <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.trend}</p>
                </div>
              </div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Active Emergencies */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-red-600 dark:text-red-400" />
              Active Emergencies
            </CardTitle>
            <Badge variant="outline" className="bg-red-50 dark:bg-red-950/20">
              {activeEmergencies.length} Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activeEmergencies.map((emergency) => (
              <div key={emergency.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold">{emergency.type}</h4>
                    <p className="text-sm text-muted-foreground">{emergency.location} • Unit: {emergency.assignedUnit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={getPriorityColor(emergency.priority)}>
                    {emergency.priority}
                  </Badge>
                  <div className="text-right">
                    <div className="text-sm font-medium">ETA: {emergency.eta}</div>
                    <div className="text-xs text-muted-foreground">ID: {emergency.id}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Enhanced Location Card */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-medical" />
            Current Location & Status
          </CardTitle>
          <CardDescription className="text-base">Real-time positioning and system status</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-3 text-muted-foreground p-6 bg-muted/30 rounded-xl">
              <Loader2 className="h-5 w-5 animate-spin text-medical" />
              <span className="font-medium">Acquiring location...</span>
            </div>
          ) : location ? (
            <div className="space-y-4">
              {location.address && (
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-medical/5 to-emergency/5 rounded-xl border border-medical/20">
                  <MapPin className="h-6 w-6 text-medical mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-semibold text-lg">Current Position</div>
                    <div className="text-sm text-muted-foreground mt-1">{location.address}</div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    <Navigation className="h-4 w-4" />
                    Share
                  </Button>
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-medium">Local Time</div>
                    <div className="text-sm text-muted-foreground">
                      {currentTime.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                  <Radio className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Radio Status</div>
                    <div className="text-sm text-green-600 font-medium">Connected</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                  <Activity className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="font-medium">System Status</div>
                    <div className="text-sm text-purple-600 font-medium">All Online</div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0" />
                <div>
                  <div className="font-semibold text-red-800 dark:text-red-200">Location Access Required</div>
                  <div className="text-sm text-red-600 dark:text-red-300 mt-1">Please enable location services for emergency response</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Quick Actions */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-medical" />
            Emergency Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex-col bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg">
              <Phone className="h-6 w-6 mb-1" />
              <span>Emergency Call</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col border-2 hover:bg-blue-50 dark:hover:bg-blue-950/20">
              <Users className="h-6 w-6 mb-1" />
              <span>Patient Registry</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col border-2 hover:bg-green-50 dark:hover:bg-green-950/20">
              <Stethoscope className="h-6 w-6 mb-1" />
              <span>Assessment</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col border-2 hover:bg-purple-50 dark:hover:bg-purple-950/20">
              <MessageSquare className="h-6 w-6 mb-1" />
              <span>Hospital Comm</span>
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
