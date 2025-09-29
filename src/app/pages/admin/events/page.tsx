"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CalendarIcon, ClockIcon, UserIcon, PlusIcon, SearchIcon, UsersIcon, CalendarDaysIcon, ArrowRightIcon, FilterIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  admin_username?: string;
  created_at?: string;
  updated_at?: string;
}

interface EventFilters {
  search: string;
  status: "all" | "upcoming" | "ongoing" | "past" | "registration-open";
  sort: "newest" | "oldest" | "name" | "participants";
}

const EventLists = () => {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<EventFilters>({
    search: "",
    status: "all",
    sort: "newest"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6); // 2 columns × 3 rows = 6 events per page

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get("/events/admin-list/");
      setEvents(response.data);
     
    } catch (err: any) {
      toast.error("Failed to load events", {
        description: err?.response?.data?.message || "Please try again later",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter and sort events
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         event.description.toLowerCase().includes(filters.search.toLowerCase());
    
    const now = new Date();
    const startDate = new Date(event.date);
    const endDate = new Date(event.duration);
    const regEndDate = new Date(event.reg_end_date);

    const matchesStatus = (() => {
      switch (filters.status) {
        case "upcoming":
          return startDate > now;
        case "ongoing":
          return startDate <= now && endDate >= now;
        case "past":
          return endDate < now;
        case "registration-open":
          return regEndDate >= now;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    switch (filters.sort) {
      case "oldest":
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      case "name":
        return a.name.localeCompare(b.name);
      case "participants":
        return (b.participants?.length || 0) - (a.participants?.length || 0);
      default: // newest
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const getEventStatus = (event: Event) => {
    const now = new Date();
    const startDate = new Date(event.date);
    const endDate = new Date(event.duration);
    const regEndDate = new Date(event.reg_end_date);

    if (endDate < now) return "past";
    if (startDate <= now && endDate >= now) return "ongoing";
    if (regEndDate < now) return "registration-closed";
    return "upcoming";
  };

  const getStatusBadge = (event: Event) => {
    const status = getEventStatus(event);
    const variants = {
      upcoming: { label: "Upcoming", color: "bg-blue-100 text-blue-800 border-blue-200" },
      ongoing: { label: "Ongoing", color: "bg-green-100 text-green-800 border-green-200" },
      past: { label: "Completed", color: "bg-gray-100 text-gray-800 border-gray-200" },
      "registration-closed": { label: "Registration Closed", color: "bg-orange-100 text-orange-800 border-orange-200" }
    };

    return (
      <Badge variant="outline" className={`text-xs ${variants[status].color}`}>
        {variants[status].label}
      </Badge>
    );
  };

  const handleEventClick = (eventId: number) => {
    router.push(`/pages/admin/events/view/${eventId}`);
  };

  const handleCreateEvent = () => {
    router.push("/pages/admin/events/create");
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
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
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Event Management
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage and view all events in one place
            </p>
          </div>
          
          <Button 
            onClick={handleCreateEvent}
            className="bg-primary hover:bg-primary/90 flex items-center gap-2"
          >
            <PlusIcon className="h-4 w-4" />
            Create New Event
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <Card className="lg:w-80 h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FilterIcon className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Search</label>
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search events..."
                    value={filters.search}
                    onChange={(e) => {
                      setFilters({ ...filters, search: e.target.value });
                      setCurrentPage(1); // Reset to first page when searching
                    }}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value: EventFilters["status"]) => {
                    setFilters({ ...filters, status: value });
                    setCurrentPage(1); // Reset to first page when filtering
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Events</SelectItem>
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="past">Completed</SelectItem>
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
                    setCurrentPage(1); // Reset to first page when sorting
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="name">Name (A-Z)</SelectItem>
                    <SelectItem value="participants">Most Participants</SelectItem>
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
                  <h4 className="text-sm font-medium">Quick Stats</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-lg font-bold text-primary">{events.length}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
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
                      <div className="text-xs text-muted-foreground">Ongoing</div>
                    </div>
                    <div className="text-center p-2 bg-muted/50 rounded">
                      <div className="text-lg font-bold text-orange-600">
                        {events.filter(e => new Date(e.reg_end_date) >= new Date()).length}
                      </div>
                      <div className="text-xs text-muted-foreground">Reg Open</div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Content */}
          <div className="flex-1">
            {/* Events Grid */}
            {filteredEvents.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <CalendarDaysIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No events found</h3>
                  <p className="text-muted-foreground mb-4">
                    {filters.search || filters.status !== "all" 
                      ? "Try adjusting your filters to see more results." 
                      : "Get started by creating your first event."
                    }
                  </p>
                  {(filters.search || filters.status !== "all") ? (
                    <Button 
                      variant="outline" 
                      onClick={() => setFilters({ search: "", status: "all", sort: "newest" })}
                    >
                      Clear Filters
                    </Button>
                  ) : (
                    <Button onClick={handleCreateEvent}>
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Create Event
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {currentEvents.map((event) => (
                    <Card 
                      key={event.id} 
                      className="cursor-pointer transition-all hover:shadow-md hover:border-primary/50 group"
                      onClick={() => handleEventClick(event.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start mb-2">
                          {getStatusBadge(event)}
                          <Badge variant="secondary" className="text-xs">
                            {event.participants?.length || 0} participants
                          </Badge>
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
                          {event.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-2">
                          {event.description}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        {/* Event Dates */}
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CalendarIcon className="h-3 w-3" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <ClockIcon className="h-3 w-3" />
                            <span>{formatDateTime(event.date)} - {formatDateTime(event.duration)}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <UserIcon className="h-3 w-3" />
                            <span>Registers until: {formatDate(event.reg_end_date)}</span>
                          </div>
                        </div>

                        {/* Admin Info */}
                        <div className="flex items-center justify-between pt-3 border-t">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <UsersIcon className="h-3 w-3" />
                            <span className="truncate">
                              {event.admin_username || `Admin #${event.admin}`}
                            </span>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            View Details
                            <ArrowRightIcon className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeftIcon className="h-4 w-4" />
                    </Button>
                    
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      // Show pages around current page
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
                          onClick={() => paginate(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRightIcon className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventLists;