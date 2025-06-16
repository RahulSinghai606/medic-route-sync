
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Heart, Activity, Thermometer, Wind } from 'lucide-react';

interface VitalSignsProps {
  heartRate?: number;
  bloodPressure?: string;
  temperature?: number;
  oxygenSaturation?: number;
  respiratoryRate?: number;
  size?: 'sm' | 'md' | 'lg';
}

const VitalSignsIndicator: React.FC<VitalSignsProps> = ({
  heartRate,
  bloodPressure,
  temperature,
  oxygenSaturation,
  respiratoryRate,
  size = 'md'
}) => {
  const getVitalStatus = (value: number | undefined, type: string, normal: [number, number]) => {
    if (!value) return 'unknown';
    if (value < normal[0] || value > normal[1]) return 'abnormal';
    return 'normal';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800 border-green-300';
      case 'abnormal': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const iconSize = size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4';
  const textSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-sm' : 'text-xs';

  return (
    <div className="flex flex-wrap gap-2">
      {heartRate && (
        <Badge 
          variant="outline" 
          className={`flex items-center gap-1 ${textSize} ${getStatusColor(getVitalStatus(heartRate, 'hr', [60, 100]))}`}
        >
          <Heart className={`${iconSize} text-red-500`} />
          {heartRate} bpm
        </Badge>
      )}
      
      {bloodPressure && (
        <Badge variant="outline" className={`flex items-center gap-1 ${textSize}`}>
          <Activity className={`${iconSize} text-blue-500`} />
          {bloodPressure}
        </Badge>
      )}
      
      {temperature && (
        <Badge 
          variant="outline" 
          className={`flex items-center gap-1 ${textSize} ${getStatusColor(getVitalStatus(temperature, 'temp', [36.1, 37.2]))}`}
        >
          <Thermometer className={`${iconSize} text-orange-500`} />
          {temperature}°C
        </Badge>
      )}
      
      {oxygenSaturation && (
        <Badge 
          variant="outline" 
          className={`flex items-center gap-1 ${textSize} ${getStatusColor(getVitalStatus(oxygenSaturation, 'o2', [95, 100]))}`}
        >
          <Wind className={`${iconSize} text-teal-500`} />
          {oxygenSaturation}%
        </Badge>
      )}
      
      {respiratoryRate && (
        <Badge 
          variant="outline" 
          className={`flex items-center gap-1 ${textSize} ${getStatusColor(getVitalStatus(respiratoryRate, 'rr', [12, 20]))}`}
        >
          <Activity className={`${iconSize} text-purple-500`} />
          {respiratoryRate}/min
        </Badge>
      )}
    </div>
  );
};

export default VitalSignsIndicator;
