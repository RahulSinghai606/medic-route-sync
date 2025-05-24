
// Types for hospital platform components
export interface CaseItem {
  id: number;
  severity: 'Critical' | 'Urgent' | 'Stable';
  patient: string;
  condition: string;
  eta: number;
  location: string;
  vitals: {
    hr: number;
    bp: string;
    spo2: number;
    gcs: number;
  };
}

export interface Department {
  name: string;
  beds: number;
  total: number;
  alert: 'Critical' | 'Medium' | 'Low';
}
