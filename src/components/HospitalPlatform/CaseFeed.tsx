
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, User, Heart, AlertTriangle, Activity } from 'lucide-react';
import { useCases, updateCaseStatus } from '@/hooks/useCases';
import CaseDetails from './CaseDetails';
import CaseSummary from './CaseSummary';
import { useToast } from '@/hooks/use-toast';

const CaseFeed: React.FC = () => {
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { data: cases, isLoading } = useCases();
  const { toast } = useToast();

  const handleViewDetails = (caseId: string) => {
    setSelectedCaseId(caseId);
  };

  const handleCloseDetails = () => {
    setSelectedCaseId(null);
  };

  const handleAccept = async (caseId: number) => {
    setLoading(true);
    try {
      await updateCaseStatus(caseId.toString(), 'accepted');
      toast({
        title: "Case Accepted",
        description: "The case has been successfully accepted.",
      });
      setSelectedCaseId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept the case. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDecline = async (caseId: number) => {
    setLoading(true);
    try {
      await updateCaseStatus(caseId.toString(), 'declined');
      toast({
        title: "Case Declined",
        description: "The case has been declined and redirected.",
      });
      setSelectedCaseId(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decline the case. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
        <CaseDetails
          caseId={parseInt(selectedCase.id.substring(0, 8), 16)}
          onBack={handleCloseDetails}
          caseItem={{
            id: parseInt(selectedCase.id.substring(0, 8), 16),
            severity: selectedCase.severity as 'Critical' | 'Urgent' | 'Stable',
            patient: selectedCase.patients?.name || 'Unknown Patient',
            condition: selectedCase.paramedic_notes || 'No condition notes',
            eta: selectedCase.eta_minutes || 0,
            location: 'En route',
            vitals: {
              hr: 85,
              bp: '120/80',
              spo2: 98,
              gcs: 15
            }
          }}
          loading={loading}
          onAccept={handleAccept}
          onDecline={handleDecline}
        />
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
