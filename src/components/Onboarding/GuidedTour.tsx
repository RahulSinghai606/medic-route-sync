
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, ArrowRight, ArrowLeft, Lightbulb, CheckCircle } from 'lucide-react';

interface TourStep {
  id: string;
  title: string;
  description: string;
  target: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  action?: string;
}

interface GuidedTourProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: 'paramedic' | 'hospital' | 'command';
}

const GuidedTour: React.FC<GuidedTourProps> = ({ isOpen, onClose, userRole }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(isOpen);

  const paramedicSteps: TourStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to TERO EMS Dashboard',
      description: 'Let\'s take a quick tour of your emergency response tools.',
      target: 'dashboard',
      position: 'bottom'
    },
    {
      id: 'patients',
      title: 'Patient Management',
      description: 'View and manage active patients. Click here to add new patient data.',
      target: 'patients-tab',
      position: 'bottom',
      action: 'Click to explore patient records'
    },
    {
      id: 'assessment',
      title: 'Quick Assessment Tools',
      description: 'Use AI-powered assessment tools and voice input for rapid patient evaluation.',
      target: 'assessment-tab',
      position: 'bottom',
      action: 'Try voice assessment'
    },
    {
      id: 'hospitals',
      title: 'Hospital Routing',
      description: 'Find the best hospital matches based on patient condition and real-time availability.',
      target: 'hospitals-tab',
      position: 'bottom',
      action: 'View nearby hospitals'
    },
    {
      id: 'emergency',
      title: 'Emergency Features',
      description: 'Access disaster mode and emergency protocols when needed.',
      target: 'emergency-button',
      position: 'left',
      action: 'Emergency protocols'
    }
  ];

  const hospitalSteps: TourStep[] = [
    {
      id: 'welcome',
      title: 'Welcome to TERO Hospital Platform',
      description: 'Manage incoming cases and hospital resources efficiently.',
      target: 'dashboard',
      position: 'bottom'
    },
    {
      id: 'cases',
      title: 'Case Management',
      description: 'Review incoming cases and manage patient transfers.',
      target: 'cases-tab',
      position: 'bottom',
      action: 'Review pending cases'
    },
    {
      id: 'departments',
      title: 'Department Overview',
      description: 'Monitor bed availability and department status across your facility.',
      target: 'departments-tab',
      position: 'bottom',
      action: 'Check bed availability'
    },
    {
      id: 'operations',
      title: 'Operations Center',
      description: 'Access advanced hospital operations and resource management.',
      target: 'operations-tab',
      position: 'bottom',
      action: 'View operations'
    }
  ];

  const commandSteps: TourStep[] = [
    {
      id: 'welcome',
      title: 'Emergency Command Center',
      description: 'Monitor city-wide emergency response and resource allocation.',
      target: 'dashboard',
      position: 'bottom'
    },
    {
      id: 'hospitals',
      title: 'Hospital Network',
      description: 'View real-time status of all hospitals in your network.',
      target: 'hospitals-overview',
      position: 'bottom',
      action: 'Monitor hospital status'
    },
    {
      id: 'resources',
      title: 'Resource Allocation',
      description: 'Manage city-wide resources and respond to capacity issues.',
      target: 'resources-tab',
      position: 'bottom',
      action: 'Allocate resources'
    }
  ];

  const getStepsForRole = () => {
    switch (userRole) {
      case 'hospital':
        return hospitalSteps;
      case 'command':
        return commandSteps;
      default:
        return paramedicSteps;
    }
  };

  const steps = getStepsForRole();
  const currentStepData = steps[currentStep];

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    setIsVisible(false);
    onClose();
    // Mark tour as completed in localStorage
    localStorage.setItem(`tero-tour-completed-${userRole}`, 'true');
  };

  const handleSkip = () => {
    setIsVisible(false);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white dark:bg-gray-900 shadow-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-blue-600" />
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                Step {currentStep + 1} of {steps.length}
              </Badge>
            </div>
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">{currentStepData.title}</h3>
              <p className="text-muted-foreground">{currentStepData.description}</p>
            </div>

            {currentStepData.action && (
              <div className="p-3 bg-blue-50 dark:bg-blue-950/50 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-400 font-medium">
                  💡 Try this: {currentStepData.action}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex gap-2">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              <Button onClick={handleNext} className="flex items-center gap-2">
                {currentStep === steps.length - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Complete
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GuidedTour;
