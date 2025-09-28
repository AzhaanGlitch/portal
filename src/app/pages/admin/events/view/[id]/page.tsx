"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CalendarIcon, ClockIcon, UserIcon, CalendarDaysIcon, Loader2, UsersIcon, ArrowLeftIcon, EditIcon, SaveIcon, XIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
  is_superadmin: boolean;
  first_name?: string;
  last_name?: string;
}

interface Event {
  id: number;
  name: string;
  date: string;
  duration: string;
  reg_end_date: string;
  description: string;
  long_description: string;
  admin: number;
  participants: number[];
  participants_usernames?: string[];
  created_at?: string;
  updated_at?: string;
}

export default function ViewEventPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<Event | null>(null);
  const [staffUsers, setStaffUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch event data and staff users
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingEvent(true);
        
        // Fetch current user
        const currentUserResponse = await api.get("/accounts/me/");
        setCurrentUser(currentUserResponse.data);
        
        // Fetch staff users
        const staffResponse = await api.get("/adminpanel/get-staffs/");
        setStaffUsers(staffResponse.data);
        
        // Fetch event data
        const eventResponse = await api.get(`/events/retrieve/${eventId}/`);
         console.log(eventResponse.data)
        setEvent(eventResponse.data);
        setFormData(eventResponse.data);
        
      } catch (err: any) {
        toast.error("Failed to load event data", {
          description: err?.response?.data?.message || "Please try again later",
        });
        router.push("/pages/admin/events");
      } finally {
        setLoadingEvent(false);
        setLoadingStaff(false);
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleAdminChange = (value: string) => {
    if (formData) {
      setFormData({ ...formData, admin: parseInt(value) });
    }
  };

  // Helper function to format date for datetime-local input
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return "";
    return dateString.slice(0, 16);
  };

  // Helper function to ensure proper datetime format for API
  const ensureDateTimeFormat = (dateString: string) => {
    if (!dateString) return "";
    if (dateString.length === 10) {
      return `${dateString}T00:00:00`;
    }
    if (dateString.length === 16) {
      return `${dateString}:00`;
    }
    return dateString;
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset form data to original event data
      setFormData(event);
      setIsEditing(false);
      toast.info("Edit cancelled", {
        description: "All changes have been reverted",
      });
    } else {
      setIsEditing(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData) return;

    // Basic validation
    if (!formData.name || !formData.date || !formData.duration || !formData.reg_end_date || !formData.description) {
      toast.error("Missing required fields", {
        description: "Please fill in all required fields marked with *",
      });
      return;
    }

    // Admin validation
    if (!formData.admin || formData.admin === 0) {
      toast.error("Admin selection required", {
        description: "Please select an admin for this event",
      });
      return;
    }

    // Prepare data with proper datetime formatting
    const submissionData = {
      ...formData,
      date: ensureDateTimeFormat(formData.date),
      duration: ensureDateTimeFormat(formData.duration),
      reg_end_date: ensureDateTimeFormat(formData.reg_end_date),
    };

    // Date validation
    const startDate = new Date(submissionData.date);
    const endDate = new Date(submissionData.duration);
    const regEndDate = new Date(submissionData.reg_end_date);

    if (regEndDate > startDate) {
      toast.warning("Invalid date selection", {
        description: "Registration end date cannot be after event start date",
      });
      return;
    }

    if (endDate <= startDate) {
      toast.warning("Invalid date selection", {
        description: "Event end date must be after start date",
      });
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Updating event...");

    try {
      const res = await api.put(`/events/update/${eventId}/`, submissionData);
      
      const selectedAdmin = staffUsers.find(user => user.id === formData.admin);
      setEvent(res.data);
      setFormData(res.data);
      setIsEditing(false);
      
      toast.success("Event updated successfully!", {
        id: toastId,
        description: `Event assigned to ${selectedAdmin?.username || 'selected admin'}`,
      });

    } catch (err: any) {
      toast.error("Failed to update event", {
        id: toastId,
        description: err?.response?.data?.message || "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    toast("Delete event?", {
      description: "This action cannot be undone. All event data will be permanently removed.",
      action: {
        label: "Delete",
        onClick: async () => {
          const toastId = toast.loading("Deleting event...");
          try {
            await api.delete(`/events/delete/${eventId}/`);
            toast.success("Event deleted successfully", {
              id: toastId,
            });
            router.push("/pages/admin/events");
          } catch (err: any) {
            toast.error("Failed to delete event", {
              id: toastId,
              description: err?.response?.data?.message || "Please try again later",
            });
          }
        },
      },
      cancel: {
        label: "Cancel",
        onClick: () => toast.dismiss(),
      },
    });
  };

  // Get display name for user
  const getUserDisplayName = (user: User) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name} (${user.username})`;
    }
    return user.username;
  };

  // Check if user is staff/superadmin
  const isUserStaff = (user: User) => {
    return user.is_staff || user.is_superadmin;
  };

  if (loadingEvent) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading event data...</p>
        </div>
      </div>
    );
  }

  if (!event || !formData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">Event not found</p>
          <Button onClick={() => router.push("/pages/admin/events")}>
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push("/pages/admin/events")}
            className="flex items-center gap-2"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Events
          </Button>
          
          <div className="flex items-center gap-3">
            <Button 
              variant={isEditing ? "outline" : "default"}
              onClick={handleEditToggle}
              disabled={loading}
              className="flex items-center gap-2"
            >
              {isEditing ? (
                <>
                  <XIcon className="h-4 w-4" />
                  Cancel
                </>
              ) : (
                <>
                  <EditIcon className="h-4 w-4" />
                  Edit Event
                </>
              )}
            </Button>
            
            {isEditing && (
              <Button 
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <SaveIcon className="h-4 w-4" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            )}
            
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={loading}
            >
              Delete Event
            </Button>
          </div>
        </div>

        <Card className="shadow-lg border-border">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CalendarDaysIcon className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {isEditing ? "Edit Event" : "View Event"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {isEditing 
                ? "Update the event details below" 
                : `Created on ${new Date(event.created_at || '').toLocaleDateString()} • ${event.participants?.length || 0} participants`
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Event Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Event Name <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter event name"
                    value={formData.name}
                    onChange={handleChange}
                    className="pl-10"
                    required
                    disabled={!isEditing || loading}
                  />
                  <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>

              {/* Admin Selection */}
              <div className="space-y-2">
                <Label htmlFor="admin" className="text-sm font-medium">
                  Event Admin <span className="text-destructive">*</span>
                </Label>
                {loadingStaff ? (
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading admin users...</span>
                  </div>
                ) : (
                  <Select 
                    value={formData.admin.toString()} 
                    onValueChange={handleAdminChange}
                    disabled={!isEditing || loading}
                  >
                    <SelectTrigger className="pl-10">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <SelectValue placeholder="Select an admin" />
                    </SelectTrigger>
                    <SelectContent>
                      {staffUsers.map((user) => (
                        <SelectItem key={user.id} value={user.id.toString()}>
                          {getUserDisplayName(user)}
                          {user.is_superadmin && " 👑"}
                          {user.is_staff && !user.is_superadmin && " ⭐"}
                          {user.id === currentUser?.id && " (You)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <p className="text-xs text-muted-foreground">
                  Current admin: {getUserDisplayName(staffUsers.find(u => u.id === formData.admin) || {} as User)}
                </p>
              </div>

              {/* Date Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Event Start Date & Time */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-sm font-medium">
                      Start Date & Time <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type="datetime-local"
                        id="date"
                        name="date"
                        value={formatDateForInput(formData.date)}
                        onChange={handleChange}
                        className="pl-10"
                        required
                        disabled={!isEditing || loading}
                      />
                      <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>

                  {/* Event End Date & Time */}
                  <div className="space-y-2">
                    <Label htmlFor="duration" className="text-sm font-medium">
                      End Date & Time <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type="datetime-local"
                        id="duration"
                        name="duration"
                        value={formatDateForInput(formData.duration)}
                        onChange={handleChange}
                        className="pl-10"
                        required
                        disabled={!isEditing || loading}
                      />
                      <ClockIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {/* Registration End Date */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reg_end_date" className="text-sm font-medium">
                      Registration End Date <span className="text-destructive">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type="datetime-local"
                        id="reg_end_date"
                        name="reg_end_date"
                        value={formData.reg_end_date}
                        onChange={handleChange}
                        className="pl-10"
                        required
                        disabled={!isEditing || loading}
                      />
                      <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Registration closes at 11:59 PM on this date
                    </p>
                  </div>

                  {/* Event Duration Display */}
                  <div className="bg-muted/50 rounded-lg p-3">
                    <Label className="text-sm font-medium mb-2 block">Event Duration</Label>
                    {formData.date && formData.duration ? (
                      <div className="text-sm text-muted-foreground">
                        <div>Starts: {new Date(formData.date).toLocaleString()}</div>
                        <div>Ends: {new Date(formData.duration).toLocaleString()}</div>
                        <div className="mt-1 text-xs">
                          Duration: {calculateDuration(formData.date, formData.duration)}
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Fill in dates to see duration</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Short Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Brief description of your event (will be shown in listings)"
                  value={formData.description}
                  onChange={handleChange}
                  className="min-h-[80px] resize-vertical"
                  required
                  disabled={!isEditing || loading}
                />
                <p className="text-xs text-muted-foreground">
                  Keep it concise - this appears in event previews
                </p>
              </div>

              {/* Long Description */}
              <div className="space-y-2">
                <Label htmlFor="long_description" className="text-sm font-medium">
                  Detailed Description
                </Label>
                <Textarea
                  id="long_description"
                  name="long_description"
                  placeholder="Comprehensive details about your event, schedule, requirements, etc."
                  value={formData.long_description}
                  onChange={handleChange}
                  className="min-h-[120px] resize-vertical"
                  disabled={!isEditing || loading}
                />
                <p className="text-xs text-muted-foreground">
                  Provide detailed information for interested participants
                </p>
              </div>

              {/* Read-only Information */}
              {!isEditing && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-primary">{event.participants?.length || 0}</p>
                    <p className="text-sm text-muted-foreground">Participants</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Created: {new Date(event.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Last Updated: {new Date(event.updated_at || event.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons when Editing */}
              {isEditing && (
                <div className="flex gap-3 pt-4 border-t">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving Changes...
                      </>
                    ) : (
                      <>
                        <SaveIcon className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleEditToggle}
                    disabled={loading}
                  >
                    <XIcon className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Helper function to calculate duration between two dates
function calculateDuration(start: string, end: string): string {
  if (!start || !end) return "";
  
  const startDate = new Date(start);
  const endDate = new Date(end);
  const diffMs = endDate.getTime() - startDate.getTime();
  
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  const parts = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  
  return parts.join(', ') || 'Less than 1 minute';
}