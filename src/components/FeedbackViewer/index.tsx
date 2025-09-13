"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, RefreshCw, Search, Star, Filter, User, Package, Calendar, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Feedback {
  id: number;
  message: string;
  rating: number;
  keywords: string;
  created_at: string;
  user: number;
  module: number;
  user_name?: string;
  module_name?: string;
}

const FeedbackViewer: React.FC = () => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [filteredFeedback, setFilteredFeedback] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<Feedback | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAllFeedback = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get<Feedback[]>("/feedback/list/");
      setFeedback(response.data);
      setFilteredFeedback(response.data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      setError("Failed to load feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!feedbackToDelete) return;
    
    try {
      await api.delete(`/feedback/delete/${feedbackToDelete.id}/`);
      setFeedback((prev) => prev.filter((f) => f.id !== feedbackToDelete.id));
      setFeedbackToDelete(null);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Error deleting feedback:", error);
      setError("Failed to delete feedback. Please try again.");
    }
  };

  const openDeleteDialog = (fb: Feedback) => {
    setFeedbackToDelete(fb);
    setDeleteDialogOpen(true);
  };

  // Filter feedback based on search query and filters
  useEffect(() => {
    let result = feedback;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(fb => 
        fb.keywords.toLowerCase().includes(query) ||
        (fb.user_name && fb.user_name.toLowerCase().includes(query)) ||
        (fb.module_name && fb.module_name.toLowerCase().includes(query))
      );
    }
    
    // Apply rating filter
    if (ratingFilter !== "all") {
      const ratingValue = parseInt(ratingFilter);
      result = result.filter(fb => fb.rating === ratingValue);
    }
    
    // Apply module filter
    if (moduleFilter !== "all") {
      result = result.filter(fb => fb.module === parseInt(moduleFilter));
    }
    
    setFilteredFeedback(result);
  }, [searchQuery, ratingFilter, moduleFilter, feedback]);

  // Get unique modules for filter
  const uniqueModules = Array.from(new Set(feedback.map(fb => fb.module)));

  // Fetch feedback when page loads
  useEffect(() => {
    fetchAllFeedback();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Feedback Management</h1>
          <p className="text-muted-foreground">View and manage all user feedback</p>
        </div>
        <Button onClick={fetchAllFeedback} className="flex items-center gap-2" variant="outline">
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} /> 
          Refresh
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>All Feedback</CardTitle>
          <CardDescription>Admin-only access to user feedback data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search feedback by message, keywords, user or module..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full md:w-[140px]">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <SelectValue placeholder="Rating" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
            <Select value={moduleFilter} onValueChange={setModuleFilter}>
              <SelectTrigger className="w-full md:w-[140px]">
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <SelectValue placeholder="Module" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modules</SelectItem>
                {uniqueModules.map(moduleId => (
                  <SelectItem key={moduleId} value={moduleId.toString()}>
                    Module {moduleId}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Keywords</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedback.map((fb) => (
                  <TableRow key={fb.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span>{fb.user_name || `User ${fb.user}`}</span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span>{fb.message}</span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{fb.message}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>{renderStars(fb.rating)}</div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Rating: {fb.rating}/5</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {fb.keywords.split(',').map((keyword, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {keyword.trim()}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {fb.module_name || `Module ${fb.module}`}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {new Date(fb.created_at).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openDeleteDialog(fb)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredFeedback.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                      {searchQuery || ratingFilter !== "all" || moduleFilter !== "all" 
                        ? "No feedback matches your filters." 
                        : "No feedback available."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredFeedback.length > 0 && (
            <div className="text-sm text-muted-foreground">
              Showing {filteredFeedback.length} of {feedback.length} feedback entries
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This will permanently delete the feedback from {feedbackToDelete?.user_name || `User ${feedbackToDelete?.user}`}. 
              This action cannot be undone.
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

export default FeedbackViewer;