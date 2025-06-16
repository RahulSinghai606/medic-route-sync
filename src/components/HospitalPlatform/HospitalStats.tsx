
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Bed, 
  Clock, 
  AlertTriangle,
  Activity,
  TrendingUp,
  TrendingDown,
  Heart,
  Stethoscope,
  Ambulance
} from 'lucide-react';

const HospitalStats = () => {
  const statsData = [
    {
      title: 'Available Beds',
      value: '127',
      change: '+5',
      changeType: 'increase',
      icon: Bed,
      description: 'Out of 450 total beds',
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-950',
      trend: 'up'
    },
    {
      title: 'Active Patients',
      value: '323',
      change: '+12',
      changeType: 'increase',
      icon: Users,
      description: 'Currently admitted',
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-950',
      trend: 'up'
    },
    {
      title: 'Emergency Queue',
      value: '8',
      change: '-3',
      changeType: 'decrease',
      icon: AlertTriangle,
      description: 'Waiting for treatment',
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-100 dark:bg-orange-950',
      trend: 'down'
    },
    {
      title: 'Critical Cases',
      value: '15',
      change: '+2',
      changeType: 'increase',
      icon: Heart,
      description: 'Requiring immediate attention',
      color: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-100 dark:bg-red-950',
      trend: 'up'
    },
    {
      title: 'ICU Availability',
      value: '12',
      change: '0',
      changeType: 'stable',
      icon: Activity,
      description: 'Out of 45 ICU beds',
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-950',
      trend: 'stable'
    },
    {
      title: 'Incoming Ambulances',
      value: '3',
      change: '+1',
      changeType: 'increase',
      icon: Ambulance,
      description: 'ETA within 15 minutes',
      color: 'text-teal-600 dark:text-teal-400',
      bgColor: 'bg-teal-100 dark:bg-teal-950',
      trend: 'up'
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-600 dark:text-red-400" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case 'increase':
        return 'text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/50';
      case 'decrease':
        return 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-950/50';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {statsData.map((stat, index) => {
        const IconComponent = stat.icon;
        return (
          <Card key={index} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-transparent hover:border-l-primary">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="space-y-1">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  {stat.change !== '0' && (
                    <Badge variant="secondary" className={`text-xs ${getChangeColor(stat.changeType)}`}>
                      {stat.change}
                    </Badge>
                  )}
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <IconComponent className={`h-6 w-6 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <CardDescription className="text-xs">
                  {stat.description}
                </CardDescription>
                {getTrendIcon(stat.trend)}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default HospitalStats;
