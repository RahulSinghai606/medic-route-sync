
import { CaseItem } from './types';

export const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'Critical':
      return 'bg-red-500 text-white';
    case 'Urgent':
      return 'bg-amber-500 text-white';
    case 'Stable':
      return 'bg-green-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
};

export const incomingCases: CaseItem[] = [
  {
    id: 1001,
    patient: 'Rajesh Kumar',
    condition: 'Cardiac',
    severity: 'Critical' as const,
    eta: 8,
    vitals: {
      hr: 45,
      bp: '85/50',
      spo2: 89,
      gcs: 12
    },
    location: 'Kuvempunagar, Mysuru'
  },
  {
    id: 1002,
    patient: 'Lakshmi Devi',
    condition: 'Trauma',
    severity: 'Urgent' as const,
    eta: 12,
    vitals: {
      hr: 110,
      bp: '140/90',
      spo2: 94,
      gcs: 14
    },
    location: 'Jayalakshmipuram, Mysuru'
  },
  {
    id: 1003,
    patient: 'Suresh Babu',
    condition: 'Respiratory',
    severity: 'Critical' as const,
    eta: 6,
    vitals: {
      hr: 125,
      bp: '160/95',
      spo2: 88,
      gcs: 11
    },
    location: 'Vijayanagar, Mysuru'
  },
  {
    id: 1004,
    patient: 'Priya Sharma',
    condition: 'Pediatric',
    severity: 'Stable' as const,
    eta: 15,
    vitals: {
      hr: 85,
      bp: '110/70',
      spo2: 97,
      gcs: 15
    },
    location: 'Hebbal, Mysuru'
  },
  {
    id: 1005,
    patient: 'Ravi Gowda',
    condition: 'Neurological',
    severity: 'Urgent' as const,
    eta: 10,
    vitals: {
      hr: 95,
      bp: '135/85',
      spo2: 96,
      gcs: 13
    },
    location: 'Saraswathipuram, Mysuru'
  }
];
