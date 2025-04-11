
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  PlusCircle,
  Filter,
  UserPlus,
  FileText,
  Stethoscope,
  Calendar,
  Clock,
  ChevronRight
} from 'lucide-react';

// Mock patient data
const patients = [
  {
    id: 'P-1001',
    name: 'John Doe',
    age: 67,
    gender: 'Male',
    status: 'critical',
    chiefComplaint: 'Chest Pain',
    timeAdded: '10:30 AM',
    vitals: { hr: 110, bp: '90/60', spo2: 94 }
  },
  {
    id: 'P-1002',
    name: 'Sarah Johnson',
    age: 34,
    gender: 'Female',
    status: 'stable',
    chiefComplaint: 'Broken Arm',
    timeAdded: '11:15 AM',
    vitals: { hr: 85, bp: '120/80', spo2: 98 }
  },
  {
    id: 'P-1003',
    name: 'Robert Chen',
    age: 52,
    gender: 'Male',
    status: 'unstable',
    chiefComplaint: 'Difficulty Breathing',
    timeAdded: '09:45 AM',
    vitals: { hr: 95, bp: '145/95', spo2: 91 }
  },
  {
    id: 'P-1004',
    name: 'Emily Wilson',
    age: 8,
    gender: 'Female',
    status: 'stable',
    chiefComplaint: 'Fever',
    timeAdded: '08:30 AM',
    vitals: { hr: 100, bp: '100/65', spo2: 97 }
  },
  {
    id: 'P-1005',
    name: 'Michael Garcia',
    age: 42,
    gender: 'Male',
    status: 'moderate',
    chiefComplaint: 'Abdominal Pain',
    timeAdded: '12:10 PM',
    vitals: { hr: 88, bp: '130/85', spo2: 96 }
  }
];

const Patients = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState('all');

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          patient.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          patient.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (tab === 'all') return matchesSearch;
    if (tab === 'critical') return matchesSearch && (patient.status === 'critical' || patient.status === 'unstable');
    if (tab === 'stable') return matchesSearch && (patient.status === 'stable' || patient.status === 'moderate');
    
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'critical':
        return <Badge className="bg-emergency">Critical</Badge>;
      case 'unstable':
        return <Badge className="bg-warning">Unstable</Badge>;
      case 'moderate':
        return <Badge className="bg-yellow-500">Moderate</Badge>;
      case 'stable':
        return <Badge className="bg-success">Stable</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1>Patients</h1>
          <p className="text-muted-foreground">Manage current patients and cases</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="medical-btn flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            <span>New Patient</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Patient List</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search patients..." 
                  className="pl-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="all">All Patients</TabsTrigger>
              <TabsTrigger value="critical">Critical</TabsTrigger>
              <TabsTrigger value="stable">Stable</TabsTrigger>
            </TabsList>
            
            <TabsContent value={tab}>
              {filteredPatients.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Patient
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Vitals
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Added
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPatients.map((patient) => (
                          <tr key={patient.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {patient.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {patient.age} years, {patient.gender} • {patient.id}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {patient.chiefComplaint}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(patient.status)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm">
                                <div className="flex items-center gap-2">
                                  <span title="Heart Rate">HR: {patient.vitals.hr}</span>
                                  <span title="Blood Pressure">BP: {patient.vitals.bp}</span>
                                  <span title="Oxygen Saturation">SpO2: {patient.vitals.spo2}%</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {patient.timeAdded}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                  <Stethoscope className="h-3 w-3" />
                                  Assess
                                </Button>
                                <Button variant="outline" size="sm" className="flex items-center gap-1">
                                  <FileText className="h-3 w-3" />
                                  Details
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-10 border rounded-md">
                  <p className="text-muted-foreground">No patients found matching your criteria</p>
                  <Button className="mt-4">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add New Patient
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Today's Schedule</span>
            <Button variant="ghost" size="sm" className="text-xs flex items-center gap-1">
              View All
              <ChevronRight className="h-3 w-3" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 rounded-md">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium">North Zone Patrol</h3>
                  <p className="text-sm text-muted-foreground">Regular shift coverage</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">06:00 - 18:00</p>
                <Badge variant="outline" className="mt-1">12 hours</Badge>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-start gap-4">
                <div className="bg-gray-100 p-3 rounded-md">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <h3 className="font-medium">Equipment Check</h3>
                  <p className="text-sm text-muted-foreground">Weekly inspection</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">18:30 - 19:30</p>
                <Badge variant="outline" className="mt-1">1 hour</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Patients;
