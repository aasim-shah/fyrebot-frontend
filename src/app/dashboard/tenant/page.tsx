'use client';

import { useState, useEffect } from 'react';
import { Key, TrendingUp, Copy, Check, RefreshCw, Loader2, Plus, AlertCircle, Eye, EyeOff, Trash2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { tenantApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { toast } from 'sonner';
import type { UsageStats } from '@/lib/types';

interface ApiKey {
  id: string;
  name: string;
  hint: string;
  createdAt: string;
  lastUsed: string | null;
}

interface OpenAIKeyStatus {
  hasKey: boolean;
  hint: string | null;
}

export default function TenantPage() {
  const { tenant, setAuth } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [isCopied, setIsCopied] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newApiKey, setNewApiKey] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: tenant?.name || '',
    email: tenant?.email || '',
  });

  // OpenAI API Key state
  const [openAIKeyStatus, setOpenAIKeyStatus] = useState<OpenAIKeyStatus | null>(null);
  const [openAIKey, setOpenAIKey] = useState('');
  const [isSavingOpenAIKey, setIsSavingOpenAIKey] = useState(false);
  const [isDeletingOpenAIKey, setIsDeletingOpenAIKey] = useState(false);
  const [showOpenAIKeyInput, setShowOpenAIKeyInput] = useState(false);

  useEffect(() => {
    loadUsageStats();
    loadApiKeys();
    loadOpenAIKeyStatus();
  }, []);

  const loadUsageStats = async () => {
    try {
      const response = await tenantApi.getUsage();
      setUsageStats(response.usage);
    } catch (error: any) {
      console.error('Failed to load usage stats:', error);
    }
  };

  const loadApiKeys = async () => {
    try {
      const response = await tenantApi.listApiKeys();
      setApiKeys(response.data);
    } catch (error: any) {
      console.error('Failed to load API keys:', error);
    }
  };

  const loadOpenAIKeyStatus = async () => {
    try {
      const response = await tenantApi.getOpenAIKeyStatus();
      setOpenAIKeyStatus(response.data);
    } catch (error: any) {
      console.error('Failed to load OpenAI key status:', error);
    }
  };

  const handleSaveOpenAIKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!openAIKey.trim()) {
      toast.error('Please enter your OpenAI API key');
      return;
    }

    setIsSavingOpenAIKey(true);
    try {
      const response = await tenantApi.saveOpenAIKey(openAIKey);
      toast.success('OpenAI API key saved successfully!');
      setOpenAIKey('');
      setShowOpenAIKeyInput(false);
      await loadOpenAIKeyStatus();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save OpenAI API key');
      console.error('Save OpenAI key error:', error);
    } finally {
      setIsSavingOpenAIKey(false);
    }
  };

  const handleDeleteOpenAIKey = async () => {
    if (!confirm('Are you sure you want to delete your OpenAI API key? This will disable AI features until you add a new key.')) {
      return;
    }

    setIsDeletingOpenAIKey(true);
    try {
      await tenantApi.deleteOpenAIKey();
      toast.success('OpenAI API key deleted successfully');
      await loadOpenAIKeyStatus();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete OpenAI API key');
      console.error('Delete OpenAI key error:', error);
    } finally {
      setIsDeletingOpenAIKey(false);
    }
  };

  const handleCreateApiKey = async () => {
    setIsCreatingKey(true);
    try {
      const response = await tenantApi.createApiKey('New API Key');
      setNewApiKey(response.data.apiKey);
      toast.success('API key created successfully! Copy it now - it won\'t be shown again.');
      await loadApiKeys();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create API key');
      console.error('Create API key error:', error);
    } finally {
      setIsCreatingKey(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await tenantApi.update(formData);
      if (tenant) {
        setAuth({ ...tenant, ...formData }, localStorage.getItem('auth_token') || '');
      }
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
      console.error('Update profile error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyApiKey = (key: string, keyId: string) => {
    navigator.clipboard.writeText(key);
    setIsCopied(keyId);
    toast.success('Copied to clipboard');
    setTimeout(() => setIsCopied(null), 2000);
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisibleKeys = new Set(visibleKeys);
    if (newVisibleKeys.has(keyId)) {
      newVisibleKeys.delete(keyId);
    } else {
      newVisibleKeys.add(keyId);
    }
    setVisibleKeys(newVisibleKeys);
  };

  const calculatePercentage = (used: number, limit: number) => {
    return Math.min((used / limit) * 100, 100);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tenant Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account and API credentials
        </p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Update your account details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Profile'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* OpenAI API Key Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                OpenAI API Key
              </CardTitle>
              <CardDescription>
                Add your own OpenAI API key to power the AI chatbot
              </CardDescription>
            </div>
            {openAIKeyStatus?.hasKey && !showOpenAIKeyInput && (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <Check className="h-3 w-3 mr-1" />
                Configured
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {openAIKeyStatus?.hasKey && !showOpenAIKeyInput ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
                <div>
                  <p className="font-medium text-sm">Current API Key</p>
                  <code className="text-xs bg-background px-2 py-1 rounded font-mono mt-1 inline-block">
                    {openAIKeyStatus.hint}
                  </code>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOpenAIKeyInput(true)}
                  >
                    Update Key
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleDeleteOpenAIKey}
                    disabled={isDeletingOpenAIKey}
                  >
                    {isDeletingOpenAIKey ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">
                ✅ Your OpenAI API key is securely stored and encrypted. All API calls will use your key.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSaveOpenAIKey} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="openai-key">OpenAI API Key</Label>
                <Input
                  id="openai-key"
                  type="password"
                  placeholder="sk-..."
                  value={openAIKey}
                  onChange={(e) => setOpenAIKey(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Get your API key from{' '}
                  <a
                    href="https://platform.openai.com/api-keys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline hover:no-underline"
                  >
                    OpenAI Platform
                  </a>
                </p>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isSavingOpenAIKey}>
                  {isSavingOpenAIKey ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Validating & Saving...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Save API Key
                    </>
                  )}
                </Button>
                {showOpenAIKeyInput && openAIKeyStatus?.hasKey && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowOpenAIKeyInput(false);
                      setOpenAIKey('');
                    }}
                  >
                    Cancel
                  </Button>
                )}
              </div>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Security:</strong> Your API key is encrypted before storage and never exposed. 
                  We validate the key with OpenAI before saving.
                </AlertDescription>
              </Alert>
            </form>
          )}
        </CardContent>
      </Card>

      {/* New API Key Display */}
      {newApiKey && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <div className="flex-1">
              <p className="font-semibold mb-2">Save your new API key!</p>
              <p className="text-sm mb-2">This key will only be shown once. Copy it now:</p>
              <div className="flex gap-2">
                <Input
                  value={newApiKey}
                  readOnly
                  className="font-mono text-sm"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleCopyApiKey(newApiKey, 'new')}
                >
                  {isCopied === 'new' ? (
                    <Check className="h-4 w-4 text-green-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNewApiKey(null)}
              className="ml-2"
            >
              Dismiss
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* API Keys Management */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                API Keys
              </CardTitle>
              <CardDescription>
                Manage your API keys for authentication
              </CardDescription>
            </div>
            <Button onClick={handleCreateApiKey} disabled={isCreatingKey} size="sm">
              {isCreatingKey ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Key
                </>
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {apiKeys.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                No API keys found. Create one to get started.
              </p>
            ) : (
              apiKeys.map((key) => (
                <div
                  key={key.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{key.name}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                        {visibleKeys.has(key.id) ? key.hint : '••••••••'}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleKeyVisibility(key.id)}
                        className="h-8 w-8 p-0"
                      >
                        {visibleKeys.has(key.id) ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyApiKey(key.hint, key.id)}
                        className="h-8 w-8 p-0"
                      >
                        {isCopied === key.id ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Created: {new Date(key.createdAt).toLocaleDateString()}
                      {key.lastUsed && ` • Last used: ${new Date(key.lastUsed).toLocaleDateString()}`}
                    </p>
                  </div>
                </div>
              ))
            )}
            <p className="text-xs text-muted-foreground mt-4 border-t pt-3">
              💡 <strong>Security Note:</strong> Full API keys are only shown once at creation. The hints shown here (last 4 characters) help you identify keys. If you lose a key, create a new one.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      {usageStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Usage Statistics
            </CardTitle>
            <CardDescription>
              Track your monthly usage and limits
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* API Calls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>API Calls This Month</Label>
                <span className="text-sm font-medium">
                  {usageStats.apiCallsThisMonth.toLocaleString()} / {usageStats.apiCallsLimit.toLocaleString()}
                </span>
              </div>
              <Progress
                value={calculatePercentage(usageStats.apiCallsThisMonth, usageStats.apiCallsLimit)}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {usageStats.apiCallsLimit - usageStats.apiCallsThisMonth} calls remaining
              </p>
            </div>

            <Separator />

            {/* Data Sections */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Data Sections</Label>
                <span className="text-sm font-medium">
                  {usageStats.sectionsCount} / {usageStats.sectionsLimit}
                </span>
              </div>
              <Progress
                value={calculatePercentage(usageStats.sectionsCount, usageStats.sectionsLimit)}
                className="h-2"
              />
              <p className="text-xs text-muted-foreground">
                {usageStats.sectionsLimit - usageStats.sectionsCount} sections available
              </p>
            </div>

            <Separator />

            {/* Rate Limit */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Rate Limit</Label>
                <Badge variant="secondary">
                  {usageStats.requestsPerMinuteLimit} req/min
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Current rate limit for API requests
              </p>
            </div>

            <Button
              variant="outline"
              onClick={loadUsageStats}
              className="w-full gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Stats
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Plan</span>
            <Badge>{tenant?.plan || 'Free'}</Badge>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Member Since</span>
            <span className="text-sm">
              {tenant?.createdAt
                ? new Date(tenant.createdAt).toLocaleDateString()
                : 'N/A'}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Tenant ID</span>
            <span className="text-sm font-mono">{tenant?.id}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
