
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, AlertTriangle, Car, Users, Stethoscope, Building2, Clock } from 'lucide-react';

interface WorkflowTemplate {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  category: 'emergency' | 'routine' | 'disaster';
  estimatedTime: string;
  steps: string[];
}

interface QuickStartTemplatesProps {
  userRole: 'paramedic' | 'hospital' | 'command';
  onSelectTemplate: (template: WorkflowTemplate) => void;
  className?: string;
}

const QuickStartTemplates: React.FC<QuickStartTemplatesProps> = ({ 
  userRole, 
  onSelectTemplate, 
  className = '' 
}) => {
  const paramedicTemplates: WorkflowTemplate[] = [
    {
      id: 'cardiac-emergency',
      title: 'Cardiac Emergency',
      description: 'Complete workflow for cardiac arrest/MI cases',
      icon: <Heart className="h-5 w-5 text-red-600" />,
      category: 'emergency',
      estimatedTime: '5-8 min',
      steps: [
        'Primary assessment (ABC)',
        '12-lead ECG if conscious',
        'Vital signs monitoring',
        'IV access and medications',
        'Hospital notification',
        'Transport with continuous monitoring'
      ]
    },
    {
      id: 'trauma-assessment',
      title: 'Trauma Assessment',
      description: 'Systematic trauma evaluation and stabilization',
      icon: <AlertTriangle className="h-5 w-5 text-amber-600" />,
      category: 'emergency',
      estimatedTime: '10-15 min',
      steps: [
        'Scene safety assessment',
        'Primary survey (ABCDE)',
        'Vital signs and GCS',
        'Secondary assessment',
        'Spinal immobilization if needed',
        'Trauma center notification'
      ]
    },
    {
      id: 'routine-transport',
      title: 'Routine Transport',
      description: 'Standard patient transport protocol',
      icon: <Car className="h-5 w-5 text-blue-600" />,
      category: 'routine',
      estimatedTime: '3-5 min',
      steps: [
        'Patient identification',
        'Basic vital signs',
        'Comfort measures',
        'Hospital notification',
        'Safe transport',
        'Transfer to hospital staff'
      ]
    },
    {
      id: 'mass-casualty',
      title: 'Mass Casualty Incident',
      description: 'MCI triage and coordination protocol',
      icon: <Users className="h-5 w-5 text-purple-600" />,
      category: 'disaster',
      estimatedTime: '20-30 min',
      steps: [
        'Scene size-up and safety',
        'Establish incident command',
        'Initial triage (START/JumpSTART)',
        'Resource allocation',
        'Hospital notifications',
        'Continuous reassessment'
      ]
    }
  ];

  const hospitalTemplates: WorkflowTemplate[] = [
    {
      id: 'incoming-critical',
      title: 'Critical Case Intake',
      description: 'Emergency department critical patient workflow',
      icon: <AlertTriangle className="h-5 w-5 text-red-600" />,
      category: 'emergency',
      estimatedTime: '2-3 min',
      steps: [
        'Review case details',
        'Verify bed availability',
        'Notify receiving team',
        'Prepare equipment',
        'Accept case transfer',
        'Track patient arrival'
      ]
    },
    {
      id: 'bed-management',
      title: 'Bed Management',
      description: 'Efficient bed allocation and turnover',
      icon: <Building2 className="h-5 w-5 text-blue-600" />,
      category: 'routine',
      estimatedTime: '5-10 min',
      steps: [
        'Check current occupancy',
        'Review discharge list',
        'Update bed status',
        'Coordinate housekeeping',
        'Notify admissions',
        'Update system availability'
      ]
    },
    {
      id: 'disaster-response',
      title: 'Disaster Response',
      description: 'Hospital disaster protocol activation',
      icon: <Users className="h-5 w-5 text-purple-600" />,
      category: 'disaster',
      estimatedTime: '15-20 min',
      steps: [
        'Activate disaster protocol',
        'Assess current capacity',
        'Notify all departments',
        'Set up triage areas',
        'Coordinate with EMS',
        'Track resource utilization'
      ]
    }
  ];

  const commandTemplates: WorkflowTemplate[] = [
    {
      id: 'system-overview',
      title: 'System Status Review',
      description: 'City-wide emergency system assessment',
      icon: <Stethoscope className="h-5 w-5 text-green-600" />,
      category: 'routine',
      estimatedTime: '10-15 min',
      steps: [
        'Review hospital capacities',
        'Check ambulance availability',
        'Monitor active incidents',
        'Assess resource distribution',
        'Identify potential issues',
        'Update operational status'
      ]
    },
    {
      id: 'resource-allocation',
      title: 'Emergency Resource Allocation',
      description: 'Coordinate resources during high-demand periods',
      icon: <Users className="h-5 w-5 text-amber-600" />,
      category: 'emergency',
      estimatedTime: '5-8 min',
      steps: [
        'Assess current demand',
        'Identify resource gaps',
        'Coordinate transfers',
        'Notify affected facilities',
        'Monitor implementation',
        'Document decisions'
      ]
    }
  ];

  const getTemplatesForRole = () => {
    switch (userRole) {
      case 'hospital':
        return hospitalTemplates;
      case 'command':
        return commandTemplates;
      default:
        return paramedicTemplates;
    }
  };

  const templates = getTemplatesForRole();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'emergency':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'disaster':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Quick Start Templates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {templates.map((template) => (
              <Card key={template.id} className="border hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {template.icon}
                      <h4 className="font-semibold">{template.title}</h4>
                    </div>
                    <Badge variant="outline" className={getCategoryColor(template.category)}>
                      {template.category}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
                  
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {template.estimatedTime}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {template.steps.length} steps
                    </span>
                  </div>

                  <div className="space-y-1 mb-4">
                    <p className="text-xs font-medium text-muted-foreground">Key Steps:</p>
                    <div className="text-xs text-muted-foreground">
                      {template.steps.slice(0, 3).map((step, index) => (
                        <div key={index} className="flex items-start gap-1">
                          <span>{index + 1}.</span>
                          <span>{step}</span>
                        </div>
                      ))}
                      {template.steps.length > 3 && (
                        <div className="text-xs text-muted-foreground/70">
                          +{template.steps.length - 3} more steps...
                        </div>
                      )}
                    </div>
                  </div>

                  <Button 
                    size="sm" 
                    className="w-full"
                    onClick={() => onSelectTemplate(template)}
                  >
                    Start Workflow
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStartTemplates;
