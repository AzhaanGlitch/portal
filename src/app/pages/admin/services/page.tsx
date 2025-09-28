'use client'
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  MoreHorizontal, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  Clock,
  Filter,
  LayoutGrid,
  Table as TableIcon
} from 'lucide-react';

// Type definitions
interface Service {
  id: number;
  name: string;
  description: string;
  long_description?: string;
  media?: string;
  cost_discount: Array<{
    plan: string;
    cost: number;
    discount: number;
    description?: string;
  }>;
  admin: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  created_at: string;
  updated_at: string;
}

interface ServiceStats {
  total_requests: number;
  pending_requests: number;
  completed_requests: number;
  popular_plans: Array<{
    plan__plan: string;
    count: number;
  }>;
}

type ViewMode = 'grid' | 'table';

const AdminServicesPage: React.FC = () => {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);
  const [stats, setStats] = useState<{ [key: number]: ServiceStats }>({});
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Fetch services on component mount
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async (): Promise<void> => {
    try {
      setLoading(true);
      const response = await api.get('/services/admin/my-services/');
      setServices(response.data);
      
      // Fetch stats for each service
      response.data.forEach((service: Service) => {
        fetchServiceStats(service.id);
      });
    } catch (error: unknown) {
      console.error('Error fetching services:', error);
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const fetchServiceStats = async (serviceId: number): Promise<void> => {
    try {
      const response = await api.get(`/services/${serviceId}/statistics/`);
      setStats(prev => ({
        ...prev,
        [serviceId]: response.data
      }));
    } catch (error: unknown) {
      console.error(`Error fetching stats for service ${serviceId}:`, error);
    }
  };

  const handleDeleteClick = (service: Service): void => {
    setServiceToDelete(service);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async (): Promise<void> => {
    if (!serviceToDelete) return;

    try {
      setDeleting(true);
      await api.delete(`/services/${serviceToDelete.id}/delete/`);
      toast.success('Service deleted successfully');
      setServices(services.filter(service => service.id !== serviceToDelete.id));
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    } catch (error: unknown) {
      console.error('Error deleting service:', error);
      toast.error('Failed to delete service');
    } finally {
      setDeleting(false);
    }
  };

  const handleCardClick = (serviceId: number): void => {
    router.push(`/pages/admin/services/${serviceId}`);
  };

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    service.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get plan count
  const getPlanCount = (service: Service): number => {
    return service.cost_discount?.length || 0;
  };

  // Get lowest price from plans
  const getStartingPrice = (service: Service): string => {
    if (!service.cost_discount?.length) return 'N/A';
    
    const prices = service.cost_discount.map(plan => {
      const cost = plan.cost || 0;
      const discount = plan.discount || 0;
      return cost - discount;
    });
    
    const minPrice = Math.min(...prices);
    return `$${minPrice.toFixed(2)}`;
  };

  // Get completion rate
  const getCompletionRate = (serviceId: number): string => {
    const serviceStats = stats[serviceId];
    if (!serviceStats?.total_requests) return '0%';
    
    const rate = (serviceStats.completed_requests / serviceStats.total_requests) * 100;
    return `${Math.round(rate)}%`;
  };

  // Get most popular plan
  const getPopularPlan = (serviceId: number): string => {
    const serviceStats = stats[serviceId];
    if (!serviceStats?.popular_plans?.length) return 'N/A';
    
    return serviceStats.popular_plans[0].plan__plan || 'N/A';
  };

  // Card View Component
  const ServiceCardsView: React.FC = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredServices.map((service) => {
        const serviceStats = stats[service.id];
        const completionRate = getCompletionRate(service.id);
        const popularPlan = getPopularPlan(service.id);
        
        return (
          <Card 
            key={service.id} 
            className="group hover:shadow-md transition-all duration-300 cursor-pointer"
            onClick={() => handleCardClick(service.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                    {service.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 mt-2">
                    {service.description}
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/pages/admin/services/${service.id}`} className="cursor-pointer flex items-center">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link 
                        href={`/pages/admin/services/${service.id}/edit`} 
                        className="cursor-pointer flex items-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Service
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(service);
                      }}
                      className="text-destructive cursor-pointer flex items-center"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Service
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            
            <CardContent className="pb-4">
              <div className="space-y-4">
                {/* Pricing & Plans */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <DollarSign className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{getStartingPrice(service)}</p>
                      <p className="text-xs text-muted-foreground">Starting price</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="flex items-center space-x-1">
                    <Package className="h-3 w-3" />
                    <span>{getPlanCount(service)} plans</span>
                  </Badge>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-sm">
                      <Users className="h-4 w-4 text-primary" />
                      <span className="font-medium">{serviceStats?.total_requests || 0}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Total requests</p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1 text-sm">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="font-medium">{completionRate}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Completion rate</p>
                  </div>
                </div>

                {/* Popular Plan */}
                {popularPlan !== 'N/A' && (
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-medium">Most Popular:</span>
                      <Badge variant="outline" className="capitalize">
                        {popularPlan}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="pt-4 border-t">
              <div className="w-full flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{formatDate(service.created_at)}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {service.admin?.first_name || service.admin?.username}
                  </p>
                  <p className="text-xs text-muted-foreground">Admin</p>
                </div>
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );

  // Table View Component
  const ServiceTableView: React.FC = () => (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Plans</TableHead>
              <TableHead>Requests</TableHead>
              <TableHead>Completion</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.map((service) => {
              const serviceStats = stats[service.id];
              const completionRate = getCompletionRate(service.id);
              
              return (
                <TableRow 
                  key={service.id} 
                  className="group cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => handleCardClick(service.id)}
                >
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-primary" />
                      </div>
                      <span className="group-hover:text-primary transition-colors">{service.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-[200px]">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {service.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="flex items-center space-x-1 w-fit">
                      <Package className="h-3 w-3" />
                      <span>{getPlanCount(service)}</span>
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-primary" />
                        <span className="font-medium">
                          {serviceStats?.total_requests || 0}
                        </span>
                      </div>
                      {serviceStats?.pending_requests > 0 && (
                        <Badge variant="outline" className="bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800">
                          {serviceStats.pending_requests} pending
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-secondary rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: getCompletionRate(service.id) }}
                        />
                      </div>
                      <span className="text-sm font-medium min-w-10">
                        {completionRate}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {getStartingPrice(service)}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(service.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        asChild 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link href={`/pages/admin/services/${service.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        asChild 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Link href={`/pages/admin/services/${service.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteClick(service);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-lg font-medium">Loading services...</p>
              <p className="text-muted-foreground text-sm mt-2">Please wait while we fetch your services</p>
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
          <div className="space-y-2">
            <h1 className="text-4xl font-bold">
              Services Management
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Manage all your services, pricing plans, and monitor performance metrics
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/pages/admin/services/create">
              <Plus className="h-5 w-5 mr-2" />
              Create New Service
            </Link>
          </Button>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Services</p>
                  <p className="text-2xl font-bold">{services.length}</p>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Package className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Plans</p>
                  <p className="text-2xl font-bold">
                    {services.reduce((total, service) => total + getPlanCount(service), 0)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 dark:bg-green-950 rounded-xl">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Requests</p>
                  <p className="text-2xl font-bold">
                    {Object.values(stats).reduce((total, stat) => total + (stat?.pending_requests || 0), 0)}
                  </p>
                </div>
                <div className="p-3 bg-orange-100 dark:bg-orange-950 rounded-xl">
                  <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
                  <p className="text-2xl font-bold">
                    {Object.values(stats).reduce((total, stat) => total + (stat?.total_requests || 0), 0)}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 dark:bg-purple-950 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Search services by name or description..."
                    value={searchTerm}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-muted-foreground" />
                  <select 
                    className="border border-input rounded-md px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="all">All Services</option>
                    <option value="active">With Requests</option>
                    <option value="no-requests">No Requests</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 w-full lg:w-auto">
                <div className="flex items-center space-x-1 bg-muted rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="h-8 px-3"
                  >
                    <LayoutGrid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="h-8 px-3"
                  >
                    <TableIcon className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
                  <span className="font-medium">{filteredServices.length}</span> of <span className="font-medium">{services.length}</span> services
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services List */}
        {filteredServices.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {searchTerm ? 'No services found' : 'No services created yet'}
              </h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto text-lg">
                {searchTerm 
                  ? `No services match "${searchTerm}". Try adjusting your search terms or create a new service.`
                  : 'Get started by creating your first service to offer to users. Create pricing plans and start accepting requests.'
                }
              </p>
              <Button asChild size="lg">
                <Link href="/pages/admin/services/create">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your First Service
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : viewMode === 'grid' ? (
          <ServiceCardsView />
        ) : (
          <ServiceTableView />
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2 text-destructive">
                <Trash2 className="h-5 w-5" />
                <span>Delete Service</span>
              </DialogTitle>
              <DialogDescription className="pt-4">
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-4">
                  <p className="text-destructive font-medium">This action cannot be undone</p>
                </div>
                <p className="text-foreground">
                  Are you sure you want to delete the service <strong>"{serviceToDelete?.name}"</strong>? 
                  All associated data including pricing plans and request history will be permanently removed.
                </p>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deleting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteConfirm}
                disabled={deleting}
                className="flex-1"
              >
                {deleting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Deleting...
                  </>
                ) : (
                  'Delete Service'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminServicesPage;