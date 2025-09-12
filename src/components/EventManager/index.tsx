"use client";
import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { X } from "lucide-react";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";

interface Event {
    id?: number;
    name: string;
    date: string;
    duration: string;
    description: string;
    long_description: string;
    admin: number;
    participants: number[];
    participants_usernames?: string[];
}

const EventManager = () => {
    const [eventData, setEventData] = useState({
        name: "",
        date: "",
        duration: "",
        description: "",
        long_description: "",
    });

    const [events, setEvents] = useState<Event[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
    const [participantId, setParticipantId] = useState<number | "">("");
    const [errors, setErrors] = useState({
        name: "",
        date: "",
        duration: "",
        description: "",
        long_description: "",
    });

    const fetchEvents = async () => {
        try {
            const response = await api.get("/events/list/");
            setEvents(response.data);
        } catch (error) {
            console.error("Failed to fetch events:", error);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const resetForm = () => {
        setEventData({
            name: "",
            date: "",
            duration: "",
            description: "",
            long_description: "",
        });
        setErrors({
            name: "",
            date: "",
            duration: "",
            description: "",
            long_description: "",
        });
    };

    const validateForm = () => {
        const newErrors = {
            name: "",
            date: "",
            duration: "",
            description: "",
            long_description: "",
        };
        let isValid = true;

        if (!eventData.name) {
            newErrors.name = "Event name is required.";
            isValid = false;
        }
        if (!eventData.date) {
            newErrors.date = "Date is required.";
            isValid = false;
        }
        if (!eventData.duration) {
            newErrors.duration = "Duration is required.";
            isValid = false;
        }
        if (!eventData.description) {
            newErrors.description = "Short description is required.";
            isValid = false;
        }
        if (!eventData.long_description) {
            newErrors.long_description = "Long description is required.";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };


    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setEventData({ ...eventData, [name]: value });
        if (errors[name as keyof typeof errors]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleCreateEvent = async () => {
        if (!validateForm()) return;

        try {
            const response = await api.post("/events/create/", eventData);
            alert(`Event "${response.data.name}" created successfully!`);
            resetForm();
            fetchEvents();
        } catch (error) {
            console.error("Error creating event:", error);
            alert("Failed to create event.");
        }
    };

    const handleUpdateEvent = async () => {
        if (!selectedEventId || !validateForm()) return;

        try {
            const response = await api.patch(
                `/events/update/${selectedEventId}/`,
                eventData
            );
            alert(`Event updated to "${response.data.name}"`);
            resetForm();
            setSelectedEventId(null);
            setIsEditing(false);
            fetchEvents();
        } catch (error) {
            console.error("Error updating event:", error);
            alert("Failed to update event.");
        }
    };

    const handleEditClick = (event: Event) => {
        setIsEditing(true);
        setSelectedEventId(event.id ?? null);
        setEventData({
            name: event.name,
            date: event.date.slice(0, 16),
            duration: event.duration,
            description: event.description,
            long_description: event.long_description,
        });
    };

    const handleCancelUpdate = () => {
        setIsEditing(false);
        setSelectedEventId(null);
        resetForm();
    };


    const handleDeleteEvent = async (id: number) => {
        try {
            await api.delete(`/events/delete/${id}/`);
            alert("Event deleted successfully!");
            fetchEvents();
        } catch (error) {
            console.error("Error deleting event:", error);
            alert("Failed to delete event.");
        }
    };

    const handleAddParticipant = async () => {
        if (!selectedEventId || !participantId) return;
        try {
            await api.post(`/events/${selectedEventId}/add-participant/`, {
                user_id: participantId,
            });
            alert("Participant added successfully!");
            setParticipantId("");
            fetchEvents();
        } catch (error) {
            console.error("Error adding participant:", error);
            alert("Failed to add participant.");
        }
    };

    return (
        <div className="p-6 space-y-6 text-white">
            <Card className="max-w-md ">
                <CardHeader>
                    <CardTitle>{isEditing ? "Update Event" : "Create Event"}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Input
                        type="text"
                        name="name"
                        className="border-gray-700"
                        value={eventData.name}
                        onChange={handleChange}
                        placeholder="Event Name"
                    />
                    {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                    <Input
                        type="datetime-local"
                        name="date"
                        value={eventData.date}
                        onChange={handleChange}
                    />
                    {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
                    <Input
                        type="text"
                        name="duration"
                        value={eventData.duration}
                        onChange={handleChange}
                        placeholder="Duration (HH:MM:SS)"
                    />
                    {errors.duration && <p className="text-red-500 text-xs">{errors.duration}</p>}
                    <Input
                        type="text"
                        name="description"
                        value={eventData.description}
                        onChange={handleChange}
                        placeholder="Short Description"
                    />
                    {errors.description && <p className="text-red-500 text-xs">{errors.description}</p>}
                    <Textarea
                        name="long_description"
                        value={eventData.long_description}
                        onChange={handleChange}
                        placeholder="Long Description"
                    />
                    {errors.long_description && <p className="text-red-500 text-xs">{errors.long_description}</p>}
                    {isEditing ? (
                        <div className="flex space-x-2">
                            <Button onClick={handleUpdateEvent}>Update Event</Button>
                            <Button
                                variant="destructive"
                                onClick={handleCancelUpdate}
                                >
                                <X className="h-4 w-4" />
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button onClick={handleCreateEvent}>Create Event</Button>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>All Events</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    {events.map((event) => (
                        <div
                            key={event.id}
                            className="flex items-center justify-between border p-2 rounded-md border-gray-700"
                        >
                            <span>
                                {event.name} –{" "}
                                {new Date(event.date).toLocaleString()} (Participants:{" "}
                                {event.participants.length})
                            </span>
                            <div className="space-x-2">
                                <Button
                                    size="sm"
                                    variant="secondary"
                                    onClick={() => handleEditClick(event)}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                        event.id !== undefined && handleDeleteEvent(event.id)
                                    }
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
};

export default EventManager;