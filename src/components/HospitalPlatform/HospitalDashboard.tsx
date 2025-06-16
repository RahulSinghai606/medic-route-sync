import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  AlertTriangle, 
  Users, 
  Bed, 
  Heart, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  HelpCircle
} from 'lucide-react';
import { useCases } from '@/hooks/useCases';
import { useDepartments } from '@/hooks/useDepartments';
import HospitalStats from './HospitalStats';
import CaseFeed from './CaseFeed';
import DepartmentStatus from './DepartmentStatus';
import RecentNotifications from './RecentNotifications';
import RealTimeUpdatesPanel from './RealTimeUpdatesPanel';
import ContextualHelp from '@/components/Onboarding/ContextualHelp';

const HospitalDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const { data: cases, isLoading: casesLoading } = useCases();
  const { departmentList: departments, loading: deptLoading } = useDepartments();

  const stats = [
    {
      title: "Active Cases",
      value: cases?.length || 0,
      change: "+12%",
      trend: "up" as const,
      icon: Activity,
      color: "blue"
    },
    {
      title: "Available Beds",
      value: departments?.reduce((sum, dept) => sum + (dept.total - dept.beds), 0) || 156,
      change: "-5%", 
      trend: "down" as const,
      icon: Bed,
      color: "green"
    },
    {
      title: "Critical Patients",
      value: cases?.filter(c => c.severity === 'Critical').length || 8,
      change: "+3",
      trend: "up" as const,
      icon: Heart,
      color: "red"
    },
    {
      title: "Avg Response Time",
      value: "12 min",
      change: "-2 min",
      trend: "down" as const,
      icon: Clock,
      color: "purple"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'admission',
      message: 'New trauma patient admitted to ICU',
      time: '2 minutes ago',
      priority: 'high' as const
    },
    {
      id: 2,
      type: 'transfer',
      message: 'Patient transferred from ER to Surgery',
      time: '5 minutes ago',
      priority: 'medium' as const
    },
    {
      id: 3,
      type: 'discharge',
      message: '3 patients discharged from Ward A',
      time: '12 minutes ago',
      priority: 'low' as const
    },
    {
      id: 4,
      type: 'alert',
      message: 'Low bed availability in Cardiology',
      time: '18 minutes ago',
      priority: 'high' as const
    }
  ];

  const criticalAlerts = [
    {
      id: 1,
      message: "ICU capacity at 95% - Consider activating overflow protocols",
      severity: "critical" as const,
      time: "5 min ago"
    },
    {
      id: 2,
      message: "Incoming mass casualty event - 6 ambulances en route",
      severity: "warning" as const,
      time: "12 min ago"
    }
  ];

  if (casesLoading || deptLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Help */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Hospital Dashboard</h1>
          <p className="text-muted-foreground">
            Real-time overview of hospital operations and patient flow
          </p>
        </div>
        <ContextualHelp context="case-management" />
      </div>

      {/* Critical Alerts */}
      {criticalAlerts.length > 0 && (
        <div className="space-y-2">
          {criticalAlerts.map((alert) => (
            <Card key={alert.id} className={`border-l-4 ${
              alert.severity === 'critical' 
                ? 'border-l-red-500 bg-red-50/50' 
                : 'border-l-amber-500 bg-amber-50/50'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`h-5 w-5 ${
                    alert.severity === 'critical' ? 'text-red-600' : 'text-amber-600'
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">{alert.time}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Acknowledge
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Statistics Cards */}
      <HospitalStats />

      {/* Main Dashboard Content */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="cases">Active Cases</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
          <TabsTrigger value="updates">Live Updates</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center gap-3 p-2 border rounded-lg">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.priority === 'high' ? 'bg-red-500' :
                        activity.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`} />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{activity.message}</p>
                        <p className="text-xs text-muted-foreground">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Department Status Overview */}
            <DepartmentStatus />
          </div>
        </TabsContent>

        <TabsContent value="cases" className="space-y-4">
          <CaseFeed />
        </TabsContent>

        <TabsContent value="departments" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {departments?.map((dept) => (
              <Card key={dept.name} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{dept.name}</CardTitle>
                    <Badge variant={
                      dept.alert === 'Critical' ? 'destructive' :
                      dept.alert === 'Medium' ? 'secondary' : 'default'
                    }>
                      {dept.alert}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Occupied Beds</span>
                      <span className="font-medium">{dept.beds}/{dept.total}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          (dept.beds / dept.total) > 0.9 ? 'bg-red-500' :
                          (dept.beds / dept.total) > 0.7 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${(dept.beds / dept.total) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Capacity</span>
                      <span className={`font-medium ${
                        (dept.beds / dept.total) > 0.9 ? 'text-red-600' :
                        (dept.beds / dept.total) > 0.7 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {Math.round((dept.beds / dept.total) * 100)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="updates" className="space-y-4">
          <RealTimeUpdatesPanel />
        </TabsContent>
      </Tabs>

      {/* Recent Notifications */}
      <RecentNotifications />
    </div>
  );
};

export default HospitalDashboard;
