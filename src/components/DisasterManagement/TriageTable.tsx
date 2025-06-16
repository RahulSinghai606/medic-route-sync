
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  AlertTriangle, 
  Heart, 
  Clock, 
  User, 
  Filter,
  Plus,
  Search,
  ArrowUpDown,
  CheckCircle,
  XCircle
} from 'lucide-react';
import VitalSignsIndicator from '../VitalSignsIndicator';

interface TriagePatient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female';
  triageLevel: 1 | 2 | 3 | 4 | 5;
  condition: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    oxygen: number;
    temperature: number;
  };
  arrivalTime: Date;
  estimatedWaitTime: number;
  assignedTo?: string;
  status: 'waiting' | 'in-treatment' | 'transferred' | 'discharged';
  needsVentilator: boolean;
  allergies?: string[];
  medications?: string[];
}

const TriageTable: React.FC = () => {
  const [patients, setPatients] = useState<TriagePatient[]>([
    {
      id: 'T001',
      name: 'Sarah Johnson',
      age: 34,
      gender: 'Female',
      triageLevel: 1,
      condition: 'Cardiac Emergency',
      vitals: { heartRate: 110, bloodPressure: '140/90', oxygen: 94, temperature: 37.8 },
      arrivalTime: new Date(Date.now() - 5 * 60000),
      estimatedWaitTime: 0,
      status: 'in-treatment',
      needsVentilator: true,
      assignedTo: 'Dr. Smith',
      allergies: ['Penicillin'],
      medications: ['Aspirin']
    },
    {
      id: 'T002',
      name: 'Michael Chen',
      age: 67,
      gender: 'Male',
      triageLevel: 2,
      condition: 'Stroke Symptoms',
      vitals: { heartRate: 95, bloodPressure: '160/100', oxygen: 97, temperature: 36.9 },
      arrivalTime: new Date(Date.now() - 12 * 60000),
      estimatedWaitTime: 15,
      status: 'waiting',
      needsVentilator: false,
      allergies: ['Shellfish']
    },
    {
      id: 'T003',
      name: 'Emma Williams',
      age: 28,
      gender: 'Female',
      triageLevel: 1,
      condition: 'Trauma - MVA',
      vitals: { heartRate: 125, bloodPressure: '110/70', oxygen: 89, temperature: 36.2 },
      arrivalTime: new Date(Date.now() - 8 * 60000),
      estimatedWaitTime: 5,
      status: 'waiting',
      needsVentilator: true
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'arrival' | 'triage' | 'wait'>('triage');

  const getTriageLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'bg-red-500 text-white';
      case 2: return 'bg-orange-500 text-white';
      case 3: return 'bg-yellow-500 text-black';
      case 4: return 'bg-green-500 text-white';
      case 5: return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getTriageLevelText = (level: number) => {
    switch (level) {
      case 1: return 'Resuscitation';
      case 2: return 'Emergency';
      case 3: return 'Urgent';
      case 4: return 'Less Urgent';
      case 5: return 'Non-Urgent';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-yellow-100 text-yellow-800';
      case 'in-treatment': return 'bg-blue-100 text-blue-800';
      case 'transferred': return 'bg-green-100 text-green-800';
      case 'discharged': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAndSortedPatients = patients
    .filter(patient => {
      const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           patient.condition.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterLevel === 'all' || patient.triageLevel.toString() === filterLevel;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'triage':
          return a.triageLevel - b.triageLevel;
        case 'arrival':
          return a.arrivalTime.getTime() - b.arrivalTime.getTime();
        case 'wait':
          return a.estimatedWaitTime - b.estimatedWaitTime;
        default:
          return 0;
      }
    });

  const updatePatientStatus = (patientId: string, newStatus: TriagePatient['status']) => {
    setPatients(prev => 
      prev.map(p => p.id === patientId ? { ...p, status: newStatus } : p)
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Mass Casualty Triage Center
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="animate-pulse">
              {patients.filter(p => p.triageLevel <= 2).length} Critical
            </Badge>
            <Badge variant="outline">
              {patients.filter(p => p.needsVentilator).length} Need Ventilator
            </Badge>
          </div>
        </div>
        
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          
          <Select value={filterLevel} onValueChange={setFilterLevel}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="1">Level 1 (Critical)</SelectItem>
              <SelectItem value="2">Level 2 (Emergency)</SelectItem>
              <SelectItem value="3">Level 3 (Urgent)</SelectItem>
              <SelectItem value="4">Level 4 (Less Urgent)</SelectItem>
              <SelectItem value="5">Level 5 (Non-Urgent)</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="triage">Sort by Triage</SelectItem>
              <SelectItem value="arrival">Sort by Arrival</SelectItem>
              <SelectItem value="wait">Sort by Wait Time</SelectItem>
            </SelectContent>
          </Select>
          
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Patient
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <div className="space-y-2 p-4">
            {filteredAndSortedPatients.map((patient) => (
              <Card key={patient.id} className="border hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                    {/* Patient Info */}
                    <div className="lg:col-span-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center text-white font-semibold">
                          {patient.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-semibold">{patient.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {patient.age}y • {patient.gender} • {patient.id}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Triage Level */}
                    <div className="lg:col-span-2">
                      <Badge className={`${getTriageLevelColor(patient.triageLevel)} font-medium`}>
                        Level {patient.triageLevel}: {getTriageLevelText(patient.triageLevel)}
                      </Badge>
                      <p className="text-sm mt-1">{patient.condition}</p>
                    </div>
                    
                    {/* Vitals */}
                    <div className="lg:col-span-3">
                      <VitalSignsIndicator
                        heartRate={patient.vitals.heartRate}
                        bloodPressure={patient.vitals.bloodPressure}
                        oxygenSaturation={patient.vitals.oxygen}
                        temperature={patient.vitals.temperature}
                        size="sm"
                      />
                    </div>
                    
                    {/* Time Info */}
                    <div className="lg:col-span-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Clock className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Arrived: {patient.arrivalTime.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Heart className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">
                          Wait: {patient.estimatedWaitTime}min
                        </span>
                      </div>
                      {patient.needsVentilator && (
                        <Badge variant="destructive" className="text-xs mt-1">
                          Ventilator Needed
                        </Badge>
                      )}
                    </div>
                    
                    {/* Status & Actions */}
                    <div className="lg:col-span-2">
                      <div className="flex flex-col gap-2">
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status.replace('-', ' ').toUpperCase()}
                        </Badge>
                        
                        <div className="flex gap-1">
                          {patient.status === 'waiting' && (
                            <Button 
                              size="sm" 
                              onClick={() => updatePatientStatus(patient.id, 'in-treatment')}
                              className="text-xs"
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Treat
                            </Button>
                          )}
                          
                          {patient.status === 'in-treatment' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => updatePatientStatus(patient.id, 'transferred')}
                              className="text-xs"
                            >
                              Transfer
                            </Button>
                          )}
                        </div>
                        
                        {patient.assignedTo && (
                          <p className="text-xs text-muted-foreground">
                            Assigned: {patient.assignedTo}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TriageTable;
