
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Ambulance, Clock, UserCheck } from 'lucide-react';
import { incomingCases } from './utils';
import { getSeverityColor } from './utils';

const CaseHandoffs: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Case Handoffs</h1>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Pending Handoffs</CardTitle>
          <CardDescription>
            Cases awaiting handoff from paramedic teams
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {incomingCases.map((caseItem) => (
              <div key={caseItem.id} className="border rounded-lg p-4 flex justify-between items-center">
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
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>ETA: {caseItem.eta} minutes</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Ambulance className="h-3 w-3" />
                      <span>Unit: AMBU-27</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  <Button size="sm">
                    <UserCheck className="h-4 w-4 mr-1" />
                    Accept
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Handoff Protocol</CardTitle>
          <CardDescription>
            Standard procedure for accepting patient handoffs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-medium">Review Case Details</p>
              <p className="text-sm text-muted-foreground">
                Examine patient information, vital signs, and treatment provided by paramedic team.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-medium">Prepare Receiving Area</p>
              <p className="text-sm text-muted-foreground">
                Ready department and necessary equipment based on patient condition.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-medium">Accept Handoff</p>
              <p className="text-sm text-muted-foreground">
                Receive verbal report from paramedic team and document case details.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0">
              4
            </div>
            <div>
              <p className="font-medium">Complete Transfer Record</p>
              <p className="text-sm text-muted-foreground">
                Sign digital transfer form and update case status in system.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CaseHandoffs;
