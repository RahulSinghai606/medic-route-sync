
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Search,
  Filter,
  Plus,
  FileText,
  Calendar,
  Clock,
  MapPin,
  Hospital,
  Ambulance,
  ChevronRight,
  ClipboardCheck,
  User,
  Check
} from 'lucide-react';

// Mock case data with South Indian names and Mysuru locations
const caseData = [
  {
    id: 'EC-1001',
    patient: 'Rajesh Kumar',
    date: 'Apr 11, 2025',
    time: '10:30 AM',
    status: 'active',
    type: 'Cardiac',
    location: 'Kuvempunagar, Mysuru',
    hospital: 'JSS Medical College Hospital',
    severity: 'critical'
  },
  {
    id: 'EC-1002',
    patient: 'Lakshmi Devi',
    date: 'Apr 11, 2025',
    time: '11:15 AM',
    status: 'en-route',
    type: 'Trauma',
    location: 'Jayalakshmipuram, Mysuru',
    hospital: 'KR Hospital',
    severity: 'moderate'
  },
  {
    id: 'EC-1003',
    patient: 'Suresh Babu',
    date: 'Apr 11, 2025',
    time: '09:45 AM',
    status: 'completed',
    type: 'Respiratory',
    location: 'Vijayanagar, Mysuru',
    hospital: 'Apollo BGS Hospital',
    severity: 'critical'
  },
  {
    id: 'EC-1004',
    patient: 'Priya Sharma',
    date: 'Apr 10, 2025',
    time: '08:30 AM',
    status: 'completed',
    type: 'Pediatric',
    location: 'Hebbal, Mysuru',
    hospital: 'Columbia Asia Hospital',
    severity: 'stable'
  },
  {
    id: 'EC-1005',
    patient: 'Ravi Gowda',
    date: 'Apr 10, 2025',
    time: '12:10 PM',
    status: 'completed',
    type: 'Neurological',
    location: 'Saraswathipuram, Mysuru',
    hospital: 'Vikram Hospital',
    severity: 'moderate'
  }
];

const Cases = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState('all');

  const filteredCases = caseData.filter(caseItem => {
    const matchesSearch = caseItem.patient.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          caseItem.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          caseItem.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (tab === 'all') return matchesSearch;
    if (tab === 'active') return matchesSearch && (caseItem.status === 'active' || caseItem.status === 'en-route');
    if (tab === 'completed') return matchesSearch && caseItem.status === 'completed';
    
    return matchesSearch;
  });

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'active':
        return <Badge className="bg-emergency animate-pulse-emergency">Active</Badge>;
      case 'en-route':
        return <Badge className="bg-warning">En Route</Badge>;
      case 'completed':
        return <Badge className="bg-success">Completed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch(severity) {
      case 'critical':
        return <Badge className="bg-emergency">Critical</Badge>;
      case 'moderate':
        return <Badge className="bg-warning">Moderate</Badge>;
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
          <h1>Case Management</h1>
          <p className="text-muted-foreground">Track and manage emergency cases in Mysuru</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="medical-btn flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>New Case</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Case List - Mysuru Emergency Cases</CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search cases..." 
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
              <TabsTrigger value="all">All Cases</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            
            <TabsContent value={tab}>
              {filteredCases.length > 0 ? (
                <div className="rounded-md border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Case Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Location
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date & Time
                          </th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredCases.map((caseItem) => (
                          <tr key={caseItem.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-sm font-medium text-gray-900">
                                    {caseItem.id} • {caseItem.type}
                                  </div>
                                  <div className="text-sm text-gray-500 flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {caseItem.patient}
                                  </div>
                                  <div className="text-sm text-gray-500 flex items-center gap-1">
                                    <Hospital className="h-3 w-3" />
                                    {caseItem.hospital}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="space-y-1">
                                {getStatusBadge(caseItem.status)}
                                <div className="pt-1">
                                  {getSeverityBadge(caseItem.severity)}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-500 flex items-start gap-1">
                                <MapPin className="h-3 w-3 mt-1" />
                                <span>{caseItem.location}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {caseItem.date}
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="h-3 w-3" />
                                {caseItem.time}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                {caseItem.status === 'completed' ? (
                                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                                    <FileText className="h-3 w-3" />
                                    Report
                                  </Button>
                                ) : (
                                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                                    <Ambulance className="h-3 w-3" />
                                    Track
                                  </Button>
                                )}
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
                  <p className="text-muted-foreground">No cases found matching your criteria</p>
                  <Button className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Case
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
            <span>Recent Handoffs</span>
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
                <div className="bg-success/20 p-3 rounded-md">
                  <ClipboardCheck className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="font-medium">Anita Rao • EC-1004</h3>
                  <p className="text-sm text-muted-foreground">Transferred to Dr. Srinivas Murthy</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Apr 10, 2025</p>
                <Badge variant="outline" className="mt-1 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Complete
                </Badge>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
              <div className="flex items-start gap-4">
                <div className="bg-success/20 p-3 rounded-md">
                  <ClipboardCheck className="h-5 w-5 text-success" />
                </div>
                <div>
                  <h3 className="font-medium">Venkatesh Gowda • EC-1005</h3>
                  <p className="text-sm text-muted-foreground">Transferred to Dr. Malini Shetty</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Apr 10, 2025</p>
                <Badge variant="outline" className="mt-1 flex items-center gap-1">
                  <Check className="h-3 w-3" />
                  Complete
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Cases;
