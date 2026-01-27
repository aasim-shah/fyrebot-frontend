'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { subscriptionApi } from '@/lib/api';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Subscription {
  id: string;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
}

export function SubscriptionManagement() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [canceling, setCanceling] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  useEffect(() => {
    loadSubscription();
  }, []);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      const response = await subscriptionApi.getSubscription();
      setSubscription(response.subscription);
    } catch (error) {
      console.error('Failed to load subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManageBilling = async () => {
    try {
      const { url } = await subscriptionApi.createBillingPortalSession(
        `${window.location.origin}/dashboard/tenant`
      );
      window.location.href = url;
    } catch (error: any) {
      toast.error('Failed to open billing portal');
      console.error('Billing portal error:', error);
    }
  };

  const handleCancelSubscription = async () => {
    setCanceling(true);
    try {
      await subscriptionApi.cancelSubscription();
      toast.success('Subscription cancelled successfully');
      setShowCancelDialog(false);
      await loadSubscription();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel subscription');
      console.error('Cancel subscription error:', error);
    } finally {
      setCanceling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      past_due: 'destructive',
      canceled: 'secondary',
      incomplete: 'outline',
    };

    return (
      <Badge variant={variants[status] || 'outline'} className="ml-2">
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!subscription) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-muted-foreground" />
            No Active Subscription
          </CardTitle>
          <CardDescription>
            You are currently on the free plan. Upgrade to unlock more features!
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const periodEnd = new Date(subscription.currentPeriodEnd);
  const isActive = subscription.status === 'active';

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle className="w-5 h-5 text-primary mr-2" />
            Pro Plan Subscription
            {getStatusBadge(subscription.status)}
          </CardTitle>
          <CardDescription>
            Manage your subscription and billing information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status</span>
              <span className="font-medium capitalize">{subscription.status.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Current Period Ends</span>
              <span className="font-medium">{periodEnd.toLocaleDateString()}</span>
            </div>
            {subscription.cancelAtPeriodEnd && (
              <div className="p-3 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Your subscription will be cancelled on {periodEnd.toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleManageBilling}
              variant="outline"
              className="flex-1"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Manage Billing
            </Button>
            {isActive && !subscription.cancelAtPeriodEnd && (
              <Button
                onClick={() => setShowCancelDialog(true)}
                variant="destructive"
                className="flex-1"
              >
                Cancel Subscription
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Subscription?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel your Pro plan subscription? You will lose access to Pro features at the end of your billing period on {periodEnd.toLocaleDateString()}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Subscription</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelSubscription}
              disabled={canceling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {canceling ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Cancel Subscription'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
