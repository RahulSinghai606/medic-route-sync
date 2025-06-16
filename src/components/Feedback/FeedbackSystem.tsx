
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Star, ThumbsUp, ThumbsDown, MessageSquare, TrendingUp, CheckCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface FeedbackRequest {
  id: string;
  type: 'routing' | 'outcome' | 'system';
  title: string;
  description: string;
  timestamp: Date;
  context?: any;
}

interface FeedbackSystemProps {
  className?: string;
}

const FeedbackSystem: React.FC<FeedbackSystemProps> = ({ className = '' }) => {
  const [activeRequests, setActiveRequests] = useState<FeedbackRequest[]>([
    {
      id: 'FB001',
      type: 'routing',
      title: 'Hospital Recommendation Feedback',
      description: 'How was your experience with our hospital routing for Patient #P847?',
      timestamp: new Date(Date.now() - 30 * 60000),
      context: { patientId: 'P847', hospitalName: 'City General' }
    },
    {
      id: 'FB002',
      type: 'outcome',
      title: 'Patient Outcome Follow-up',
      description: 'Please provide outcome feedback for the trauma case transferred yesterday.',
      timestamp: new Date(Date.now() - 2 * 60 * 60000),
      context: { caseId: 'C123', outcome: 'pending' }
    }
  ]);

  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<FeedbackRequest | null>(null);
  const [feedbackData, setFeedbackData] = useState({
    rating: '',
    useful: '',
    comments: '',
    improvements: ''
  });

  const handleSubmitFeedback = () => {
    if (selectedRequest) {
      // Submit feedback logic here
      console.log('Feedback submitted:', { requestId: selectedRequest.id, ...feedbackData });
      
      // Remove from active requests
      setActiveRequests(prev => prev.filter(req => req.id !== selectedRequest.id));
      
      // Reset form
      setFeedbackData({ rating: '', useful: '', comments: '', improvements: '' });
      setShowFeedbackDialog(false);
      setSelectedRequest(null);
    }
  };

  const getFeedbackIcon = (type: string) => {
    switch (type) {
      case 'routing':
        return <TrendingUp className="h-4 w-4 text-blue-600" />;
      case 'outcome':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <MessageSquare className="h-4 w-4 text-purple-600" />;
    }
  };

  const getFeedbackBadge = (type: string) => {
    switch (type) {
      case 'routing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Routing</Badge>;
      case 'outcome':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Outcome</Badge>;
      default:
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">System</Badge>;
    }
  };

  return (
    <div className={className}>
      {/* Feedback Requests */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Feedback Requests
            {activeRequests.length > 0 && (
              <Badge variant="secondary">{activeRequests.length} pending</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activeRequests.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No pending feedback requests</p>
          ) : (
            <div className="space-y-3">
              {activeRequests.map((request) => (
                <Card key={request.id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {getFeedbackIcon(request.type)}
                          <h4 className="font-medium">{request.title}</h4>
                          {getFeedbackBadge(request.type)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {Math.floor((Date.now() - request.timestamp.getTime()) / 60000)} minutes ago
                        </p>
                      </div>
                      <Dialog open={showFeedbackDialog && selectedRequest?.id === request.id} 
                              onOpenChange={(open) => {
                                setShowFeedbackDialog(open);
                                if (!open) setSelectedRequest(null);
                              }}>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            onClick={() => setSelectedRequest(request)}
                            className="ml-4"
                          >
                            Provide Feedback
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                          <DialogHeader>
                            <DialogTitle>Feedback - {request.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            {/* Rating */}
                            <div>
                              <Label className="text-sm font-medium">Overall Rating</Label>
                              <RadioGroup 
                                value={feedbackData.rating} 
                                onValueChange={(value) => setFeedbackData(prev => ({ ...prev, rating: value }))}
                                className="flex gap-4 mt-2"
                              >
                                {[1, 2, 3, 4, 5].map((rating) => (
                                  <div key={rating} className="flex items-center space-x-1">
                                    <RadioGroupItem value={rating.toString()} id={`rating-${rating}`} />
                                    <Label htmlFor={`rating-${rating}`} className="flex items-center gap-1">
                                      <Star className="h-4 w-4 fill-current text-yellow-500" />
                                      {rating}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>

                            {/* Usefulness */}
                            <div>
                              <Label className="text-sm font-medium">Was this recommendation useful?</Label>
                              <RadioGroup 
                                value={feedbackData.useful} 
                                onValueChange={(value) => setFeedbackData(prev => ({ ...prev, useful: value }))}
                                className="flex gap-4 mt-2"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="yes" id="useful-yes" />
                                  <Label htmlFor="useful-yes" className="flex items-center gap-1">
                                    <ThumbsUp className="h-4 w-4 text-green-600" />
                                    Yes
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="no" id="useful-no" />
                                  <Label htmlFor="useful-no" className="flex items-center gap-1">
                                    <ThumbsDown className="h-4 w-4 text-red-600" />
                                    No
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {/* Comments */}
                            <div>
                              <Label className="text-sm font-medium">Additional Comments</Label>
                              <Textarea
                                placeholder="Share your experience..."
                                value={feedbackData.comments}
                                onChange={(e) => setFeedbackData(prev => ({ ...prev, comments: e.target.value }))}
                                className="mt-2"
                                rows={3}
                              />
                            </div>

                            {/* Improvements */}
                            <div>
                              <Label className="text-sm font-medium">Suggestions for Improvement</Label>
                              <Textarea
                                placeholder="How can we improve this feature?"
                                value={feedbackData.improvements}
                                onChange={(e) => setFeedbackData(prev => ({ ...prev, improvements: e.target.value }))}
                                className="mt-2"
                                rows={2}
                              />
                            </div>

                            <div className="flex gap-2 pt-4">
                              <Button 
                                variant="outline" 
                                onClick={() => {
                                  setShowFeedbackDialog(false);
                                  setSelectedRequest(null);
                                }}
                                className="flex-1"
                              >
                                Skip
                              </Button>
                              <Button 
                                onClick={handleSubmitFeedback}
                                disabled={!feedbackData.rating || !feedbackData.useful}
                                className="flex-1"
                              >
                                Submit Feedback
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackSystem;
