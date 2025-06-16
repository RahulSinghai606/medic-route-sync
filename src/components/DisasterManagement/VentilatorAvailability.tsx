
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  MapPin,
  Zap,
  RefreshCw
} from 'lucide-react';

interface Hospital {
  id: string;
  name: string;
  location: string;
  distance: number;
  ventilators: {
    total: number;
    available: number;
    inUse: number;
    maintenance: number;
  };
  icuBeds: {
    total: number;
    available: number;
  };
  lastUpdated: Date;
  status: 'operational' | 'overwhelmed' | 'critical';
  estimatedWaitTime: number;
}

const VentilatorAvailability: React.FC = () => {
  const [hospitals, setHospitals] = useState<Hospital[]>([
    {
      id: 'H001',
      name: 'Guwahati Medical College',
      location: 'Guwahati, Assam',
      distance: 2.3,
      ventilators: { total: 45, available: 8, inUse: 35, maintenance: 2 },
      icuBeds: { total: 60, available: 12 },
      lastUpdated: new Date(),
      status: 'operational',
      estimatedWaitTime: 15
    },
    {
      id: 'H002',
      name: 'AIIMS Guwahati',
      location: 'Guwahati, Assam',
      distance: 5.1,
      ventilators: { total: 32, available: 2, inUse: 28, maintenance: 2 },
      icuBeds: { total: 40, available: 3 },
      lastUpdated: new Date(Date.now() - 3 * 60000),
      status: 'overwhelmed',
      estimatedWaitTime: 45
    },
    {
      id: 'H003',
      name: 'Dispur Hospital',
      location: 'Dispur, Assam',
      distance: 8.7,
      ventilators: { total: 20, available: 0, inUse: 18, maintenance: 2 },
      icuBeds: { total: 25, available: 1 },
      lastUpdated: new Date(Date.now() - 8 * 60000),
      status: 'critical',
      estimatedWaitTime: 90
    },
    {
      id: 'H004',
      name: 'Shillong Civil Hospital',
      location: 'Shillong, Meghalaya',
      distance: 102.5,
      ventilators: { total: 18, available: 6, inUse: 11, maintenance: 1 },
      icuBeds: { total: 22, available: 8 },
      lastUpdated: new Date(Date.now() - 15 * 60000),
      status: 'operational',
      estimatedWaitTime: 20
    }
  ]);

  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setHospitals(prev => 
        prev.map(hospital => ({
          ...hospital,
          ventilators: {
            ...hospital.ventilators,
            available: Math.max(0, hospital.ventilators.available + (Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0))
          },
          icuBeds: {
            ...hospital.icuBeds,
            available: Math.max(0, hospital.icuBeds.available + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0))
          },
          lastUpdated: new Date()
        }))
      );
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'bg-green-100 text-green-800 border-green-300';
      case 'overwhelmed': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'overwhelmed': return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'critical': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getVentilatorUtilization = (hospital: Hospital) => {
    return (hospital.ventilators.inUse / hospital.ventilators.total) * 100;
  };

  const refreshData = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const totalVentilators = hospitals.reduce((sum, h) => sum + h.ventilators.total, 0);
  const totalAvailable = hospitals.reduce((sum, h) => sum + h.ventilators.available, 0);
  const totalInUse = hospitals.reduce((sum, h) => sum + h.ventilators.inUse, 0);

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Ventilators</p>
                <p className="text-2xl font-bold">{totalVentilators}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Available Now</p>
                <p className="text-2xl font-bold text-green-600">{totalAvailable}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">In Use</p>
                <p className="text-2xl font-bold text-blue-600">{totalInUse}</p>
              </div>
              <Zap className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Utilization</p>
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round((totalInUse / totalVentilators) * 100)}%
                </p>
              </div>
              <Activity className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hospital List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Ventilator Availability by Hospital
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshData}
              disabled={isRefreshing}
              className="gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {hospitals.map((hospital) => (
              <Card key={hospital.id} className="border hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Hospital Info */}
                    <div className="lg:col-span-3">
                      <h4 className="font-semibold">{hospital.name}</h4>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {hospital.location}
                      </div>
                      <p className="text-xs text-muted-foreground">{hospital.distance}km away</p>
                    </div>
                    
                    {/* Status */}
                    <div className="lg:col-span-2">
                      <Badge className={`${getStatusColor(hospital.status)} flex items-center gap-1`}>
                        {getStatusIcon(hospital.status)}
                        {hospital.status.toUpperCase()}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        Wait: {hospital.estimatedWaitTime}min
                      </p>
                    </div>
                    
                    {/* Ventilator Info */}
                    <div className="lg:col-span-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Ventilators Available</span>
                          <span className="font-medium">
                            {hospital.ventilators.available} / {hospital.ventilators.total}
                          </span>
                        </div>
                        <Progress value={getVentilatorUtilization(hospital)} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>In Use: {hospital.ventilators.inUse}</span>
                          <span>Maintenance: {hospital.ventilators.maintenance}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* ICU Beds */}
                    <div className="lg:col-span-2">
                      <div className="text-sm">
                        <p>ICU Beds</p>
                        <p className="font-medium">
                          {hospital.icuBeds.available} / {hospital.icuBeds.total}
                        </p>
                      </div>
                    </div>
                    
                    {/* Last Updated */}
                    <div className="lg:col-span-2">
                      <div className="text-xs text-muted-foreground">
                        <p>Last Updated</p>
                        <p>{hospital.lastUpdated.toLocaleTimeString()}</p>
                      </div>
                      
                      {hospital.ventilators.available > 0 && (
                        <Button size="sm" className="mt-2 w-full">
                          Request Transfer
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VentilatorAvailability;
