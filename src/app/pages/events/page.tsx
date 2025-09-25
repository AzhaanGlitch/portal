"use client";
import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Calendar,
    MapPin,
    User,
    Users,
    Clock,
    CalendarDays,
    Navigation,
    UserCheck,
    Crown
} from "lucide-react";
import { toast } from "sonner";

type Event = {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    participants: { id: number; username: string }[];
    admin: { id: number; username: string };
};

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState<number | null>(null);

    // Fetch events
    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.get("/events/list/");
                setEvents(res.data);
            } catch (err) {
                console.error("Error fetching events", err);
                toast.error("Failed to load events");
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const handleJoin = async (eventId: number) => {
        setJoining(eventId);
        try {
            const res = await api.post(`/events/add-participant/${eventId}/`);

            if (res.data.message) {
                toast.info("You're already participating in this event");
            } else {
                toast.success("Successfully joined the event!");
            }

            // Refresh events after joining
            const res2 = await api.get("/events/list/");
            setEvents(res2.data);

        } catch (err: any) {
            console.error("Error joining event", err);
            toast.error(err.response?.data?.message || "Failed to join event");
        } finally {
            setJoining(null);
        }
    };

    const isEventUpcoming = (date: string) => {
        return new Date(date) > new Date();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        if (isToday) {
            return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }

        const isTomorrow = new Date(now.setDate(now.getDate() + 1)).toDateString() === date.toDateString();
        if (isTomorrow) {
            return `Tomorrow, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }

        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const EventSkeleton = () => (
        <Card className="shadow-lg border-0">
            <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4" />
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex gap-4">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-1/4" />
                </div>
                <Skeleton className="h-10 w-32" />
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                <Skeleton className="h-8 w-64 mb-6" />
                {[...Array(3)].map((_, i) => (
                    <EventSkeleton key={i} />
                ))}
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        Upcoming Events
                    </h1>
                    <p className="text-gray-600">Discover and join amazing events in your community</p>
                </div>

                <div className="grid gap-6">
                    {events.length === 0 ? (
                        <Card className="text-center py-12 shadow-lg border-0 bg-background">
                            <CardContent>
                                <CalendarDays className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-300 mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    No events available
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Check back later for new events!
                                </p>
                            </CardContent>
                        </Card>

                    ) : (
                        events.map((event) => (
                            <Card
                                key={event.id}
                                className="shadow-lg hover:shadow-xl transition-all duration-300 border-0 bg-card/80 backdrop-blur-sm dark:bg-gray-900/80"
                            >
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            {event.title}
                                            {!isEventUpcoming(event.date) && (
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300"
                                                >
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    Ended
                                                </Badge>
                                            )}
                                        </CardTitle>
                                        <Badge
                                            variant={isEventUpcoming(event.date) ? "default" : "outline"}
                                            className={
                                                isEventUpcoming(event.date)
                                                    ? "bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-800 dark:text-green-200 dark:hover:bg-green-700"
                                                    : "text-gray-500 dark:text-gray-400"
                                            }
                                        >
                                            <Calendar className="h-3 w-3 mr-1" />
                                            {isEventUpcoming(event.date) ? "Upcoming" : "Past"}
                                        </Badge>
                                    </div>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{event.description}</p>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            <span className="font-medium">{formatDate(event.date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-red-600 dark:text-red-400" />
                                            <span className="font-medium">{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Crown className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                                            <span>
                                                Organized by <strong>{event.admin.username}</strong>
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                                            <span>
                                                <strong>{event.participants.length}</strong> participant
                                                {event.participants.length !== 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {event.participants.slice(0, 3).map((participant) => (
                                            <Badge
                                                key={participant.id}
                                                variant="outline"
                                                className="flex items-center gap-1 dark:border-gray-600 dark:text-gray-300"
                                            >
                                                <User className="h-3 w-3" />
                                                {participant.username}
                                            </Badge>
                                        ))}
                                        {event.participants.length > 3 && (
                                            <Badge
                                                variant="outline"
                                                className="bg-blue-50 dark:bg-blue-900 dark:text-blue-200"
                                            >
                                                +{event.participants.length - 3} more
                                            </Badge>
                                        )}
                                    </div>

                                    <Button
                                        className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 dark:from-blue-700 dark:to-purple-700 dark:hover:from-blue-800 dark:hover:to-purple-800 transition-all duration-200 shadow-md"
                                        onClick={() => handleJoin(event.id)}
                                        disabled={joining === event.id || !isEventUpcoming(event.date)}
                                        size="lg"
                                    >
                                        {joining === event.id ? (
                                            <>
                                                <Clock className="h-4 w-4 mr-2 animate-spin" />
                                                Joining...
                                            </>
                                        ) : (
                                            <>
                                                <UserCheck className="h-4 w-4 mr-2" />
                                                {!isEventUpcoming(event.date) ? "Event Ended" : "Join Event"}
                                            </>
                                        )}
                                    </Button>
                                </CardContent>
                            </Card>

                        ))
                    )}
                </div>
            </div>
        </div>
    );
}