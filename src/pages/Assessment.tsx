
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Heart, 
  Droplets, 
  Thermometer, 
  Stethoscope, 
  Brain,
  User,
  Map,
  ClipboardList,
  Save,
  SendHorizontal
} from 'lucide-react';
import { savePatientInfo, saveVitals, saveIncident, saveMedicalHistory, usePatientOperations } from '@/lib/patientUtils';

const PatientAssessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { handleSaveResult } = usePatientOperations();
  const [currentTab, setCurrentTab] = useState('vitals');
  const [savedPatientId, setSavedPatientId] = useState<string | null>(null);
  
  // State for vitals
  const [painLevel, setPainLevel] = useState(0);
  const [consciousnessLevel, setConsciousnessLevel] = useState(15); // Glasgow Coma Scale
  const [vitalsData, setVitalsData] = useState({
    heart_rate: 75,
    bp_systolic: 120,
    bp_diastolic: 80,
    spo2: 98,
    temperature: 36.8,
    respiratory_rate: 16,
    gcs: 15,
    pain_level: 0,
    notes: ''
  });

  // State for patient info
  const [patientData, setPatientData] = useState({
    name: '',
    age: '',
    gender: '',
    phone: '',
    address: '',
    patient_id: 'P-' + Math.floor(1000 + Math.random() * 9000),
    emergency_contact: '',
    emergency_contact_phone: ''
  });

  // State for incident details
  const [incidentData, setIncidentData] = useState({
    incident_type: '',
    incident_location: '',
    incident_date: new Date().toISOString().slice(0, 16),
    incident_severity: '',
    chief_complaint: '',
    description: '',
    interventions: [] as string[]
  });

  // State for medical history
  const [medicalHistoryData, setMedicalHistoryData] = useState({
    conditions: [] as string[],
    allergies: '',
    medications: '',
    surgical_history: '',
    family_history: '',
    additional_factors: [] as string[]
  });

  // Handle vitals input changes
  const handleVitalsChange = (field: string, value: any) => {
    setVitalsData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle patient data input changes
  const handlePatientDataChange = (field: string, value: any) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle incident data input changes
  const handleIncidentDataChange = (field: string, value: any) => {
    setIncidentData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle medical history input changes
  const handleMedicalHistoryChange = (field: string, value: any) => {
    setMedicalHistoryData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle checkbox changes for arrays
  const handleCheckboxChange = (field: string, collection: string, value: string, isChecked: boolean) => {
    if (collection === 'interventions') {
      setIncidentData(prev => {
        const updatedInterventions = isChecked 
          ? [...prev.interventions, value]
          : prev.interventions.filter(item => item !== value);
        return { ...prev, interventions: updatedInterventions };
      });
    } else if (collection === 'conditions') {
      setMedicalHistoryData(prev => {
        const updatedConditions = isChecked 
          ? [...prev.conditions, value]
          : prev.conditions.filter(item => item !== value);
        return { ...prev, conditions: updatedConditions };
      });
    } else if (collection === 'additional_factors') {
      setMedicalHistoryData(prev => {
        const updatedFactors = isChecked 
          ? [...prev.additional_factors, value]
          : prev.additional_factors.filter(item => item !== value);
        return { ...prev, additional_factors: updatedFactors };
      });
    }
  };

  // Update pain level and consciousness level in vitals data
  React.useEffect(() => {
    handleVitalsChange('pain_level', painLevel);
  }, [painLevel]);

  React.useEffect(() => {
    handleVitalsChange('gcs', consciousnessLevel);
  }, [consciousnessLevel]);

  // Save vitals
  const handleSaveVitals = async () => {
    if (!savedPatientId) {
      // First save patient info if not already saved
      const patientResult = await savePatientInfo(patientData);
      if (patientResult.error) {
        toast({
          title: "Error",
          description: "Please save patient information first",
          variant: "destructive",
        });
        setCurrentTab('patient');
        return;
      }
      
      setSavedPatientId(patientResult.data.id);
      const result = await saveVitals(vitalsData, patientResult.data.id);
      handleSaveResult(result, "Vital signs saved successfully");
    } else {
      const result = await saveVitals(vitalsData, savedPatientId);
      handleSaveResult(result, "Vital signs saved successfully");
    }
  };

  // Save patient information
  const handleSavePatient = async () => {
    if (!patientData.name) {
      toast({
        title: "Error",
        description: "Patient name is required",
        variant: "destructive",
      });
      return;
    }

    if (savedPatientId) {
      toast({
        title: "Info",
        description: "Patient information already saved",
      });
      return;
    }

    const result = await savePatientInfo(patientData);
    if (handleSaveResult(result, "Patient information saved successfully")) {
      setSavedPatientId(result.data.id);
    }
  };

  // Save incident details
  const handleSaveIncident = async () => {
    if (!savedPatientId) {
      toast({
        title: "Error",
        description: "Please save patient information first",
        variant: "destructive",
      });
      setCurrentTab('patient');
      return;
    }

    const result = await saveIncident(incidentData, savedPatientId);
    handleSaveResult(result, "Incident details saved successfully");
  };

  // Save medical history
  const handleSaveMedicalHistory = async () => {
    if (!savedPatientId) {
      toast({
        title: "Error",
        description: "Please save patient information first",
        variant: "destructive",
      });
      setCurrentTab('patient');
      return;
    }

    const result = await saveMedicalHistory(medicalHistoryData, savedPatientId);
    handleSaveResult(result, "Medical history saved successfully");
  };

  // Submit entire assessment
  const handleSubmitAssessment = async () => {
    if (!savedPatientId) {
      const patientResult = await savePatientInfo(patientData);
      if (patientResult.error) {
        toast({
          title: "Error",
          description: "Failed to save patient information",
          variant: "destructive",
        });
        return;
      }
      setSavedPatientId(patientResult.data.id);
      
      // Save all sections
      await saveVitals(vitalsData, patientResult.data.id);
      await saveIncident(incidentData, patientResult.data.id);
      await saveMedicalHistory(medicalHistoryData, patientResult.data.id);
      
      toast({
        title: "Success",
        description: "Assessment completed successfully",
      });
      
      // Navigate to patients page after saving
      navigate('/patients');
    } else {
      // Update any remaining sections
      await saveVitals(vitalsData, savedPatientId);
      await saveIncident(incidentData, savedPatientId);
      await saveMedicalHistory(medicalHistoryData, savedPatientId);
      
      toast({
        title: "Success",
        description: "Assessment updated successfully",
      });
      
      // Navigate to patients page after saving
      navigate('/patients');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1>Patient Assessment</h1>
          <p className="text-muted-foreground">Evaluate and record patient condition</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button className="emergency-btn flex items-center gap-2" onClick={handleSubmitAssessment}>
            <SendHorizontal className="h-4 w-4" />
            Submit Assessment
          </Button>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="vitals">Vital Signs</TabsTrigger>
          <TabsTrigger value="patient">Patient Info</TabsTrigger>
          <TabsTrigger value="incident">Incident Details</TabsTrigger>
          <TabsTrigger value="history">Medical History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vitals">
          <Card>
            <CardHeader>
              <CardTitle>Vital Signs</CardTitle>
              <CardDescription>Record and monitor patient vital signs</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Heart Rate */}
                <div className="space-y-2">
                  <Label htmlFor="heart-rate" className="flex items-center gap-2 text-base">
                    <Heart className="h-5 w-5 text-emergency" />
                    Heart Rate (bpm)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="heart-rate" 
                      type="number" 
                      placeholder="60-100" 
                      className="text-lg" 
                      value={vitalsData.heart_rate}
                      onChange={(e) => handleVitalsChange('heart_rate', parseInt(e.target.value) || 0)}
                    />
                    <Badge>{vitalsData.heart_rate < 60 ? "Low" : vitalsData.heart_rate > 100 ? "High" : "Normal"}</Badge>
                  </div>
                </div>

                {/* Blood Pressure */}
                <div className="space-y-2">
                  <Label htmlFor="bp-systolic" className="flex items-center gap-2 text-base">
                    <Droplets className="h-5 w-5 text-medical" />
                    Blood Pressure (mmHg)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="bp-systolic" 
                      type="number" 
                      placeholder="Systolic" 
                      className="text-lg" 
                      value={vitalsData.bp_systolic}
                      onChange={(e) => handleVitalsChange('bp_systolic', parseInt(e.target.value) || 0)}
                    />
                    <span>/</span>
                    <Input 
                      id="bp-diastolic" 
                      type="number" 
                      placeholder="Diastolic" 
                      className="text-lg" 
                      value={vitalsData.bp_diastolic}
                      onChange={(e) => handleVitalsChange('bp_diastolic', parseInt(e.target.value) || 0)}
                    />
                    <Badge>
                      {vitalsData.bp_systolic > 140 || vitalsData.bp_diastolic > 90 ? "High" : 
                       vitalsData.bp_systolic < 90 || vitalsData.bp_diastolic < 60 ? "Low" : "Normal"}
                    </Badge>
                  </div>
                </div>

                {/* SpO2 */}
                <div className="space-y-2">
                  <Label htmlFor="spo2" className="flex items-center gap-2 text-base">
                    <Stethoscope className="h-5 w-5 text-blue-500" />
                    Oxygen Saturation (%)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="spo2" 
                      type="number" 
                      placeholder="95-100" 
                      className="text-lg" 
                      value={vitalsData.spo2}
                      onChange={(e) => handleVitalsChange('spo2', parseInt(e.target.value) || 0)}
                    />
                    <Badge>{vitalsData.spo2 < 95 ? "Low" : "Normal"}</Badge>
                  </div>
                </div>

                {/* Temperature */}
                <div className="space-y-2">
                  <Label htmlFor="temperature" className="flex items-center gap-2 text-base">
                    <Thermometer className="h-5 w-5 text-orange-500" />
                    Temperature (°C)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="temperature" 
                      type="number" 
                      step="0.1" 
                      placeholder="36.5-37.5" 
                      className="text-lg" 
                      value={vitalsData.temperature}
                      onChange={(e) => handleVitalsChange('temperature', parseFloat(e.target.value) || 0)}
                    />
                    <Badge>
                      {vitalsData.temperature > 37.5 ? "Elevated" : 
                       vitalsData.temperature < 36.5 ? "Low" : "Normal"}
                    </Badge>
                  </div>
                </div>

                {/* Respiratory Rate */}
                <div className="space-y-2">
                  <Label htmlFor="resp-rate" className="flex items-center gap-2 text-base">
                    <Stethoscope className="h-5 w-5 text-indigo-500" />
                    Respiratory Rate (breaths/min)
                  </Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      id="resp-rate" 
                      type="number" 
                      placeholder="12-20" 
                      className="text-lg" 
                      value={vitalsData.respiratory_rate}
                      onChange={(e) => handleVitalsChange('respiratory_rate', parseInt(e.target.value) || 0)}
                    />
                    <Badge>
                      {vitalsData.respiratory_rate < 12 ? "Low" : 
                       vitalsData.respiratory_rate > 20 ? "High" : "Normal"}
                    </Badge>
                  </div>
                </div>

                {/* Consciousness Level */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2 text-base">
                    <Brain className="h-5 w-5 text-purple-500" />
                    GCS (3-15)
                  </Label>
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <span>Unresponsive (3)</span>
                      <span>Alert (15)</span>
                    </div>
                    <Slider 
                      value={[consciousnessLevel]} 
                      min={3} 
                      max={15}
                      step={1}
                      onValueChange={(val) => setConsciousnessLevel(val[0])} 
                    />
                    <div className="flex justify-between items-center mt-1">
                      <span>Score: {consciousnessLevel}</span>
                      <Badge>{consciousnessLevel === 15 ? "Alert" : consciousnessLevel >= 9 ? "Impaired" : "Critical"}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pain Assessment */}
              <div className="space-y-2 pt-2 border-t">
                <Label className="text-base">Pain Level (0-10)</Label>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span>No Pain (0)</span>
                    <span>Worst Pain (10)</span>
                  </div>
                  <Slider 
                    value={[painLevel]} 
                    min={0} 
                    max={10}
                    step={1}
                    onValueChange={(val) => setPainLevel(val[0])} 
                  />
                  <div className="flex justify-between items-center mt-1">
                    <span>Level: {painLevel}</span>
                    <Badge className={
                      painLevel <= 3 ? "bg-green-500" : 
                      painLevel <= 6 ? "bg-yellow-500" : 
                      "bg-emergency"
                    }>
                      {painLevel <= 3 ? "Mild" : painLevel <= 6 ? "Moderate" : "Severe"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="vital-notes" className="text-base">Additional Notes</Label>
                <Textarea 
                  id="vital-notes" 
                  placeholder="Enter any additional observations about patient vitals here..." 
                  className="min-h-[100px]"
                  value={vitalsData.notes}
                  onChange={(e) => handleVitalsChange('notes', e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <Switch id="auto-update" />
                <Label htmlFor="auto-update">Auto-update from medical devices</Label>
              </div>
              <Button className="medical-btn" onClick={handleSaveVitals}>Save Vitals</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="patient">
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
              <CardDescription>Record patient demographic details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="patient-name" className="flex items-center gap-2 text-base">
                    <User className="h-5 w-5" />
                    Patient Name
                  </Label>
                  <Input 
                    id="patient-name" 
                    placeholder="Full name" 
                    className="text-lg"
                    value={patientData.name}
                    onChange={(e) => handlePatientDataChange('name', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="patient-age" className="text-base">Age</Label>
                  <Input 
                    id="patient-age" 
                    type="number" 
                    placeholder="Age in years" 
                    className="text-lg"
                    value={patientData.age}
                    onChange={(e) => handlePatientDataChange('age', parseInt(e.target.value) || '')}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="patient-gender" className="text-base">Gender</Label>
                  <select 
                    id="patient-gender" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={patientData.gender}
                    onChange={(e) => handlePatientDataChange('gender', e.target.value)}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="patient-id" className="text-base">Patient ID</Label>
                  <Input 
                    id="patient-id" 
                    placeholder="ID number if available" 
                    className="text-lg"
                    value={patientData.patient_id}
                    onChange={(e) => handlePatientDataChange('patient_id', e.target.value)}
                    readOnly
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="patient-phone" className="text-base">Phone Number</Label>
                  <Input 
                    id="patient-phone" 
                    type="tel" 
                    placeholder="Contact number" 
                    className="text-lg"
                    value={patientData.phone}
                    onChange={(e) => handlePatientDataChange('phone', e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="patient-address" className="text-base">Address</Label>
                <Textarea 
                  id="patient-address" 
                  placeholder="Patient's home address if available" 
                  className="min-h-[80px]"
                  value={patientData.address}
                  onChange={(e) => handlePatientDataChange('address', e.target.value)}
                />
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="emergency-contact" className="text-base">Emergency Contact</Label>
                <Input 
                  id="emergency-contact" 
                  placeholder="Name of emergency contact" 
                  className="text-lg mb-2"
                  value={patientData.emergency_contact}
                  onChange={(e) => handlePatientDataChange('emergency_contact', e.target.value)}
                />
                <Input 
                  id="emergency-contact-phone" 
                  placeholder="Emergency contact phone" 
                  className="text-lg"
                  value={patientData.emergency_contact_phone}
                  onChange={(e) => handlePatientDataChange('emergency_contact_phone', e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="medical-btn w-full" onClick={handleSavePatient}>Save Patient Information</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="incident">
          <Card>
            <CardHeader>
              <CardTitle>Incident Details</CardTitle>
              <CardDescription>Record information about the emergency incident</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="incident-type" className="flex items-center gap-2 text-base">
                    <ClipboardList className="h-5 w-5" />
                    Incident Type
                  </Label>
                  <select 
                    id="incident-type" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={incidentData.incident_type}
                    onChange={(e) => handleIncidentDataChange('incident_type', e.target.value)}
                  >
                    <option value="">Select incident type</option>
                    <option value="medical">Medical Emergency</option>
                    <option value="trauma">Trauma/Injury</option>
                    <option value="cardiac">Cardiac Event</option>
                    <option value="respiratory">Respiratory Distress</option>
                    <option value="neurological">Neurological Event</option>
                    <option value="overdose">Overdose/Poisoning</option>
                    <option value="behavioral">Behavioral/Psychiatric</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="incident-location" className="flex items-center gap-2 text-base">
                    <Map className="h-5 w-5" />
                    Incident Location
                  </Label>
                  <Input 
                    id="incident-location" 
                    placeholder="Address or coordinates" 
                    className="text-lg"
                    value={incidentData.incident_location}
                    onChange={(e) => handleIncidentDataChange('incident_location', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="incident-date" className="text-base">Date & Time</Label>
                  <Input 
                    id="incident-date" 
                    type="datetime-local" 
                    className="text-lg"
                    value={incidentData.incident_date}
                    onChange={(e) => handleIncidentDataChange('incident_date', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="incident-severity" className="text-base">Incident Severity</Label>
                  <select 
                    id="incident-severity" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={incidentData.incident_severity}
                    onChange={(e) => handleIncidentDataChange('incident_severity', e.target.value)}
                  >
                    <option value="">Select severity</option>
                    <option value="critical">Critical</option>
                    <option value="severe">Severe</option>
                    <option value="moderate">Moderate</option>
                    <option value="minor">Minor</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="chief-complaint" className="text-base">Chief Complaint</Label>
                <Textarea 
                  id="chief-complaint" 
                  placeholder="Primary reason for emergency response" 
                  className="min-h-[80px]"
                  value={incidentData.chief_complaint}
                  onChange={(e) => handleIncidentDataChange('chief_complaint', e.target.value)}
                />
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="incident-description" className="text-base">Incident Description</Label>
                <Textarea 
                  id="incident-description" 
                  placeholder="Detailed description of the emergency situation" 
                  className="min-h-[120px]"
                  value={incidentData.description}
                  onChange={(e) => handleIncidentDataChange('description', e.target.value)}
                />
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                <Label className="text-base mb-2 block">Pre-Hospital Interventions</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['CPR', 'Oxygen', 'IV Access', 'Medications', 'Splinting', 'Bleeding Control', 'Airway Management'].map((intervention) => (
                    <div key={intervention} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id={`intervention-${intervention}`} 
                        className="h-4 w-4"
                        checked={incidentData.interventions.includes(intervention)}
                        onChange={(e) => handleCheckboxChange('interventions', 'interventions', intervention, e.target.checked)} 
                      />
                      <Label htmlFor={`intervention-${intervention}`} className="text-base font-normal">{intervention}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="medical-btn w-full" onClick={handleSaveIncident}>Save Incident Details</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Medical History</CardTitle>
              <CardDescription>Record patient's medical history if available</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-base mb-2 block">Existing Medical Conditions</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Hypertension', 'Diabetes', 'Asthma', 'COPD', 'Heart Disease', 
                    'Stroke', 'Seizures', 'Cancer', 'Kidney Disease', 'Liver Disease', 
                    'Mental Health', 'Blood Disorders'
                  ].map((condition) => (
                    <div key={condition} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id={`condition-${condition}`} 
                        className="h-4 w-4"
                        checked={medicalHistoryData.conditions.includes(condition)}
                        onChange={(e) => handleCheckboxChange('conditions', 'conditions', condition, e.target.checked)}
                      />
                      <Label htmlFor={`condition-${condition}`} className="text-base font-normal">{condition}</Label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="allergies" className="text-base">Allergies</Label>
                <Textarea 
                  id="allergies" 
                  placeholder="List any known allergies (medications, food, etc.)" 
                  className="min-h-[80px]"
                  value={medicalHistoryData.allergies}
                  onChange={(e) => handleMedicalHistoryChange('allergies', e.target.value)}
                />
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="medications" className="text-base">Current Medications</Label>
                <Textarea 
                  id="medications" 
                  placeholder="List current medications and dosages if known" 
                  className="min-h-[80px]"
                  value={medicalHistoryData.medications}
                  onChange={(e) => handleMedicalHistoryChange('medications', e.target.value)}
                />
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="surgical-history" className="text-base">Surgical History</Label>
                <Textarea 
                  id="surgical-history" 
                  placeholder="Previous surgeries and approximate dates" 
                  className="min-h-[80px]"
                  value={medicalHistoryData.surgical_history}
                  onChange={(e) => handleMedicalHistoryChange('surgical_history', e.target.value)}
                />
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="family-history" className="text-base">Family Medical History</Label>
                <Textarea 
                  id="family-history" 
                  placeholder="Relevant family medical history if known" 
                  className="min-h-[80px]"
                  value={medicalHistoryData.family_history}
                  onChange={(e) => handleMedicalHistoryChange('family_history', e.target.value)}
                />
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                <Label className="text-base mb-2 block">Additional Factors</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Smoker', 'Alcohol Use', 'Recreational Drug Use', 'Pregnancy', 
                    'Pacemaker', 'Immunocompromised', 'Recent Hospital Stay'
                  ].map((factor) => (
                    <div key={factor} className="flex items-center gap-2">
                      <input 
                        type="checkbox" 
                        id={`factor-${factor}`} 
                        className="h-4 w-4"
                        checked={medicalHistoryData.additional_factors.includes(factor)}
                        onChange={(e) => handleCheckboxChange('additional_factors', 'additional_factors', factor, e.target.checked)}
                      />
                      <Label htmlFor={`factor-${factor}`} className="text-base font-normal">{factor}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="medical-btn w-full" onClick={handleSaveMedicalHistory}>Save Medical History</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientAssessment;
