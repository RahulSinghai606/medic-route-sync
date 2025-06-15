
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Activity, Users, Heart, AlertTriangle, Zap, Shield, Globe, Satellite, TrendingUp, TrendingDown, Radio, BedDouble, Ambulance, Bell } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import HospitalStats from './HospitalStats';
import CaseFeed from './CaseFeed';
import DepartmentStatus from './DepartmentStatus';
import RecentNotifications from './RecentNotifications';

const HospitalDashboard: React.FC = () => {
  const { profile } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Real medical dashboard stats
  const medicalStats = [
    { 
      label: 'Critical Patients', 
      value: '12', 
      change: '+3',
      trend: 'up',
      icon: Heart, 
      color: 'text-red-500', 
      bg: 'bg-red-50',
      border: 'border-red-200'
    },
    { 
      label: 'ICU Beds Available', 
      value: '1/8', 
      change: '-2',
      trend: 'down',
      icon: BedDouble, 
      color: 'text-orange-500', 
      bg: 'bg-orange-50',
      border: 'border-orange-200'
    },
    { 
      label: 'Incoming Ambulances', 
      value: '3', 
      change: '+1',
      trend: 'up',
      icon: Ambulance, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50',
      border: 'border-blue-200'
    },
    { 
      label: 'Active Alerts', 
      value: '4', 
      change: '+1',
      trend: 'up',
      icon: Bell, 
      color: 'text-yellow-500', 
      bg: 'bg-yellow-50',
      border: 'border-yellow-200'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 relative overflow-hidden">
      {/* Medical background pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2300a8ff' fill-opacity='0.4'%3E%3Cpath d='M30 28h4v4h-4z M26 28h4v4h-4z M30 24h4v4h-4z M30 32h4v4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>
      </div>

      <div className="relative z-10 space-y-6 p-6">
        {/* Medical Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="relative bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-full shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
                  Hospital Dashboard
                </h1>
                <p className="text-gray-600 text-lg">
                  Welcome back, {profile?.full_name || 'Doctor'} • {profile?.hospitalAffiliation || 'Medical Center'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-gray-500">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Current Time: {currentTime.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 animate-pulse text-green-500" />
                <span>All Systems Online</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Hospital Systems Online</span>
            </Badge>
            <Button className="bg-red-500 hover:bg-red-600 text-white">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency Protocol
            </Button>
          </div>
        </div>

        {/* Medical Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {medicalStats.map((stat, index) => (
            <Card key={index} className={`${stat.bg} ${stat.border} border-2 hover:shadow-lg transition-all duration-300`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                      <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        stat.trend === 'up' 
                          ? 'bg-red-100 text-red-600' 
                          : 'bg-green-100 text-green-600'
                      }`}>
                        {stat.trend === 'up' ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        <span>{stat.change}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl ${stat.bg} ${stat.border} border`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Enhanced Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Feed */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Ambulance className="h-5 w-5 text-blue-600" />
                  Live Patient Feed
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Real-time patient arrivals and case updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CaseFeed />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Department Status */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Activity className="h-5 w-5 text-green-600" />
                  Department Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DepartmentStatus />
              </CardContent>
            </Card>

            {/* Recent Notifications */}
            <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Bell className="h-5 w-5 text-yellow-600" />
                  Recent Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecentNotifications />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Hospital Stats */}
        <Card className="bg-white/80 backdrop-blur-sm shadow-lg border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-800">
              <Shield className="h-5 w-5 text-blue-600" />
              Hospital Operations Dashboard
            </CardTitle>
            <CardDescription className="text-gray-600">
              Comprehensive hospital status and resource management
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HospitalStats />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HospitalDashboard;
