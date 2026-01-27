'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Loader2, Zap, Sparkles } from 'lucide-react';
import { subscriptionApi } from '@/lib/api';
import { toast } from 'sonner';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: {
    apiKeys: number;
    dataFiles: number;
    maxFileSize: string;
    chatbots: number;
  };
  stripePriceId?: string;
}

interface PricingPlansProps {
  currentPlan?: string;
  onSuccess?: () => void;
}

export function PricingPlans({ currentPlan = 'free', onSuccess }: PricingPlansProps) {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const response = await subscriptionApi.getPlans();
      setPlans(response.plans);
    } catch (error: any) {
      toast.error('Failed to load plans');
      console.error('Failed to load plans:', error);
    }
  };

  const handleUpgrade = async (plan: Plan) => {
    if (plan.id === 'free') {
      toast.info('You are already on the free plan');
      return;
    }

    setLoading(true);
    setLoadingPlan(plan.id);

    try {
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      const { url } = await subscriptionApi.createCheckoutSession(
        `${window.location.origin}/dashboard/tenant?success=true`,
        `${window.location.origin}/dashboard/tenant?canceled=true`
      );

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to start checkout');
      console.error('Checkout error:', error);
      setLoading(false);
      setLoadingPlan(null);
    }
  };

  const getPlanIcon = (planId: string) => {
    if (planId === 'pro') {
      return <Zap className="w-6 h-6 text-primary" />;
    }
    return <Sparkles className="w-6 h-6 text-muted-foreground" />;
  };

  return (
    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {plans.map((plan) => {
        const isCurrentPlan = plan.id === currentPlan;
        const isPro = plan.id === 'pro';

        return (
          <Card
            key={plan.id}
            className={`relative ${
              isPro
                ? 'border-primary shadow-lg scale-105'
                : 'border-border'
            }`}
          >
            {isPro && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              </div>
            )}

            <CardHeader className="text-center pb-8 pt-8">
              <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                {getPlanIcon(plan.id)}
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold text-foreground">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-muted-foreground">/{plan.interval}</span>
                  )}
                </div>
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm">
                    {plan.features.chatbots} {plan.features.chatbots === 1 ? 'Chatbot' : 'Chatbots'} (API {plan.features.chatbots === 1 ? 'Key' : 'Keys'})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm">
                    Upload up to {plan.features.dataFiles} data files
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm">
                    Max {plan.features.maxFileSize} per file
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm">
                    Use your own OpenAI API key
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-primary shrink-0" />
                  <span className="text-sm">
                    Unmetered chatbot usage
                  </span>
                </div>
                {isPro && (
                  <>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm">Priority support</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 text-primary shrink-0" />
                      <span className="text-sm">Advanced analytics</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>

            <CardFooter>
              <Button
                className="w-full"
                variant={isPro ? 'default' : 'outline'}
                onClick={() => handleUpgrade(plan)}
                disabled={isCurrentPlan || loading}
              >
                {loading && loadingPlan === plan.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : isCurrentPlan ? (
                  'Current Plan'
                ) : plan.id === 'free' ? (
                  'Get Started'
                ) : (
                  'Upgrade Now'
                )}
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
