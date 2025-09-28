"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, ClockIcon, MapPinIcon, UserIcon, UsersIcon, ArrowLeftIcon, ShareIcon, CalendarDaysIcon, UserCheckIcon, AlertCircleIcon } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Event = {
  id: number;
  title: string;
  description: string;
  long_description: string;
  date: string;
  reg_end_date: string;
  location: string;
  participants: { id: number; username: string }[];
  admin: { id: number; username: string };
  created_at?: string;
  updated_at?: string;
};

export default function EventDetailPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isParticipating, setIsParticipating] = useState(false);

  // Fetch event details
  useEffect(() => {
    if (eventId) {
      fetchEvent();
      checkParticipation();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/events/retrieve/${eventId}/`);
      setEvent(response.data);
    } catch (err: any) {
      toast.error("Failed to load event", {
        description: err?.response?.data?.message || "Please try again later",
      });
      router.push("/pages/events");
    } finally {
      setLoading(false);
    }
  };

  const checkParticipation = async () => {
    try {
      // Replace with your actual API endpoint to check participation
      const response = await api.get(`/events/${eventId}/participants/me/`);
      setIsParticipating(response.data.is_participating || false);
    } catch (err) {
      setIsParticipating(false);
    }
  };

  const handleRegister = async () => {
    if (!event) return;

    try {
      setIsRegistering(true);
      await api.post(`/events/add-participant/${eventId}/`);
      setIsParticipating(true);
      toast.success("Successfully registered for the event!");
      
      // Refresh event data to get updated participant count
      fetchEvent();
    } catch (err: any) {
      toast.error("Registration failed", {
        description: err?.response?.data?.message || "Please try again later",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleUnregister = async () => {
    if (!event) return;

    try {
      setIsRegistering(true);
      await api.delete(`/events/${eventId}/unregister/`);
      setIsParticipating(false);
      toast.success("Successfully unregistered from the event!");
      
      // Refresh event data to get updated participant count
      fetchEvent();
    } catch (err: any) {
      toast.error("Unregistration failed", {
        description: err?.response?.data?.message || "Please try again later",
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const handleShare = async () => {
    if (!event) return;

    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: url,
        });
      } catch (err) {
        // User cancelled the share
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast.success("Event link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link");
      }
    }
  };

  const getEventStatus = () => {
    if (!event) return "past";

    const now = new Date();
    const eventDate = new Date(event.date);
    const regEndDate = new Date(event.reg_end_date);

    if (eventDate < now) return "past";
    
    const isSameDay = eventDate.toDateString() === now.toDateString();
    if (isSameDay) return "ongoing";
    
    if (regEndDate < now) return "registration-closed";
    return "upcoming";
  };

  const getStatusBadge = () => {
    const status = getEventStatus();
    const variants = {
      upcoming: { label: "Upcoming", color: "bg-blue-100 text-blue-800 border-blue-200" },
      ongoing: { label: "Happening Now", color: "bg-green-100 text-green-800 border-green-200" },
      past: { label: "Completed", color: "bg-gray-100 text-gray-800 border-gray-200" },
      "registration-closed": { label: "Registration Closed", color: "bg-orange-100 text-orange-800 border-orange-200" }
    };

    return (
      <Badge variant="outline" className={`text-lg px-3 py-1 ${variants[status]?.color || variants.past.color}`}>
        {variants[status]?.label || "Completed"}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canRegister = () => {
    if (!event) return false;
    const status = getEventStatus();
    return status === "upcoming" && !isParticipating;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading event details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Card>
            <CardContent className="text-center py-16">
              <AlertCircleIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Event Not Found</h3>
              <p className="text-muted-foreground mb-6">
                The event you're looking for doesn't exist or may have been removed.
              </p>
              <Button onClick={() => router.push("/pages/events")}>
                <ArrowLeftIcon className="h-4 w-4 mr-2" />
                Back to Events
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push("/pages/events")}
          className="mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Back to Events
        </Button>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Important Information */}
          <div className="lg:col-span-1 space-y-6">
            {/* Event Status Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarDaysIcon className="h-5 w-5" />
                  Event Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Status:</span>
                  {getStatusBadge()}
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Registration:</span>
                  <span className={`text-sm font-medium ${
                    getEventStatus() === "registration-closed" ? "text-red-600" : "text-green-600"
                  }`}>
                    {getEventStatus() === "registration-closed" ? "Closed" : "Open"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Participants:</span>
                  <span className="text-sm font-medium">
                    {event.participants.length}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Event Details Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Event Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CalendarDaysIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Date</div>
                    <div className="text-sm text-muted-foreground">{formatDate(event.date)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <ClockIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Time</div>
                    <div className="text-sm text-muted-foreground">{formatTime(event.date)}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Location</div>
                    <div className="text-sm text-muted-foreground">{event.location || "Online"}</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <UserIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Organizer</div>
                    <div className="text-sm text-muted-foreground">{event.admin.username}</div>
                  </div>
                </div>

                {/* Registration Deadline */}
                <div className="pt-3 border-t">
                  <div className="flex items-center gap-2 text-sm">
                    <ClockIcon className="h-4 w-4 text-orange-600" />
                    <div>
                      <div className="font-medium text-orange-800">Registration Deadline</div>
                      <div className="text-orange-700">{formatDateTime(event.reg_end_date)}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={handleShare}
                >
                  <ShareIcon className="h-4 w-4 mr-2" />
                  Share Event
                </Button>
                
                {canRegister() && (
                  <Button 
                    className="w-full justify-start bg-primary hover:bg-primary/90"
                    onClick={handleRegister}
                    disabled={isRegistering}
                  >
                    <UserCheckIcon className="h-4 w-4 mr-2" />
                    {isRegistering ? "Registering..." : "Register Now"}
                  </Button>
                )}
                
                {isParticipating && (
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleUnregister}
                    disabled={isRegistering}
                  >
                    <UserCheckIcon className="h-4 w-4 mr-2" />
                    {isRegistering ? "Unregistering..." : "Unregister"}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Event Timeline */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Event Timeline</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-sm">Registration Opens</div>
                    <div className="text-xs text-muted-foreground">When event was created</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-sm">Registration Closes</div>
                    <div className="text-xs text-muted-foreground">{formatDateTime(event.reg_end_date)}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <div className="font-medium text-sm">Event Date</div>
                    <div className="text-xs text-muted-foreground">{formatDateTime(event.date)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Section */}
          <div className="lg:col-span-3">
            {/* Event Header */}
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getStatusBadge()}
                      <Badge variant="secondary" className="text-sm">
                        <UsersIcon className="h-3 w-3 mr-1" />
                        {event.participants.length} participants
                      </Badge>
                    </div>
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">{event.title}</h1>
                    <p className="text-lg text-muted-foreground">{event.description}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleShare}>
                      <ShareIcon className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    {canRegister() && (
                      <Button 
                        onClick={handleRegister}
                        disabled={isRegistering}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isRegistering ? "Registering..." : "Register Now"}
                      </Button>
                    )}
                    {isParticipating && (
                      <Button 
                        variant="outline" 
                        onClick={handleUnregister}
                        disabled={isRegistering}
                        className="border-green-200 text-green-700 hover:bg-green-50"
                      >
                        <UserCheckIcon className="h-4 w-4 mr-2" />
                        {isRegistering ? "Unregistering..." : "Registered"}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Markdown Description - Full Width */}
            <Card>
              <CardHeader>
                <CardTitle>Event Details</CardTitle>
                <CardDescription>
                  Complete information about this event
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none min-h-[400px]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {event.long_description || event.description || "*No detailed description available.*"}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}