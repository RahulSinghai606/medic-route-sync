
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Stethoscope, AlertTriangle, Building2, HeartPulse, Thermometer, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { navigateToHospitalsWithSpecialties } from '@/utils/hospitalUtils';

interface AIClinicalAssessmentProps {
  assessment?: {
    clinical_probability: string;
    care_recommendations: string;
    specialty_tags: string[];
  };
  isLoading?: boolean;
}

const AIClinicalAssessment = ({ assessment, isLoading = false }: AIClinicalAssessmentProps) => {
  const navigate = useNavigate();
  
  const isCritical = assessment?.clinical_probability.toLowerCase().includes('critical') || 
                     assessment?.clinical_probability.toLowerCase().includes('severe') ||
                     assessment?.clinical_probability.toLowerCase().includes('emergency');
  
  const handleFindHospitals = () => {
    if (assessment) {
      navigateToHospitalsWithSpecialties(
        navigate, 
        assessment.specialty_tags, 
        isCritical,
        assessment.clinical_probability
      );
    }
  };
  
  if (isLoading) {
    return (
      <Card className="border-medical bg-medical/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-medical flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Clinical Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 flex flex-col items-center space-y-2">
            <div className="animate-pulse flex space-x-2 items-center">
              <HeartPulse className="h-5 w-5 text-medical animate-bounce" />
              <Thermometer className="h-5 w-5 text-medical animate-bounce delay-100" />
              <Wind className="h-5 w-5 text-medical animate-bounce delay-200" />
            </div>
            <p className="text-muted-foreground">Processing clinical information...</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  if (!assessment) {
    return (
      <Card className="border-medical bg-medical/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-medical flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Clinical Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4 text-muted-foreground">
            <p>No AI assessment available yet.</p>
            <p className="text-sm mt-2">Record patient vitals with voice input to generate an assessment.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-medical bg-medical/5">
      <CardHeader className="pb-2">
        <CardTitle className="text-medical flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Clinical Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`${isCritical ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' : 'bg-background border-medical/20'} rounded-md p-3 border`}>
          <div className="flex items-start gap-2">
            <AlertTriangle className={`h-5 w-5 ${isCritical ? 'text-red-500' : 'text-warning'} mt-0.5 flex-shrink-0`} />
            <div>
              <h4 className="font-medium">Clinical Probability</h4>
              <p>{assessment.clinical_probability}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-background rounded-md p-3 border border-medical/20">
          <div className="flex items-start gap-2">
            <Stethoscope className="h-5 w-5 text-medical mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-medium">Care Recommendations</h4>
              <p>{assessment.care_recommendations}</p>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium mb-2">Specialty Requirements</h4>
          <div className="flex flex-wrap gap-2">
            {assessment.specialty_tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="bg-medical/10 text-medical">
                #{tag}
              </Badge>
            ))}
          </div>
        </div>
        
        <Button
          onClick={handleFindHospitals}
          className="w-full mt-2 bg-medical hover:bg-medical/90 flex items-center gap-2 justify-center"
        >
          <Building2 className="h-4 w-4" />
          Find Matching Hospitals
        </Button>
      </CardContent>
    </Card>
  );
};

export default AIClinicalAssessment;
