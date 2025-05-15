
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, UserCheck, Clock } from 'lucide-react';
import { incomingCases } from './utils';
import { getSeverityColor } from './utils';

const CasesDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("active");
  
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
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Patient #A23985
                </CardTitle>
                <CardDescription>Male, 62 - Cardiac Event</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge>In Treatment - Cardiology</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Admitted:</span>
                  <span>Today, 10:35 AM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Assigned Physician:</span>
                  <span>Dr. Patel</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">View Details</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="h-5 w-5 mr-2 text-blue-600" />
                  Patient #B45720
                </CardTitle>
                <CardDescription>Female, 28 - Multiple Trauma</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="destructive">Critical - Surgery</Badge>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Admitted:</span>
                  <span>Today, 11:20 AM</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Assigned Physician:</span>
                  <span>Dr. Johnson</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm" className="w-full">View Details</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="mt-6">
            <Button variant="outline">Load More Cases</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="incoming" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {incomingCases.map((caseItem) => (
                  <div key={caseItem.id} className="border rounded-lg p-3 flex justify-between items-start">
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
                    <Button variant="outline" size="sm">
                      <UserCheck className="h-4 w-4 mr-1" />
                      Prepare
                    </Button>
                  </div>
                ))}
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
