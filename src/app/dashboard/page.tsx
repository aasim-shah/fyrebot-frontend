'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bot, Database, TrendingUp, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/store';
import { tenantApi } from '@/lib/api';
import type { UsageStats } from '@/lib/types';



export default function DashboardPage() {
  const router = useRouter();
  const { tenant } = useAuthStore();
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);

  useEffect(() => {
    loadUsageStats();
  }, []);

  const loadUsageStats = async () => {
    try {
      const response = await tenantApi.getUsage();
      setUsageStats(response.usage);
    } catch (error: any) {
      console.error('Failed to load usage stats:', error);
    }
  };

  const quickActions = [
    {
      title: 'Add Your Data',
      description: 'Upload documents or add text to your knowledge base',
      icon: Database,
      href: '/dashboard/data',
      color: 'text-blue-500',
    },
    {
      title: 'Account Settings',
      description: 'Manage your profile and API keys',
      icon: TrendingUp,
      href: '/dashboard/tenant',
      color: 'text-green-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-[#10b5cb]" />
            Welcome back, {tenant?.name}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your ChatBot SaaS account
          </p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {tenant?.plan || 'Free'} Plan
        </Badge>
      </div>

      {/* Usage Overview */}
      {usageStats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Calls</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usageStats.apiCallsThisMonth.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                of {usageStats.apiCallsLimit.toLocaleString()} this month
              </p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#10b5cb]"
                  style={{
                    width: `${Math.min((usageStats.apiCallsThisMonth / usageStats.apiCallsLimit) * 100, 100)}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Data Sections</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usageStats.sectionsCount}
              </div>
              <p className="text-xs text-muted-foreground">
                of {usageStats.sectionsLimit} available
              </p>
              <div className="mt-2 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#10b5cb]"
                  style={{
                    width: `${Math.min((usageStats.sectionsCount / usageStats.sectionsLimit) * 100, 100)}%`,
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rate Limit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usageStats.requestsPerMinuteLimit}
              </div>
              <p className="text-xs text-muted-foreground">
                requests per minute
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Card
                key={action.href}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => router.push(action.href)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-muted group-hover:bg-[#10b5cb]/10">
                      <Icon className={`h-6 w-6 ${action.color}`} />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-[#10b5cb] transition-colors" />
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{action.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Getting Started Guide */}
      <Card className="bg-gradient-to-r from-[#10b5cb]/10 to-blue-500/10 border-[#10b5cb]/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-[#10b5cb]" />
            Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#10b5cb] text-white flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div>
              <p className="font-medium">Add your data</p>
              <p className="text-sm text-muted-foreground">
                Upload documents or paste text to build your knowledge base
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#10b5cb] text-white flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div>
              <p className="font-medium">Get your API key</p>
              <p className="text-sm text-muted-foreground">
                Copy your API key from the Account Settings page
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#10b5cb] text-white flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div>
              <p className="font-medium">Integrate the widget</p>
              <p className="text-sm text-muted-foreground">
                Add the ChatBot widget to your website or use the API directly
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}