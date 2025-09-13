'use client';
import React, { useState, useEffect, ChangeEvent, useRef } from 'react';
import api from '@/lib/api';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Trash2, Upload, File, Image, Video, FileText, Search, Grid, List, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface MediaFile {
  id: number;
  file: string; // backend should return file URL
  media_type: string;
  created_at: string;
  file_name?: string;
  file_size?: number;
}

const MediaManager: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [mediaType, setMediaType] = useState<string>('image');
  const [mediaList, setMediaList] = useState<MediaFile[]>([]);
  const [filteredMediaList, setFilteredMediaList] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<MediaFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch current user's media
  const fetchMedia = async () => {
    try {
      const res = await api.get('/media/list/');
      setMediaList(res.data);
      setFilteredMediaList(res.data);
    } catch (err) {
      console.error('Error fetching media:', err);
      setError('Failed to load media. Please try again.');
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  // Filter media based on search query
  useEffect(() => {
    if (!searchQuery) {
      setFilteredMediaList(mediaList);
    } else {
      const filtered = mediaList.filter(media => 
        media.file.toLowerCase().includes(searchQuery.toLowerCase()) ||
        media.media_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (media.file_name && media.file_name.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredMediaList(filtered);
    }
  }, [searchQuery, mediaList]);

  // Upload file
  const handleUpload = async () => {
    if (!file || !mediaType) return;
    setLoading(true);
    setUploadProgress(0);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('media_type', mediaType);

    try {
      await api.post('/media/upload/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
          }
        },
      });
      setFile(null);
      setMediaType('image');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchMedia();
    } catch (error) {
      console.error('Error uploading file:', error);
      setError('Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // Delete media
  const handleDelete = async () => {
    if (!mediaToDelete) return;
    
    try {
      await api.delete(`/media/delete/${mediaToDelete.id}/`);
      setMediaList((prev) => prev.filter((m) => m.id !== mediaToDelete.id));
      setMediaToDelete(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting media:', error);
      setError('Failed to delete media. Please try again.');
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      // Validate file size (max 10MB)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const openDeleteDialog = (media: MediaFile) => {
    setMediaToDelete(media);
    setDeleteDialogOpen(true);
  };

  const formatFileSize = (bytes: number | undefined): string => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image': return <Image className="h-5 w-5" />;
      case 'video': return <Video className="h-5 w-5" />;
      case 'document': return <FileText className="h-5 w-5" />;
      default: return <File className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Media Manager</h1>
          <p className="text-muted-foreground">Upload and manage your media files</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={viewMode === 'grid' ? 'default' : 'outline'} 
            size="icon"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button 
            variant={viewMode === 'list' ? 'default' : 'outline'} 
            size="icon"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Upload New Media</CardTitle>
          <CardDescription>Select a file and choose its media type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <Input 
              type="file" 
              onChange={handleFileChange} 
              ref={fileInputRef}
              className="flex-1"
            />
            <Select value={mediaType} onValueChange={setMediaType}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="document">Document</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleUpload}
              disabled={!file || loading}
              className="flex items-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Upload
            </Button>
          </div>
          
          {file && (
            <div className="flex items-center gap-2 text-sm">
              {getMediaIcon(mediaType)}
              <span className="truncate">{file.name}</span>
              <span className="text-muted-foreground">({formatFileSize(file.size)})</span>
            </div>
          )}
          
          {loading && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-xs text-muted-foreground">Uploading... {uploadProgress}%</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>Your Media Files</CardTitle>
            <CardDescription>
              {filteredMediaList.length} {filteredMediaList.length === 1 ? 'item' : 'items'}
            </CardDescription>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search media..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'list' ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMediaList.map((media) => (
                  <TableRow key={media.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getMediaIcon(media.media_type)}
                        <a
                          href={media.file}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium hover:underline"
                        >
                          {media.file_name || media.file.split('/').pop()}
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {media.media_type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatFileSize(media.file_size)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(media.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="icon"
                                asChild
                              >
                                <a href={media.file} download>
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Download</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="destructive"
                                size="icon"
                                onClick={() => openDeleteDialog(media)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredMediaList.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                      {searchQuery ? 'No media found.' : 'No media uploaded yet.'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredMediaList.map((media) => (
                <Card key={media.id} className="overflow-hidden">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    {media.media_type === 'image' ? (
                      <img 
                        src={media.file} 
                        alt={media.file_name || ''}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="p-4">
                        {getMediaIcon(media.media_type)}
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="truncate text-sm font-medium mb-1">
                      {media.file_name || media.file.split('/').pop()}
                    </div>
                    <div className="flex justify-between items-center">
                      <Badge variant="outline" className="capitalize">
                        {media.media_type}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" asChild>
                          <a href={media.file} download>
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => openDeleteDialog(media)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              {filteredMediaList.length === 0 && (
                <div className="col-span-full text-center py-12 text-muted-foreground">
                  {searchQuery ? 'No media found.' : 'No media uploaded yet.'}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the media file. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MediaManager;