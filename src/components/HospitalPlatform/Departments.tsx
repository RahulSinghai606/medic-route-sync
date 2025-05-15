
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, BedDouble, Users, BarChart4 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { departments, getAlertColor } from './utils';

const Departments: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-2">Hospital Departments</h1>
      <p className="text-muted-foreground mb-6">Department management and coordination</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Building2 className="mr-2 h-5 w-5 text-blue-600" />
              Total Departments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BedDouble className="mr-2 h-5 w-5 text-blue-600" />
              Total Capacity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">120</div>
            <div className="text-sm text-muted-foreground">Beds across all departments</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Users className="mr-2 h-5 w-5 text-blue-600" />
              Staff On Duty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">45</div>
            <div className="text-sm text-muted-foreground">Medical & support staff</div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Department Status</CardTitle>
          <CardDescription>Current utilization and alerts by department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {departments.map((dept, index) => (
              <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <div className={`h-10 w-10 rounded-md ${getAlertColor(dept.alert)} bg-opacity-20 text-${dept.alert === 'Critical' ? 'red' : dept.alert === 'Medium' ? 'amber' : 'green'}-700 flex items-center justify-center mr-3`}>
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-medium">{dept.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {dept.beds} beds available
                      </p>
                    </div>
                  </div>
                  <Badge className={
                    dept.alert === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                    dept.alert === 'Medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 
                    'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  }>
                    {dept.alert} Alert
                  </Badge>
                </div>
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Utilization</span>
                      <span>{((dept.total - dept.beds) / dept.total * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={(dept.total - dept.beds) / dept.total * 100} className="h-2" />
                  </div>
                  <Button variant="outline" size="sm" className="ml-4 whitespace-nowrap">
                    Update Status
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Department Analytics</CardTitle>
          <CardDescription>Performance metrics for the past 30 days</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <BarChart4 className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              Department analytics visualization would appear here, showing capacity trends, average wait times, and patient flow metrics.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Departments;
