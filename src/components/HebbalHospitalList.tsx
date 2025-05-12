
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Phone, Heart, User, AlertTriangle, Navigation, BadgePercent } from 'lucide-react';
import { getHebbalHospitals, getMatchScoreColor, getMatchIndicator, HebbalHospital } from '@/data/hebbalHospitals';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const HebbalHospitalList: React.FC = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const hospitals = getHebbalHospitals();

  const getMatchScoreBadgeStyles = (score: number) => {
    if (score >= 90) return 'bg-green-600 hover:bg-green-700 text-white';
    if (score >= 75) return 'bg-yellow-500 hover:bg-yellow-600 text-white';
    if (score >= 60) return 'bg-amber-500 hover:bg-amber-600 text-white';
    return 'bg-red-600 hover:bg-red-700 text-white';
  };

  // Function to get paramedic name for the hospital (simulating NE Indian names)
  const getParamedicName = (hospitalId: number) => {
    const neIndianNames = [
      "Tenzin Wangchuk",
      "Bhaichung Bhutia",
      "Lalsangzuali Sailo",
      "Tarundeep Rai",
      "Dipa Karmakar",
      "Chekrovolu Swuro", 
      "Mary Kom",
      "Hima Das",
      "Bimal Gurung",
      "Lovlina Borgohain",
      "Baichung Bhutia",
      "Laishram Sarita Devi"
    ];
    
    // Use hospital ID as a seed to consistently get the same name for each hospital
    return neIndianNames[hospitalId % neIndianNames.length];
  };
  
  const handleGetDirections = (hospital: HebbalHospital) => {
    // Use current location if available, otherwise use a default location
    const origin = navigator.geolocation ? 
      new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(
          position => resolve(`${position.coords.latitude},${position.coords.longitude}`),
          () => resolve("current+location") // Fallback to "current location" text if permission denied
        );
      }) :
      Promise.resolve("current+location");
      
    origin.then((originText) => {
      const destination = `${hospital.lat},${hospital.lng}`;
      const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originText}&destination=${destination}`;
      
      // Open in a new tab
      window.open(mapsUrl, '_blank');
      
      toast({
        title: "Opening Maps",
        description: `Getting directions to ${hospital.name}`,
      });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('hebbal.title')}</CardTitle>
        <CardDescription>{t('hebbal.description')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {hospitals.map((hospital) => (
          <div 
            key={hospital.id}
            className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-medium text-lg flex items-center gap-2">
                  {hospital.name}
                  <span className="text-base">{getMatchIndicator(hospital.matchScore)}</span>
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  <span>{hospital.distance} km</span>
                  <span>•</span>
                  <Clock className="h-3 w-3" />
                  <span>{hospital.eta} min</span>
                </div>
              </div>
              <Button size="sm" className={`rounded-full px-3 py-1 flex gap-1 items-center ${getMatchScoreBadgeStyles(hospital.matchScore)}`}>
                <BadgePercent className="h-3.5 w-3.5" />
                <span className="font-bold">{hospital.matchScore}%</span>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-3">
              <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md flex items-center justify-between">
                <span className="text-sm">{t('hospitals.beds')}:</span>
                <Badge variant={hospital.availableBeds > 10 ? "default" : hospital.availableBeds > 5 ? "outline" : "destructive"}>
                  {hospital.availableBeds}
                </Badge>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md flex items-center justify-between">
                <span className="text-sm">{t('hospitals.icu')}:</span>
                <Badge variant={hospital.icuCapacity.available > 5 ? "default" : hospital.icuCapacity.available > 2 ? "outline" : "destructive"}>
                  {hospital.icuCapacity.available}/{hospital.icuCapacity.total}
                </Badge>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-md flex items-center justify-between">
                <span className="text-sm">{t('hospitals.eta')}:</span>
                <Badge variant={hospital.waitTime < 15 ? "default" : hospital.waitTime < 30 ? "outline" : "destructive"}>
                  {hospital.eta + hospital.waitTime} min
                </Badge>
              </div>
            </div>
            
            <div className="text-sm mb-2">
              <div className="font-medium mb-1">{t('hospitals.specialties')}:</div>
              <div className="flex flex-wrap gap-1">
                {hospital.specialties.map((specialty, index) => (
                  <Badge key={index} variant="outline" className="bg-medical/10">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Phone className="h-3 w-3" />
                <span>{hospital.phone}</span>
              </div>
              
              <div className="flex items-center gap-1 text-xs">
                <User className="h-3 w-3 text-medical" />
                <span className="text-muted-foreground">On-call: {getParamedicName(hospital.id)}</span>
              </div>
            </div>
            
            <div className="mt-3 flex justify-end">
              <Button size="sm" variant="outline" className="flex items-center gap-1 text-xs" onClick={() => handleGetDirections(hospital)}>
                <Navigation className="h-3 w-3" />
                Get Directions
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default HebbalHospitalList;
