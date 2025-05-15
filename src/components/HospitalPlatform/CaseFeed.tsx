
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CaseSummary from './CaseSummary';
import CaseDetails from './CaseDetails';
import { CaseItem } from './types';
import { incomingCases } from './utils';
import { useToast } from '@/hooks/use-toast';

const CaseFeed: React.FC = () => {
  const [selectedCase, setSelectedCase] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const { toast } = useToast();

  const handleAcceptCase = (caseId: number) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedCase(null);
      toast({
        title: "Case Accepted",
        description: `Case #${caseId} has been accepted and departments notified.`,
      });
      setLoading(false);
    }, 1000);
  };
  
  const handleDeclineCase = (caseId: number) => {
    setLoading(true);
    setTimeout(() => {
      setSelectedCase(null);
      toast({
        title: "Case Declined",
        description: `Case #${caseId} has been declined. Paramedic will be redirected.`,
        variant: "destructive"
      });
      setLoading(false);
    }, 1000);
  };

  const handleViewCaseDetails = (caseId: number) => {
    setSelectedCase(caseId);
  };

  const getCurrentCase = (): CaseItem | undefined => {
    return incomingCases.find(c => c.id === selectedCase);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Case Feed</CardTitle>
        <CardDescription>Real-time updates from inbound ambulances</CardDescription>
      </CardHeader>
      <CardContent>
        {selectedCase ? (
          <CaseDetails 
            caseId={selectedCase}
            onBack={() => setSelectedCase(null)}
            caseItem={getCurrentCase()!}
            loading={loading}
            onAccept={handleAcceptCase}
            onDecline={handleDeclineCase}
          />
        ) : (
          <div className="space-y-4">
            {incomingCases.map((caseItem) => (
              <CaseSummary 
                key={caseItem.id} 
                caseItem={caseItem} 
                onViewDetails={handleViewCaseDetails} 
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CaseFeed;
