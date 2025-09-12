'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import api from '@/lib/api';
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Plus, Trash2, Clock, DollarSign, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

// Interface definitions for our data structures
interface CostDiscount {
    plan: string;
    cost: number;
    discount: number;
}

interface Service {
    id: number;
    name: string;
    description: string;
    long_description: string;
    availability_map: Record<string, string>;
    cost_discount: CostDiscount[];
}

// A structured type for the availability form state
interface AvailabilitySlot {
    day: string;
    time: string;
}

// Initial state for the form. Ensures availability_map and cost_discount are always arrays in the state.
const initialFormData = {
    name: '',
    description: '',
    long_description: '',
    availability_map: [{ day: 'Mon-Fri', time: '9am-6pm' }] as AvailabilitySlot[],
    cost_discount: [{ plan: 'basic', cost: 500, discount: 5 }] as CostDiscount[],
};

const ServiceManager: React.FC = () => {
    const [services, setServices] = useState<Service[]>([]);
    const [formData, setFormData] = useState(initialFormData);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch existing services on component mount
    useEffect(() => {
        const fetchServices = async () => {
            try {
                setIsLoading(true);
                const response = await api.get<Service[]>('/services/list/');
                setServices(response.data);
            } catch (error) {
                console.error('Error fetching services:', error);
                setError('Failed to fetch services.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchServices();
    }, []);

    // Handler for simple text inputs
    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear errors when user starts typing
        if (error) setError(null);
    };

    // Handlers for the dynamic availability map
    const handleAvailabilityChange = (index: number, field: keyof AvailabilitySlot, value: string) => {
        const updatedAvailability = [...formData.availability_map];
        updatedAvailability[index][field] = value;
        setFormData({ ...formData, availability_map: updatedAvailability });
    };

    const addAvailabilitySlot = () => {
        setFormData({
            ...formData,
            availability_map: [...formData.availability_map, { day: '', time: '' }],
        });
    };

    const removeAvailabilitySlot = (index: number) => {
        const filteredAvailability = formData.availability_map.filter((_, i) => i !== index);
        setFormData({ ...formData, availability_map: filteredAvailability });
    };

    // Handlers for the dynamic cost and discount fields
    const handleCostDiscountChange = (index: number, field: keyof CostDiscount, value: string | number) => {
        const updatedCostDiscount = [...formData.cost_discount];
        updatedCostDiscount[index][field] = value as never;
        setFormData({ ...formData, cost_discount: updatedCostDiscount });
    };

    const addCostDiscountPlan = () => {
        setFormData({
            ...formData,
            cost_discount: [...formData.cost_discount, { plan: '', cost: 0, discount: 0 }],
        });
    };

    const removeCostDiscountPlan = (index: number) => {
        const filteredCostDiscount = formData.cost_discount.filter((_, i) => i !== index);
        setFormData({ ...formData, cost_discount: filteredCostDiscount });
    };

    // Handler for creating a new service
    const handleCreateService = async () => {
        if (!formData.name || !formData.description || !formData.long_description) {
            setError('All descriptive fields are required.');
            return;
        }

        // Validate cost/discount entries
        for (const plan of formData.cost_discount) {
            if (!plan.plan || plan.cost <= 0) {
                setError('All pricing plans must have a name and a positive cost.');
                return;
            }
        }

        // Convert the availability array from state into the object format required by the API
        const availabilityMapForApi = formData.availability_map.reduce((acc, slot) => {
            if (slot.day && slot.time) {
                acc[slot.day] = slot.time;
            }
            return acc;
        }, {} as Record<string, string>);

        try {
            setIsLoading(true);
            const payload = {
                ...formData,
                availability_map: availabilityMapForApi,
                cost_discount: formData.cost_discount,
            };

            const response = await api.post<Service>('/services/create/', payload);
            setServices([...services, response.data]);

            // On success, reset the form to its initial state
            setFormData(initialFormData);
            setError(null);
            setSuccess('Service created successfully!');

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error creating service:', error);
            setError('Failed to create service. Please check your input.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handler for deleting a service
    const handleDeleteService = async (id: number) => {
        if (!confirm('Are you sure you want to delete this service?')) return;

        try {
            setIsLoading(true);
            await api.delete(`/services/delete/${id}/`);
            setServices(services.filter((s) => s.id !== id));
            setSuccess('Service deleted successfully!');
            setTimeout(() => setSuccess(null), 3000);
        } catch (error) {
            console.error('Error deleting service:', error);
            setError('Failed to delete service.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-6 space-y-8">
            {/* Status Messages */}
            {error && (
                <div className="p-4 rounded-md bg-red-50 border border-red-200 flex items-center gap-2 text-red-800">
                    <AlertCircle className="h-5 w-5" />
                    <p>{error}</p>
                </div>
            )}

            {success && (
                <div className="p-4 rounded-md bg-green-50 border border-green-200 flex items-center gap-2 text-green-800">
                    <CheckCircle className="h-5 w-5" />
                    <p>{success}</p>
                </div>
            )}

            {/* Create Service Form */}
            <Card className="shadow-lg border-0">
                <CardHeader className=" from-blue-50 rounded-t-lg">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <Plus className="h-6 w-6" />
                        Create New Service
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6 pt-6">
                    <div className="grid gap-2">
                        <Label htmlFor="name" className="font-medium text-sm">Service Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter service name"
                            className="focus-visible:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description" className="font-medium text-sm">Short Description</Label>
                        <Input
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Brief description that will appear in listings"
                            className="focus-visible:ring-blue-500"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="long_description" className="font-medium text-sm">Detailed Description</Label>
                        <Textarea
                            id="long_description"
                            name="long_description"
                            value={formData.long_description}
                            onChange={handleChange}
                            placeholder="Comprehensive service description with all details"
                            className="min-h-32 focus-visible:ring-blue-500"
                            required
                        />
                    </div>

                    <Separator />

                    {/* Dynamic Availability Map */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-600" />
                            <Label className="text-base font-semibold">Availability Schedule</Label>
                        </div>
                        <p className="text-sm text-gray-500">Define when this service is available to customers</p>

                        {Array.isArray(formData.availability_map) && formData.availability_map.map((slot, index) => (
                            <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border rounded-lg bg border-gray-600">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-grow">
                                    <div>
                                        <Label className="text-xs text-gray-500">Days</Label>
                                        <Input
                                            placeholder="e.g., Mon-Fri or Monday,Wednesday"
                                            value={slot.day}
                                            onChange={(e) => handleAvailabilityChange(index, 'day', e.target.value)}
                                            className="bg-white"
                                        />
                                    </div>
                                    <div>
                                        <Label className="text-xs text-gray-500">Time Range</Label>
                                        <Input
                                            placeholder="e.g., 9am-6pm or 10:00-14:30"
                                            value={slot.time}
                                            onChange={(e) => handleAvailabilityChange(index, 'time', e.target.value)}
                                            className="bg-white"
                                        />
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => removeAvailabilitySlot(index)}
                                    className="mt-2 sm:mt-0 shrink-0 border-red-200 text-red-500 hover:bg-red-50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={addAvailabilitySlot}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Time Slot
                        </Button>
                    </div>

                    <Separator className='bg-gray-500' />

                    {/* Dynamic Cost & Discounts */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5 text-blue-600" />
                            <Label className="text-base font-semibold">Pricing Plans</Label>
                        </div>
                        <p className="text-sm text-gray-500">Define different pricing tiers for this service</p>

                        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 pl-4 pr-4 border rounded-lg py-3 items-center'>
                            <Label className="font-medium">Plan Type</Label>
                            <Label className="font-medium">Price ($)</Label>
                            <Label className="font-medium">Discount (%)</Label>
                            <Label className="font-medium">Final Price</Label>
                        </div>

                        {Array.isArray(formData.cost_discount) && formData.cost_discount.map((plan, index) => {
                            const finalPrice = plan.cost - (plan.cost * (plan.discount / 100));

                            return (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg border-gray-600 items-center">
                                    <Input
                                        placeholder="Plan name (e.g., Basic)"
                                        value={plan.plan}
                                        onChange={(e) => handleCostDiscountChange(index, 'plan', e.target.value)}
                                        className="bg-white"
                                    />
                                    <Input
                                        type="number"
                                        placeholder="0.00"
                                        value={plan.cost || ''}
                                        onChange={(e) => handleCostDiscountChange(index, 'cost', parseFloat(e.target.value) || 0)}
                                        className="bg-white"
                                        min="0"
                                    />
                                    <Input
                                        type="number"
                                        placeholder="0"
                                        value={plan.discount || ''}
                                        onChange={(e) => handleCostDiscountChange(index, 'discount', parseFloat(e.target.value) || 0)}
                                        className="bg-white"
                                        min="0"
                                        max="100"
                                    />
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">Rs {finalPrice.toFixed(2)}/-</span>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeCostDiscountPlan(index)}
                                            className="shrink-0 border-red-200 text-red-500 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            );
                        })}

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={addCostDiscountPlan}
                            className="border-blue-200 text-blue-600 hover:bg-blue-50"
                        >
                            <Plus className="h-4 w-4 mr-1" />
                            Add Pricing Plan
                        </Button>
                    </div>
                </CardContent>
                <CardFooter className=" rounded-b-lg">
                    <Button
                        onClick={handleCreateService}
                        className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg font-medium"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Service...' : 'Create Service'}
                    </Button>
                </CardFooter>
            </Card>

            {/* List of Existing Services */}
            <div>
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Existing Services ({services.length})
                </h3>

                {isLoading && services.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Loading services...</p>
                    </div>
                ) : services.length === 0 ? (
                    <Card className="p-8 text-center border-dashed">
                        <p className="text-gray-500">No services yet. Create your first service above.</p>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {services.map((service) => (
                            <Card key={service.id} className="shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{service.name}</CardTitle>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleDeleteService(service.id)}
                                            disabled={isLoading}
                                            className="border-red-200 text-red-500 hover:bg-red-50"
                                        >
                                            <Trash2 className="h-4 w-4 mr-1" />
                                            Delete
                                        </Button>
                                    </div>
                                    <p className="text-sm text-gray-600">{service.description}</p>
                                </CardHeader>
                                <CardContent className="pt-0">
                                    {/* Pricing Plans */}
                                    <div className="mb-4">
                                        <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                                            <DollarSign className="h-4 w-4" />
                                            Pricing Plans
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {service.cost_discount && service.cost_discount.map((plan, idx) => (
                                                <Badge key={idx} variant="outline" className="border-blue-500" style={{ color: '#93e8ff' }}>
                                                    {plan.plan}: Rs {plan.cost - (plan.cost * (plan.discount / 100))}
                                                    {plan.discount > 0 && <span className="ml-1 text-xs">({plan.discount}% off)</span>}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Availability Slots */}
                                    <div>
                                        <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            Availability
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {service.availability_map && Object.entries(service.availability_map).map(([day, time], idx) => (
                                                <div key={idx} className="flex items-center gap-2 p-2 rounded-md text-sm">
                                                    <span className="font-medium min-w-[80px]">{day}:</span>
                                                    <span>{time}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ServiceManager;