'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { 
  ArrowLeft, 
  Mail, 
  Clock, 
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  User,
  Globe,
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ticketApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

interface Ticket {
  _id: string;
  ticketNumber: string;
  name: string | null;
  email: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  responses: Array<{
    id: string;
    message: string;
    respondedBy: string;
    isInternal: boolean;
    respondedAt: string;
  }>;
  metadata: {
    userAgent: string | null;
    ipAddress: string | null;
    pageUrl: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

export default function TicketDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const ticketId = params.id as string;

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);
  const [responseMessage, setResponseMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPriority, setUpdatingPriority] = useState(false);

  useEffect(() => {
    if (ticketId) {
      loadTicket();
    }
  }, [ticketId]);

  const loadTicket = async () => {
    try {
      setLoading(true);
      const response = await ticketApi.get(ticketId);
      setTicket(response.ticket);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to load ticket',
        variant: 'destructive',
      });
      router.push('/dashboard/tickets');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitResponse = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!responseMessage.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a response message',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);
      await ticketApi.addResponse(ticketId, responseMessage, isInternal);
      
      toast({
        title: 'Success',
        description: isInternal ? 'Internal note added' : 'Response sent successfully',
      });

      setResponseMessage('');
      setIsInternal(false);
      await loadTicket();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to send response',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      setUpdatingStatus(true);
      await ticketApi.updateStatus(ticketId, newStatus as any);
      
      toast({
        title: 'Success',
        description: 'Ticket status updated',
      });

      await loadTicket();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update status',
        variant: 'destructive',
      });
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePriorityChange = async (newPriority: string) => {
    try {
      setUpdatingPriority(true);
      await ticketApi.updatePriority(ticketId, newPriority as any);
      
      toast({
        title: 'Success',
        description: 'Ticket priority updated',
      });

      await loadTicket();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to update priority',
        variant: 'destructive',
      });
    } finally {
      setUpdatingPriority(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'text-blue-500',
      in_progress: 'text-yellow-500',
      resolved: 'text-green-500',
      closed: 'text-gray-500',
    };
    return colors[status as keyof typeof colors] || 'text-gray-500';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'text-blue-500',
      medium: 'text-yellow-500',
      high: 'text-red-500',
    };
    return colors[priority as keyof typeof colors] || 'text-gray-500';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-[#10b5cb]" />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Ticket not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard/tickets')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold font-mono">{ticket.ticketNumber}</h1>
            <p className="text-sm text-muted-foreground">
              Created {formatDate(ticket.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Original Message */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <User className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">
                      {ticket.name || 'Anonymous'}
                    </CardTitle>
                    <CardDescription>{ticket.email}</CardDescription>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">
                  {formatDate(ticket.createdAt)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-foreground whitespace-pre-wrap">{ticket.message}</p>
              </div>
            </CardContent>
          </Card>

          {/* Responses */}
          {ticket.responses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Responses ({ticket.responses.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {ticket.responses.map((response) => (
                  <div key={response.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-[#10b5cb]/10 flex items-center justify-center">
                          <Mail className="h-4 w-4 text-[#10b5cb]" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{response.respondedBy}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(response.respondedAt)}
                          </p>
                        </div>
                        {response.isInternal && (
                          <Badge variant="secondary" className="ml-2">
                            Internal Note
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="bg-muted/30 rounded-lg p-3 ml-10">
                      <p className="text-sm whitespace-pre-wrap">{response.message}</p>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Response Form */}
          <Card>
            <CardHeader>
              <CardTitle>Add Response</CardTitle>
              <CardDescription>
                Respond to the customer or add an internal note
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitResponse} className="space-y-4">
                <Textarea
                  placeholder="Type your response here..."
                  value={responseMessage}
                  onChange={(e) => setResponseMessage(e.target.value)}
                  rows={6}
                  disabled={submitting}
                  className="resize-none"
                />

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="internal"
                    checked={isInternal}
                    onCheckedChange={(checked) => setIsInternal(checked as boolean)}
                    disabled={submitting}
                  />
                  <Label
                    htmlFor="internal"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    Internal note (not sent to customer)
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={submitting || !responseMessage.trim()}
                  className="w-full"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      {isInternal ? 'Add Internal Note' : 'Send Response'}
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status & Priority */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Ticket Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={ticket.status}
                  onValueChange={handleStatusChange}
                  disabled={updatingStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select
                  value={ticket.priority}
                  onValueChange={handlePriorityChange}
                  disabled={updatingPriority}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Customer Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.name || 'Not provided'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Email</p>
                  <a
                    href={`mailto:${ticket.email}`}
                    className="text-sm text-[#10b5cb] hover:underline"
                  >
                    {ticket.email}
                  </a>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Created</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(ticket.createdAt)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 mt-0.5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Last Updated</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(ticket.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Details */}
          {(ticket.metadata.pageUrl || ticket.metadata.userAgent) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Technical Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {ticket.metadata.pageUrl && (
                  <div className="flex items-start gap-2">
                    <Globe className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Page URL</p>
                      <a
                        href={ticket.metadata.pageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#10b5cb] hover:underline break-all"
                      >
                        {ticket.metadata.pageUrl}
                      </a>
                    </div>
                  </div>
                )}

                {ticket.metadata.userAgent && (
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">User Agent</p>
                      <p className="text-xs text-muted-foreground break-all">
                        {ticket.metadata.userAgent}
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
