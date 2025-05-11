
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Phone, Heart, User, AlertTriangle } from 'lucide-react';
import { getHebbalHospitals, getMatchScoreColor, getMatchIndicator } from '@/data/hebbalHospitals';
import { useLanguage } from '@/contexts/LanguageContext';

const HebbalHospitalList: React.FC = () => {
  const { t } = useLanguage();
  const hospitals = getHebbalHospitals();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hebbal Hospitals - Courtyard Bengaluru</CardTitle>
        <CardDescription>Emergency facility matching nearby Hebbal</CardDescription>
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
              <div className={`text-right px-3 py-1 rounded-full font-medium text-sm ${getMatchScoreColor(hospital.matchScore)}`}>
                {t('hospitals.match')}: {hospital.matchScore}%
              </div>
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
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
              <Phone className="h-3 w-3" />
              <span>{hospital.phone}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default HebbalHospitalList;
