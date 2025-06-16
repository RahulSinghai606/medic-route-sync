
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import CaseSummary from './CaseSummary';
import { useToast } from '@/hooks/use-toast';
import { useCases, updateCaseStatus, CaseWithRelations } from '@/hooks/useCases';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

const CaseFeed: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { toast } = useToast();
  const { data: incomingCases, isLoading, error } = useCases('pending_approval');

  const handleAcceptCase = async (caseId: string) => {
    setIsSubmitting(true);
    try {
      await updateCaseStatus(caseId, 'accepted');
      toast({
        title: "Case Accepted",
        description: `Case #${caseId.substring(0,8)} has been accepted.`,
      });
      setSelectedCaseId(null);
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to accept case.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeclineCase = async (caseId: string) => {
    setIsSubmitting(true);
    try {
      await updateCaseStatus(caseId, 'declined');
      toast({
        title: "Case Declined",
        description: `Case #${caseId.substring(0,8)} has been declined.`,
        variant: "destructive"
      });
      setSelectedCaseId(null);
    } catch (e: any) {
      toast({ title: "Error", description: e.message || "Failed to decline case.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewCaseDetails = (caseId: string) => {
    setSelectedCaseId(caseId);
  };

  const selectedCase = React.useMemo(() => 
    incomingCases?.find(c => c.id === selectedCaseId),
    [incomingCases, selectedCaseId]
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-red-500 flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/50 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span>Error loading case feed: {error.message}</span>
        </div>
      );
    }

    if (selectedCase) {
      return (
        <div>
          <Button variant="outline" size="sm" onClick={() => setSelectedCaseId(null)} className="mb-4">
            &larr; Back to Feed
          </Button>
          <div className="space-y-3 rounded-lg border p-4">
            <h3 className="text-lg font-bold">Case Details for #{selectedCase.id.substring(0,8)}</h3>
            <p><strong>Patient:</strong> {selectedCase.patients?.name || 'N/A'}</p>
            <p><strong>Severity:</strong> {selectedCase.severity}</p>
            <p><strong>ETA:</strong> {selectedCase.eta_minutes || 'N/A'} minutes</p>
            <p><strong>Paramedic:</strong> {selectedCase.paramedic?.full_name || 'N/A'}</p>
            <p><strong>Notes:</strong> {selectedCase.paramedic_notes || 'None'}</p>
            <div className="flex gap-4 pt-4 border-t">
              <Button onClick={() => handleAcceptCase(selectedCase.id)} disabled={isSubmitting}>
                {isSubmitting ? 'Accepting...' : 'Accept Case'}
              </Button>
              <Button variant="destructive" onClick={() => handleDeclineCase(selectedCase.id)} disabled={isSubmitting}>
                {isSubmitting ? 'Declining...' : 'Decline Case'}
              </Button>
            </div>
          </div>
        </div>
      );
    }
    
    if (!incomingCases || incomingCases.length === 0) {
        return <p className="text-muted-foreground text-center py-8">No incoming cases at the moment.</p>;
    }

    return (
      <div className="space-y-4">
        {incomingCases.map((caseItem) => (
          <CaseSummary 
            key={caseItem.id} 
            caseItem={caseItem} 
            onViewDetails={handleViewCaseDetails} 
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Case Feed</CardTitle>
        <CardDescription>Real-time updates from inbound ambulances</CardDescription>
      </CardHeader>
      <CardContent>
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default CaseFeed;
