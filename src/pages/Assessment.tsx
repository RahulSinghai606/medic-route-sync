
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

const PatientAssessment = () => {
  const [painLevel, setPainLevel] = useState(0);
  const [consciousnessLevel, setConsciousnessLevel] = useState(15); // Glasgow Coma Scale

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
          <Button className="emergency-btn flex items-center gap-2">
            <SendHorizontal className="h-4 w-4" />
            Submit Assessment
          </Button>
        </div>
      </div>

      <Tabs defaultValue="vitals" className="w-full">
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
                      defaultValue="75"
                    />
                    <Badge>Normal</Badge>
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
                      defaultValue="120"
                    />
                    <span>/</span>
                    <Input 
                      id="bp-diastolic" 
                      type="number" 
                      placeholder="Diastolic" 
                      className="text-lg" 
                      defaultValue="80"
                    />
                    <Badge>Normal</Badge>
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
                      defaultValue="98"
                    />
                    <Badge>Normal</Badge>
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
                      defaultValue="36.8"
                    />
                    <Badge>Normal</Badge>
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
                      defaultValue="16"
                    />
                    <Badge>Normal</Badge>
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
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex items-center gap-2">
                <Switch id="auto-update" />
                <Label htmlFor="auto-update">Auto-update from medical devices</Label>
              </div>
              <Button className="medical-btn">Save Vitals</Button>
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
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="patient-age" className="text-base">Age</Label>
                  <Input 
                    id="patient-age" 
                    type="number" 
                    placeholder="Age in years" 
                    className="text-lg" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="patient-gender" className="text-base">Gender</Label>
                  <select 
                    id="patient-gender" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="patient-weight" className="text-base">Weight (kg)</Label>
                  <Input 
                    id="patient-weight" 
                    type="number" 
                    step="0.1"
                    placeholder="Weight in kg" 
                    className="text-lg" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="patient-phone" className="text-base">Phone Number</Label>
                  <Input 
                    id="patient-phone" 
                    type="tel" 
                    placeholder="Contact number" 
                    className="text-lg" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="patient-id" className="text-base">Patient ID/SSN</Label>
                  <Input 
                    id="patient-id" 
                    placeholder="ID number if available" 
                    className="text-lg" 
                  />
                </div>
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="patient-address" className="text-base">Address</Label>
                <Textarea 
                  id="patient-address" 
                  placeholder="Patient's home address if available" 
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="emergency-contact" className="text-base">Emergency Contact</Label>
                <Input 
                  id="emergency-contact" 
                  placeholder="Name of emergency contact" 
                  className="text-lg mb-2" 
                />
                <Input 
                  id="emergency-contact-phone" 
                  placeholder="Emergency contact phone" 
                  className="text-lg" 
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button className="medical-btn w-full">Save Patient Information</Button>
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
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="incident-date" className="text-base">Date & Time</Label>
                  <Input 
                    id="incident-date" 
                    type="datetime-local" 
                    className="text-lg" 
                    defaultValue={new Date().toISOString().slice(0, 16)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="incident-severity" className="text-base">Incident Severity</Label>
                  <select 
                    id="incident-severity" 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-lg ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
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
                />
              </div>
              
              <div className="space-y-2 pt-2">
                <Label htmlFor="incident-description" className="text-base">Incident Description</Label>
                <Textarea 
                  id="incident-description" 
                  placeholder="Detailed description of the emergency situation" 
                  className="min-h-[120px]"
                />
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                <Label className="text-base mb-2 block">Pre-Hospital Interventions</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {['CPR', 'Oxygen', 'IV Access', 'Medications', 'Splinting', 'Bleeding Control', 'Airway Management'].map((intervention) => (
                    <div key={intervention} className="flex items-center gap-2">
                      <input type="checkbox" id={`intervention-${intervention}`} className="h-4 w-4" />
                      <Label htmlFor={`intervention-${intervention}`} className="text-base font-normal">{intervention}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="medical-btn w-full">Save Incident Details</Button>
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
                      <input type="checkbox" id={`condition-${condition}`} className="h-4 w-4" />
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
                />
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="medications" className="text-base">Current Medications</Label>
                <Textarea 
                  id="medications" 
                  placeholder="List current medications and dosages if known" 
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="surgical-history" className="text-base">Surgical History</Label>
                <Textarea 
                  id="surgical-history" 
                  placeholder="Previous surgeries and approximate dates" 
                  className="min-h-[80px]"
                />
              </div>
              
              <div className="space-y-2 pt-2 border-t">
                <Label htmlFor="family-history" className="text-base">Family Medical History</Label>
                <Textarea 
                  id="family-history" 
                  placeholder="Relevant family medical history if known" 
                  className="min-h-[80px]"
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
                      <input type="checkbox" id={`factor-${factor}`} className="h-4 w-4" />
                      <Label htmlFor={`factor-${factor}`} className="text-base font-normal">{factor}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="medical-btn w-full">Save Medical History</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PatientAssessment;
