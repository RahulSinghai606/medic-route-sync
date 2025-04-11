
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CheckCircle2, Clock, Ambulance, Hospital } from 'lucide-react';

type Status = 'available' | 'en-route' | 'at-scene' | 'transporting';

interface StatusConfig {
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
}

const statusConfig: Record<Status, StatusConfig> = {
  available: {
    label: 'Available',
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  'en-route': {
    label: 'En Route',
    icon: <Ambulance className="h-4 w-4" />,
    color: 'text-blue-700',
    bgColor: 'bg-blue-100',
  },
  'at-scene': {
    label: 'At Scene',
    icon: <Clock className="h-4 w-4" />,
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  transporting: {
    label: 'Transporting',
    icon: <Hospital className="h-4 w-4" />,
    color: 'text-emergency',
    bgColor: 'bg-red-100',
  },
};

const StatusToggle = () => {
  const [status, setStatus] = useState<Status>('available');
  const currentConfig = statusConfig[status];

  return (
    <div className="flex items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="outline" 
            className={`flex gap-2 ${currentConfig.color} ${currentConfig.bgColor} border-none`}
          >
            <div className={`status-indicator ${status === 'available' ? 'status-available' : status === 'en-route' ? 'status-en-route' : 'status-busy'}`} />
            {currentConfig.icon}
            <span>{currentConfig.label}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {Object.entries(statusConfig).map(([key, config]) => (
            <DropdownMenuItem 
              key={key}
              onClick={() => setStatus(key as Status)}
              className="flex items-center gap-2"
            >
              <div className={`status-indicator ${key === 'available' ? 'status-available' : key === 'en-route' ? 'status-en-route' : 'status-busy'}`} />
              {config.icon}
              <span>{config.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default StatusToggle;
