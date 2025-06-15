
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

export interface RealTimeMetrics {
  timestamp: Date;
  totalBeds: number;
  availableBeds: number;
  occupiedBeds: number;
  icuBeds: number;
  availableIcuBeds: number;
  emergencyQueue: number;
  incomingAmbulances: number;
  criticalPatients: number;
  totalStaff: number;
  onDutyStaff: number;
  avgResponseTime: number;
  patientSatisfaction: number;
  revenue: number;
  operatingRooms: number;
  availableOR: number;
  mortalityRate: number;
  readmissionRate: number;
}

export interface PatientData {
  id: string;
  name: string;
  age: number;
  condition: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  eta: string;
  vitals: {
    heartRate: number;
    bloodPressure: string;
    oxygen: number;
    temperature: number;
    respiratoryRate: number;
  };
  assignedDoctor: string;
  room: string;
  admissionTime: Date;
  insurance: string;
  notes: string;
}

export interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  status: 'Available' | 'Busy' | 'Break' | 'Off-Duty';
  shift: string;
  contactInfo: string;
  specializations: string[];
}

export interface OperatingRoom {
  id: string;
  name: string;
  status: 'Available' | 'In-Use' | 'Cleaning' | 'Maintenance';
  currentProcedure?: string;
  estimatedCompletion?: Date;
  equipment: string[];
  nextScheduled?: Date;
}

const useHospitalData = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<RealTimeMetrics>({
    timestamp: new Date(),
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
    patientSatisfaction: 94,
    revenue: 2500000,
    operatingRooms: 12,
    availableOR: 4,
    mortalityRate: 2.1,
    readmissionRate: 8.3
  });

  const [patients, setPatients] = useState<PatientData[]>([
    {
      id: 'P001',
      name: 'Sarah Johnson',
      age: 34,
      condition: 'Cardiac Emergency',
      severity: 'Critical',
      eta: '5 min',
      vitals: { heartRate: 110, bloodPressure: '140/90', oxygen: 94, temperature: 38.2, respiratoryRate: 22 },
      assignedDoctor: 'Dr. Smith',
      room: 'ICU-3',
      admissionTime: new Date(Date.now() - 3600000),
      insurance: 'Premium Care',
      notes: 'Acute myocardial infarction, stable condition'
    },
    {
      id: 'P002',
      name: 'Michael Chen',
      age: 67,
      condition: 'Stroke Symptoms',
      severity: 'High',
      eta: '12 min',
      vitals: { heartRate: 95, bloodPressure: '160/100', oxygen: 97, temperature: 37.1, respiratoryRate: 18 },
      assignedDoctor: 'Dr. Williams',
      room: 'ER-7',
      admissionTime: new Date(Date.now() - 7200000),
      insurance: 'Standard Care',
      notes: 'Suspected ischemic stroke, CT scan pending'
    }
  ]);

  const [staff, setStaff] = useState<StaffMember[]>([
    {
      id: 'S001',
      name: 'Dr. Sarah Smith',
      role: 'Cardiologist',
      department: 'Cardiology',
      status: 'Busy',
      shift: 'Day (7AM-7PM)',
      contactInfo: 'ext. 2245',
      specializations: ['Interventional Cardiology', 'Heart Surgery']
    },
    {
      id: 'S002',
      name: 'Nurse Jennifer Adams',
      role: 'Head Nurse',
      department: 'ICU',
      status: 'Available',
      shift: 'Night (7PM-7AM)',
      contactInfo: 'ext. 3321',
      specializations: ['Critical Care', 'Emergency Response']
    }
  ]);

  const [operatingRooms, setOperatingRooms] = useState<OperatingRoom[]>([
    {
      id: 'OR-1',
      name: 'Operating Room 1',
      status: 'In-Use',
      currentProcedure: 'Cardiac Bypass Surgery',
      estimatedCompletion: new Date(Date.now() + 7200000),
      equipment: ['Heart-Lung Machine', 'Anesthesia Machine', 'Surgical Monitors'],
      nextScheduled: new Date(Date.now() + 10800000)
    },
    {
      id: 'OR-2',
      name: 'Operating Room 2',
      status: 'Available',
      equipment: ['General Surgery Setup', 'Laparoscopic Equipment'],
      nextScheduled: new Date(Date.now() + 3600000)
    }
  ]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        timestamp: new Date(),
        availableBeds: prev.availableBeds + Math.floor(Math.random() * 3) - 1,
        emergencyQueue: Math.max(0, prev.emergencyQueue + Math.floor(Math.random() * 3) - 1),
        avgResponseTime: prev.avgResponseTime + (Math.random() - 0.5) * 0.5,
        patientSatisfaction: Math.min(100, Math.max(85, prev.patientSatisfaction + (Math.random() - 0.5) * 2))
      }));

      // Update patient vitals
      setPatients(prev => prev.map(patient => ({
        ...patient,
        vitals: {
          ...patient.vitals,
          heartRate: Math.max(60, Math.min(150, patient.vitals.heartRate + Math.floor(Math.random() * 6) - 3)),
          oxygen: Math.max(88, Math.min(100, patient.vitals.oxygen + Math.floor(Math.random() * 4) - 2)),
          temperature: Math.max(36, Math.min(40, patient.vitals.temperature + (Math.random() - 0.5) * 0.2))
        }
      })));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const updateMetric = useCallback((key: keyof RealTimeMetrics, value: number) => {
    setMetrics(prev => ({ ...prev, [key]: value, timestamp: new Date() }));
    toast({
      title: "Metric Updated",
      description: `${key} has been updated to ${value}`,
    });
  }, [toast]);

  const updatePatient = useCallback((patientId: string, updates: Partial<PatientData>) => {
    setPatients(prev => prev.map(patient => 
      patient.id === patientId ? { ...patient, ...updates } : patient
    ));
    toast({
      title: "Patient Updated",
      description: `Patient information has been updated successfully`,
    });
  }, [toast]);

  const updateStaffMember = useCallback((staffId: string, updates: Partial<StaffMember>) => {
    setStaff(prev => prev.map(member => 
      member.id === staffId ? { ...member, ...updates } : member
    ));
    toast({
      title: "Staff Updated",
      description: `Staff member information has been updated`,
    });
  }, [toast]);

  const updateOperatingRoom = useCallback((roomId: string, updates: Partial<OperatingRoom>) => {
    setOperatingRooms(prev => prev.map(room => 
      room.id === roomId ? { ...room, ...updates } : room
    ));
    toast({
      title: "Operating Room Updated",
      description: `Operating room status has been updated`,
    });
  }, [toast]);

  return {
    metrics,
    patients,
    staff,
    operatingRooms,
    updateMetric,
    updatePatient,
    updateStaffMember,
    updateOperatingRoom
  };
};

export default useHospitalData;
