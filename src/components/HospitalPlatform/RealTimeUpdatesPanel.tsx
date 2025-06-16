
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Users, 
  Bed, 
  Ambulance, 
  Heart, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Wifi,
  WifiOff
} from 'lucide-react';

interface LiveUpdate {
  id: string;
  timestamp: Date;
  type: 'bed_count' | 'patient_admission' | 'staff_update' | 'equipment_status' | 'emergency_alert';
  message: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  department?: string;
  data?: any;
}

interface ConnectionStatus {
  status: 'connected' | 'connecting' | 'disconnected';
  lastUpdate: Date;
  updateCount: number;
}

const RealTimeUpdatesPanel: React.FC = () => {
  const [updates, setUpdates] = useState<LiveUpdate[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: 'connected',
    lastUpdate: new Date(),
    updateCount: 0
  });
  const [isSimulationActive, setIsSimulationActive] = useState(true);

  useEffect(() => {
    if (!isSimulationActive) return;

    const generateRandomUpdate = (): LiveUpdate => {
      const types: LiveUpdate['type'][] = ['bed_count', 'patient_admission', 'staff_update', 'equipment_status', 'emergency_alert'];
      const priorities: LiveUpdate['priority'][] = ['low', 'medium', 'high', 'critical'];
      const departments = ['Emergency', 'ICU', 'Surgery', 'Cardiology', 'Pediatrics'];
      
      const type = types[Math.floor(Math.random() * types.length)];
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const department = departments[Math.floor(Math.random() * departments.length)];

      const messages = {
        bed_count: [
          `${department}: ${Math.floor(Math.random() * 5)} beds became available`,
          `${department}: Bed capacity increased by ${Math.floor(Math.random() * 3) + 1}`,
          `${department}: ${Math.floor(Math.random() * 2) + 1} beds reserved for incoming patients`
        ],
        patient_admission: [
          `New patient admitted to ${department}`,
          `Emergency admission: ${priority} priority patient`,
          `Patient transferred from ${department} to ICU`
        ],
        staff_update: [
          `${department}: ${Math.floor(Math.random() * 3) + 1} additional staff members on duty`,
          `Night shift change completed in ${department}`,
          `Specialist called to ${department}`
        ],
        equipment_status: [
          `${department}: Equipment maintenance completed`,
          `New ventilator deployed to ${department}`,
          `${department}: All monitoring systems operational`
        ],
        emergency_alert: [
          `Mass casualty alert: ${Math.floor(Math.random() * 10) + 5} patients incoming`,
          `Code Blue resolved in ${department}`,
          `Disaster protocol activated`
        ]
      };

      return {
        id: `update_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date(),
        type,
        message: messages[type][Math.floor(Math.random() * messages[type].length)],
        priority,
        department,
        data: {
          bedCount: Math.floor(Math.random() * 50),
          patientCount: Math.floor(Math.random() * 100),
          staffCount: Math.floor(Math.random() * 20) + 10
        }
      };
    };

    const simulateConnection = () => {
      // Simulate occasional connection issues
      if (Math.random() < 0.03) {
        setConnectionStatus(prev => ({ ...prev, status: 'disconnected' }));
        setTimeout(() => {
          setConnectionStatus(prev => ({ ...prev, status: 'connecting' }));
          setTimeout(() => {
            setConnectionStatus(prev => ({ 
              ...prev, 
              status: 'connected',
              lastUpdate: new Date()
            }));
          }, 2000);
        }, 1000);
      }
    };

    const interval = setInterval(() => {
      simulateConnection();
      
      if (connectionStatus.status === 'connected') {
        const newUpdate = generateRandomUpdate();
        setUpdates(prev => [newUpdate, ...prev.slice(0, 19)]); // Keep only last 20 updates
        
        setConnectionStatus(prev => ({
          ...prev,
          lastUpdate: new Date(),
          updateCount: prev.updateCount + 1
        }));
      }
    }, 3000 + Math.random() * 4000); // Random interval between 3-7 seconds

    return () => clearInterval(interval);
  }, [isSimulationActive, connectionStatus.status]);

  const getPriorityColor = (priority: LiveUpdate['priority']) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-300';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getTypeIcon = (type: LiveUpdate['type']) => {
    switch (type) {
      case 'bed_count': return <Bed className="h-4 w-4" />;
      case 'patient_admission': return <Users className="h-4 w-4" />;
      case 'staff_update': return <Activity className="h-4 w-4" />;
      case 'equipment_status': return <Heart className="h-4 w-4" />;
      case 'emergency_alert': return <AlertTriangle className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getConnectionIcon = () => {
    switch (connectionStatus.status) {
      case 'connected': return <Wifi className="h-4 w-4 text-green-500" />;
      case 'connecting': return <Activity className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'disconnected': return <WifiOff className="h-4 w-4 text-red-500" />;
    }
  };

  const clearUpdates = () => {
    setUpdates([]);
    setConnectionStatus(prev => ({ ...prev, updateCount: 0 }));
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Activity className="h-4 w-4 text-blue-500" />
            Live Updates
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge 
              variant="outline" 
              className={`flex items-center gap-1 ${
                connectionStatus.status === 'connected' 
                  ? 'border-green-300 text-green-700' 
                  : connectionStatus.status === 'connecting'
                  ? 'border-yellow-300 text-yellow-700'
                  : 'border-red-300 text-red-700'
              }`}
            >
              {getConnectionIcon()}
              {connectionStatus.status}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>Updates: {connectionStatus.updateCount}</span>
          <span>Last: {connectionStatus.lastUpdate.toLocaleTimeString()}</span>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsSimulationActive(!isSimulationActive)}
            className="text-xs"
          >
            {isSimulationActive ? 'Pause' : 'Resume'} Simulation
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearUpdates}
            className="text-xs"
          >
            Clear
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        {connectionStatus.status === 'disconnected' && (
          <div className="p-4 text-center text-red-600 bg-red-50 border-b">
            <WifiOff className="h-6 w-6 mx-auto mb-2" />
            <p className="text-sm font-medium">Connection Lost</p>
            <p className="text-xs">Attempting to reconnect...</p>
          </div>
        )}
        
        <div className="overflow-y-auto h-full">
          {updates.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent updates</p>
              <p className="text-xs">Live data will appear here</p>
            </div>
          ) : (
            <div className="divide-y">
              {updates.map((update) => (
                <div key={update.id} className="p-3 hover:bg-muted/30 transition-colors">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getTypeIcon(update.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge className={`${getPriorityColor(update.priority)} text-xs`}>
                          {update.priority.toUpperCase()}
                        </Badge>
                        {update.department && (
                          <Badge variant="outline" className="text-xs">
                            {update.department}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-foreground mb-1">
                        {update.message}
                      </p>
                      
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{update.timestamp.toLocaleTimeString()}</span>
                        
                        {update.data && (
                          <>
                            <span>•</span>
                            <span>Beds: {update.data.bedCount}</span>
                            <span>•</span>
                            <span>Staff: {update.data.staffCount}</span>
                          </>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      {update.priority === 'critical' && (
                        <div className="h-2 w-2 bg-red-500 rounded-full animate-pulse" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RealTimeUpdatesPanel;
