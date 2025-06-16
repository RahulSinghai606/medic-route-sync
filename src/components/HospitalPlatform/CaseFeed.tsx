
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Heart, AlertTriangle } from 'lucide-react';
import { useCases } from '@/hooks/useCases';
import CaseDetails from './CaseDetails';
import CaseSummary from './CaseSummary';

const CaseFeed: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const { data: cases, isLoading } = useCases();

  const handleViewDetails = (caseId: string) => {
    setSelectedCaseId(caseId);
  };

  const handleCloseDetails = () => {
    setSelectedCaseId(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!cases || cases.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No active cases at the moment</p>
        </CardContent>
      </Card>
    );
  }

  const selectedCase = cases.find(c => c.id === selectedCaseId);

  return (
    <div className="space-y-4">
      {selectedCase ? (
        <CaseDetails case={selectedCase} onClose={handleCloseDetails} />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Active Cases ({cases.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {cases.map((caseItem) => (
              <CaseSummary
                key={caseItem.id}
                caseItem={caseItem}
                onViewDetails={handleViewDetails}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CaseFeed;
