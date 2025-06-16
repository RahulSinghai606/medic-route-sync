
import React, { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, Wifi, WifiOff } from 'lucide-react';

interface LiveDataSimulatorProps {
  isActive: boolean;
  onDataUpdate?: (data: any) => void;
}

const LiveDataSimulator: React.FC<LiveDataSimulatorProps> = ({ isActive, onDataUpdate }) => {
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'disconnected' | 'connecting'>('connected');
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [dataPoints, setDataPoints] = useState<number>(0);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      // Simulate realistic hospital data variations
      const mockData = {
        timestamp: new Date(),
        bedAvailability: Math.floor(Math.random() * 50) + 10,
        emergencyQueue: Math.floor(Math.random() * 15),
        icuBeds: Math.floor(Math.random() * 8) + 2,
        ventilators: Math.floor(Math.random() * 5) + 1,
        staffOnDuty: Math.floor(Math.random() * 20) + 15,
        avgWaitTime: Math.floor(Math.random() * 45) + 5,
      };

      // Simulate occasional connection issues
      if (Math.random() < 0.05) {
        setConnectionStatus('disconnected');
        setTimeout(() => {
          setConnectionStatus('connecting');
          setTimeout(() => setConnectionStatus('connected'), 2000);
        }, 1000);
      }

      setLastUpdate(new Date());
      setDataPoints(prev => prev + 1);
      
      if (onDataUpdate) {
        onDataUpdate(mockData);
      }
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, [isActive, onDataUpdate]);

  const getConnectionIcon = () => {
    switch (connectionStatus) {
      case 'connected': return <Wifi className="h-3 w-3 text-green-500" />;
      case 'connecting': return <Activity className="h-3 w-3 text-yellow-500 animate-spin" />;
      default: return <WifiOff className="h-3 w-3 text-red-500" />;
    }
  };

  const getConnectionColor = () => {
    switch (connectionStatus) {
      case 'connected': return 'bg-green-100 text-green-800 border-green-300';
      case 'connecting': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      default: return 'bg-red-100 text-red-800 border-red-300';
    }
  };

  if (!isActive) return null;

  return (
    <Card className="border-dashed border-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <Activity className="h-4 w-4 text-blue-500" />
          Live Data Simulation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className={`flex items-center gap-1 ${getConnectionColor()}`}>
              {getConnectionIcon()}
              {connectionStatus}
            </Badge>
            <span className="text-muted-foreground">
              Updates: {dataPoints}
            </span>
          </div>
          <span className="text-muted-foreground">
            Last: {lastUpdate.toLocaleTimeString()}
          </span>
        </div>
        
        {connectionStatus === 'disconnected' && (
          <div className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">
            Connection lost. Attempting to reconnect...
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LiveDataSimulator;
