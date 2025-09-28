'use client'
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

// Shadcn components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  MoreHorizontal, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  ArrowLeft,
  Filter,
  Calendar,
  User,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Download,
  BarChart3
} from 'lucide-react';

// Type definitions
interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
}

interface Service {
  id: number;
  name: string;
  description: string;
  cost_discount: Array<{
    plan: string;
    cost: number;
    discount: number;
    description?: string;
  }>;
  admin: User;
}

interface ServiceRequest {
  id: number;
  requested_by: User;
  service: Service;
  plan: {
    plan: string;
    cost: number;
    discount: number;
    description?: string;
  };
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  request_msg: {
    subject: string;
    body: string;
  };
  media_url?: string;
  remark?: string;
  requested_at: string;
  updated_at: string;
  final_price: number;
  plan_name: string;
  can_be_cancelled: boolean;
}

interface ServiceStatistics {
  total_requests: number;
  pending_requests: number;
  completed_requests: number;
  popular_plans: Array<{
    plan__plan: string;
    count: number;
  }>;
}

type StatusFilter = 'all' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

const ServiceRequestsPage: React.FC = () => {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const [service, setService] = useState<Service | null>(null);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [stats, setStats] = useState<ServiceStatistics | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [updateDialogOpen, setUpdateDialogOpen] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
  const [updating, setUpdating] = useState<boolean>(false);
  const [remark, setRemark] = useState<string>('');
  const [newStatus, setNewStatus] = useState<string>('');

  // Fetch service details and requests on component mount
  useEffect(() => {
    if (serviceId) {
      fetchServiceDetails();
      fetchServiceRequests();
      fetchServiceStats();
    }
  }, [serviceId]);

  const fetchServiceDetails = async (): Promise<void> => {
    try {
      const response = await api.get(`/services/${serviceId}/`);
      setService(response.data);
    } catch (error: unknown) {
      console.error('Error fetching service details:', error);
      toast.error('Failed to load service details');
    }
  };

  const fetchServiceRequests = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get('/services/requests/admin/requests/');
      // Filter requests for this specific service
      const serviceRequests = response.data.filter(
        (request: ServiceRequest) => request.service.id.toString() === serviceId
      );
      setRequests(serviceRequests);
    } catch (error: unknown) {
      console.error('Error fetching service requests:', error);
      toast.error('Failed to load service requests');
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceStats = async (): Promise<void> => {
    try {
      const response = await api.get(`/services/${serviceId}/statistics/`);
      setStats(response.data);
    } catch (error: unknown) {
      console.error('Error fetching service stats:', error);
    }
  };

  const handleStatusUpdate = async (): Promise<void> => {
    if (!selectedRequest || !newStatus) return;

    try {
      setUpdating(true);
      await api.patch(`/services/requests/admin/requests/${selectedRequest.id}/update/`, {
        status: newStatus,
        remark: remark || undefined
      });
      
      toast.success('Request status updated successfully');
      setUpdateDialogOpen(false);
      setSelectedRequest(null);
      setRemark('');
      setNewStatus('');
      
      // Refresh data
      fetchServiceRequests();
      fetchServiceStats();
    } catch (error: unknown) {
      console.error('Error updating request status:', error);
      toast.error('Failed to update request status');
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateClick = (request: ServiceRequest): void => {
    setSelectedRequest(request);
    setNewStatus(request.status);
    setRemark(request.remark || '');
    setUpdateDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      IN_PROGRESS: { variant: 'default' as const, icon: RefreshCw, color: 'text-blue-600' },
      COMPLETED: { variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      CANCELLED: { variant: 'destructive' as const, icon: XCircle, color: 'text-red-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    const IconComponent = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center space-x-1 w-fit">
        <IconComponent className={`h-3 w-3 ${config.color}`} />
        <span className="capitalize">{status.toLowerCase().replace('_', ' ')}</span>
      </Badge>
    );
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.requested_by.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requested_by.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.request_msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.plan.plan.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getPlanCost = (request: ServiceRequest): string => {
    const cost = request.plan.cost || 0;
    const discount = request.plan.discount || 0;
    const finalPrice = cost - discount;
    return `$${finalPrice.toFixed(2)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg font-medium">Loading service requests...</p>
              <p className="text-muted-foreground text-sm mt-2">Please wait while we fetch the data</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6">
          <div className="space-y-2 flex-1">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </Button>
              <div className="flex-1">
                <h1 className="text-4xl font-bold">
                  Service Requests
                </h1>
                {service && (
                  <p className="text-lg text-muted-foreground">
                    Managing requests for <strong>{service.name}</strong>
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="flex items-center space-x-2">
              <Download className="h-4 w-4" />
              <span>Export</span>
            </Button>
            <Button asChild size="sm">
              <Link href={`/pages/admin/services/${serviceId}`}>
                <Eye className="h-4 w-4 mr-2" />
                View Service
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Summary */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                    <p className="text-2xl font-bold">{stats.total_requests}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pending</p>
                    <p className="text-2xl font-bold">{stats.pending_requests}</p>
                  </div>
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-950 rounded-xl">
                    <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Completed</p>
                    <p className="text-2xl font-bold">{stats.completed_requests}</p>
                  </div>
                  <div className="p-3 bg-green-100 dark:bg-green-950 rounded-xl">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Popular Plan</p>
                    <p className="text-2xl font-bold capitalize">
                      {stats.popular_plans?.[0]?.plan__plan || 'N/A'}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-100 dark:bg-purple-950 rounded-xl">
                    <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search by user, email, subject, or plan..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <Select value={statusFilter} onValueChange={(value: StatusFilter) => setStatusFilter(value)}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
                <span className="font-medium">{filteredRequests.length}</span> of <span className="font-medium">{requests.length}</span> requests
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requests Table */}
        {filteredRequests.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {searchTerm || statusFilter !== 'all' ? 'No requests found' : 'No requests yet'}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
                {searchTerm || statusFilter !== 'all' 
                  ? 'No requests match your current filters. Try adjusting your search criteria.'
                  : 'This service has not received any requests yet. Requests will appear here once users start placing orders.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Plan</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request) => (
                    <TableRow key={request.id} className="group">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">
                              {request.requested_by.first_name} {request.requested_by.last_name}
                            </p>
                            <p className="text-sm text-muted-foreground">{request.requested_by.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {request.plan.plan}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-[200px]">
                          <p className="font-medium text-sm line-clamp-1">
                            {request.request_msg.subject}
                          </p>
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            {request.request_msg.body}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {getPlanCost(request)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(request.status)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(request.requested_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                            onClick={() => handleUpdateClick(request)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            asChild 
                            variant="ghost" 
                            size="sm" 
                            className="h-8 w-8 p-0"
                          >
                            <Link href={`/pages/admin/requests/${request.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        {/* Update Status Dialog */}
        <Dialog open={updateDialogOpen} onOpenChange={setUpdateDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Edit className="h-5 w-5" />
                <span>Update Request Status</span>
              </DialogTitle>
              <DialogDescription className="pt-4">
                Update the status and add remarks for this service request.
              </DialogDescription>
            </DialogHeader>

            {selectedRequest && (
              <div className="space-y-4">
                {/* Request Info */}
                <div className="bg-muted rounded-lg p-4 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">{selectedRequest.request_msg.subject}</p>
                      <p className="text-sm text-muted-foreground">
                        by {selectedRequest.requested_by.first_name} {selectedRequest.requested_by.last_name}
                      </p>
                    </div>
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                  <p className="text-sm">
                    Plan: <Badge variant="outline" className="capitalize">{selectedRequest.plan.plan}</Badge>
                  </p>
                </div>

                {/* Status Select */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <Select value={newStatus} onValueChange={setNewStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                      <SelectItem value="COMPLETED">Completed</SelectItem>
                      <SelectItem value="CANCELLED">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Remark Textarea */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Remarks (Optional)</label>
                  <Textarea
                    placeholder="Add any remarks or notes about this request..."
                    value={remark}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setRemark(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            )}

            <DialogFooter className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => setUpdateDialogOpen(false)}
                disabled={updating}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleStatusUpdate}
                disabled={updating || !newStatus}
                className="flex-1"
              >
                {updating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  'Update Status'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ServiceRequestsPage;