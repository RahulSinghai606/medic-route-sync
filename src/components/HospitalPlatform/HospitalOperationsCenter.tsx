
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Activity, Users, Bed, BarChart3, Settings, Eye, Phone } from 'lucide-react';
import PremiumHospitalOperations from './PremiumHospitalOperations';

const HospitalOperationsCenter = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Hospital Operations</h1>
          <p className="text-muted-foreground">Comprehensive hospital management and monitoring</p>
        </div>
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          All Systems Operational
        </Badge>
      </div>

      <PremiumHospitalOperations />
    </div>
  );
};

export default HospitalOperationsCenter;
