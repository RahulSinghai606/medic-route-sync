
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, UserCheck, Clock, AlertCircle } from 'lucide-react';
import { getSeverityColor } from './utils';
import { useCases, CaseWithRelations } from '@/hooks/useCases';
import { Skeleton } from '@/components/ui/skeleton';

const CasesDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("active");
  const { data: incomingCases, isLoading: isLoadingIncoming, error: incomingError } = useCases('pending_approval');
  const { data: activeCases, isLoading: isLoadingActive, error: activeError } = useCases('accepted');

  const renderIncomingCases = () => {
    if (isLoadingIncoming) return <Skeleton className="h-32 w-full" />;
    if (incomingError) return <p className="text-red-500 flex items-center gap-2"><AlertCircle size={16} /> Error loading cases.</p>;
    if (!incomingCases || incomingCases.length === 0) return <p className="text-muted-foreground">No pending incoming cases.</p>;

    return incomingCases.map((caseItem) => (
      <div key={caseItem.id} className="border rounded-lg p-3 flex justify-between items-start">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${
              caseItem.severity === 'Critical' ? 'bg-red-500' : 
              caseItem.severity === 'Urgent' ? 'bg-amber-500' : 'bg-green-500'
            }`}></span>
            <span className="font-medium">Case #{caseItem.id.substring(0, 8)}...</span>
            <Badge className={getSeverityColor(caseItem.severity)}>
              {caseItem.severity}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {caseItem.patients?.name || 'Unknown Patient'} - {caseItem.paramedic_notes || 'No condition notes'}
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>ETA: {caseItem.eta_minutes || 'N/A'} minutes</span>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <UserCheck className="h-4 w-4 mr-1" />
          Review
        </Button>
      </div>
    ));
  };
  
  const renderActiveCases = () => {
    if (isLoadingActive) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      );
    }

    if (activeError) {
      return (
        <div className="text-red-500 flex items-center gap-2 p-4 bg-red-50 dark:bg-red-950/50 rounded-lg">
          <AlertCircle className="h-4 w-4" />
          <span>Error loading active cases: {activeError.message}</span>
        </div>
      );
    }

    if (!activeCases || activeCases.length === 0) {
      return <p className="text-muted-foreground text-center py-8 col-span-full">No active cases at the moment.</p>;
    }

    return activeCases.map((caseItem: CaseWithRelations) => (
      <Card key={caseItem.id}>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              {caseItem.patients?.name || 'Unknown Patient'}
            </span>
            <Badge className={getSeverityColor(caseItem.severity)}>
              {caseItem.severity}
            </Badge>
          </CardTitle>
          <CardDescription>Case #{caseItem.id.substring(0, 8)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Paramedic:</span>
            <span>{caseItem.paramedic?.full_name || 'N/A'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Accepted:</span>
            <span>{new Date(caseItem.updated_at).toLocaleTimeString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status:</span>
            <Badge variant="secondary">In-progress</Badge>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm" className="w-full">View Details</Button>
        </CardFooter>
      </Card>
    ));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-2">Case Management</h1>
      <p className="text-muted-foreground mb-6">Track and manage all incoming and active cases</p>
      
      <Tabs defaultValue="active" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger value="active">Active Cases</TabsTrigger>
          <TabsTrigger value="incoming">Incoming</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderActiveCases()}
          </div>
        </TabsContent>
        
        <TabsContent value="incoming" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {renderIncomingCases()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Case History</CardTitle>
              <CardDescription>Past 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Recent case data would be displayed here.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CasesDashboard;
