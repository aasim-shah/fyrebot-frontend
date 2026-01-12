'use client';

import { useState } from 'react';
import { FileText, File, FileCode, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const formatGuide = [
  {
    icon: FileText,
    name: 'PDF',
    extensions: ['.pdf'],
    color: 'text-red-500',
    description: 'Portable Document Format - Supports text extraction from standard PDFs',
    bestFor: 'Documentation, reports, manuals',
  },
  {
    icon: File,
    name: 'DOCX/DOC',
    extensions: ['.docx', '.doc'],
    color: 'text-blue-500',
    description: 'Microsoft Word documents - Extracts text content and formatting',
    bestFor: 'Articles, documentation, knowledge base',
  },
  {
    icon: FileText,
    name: 'TXT',
    extensions: ['.txt'],
    color: 'text-gray-500',
    description: 'Plain text files - Direct text content without formatting',
    bestFor: 'Simple text data, logs, transcripts',
  },
  {
    icon: FileCode,
    name: 'Markdown',
    extensions: ['.md'],
    color: 'text-purple-500',
    description: 'Markdown files - Lightweight markup language for formatted text',
    bestFor: 'Technical documentation, README files',
  },
];

export function FormatGuide() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Info className="w-4 h-4" />
          Supported Formats
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Supported File Formats</DialogTitle>
          <DialogDescription>
            Learn about the document formats you can upload to your knowledge base
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {formatGuide.map((format) => {
            const Icon = format.icon;
            return (
              <Card key={format.name}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <Icon className={`w-10 h-10 ${format.color} shrink-0`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{format.name}</h3>
                        <div className="flex gap-1">
                          {format.extensions.map((ext) => (
                            <Badge key={ext} variant="secondary" className="text-xs">
                              {ext}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {format.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">Best for:</span> {format.bestFor}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}

          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-2">
                <p className="font-medium">Tips for best results:</p>
                <ul className="text-sm space-y-1 list-disc list-inside">
                  <li>Maximum file size: 10MB per file</li>
                  <li>Upload up to 10 files at once</li>
                  <li>Ensure PDFs contain selectable text (not scanned images)</li>
                  <li>Use UTF-8 encoding for text files</li>
                  <li>Files are automatically chunked and indexed for AI search</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        </div>
      </DialogContent>
    </Dialog>
  );
}
