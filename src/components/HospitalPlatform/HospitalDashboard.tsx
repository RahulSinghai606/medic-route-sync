
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Clock, Activity, Users, Heart, AlertTriangle, Zap, Shield, Globe, Satellite, TrendingUp, TrendingDown, Radio } from 'lucide-react';
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

  const missionStats = [
    { 
      label: 'Active Emergencies', 
      value: '7', 
      change: '+2',
      trend: 'up',
      icon: AlertTriangle, 
      color: 'text-red-400', 
      bg: 'bg-red-500/10',
      border: 'border-red-500/30'
    },
    { 
      label: 'Response Units', 
      value: '23/30', 
      change: '+5',
      trend: 'up',
      icon: Radio, 
      color: 'text-blue-400', 
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/30'
    },
    { 
      label: 'Critical Patients', 
      value: '12', 
      change: '-3',
      trend: 'down',
      icon: Heart, 
      color: 'text-purple-400', 
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/30'
    },
    { 
      label: 'Network Status', 
      value: '99.7%', 
      change: '+0.1%',
      trend: 'up',
      icon: Globe, 
      color: 'text-green-400', 
      bg: 'bg-green-500/10',
      border: 'border-green-500/30'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 animate-grid-move" style={{
            backgroundImage: `
              linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '30px 30px'
          }}></div>
        </div>
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-40 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 space-y-6 p-6">
        {/* Enhanced Header */}
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-md opacity-50"></div>
                <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-full">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Mission Control Center
                </h1>
                <p className="text-blue-300 text-lg">
                  Welcome back, {profile?.full_name || 'Commander'} • {profile?.hospitalAffiliation || 'Medical Station Alpha'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 text-blue-400/80">
              <div className="flex items-center gap-2">
                <Satellite className="h-4 w-4" />
                <span>System Time: {currentTime.toLocaleTimeString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 animate-pulse" />
                <span>All Systems Operational</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-500/30 text-green-300">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-medium">Medical Station Online</span>
            </Badge>
            <Button className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 border-0 shadow-lg">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Emergency Protocol
            </Button>
          </div>
        </div>

        {/* Mission Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {missionStats.map((stat, index) => (
            <Card key={index} className={`border-0 bg-black/40 backdrop-blur-xl shadow-2xl hover:shadow-3xl transition-all duration-300 ${stat.border}`}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <p className="text-blue-300/80 text-sm font-medium">{stat.label}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                      <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        stat.trend === 'up' 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
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
            {/* Mission Feed */}
            <Card className="border-0 bg-black/40 backdrop-blur-xl shadow-2xl border border-blue-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Radio className="h-5 w-5 text-blue-400" />
                  Live Mission Feed
                </CardTitle>
                <CardDescription className="text-blue-300/80">
                  Real-time emergency response coordination
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CaseFeed />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Department Status */}
            <Card className="border-0 bg-black/40 backdrop-blur-xl shadow-2xl border border-purple-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Activity className="h-5 w-5 text-purple-400" />
                  Station Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DepartmentStatus />
              </CardContent>
            </Card>

            {/* Mission Alerts */}
            <Card className="border-0 bg-black/40 backdrop-blur-xl shadow-2xl border border-green-500/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Zap className="h-5 w-5 text-green-400" />
                  Mission Alerts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RecentNotifications />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Hospital Stats */}
        <Card className="border-0 bg-black/40 backdrop-blur-xl shadow-2xl border border-blue-500/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Globe className="h-5 w-5 text-blue-400" />
              Network Operations Dashboard
            </CardTitle>
            <CardDescription className="text-blue-300/80">
              Comprehensive medical network status and analytics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <HospitalStats />
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(30px, 30px); }
        }
        .animate-grid-move {
          animation: grid-move 15s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default HospitalDashboard;
