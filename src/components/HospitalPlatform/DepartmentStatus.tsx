
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useDepartments } from '@/hooks/useDepartments';
import BedManagementDialog from './BedManagementDialog';

const DepartmentStatus: React.FC = () => {
  const { toast } = useToast();
  const { departmentList: departments, loading } = useDepartments();
  const [isBedManagementOpen, setIsBedManagementOpen] = useState(false);

  const handleUpdateBedStatus = () => {
    setIsBedManagementOpen(true);
  };

  const getAlertColor = (alert: string) => {
    switch (alert) {
      case 'Critical':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-500';
      default:
        return 'bg-green-500';
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Department Status</CardTitle>
          <CardDescription>Current availability by department</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {departments.map((dept, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium flex items-center">
                  <span className={`inline-block w-2 h-2 rounded-full ${getAlertColor(dept.alert)} mr-2`}></span>
                  {dept.name}
                </span>
                <span className="text-sm font-medium">
                  {dept.total - dept.beds}/{dept.total} Available
                </span>
              </div>
              <Progress className="h-2" value={((dept.total - dept.beds) / dept.total) * 100} />
            </div>
          ))}

          <Button variant="outline" className="w-full mt-2" onClick={handleUpdateBedStatus}>
            Update Bed Status
          </Button>
        </CardContent>
      </Card>

      <BedManagementDialog
        isOpen={isBedManagementOpen}
        onClose={() => setIsBedManagementOpen(false)}
      />
    </>
  );
};

export default DepartmentStatus;
