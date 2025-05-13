
import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import HospitalLayout from '@/components/Layout/HospitalLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Ambulance, Bell, ClipboardList, Clock, UserCheck, AlertTriangle, BedDouble, Activity, CheckCircle, XCircle, User, BarChart4, Building2, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Sample data for demonstration
const incomingCases = [
  { 
    id: 1001, 
    severity: 'Critical', 
    patient: 'Male, 62y', 
    condition: 'Suspected cardiac event', 
    eta: 5,
    vitals: {
      hr: 118,
      bp: '160/95',
      spo2: 92,
      gcs: 13
    }
  },
  { 
    id: 1002, 
    severity: 'Urgent', 
    patient: 'Female, 28y', 
    condition: 'Multiple trauma, MVA', 
    eta: 8,
    vitals: {
      hr: 124,
      bp: '105/70',
      spo2: 97,
      gcs: 14
    }
  },
  { 
    id: 1003, 
    severity: 'Stable', 
    patient: 'Male, 45y', 
    condition: 'Abdominal pain, suspected appendicitis', 
    eta: 12,
    vitals: {
      hr: 85,
      bp: '130/85',
      spo2: 99,
      gcs: 15
    }
  }
];

const departments = [
  { name: 'Emergency Department', beds: 7, total: 12, alert: 'Medium' },
  { name: 'ICU', beds: 1, total: 8, alert: 'Critical' },
  { name: 'Cardiology', beds: 4, total: 10, alert: 'Low' },
  { name: 'Orthopedics', beds: 6, total: 12, alert: 'Low' },
  { name: 'Neurology', beds: 3, total: 8, alert: 'Medium' },
];

const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'urgent': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    default: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  }
};

const getAlertColor = (alert: string) => {
  switch (alert.toLowerCase()) {
    case 'critical': return 'bg-red-500';
    case 'medium': return 'bg-amber-500';
    default: return 'bg-green-500';
  }
};

const HospitalDashboard = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleAcceptCase = (caseId: number) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedCase(null);
      toast({
        title: "Case Accepted",
        description: `Case #${caseId} has been accepted and departments notified.`,
      });
      setLoading(false);
    }, 1000);
  };
  
  const handleDeclineCase = (caseId: number) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedCase(null);
      toast({
        title: "Case Declined",
        description: `Case #${caseId} has been declined. Paramedic will be redirected.`,
        variant: "destructive"
      });
      setLoading(false);
    }, 1000);
  };

  const handleViewCaseDetails = (caseId: number) => {
    setSelectedCase(caseId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Hospital Dashboard</h1>
          <p className="text-muted-foreground">Live monitoring and case management</p>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex gap-1 items-center px-3 py-1">
            <Clock className="h-3 w-3" />
            <span>Updated: Just now</span>
          </Badge>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Ambulance className="mr-2 h-5 w-5 text-blue-600" />
              Incoming Cases
            </CardTitle>
            <CardDescription>Active ambulances en route</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">3</div>
            <div className="text-sm text-muted-foreground">ETA: 5-12 minutes</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BedDouble className="mr-2 h-5 w-5 text-blue-600" />
              Available Beds
            </CardTitle>
            <CardDescription>Critical resources tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">21/50</div>
            <div className="text-sm text-amber-500 font-medium">ICU: Critical (1 remaining)</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Bell className="mr-2 h-5 w-5 text-blue-600" />
              Department Alerts
            </CardTitle>
            <CardDescription>Active notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">4</div>
            <div className="text-sm text-red-500 font-medium">1 critical alert requiring action</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Live Case Feed</CardTitle>
              <CardDescription>Real-time updates from inbound ambulances</CardDescription>
            </CardHeader>
            <CardContent>
              {selectedCase ? (
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mb-2"
                    onClick={() => setSelectedCase(null)}
                  >
                    ← Back to all cases
                  </Button>
                  
                  {/* Case detail view */}
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            incomingCases.find(c => c.id === selectedCase)?.severity === 'Critical' ? 'bg-red-500' : 
                            incomingCases.find(c => c.id === selectedCase)?.severity === 'Urgent' ? 'bg-amber-500' : 'bg-green-500'
                          }`}></span>
                          <span className="font-medium text-lg">Case #{selectedCase}</span>
                          <Badge className={getSeverityColor(incomingCases.find(c => c.id === selectedCase)?.severity || 'stable')}>
                            {incomingCases.find(c => c.id === selectedCase)?.severity}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mt-1">
                          {incomingCases.find(c => c.id === selectedCase)?.patient} - {incomingCases.find(c => c.id === selectedCase)?.condition}
                        </p>
                      </div>
                      <Badge variant="outline" className="flex gap-1 items-center">
                        <Clock className="h-3 w-3" />
                        <span>ETA: {incomingCases.find(c => c.id === selectedCase)?.eta} min</span>
                      </Badge>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-4">
                      <h3 className="text-sm font-medium mb-2">Vital Signs</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div>
                          <p className="text-xs text-muted-foreground">Heart Rate</p>
                          <p className="font-medium">{incomingCases.find(c => c.id === selectedCase)?.vitals.hr} bpm</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Blood Pressure</p>
                          <p className="font-medium">{incomingCases.find(c => c.id === selectedCase)?.vitals.bp} mmHg</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">SpO2</p>
                          <p className="font-medium">{incomingCases.find(c => c.id === selectedCase)?.vitals.spo2}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">GCS</p>
                          <p className="font-medium">{incomingCases.find(c => c.id === selectedCase)?.vitals.gcs}/15</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-2">Required Resources</h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">Emergency Bed</Badge>
                        <Badge variant="secondary">Cardiac Monitor</Badge>
                        <Badge variant="secondary">ECG</Badge>
                        {incomingCases.find(c => c.id === selectedCase)?.severity === 'Critical' && (
                          <Badge variant="secondary">ICU Standby</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="text-sm font-medium mb-2">Paramedic Notes</h3>
                      <p className="text-sm text-muted-foreground">
                        Patient presents with chest pain radiating to left arm, started 45 minutes ago while at rest.
                        History of hypertension and type 2 diabetes. Currently on aspirin and nitroglycerin administered by paramedic team.
                      </p>
                    </div>
                    
                    <div className="flex gap-2 mt-6">
                      <Button 
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleAcceptCase(selectedCase)}
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                        Accept Case
                      </Button>
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => handleDeclineCase(selectedCase)}
                        disabled={loading}
                      >
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                        Decline - Redirect
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {incomingCases.map((caseItem) => (
                    <div key={caseItem.id} className="border rounded-lg p-3 flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full ${
                            caseItem.severity === 'Critical' ? 'bg-red-500' : 
                            caseItem.severity === 'Urgent' ? 'bg-amber-500' : 'bg-green-500'
                          }`}></span>
                          <span className="font-medium">Case #{caseItem.id}</span>
                          <Badge className={getSeverityColor(caseItem.severity)}>
                            {caseItem.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {caseItem.patient} - {caseItem.condition}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          <span>ETA: {caseItem.eta} minutes</span>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewCaseDetails(caseItem.id)}
                      >
                        <UserCheck className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Status</CardTitle>
              <CardDescription>Current availability by department</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {departments.map((dept, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium flex items-center">
                      <span className={`inline-block w-2 h-2 rounded-full ${getAlertColor(dept.alert)} mr-2`}></span>
                      {dept.name}
                    </span>
                    <span className="text-sm font-medium">
                      {dept.beds}/{dept.total} Available
                    </span>
                  </div>
                  <Progress className="h-2" value={(dept.beds / dept.total) * 100} />
                </div>
              ))}

              <Button variant="outline" className="w-full mt-2">Update Bed Status</Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>Updates from departments</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3 p-2 rounded-md bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">ICU Bed Shortage</p>
                  <p className="text-xs">Only 1 ICU bed available. Please prioritize cases.</p>
                  <p className="text-xs text-red-600/70 dark:text-red-400/70">10 minutes ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2 rounded-md">
                <Activity className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Cardiac Team Alert</p>
                  <p className="text-xs text-muted-foreground">Cardiac catheterization lab prepped for incoming MI case.</p>
                  <p className="text-xs text-muted-foreground">25 minutes ago</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2 rounded-md">
                <Bell className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Shift Change Reminder</p>
                  <p className="text-xs text-muted-foreground">ED shift change at 19:00. Please complete handoffs.</p>
                  <p className="text-xs text-muted-foreground">1 hour ago</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

// Cases Dashboard component
const CasesDashboard = () => {
  const [activeTab, setActiveTab] = useState("active");
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-2">Case Management</h1>
      <p className="text-muted-foreground mb-6">Track and manage all incoming and active cases</p>
      
      <Tabs defaultValue="active" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="active">Active Cases</TabsTrigger>
          <TabsTrigger value="incoming">Incoming</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Patient #A23985
                </CardTitle>
                <CardDescription>Male, 62 - Cardiac Event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge>In Treatment - Cardiology</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Admitted:</span>
                  <span>Today, 10:35 AM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Assigned Physician:</span>
                  <span>Dr. Patel</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">View Details</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Patient #B45720
                </CardTitle>
                <CardDescription>Female, 28 - Multiple Trauma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="destructive">Critical - Surgery</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Admitted:</span>
                  <span>Today, 11:20 AM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Assigned Physician:</span>
                  <span>Dr. Johnson</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-6">
            <Button variant="outline">Load More Cases</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="incoming" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {incomingCases.map((caseItem) => (
                  <div key={caseItem.id} className="border rounded-lg p-3 flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          caseItem.severity === 'Critical' ? 'bg-red-500' : 
                          caseItem.severity === 'Urgent' ? 'bg-amber-500' : 'bg-green-500'
                        }`}></span>
                        <span className="font-medium">Case #{caseItem.id}</span>
                        <Badge className={getSeverityColor(caseItem.severity)}>
                          {caseItem.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {caseItem.patient} - {caseItem.condition}
                      </p>
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>ETA: {caseItem.eta} minutes</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <UserCheck className="h-4 w-4 mr-1" />
                      Prepare
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Case History</CardTitle>
              <CardDescription>Past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Recent case data would be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Case Handoffs component
const CaseHandoffs = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Case Handoffs</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pending Handoffs</CardTitle>
          <CardDescription>
            Cases awaiting handoff from paramedic teams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incomingCases.map((caseItem) => (
              <div key={caseItem.id} className="border rounded-lg p-4 flex justify-between items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      caseItem.severity === 'Critical' ? 'bg-red-500' : 
                      caseItem.severity === 'Urgent' ? 'bg-amber-500' : 'bg-green-500'
                    }`}></span>
                    <span className="font-medium">Case #{caseItem.id}</span>
                    <Badge className={getSeverityColor(caseItem.severity)}>
                      {caseItem.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {caseItem.patient} - {caseItem.condition}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>ETA: {caseItem.eta} minutes</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Ambulance className="h-3 w-3" />
                      <span>Unit: AMBU-27</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm">
                    <UserCheck className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Handoff Protocol</CardTitle>
          <CardDescription>
            Standard procedure for accepting patient handoffs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-medium">Review Case Details</p>
              <p className="text-sm text-muted-foreground">
                Examine patient information, vital signs, and treatment provided by paramedic team.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-medium">Prepare Receiving Area</p>
              <p className="text-sm text-muted-foreground">
                Ready department and necessary equipment based on patient condition.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-medium">Accept Handoff</p>
              <p className="text-sm text-muted-foreground">
                Receive verbal report from paramedic team and document case details.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
              4
            </div>
            <div>
              <p className="font-medium">Complete Transfer Record</p>
              <p className="text-sm text-muted-foreground">
                Sign digital transfer form and update case status in system.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Departments component
const Departments = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-2">Hospital Departments</h1>
      <p className="text-muted-foreground mb-6">Department management and coordination</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Building2 className="mr-2 h-5 w-5 text-blue-600" />
              Total Departments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BedDouble className="mr-2 h-5 w-5 text-blue-600" />
              Total Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">120</div>
            <div className="text-sm text-muted-foreground">Beds across all departments</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-600" />
              Staff On Duty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45</div>
            <div className="text-sm text-muted-foreground">Medical & support staff</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Department Status</CardTitle>
          <CardDescription>Current utilization and alerts by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {departments.map((dept, index) => (
              <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-md ${getAlertColor(dept.alert)} bg-opacity-20 text-${dept.alert === 'Critical' ? 'red' : dept.alert === 'Medium' ? 'amber' : 'green'}-700 flex items-center justify-center mr-3`}>
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{dept.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {dept.beds} beds available
                      </p>
                    </div>
                  </div>
                  <Badge className={
                    dept.alert === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                    dept.alert === 'Medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  }>
                    {dept.alert} Alert
                  </Badge>
                </div>
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Utilization</span>
                      <span>{((dept.total - dept.beds) / dept.total * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={(dept.total - dept.beds) / dept.total * 100} className="h-2" />
                  </div>
                  <Button variant="outline" size="sm" className="ml-4 whitespace-nowrap">
                    Update Status
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Department Analytics</CardTitle>
          <CardDescription>Performance metrics for the past 30 days</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <BarChart4 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              Department analytics visualization would appear here, showing capacity trends, average wait times, and patient flow metrics.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const HospitalPlatform = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();
  
  // Check if the user is logged in as a hospital
  useEffect(() => {
    if (profile && profile.role !== 'hospital') {
      navigate('/');
    }
  }, [profile, navigate]);

  return (
    <HospitalLayout>
      <Routes>
        <Route index element={<HospitalDashboard />} />
        <Route path="cases" element={<CasesDashboard />} />
        <Route path="handoffs" element={<CaseHandoffs />} />
        <Route path="departments" element={<Departments />} />
      </Routes>
    </HospitalLayout>
  );
};

export default HospitalPlatform;
