
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Hospital, ArrowRight, BellRing, ClipboardList, Map, Users, Activity, FileCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HospitalPlatformLink: React.FC = () => {
  const navigate = useNavigate();
  
  const features = [
    { name: 'Live Case Feed', icon: BellRing, description: 'Real-time display of incoming cases' },
    { name: 'Case Dashboard', icon: ClipboardList, description: 'Detailed case information and tracking' },
    { name: 'Department Notifications', icon: Users, description: 'Automatic routing to departments' },
    { name: 'Live Ambulance Tracking', icon: Map, description: 'Map with real-time ambulance locations' },
    { name: 'Resource Management', icon: Activity, description: 'Monitor bed availability and resources' },
    { name: 'Case Handoff', icon: FileCheck, description: 'Digital patient handoffs and summaries' },
  ];
  
  return (
    <Card className="border-medical">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Hospital className="h-5 w-5 text-medical" />
              Hospital-Side Platform
            </CardTitle>
            <CardDescription>Access hospital-specific features and case management</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 flex flex-col items-center text-center">
              <feature.icon className="h-6 w-6 text-medical mb-2" />
              <h3 className="text-sm font-medium">{feature.name}</h3>
              <p className="text-xs text-muted-foreground mt-1">{feature.description}</p>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full medical-btn flex items-center justify-center gap-2"
          onClick={() => navigate('/hospital-platform')} 
        >
          Access Hospital Platform
          <ArrowRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default HospitalPlatformLink;
