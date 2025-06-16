
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HelpCircle, X, Lightbulb, BookOpen, Video } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface HelpContent {
  title: string;
  description: string;
  tips: string[];
  shortcuts?: string[];
  videoUrl?: string;
}

interface ContextualHelpProps {
  context: string;
  className?: string;
}

const helpContent: Record<string, HelpContent> = {
  'patient-assessment': {
    title: 'Patient Assessment',
    description: 'Quick guide to conducting thorough patient assessments using TERO.',
    tips: [
      'Start with primary survey: Airway, Breathing, Circulation',
      'Use voice input for hands-free documentation',
      'AI assistant helps identify critical signs',
      'Always document vital signs first'
    ],
    shortcuts: ['Ctrl+M: Voice input', 'Ctrl+S: Save assessment', 'Ctrl+N: New patient'],
    videoUrl: '#'
  },
  'hospital-routing': {
    title: 'Hospital Routing',
    description: 'Find the best hospital match for your patient\'s condition.',
    tips: [
      'System automatically ranks hospitals by suitability',
      'Green indicators show best matches',
      'Check real-time bed availability',
      'Consider patient preference when possible'
    ],
    shortcuts: ['Ctrl+H: Open hospital list', 'Ctrl+R: Refresh availability'],
    videoUrl: '#'
  },
  'disaster-mode': {
    title: 'Disaster Mode',
    description: 'Mass casualty incident protocols and triage workflows.',
    tips: [
      'Activate disaster mode for multi-patient incidents',
      'Use color-coded triage system',
      'Prioritize based on severity and survivability',
      'Coordinate with incident command'
    ],
    shortcuts: ['Ctrl+D: Toggle disaster mode', 'Ctrl+T: Quick triage'],
    videoUrl: '#'
  },
  'case-management': {
    title: 'Case Management',
    description: 'Manage incoming cases and patient transfers efficiently.',
    tips: [
      'Review cases by priority level',
      'Accept or redirect based on capacity',
      'Update bed availability in real-time',
      'Communicate with EMS teams directly'
    ],
    shortcuts: ['Ctrl+A: Accept case', 'Ctrl+R: Redirect case'],
    videoUrl: '#'
  }
};

const ContextualHelp: React.FC<ContextualHelpProps> = ({ context, className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const content = helpContent[context];

  if (!content) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`text-muted-foreground hover:text-foreground ${className}`}
        >
          <HelpCircle className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Card className="border-0 shadow-none">
          <CardContent className="p-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-blue-600" />
                <h4 className="font-semibold">{content.title}</h4>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                <X className="h-3 w-3" />
              </Button>
            </div>

            <p className="text-sm text-muted-foreground mb-3">{content.description}</p>

            <div className="space-y-3">
              <div>
                <h5 className="text-sm font-medium mb-2 flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  Quick Tips
                </h5>
                <ul className="space-y-1">
                  {content.tips.map((tip, index) => (
                    <li key={index} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {content.shortcuts && (
                <div>
                  <h5 className="text-sm font-medium mb-2">Keyboard Shortcuts</h5>
                  <div className="space-y-1">
                    {content.shortcuts.map((shortcut, index) => (
                      <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                        {shortcut}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {content.videoUrl && (
                <Button variant="outline" size="sm" className="w-full text-xs">
                  <Video className="h-3 w-3 mr-1" />
                  Watch Tutorial
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default ContextualHelp;
