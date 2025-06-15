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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  AlertTriangle,
  FileX,
  Users,
  Activity,
  SlidersHorizontal
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const Patients = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [tab, setTab] = useState('all');
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [clearingRecords, setClearingRecords] = useState(false);
  const [clearingLogs, setClearingLogs] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false);
  
  // Advanced search filters
  const [ageFilter, setAgeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [ageRange, setAgeRange] = useState({ min: '', max: '' });

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
        heart_rate: 120,
        bp_systolic: 160,
        bp_diastolic: 95,
        spo2: 92,
        gcs: 12,
        chief_complaint: 'Cardiac chest pain with shortness of breath',
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
        chief_complaint: 'Motor vehicle accident with multiple injuries',
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
        chief_complaint: 'Mild respiratory discomfort',
        created_at: new Date(Date.now() - 7200000).toISOString()
      }]
    },
    {
      id: 'sample-4',
      name: 'Priya Sharma',
      age: 8,
      gender: 'Female',
      patient_id: 'EC-1004',
      created_at: new Date(Date.now() - 10800000).toISOString(),
      vitals: [{
        heart_rate: 110,
        bp_systolic: 95,
        bp_diastolic: 60,
        spo2: 96,
        gcs: 15,
        chief_complaint: 'High fever and vomiting',
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
        chief_complaint: 'Neurological symptoms - confusion and dizziness',
        created_at: new Date(Date.now() - 14400000).toISOString()
      }]
    },
    {
      id: 'sample-6',
      name: 'Anitha Rao',
      age: 67,
      gender: 'Female',
      patient_id: 'EC-1006',
      created_at: new Date(Date.now() - 18000000).toISOString(),
      vitals: [{
        heart_rate: 58,
        bp_systolic: 180,
        bp_diastolic: 100,
        spo2: 88,
        gcs: 11,
        chief_complaint: 'Severe hypertension and breathing difficulty',
        created_at: new Date(Date.now() - 18000000).toISOString()
      }]
    }
  ];

  const displayPatients = patients.length > 0 ? patients : samplePatients;

  const clearAllRecords = async () => {
    setClearingRecords(true);
    try {
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

  const clearPatientLogs = async () => {
    setClearingLogs(true);
    try {
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

      if (vitalsError || incidentsError || medicalHistoryError) {
        throw new Error('Failed to clear some logs');
      }

      const { data } = await fetchPatients();
      if (data) {
        setPatients(data);
      }

      toast({
        title: "Patient Logs Cleared",
        description: "All patient logs (vitals, incidents, medical history) have been cleared.",
      });
    } catch (error: any) {
      console.error('Error clearing logs:', error);
      toast({
        title: "Error",
        description: "Failed to clear patient logs. Please try again.",
        variant: "destructive",
      });
    } finally {
      setClearingLogs(false);
    }
  };

  const getPatientVitals = (patient: any) => {
    if (!patient || !patient.vitals || patient.vitals.length === 0) return null;
    
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
    // Basic search filter
    const matchesBasicSearch = 
      (patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) || 
      (patient.patient_id?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    
    // Age filter
    const matchesAge = ageFilter === '' || ageFilter === 'all' || 
      (ageFilter === 'child' && patient.age < 18) ||
      (ageFilter === 'adult' && patient.age >= 18 && patient.age < 65) ||
      (ageFilter === 'senior' && patient.age >= 65) ||
      (ageRange.min !== '' && ageRange.max !== '' && 
       patient.age >= parseInt(ageRange.min) && patient.age <= parseInt(ageRange.max));
    
    // Status filter
    const patientStatus = getPatientStatus(patient);
    const matchesStatus = statusFilter === '' || statusFilter === 'all' || patientStatus === statusFilter;
    
    // Tab filter
    let matchesTab = true;
    if (tab === 'critical') {
      matchesTab = patientStatus === 'critical' || patientStatus === 'unstable';
    } else if (tab === 'stable') {
      matchesTab = patientStatus === 'stable' || patientStatus === 'moderate';
    }
    
    return matchesBasicSearch && matchesAge && matchesStatus && matchesTab;
  });

  const getStatusBadge = (patient: any) => {
    const status = getPatientStatus(patient);
    switch(status) {
      case 'critical':
        return <Badge className="bg-emergency animate-pulse">Critical</Badge>;
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

  const clearAllFilters = () => {
    setSearchTerm('');
    setAgeFilter('');
    setStatusFilter('');
    setAgeRange({ min: '', max: '' });
  };

  const activeFilterCount = [
    searchTerm !== '',
    ageFilter !== '' && ageFilter !== 'all',
    statusFilter !== '' && statusFilter !== 'all',
    ageRange.min !== '' || ageRange.max !== ''
  ].filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-medical" />
            Patients
          </h1>
          <p className="text-muted-foreground text-lg">Manage current patients and cases in Mysuru & Mandya</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2" disabled={clearingLogs}>
                <FileX className="h-4 w-4" />
                <span>Clear Logs</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <FileX className="h-5 w-5 text-warning" />
                  Clear Patient Logs
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action will permanently delete all patient logs (vitals, incidents, and medical history) but keep patient records. 
                  This cannot be undone. Are you sure you want to continue?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={clearPatientLogs}
                  className="bg-warning hover:bg-warning/90"
                  disabled={clearingLogs}
                >
                  {clearingLogs ? 'Clearing...' : 'Clear Logs'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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

      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle className="text-xl flex items-center gap-2">
                <Activity className="h-5 w-5 text-medical" />
                Patient Management System
              </CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search by name or patient ID..." 
                    className="pl-9 h-11 text-base"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Collapsible open={isAdvancedSearchOpen} onOpenChange={setIsAdvancedSearchOpen}>
                  <CollapsibleTrigger asChild>
                    <Button variant="outline" size="icon" className="h-11 w-11 relative">
                      <SlidersHorizontal className="h-4 w-4" />
                      {activeFilterCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-medical">
                          {activeFilterCount}
                        </Badge>
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </Collapsible>
              </div>
            </div>
            
            <Collapsible open={isAdvancedSearchOpen} onOpenChange={setIsAdvancedSearchOpen}>
              <CollapsibleContent className="space-y-4">
                <div className="bg-muted/30 p-4 rounded-lg border">
                  <h3 className="font-medium text-base mb-3 flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Advanced Search Filters
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Age Category Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Age Category</label>
                      <Select value={ageFilter} onValueChange={setAgeFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select age group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Ages</SelectItem>
                          <SelectItem value="child">Child (0-17)</SelectItem>
                          <SelectItem value="adult">Adult (18-64)</SelectItem>
                          <SelectItem value="senior">Senior (65+)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Status Filter */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Patient Status</label>
                      <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                          <SelectItem value="unstable">Unstable</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="stable">Stable</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Age Range */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Custom Age Range</label>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={ageRange.min}
                          onChange={(e) => setAgeRange(prev => ({ ...prev, min: e.target.value }))}
                          className="w-20"
                        />
                        <span className="self-center">-</span>
                        <Input
                          type="number"
                          placeholder="Max"
                          value={ageRange.max}
                          onChange={(e) => setAgeRange(prev => ({ ...prev, max: e.target.value }))}
                          className="w-20"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {activeFilterCount > 0 && (
                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        {filteredPatients.length} patient(s) found with {activeFilterCount} filter(s) applied
                      </p>
                      <Button variant="outline" size="sm" onClick={clearAllFilters}>
                        Clear All Filters
                      </Button>
                    </div>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-6 h-12">
              <TabsTrigger value="all" className="text-base">All Patients ({displayPatients.length})</TabsTrigger>
              <TabsTrigger value="critical" className="text-base">Critical ({displayPatients.filter(p => ['critical', 'unstable'].includes(getPatientStatus(p))).length})</TabsTrigger>
              <TabsTrigger value="stable" className="text-base">Stable ({displayPatients.filter(p => ['stable', 'moderate'].includes(getPatientStatus(p))).length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value={tab}>
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-medical mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Loading patients...</p>
                </div>
              ) : filteredPatients.length > 0 ? (
                <div className="rounded-lg border overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            Patient Information
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            Status & Vitals
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            Chief Complaint
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            Time Added
                          </th>
                          <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredPatients.map((patient) => (
                          <tr key={patient.id} className="hover:bg-muted/20 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center">
                                <div>
                                  <div className="text-base font-semibold text-gray-900">
                                    {patient.name || 'Unknown Patient'}
                                  </div>
                                  <div className="text-sm text-gray-600 flex items-center gap-4">
                                    <span>{patient.age ? `${patient.age} years` : ''}{patient.gender ? `, ${patient.gender}` : ''}</span>
                                    <span className="font-mono bg-muted px-2 py-1 rounded text-xs">{patient.patient_id || 'No ID'}</span>
                                  </div>
                                  <div className="text-sm text-gray-500 mt-1">
                                    📍 Mysuru, Karnataka
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="space-y-2">
                                {getStatusBadge(patient)}
                                <div className="text-sm space-y-1">
                                  <div className="flex items-center gap-4 text-xs">
                                    <span title="Heart Rate" className="font-medium">HR: {getPatientVitals(patient)?.heart_rate || '–'}</span>
                                    <span title="Blood Pressure">BP: {getPatientVitals(patient)?.bp_systolic || '–'}/{getPatientVitals(patient)?.bp_diastolic || '–'}</span>
                                  </div>
                                  <div className="flex items-center gap-4 text-xs">
                                    <span title="Oxygen Saturation">SpO2: {getPatientVitals(patient)?.spo2 || '–'}%</span>
                                    <span title="Glasgow Coma Scale">GCS: {getPatientVitals(patient)?.gcs || '–'}/15</span>
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 max-w-xs">
                                {getPatientVitals(patient)?.chief_complaint || 'No complaint recorded'}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {getFormattedTime(patient.created_at)}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {new Date(patient.created_at).toLocaleDateString()}
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
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
                <div className="text-center py-12 border rounded-lg bg-muted/20">
                  <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No patients found</h3>
                  <p className="text-muted-foreground mb-4">
                    {activeFilterCount > 0 
                      ? "No patients match your current search criteria" 
                      : "No patients found matching your criteria"}
                  </p>
                  <div className="flex gap-2 justify-center">
                    {activeFilterCount > 0 && (
                      <Button variant="outline" onClick={clearAllFilters}>
                        Clear Filters
                      </Button>
                    )}
                    <Button onClick={handleNewPatient}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add New Patient
                    </Button>
                  </div>
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
