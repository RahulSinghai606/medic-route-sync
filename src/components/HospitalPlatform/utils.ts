
import { CaseItem, Department } from './types';

// Utility functions for hospital platform components
export const getSeverityColor = (severity: string) => {
  switch (severity.toLowerCase()) {
    case 'critical': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
    case 'urgent': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
    default: return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
  }
};

export const getAlertColor = (alert: string) => {
  switch (alert.toLowerCase()) {
    case 'critical': return 'bg-red-500';
    case 'medium': return 'bg-amber-500';
    default: return 'bg-green-500';
  }
};

// Sample data for demonstration - properly typed to match CaseItem interface
export const incomingCases: CaseItem[] = [
  { 
    id: 1001, 
    severity: 'Critical' as const, 
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
    severity: 'Urgent' as const, 
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
    severity: 'Stable' as const, 
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

export const departments: Department[] = [
  { name: 'Emergency Department', beds: 7, total: 12, alert: 'Medium' as const },
  { name: 'ICU', beds: 1, total: 8, alert: 'Critical' as const },
  { name: 'Cardiology', beds: 4, total: 10, alert: 'Low' as const },
  { name: 'Orthopedics', beds: 6, total: 12, alert: 'Low' as const },
  { name: 'Neurology', beds: 3, total: 8, alert: 'Medium' as const },
];
