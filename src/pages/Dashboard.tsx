import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EMSDashboard from '@/components/RoleBasedDashboard/EMSDashboard';
import GuidedTour from '@/components/Onboarding/GuidedTour';
import FeedbackSystem from '@/components/Feedback/FeedbackSystem';
import QuickStartTemplates from '@/components/Workflows/QuickStartTemplates';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { profile } = useAuth();
  const [showGuidedTour, setShowGuidedTour] = useState(false);

  useEffect(() => {
    // Check if user has completed tour
    const tourCompleted = localStorage.getItem('tero-tour-completed-paramedic');
    if (!tourCompleted && profile) {
      setShowGuidedTour(true);
    }
  }, [profile]);

  const handleTemplateSelect = (template: any) => {
    console.log('Selected template:', template);
    // Implement template workflow logic
  };

  return (
    <div className="space-y-6">
      {/* Help Button */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowGuidedTour(true)}
          className="flex items-center gap-2"
        >
          <HelpCircle className="h-4 w-4" />
          Help & Tour
        </Button>
      </div>

      {/* Main Dashboard */}
      <EMSDashboard />

      {/* Quick Start Templates */}
      <QuickStartTemplates 
        userRole="paramedic"
        onSelectTemplate={handleTemplateSelect}
      />

      {/* Feedback System */}
      <FeedbackSystem />

      {/* Guided Tour */}
      <GuidedTour
        isOpen={showGuidedTour}
        onClose={() => setShowGuidedTour(false)}
        userRole="paramedic"
      />
    </div>
  );
};

export default Dashboard;
