
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { CaseItem } from './types';
import { getSeverityColor } from './utils';

interface CaseDetailsProps {
  caseId: number;
  onBack: () => void;
  caseItem: CaseItem;
  loading: boolean;
  onAccept: (id: number) => void;
  onDecline: (id: number) => void;
}

const CaseDetails: React.FC<CaseDetailsProps> = ({
  caseId,
  onBack,
  caseItem,
  loading,
  onAccept,
  onDecline
}) => {
  return (
    <div className="space-y-4">
      <Button 
        variant="outline" 
        size="sm" 
        className="mb-2"
        onClick={onBack}
      >
        ← Back to all cases
      </Button>
      
      {/* Case detail view */}
      <div className="border rounded-lg p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${
                caseItem.severity === 'Critical' ? 'bg-red-500' : 
                caseItem.severity === 'Urgent' ? 'bg-amber-500' : 'bg-green-500'
              }`}></span>
              <span className="font-medium text-lg">Case #{caseId}</span>
              <Badge className={getSeverityColor(caseItem.severity)}>
                {caseItem.severity}
              </Badge>
            </div>
            <p className="text-muted-foreground mt-1">
              {caseItem.patient} - {caseItem.condition}
            </p>
          </div>
          <Badge variant="outline" className="flex gap-1 items-center">
            <Clock className="h-3 w-3" />
            <span>ETA: {caseItem.eta} min</span>
          </Badge>
        </div>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md mb-4">
          <h3 className="text-sm font-medium mb-2">Vital Signs</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">Heart Rate</p>
              <p className="font-medium">{caseItem.vitals.hr} bpm</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Blood Pressure</p>
              <p className="font-medium">{caseItem.vitals.bp} mmHg</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">SpO2</p>
              <p className="font-medium">{caseItem.vitals.spo2}%</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">GCS</p>
              <p className="font-medium">{caseItem.vitals.gcs}/15</p>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Required Resources</h3>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">Emergency Bed</Badge>
            <Badge variant="secondary">Cardiac Monitor</Badge>
            <Badge variant="secondary">ECG</Badge>
            {caseItem.severity === 'Critical' && (
              <Badge variant="secondary">ICU Standby</Badge>
            )}
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Paramedic Notes</h3>
          <p className="text-sm text-muted-foreground">
            Patient presents with chest pain radiating to left arm, started 45 minutes ago while at rest.
            History of hypertension and type 2 diabetes. Currently on aspirin and nitroglycerin administered by paramedic team.
          </p>
        </div>
        
        <div className="flex gap-2 mt-6">
          <Button 
            className="flex-1 bg-green-600 hover:bg-green-700"
            onClick={() => onAccept(caseId)}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
            Accept Case
          </Button>
          <Button 
            variant="outline" 
            className="flex-1"
            onClick={() => onDecline(caseId)}
            disabled={loading}
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
            Decline - Redirect
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CaseDetails;
