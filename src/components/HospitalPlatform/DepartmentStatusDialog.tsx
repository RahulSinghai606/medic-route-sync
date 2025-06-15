
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Department } from './types';

interface DepartmentStatusDialogProps {
  department: Department | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (departmentName: string, updates: Partial<Department>) => void;
}

const DepartmentStatusDialog: React.FC<DepartmentStatusDialogProps> = ({
  department,
  isOpen,
  onClose,
  onUpdate
}) => {
  const { toast } = useToast();
  const [availableBeds, setAvailableBeds] = useState(department?.beds || 0);
  const [alertLevel, setAlertLevel] = useState<'Critical' | 'Medium' | 'Low'>(department?.alert || 'Low');
  const [notes, setNotes] = useState('');

  const handleUpdate = () => {
    if (!department) return;

    const updates = {
      beds: availableBeds,
      alert: alertLevel
    };

    onUpdate(department.name, updates);
    
    toast({
      title: "Department Updated",
      description: `${department.name} status has been updated successfully.`,
    });

    onClose();
  };

  const handleAlertChange = (value: string) => {
    setAlertLevel(value as 'Critical' | 'Medium' | 'Low');
  };

  if (!department) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update {department.name} Status</DialogTitle>
          <DialogDescription>
            Update the current bed availability and alert level for this department.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="available-beds" className="text-right">
              Available Beds
            </Label>
            <Input
              id="available-beds"
              type="number"
              min="0"
              max={department.total}
              value={availableBeds}
              onChange={(e) => setAvailableBeds(Number(e.target.value))}
              className="col-span-3"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="alert-level" className="text-right">
              Alert Level
            </Label>
            <Select value={alertLevel} onValueChange={handleAlertChange}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select alert level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Low">Low Alert</SelectItem>
                <SelectItem value="Medium">Medium Alert</SelectItem>
                <SelectItem value="Critical">Critical Alert</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="notes" className="text-right">
              Notes
            </Label>
            <Textarea
              id="notes"
              placeholder="Additional notes about the update..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="col-span-3"
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Total Capacity: {department.total} beds</p>
            <p>Current Utilization: {((department.total - availableBeds) / department.total * 100).toFixed(0)}%</p>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleUpdate}>
            Update Status
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DepartmentStatusDialog;
