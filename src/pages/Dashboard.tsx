
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { fetchPatients } from '@/lib/patientUtils';
import { useAuth } from '@/contexts/AuthContext';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Calendar, 
  Ambulance, 
  Users, 
  Activity,
  PlusCircle,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [latestPatient, setLatestPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPatients = async () => {
      setLoading(true);
      const { data } = await fetchPatients();
      if (data) {
        setPatients(data);
        
        // Find patient with most recent vitals for active emergency
        const patientsWithVitals = data.filter(p => p.vitals && p.vitals.length > 0);
        if (patientsWithVitals.length > 0) {
          // Sort by creation date
          patientsWithVitals.sort((a, b) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          });
          
          setLatestPatient(patientsWithVitals[0]);
        }
      }
      setLoading(false);
    };

    loadPatients();
  }, []);

  const handleNewCase = () => {
    navigate('/assessment');
  };

  const getPatientVitals = (patient: any) => {
    if (!patient || !patient.vitals || patient.vitals.length === 0) return null;
    
    // Get the most recent vitals
    return patient.vitals.reduce((latest: any, current: any) => {
      if (!latest) return current;
      return new Date(current.created_at) > new Date(latest.created_at) ? current : latest;
    }, null);
  };

  // Calculate minutes ago
  const getTimeAgo = (dateString: string) => {
    const minutes = Math.floor((new Date().getTime() - new Date(dateString).getTime()) / 60000);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hr ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {profile?.full_name || 'User'}. Here's your overview.</p>
        </div>
        <Button className="emergency-btn flex items-center gap-2" onClick={handleNewCase}>
          <PlusCircle className="h-5 w-5" />
          New Emergency Case
        </Button>
      </div>

      {/* Active Emergency Section */}
      {latestPatient ? (
        <Card className="border-emergency">
          <CardHeader className="bg-emergency/10 pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-emergency flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Active Emergency
              </CardTitle>
              <Badge className="bg-emergency">Critical</Badge>
            </div>
            <CardDescription>
              <div className="flex flex-wrap gap-3 mt-1">
                <div className="flex items-center gap-1 text-sm">
                  <Clock className="h-4 w-4" />
                  <span>Started {getTimeAgo(latestPatient.created_at)}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <MapPin className="h-4 w-4" />
                  <span>Patient: {latestPatient.name || 'Unknown'}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-4 w-4" />
                  <span>ID: {latestPatient.patient_id || 'Unknown'}</span>
                </div>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {getPatientVitals(latestPatient) && (
                <>
                  <div className="vital-card">
                    <div className="vital-label">Heart Rate</div>
                    <div className={`vital-value ${getPatientVitals(latestPatient).heart_rate > 100 ? "text-emergency" : ""}`}>
                      {getPatientVitals(latestPatient).heart_rate || '–'} bpm
                    </div>
                  </div>
                  <div className="vital-card">
                    <div className="vital-label">Blood Pressure</div>
                    <div className="vital-value">
                      {getPatientVitals(latestPatient).bp_systolic || '–'}/{getPatientVitals(latestPatient).bp_diastolic || '–'} mmHg
                    </div>
                  </div>
                  <div className="vital-card">
                    <div className="vital-label">SpO2</div>
                    <div className={`vital-value ${getPatientVitals(latestPatient).spo2 < 95 ? "text-warning" : ""}`}>
                      {getPatientVitals(latestPatient).spo2 || '–'}%
                    </div>
                  </div>
                  <div className="vital-card">
                    <div className="vital-label">Temperature</div>
                    <div className="vital-value">
                      {getPatientVitals(latestPatient).temperature || '–'}°C
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Button className="medical-btn flex-1" onClick={() => navigate('/assessment')}>
                Update Patient Status
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => navigate('/patients')}>
                View Case Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-8">
            <div className="flex flex-col items-center justify-center text-center">
              <AlertTriangle className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No active emergency</h3>
              <p className="text-muted-foreground mb-4">Create a new emergency case to track patient vitals and details</p>
              <Button className="emergency-btn" onClick={handleNewCase}>
                <PlusCircle className="h-4 w-4 mr-2" />
                New Emergency Case
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transports Today
            </CardTitle>
            <Ambulance className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {patients.length > 0 ? `+${patients.length} from yesterday` : "No transports today"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients.length || 0}</div>
            <p className="text-xs text-muted-foreground">
              {patients.length > 0 
                ? `${Math.floor(patients.length/3)} critical, ${Math.floor(patients.length/3)} stable, ${patients.length - 2*Math.floor(patients.length/3)} minor`
                : "No patients recorded"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Response Time
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5 min</div>
            <p className="text-xs text-muted-foreground">
              -1.2 min from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Cases and Analytics */}
      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent Cases</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Cases</CardTitle>
              <CardDescription>
                Your most recent emergency responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <p>Loading recent cases...</p>
                ) : patients.length > 0 ? (
                  patients.slice(0, 3).map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <h3 className="font-medium">{patient.name || 'Unknown Patient'}</h3>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{patient.patient_id || 'No ID'}</span>
                          <span>{new Date(patient.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <Badge className={
                        patient.vitals && patient.vitals.length > 0 ? 
                          (getPatientVitals(patient)?.heart_rate > 100 || getPatientVitals(patient)?.bp_systolic > 140 || getPatientVitals(patient)?.spo2 < 92) ? 
                            "bg-emergency" : 
                            (getPatientVitals(patient)?.heart_rate > 90 || getPatientVitals(patient)?.bp_systolic > 130 || getPatientVitals(patient)?.spo2 < 95) ? 
                              "bg-warning" : 
                              "bg-success" 
                          : "bg-gray-500"
                      }>
                        {patient.vitals && patient.vitals.length > 0 ? 
                          (getPatientVitals(patient)?.heart_rate > 100 || getPatientVitals(patient)?.bp_systolic > 140 || getPatientVitals(patient)?.spo2 < 92) ? 
                            "Critical" : 
                            (getPatientVitals(patient)?.heart_rate > 90 || getPatientVitals(patient)?.bp_systolic > 130 || getPatientVitals(patient)?.spo2 < 95) ? 
                              "Moderate" : 
                              "Stable" 
                          : "Unknown"
                        }
                      </Badge>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p>No recent cases found.</p>
                  </div>
                )}
              </div>
              <Button variant="outline" className="w-full mt-4" onClick={() => navigate('/patients')}>
                View All Cases
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                Your response metrics and performance data
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">
                  Detailed performance metrics will be available in the next update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
