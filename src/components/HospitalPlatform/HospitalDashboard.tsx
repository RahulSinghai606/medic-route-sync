import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
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
  ChevronRight,
  Bell,
  Phone,
  MessageSquare,
  Video,
  FileText,
  Shield,
  Zap,
  Calendar,
  MapPin,
  Settings,
  BarChart3,
  PlusCircle,
  Filter,
  Download,
  RefreshCw
} from 'lucide-react';
import HospitalStats from './HospitalStats';
import DepartmentStatus from './DepartmentStatus';
import DisasterModeToggle from './DisasterModeToggle';
import VitalSignsIndicator from '../VitalSignsIndicator';
import LiveDataSimulator from '../LiveDataSimulator';
import EnhancedDisasterMode from '../DisasterManagement/EnhancedDisasterMode';
import RealTimeUpdatesPanel from './RealTimeUpdatesPanel';
import AnimatedMicButton from '../VoiceInput/AnimatedMicButton';

const HospitalDashboard = () => {
  const { toast } = useToast();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [disasterMode, setDisasterMode] = useState(false);
  const [liveDataActive, setLiveDataActive] = useState(true);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [voiceProcessing, setVoiceProcessing] = useState(false);
  const [voiceTranscription, setVoiceTranscription] = useState<string>('');

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Mock data for demonstration
  const stats = {
    totalBeds: 450,
    availableBeds: 127,
    occupiedBeds: 323,
    icuBeds: 45,
    availableIcuBeds: 12,
    emergencyQueue: 8,
    incomingAmbulances: 3,
    criticalPatients: 15,
    totalStaff: 245,
    onDutyStaff: 189,
    avgResponseTime: 8.5,
    patientSatisfaction: 94
  };

  const recentPatients = [
    {
      id: 'P001',
      name: 'Sarah Johnson',
      age: 34,
      condition: 'Cardiac Emergency',
      severity: 'Critical',
      eta: '5 min',
      vitals: { heartRate: 110, bloodPressure: '140/90', oxygen: 94 },
      assignedDoctor: 'Dr. Smith',
      room: 'ICU-3'
    },
    {
      id: 'P002', 
      name: 'Michael Chen',
      age: 67,
      condition: 'Stroke Symptoms',
      severity: 'High',
      eta: '12 min',
      vitals: { heartRate: 95, bloodPressure: '160/100', oxygen: 97 },
      assignedDoctor: 'Dr. Williams',
      room: 'ER-7'
    },
    {
      id: 'P003',
      name: 'Emma Williams',
      age: 28,
      condition: 'Trauma - MVA',
      severity: 'Critical',
      eta: '8 min',
      vitals: { heartRate: 125, bloodPressure: '110/70', oxygen: 89 },
      assignedDoctor: 'Dr. Johnson',
      room: 'Trauma-1'
    }
  ];

  const quickActions = [
    { label: 'Emergency Alert', icon: AlertTriangle, color: 'bg-red-500 hover:bg-red-600', action: () => handleEmergencyAlert() },
    { label: 'Call Doctor', icon: Phone, color: 'bg-blue-500 hover:bg-blue-600', action: () => handleCallDoctor() },
    { label: 'Patient Registry', icon: Users, color: 'bg-green-500 hover:bg-green-600', action: () => handlePatientRegistry() },
    { label: 'Video Conference', icon: Video, color: 'bg-purple-500 hover:bg-purple-600', action: () => handleVideoConference() },
    { label: 'Medical Records', icon: FileText, color: 'bg-orange-500 hover:bg-orange-600', action: () => handleMedicalRecords() },
    { label: 'Staff Scheduling', icon: Calendar, color: 'bg-teal-500 hover:bg-teal-600', action: () => handleStaffScheduling() },
    { label: 'Resource Management', icon: Shield, color: 'bg-indigo-500 hover:bg-indigo-600', action: () => handleResourceManagement() },
    { label: 'Analytics Dashboard', icon: BarChart3, color: 'bg-pink-500 hover:bg-pink-600', action: () => handleAnalytics() }
  ];

  const handleDisasterModeToggle = (active: boolean) => {
    setDisasterMode(active);
    if (active) {
      setEmergencyMode(true);
    }
  };

  const handleLiveDataUpdate = (data: any) => {
    console.log('Live data update:', data);
    // Here you would typically update your state with the new data
  };

  const handleEmergencyAlert = () => {
    setEmergencyMode(!emergencyMode);
    toast({
      title: emergencyMode ? "Emergency Mode Deactivated" : "Emergency Mode Activated",
      description: emergencyMode ? "Hospital returned to normal operations" : "All staff alerted, priority protocols engaged",
      variant: emergencyMode ? "default" : "destructive"
    });
  };

  const handleCallDoctor = () => {
    toast({
      title: "Doctor Call Initiated",
      description: "Connecting to on-call physician...",
    });
  };

  const handlePatientRegistry = () => {
    toast({
      title: "Patient Registry",
      description: "Opening patient management system...",
    });
  };

  const handleVideoConference = () => {
    toast({
      title: "Video Conference",
      description: "Launching secure medical conference room...",
    });
  };

  const handleMedicalRecords = () => {
    toast({
      title: "Medical Records",
      description: "Accessing electronic health records system...",
    });
  };

  const handleStaffScheduling = () => {
    toast({
      title: "Staff Scheduling",
      description: "Opening staff management dashboard...",
    });
  };

  const handleResourceManagement = () => {
    toast({
      title: "Resource Management",
      description: "Accessing inventory and equipment tracking...",
    });
  };

  const handleAnalytics = () => {
    toast({
      title: "Analytics Dashboard",
      description: "Loading hospital performance metrics...",
    });
  };

  const handleRefreshData = () => {
    toast({
      title: "Data Refreshed",
      description: "All hospital systems updated with latest information",
    });
  };

  const handleExportReport = () => {
    toast({
      title: "Report Generated",
      description: "Hospital operations report has been downloaded",
    });
  };

  const handleStartVoiceRecording = () => {
    setVoiceRecording(true);
    console.log('Voice recording started');
  };

  const handleStopVoiceRecording = () => {
    setVoiceRecording(false);
    setVoiceProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setVoiceProcessing(false);
      setVoiceTranscription('Patient showing cardiac symptoms, needs immediate attention');
    }, 2000);
  };

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
    <div className="space-y-6 p-6 bg-gradient-to-br from-blue-50/50 via-white to-green-50/50 dark:from-slate-950/50 dark:via-slate-900/50 dark:to-slate-950/50 min-h-screen">
      {/* Enhanced Header with Voice Input */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-green-600 rounded-xl text-white shadow-lg">
              <Stethoscope className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-700 to-green-700 bg-clip-text text-transparent">
                Hospital Command Center
              </h1>
              <p className="text-muted-foreground text-lg">
                Real-time operations • {currentTime.toLocaleDateString()} • {currentTime.toLocaleTimeString()}
              </p>
            
              {/* Voice Input Button */}
              <div className="ml-4">
                <AnimatedMicButton
                  onStartRecording={handleStartVoiceRecording}
                  onStopRecording={handleStopVoiceRecording}
                  isRecording={voiceRecording}
                  isProcessing={voiceProcessing}
                  transcription={voiceTranscription}
                  confidence={0.95}
                  language="en"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row items-end lg:items-center gap-3">
          <DisasterModeToggle 
            isActive={disasterMode} 
            onToggle={handleDisasterModeToggle} 
          />
          
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleRefreshData} className="gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="outline" onClick={handleExportReport} className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
            <Badge 
              variant={emergencyMode ? "destructive" : "default"} 
              className={`flex items-center gap-2 px-4 py-2 ${emergencyMode ? 'animate-pulse' : ''}`}
            >
              <div className={`h-2 w-2 rounded-full ${emergencyMode ? 'bg-red-400' : 'bg-green-500 animate-pulse'}`} />
              <span className="font-medium">{emergencyMode ? 'Emergency Mode' : 'Normal Operations'}</span>
            </Badge>
          </div>
        </div>
      </div>

      {/* Live Data Simulator */}
      <LiveDataSimulator 
        isActive={liveDataActive} 
        onDataUpdate={handleLiveDataUpdate} 
      />

      {/* Enhanced Disaster Mode Section */}
      {disasterMode && (
        <EnhancedDisasterMode 
          isActive={disasterMode}
          onToggle={setDisasterMode}
        />
      )}

      {/* Enhanced Emergency Alert Banner */}
      {(emergencyMode || disasterMode) && !disasterMode && (
        <Card className="border-red-200 dark:border-red-800 bg-red-50/80 dark:bg-red-950/30 animate-pulse">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
                <div>
                  <h3 className="font-semibold text-red-800 dark:text-red-200">
                    Emergency Protocol Active
                  </h3>
                  <p className="text-red-700 dark:text-red-300">
                    All departments on high alert • Priority dispatch enabled
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleEmergencyAlert} className="border-red-300">
                  Deactivate
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Left Column - Main Content */}
        <div className="xl:col-span-3 space-y-6">
          {/* Key Stats Grid */}
          <HospitalStats />

          {/* Quick Actions Grid */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Quick Actions
                </CardTitle>
                <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950/20">
                  {quickActions.length} Available
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    onClick={action.action}
                    className={`h-20 flex-col gap-2 ${action.color} text-white border-0 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105`}
                  >
                    <action.icon className="h-5 w-5" />
                    <span className="text-xs font-medium text-center">{action.label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Live Patient Monitoring */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Ambulance className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    Live Patient Monitoring
                    {disasterMode && <Badge variant="destructive">Triage Mode</Badge>}
                  </CardTitle>
                  <CardDescription>Real-time patient status and incoming cases</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Add Patient
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentPatients.map((patient) => (
                  <Card key={patient.id} className="border border-muted hover:shadow-md transition-all duration-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-green-600 flex items-center justify-center text-white font-semibold text-lg">
                            {patient.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg">{patient.name}</h4>
                            <p className="text-sm text-muted-foreground">Age: {patient.age} • ID: {patient.id}</p>
                            <p className="text-xs text-muted-foreground">Room: {patient.room} • Dr: {patient.assignedDoctor}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge className={getSeverityColor(patient.severity)}>
                            {patient.severity}
                          </Badge>
                          <div className="text-right">
                            <div className="text-sm font-medium">ETA: {patient.eta}</div>
                            <div className="text-xs text-muted-foreground">{patient.condition}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Enhanced Vitals Display */}
                      <div className="mb-3">
                        <VitalSignsIndicator
                          heartRate={patient.vitals.heartRate}
                          bloodPressure={patient.vitals.bloodPressure}
                          oxygenSaturation={patient.vitals.oxygen}
                          size="sm"
                        />
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contact
                        </Button>
                        <Button size="sm" variant="outline">
                          <Settings className="h-4 w-4 mr-1" />
                          Manage
                        </Button>
                        {disasterMode && (
                          <Button size="sm" variant="destructive">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            Triage
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Department Status */}
          <DepartmentStatus />
        </div>

        {/* Right Column - Live Updates Panel */}
        <div className="xl:col-span-1">
          <RealTimeUpdatesPanel />
        </div>
      </div>
    </div>
  );
};

export default HospitalDashboard;
