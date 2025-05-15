
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, UserCheck } from 'lucide-react';
import { CaseItem } from './types';
import { getSeverityColor } from './utils';

interface CaseSummaryProps {
  caseItem: CaseItem;
  onViewDetails: (id: number) => void;
}

const CaseSummary: React.FC<CaseSummaryProps> = ({ caseItem, onViewDetails }) => {
  return (
    <div className="border rounded-lg p-3 flex justify-between items-start">
      <div>
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${
            caseItem.severity === 'Critical' ? 'bg-red-500' : 
            caseItem.severity === 'Urgent' ? 'bg-amber-500' : 'bg-green-500'
          }`}></span>
          <span className="font-medium">Case #{caseItem.id}</span>
          <Badge className={getSeverityColor(caseItem.severity)}>
            {caseItem.severity}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {caseItem.patient} - {caseItem.condition}
        </p>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          <span>ETA: {caseItem.eta} minutes</span>
        </div>
      </div>
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => onViewDetails(caseItem.id)}
      >
        <UserCheck className="h-4 w-4 mr-1" />
        Details
      </Button>
    </div>
  );
};

export default CaseSummary;
