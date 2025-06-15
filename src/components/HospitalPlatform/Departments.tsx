import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, BedDouble, Users, BarChart4, Settings, Download, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { departments, getAlertColor } from './utils';
import DepartmentStatusDialog from './DepartmentStatusDialog';
import BedManagementDialog from './BedManagementDialog';
import { Department } from './types';
import DepartmentEditDialog from './DepartmentEditDialog';
import { useDepartments } from '@/hooks/useDepartments';

const Departments: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { departmentList, addDepartment, updateDepartment, removeDepartment, updateBeds } = useDepartments(departments);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [isBedManagementOpen, setIsBedManagementOpen] = useState(false);
  const [isDeptEditOpen, setIsDeptEditOpen] = useState(false);
  const [deptToEdit, setDeptToEdit] = useState<Department | null>(null);

  const handleUpdateStatus = (departmentName: string, updates: Partial<Department>) => {
    updateDepartment(departmentName, updates);
    // toast is already handled inside updateDepartment
  };

  const handleDepartmentStatusClick = (department: Department) => {
    setSelectedDepartment(department);
    setIsStatusDialogOpen(true);
  };

  const handleRefreshData = () => {
    // Instead, update each department with simulated new bed counts via updateBeds
    departmentList.forEach(dept => {
      // simulate the algorithm as before but per dept, safely
      const randomBeds = Math.max(0, Math.min(dept.total, dept.beds + Math.floor(Math.random() * 3) - 1));
      updateBeds(dept.name, randomBeds);
    });
    toast({
      title: "Data Refreshed",
      description: "Department data has been updated with the latest information.",
    });
  };

  const handleExportReport = () => {
    if (!departmentList || departmentList.length === 0) {
      toast({ title: "No Data", description: "No departments to export." });
      return;
    }
    const csvContent = "Department,Available Beds,Total Beds,Utilization,Alert Level\n" +
      departmentList.map(dept => 
        `${dept.name},${dept.beds},${dept.total},${dept.total > 0 ? ((dept.total - dept.beds) / dept.total * 100).toFixed(1) : "0"}%,${dept.alert}`
      ).join('\n');
    try {
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `department-report-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast({
        title: "Report Generated",
        description: "Department analytics report has been downloaded.",
      });
    } catch (err) {
      toast({ title: "Export Error", description: "Failed to export report. Please try again." });
    }
  };

  const handleBedManagement = () => {
    setIsBedManagementOpen(true);
  };

  const handleResourceAllocation = () => {
    navigate('/hospital-platform/operations');
    toast({
      title: "Navigating to Operations",
      description: "Opening the Hospital Operations Center for resource allocation.",
    });
  };

  const handleAnalytics = () => {
    navigate('/hospital-platform/operations');
    toast({
      title: "Opening Analytics",
      description: "Navigating to the advanced analytics dashboard.",
    });
  };

  const handleAmbulanceTracking = () => {
    navigate('/hospital-platform/operations');
    toast({
      title: "Ambulance Tracking",
      description: "Opening live ambulance tracking system.",
    });
  };

  const handleAddDepartment = () => {
    setDeptToEdit(null);
    setIsDeptEditOpen(true);
  };

  const handleEditDepartment = (dept: Department) => {
    setDeptToEdit(dept);
    setIsDeptEditOpen(true);
  };

  const handleDeptDialogSubmit = (data: Partial<Department>) => {
    if (deptToEdit) {
      updateDepartment(deptToEdit.name, data);
    } else {
      // To avoid TypeScript errors, add missing department fields by default
      const fallbackDept: Department = {
        name: data.name ?? "New Dept",
        beds: typeof data.beds === "number" ? data.beds : 0,
        total: typeof data.total === "number" ? data.total : 0,
        alert: (data.alert as "Critical" | "Medium" | "Low") ?? "Low"
      };
      addDepartment(fallbackDept);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Hospital Departments</h1>
          <p className="text-muted-foreground">Department management and coordination</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefreshData}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="default" onClick={handleAddDepartment}>
            + Add Department
          </Button>
        </div>
      </div>
      
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
            {departmentList.map((dept, index) => (
              <div key={dept.name} className="border-b pb-4 last:border-0 last:pb-0">
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
                  <div className="flex items-center gap-2">
                    <Badge className={
                      dept.alert === 'Critical' ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 
                      dept.alert === 'Medium' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400' : 
                      'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                    }>
                      {dept.alert} Alert
                    </Badge>
                    <Button variant="outline" size="sm" onClick={handleBedManagement}>
                      <BedDouble className="h-3 w-3 mr-1" />
                      Bed Mgmt
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleEditDepartment(dept)}>
                      ✏️
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeDepartment(dept.name)}>
                      🗑️
                    </Button>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-full">
                    <div className="flex justify-between text-xs mb-1">
                      <span>Utilization</span>
                      <span>{(dept.total > 0 ? ((dept.total - dept.beds) / dept.total * 100).toFixed(0) : "0")}%</span>
                    </div>
                    <Progress value={dept.total > 0 ? ((dept.total - dept.beds) / dept.total * 100) : 0} className="h-2" />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="ml-4 whitespace-nowrap"
                    onClick={() => handleDepartmentStatusClick(dept)}
                  >
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Department Analytics</CardTitle>
              <CardDescription>Performance metrics and operational insights</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleAnalytics}>
                <BarChart4 className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportReport}>
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">94%</div>
              <div className="text-sm text-muted-foreground">Avg Occupancy</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-600">8.5min</div>
              <div className="text-sm text-muted-foreground">Avg Response</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">67</div>
              <div className="text-sm text-muted-foreground">Admissions Today</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">23</div>
              <div className="text-sm text-muted-foreground">Discharges Today</div>
            </div>
          </div>
          <div className="text-center">
            <Button onClick={handleAnalytics} size="lg">
              <BarChart4 className="mr-2 h-5 w-5" />
              Open Advanced Analytics Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>

      <DepartmentStatusDialog
        department={selectedDepartment}
        isOpen={isStatusDialogOpen}
        onClose={() => setIsStatusDialogOpen(false)}
        onUpdate={handleUpdateStatus}
      />

      <BedManagementDialog
        isOpen={isBedManagementOpen}
        onClose={() => setIsBedManagementOpen(false)}
      />

      <DepartmentEditDialog
        open={isDeptEditOpen}
        initial={deptToEdit}
        onClose={() => setIsDeptEditOpen(false)}
        onSubmit={handleDeptDialogSubmit}
      />
    </div>
  );
};

export default Departments;
