
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Shield, Users, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DisasterModeToggleProps {
  isActive: boolean;
  onToggle: (active: boolean) => void;
}

const DisasterModeToggle: React.FC<DisasterModeToggleProps> = ({ isActive, onToggle }) => {
  const { toast } = useToast();

  const handleToggle = () => {
    const newState = !isActive;
    onToggle(newState);
    
    toast({
      title: newState ? "Disaster Mode Activated" : "Disaster Mode Deactivated",
      description: newState 
        ? "Mass casualty protocols engaged. Triage mode enabled." 
        : "Returning to normal operations mode.",
      variant: newState ? "destructive" : "default",
    });
  };

  return (
    <div className="flex items-center gap-3">
      <Button
        onClick={handleToggle}
        variant={isActive ? "destructive" : "outline"}
        className={`flex items-center gap-2 ${isActive ? 'animate-pulse' : ''}`}
        size="sm"
      >
        {isActive ? (
          <>
            <AlertTriangle className="h-4 w-4" />
            <span className="font-medium">Disaster Mode ON</span>
          </>
        ) : (
          <>
            <Shield className="h-4 w-4" />
            <span>Activate Disaster Mode</span>
          </>
        )}
      </Button>
      
      {isActive && (
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="flex items-center gap-1 animate-pulse">
            <Users className="h-3 w-3" />
            Mass Casualty
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Activity className="h-3 w-3" />
            Triage Active
          </Badge>
        </div>
      )}
    </div>
  );
};

export default DisasterModeToggle;
