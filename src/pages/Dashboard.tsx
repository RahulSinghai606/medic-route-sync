
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Calendar, 
  Ambulance, 
  Users, 
  Activity,
  PlusCircle,
  BarChart3
} from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1>Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, John. Here's your overview.</p>
        </div>
        <Button className="emergency-btn flex items-center gap-2">
          <PlusCircle className="h-5 w-5" />
          New Emergency Case
        </Button>
      </div>

      {/* Active Emergency Section */}
      <Card className="border-emergency">
        <CardHeader className="bg-emergency/10 pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-emergency flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Active Emergency
            </CardTitle>
            <Badge className="bg-emergency">Critical</Badge>
          </div>
          <CardDescription>
            <div className="flex flex-wrap gap-3 mt-1">
              <div className="flex items-center gap-1 text-sm">
                <Clock className="h-4 w-4" />
                <span>Started 12 min ago</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <MapPin className="h-4 w-4" />
                <span>En route to Memorial Hospital</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Calendar className="h-4 w-4" />
                <span>ETA: 8 minutes</span>
              </div>
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="vital-card">
              <div className="vital-label">Heart Rate</div>
              <div className="vital-value text-emergency">128 bpm</div>
            </div>
            <div className="vital-card">
              <div className="vital-label">Blood Pressure</div>
              <div className="vital-value">90/60 mmHg</div>
            </div>
            <div className="vital-card">
              <div className="vital-label">SpO2</div>
              <div className="vital-value text-warning">92%</div>
            </div>
            <div className="vital-card">
              <div className="vital-label">Temperature</div>
              <div className="vital-value">38.6°C</div>
            </div>
          </div>
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <Button className="medical-btn flex-1">
              Update Patient Status
            </Button>
            <Button variant="outline" className="flex-1">
              View Case Details
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transports Today
            </CardTitle>
            <Ambulance className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">
              +2 compared to yesterday
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Patients
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              3 critical, 5 stable, 4 minor
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Response Time
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.5 min</div>
            <p className="text-xs text-muted-foreground">
              -1.2 min from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Cases and Analytics */}
      <Tabs defaultValue="recent">
        <TabsList>
          <TabsTrigger value="recent">Recent Cases</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="recent" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Cases</CardTitle>
              <CardDescription>
                Your most recent emergency responses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h3 className="font-medium">Case #{20230 + i}</h3>
                      <div className="flex gap-4 text-sm text-muted-foreground">
                        <span>MVA with injuries</span>
                        <span>Apr {10 + i}, 2025</span>
                      </div>
                    </div>
                    <Badge className={i === 1 ? "bg-emergency" : i === 2 ? "bg-warning" : "bg-success"}>
                      {i === 1 ? "Critical" : i === 2 ? "Moderate" : "Stable"}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Cases
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                Your response metrics and performance data
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="flex flex-col items-center text-center">
                <BarChart3 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-medium">Analytics Coming Soon</h3>
                <p className="text-muted-foreground">
                  Detailed performance metrics will be available in the next update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
