'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText, Loader2, Upload, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUpload } from '@/components/FileUpload';
import { FormatGuide } from '@/components/FormatGuide';
import { dataApi } from '@/lib/api';
import { useDataStore } from '@/lib/store';
import { toast } from 'sonner';
import type { DataItem } from '@/lib/types';

export default function DataPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DataItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('text');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    metadata: '',
  });

  const { items, totalItems, currentPage, setItems, addItem, updateItem, removeItem, setPage } = useDataStore();

  useEffect(() => {
    loadData();
  }, [currentPage]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const response = await dataApi.list(currentPage, 20);
      setItems(response.data, response.total);
    } catch (error: any) {
      toast.error('Failed to load data');
      console.error('Load data error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let metadata = undefined;
      
      // Only parse metadata if it's not empty
      if (formData.metadata.trim()) {
        try {
          metadata = JSON.parse(formData.metadata);
        } catch (jsonError) {
          toast.error('Invalid JSON in metadata field. Please use valid JSON format or leave it empty.');
          setIsLoading(false);
          return;
        }
      }
      
      if (editingItem) {
        const response = await dataApi.update(editingItem.id, {
          title: formData.title,
          content: formData.content,
          metadata,
        });
        updateItem(editingItem.id, response.data);
        toast.success('Data updated successfully');
      } else {
        const response = await dataApi.register({
          title: formData.title,
          content: formData.content,
          metadata,
        });
        addItem(response.data);
        toast.success('Data registered successfully');
      }

      setIsDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save data');
      console.error('Save data error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUploadComplete = (results: any) => {
    toast.success(`${results.uploaded} file(s) uploaded successfully!`);
    if (results.failed > 0) {
      toast.error(`${results.failed} file(s) failed to upload`);
    }
    loadData(); // Reload the data list
    setIsDialogOpen(false);
    setActiveTab('text');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this data?')) return;

    try {
      await dataApi.delete(id);
      removeItem(id);
      toast.success('Data deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete data');
      console.error('Delete data error:', error);
    }
  };

  const handleEdit = (item: DataItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content,
      metadata: item.metadata ? JSON.stringify(item.metadata, null, 2) : '',
    });
    setActiveTab('text');
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({ title: '', content: '', metadata: '' });
    setEditingItem(null);
    setActiveTab('text');
  };

  const filteredItems = items.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Data Registry</h1>
          <p className="text-muted-foreground mt-1">
            Manage your knowledge base for AI training
          </p>
        </div>
        <div className="flex gap-2">
          <FormatGuide />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm} className="gap-2">
                <Plus className="w-4 h-4" />
                Add Data
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingItem ? 'Edit Data' : 'Add New Data'}</DialogTitle>
                <DialogDescription>
                  Add content to your knowledge base manually or upload documents
                </DialogDescription>
              </DialogHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="text" disabled={!!editingItem}>
                    <FileText className="w-4 h-4 mr-2" />
                    Text Content
                  </TabsTrigger>
                  <TabsTrigger value="upload" disabled={!!editingItem}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Files
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text" className="mt-4">
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Document title"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Content</Label>
                      <Textarea
                        id="content"
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Enter your content here..."
                        rows={12}
                        required
                      />
                      <p className="text-xs text-muted-foreground">
                        Content will be automatically chunked and embedded for AI search
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="metadata">Metadata (JSON, optional)</Label>
                      <Textarea
                        id="metadata"
                        value={formData.metadata}
                        onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
                        placeholder='{"category": "documentation", "tags": ["api"]}'
                        rows={3}
                      />
                    </div>

                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsDialogOpen(false);
                          resetForm();
                        }}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          editingItem ? 'Update' : 'Register'
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </TabsContent>

                <TabsContent value="upload" className="mt-4">
                  <FileUpload onUploadComplete={handleFileUploadComplete} />
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Registered Data</CardTitle>
              <CardDescription>
                {totalItems} items in your knowledge base
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search data..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && items.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredItems.length === 0 ? (
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertDescription>
                {searchQuery
                  ? 'No data found matching your search'
                  : 'No data registered yet. Start by adding text content or uploading documents.'}
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {filteredItems.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          {item.type === 'document' && (
                            <Badge variant="secondary">Document</Badge>
                          )}
                          {item.metadata && Object.keys(item.metadata).length > 0 && (
                            <Badge variant="outline">Has metadata</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.content}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Created: {new Date(item.createdAt).toLocaleDateString()}</span>
                          <span>Updated: {new Date(item.updatedAt).toLocaleDateString()}</span>
                          {item.chunkCount !== undefined && item.chunkCount > 0 && (
                            <span>Chunks: {item.chunkCount}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
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
}
