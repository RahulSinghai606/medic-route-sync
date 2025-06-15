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

import { useLivePatients } from '@/hooks/useLivePatients';
import { useLiveStaff } from '@/hooks/useLiveStaff';
import { useDepartments } from '@/hooks/useDepartments';
import LiveStatCard from './common/LiveStatCard';
import { StatusBadge } from './common/StatusBadge';
import { Bed, Users, Building2, AlertTriangle, Clock, BarChart3, Monitor, Stethoscope } from 'lucide-react';

const PremiumHospitalOperations = () => {
  // Realtime data hooks
  const { patients, loading: patientsLoading, error: patientsError, refetch: refetchPatients } = useLivePatients();
  const { staff, loading: staffLoading, error: staffError, refetch: refetchStaff } = useLiveStaff();
  const { departmentList, loading: deptsLoading, error: departmentsError, reload: reloadDepartments } = useDepartments();

  // Compute derived stats
  const availableBeds = departmentList.reduce((sum, d) => sum + (d.beds || 0), 0);
  const totalBeds = departmentList.reduce((sum, d) => sum + (d.total || 0), 0);
  const emergencyQueue = patients.length; // Statically use count of patients as hospital queue
  const onDutyStaff = staff.length;
  const avgResponseTime = 8.5; // Still static

  // STATUS
  if (departmentsError || patientsError || staffError) {
    return (
      <div className="p-8 flex flex-col gap-4 items-center text-destructive">
        <div>Error loading data:</div>
        {departmentsError && <div>{departmentsError}</div>}
        {patientsError && <div>{patientsError}</div>}
        {staffError && <div>{staffError}</div>}
        <button className="btn btn-primary" onClick={() => { reloadDepartments(); refetchPatients(); refetchStaff(); }}>Retry</button>
      </div>
    );
  }

  const { 
    metrics, 
    patients: mockPatients, 
    staff: mockStaff, 
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
        <LiveStatCard
          title="Available Beds"
          value={availableBeds}
          unit=""
          icon={<Bed className="h-8 w-8" />}
          loading={deptsLoading}
        />
        <LiveStatCard
          title="Total Beds"
          value={totalBeds}
          unit=""
          icon={<Building2 className="h-8 w-8" />}
          loading={deptsLoading}
        />
        <LiveStatCard
          title="Staff On Duty"
          value={onDutyStaff}
          unit=""
          icon={<Users className="h-8 w-8" />}
          loading={staffLoading}
        />
        <LiveStatCard
          title="Emergency Queue"
          value={emergencyQueue}
          unit=""
          icon={<AlertTriangle className="h-8 w-8" />}
          loading={patientsLoading}
        />
      </div>

      <div className="mt-6">
        {/* Tabbed Content */}
        {/* PATIENTS */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Patients</h2>
          {patientsLoading ? (
            <div className="text-muted-foreground">Loading patients...</div>
          ) : patients.length === 0 ? (
            <div className="text-muted-foreground">No patients found.</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {patients.map((patient) => (
                <div key={patient.id} className="rounded-lg bg-white dark:bg-gray-900 shadow px-6 py-5 flex items-center justify-between hover:shadow-lg transition-all group border">
                  <div>
                    <div className="text-lg font-semibold">{patient.name || "Unnamed"}</div>
                    <div className="text-xs text-muted-foreground">Age: {patient.age ?? "?"}</div>
                  </div>
                  <StatusBadge status={"Available"} />
                </div>
              ))}
            </div>
          )}
        </div>
        {/* STAFF */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Staff</h2>
          {staffLoading ? (
            <div className="text-muted-foreground">Loading staff...</div>
          ) : staff.length === 0 ? (
            <div className="text-muted-foreground">No staff data.</div>
          ) : (
            <div className="grid md:grid-cols-3 gap-4">
              {staff.map((member) => (
                <div key={member.id} className="rounded-lg bg-white dark:bg-gray-900 shadow px-6 py-5 flex items-center justify-between hover:shadow-lg transition-all">
                  <div>
                    <div className="text-lg font-semibold">{member.name ?? "No name"}</div>
                    <div className="text-xs mb-1 text-muted-foreground">{member.role ?? ""}</div>
                  </div>
                  <StatusBadge status={member.status ?? "Available"} />
                </div>
              ))}
            </div>
          )}
        </div>
        {/* OPERATING ROOMS */}
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-3">Departments</h2>
          {deptsLoading ? (
            <div className="text-muted-foreground">Loading departments...</div>
          ) : departmentList.length === 0 ? (
            <div className="text-muted-foreground">No departments found.</div>
          ) : (
            <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-4">
              {departmentList.map((dept) => (
                <div key={dept.name} className="rounded-lg bg-gradient-to-br from-blue-50 to-purple-100 dark:from-blue-900 dark:to-purple-900 p-5 shadow flex flex-col gap-2 border relative">
                  <div className="absolute right-5 top-5">
                    <StatusBadge status={dept.alert} />
                  </div>
                  <div className="font-semibold">{dept.name}</div>
                  <div className="text-sm text-muted-foreground">
                    Beds: {dept.beds} / {dept.total}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* ANALYTICS */}
        <div>
          <h2 className="text-xl font-bold mb-3">Analytics</h2>
          <div className="bg-gradient-to-r from-blue-100 to-pink-100 dark:from-slate-900 dark:to-pink-950 rounded-lg p-10 text-center opacity-80 shadow relative">
            <BarChart3 className="mx-auto mb-2 h-10 w-10 text-blue-400" />
            <div className="font-semibold mb-1 text-lg">Coming Soon</div>
            <div className="text-muted-foreground">Full interactive hospital analytics dashboard is on the way!</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PremiumHospitalOperations;
