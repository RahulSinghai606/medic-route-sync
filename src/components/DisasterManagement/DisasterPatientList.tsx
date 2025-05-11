
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, Check, MoreVertical, AlertTriangle } from 'lucide-react';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  location: string;
  condition: 'Critical' | 'Moderate' | 'Stable';
  needsVentilator: boolean;
  severity: number;
  injuries: string[];
}

interface DisasterPatientListProps {
  patients: Patient[];
}

const DisasterPatientList: React.FC<DisasterPatientListProps> = ({ patients }) => {
  const [sortByField, setSortByField] = useState<keyof Patient>('severity');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedPatients, setSelectedPatients] = useState<number[]>([]);

  const toggleSort = (field: keyof Patient) => {
    if (field === sortByField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortByField(field);
      setSortDirection('asc');
    }
  };

  const sortedPatients = [...patients].sort((a, b) => {
    let comparison = 0;
    if (a[sortByField] < b[sortByField]) {
      comparison = -1;
    } else if (a[sortByField] > b[sortByField]) {
      comparison = 1;
    }
    return sortDirection === 'asc' ? comparison : -comparison;
  });

  const handlePatientSelection = (patientId: number) => {
    setSelectedPatients(prev => 
      prev.includes(patientId) 
        ? prev.filter(id => id !== patientId) 
        : [...prev, patientId]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedPatients(patients.map(p => p.id));
    } else {
      setSelectedPatients([]);
    }
  };

  const getSeverityBadge = (severity: number) => {
    switch (severity) {
      case 1:
        return <Badge variant="destructive">Critical (1)</Badge>;
      case 2:
        return <Badge variant="destructive" className="bg-red-500">Serious (2)</Badge>;
      case 3:
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Moderate (3)</Badge>;
      case 4:
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Minor (4)</Badge>;
      case 5:
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Minimal (5)</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="flex gap-2 items-center">
          <Checkbox 
            id="select-all"
            checked={selectedPatients.length === patients.length && patients.length > 0} 
            onCheckedChange={(checked) => handleSelectAll(!!checked)}
          />
          <label htmlFor="select-all" className="text-sm font-medium">
            Select All
          </label>
        </div>

        {selectedPatients.length > 0 && (
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline">
              Assign Medical Camp
            </Button>
            <Button size="sm">
              Update Status
            </Button>
          </div>
        )}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">Select</TableHead>
            <TableHead className="cursor-pointer" onClick={() => toggleSort('name')}>
              <div className="flex items-center">
                Patient Name
                {sortByField === 'name' && <ArrowUpDown className="ml-1 h-3 w-3" />}
              </div>
            </TableHead>
            <TableHead>Age/Gender</TableHead>
            <TableHead className="cursor-pointer" onClick={() => toggleSort('severity')}>
              <div className="flex items-center">
                Triage Level
                {sortByField === 'severity' && <ArrowUpDown className="ml-1 h-3 w-3" />}
              </div>
            </TableHead>
            <TableHead>Injuries</TableHead>
            <TableHead>Ventilator</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedPatients.map((patient) => (
            <TableRow key={patient.id} className={patient.severity <= 2 ? "bg-red-50/30 dark:bg-red-900/10" : ""}>
              <TableCell>
                <Checkbox 
                  checked={selectedPatients.includes(patient.id)} 
                  onCheckedChange={() => handlePatientSelection(patient.id)}
                />
              </TableCell>
              <TableCell>
                <div>
                  <p className="font-medium">{patient.name}</p>
                  <p className="text-xs text-muted-foreground">{patient.location}</p>
                </div>
              </TableCell>
              <TableCell>{patient.age} / {patient.gender}</TableCell>
              <TableCell>
                {getSeverityBadge(patient.severity)}
                {patient.severity <= 2 && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-red-600 dark:text-red-400">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Urgent</span>
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {patient.injuries.map((injury, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {injury}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                {patient.needsVentilator ? (
                  <Badge variant="destructive" className="bg-red-500">Required</Badge>
                ) : (
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    <div className="flex items-center gap-1">
                      <Check className="h-3 w-3" /> 
                      <span>Not needed</span>
                    </div>
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>View Details</DropdownMenuItem>
                    <DropdownMenuItem>Update Status</DropdownMenuItem>
                    <DropdownMenuItem>Assign Camp</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600">
                      Mark as Critical
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {sortedPatients.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No patients in triage queue
        </div>
      )}
    </div>
  );
};

export default DisasterPatientList;
