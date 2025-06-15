
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BedDouble, UserCheck, AlertTriangle } from 'lucide-react';
import { departments } from './utils';

interface BedManagementDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const BedManagementDialog: React.FC<BedManagementDialogProps> = ({
  isOpen,
  onClose
}) => {
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0].name);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Bed Management System</DialogTitle>
          <DialogDescription>
            Manage bed allocation and availability across all departments
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={selectedDepartment} onValueChange={setSelectedDepartment} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {departments.slice(0, 4).map((dept) => (
              <TabsTrigger key={dept.name} value={dept.name} className="text-xs">
                {dept.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {departments.map((dept) => (
            <TabsContent key={dept.name} value={dept.name} className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <BedDouble className="mr-2 h-4 w-4" />
                      Available
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">{dept.beds}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <UserCheck className="mr-2 h-4 w-4" />
                      Occupied
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{dept.total - dept.beds}</div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Alert Level
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Badge className={
                      dept.alert === 'Critical' ? 'bg-red-100 text-red-800' : 
                      dept.alert === 'Medium' ? 'bg-amber-100 text-amber-800' : 
                      'bg-green-100 text-green-800'
                    }>
                      {dept.alert}
                    </Badge>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Bed Details</CardTitle>
                  <CardDescription>Individual bed status for {dept.name}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-6 gap-2">
                    {Array.from({ length: dept.total }, (_, i) => (
                      <div
                        key={i}
                        className={`p-2 rounded text-center text-xs font-medium ${
                          i < dept.total - dept.beds
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        Bed {i + 1}
                        <div className="text-xs">
                          {i < dept.total - dept.beds ? 'Occupied' : 'Available'}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default BedManagementDialog;
