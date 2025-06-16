
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { departments, getAlertColor } from './utils';
import BedManagementDialog from './BedManagementDialog';

const DepartmentStatus: React.FC = () => {
  const { toast } = useToast();
  const [isBedManagementOpen, setIsBedManagementOpen] = useState(false);

  const handleUpdateBedStatus = () => {
    setIsBedManagementOpen(true);
  };

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
                  {dept.beds}/{dept.total} Available
                </span>
              </div>
              <Progress className="h-2" value={(dept.beds / dept.total) * 100} />
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
