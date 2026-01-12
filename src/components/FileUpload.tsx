'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FileUploadProps {
  onUploadComplete?: (results: any) => void;
  maxFiles?: number;
  maxSize?: number;
}

interface UploadFile {
  file: File;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  error?: string;
  result?: any;
}

const ACCEPTED_FORMATS = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
  'application/msword': ['.doc'],
  'text/plain': ['.txt'],
  'text/markdown': ['.md'],
};

export function FileUpload({ onUploadComplete, maxFiles = 10, maxSize = 10485760 }: FileUploadProps) {
  const [files, setFiles] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadFile[] = acceptedFiles.map(file => ({
      file,
      status: 'pending',
      progress: 0,
    }));
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    onDrop,
    accept: ACCEPTED_FORMATS,
    maxFiles,
    maxSize,
    disabled: isUploading,
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAll = () => {
    setFiles([]);
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setIsUploading(true);

    try {
      const { dataApi } = await import('@/lib/api');
      
      // Update all files to uploading status
      setFiles(prev => prev.map(f => ({ ...f, status: 'uploading' as const })));

      const filesToUpload = files.map(f => f.file);
      
      const response = await dataApi.uploadFiles(filesToUpload, (progress) => {
        setFiles(prev => prev.map(f => ({ ...f, progress })));
      });

      // Update file statuses based on response
      setFiles(prev => prev.map((f, index) => {
        const result = response.results?.find((r: any) => r.filename === f.file.name);
        const error = response.errors?.find((e: any) => e.filename === f.file.name);
        
        return {
          ...f,
          status: result ? 'success' : 'error',
          progress: 100,
          error: error?.error,
          result: result,
        };
      }));

      if (onUploadComplete) {
        onUploadComplete(response);
      }
    } catch (error: any) {
      // Mark all files as error
      setFiles(prev => prev.map(f => ({
        ...f,
        status: 'error' as const,
        error: error.message || 'Upload failed',
      })));
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (file: File) => {
    return <FileText className="w-8 h-8 text-primary" />;
  };

  const getStatusIcon = (status: UploadFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-5 h-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const pendingCount = files.filter(f => f.status === 'pending').length;
  const successCount = files.filter(f => f.status === 'success').length;
  const errorCount = files.filter(f => f.status === 'error').length;

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <Card>
        <CardContent className="p-6">
          <div
            {...getRootProps()}
            className={cn(
              'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
              isDragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-primary/50',
              isUploading && 'opacity-50 cursor-not-allowed'
            )}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop files here...</p>
            ) : (
              <>
                <p className="text-lg font-medium mb-2">
                  Drag & drop files here, or click to select
                </p>
                <p className="text-sm text-muted-foreground">
                  Supports: PDF, DOCX, DOC, TXT, MD (Max {maxFiles} files, {formatFileSize(maxSize)} each)
                </p>
              </>
            )}
          </div>

          {fileRejections.length > 0 && (
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive font-medium mb-1">Some files were rejected:</p>
              <ul className="text-xs text-destructive space-y-1">
                {fileRejections.map(({ file, errors }) => (
                  <li key={file.name}>
                    {file.name}: {errors.map(e => e.message).join(', ')}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">
                Files ({files.length})
                {successCount > 0 && <span className="text-green-500 ml-2">✓ {successCount}</span>}
                {errorCount > 0 && <span className="text-red-500 ml-2">✗ {errorCount}</span>}
              </h3>
              <div className="flex gap-2">
                {pendingCount > 0 && !isUploading && (
                  <Button onClick={uploadFiles} size="sm">
                    Upload {pendingCount} {pendingCount === 1 ? 'file' : 'files'}
                  </Button>
                )}
                {!isUploading && (
                  <Button onClick={clearAll} variant="outline" size="sm">
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-3">
              {files.map((uploadFile, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-accent/5 transition-colors"
                >
                  {getFileIcon(uploadFile.file)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">
                        {uploadFile.file.name}
                      </p>
                      {getStatusIcon(uploadFile.status)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(uploadFile.file.size)}
                      {uploadFile.result && ` • ${uploadFile.result.chunkCount} chunks`}
                    </p>
                    {uploadFile.error && (
                      <p className="text-xs text-destructive mt-1">{uploadFile.error}</p>
                    )}
                    {uploadFile.status === 'uploading' && (
                      <Progress value={uploadFile.progress} className="h-1 mt-2" />
                    )}
                  </div>

                  {uploadFile.status === 'pending' && !isUploading && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeFile(index)}
                      className="shrink-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
