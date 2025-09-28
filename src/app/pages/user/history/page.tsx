'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
    Calendar, 
    Clock, 
    AlertCircle, 
    CheckCircle, 
    XCircle, 
    Package, 
    Users, 
    IndianRupee,
    Download,
    Eye,
    FileText,
    MapPin,
    User
} from 'lucide-react';

interface ServiceRequest {
    id: number;
    service: {
        id: number;
        name: string;
        description: string;
    };
    plan: {
        plan: string;
        cost: number;
        discount: number;
        description?: string;
    };
    status: 'PENDING' | 'APPROVED' | 'IN_QUEUE' | 'REJECTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
    request_msg: {
        subject: string;
        body: string;
    };
    media_url: string | null;
    remark: string | null;
    requested_at: string;
    updated_at: string;
}

interface Event {
    id: number;
    name: string;
    date: string;
    duration: string;
    description: string;
    long_description: string;
    media: string | null;
    media_url: string;
    participants: number[];
    participants_usernames: string[];
    admin: number;
    reg_end_date: string;
}

interface EventParticipation {
    is_participating: boolean;
}

const HistoryPage: React.FC = () => {
    const { isAuthenticated, user } = useAuth();
    const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [eventParticipations, setEventParticipations] = useState<Record<number, EventParticipation>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('services');

    useEffect(() => {
        if (isAuthenticated) {
            fetchHistory();
        }
    }, [isAuthenticated]);

    const fetchHistory = async () => {
        try {
            setLoading(true);
            
            // Fetch service requests
            const serviceResponse = await api.get<ServiceRequest[]>('/services/requests/my-requests/');
            setServiceRequests(serviceResponse.data);

            // Fetch events and check participation
            await fetchEventsWithParticipation();

            setError('');
        } catch (err: any) {
            setError(err.response?.data?.error || err.message || 'Failed to load history.');
        } finally {
            setLoading(false);
        }
    };

    const fetchEventsWithParticipation = async () => {
        try {
            // First, get list of events where user is participating
            const participatingEvents: Event[] = [];
            const participationMap: Record<number, EventParticipation> = {};
            
            // Get all events and check participation for each
            const eventsListResponse = await api.get<Event[]>('/events/list/');
            const allEvents = eventsListResponse.data;
            
            for (const event of allEvents) {
                try {
                    // Check if user is participating in this event
                    const participationResponse = await api.get<EventParticipation>(`/events/events/${event.id}/participants/me/`);
                    
                    if (participationResponse.data.is_participating) {
                        // Fetch detailed event information
                        const eventDetailResponse = await api.get<Event>(`/events/retrieve/${event.id}/`);
                        participatingEvents.push(eventDetailResponse.data);
                        participationMap[event.id] = participationResponse.data;
                    }
                } catch (error) {
                    console.log(`User is not participating in event ${event.id} or event not found`);
                }
            }
            
            setEvents(participatingEvents);
            setEventParticipations(participationMap);
            console.log('Participating events:', participatingEvents);
            console.log('Participation map:', participationMap);
            
        } catch (error) {
            console.error('Error fetching events:', error);
            setEvents([]);
            setEventParticipations({});
        }
    };

    // Get events where user is participating
    const getParticipatingEvents = (): Event[] => {
        return events.filter(event => eventParticipations[event.id]?.is_participating);
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            PENDING: { variant: 'secondary' as const, label: 'Pending', color: 'text-yellow-600 bg-yellow-100' },
            APPROVED: { variant: 'default' as const, label: 'Approved', color: 'text-green-600 bg-green-100' },
            IN_QUEUE: { variant: 'secondary' as const, label: 'In Queue', color: 'text-blue-600 bg-blue-100' },
            IN_PROGRESS: { variant: 'default' as const, label: 'In Progress', color: 'text-blue-600 bg-blue-100' },
            COMPLETED: { variant: 'default' as const, label: 'Completed', color: 'text-green-600 bg-green-100' },
            REJECTED: { variant: 'destructive' as const, label: 'Rejected', color: 'text-red-600 bg-red-100' },
            CANCELLED: { variant: 'destructive' as const, label: 'Cancelled', color: 'text-red-600 bg-red-100' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary', label: status, color: 'text-gray-600 bg-gray-100' };
        return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>;
    };

    const getEventStatus = (event: Event): string => {
        const now = new Date();
        const eventDate = new Date(event.date);
        const regEndDate = new Date(event.reg_end_date);
        
        if (now > eventDate) return 'COMPLETED';
        if (now > regEndDate) return 'REGISTRATION_CLOSED';
        if (now >= new Date(eventDate.getTime() - 24 * 60 * 60 * 1000)) return 'UPCOMING_SOON';
        return 'UPCOMING';
    };

    const getEventStatusBadge = (event: Event) => {
        const status = getEventStatus(event);
        const statusConfig = {
            COMPLETED: { variant: 'default' as const, label: 'Completed', color: 'text-gray-600 bg-gray-100' },
            REGISTRATION_CLOSED: { variant: 'secondary' as const, label: 'Registration Closed', color: 'text-orange-600 bg-orange-100' },
            UPCOMING_SOON: { variant: 'default' as const, label: 'Upcoming Soon', color: 'text-blue-600 bg-blue-100' },
            UPCOMING: { variant: 'secondary' as const, label: 'Upcoming', color: 'text-green-600 bg-green-100' },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || { variant: 'secondary', label: status, color: 'text-gray-600 bg-gray-100' };
        return <Badge variant={config.variant} className={config.color}>{config.label}</Badge>;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatEventDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const downloadPDFReceipt = async (request: ServiceRequest) => {
        try {
            // Generate PDF content
            const { jsPDF } = await import('jspdf');
            
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            
            // Add header
            doc.setFontSize(20);
            doc.setTextColor(41, 128, 185);
            doc.text('I2EDC SERVICES', pageWidth / 2, 20, { align: 'center' });
            
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text('SERVICE REQUEST RECEIPT', pageWidth / 2, 30, { align: 'center' });
            
            // Add receipt details
            doc.setFontSize(10);
            let yPosition = 50;
            
            const details = [
                `Receipt ID: SR-${request.id}`,
                `Date: ${formatDate(request.requested_at)}`,
                `Status: ${request.status}`,
                '',
                `Service: ${request.service.name}`,
                `Plan: ${request.plan.plan}`,
                `Original Cost: ₹${request.plan.cost}`,
                `Discount: ${request.plan.discount}%`,
                `Final Amount: ₹${request.plan.cost * (1 - request.plan.discount / 100)}`,
                '',
                `Subject: ${request.request_msg.subject}`,
                'Description:',
            ];
            
            details.forEach(line => {
                if (yPosition > pageHeight - 50) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(line, 20, yPosition);
                yPosition += 6;
            });
            
            // Add description with word wrap
            const descriptionLines = doc.splitTextToSize(request.request_msg.body, pageWidth - 40);
            descriptionLines.forEach((line: string) => {
                if (yPosition > pageHeight - 50) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(line, 20, yPosition);
                yPosition += 6;
            });
            
            // Add footer
            yPosition += 10;
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text('Thank you for choosing I2EDC Services. For any queries, contact us at support@i2edc.com', 
                    pageWidth / 2, pageHeight - 10, { align: 'center' });
            
            // Save the PDF
            doc.save(`receipt-${request.id}.pdf`);
            
        } catch (error) {
            console.error('Error generating PDF:', error);
            // Fallback to text download
            downloadTextReceipt(request);
        }
    };

    const downloadTextReceipt = (request: ServiceRequest) => {
        const receiptContent = `
I2EDC SERVICES - SERVICE REQUEST RECEIPT
=========================================

Receipt ID: SR-${request.id}
Date: ${formatDate(request.requested_at)}
Status: ${request.status}

SERVICE DETAILS:
----------------
Service: ${request.service.name}
Plan: ${request.plan.plan}
Original Cost: ₹${request.plan.cost}
Discount: ${request.plan.discount}%
Final Amount: ₹${request.plan.cost * (1 - request.plan.discount / 100)}

REQUEST DETAILS:
----------------
Subject: ${request.request_msg.subject}
Description: ${request.request_msg.body}

${request.remark ? `Admin Remark: ${request.remark}` : ''}

Thank you for choosing I2EDC Services.
For any queries, contact us at support@i2edc.com
        `.trim();

        const blob = new Blob([receiptContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${request.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const downloadEventTicket = async (event: Event) => {
        try {
            const { jsPDF } = await import('jspdf');
            
            const doc = new jsPDF();
            const pageWidth = doc.internal.pageSize.getWidth();
            
            // Add header
            doc.setFontSize(20);
            doc.setTextColor(41, 128, 185);
            doc.text('I2EDC EVENTS', pageWidth / 2, 20, { align: 'center' });
            
            doc.setFontSize(16);
            doc.setTextColor(0, 0, 0);
            doc.text('EVENT TICKET', pageWidth / 2, 30, { align: 'center' });
            
            // Add event details
            doc.setFontSize(10);
            let yPosition = 50;
            
            const details = [
                `Event: ${event.name}`,
                `Date: ${formatEventDate(event.date)}`,
                `Duration: ${event.duration}`,
                `Registration Ends: ${formatDate(event.reg_end_date)}`,
                `Ticket: E-${event.id}-${user?.id || 'USER'}`,
                `Status: ${getEventStatus(event)}`,
                '',
                'Participant Information:',
                `Name: ${user?.first_name || ''} ${user?.last_name || ''}`,
                `Email: ${user?.email || ''}`,
                `Username: ${user?.username || ''}`,
                '',
                'Event Description:',
            ];
            
            details.forEach(line => {
                if (yPosition > pageHeight - 50) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(line, 20, yPosition);
                yPosition += 6;
            });
            
            // Add description with word wrap
            const descriptionLines = doc.splitTextToSize(event.description, pageWidth - 40);
            descriptionLines.forEach((line: string) => {
                if (yPosition > pageHeight - 50) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(line, 20, yPosition);
                yPosition += 6;
            });
            
            // Add terms and conditions
            yPosition += 10;
            const terms = [
                'Terms & Conditions:',
                '- Please bring this ticket to the event',
                '- Ticket is non-transferable',
                '- Valid for the registered participant only',
                '- Registration ends on: ' + formatDate(event.reg_end_date)
            ];
            
            terms.forEach(line => {
                if (yPosition > pageHeight - 30) {
                    doc.addPage();
                    yPosition = 20;
                }
                doc.text(line, 20, yPosition);
                yPosition += 6;
            });
            
            // Add footer
            doc.setFontSize(8);
            doc.setTextColor(128, 128, 128);
            doc.text('Present this ticket at the event entrance for scanning • events@i2edc.com', 
                    pageWidth / 2, pageHeight - 10, { align: 'center' });
            
            // Save the PDF
            doc.save(`ticket-${event.id}.pdf`);
            
        } catch (error) {
            console.error('Error generating ticket PDF:', error);
            downloadTextTicket(event);
        }
    };

    const downloadTextTicket = (event: Event) => {
        const ticketContent = `
I2EDC EVENTS - EVENT TICKET
============================

Event: ${event.name}
Date: ${formatEventDate(event.date)}
Duration: ${event.duration}
Registration Ends: ${formatDate(event.reg_end_date)}
Ticket: E-${event.id}-${user?.id || 'USER'}
Status: ${getEventStatus(event)}

PARTICIPANT INFORMATION:
------------------------
Name: ${user?.first_name || ''} ${user?.last_name || ''}
Email: ${user?.email || ''}
Username: ${user?.username || ''}

EVENT DESCRIPTION:
------------------
${event.description}

IMPORTANT NOTES:
----------------
- Please bring this ticket to the event
- Ticket is non-transferable
- Valid for the registered participant only
- Registration ends on: ${formatDate(event.reg_end_date)}
- Present at event entrance for scanning

For queries: events@i2edc.com
        `.trim();

        const blob = new Blob([ticketContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `ticket-${event.id}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const participatingEvents = getParticipatingEvents();

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-900/20 mt-24">
                <div className="max-w-4xl mx-auto p-8">
                    <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Authentication Required</AlertTitle>
                        <AlertDescription>
                            Please log in to view your history.
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-900/20 mt-24">
                <div className="max-w-6xl mx-auto p-8">
                    <div className="space-y-8">
                        <Skeleton className="h-12 w-64" />
                        <Skeleton className="h-10 w-full" />
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <Skeleton key={i} className="h-32 w-full" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-900/20 mt-24">
            <div className="max-w-6xl mx-auto p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        My History
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        View your service requests and event registrations
                    </p>
                </div>

                {error && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="services" className="flex items-center gap-2">
                            <Package className="w-4 h-4" />
                            Service Requests ({serviceRequests.length})
                        </TabsTrigger>
                        <TabsTrigger value="events" className="flex items-center gap-2">
                            <Users className="w-4 h-4" />
                            Event Registrations ({participatingEvents.length})
                        </TabsTrigger>
                    </TabsList>

                    {/* Service Requests Tab */}
                    <TabsContent value="services" className="space-y-6">
                        {serviceRequests.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                        No Service Requests
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-500 mb-4">
                                        You haven't made any service requests yet.
                                    </p>
                                    <a href="/pages/services">
                                        <Button>
                                            Browse Services
                                        </Button>
                                    </a>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {serviceRequests.map((request) => {
                                    const finalPrice = request.plan.cost * (1 - request.plan.discount / 100);
                                    
                                    return (
                                        <Card key={request.id} className="hover:shadow-lg transition-shadow">
                                            <CardHeader className="pb-4">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <CardTitle className="text-xl flex items-center gap-2">
                                                            {request.service.name}
                                                            {getStatusBadge(request.status)}
                                                        </CardTitle>
                                                        <CardDescription className="flex items-center gap-2 mt-2">
                                                            <Calendar className="w-4 h-4" />
                                                            Requested {formatDate(request.requested_at)}
                                                        </CardDescription>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-1 text-lg font-bold text-green-600">
                                                            <IndianRupee className="w-5 h-5" />
                                                            {finalPrice.toFixed(2)}
                                                        </div>
                                                        {request.plan.discount > 0 && (
                                                            <div className="text-sm text-gray-500 line-through">
                                                                ₹{request.plan.cost}
                                                            </div>
                                                        )}
                                                        <div className="text-sm text-gray-500">
                                                            {request.plan.plan} Plan
                                                        </div>
                                                    </div>
                                                </div>
                                            </CardHeader>
                                            
                                            <CardContent className="pb-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <h4 className="font-semibold text-sm text-gray-500 mb-1">Subject</h4>
                                                        <p className="text-gray-900 dark:text-white">{request.request_msg.subject}</p>
                                                    </div>
                                                    <div>
                                                        <h4 className="font-semibold text-sm text-gray-500 mb-1">Description</h4>
                                                        <p className="text-gray-600 dark:text-gray-400 line-clamp-2">
                                                            {request.request_msg.body}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                {request.remark && (
                                                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                        <h4 className="font-semibold text-sm text-blue-700 dark:text-blue-300 mb-1">
                                                            Admin Remark
                                                        </h4>
                                                        <p className="text-blue-600 dark:text-blue-400 text-sm">
                                                            {request.remark}
                                                        </p>
                                                    </div>
                                                )}
                                            </CardContent>
                                            
                                            <CardFooter className="flex justify-between items-center pt-4 border-t">
                                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                                    <Clock className="w-4 h-4" />
                                                    Last updated {formatDate(request.updated_at)}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => downloadPDFReceipt(request)}
                                                    >
                                                        <Download className="w-4 h-4 mr-2" />
                                                        Download PDF
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            alert(`Service Request Details:\n\nSubject: ${request.request_msg.subject}\nDescription: ${request.request_msg.body}\nStatus: ${request.status}\nPlan: ${request.plan.plan}\nCost: ₹${request.plan.cost}\nDiscount: ${request.plan.discount}%\nFinal Amount: ₹${finalPrice.toFixed(2)}`);
                                                        }}
                                                    >
                                                        <Eye className="w-4 h-4 mr-2" />
                                                        View Details
                                                    </Button>
                                                </div>
                                            </CardFooter>
                                        </Card>
                                    );
                                })}
                            </div>
                        )}
                    </TabsContent>

                    {/* Event Registrations Tab */}
                    <TabsContent value="events" className="space-y-6">
                        {participatingEvents.length === 0 ? (
                            <Card>
                                <CardContent className="p-8 text-center">
                                    <Users className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                        No Event Registrations
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-500 mb-4">
                                        You haven't registered for any events yet.
                                    </p>
                                    <a href="/pages/events">
                                        <Button>
                                            Browse Events
                                        </Button>
                                    </a>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {participatingEvents.map((event) => (
                                    <Card key={event.id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader className="pb-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-xl flex items-center gap-2">
                                                        {event.name}
                                                        {getEventStatusBadge(event)}
                                                    </CardTitle>
                                                    <CardDescription className="flex items-center gap-2 mt-2">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatEventDate(event.date)}
                                                    </CardDescription>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm text-gray-500">
                                                        {event.participants.length} participants
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1">
                                                        Reg ends: {formatDate(event.reg_end_date)}
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        
                                        <CardContent className="pb-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <h4 className="font-semibold text-sm text-gray-500 mb-1 flex items-center gap-2">
                                                        <Clock className="w-4 h-4" />
                                                        Duration
                                                    </h4>
                                                    <p className="text-gray-900 dark:text-white">{event.duration}</p>
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-sm text-gray-500 mb-1">Description</h4>
                                                    <p className="text-gray-600 dark:text-gray-400">
                                                        {event.description}
                                                    </p>
                                                </div>
                                            </div>                                            
                                            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                                <h4 className="font-semibold text-sm text-green-700 dark:text-green-300 mb-1">
                                                    Registration Information
                                                </h4>
                                                <p className="text-green-600 dark:text-green-400 text-sm">
                                                    Status: Registered • 
                                                    Participants: {event.participants.length} • 
                                                    Registration ends: {formatDate(event.reg_end_date)}
                                                </p>
                                            </div>
                                        </CardContent>
                                        
                                        <CardFooter className="flex justify-between items-center pt-4 border-t">
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <User className="w-4 h-4" />
                                                Ticket: E-{event.id}-{user?.id || 'USER'}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => downloadEventTicket(event)}
                                                >
                                                    <Download className="w-4 h-4 mr-2" />
                                                    Download Ticket
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        alert(`Event Details:\n\nName: ${event.name}\nDate: ${formatEventDate(event.date)}\nDuration: ${event.duration}\nStatus: ${getEventStatus(event)}\nParticipants: ${event.participants.length}\nRegistration Ends: ${formatDate(event.reg_end_date)}\nDescription: ${event.description}\n\nDetailed Info: ${event.long_description || 'No additional details'}`);
                                                    }}
                                                >
                                                    <Eye className="w-4 h-4 mr-2" />
                                                    View Details
                                                </Button>
                                            </div>
                                        </CardFooter>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>

                {/* Statistics Summary */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">{serviceRequests.length}</div>
                                <div className="text-sm text-blue-600">Service Requests</div>
                            </div>
                            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                    {serviceRequests.filter(r => r.status === 'COMPLETED').length}
                                </div>
                                <div className="text-sm text-green-600">Completed Services</div>
                            </div>
                            <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-purple-600">{participatingEvents.length}</div>
                                <div className="text-sm text-purple-600">Event Registrations</div>
                            </div>
                            <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">
                                    {participatingEvents.filter(e => getEventStatus(e) === 'COMPLETED').length}
                                </div>
                                <div className="text-sm text-orange-600">Events Attended</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default HistoryPage;