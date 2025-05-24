import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { fetchPatients } from '@/lib/patientUtils';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Search,
  PlusCircle,
  Filter,
  UserPlus,
  FileText,
  Stethoscope,
  Calendar,
  Clock,
  ChevronRight,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Patients = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState('all');
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearingRecords, setClearingRecords] = useState(false);

  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);
      const { data } = await fetchPatients();
      if (data) {
        setPatients(data);
      }
      setLoading(false);
    };

    loadPatients();
  }, []);

  // Sample South Indian patients data for Mysuru
  const samplePatients = [
    {
      id: 'sample-1',
      name: 'Rajesh Kumar',
      age: 45,
      gender: 'Male',
      patient_id: 'EC-1001',
      created_at: new Date().toISOString(),
      vitals: [{
        heart_rate: 78,
        bp_systolic: 120,
        bp_diastolic: 80,
        spo2: 98,
        gcs: 15,
        chief_complaint: 'Cardiac chest pain',
        created_at: new Date().toISOString()
      }]
    },
    {
      id: 'sample-2',
      name: 'Lakshmi Devi',
      age: 32,
      gender: 'Female',
      patient_id: 'EC-1002',
      created_at: new Date(Date.now() - 3600000).toISOString(),
      vitals: [{
        heart_rate: 95,
        bp_systolic: 140,
        bp_diastolic: 90,
        spo2: 94,
        gcs: 14,
        chief_complaint: 'Trauma from accident',
        created_at: new Date(Date.now() - 3600000).toISOString()
      }]
    },
    {
      id: 'sample-3',
      name: 'Suresh Babu',
      age: 28,
      gender: 'Male',
      patient_id: 'EC-1003',
      created_at: new Date(Date.now() - 7200000).toISOString(),
      vitals: [{
        heart_rate: 72,
        bp_systolic: 110,
        bp_diastolic: 70,
        spo2: 99,
        gcs: 15,
        chief_complaint: 'Respiratory issues',
        created_at: new Date(Date.now() - 7200000).toISOString()
      }]
    },
    {
      id: 'sample-4',
      name: 'Priya Sharma',
      age: 35,
      gender: 'Female',
      patient_id: 'EC-1004',
      created_at: new Date(Date.now() - 10800000).toISOString(),
      vitals: [{
        heart_rate: 68,
        bp_systolic: 115,
        bp_diastolic: 75,
        spo2: 97,
        gcs: 15,
        chief_complaint: 'Pediatric emergency',
        created_at: new Date(Date.now() - 10800000).toISOString()
      }]
    },
    {
      id: 'sample-5',
      name: 'Ravi Gowda',
      age: 52,
      gender: 'Male',
      patient_id: 'EC-1005',
      created_at: new Date(Date.now() - 14400000).toISOString(),
      vitals: [{
        heart_rate: 85,
        bp_systolic: 135,
        bp_diastolic: 85,
        spo2: 96,
        gcs: 13,
        chief_complaint: 'Neurological symptoms',
        created_at: new Date(Date.now() - 14400000).toISOString()
      }]
    }
  ];

  // Combine real patients with sample data if no real patients exist
  const displayPatients = patients.length > 0 ? patients : samplePatients;

  const clearAllRecords = async () => {
    setClearingRecords(true);
    try {
      // Clear all patient records and related data
      const { error: vitalsError } = await supabase
        .from('vitals')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      const { error: incidentsError } = await supabase
        .from('incidents')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      const { error: medicalHistoryError } = await supabase
        .from('medical_history')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      const { error: patientsError } = await supabase
        .from('patients')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000');

      if (vitalsError || incidentsError || medicalHistoryError || patientsError) {
        throw new Error('Failed to clear some records');
      }

      setPatients([]);
      toast({
        title: "Records Cleared",
        description: "All patient records have been successfully cleared.",
      });
    } catch (error: any) {
      console.error('Error clearing records:', error);
      toast({
        title: "Error",
        description: "Failed to clear records. Please try again.",
        variant: "destructive",
      });
    } finally {
      setClearingRecords(false);
    }
  };

  const getPatientVitals = (patient: any) => {
    if (!patient || !patient.vitals || patient.vitals.length === 0) return null;
    
    // Get the most recent vitals
    return patient.vitals.reduce((latest: any, current: any) => {
      if (!latest) return current;
      return new Date(current.created_at) > new Date(latest.created_at) ? current : latest;
    }, null);
  };

  const getPatientStatus = (patient: any) => {
    const vitals = getPatientVitals(patient);
    if (!vitals) return 'unknown';
    
    if (vitals.heart_rate > 100 || vitals.bp_systolic > 140 || vitals.spo2 < 92 || vitals.gcs < 9) {
      return 'critical';
    } else if (vitals.heart_rate > 90 || vitals.bp_systolic > 130 || vitals.bp_diastolic > 90 || vitals.spo2 < 95 || vitals.gcs < 13) {
      return 'unstable';
    } else if (vitals.heart_rate > 80 || vitals.bp_systolic > 120 || vitals.bp_diastolic > 80 || vitals.spo2 < 97) {
      return 'moderate';
    } else {
      return 'stable';
    }
  };

  const filteredPatients = displayPatients.filter(patient => {
    const matchesSearch = 
      (patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) || 
      (patient.patient_id?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    if (tab === 'all') return matchesSearch;
    if (tab === 'critical') {
      const status = getPatientStatus(patient);
      return matchesSearch && (status === 'critical' || status === 'unstable');
    }
    if (tab === 'stable') {
      const status = getPatientStatus(patient);
      return matchesSearch && (status === 'stable' || status === 'moderate');
    }
    
    return matchesSearch;
  });

  const getStatusBadge = (patient: any) => {
    const status = getPatientStatus(patient);
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

  const getFormattedTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleNewPatient = () => {
    navigate('/assessment');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1>Patients</h1>
          <p className="text-muted-foreground">Manage current patients and cases in Mysuru</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2" disabled={clearingRecords}>
                <Trash2 className="h-4 w-4" />
                <span>Clear Records</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  Clear All Patient Records
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete all patient records, vitals, incidents, and medical history. 
                  This cannot be undone. Are you sure you want to continue?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={clearAllRecords}
                  className="bg-destructive hover:bg-destructive/90"
                  disabled={clearingRecords}
                >
                  {clearingRecords ? 'Clearing...' : 'Clear All Records'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button className="medical-btn flex items-center gap-2" onClick={handleNewPatient}>
            <UserPlus className="h-4 w-4" />
            <span>New Patient</span>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <CardTitle>Patient List - Mysuru Emergency Cases</CardTitle>
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
              {loading ? (
                <div className="text-center py-10">
                  <p>Loading patients...</p>
                </div>
              ) : filteredPatients.length > 0 ? (
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
                                    {patient.name || 'Unknown Patient'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {patient.age ? `${patient.age} years` : ''}{patient.gender ? `, ${patient.gender}` : ''} • {patient.patient_id || 'No ID'}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    📍 Mysuru, Karnataka • {getPatientVitals(patient)?.chief_complaint || 'No complaint recorded'}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(patient)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm">
                                <div className="flex items-center gap-2">
                                  <span title="Heart Rate">HR: {getPatientVitals(patient)?.heart_rate || '–'}</span>
                                  <span title="Blood Pressure">BP: {getPatientVitals(patient)?.bp_systolic || '–'}/{getPatientVitals(patient)?.bp_diastolic || '–'}</span>
                                  <span title="Oxygen Saturation">SpO2: {getPatientVitals(patient)?.spo2 || '–'}%</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {getFormattedTime(patient.created_at)}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => navigate('/assessment')}>
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
                  <Button className="mt-4" onClick={handleNewPatient}>
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
                  <h3 className="font-medium">Mysuru Zone Patrol</h3>
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
