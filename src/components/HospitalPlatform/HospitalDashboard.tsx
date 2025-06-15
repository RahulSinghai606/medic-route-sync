
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Bed, 
  Clock, 
  AlertTriangle,
  Activity,
  Heart,
  Stethoscope,
  Ambulance,
  TrendingUp,
  TrendingDown,
  Eye,
  ChevronRight
} from 'lucide-react';
import HospitalStats from './HospitalStats';

const HospitalDashboard = () => {
  // Mock data for demonstration
  const stats = {
    totalBeds: 450,
    availableBeds: 127,
    occupiedBeds: 323,
    icuBeds: 45,
    availableIcuBeds: 12,
    emergencyQueue: 8,
    incomingAmbulances: 3,
    criticalPatients: 15
  };

  const recentPatients = [
    {
      id: 'P001',
      name: 'Sarah Johnson',
      age: 34,
      condition: 'Cardiac Emergency',
      severity: 'Critical',
      eta: '5 min',
      vitals: { heartRate: 110, bloodPressure: '140/90', oxygen: 94 }
    },
    {
      id: 'P002', 
      name: 'Michael Chen',
      age: 67,
      condition: 'Stroke Symptoms',
      severity: 'High',
      eta: '12 min',
      vitals: { heartRate: 95, bloodPressure: '160/100', oxygen: 97 }
    },
    {
      id: 'P003',
      name: 'Emma Williams',
      age: 28,
      condition: 'Trauma - MVA',
      severity: 'Critical',
      eta: '8 min',
      vitals: { heartRate: 125, bloodPressure: '110/70', oxygen: 89 }
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300';
      case 'High': return 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-950 dark:text-yellow-300';
      default: return 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300';
    }
  };

  const getVitalStatus = (vital: number, type: string) => {
    if (type === 'heartRate') {
      if (vital > 100 || vital < 60) return 'text-red-600 dark:text-red-400';
      return 'text-green-600 dark:text-green-400';
    }
    if (type === 'oxygen') {
      if (vital < 95) return 'text-red-600 dark:text-red-400';
      return 'text-green-600 dark:text-green-400';
    }
    return 'text-foreground';
  };

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-blue-50/50 via-white to-green-50/50 dark:from-slate-950/50 dark:via-slate-900/50 dark:to-slate-950/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-green-700 bg-clip-text text-transparent">
          Hospital Command Center
        </h1>
        <p className="text-muted-foreground text-lg">
          Real-time patient monitoring and emergency coordination
        </p>
      </div>

      {/* Key Stats Grid */}
      <HospitalStats />

      {/* Emergency Alerts */}
      <Card className="border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20">
        <CardHeader className="pb-3">
          <CardTitle className="text-red-800 dark:text-red-300 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Active Emergencies
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.criticalPatients}</div>
              <span className="text-sm text-red-700 dark:text-red-300">Critical patients in facility</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.incomingAmbulances}</div>
              <span className="text-sm text-orange-700 dark:text-orange-300">Incoming ambulances</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Incoming Patients */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Ambulance className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Incoming Patients
              </CardTitle>
              <CardDescription>Emergency cases en route to facility</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Eye className="h-4 w-4" />
              View All
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentPatients.map((patient) => (
              <div key={patient.id} className="border rounded-lg p-4 space-y-3 hover:bg-accent/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center text-white font-semibold">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-semibold">{patient.name}</h4>
                      <p className="text-sm text-muted-foreground">Age: {patient.age} • ID: {patient.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getSeverityColor(patient.severity)}>
                      {patient.severity}
                    </Badge>
                    <div className="text-right">
                      <div className="text-sm font-medium">ETA: {patient.eta}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-medium">Condition:</span> {patient.condition}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm">HR:</span>
                    <span className={`text-sm font-medium ${getVitalStatus(patient.vitals.heartRate, 'heartRate')}`}>
                      {patient.vitals.heartRate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">BP:</span>
                    <span className="text-sm font-medium">{patient.vitals.bloodPressure}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4 text-green-500" />
                    <span className="text-sm">O2:</span>
                    <span className={`text-sm font-medium ${getVitalStatus(patient.vitals.oxygen, 'oxygen')}`}>
                      {patient.vitals.oxygen}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bed Management */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              General Beds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Capacity</span>
                <span className="text-2xl font-bold">{stats.totalBeds}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Available</span>
                  <span className="font-medium text-green-600 dark:text-green-400">{stats.availableBeds}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Occupied</span>
                  <span className="font-medium text-orange-600 dark:text-orange-400">{stats.occupiedBeds}</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                  style={{ width: `${(stats.availableBeds / stats.totalBeds) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
              ICU Beds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total ICU</span>
                <span className="text-2xl font-bold">{stats.icuBeds}</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Available</span>
                  <span className="font-medium text-green-600 dark:text-green-400">{stats.availableIcuBeds}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Occupied</span>
                  <span className="font-medium text-red-600 dark:text-red-400">{stats.icuBeds - stats.availableIcuBeds}</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-red-500 to-orange-500 h-2 rounded-full"
                  style={{ width: `${((stats.icuBeds - stats.availableIcuBeds) / stats.icuBeds) * 100}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HospitalDashboard;
