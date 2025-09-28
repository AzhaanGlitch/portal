"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { CalendarIcon, ClockIcon, UserIcon, CalendarDaysIcon, Loader2, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";

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
  id?: number;
  name: string;
  date: string;
  duration: string;
  reg_end_date: string;
  description: string;
  long_description: string;
  admin: number;
  participants: number[];
  participants_usernames?: string[];
}

export default function CreateEventForm() {
  const [formData, setFormData] = useState<Event>({
    name: "",
    date: "",
    duration: "",
    reg_end_date: "",
    description: "",
    long_description: "",
    admin: 0, 
    participants: [],
  });

  const [staffUsers, setStaffUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStaff, setLoadingStaff] = useState(true);
  const router = useRouter();


  // Fetch current user and staff users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoadingStaff(true);
        
        // Fetch current user (assuming there's an endpoint for current user)
        const currentUserResponse = await api.get("/accounts/me/");
        setCurrentUser(currentUserResponse.data);
        
        // Set current user as default admin if they are staff/superadmin
        if (currentUserResponse.data?.is_staff || currentUserResponse.data?.is_superadmin) {
          setFormData(prev => ({ ...prev, admin: currentUserResponse.data.id }));
        }
        
        // Fetch all staff users (is_staff=1 or superadmin=1)
        const staffResponse = await api.get("/adminpanel/get-staffs/");
        setStaffUsers(staffResponse.data);
        
      } catch (err: any) {
        toast.error("Failed to load user data", {
          description: "Please refresh the page to try again",
        });
      } finally {
        setLoadingStaff(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdminChange = (value: string) => {
    setFormData({ ...formData, admin: parseInt(value) });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    const toastId = toast.loading("Creating your event...");

    try {
      const res = await api.post("/events/create/", submissionData);
      
      const selectedAdmin = staffUsers.find(user => user.id === formData.admin);
      
      toast.success("Event created successfully!", {
        id: toastId,
        description: `Event assigned to ${selectedAdmin?.username || 'selected admin'}`,
        action: {
          label: "View Event",
          onClick: () => {
            console.log("Navigate to event:", res.data.id);
          },
        },
      });
      
      
      // Reset form but keep the current user as admin if they are staff
      setFormData({
        name: "",
        date: "",
        duration: "",
        reg_end_date: "",
        description: "",
        long_description: "",
        admin: currentUser?.is_staff || currentUser?.is_superadmin ? currentUser.id : 0,
        participants: [],
      });
      router.push("/pages/admin/events");

    } catch (err: any) {
      toast.error("Failed to create event", {
        id: toastId,
        description: err?.response?.data?.message || "Please try again later",
        action: {
          label: "Retry",
          onClick: () => handleSubmit(e),
        },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    toast("Clear form?", {
      description: "This will reset all entered data",
      action: {
        label: "Reset",
        onClick: () => {
          setFormData({
            name: "",
            date: "",
            duration: "",
            reg_end_date: "",
            description: "",
            long_description: "",
            admin: currentUser?.is_staff || currentUser?.is_superadmin ? currentUser.id : 0,
            participants: [],
          });
          toast.info("Form cleared", {
            description: "All fields have been reset",
          });
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

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg border-border">
          <CardHeader className="text-center pb-1">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CalendarDaysIcon className="w-6 h-6 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Create New Event
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              Fill in the details below to create a new event for participants to join.
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
                  <Select value={formData.admin.toString()} onValueChange={handleAdminChange}>
                    <SelectTrigger className="pl-10">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                        <UsersIcon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <SelectValue placeholder="Select an admin" />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Current user option if they are staff */}
                      {currentUser && isUserStaff(currentUser) && (
                        <SelectItem value={currentUser.id.toString()}>
                          {getUserDisplayName(currentUser)} (You)
                          {currentUser.is_superadmin && " 👑"}
                          {currentUser.is_staff && !currentUser.is_superadmin && " ⭐"}
                        </SelectItem>
                      )}
                      
                      {/* Other staff users */}
                      {staffUsers
                        .filter(user => user.id !== currentUser?.id) // Exclude current user if already shown
                        .map((user) => (
                          <SelectItem key={user.id} value={user.id.toString()}>
                            {getUserDisplayName(user)}
                            {user.is_superadmin && " 👑"}
                            {user.is_staff && !user.is_superadmin && " ⭐"}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                )}
                <p className="text-xs text-muted-foreground">
                  Select the admin who will manage this event
                </p>
                
                {/* Current selection info */}
                {formData.admin > 0 && !loadingStaff && (
                  <div className="bg-muted/30 rounded-lg p-2 mt-2">
                    <p className="text-xs text-muted-foreground">
                      Selected admin:{" "}
                      <span className="font-medium">
                        {getUserDisplayName(
                          staffUsers.find(u => u.id === formData.admin) || 
                          (currentUser?.id === formData.admin ? currentUser : {} as User)
                        )}
                      </span>
                    </p>
                  </div>
                )}
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
                />
                <p className="text-xs text-muted-foreground">
                  Provide detailed information for interested participants
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button 
                  type="submit" 
                  disabled={loading || loadingStaff}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Event...
                    </>
                  ) : (
                    "Create Event"
                  )}
                </Button>
                
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={handleReset}
                  disabled={loading || loadingStaff}
                >
                  Clear Form
                </Button>
              </div>

              {/* Form Tips */}
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <InfoIcon className="h-4 w-4" />
                  Form Tips
                </h4>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Fields marked with * are required</li>
                  <li>• Only staff and superadmins can be assigned as event admins</li>
                  <li>• Registration end date should be before event start date</li>
                  <li>• Event end date must be after start date</li>
                  <li>• 👑 indicates superadmin, ⭐ indicates staff member</li>
                </ul>
              </div>
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

// Simple Info icon component
const InfoIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <circle cx="12" cy="12" r="10" strokeWidth="2"/>
    <path d="M12 16v-4" strokeWidth="2" strokeLinecap="round"/>
    <path d="M12 8h.01" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);