
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Stethoscope, AlertTriangle } from 'lucide-react';

interface AIClinicalAssessmentProps {
  assessment?: {
    clinical_probability: string;
    care_recommendations: string;
    specialty_tags: string[];
  };
}

const AIClinicalAssessment = ({ assessment }: AIClinicalAssessmentProps) => {
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
        <div className="bg-background rounded-md p-3 border border-medical/20">
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
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
      </CardContent>
    </Card>
  );
};

export default AIClinicalAssessment;
