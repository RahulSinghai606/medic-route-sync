
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  MapPin, 
  Phone, 
  Navigation, 
  Clock, 
  Bed, 
  Users, 
  Activity,
  Shield,
  AlertCircle,
  CheckCircle,
  Timer,
  Stethoscope,
  Heart,
  Brain
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface HospitalCardProps {
  hospital: {
    id: string;
    name: string;
    type: string;
    distance: number;
    eta: number;
    beds: number;
    match: number;
    phone: string;
    address: string;
    specialties?: string[];
    lastUpdated?: string;
    icuBeds?: number;
    specialistOnDuty?: boolean;
    emergencyLevel?: 'low' | 'medium' | 'high' | 'critical';
  };
  onCall: (phone: string) => void;
  onDirections: (hospital: any) => void;
}

const HospitalCard: React.FC<HospitalCardProps> = ({ hospital, onCall, onDirections }) => {
  const { t } = useLanguage();

  const getMatchColor = (match: number) => {
    if (match >= 90) return 'bg-green-500 text-white';
    if (match >= 70) return 'bg-yellow-500 text-black';
    if (match >= 50) return 'bg-orange-500 text-white';
    return 'bg-red-500 text-white';
  };

  const getMatchIcon = (match: number) => {
    if (match >= 90) return <CheckCircle className="h-3 w-3" />;
    if (match >= 70) return <Activity className="h-3 w-3" />;
    if (match >= 50) return <AlertCircle className="h-3 w-3" />;
    return <AlertCircle className="h-3 w-3" />;
  };

  const getEmergencyLevelColor = (level?: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const formatLastUpdated = (timestamp?: string) => {
    if (!timestamp) return 'Just now';
    const now = new Date();
    const updated = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'Just now';
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  };

  return (
    <Card className="border hover:shadow-md transition-all duration-200 bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold mb-1">{hospital.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <MapPin className="h-3 w-3" />
              <span>{hospital.distance} {t('km')}</span>
              <Clock className="h-3 w-3 ml-2" />
              <span>{hospital.eta} {t('min')}</span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <Badge className={`${getMatchColor(hospital.match)} flex items-center gap-1 text-xs font-bold`}>
              {getMatchIcon(hospital.match)}
              {hospital.match}% {t('match')}
            </Badge>
            {hospital.emergencyLevel && (
              <Badge variant="outline" className={`text-xs ${getEmergencyLevelColor(hospital.emergencyLevel)}`}>
                {hospital.emergencyLevel.toUpperCase()}
              </Badge>
            )}
          </div>
        </div>
        
        {/* Status Indicators */}
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="flex items-center gap-1 text-xs">
            <Bed className="h-3 w-3" />
            {hospital.beds} {t('hospitals.beds')}
          </Badge>
          
          {hospital.icuBeds !== undefined && (
            <Badge variant="outline" className={`flex items-center gap-1 text-xs ${
              hospital.icuBeds > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
            }`}>
              <Heart className="h-3 w-3" />
              ICU: {hospital.icuBeds}
            </Badge>
          )}
          
          {hospital.specialistOnDuty && (
            <Badge className="flex items-center gap-1 text-xs bg-blue-100 text-blue-800 border-blue-200">
              <Stethoscope className="h-3 w-3" />
              Specialist On Duty
            </Badge>
          )}
        </div>

        {/* Specialties */}
        {hospital.specialties && hospital.specialties.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {hospital.specialties.slice(0, 3).map((specialty, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {specialty}
              </Badge>
            ))}
            {hospital.specialties.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{hospital.specialties.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Timer className="h-3 w-3" />
            Last Updated: {formatLastUpdated(hospital.lastUpdated)}
          </span>
          <Badge variant="outline" className="text-xs">
            {hospital.type}
          </Badge>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={() => onCall(hospital.phone)} 
            className="flex-1 h-8 text-xs"
            variant="outline"
            aria-label={`Call ${hospital.name}`}
          >
            <Phone className="h-3 w-3 mr-1" />
            {t('hospitals.call')}
          </Button>
          <Button 
            onClick={() => onDirections(hospital)} 
            className="flex-1 h-8 text-xs"
            aria-label={`Get directions to ${hospital.name}`}
          >
            <Navigation className="h-3 w-3 mr-1" />
            {t('hospitals.directions')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HospitalCard;
