'use client';

import { ChatBot } from '@/components/ChatBot';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/lib/store';
import { Plus } from 'lucide-react';

export default function ChatPage() {
  const { createNewSession } = useChatStore();

  const handleNewChat = () => {
    createNewSession();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Chat Assistant</h1>
          <p className="text-muted-foreground mt-1">
            Ask questions about your registered data
          </p>
        </div>
        <Button onClick={handleNewChat} className="gap-2">
          <Plus className="w-4 h-4" />
          New Chat
        </Button>
      </div>

      <ChatBot />
    </div>
  );
}
