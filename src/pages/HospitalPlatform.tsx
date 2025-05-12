
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  BellRing, Clock, MapPin, Activity, Users, User, AlertTriangle, MessageSquare, 
  CheckCircle, RefreshCw, ArrowRight, Hospital, Bed, FileText, Map as MapIcon
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const HospitalPlatform = () => {
  const { toast } = useToast();
  const [selectedCase, setSelectedCase] = useState<string | null>(null);
  
  // Sample data for incoming cases
  const incomingCases = [
    {
      id: 'CASE-001',
      patient: 'Tenzin Wangchuk, 45M',
      location: 'Hebbal Flyover',
      eta: '5 min',
      triage: 'RED',
      description: 'MVA with chest trauma, respiratory distress',
      vitals: 'BP 90/60, HR 120, SpO2 88%',
      assignedTo: 'Trauma Team'
    },
    {
      id: 'CASE-002',
      patient: 'Hima Das, 28F',
      location: 'Jalahalli Cross',
      eta: '12 min',
      triage: 'YELLOW',
      description: 'Fall from height, suspected fracture',
      vitals: 'BP 125/85, HR 95, SpO2 97%',
      assignedTo: 'Orthopedics'
    },
    {
      id: 'CASE-003',
      patient: 'Mary Kom, 62F',
      location: 'Yeshwanthpur',
      eta: '18 min',
      triage: 'YELLOW',
      description: 'Acute chest pain, history of cardiac issues',
      vitals: 'BP 145/90, HR 110, SpO2 94%',
      assignedTo: 'Cardiology'
    },
    {
      id: 'CASE-004',
      patient: 'Laishram Devi, 35F',
      location: 'Nagawara',
      eta: '7 min',
      triage: 'GREEN',
      description: 'Minor injuries from workplace accident',
      vitals: 'BP 130/85, HR 88, SpO2 99%',
      assignedTo: 'Emergency Department'
    }
  ];

  // Sample department resources
  const departmentResources = [
    { department: 'Emergency Department', totalBeds: 15, availableBeds: 7, staff: 8, status: 'ACTIVE' },
    { department: 'ICU', totalBeds: 10, availableBeds: 2, staff: 6, status: 'CRITICAL' },
    { department: 'Trauma Center', totalBeds: 8, availableBeds: 3, staff: 5, status: 'ACTIVE' },
    { department: 'Cardiology', totalBeds: 12, availableBeds: 6, staff: 7, status: 'ACTIVE' },
    { department: 'Orthopedics', totalBeds: 10, availableBeds: 4, staff: 5, status: 'ACTIVE' },
    { department: 'Neurology', totalBeds: 8, availableBeds: 1, staff: 4, status: 'CRITICAL' },
  ];

  // Function to get triage color
  const getTriageColor = (triage: string) => {
    switch (triage) {
      case 'RED': return 'bg-red-600 text-white';
      case 'YELLOW': return 'bg-yellow-500 text-white';
      case 'GREEN': return 'bg-green-600 text-white';
      case 'BLACK': return 'bg-gray-800 text-white';
      default: return 'bg-gray-400 text-white';
    }
  };

  const getResourceStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'CRITICAL': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleCaseSelect = (caseId: string) => {
    setSelectedCase(caseId);
    
    toast({
      title: `Case ${caseId} selected`,
      description: "Loading detailed patient information...",
    });
  };
  
  const handlePrepareTeam = (department: string) => {
    toast({
      title: `${department} notified`,
      description: "Team is being assembled for incoming patient.",
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Hospital className="h-6 w-6 text-medical" />
            Hospital Platform
          </h1>
          <p className="text-muted-foreground">Manage incoming cases and hospital resources</p>
        </div>
        <Button className="flex items-center gap-1">
          <RefreshCw className="h-3.5 w-3.5" />
          Refresh Data
        </Button>
      </div>
      
      <Tabs defaultValue="livefeed">
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="livefeed">Live Feed</TabsTrigger>
          <TabsTrigger value="casedashboard">Cases</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="tracking">Tracking</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="livefeed">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellRing className="h-5 w-5 text-medical" />
                  Incoming Cases
                </CardTitle>
                <CardDescription>Real-time feed of patients en route to your facility</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {incomingCases.map((caseData) => (
                    <div 
                      key={caseData.id}
                      className={`border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer ${selectedCase === caseData.id ? 'border-medical border-2' : 'border'}`}
                      onClick={() => handleCaseSelect(caseData.id)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{caseData.id}</h3>
                            <Badge className={getTriageColor(caseData.triage)}>{caseData.triage}</Badge>
                          </div>
                          <p className="text-sm font-medium">{caseData.patient}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-medical" />
                          <span className="text-sm font-medium">{caseData.eta}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <div className="text-xs text-muted-foreground flex items-center gap-1 mb-1">
                            <MapPin className="h-3 w-3" />
                            <span>{caseData.location}</span>
                          </div>
                          <p className="text-sm mb-2">{caseData.description}</p>
                          <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-xs">
                            <span className="font-medium">Vitals: </span>
                            {caseData.vitals}
                          </div>
                        </div>
                        <div className="shrink-0">
                          <Button 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePrepareTeam(caseData.assignedTo);
                            }}
                          >
                            Prepare Team
                          </Button>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <User className="h-3 w-3" />
                          <span>Assigned: {caseData.assignedTo}</span>
                        </div>
                        
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Send Instructions
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-medical" />
                    Department Status
                  </CardTitle>
                  <CardDescription>Current readiness of hospital departments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {departmentResources.slice(0, 4).map((dept, index) => (
                      <div key={index} className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <span className="text-sm">{dept.department}</span>
                        <Badge 
                          variant="outline" 
                          className={getResourceStatusColor(dept.status)}
                        >
                          {dept.availableBeds}/{dept.totalBeds}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Declare Mass Casualty
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact Ambulance Teams
                  </Button>
                  
                  <Button variant="outline" className="w-full justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    Call Additional Staff
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="resources">
          <div className="grid grid-cols-1 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bed className="h-5 w-5 text-medical" />
                  Hospital Resources
                </CardTitle>
                <CardDescription>Current bed capacity and departmental resources</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Department</TableHead>
                      <TableHead className="text-right">Available Beds</TableHead>
                      <TableHead className="text-right">Total Beds</TableHead>
                      <TableHead className="text-right">Staff On Duty</TableHead>
                      <TableHead className="text-right">Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {departmentResources.map((dept, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{dept.department}</TableCell>
                        <TableCell className="text-right">{dept.availableBeds}</TableCell>
                        <TableCell className="text-right">{dept.totalBeds}</TableCell>
                        <TableCell className="text-right">{dept.staff}</TableCell>
                        <TableCell className="text-right">
                          <Badge className={getResourceStatusColor(dept.status)}>
                            {dept.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm">
                            Update
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Emergency Equipment</CardTitle>
                  <CardDescription>Critical equipment availability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className="text-sm">Ventilators</span>
                      <Badge variant="outline">6/10</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className="text-sm">CT Scanner</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Available</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className="text-sm">MRI Machine</span>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Maintenance</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className="text-sm">Trauma Kits</span>
                      <Badge variant="outline">12/15</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Operating Theaters</CardTitle>
                  <CardDescription>Current OT availability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className="text-sm">OT 1</span>
                      <Badge variant="outline" className="bg-red-100 text-red-800">In Use</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className="text-sm">OT 2</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Available</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className="text-sm">OT 3</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Available</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className="text-sm">OT 4 (Trauma)</span>
                      <Badge variant="outline" className="bg-red-100 text-red-800">Reserved</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Blood Bank</CardTitle>
                  <CardDescription>Blood product availability</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className="text-sm">O+</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Adequate</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className="text-sm">O-</span>
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Low</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className="text-sm">A+</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Adequate</Badge>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                      <span className="text-sm">B+</span>
                      <Badge variant="outline" className="bg-green-100 text-green-800">Adequate</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="casedashboard">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-medical" />
                  Case Dashboard
                </CardTitle>
                <CardDescription>Detailed case information and patient tracking</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        Case CASE-001
                        <Badge className="bg-red-600 text-white">RED</Badge>
                      </h3>
                      <p className="text-muted-foreground">Tenzin Wangchuk, 45M - MVA with chest trauma</p>
                    </div>
                    
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      ETA: 5 min
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Vitals Trend</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Blood Pressure:</span>
                              <div className="text-sm font-medium">
                                <span className="text-red-500">90/60</span> → <span className="text-yellow-500">95/65</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Heart Rate:</span>
                              <div className="text-sm font-medium">
                                <span className="text-red-500">120</span> → <span className="text-yellow-500">115</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">SpO2:</span>
                              <div className="text-sm font-medium">
                                <span className="text-red-500">88%</span> → <span className="text-yellow-500">90%</span>
                              </div>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Respiratory Rate:</span>
                              <div className="text-sm font-medium">
                                <span className="text-red-500">28</span> → <span className="text-yellow-500">26</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">En-Route Treatment</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                          <ul className="space-y-1 list-disc pl-5 text-sm">
                            <li>Oxygen therapy initiated (10L/min)</li>
                            <li>IV access established, fluid resuscitation</li>
                            <li>Needle decompression for suspected tension pneumothorax</li>
                            <li>Morphine 5mg IV for pain management</li>
                          </ul>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Patient History</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                          <p className="text-sm">Hypertension, Type 2 Diabetes. No known allergies. Last meal 3 hours ago.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Paramedic Notes</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md h-40 overflow-y-auto">
                          <p className="text-sm">
                            <span className="text-xs text-muted-foreground">14:35 -</span> 
                            Patient was front seat passenger in head-on collision. Airbag deployed.
                          </p>
                          <p className="text-sm mt-2">
                            <span className="text-xs text-muted-foreground">14:37 -</span> 
                            Diminished breath sounds on right side. Suspected pneumothorax.
                          </p>
                          <p className="text-sm mt-2">
                            <span className="text-xs text-muted-foreground">14:40 -</span> 
                            Needle decompression performed with improvement in SpO2.
                          </p>
                          <p className="text-sm mt-2">
                            <span className="text-xs text-muted-foreground">14:43 -</span> 
                            Patient stabilizing but remains in critical condition. Multiple rib fractures suspected.
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium mb-2">Hospital Instructions</h4>
                        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-3">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs text-muted-foreground">14:38 - Dr. Sharma</span>
                            <Badge variant="outline" className="text-xs">Sent</Badge>
                          </div>
                          <p className="text-sm">Continue oxygen therapy. Prepare for chest tube placement on arrival. Trauma team activated.</p>
                        </div>
                        
                        <div className="flex">
                          <input
                            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 flex-1 rounded-r-none"
                            placeholder="Send instructions to paramedic team..."
                          />
                          <Button className="rounded-l-none">Send</Button>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        <Button className="w-full flex items-center justify-center gap-2" variant="default">
                          <CheckCircle className="h-4 w-4" />
                          Prepare Trauma Bay
                        </Button>
                        
                        <Button className="w-full flex items-center justify-center gap-2" variant="outline">
                          <AlertTriangle className="h-4 w-4" />
                          Call Thoracic Surgeon
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tracking">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapIcon className="h-5 w-5 text-medical" />
                Live Ambulance Tracking
              </CardTitle>
              <CardDescription>Real-time location of ambulances en route to the hospital</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 dark:bg-gray-800 h-[400px] rounded-md flex items-center justify-center">
                <p className="text-muted-foreground">Interactive ambulance tracking map will be displayed here</p>
              </div>
              
              <div className="mt-6 space-y-4">
                <h3 className="font-medium">En-Route Ambulances</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md border-l-4 border-red-500">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Ambulance A-01</span>
                        <Badge className="bg-red-600 text-white">RED</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">Case CASE-001 • Tenzin Wangchuk</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">5 min</div>
                      <span className="text-sm text-muted-foreground">2.4 km away</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md border-l-4 border-yellow-500">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Ambulance B-03</span>
                        <Badge className="bg-yellow-500 text-white">YELLOW</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">Case CASE-002 • Hima Das</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">12 min</div>
                      <span className="text-sm text-muted-foreground">5.8 km away</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md border-l-4 border-yellow-500">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Ambulance A-04</span>
                        <Badge className="bg-yellow-500 text-white">YELLOW</Badge>
                      </div>
                      <span className="text-sm text-muted-foreground">Case CASE-003 • Mary Kom</span>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">18 min</div>
                      <span className="text-sm text-muted-foreground">8.2 km away</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Hospital Analytics Dashboard</CardTitle>
              <CardDescription>Performance metrics and case statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 dark:bg-gray-800 h-[300px] rounded-md flex items-center justify-center mb-6">
                <p className="text-muted-foreground">Analytics charts and graphs will be displayed here</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                  <h3 className="text-sm text-muted-foreground mb-1">Cases Today</h3>
                  <p className="text-2xl font-bold">24</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                  <h3 className="text-sm text-muted-foreground mb-1">Avg. Response Time</h3>
                  <p className="text-2xl font-bold">12 min</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                  <h3 className="text-sm text-muted-foreground mb-1">ER Utilization</h3>
                  <p className="text-2xl font-bold">76%</p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                  <h3 className="text-sm text-muted-foreground mb-1">Critical Cases</h3>
                  <p className="text-2xl font-bold">8</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-3">Case Distribution by Type</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <span className="text-sm w-40">Trauma</span>
                      <div className="h-3 bg-medical rounded-full flex-1">
                        <div className="h-full bg-medical rounded-full" style={{ width: '35%' }}></div>
                      </div>
                      <span className="text-sm ml-2">35%</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-sm w-40">Cardiac</span>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full flex-1">
                        <div className="h-full bg-blue-500 rounded-full" style={{ width: '25%' }}></div>
                      </div>
                      <span className="text-sm ml-2">25%</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-sm w-40">Respiratory</span>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full flex-1">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: '18%' }}></div>
                      </div>
                      <span className="text-sm ml-2">18%</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-sm w-40">Neurological</span>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full flex-1">
                        <div className="h-full bg-purple-500 rounded-full" style={{ width: '12%' }}></div>
                      </div>
                      <span className="text-sm ml-2">12%</span>
                    </div>
                    
                    <div className="flex items-center">
                      <span className="text-sm w-40">Other</span>
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full flex-1">
                        <div className="h-full bg-gray-500 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                      <span className="text-sm ml-2">10%</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-3">Triage Accuracy</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-md">
                    <div className="flex justify-between mb-4">
                      <span className="text-sm">Overall Accuracy</span>
                      <span className="font-medium">92%</span>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>RED Triage</span>
                          <span>95% accurate</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div className="h-full bg-red-500 rounded-full" style={{ width: '95%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>YELLOW Triage</span>
                          <span>88% accurate</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div className="h-full bg-yellow-500 rounded-full" style={{ width: '88%' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span>GREEN Triage</span>
                          <span>93% accurate</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: '93%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HospitalPlatform;
