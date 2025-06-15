
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Activity, 
  Users, 
  Bed, 
  Heart, 
  TrendingUp, 
  TrendingDown,
  Edit3,
  Save,
  X,
  Clock,
  AlertTriangle,
  CheckCircle,
  UserCheck,
  Stethoscope,
  Building2,
  BarChart3,
  Monitor,
  Zap,
  Eye,
  Settings,
  Phone,
  MessageSquare
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import useHospitalData from '@/hooks/useHospitalData';

const PremiumHospitalOperations = () => {
  const { 
    metrics, 
    patients, 
    staff, 
    operatingRooms, 
    updateMetric, 
    updatePatient, 
    updateStaffMember, 
    updateOperatingRoom 
  } = useHospitalData();

  const [editingMetric, setEditingMetric] = useState<string | null>(null);
  const [editingPatient, setEditingPatient] = useState<string | null>(null);
  const [tempValue, setTempValue] = useState<string>('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critical': return 'bg-red-500/10 text-red-600 border-red-200';
      case 'High': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      case 'Medium': return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
      case 'Low': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'Available': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'Busy': return 'bg-red-500/10 text-red-600 border-red-200';
      case 'In-Use': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const MetricCard = ({ title, value, unit, icon: Icon, trend, editable = false, metricKey }: any) => (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 bg-gradient-to-br from-white to-gray-50/50 dark:from-gray-900 dark:to-gray-800/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white">
              <Icon className="h-4 w-4" />
            </div>
            {title}
          </CardTitle>
          {editable && (
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => {
                setEditingMetric(metricKey);
                setTempValue(value.toString());
              }}
            >
              <Edit3 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          {editingMetric === metricKey ? (
            <div className="flex items-center gap-2 w-full">
              <Input
                type="number"
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-20"
              />
              <Button
                size="sm"
                onClick={() => {
                  updateMetric(metricKey, Number(tempValue));
                  setEditingMetric(null);
                }}
              >
                <Save className="h-3 w-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingMetric(null)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ) : (
            <>
              <div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {value}{unit}
                </div>
                {trend && (
                  <div className={`flex items-center gap-1 text-xs ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(trend)}%
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const PatientCard = ({ patient }: { patient: any }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
              {patient.name.split(' ').map((n: string) => n[0]).join('')}
            </div>
            <div>
              <h4 className="font-semibold">{patient.name}</h4>
              <p className="text-sm text-muted-foreground">Age: {patient.age} • Room: {patient.room}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(patient.severity)}>
              {patient.severity}
            </Badge>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Edit3 className="h-3 w-3 mr-1" />
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Patient: {patient.name}</DialogTitle>
                  <DialogDescription>Update patient information and vitals</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Heart Rate</Label>
                      <Input 
                        type="number" 
                        defaultValue={patient.vitals.heartRate}
                        onChange={(e) => updatePatient(patient.id, {
                          vitals: { ...patient.vitals, heartRate: Number(e.target.value) }
                        })}
                      />
                    </div>
                    <div>
                      <Label>Oxygen Level</Label>
                      <Input 
                        type="number" 
                        defaultValue={patient.vitals.oxygen}
                        onChange={(e) => updatePatient(patient.id, {
                          vitals: { ...patient.vitals, oxygen: Number(e.target.value) }
                        })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Condition</Label>
                    <Input 
                      defaultValue={patient.condition}
                      onChange={(e) => updatePatient(patient.id, { condition: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Notes</Label>
                    <Textarea 
                      defaultValue={patient.notes}
                      onChange={(e) => updatePatient(patient.id, { notes: e.target.value })}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-1">
            <Heart className="h-3 w-3 text-red-500" />
            <span>{patient.vitals.heartRate} BPM</span>
          </div>
          <div className="flex items-center gap-1">
            <Activity className="h-3 w-3 text-blue-500" />
            <span>{patient.vitals.bloodPressure}</span>
          </div>
          <div className="flex items-center gap-1">
            <Stethoscope className="h-3 w-3 text-green-500" />
            <span>{patient.vitals.oxygen}% O2</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-purple-500" />
            <span>{patient.vitals.temperature}°C</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Hospital Operations Center
          </h1>
          <p className="text-muted-foreground">Real-time management and monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse" />
            Live Data
          </Badge>
          <Badge variant="outline">
            Last Updated: {metrics.timestamp.toLocaleTimeString()}
          </Badge>
        </div>
      </div>

      {/* Real-time Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Available Beds"
          value={metrics.availableBeds}
          unit=""
          icon={Bed}
          trend={2.5}
          editable={true}
          metricKey="availableBeds"
        />
        <MetricCard
          title="Emergency Queue"
          value={metrics.emergencyQueue}
          unit=""
          icon={AlertTriangle}
          trend={-1.2}
          editable={true}
          metricKey="emergencyQueue"
        />
        <MetricCard
          title="Staff On Duty"
          value={metrics.onDutyStaff}
          unit={`/${metrics.totalStaff}`}
          icon={Users}
          trend={0.8}
          editable={true}
          metricKey="onDutyStaff"
        />
        <MetricCard
          title="Response Time"
          value={metrics.avgResponseTime.toFixed(1)}
          unit="min"
          icon={Clock}
          trend={-2.1}
          editable={true}
          metricKey="avgResponseTime"
        />
      </div>

      {/* Tabbed Content */}
      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-white dark:bg-gray-900 shadow-sm">
          <TabsTrigger value="patients" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Patients
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center gap-2">
            <UserCheck className="h-4 w-4" />
            Staff
          </TabsTrigger>
          <TabsTrigger value="operations" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Operations
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="patients" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-blue-600" />
                Live Patient Monitoring
              </CardTitle>
              <CardDescription>Real-time patient status and vitals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {patients.map((patient) => (
                <PatientCard key={patient.id} patient={patient} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="staff" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                Staff Management
              </CardTitle>
              <CardDescription>Monitor and manage hospital staff</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {staff.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-semibold">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <h4 className="font-medium">{member.name}</h4>
                        <p className="text-sm text-muted-foreground">{member.role} • {member.department}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Phone className="h-3 w-3 mr-1" />
                        Contact
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operations" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-purple-600" />
                  Operating Rooms
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {operatingRooms.map((room) => (
                  <div key={room.id} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{room.name}</h4>
                      <Badge className={getStatusColor(room.status)}>
                        {room.status}
                      </Badge>
                    </div>
                    {room.currentProcedure && (
                      <p className="text-sm text-muted-foreground">{room.currentProcedure}</p>
                    )}
                    <div className="flex gap-2 mt-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-3 w-3 mr-1" />
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-600" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Network Status</span>
                    <Badge className="bg-green-500/10 text-green-600">Online</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Database</span>
                    <Badge className="bg-green-500/10 text-green-600">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Emergency Systems</span>
                    <Badge className="bg-green-500/10 text-green-600">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Backup Power</span>
                    <Badge className="bg-yellow-500/10 text-yellow-600">Standby</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${(metrics.revenue / 1000000).toFixed(1)}M
                </div>
                <p className="text-sm text-muted-foreground">Monthly revenue</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Patient Satisfaction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.patientSatisfaction.toFixed(1)}%
                </div>
                <Progress value={metrics.patientSatisfaction} className="mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mortality Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {metrics.mortalityRate}%
                </div>
                <p className="text-sm text-muted-foreground">Below national average</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PremiumHospitalOperations;
