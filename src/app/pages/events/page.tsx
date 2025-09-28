"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  UserIcon, 
  UsersIcon, 
  SearchIcon, 
  FilterIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ArrowRightIcon,
  XIcon,
  MenuIcon,
  CheckCircle
} from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

type Event = {
  id: number;
  name: string;
  description: string;
  date: string;
  reg_end_date: string;
  location: string;
  participants: { id: number; username: string }[];
  admin: { id: number; username: string };
};

interface EventParticipation {
  is_participating: boolean;
}

interface EventFilters {
  search: string;
  status: "all" | "upcoming" | "ongoing" | "past" | "registration-open";
  sort: "newest" | "oldest" | "name" | "participants";
  location: string;
}

export default function EventsListPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [eventParticipations, setEventParticipations] = useState<Record<number, EventParticipation>>({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<EventFilters>({
    search: "",
    status: "all",
    sort: "newest",
    location: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/events/list/");
      const eventsData = Array.isArray(response.data) ? response.data : [];
      setEvents(eventsData);

      // Check participation for each event
      await checkEventParticipations(eventsData);
    } catch (err: any) {
      toast.error("Failed to load events", {
        description: err?.response?.data?.message || "Please try again later",
      });
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const checkEventParticipations = async (eventsData: Event[]) => {
    const participationMap: Record<number, EventParticipation> = {};
    
    for (const event of eventsData) {
      try {
        const participationResponse = await api.get<EventParticipation>(`/events/events/${event.id}/participants/me/`);
        participationMap[event.id] = participationResponse.data;
      } catch (error) {
        // If endpoint returns 404 or error, user is not participating
        participationMap[event.id] = { is_participating: false };
      }
    }
    
    setEventParticipations(participationMap);
  };

  // Safe value getter with defaults
  const getSafeString = (value: any, defaultValue: string = ""): string => {
    return value ? String(value).toLowerCase() : defaultValue;
  };

  // Safe date parser
  const getSafeDate = (dateString: any): Date => {
    try {
      return dateString ? new Date(dateString) : new Date(0);
    } catch {
      return new Date(0);
    }
  };

  // Filter and sort events with proper error handling
  const filteredEvents = events.filter(event => {
    if (!event) return false;

    const safeTitle = getSafeString(event.name);
    const safeDescription = getSafeString(event.description);
    const safeLocation = getSafeString(event.location);
    const safeSearch = getSafeString(filters.search);

    const matchesSearch = safeTitle.includes(safeSearch) ||
                         safeDescription.includes(safeSearch);
    
    const matchesLocation = filters.location === "" || 
                           safeLocation.includes(getSafeString(filters.location));
    
    const now = new Date();
    const eventDate = getSafeDate(event.date);
    const regEndDate = getSafeDate(event.reg_end_date);

    // Skip events with invalid dates
    if (isNaN(eventDate.getTime()) || isNaN(regEndDate.getTime())) {
      return false;
    }

    const matchesStatus = (() => {
      switch (filters.status) {
        case "upcoming":
          return eventDate > now;
        case "ongoing":
          // For simplicity, considering events as ongoing on their date
          const isSameDay = eventDate.toDateString() === now.toDateString();
          return isSameDay || (eventDate <= now && regEndDate >= now);
        case "past":
          return eventDate < now;
        case "registration-open":
          return regEndDate >= now;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesLocation;
  }).sort((a, b) => {
    if (!a || !b) return 0;

    const dateA = getSafeDate(a.date);
    const dateB = getSafeDate(b.date);
    const participantsA = Array.isArray(a.participants) ? a.participants.length : 0;
    const participantsB = Array.isArray(b.participants) ? b.participants.length : 0;
    const titleA = getSafeString(a.name);
    const titleB = getSafeString(b.name);

    switch (filters.sort) {
      case "oldest":
        return dateA.getTime() - dateB.getTime();
      case "name":
        return titleA.localeCompare(titleB);
      case "participants":
        return participantsB - participantsA;
      default: // newest
        return dateB.getTime() - dateA.getTime();
    }
  });

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getEventStatus = (event: Event) => {
    if (!event) return "past";

    const now = new Date();
    const eventDate = getSafeDate(event.date);
    const regEndDate = getSafeDate(event.reg_end_date);

    if (isNaN(eventDate.getTime()) || isNaN(regEndDate.getTime())) {
      return "past";
    }

    if (eventDate < now) return "past";
    
    const isSameDay = eventDate.toDateString() === now.toDateString();
    if (isSameDay || (eventDate <= now && regEndDate >= now)) return "ongoing";
    
    if (regEndDate < now) return "registration-closed";
    return "upcoming";
  };

  const getStatusBadge = (event: Event) => {
    const status = getEventStatus(event);
    const variants = {
      upcoming: { label: "Upcoming", color: "bg-blue-100 text-blue-800 border-blue-200" },
      ongoing: { label: "Happening Now", color: "bg-green-100 text-green-800 border-green-200" },
      past: { label: "Completed", color: "bg-gray-100 text-gray-800 border-gray-200" },
      "registration-closed": { label: "Registration Closed", color: "bg-orange-100 text-orange-800 border-orange-200" }
    };

    return (
      <Badge variant="outline" className={`text-xs ${variants[status]?.color || variants.past.color}`}>
        {variants[status]?.label || "Completed"}
      </Badge>
    );
  };

  const handleEventClick = (eventId: number) => {
    router.push(`/pages/events/${eventId}/`);
  };

  const handleRegisterClick = (eventId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/pages/events/${eventId}/`);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return "Invalid Date";
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Invalid Time";
    }
  };

  const getSafeParticipantCount = (event: Event) => {
    return Array.isArray(event.participants) ? event.participants.length : 0;
  };

  const getSafeAdminName = (event: Event) => {
    return event?.admin?.username || "Unknown Organizer";
  };

  const getSafeLocation = (event: Event) => {
    return event?.location || "Online";
  };

  // Check if user is registered for an event
  const isUserRegistered = (eventId: number): boolean => {
    return eventParticipations[eventId]?.is_participating || false;
  };

  // Check if registration is open for an event
  const canRegister = (event: Event): boolean => {
    try {
      return new Date(event.reg_end_date) >= new Date();
    } catch {
      return false;
    }
  };

  // Filter component to avoid duplication
  const FilterContent = () => (
    <div className="space-y-4">
      {/* Search Input */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Search Events</label>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or description..."
            value={filters.search}
            onChange={(e) => {
              setFilters({ ...filters, search: e.target.value });
              setCurrentPage(1);
            }}
            className="pl-10"
          />
        </div>
      </div>

      {/* Location Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Location</label>
        <Input
          placeholder="Filter by location..."
          value={filters.location}
          onChange={(e) => {
            setFilters({ ...filters, location: e.target.value });
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Status Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Event Status</label>
        <Select
          value={filters.status}
          onValueChange={(value: EventFilters["status"]) => {
            setFilters({ ...filters, status: value });
            setCurrentPage(1);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Events</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="ongoing">Happening Now</SelectItem>
            <SelectItem value="past">Past Events</SelectItem>
            <SelectItem value="registration-open">Registration Open</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Sort Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Sort By</label>
        <Select
          value={filters.sort}
          onValueChange={(value: EventFilters["sort"]) => {
            setFilters({ ...filters, sort: value });
            setCurrentPage(1);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="name">Title (A-Z)</SelectItem>
            <SelectItem value="participants">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results Count */}
      <div className="pt-4 border-t">
        <div className="text-sm text-muted-foreground">
          Showing {currentEvents.length} of {filteredEvents.length} events
        </div>
        <div className="text-xs text-muted-foreground mt-1">
          Page {currentPage} of {totalPages}
        </div>
      </div>

      {/* Quick Stats */}
      {events.length > 0 && (
        <div className="space-y-3 pt-4 border-t">
          <h4 className="text-sm font-medium">Event Statistics</h4>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-lg font-bold text-primary">{events.length}</div>
              <div className="text-xs text-muted-foreground">Total Events</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-lg font-bold text-blue-600">
                {events.filter(e => getEventStatus(e) === 'upcoming').length}
              </div>
              <div className="text-xs text-muted-foreground">Upcoming</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-lg font-bold text-green-600">
                {events.filter(e => getEventStatus(e) === 'ongoing').length}
              </div>
              <div className="text-xs text-muted-foreground">Happening Now</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded">
              <div className="text-lg font-bold text-orange-600">
                {events.filter(e => {
                  try {
                    return new Date(e.reg_end_date) >= new Date();
                  } catch {
                    return false;
                  }
                }).length}
              </div>
              <div className="text-xs text-muted-foreground">Registration Open</div>
            </div>
          </div>
        </div>
      )}

      {/* Clear Filters */}
      {(filters.search || filters.status !== "all" || filters.location) && (
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2"
          onClick={() => {
            setFilters({ search: "", status: "all", sort: "newest", location: "" });
            setCurrentPage(1);
          }}
        >
          Clear All Filters
        </Button>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-4">
            Upcoming Events
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Discover and join amazing events in your community. Register now to secure your spot!
          </p>
        </div>

        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <Sheet open={isMobileFiltersOpen} onOpenChange={setIsMobileFiltersOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" className="w-full justify-start gap-2">
                <FilterIcon className="h-4 w-4" />
                Filters & Search
                {(filters.search || filters.status !== "all" || filters.location) && (
                  <Badge variant="secondary" className="ml-auto">
                    Active
                  </Badge>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] sm:w-[400px] overflow-y-auto px-4">
              <SheetHeader className="text-left">
                <SheetTitle className="flex items-center gap-2">
                  <FilterIcon className="h-5 w-5" />
                  Find Events
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6">
                <FilterContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filters Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:w-80">
            <Card className="h-fit sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FilterIcon className="h-5 w-5" />
                  Find Events
                </CardTitle>
                <CardDescription>
                  Filter events by your preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FilterContent />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Active Filters Display - Mobile */}
            <div className="lg:hidden mb-6">
              <div className="flex flex-wrap gap-2 items-center">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {filters.search && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Search: {filters.search}
                    <XIcon 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setFilters({ ...filters, search: "" })}
                    />
                  </Badge>
                )}
                {filters.status !== "all" && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Status: {filters.status}
                    <XIcon 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setFilters({ ...filters, status: "all" })}
                    />
                  </Badge>
                )}
                {filters.location && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    Location: {filters.location}
                    <XIcon 
                      className="h-3 w-3 cursor-pointer" 
                      onClick={() => setFilters({ ...filters, location: "" })}
                    />
                  </Badge>
                )}
                {(filters.search || filters.status !== "all" || filters.location) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs"
                    onClick={() => setFilters({ search: "", status: "all", sort: "newest", location: "" })}
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>

            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
              <Card>
                <CardContent className="text-center py-16">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <CalendarIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No events found</h3>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    {filters.search || filters.status !== "all" || filters.location
                      ? "No events match your current filters. Try adjusting your search criteria." 
                      : "There are no events available at the moment. Please check back later!"
                    }
                  </p>
                  {(filters.search || filters.status !== "all" || filters.location) ? (
                    <Button 
                      variant="default" 
                      onClick={() => setFilters({ search: "", status: "all", sort: "newest", location: "" })}
                    >
                      Clear Filters
                    </Button>
                  ) : (
                    <Button variant="outline" onClick={fetchEvents}>
                      Refresh Events
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {currentEvents.map((event) => {
                    if (!event) return null;

                    const userRegistered = isUserRegistered(event.id);
                    const registrationOpen = canRegister(event);

                    return (
                      <Card 
                        key={event.id} 
                        className="cursor-pointer transition-all hover:shadow-lg hover:border-primary/30 group border-2"
                        onClick={() => handleEventClick(event.id)}
                      >
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start mb-3">
                            {getStatusBadge(event)}
                            <Badge variant="secondary" className="text-xs">
                              <UsersIcon className="h-3 w-3 mr-1" />
                              {getSafeParticipantCount(event)} participants
                            </Badge>
                          </div>
                          <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-2 mb-2">
                            {event.name || "Untitled Event"}
                          </CardTitle>
                          <CardDescription className="line-clamp-3">
                            {event.description || "No description available."}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          {/* Event Details */}
                          <div className="space-y-3 mb-4">
                            <div className="flex items-center gap-2 text-sm">
                              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="font-medium">{formatDate(event.date)}</span>
                              <span className="text-muted-foreground">at {formatTime(event.date)}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm">
                              <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">{getSafeLocation(event)}</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm">
                              <ClockIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Register by: {formatDate(event.reg_end_date)}
                              </span>
                            </div>
                          </div>

                          {/* Event Footer */}
                          <div className="flex items-center justify-between pt-4 border-t">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <UserIcon className="h-4 w-4" />
                              <span className="truncate">By {getSafeAdminName(event)}</span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {userRegistered ? (
                                <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Registered
                                </Badge>
                              ) : registrationOpen ? (
                                <Button 
                                  size="sm"
                                  onClick={(e) => handleRegisterClick(event.id, e)}
                                  className="bg-primary hover:bg-primary/90"
                                >
                                  Register Now
                                </Button>
                              ) : (
                                <Badge variant="outline" className="text-orange-600">
                                  Registration Closed
                                </Badge>
                              )}
                              
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                Details
                                <ArrowRightIcon className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                    <div className="text-sm text-muted-foreground">
                      Showing {indexOfFirstEvent + 1}-{Math.min(indexOfLastEvent, filteredEvents.length)} of {filteredEvents.length} events
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeftIcon className="h-4 w-4" />
                        Previous
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }

                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="sm"
                              className="w-8 h-8 p-0"
                              onClick={() => paginate(pageNum)}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}