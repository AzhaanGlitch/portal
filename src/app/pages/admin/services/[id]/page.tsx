'use client';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { useParams, useRouter } from 'next/navigation';
import api from '@/lib/api';

// Shadcn components
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Type definitions
interface AvailabilitySlot {
    id: number | string;
    day_of_week: string;
    start_time: string;
    end_time: string;
    day_of_week_display?: string;
}

interface Plan {
    id: number | string;
    plan: string;
    cost: string;
    discount: string;
    description: string;
}

interface ServiceFormData {
    name: string;
    description: string;
    long_description: string;
    media: File | null;
    availability_slots_read: any[];
    cost_discount: Array<{
        plan: string;
        cost: number;
        discount: number;
        description?: string;
    }>;
}

interface Service {
    id: number;
    name: string;
    description: string;
    long_description?: string;
    media?: string;
    cost_discount?: Array<{
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
    availability_slots?: AvailabilitySlot[];
    created_at: string;
    updated_at: string;
}

const AdminServiceEdit: React.FC = () => {
    const params = useParams();
    const router = useRouter();
    const serviceId = params.id as string;

    const [loading, setLoading] = useState<boolean>(false);
    const [fetching, setFetching] = useState<boolean>(true);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [availabilitySlots, setAvailabilitySlots] = useState<AvailabilitySlot[]>([]);
    const [plans, setPlans] = useState<Plan[]>([]);
    const [service, setService] = useState<Service | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm<ServiceFormData>({
        defaultValues: {
            name: '',
            description: '',
            long_description: '',
            media: null,
            cost_discount: []
        }
    });

    // Day and time options
    const daysOfWeek = [
        { value: 'MON', label: 'Monday' },
        { value: 'TUE', label: 'Tuesday' },
        { value: 'WED', label: 'Wednesday' },
        { value: 'THU', label: 'Thursday' },
        { value: 'FRI', label: 'Friday' },
        { value: 'SAT', label: 'Saturday' },
        { value: 'SUN', label: 'Sunday' }
    ];

    const timeOptions: string[] = [];
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
            timeOptions.push(timeString);
        }
    }

    // Fetch service data
    useEffect(() => {
        if (serviceId) {
            fetchService();
        }
    }, [serviceId]);

    const fetchService = async (): Promise<void> => {
        try {
            setFetching(true);
            const response = await api.get(`/services/${serviceId}/`);
            const serviceData: Service = response.data;
            console.log(serviceData);

            setService(serviceData);

            // Set form values with null checks
            setValue('name', serviceData.name || '');
            setValue('description', serviceData.description || '');
            setValue('long_description', serviceData.long_description || '');

            // Set availability slots with null check
            const slots = serviceData.availability_slots || [];
            setAvailabilitySlots(slots.map(slot => ({
                ...slot,
                id: slot.id || `slot-${Date.now()}-${Math.random()}`
            })));

            // Set plans with null check
            const costDiscount = serviceData.cost_discount || [];
            const plansData: Plan[] = costDiscount.map((plan, index) => ({
                id: `plan-${index}-${Date.now()}`,
                plan: plan.plan || '',
                cost: plan.cost?.toString() || '0',
                discount: plan.discount?.toString() || '0',
                description: plan.description || ''
            }));
            setPlans(plansData);
            setValue('cost_discount', costDiscount);

        } catch (error: unknown) {
            console.error('Error fetching service:', error);
            toast.error('Failed to load service');
        } finally {
            setFetching(false);
        }
    };

    // Add new availability slot
    const addAvailabilitySlot = (): void => {
        setAvailabilitySlots([
            ...availabilitySlots,
            {
                day_of_week: 'MON',
                start_time: '09:00',
                end_time: '17:00',
                id: `slot-${Date.now()}-${Math.random()}`
            }
        ]);
    };

    // Update availability slot
    const updateAvailabilitySlot = (index: number, field: keyof AvailabilitySlot, value: string): void => {
        const updatedSlots = [...availabilitySlots];
        updatedSlots[index] = { ...updatedSlots[index], [field]: value };
        setAvailabilitySlots(updatedSlots);
    };

    // Remove availability slot
    const removeAvailabilitySlot = (index: number): void => {
        setAvailabilitySlots(availabilitySlots.filter((_, i) => i !== index));
    };

    // Add new plan
    const addPlan = (): void => {
        setPlans([
            ...plans,
            {
                plan: '',
                cost: '',
                discount: '',
                description: '',
                id: `plan-${Date.now()}-${Math.random()}`
            }
        ]);
    };

    // Update plan
    const updatePlan = (index: number, field: keyof Plan, value: string): void => {
        const updatedPlans = [...plans];
        updatedPlans[index] = { ...updatedPlans[index], [field]: value };
        setPlans(updatedPlans);

        // Update form value
        setValue('cost_discount', updatedPlans.map(plan => ({
            plan: plan.plan,
            cost: parseFloat(plan.cost) || 0,
            discount: parseFloat(plan.discount) || 0,
            description: plan.description
        })));
    };

    // Remove plan
    const removePlan = (index: number): void => {
        const updatedPlans = plans.filter((_, i) => i !== index);
        setPlans(updatedPlans);
        setValue('cost_discount', updatedPlans.map(plan => ({
            plan: plan.plan,
            cost: parseFloat(plan.cost) || 0,
            discount: parseFloat(plan.discount) || 0,
            description: plan.description
        })));
    };

    // Handle file upload
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const file = e.target.files?.[0];
        if (file) {
            setValue('media', file);
        }
    };

    // Form submission
    const onSubmit = async (data: ServiceFormData): Promise<void> => {
        // Validate plans
        if (plans.length === 0) {
            toast.error('Please add at least one plan');
            return;
        }

        // Validate availability slots
        if (availabilitySlots.length === 0) {
            toast.error('Please add at least one availability slot');
            return;
        }

        // Validate slot times
        for (const slot of availabilitySlots) {
            if (slot.start_time >= slot.end_time) {
                toast.error('End time must be after start time for all slots');
                return;
            }
        }

        setLoading(true);

        try {
            const formData = new FormData();

            // Append basic fields
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('long_description', data.long_description || '');

            // Append media file if exists
            if (data.media) {
                formData.append('media', data.media);
            }

            // Append plans as JSON string
            formData.append('cost_discount', JSON.stringify(data.cost_discount));

            // Append availability slots as JSON string - use the correct field name
            // Based on the serializer, it should be 'availability_slots_write'
            const availabilityData = availabilitySlots.map(slot => ({
                day_of_week: slot.day_of_week,
                start_time: slot.start_time,
                end_time: slot.end_time
            }));
            formData.append('availability_slots_write', JSON.stringify(availabilityData));

            console.log('Sending data:', {
                name: data.name,
                description: data.description,
                cost_discount: data.cost_discount,
                availability_slots: availabilityData
            });

            const response = await api.put(`/services/${serviceId}/update/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Service updated successfully!');
            setIsEditMode(false);
            await fetchService(); // Refresh data

        } catch (error: any) {
            console.error('Error updating service:', error);
            console.error('Error response:', error.response?.data);

            const errorMessage = error.response?.data?.message
                || error.response?.data?.detail
                || error.response?.data?.availability_slots_write
                || 'Failed to update service';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = (): void => {
        if (isEditMode) {
            setIsEditMode(false);
            // Reset form with original service data
            if (service) {
                setValue('name', service.name || '');
                setValue('description', service.description || '');
                setValue('long_description', service.long_description || '');

                const slots = service.availability_slots || [];
                setAvailabilitySlots(slots.map(slot => ({
                    ...slot,
                    id: slot.id || `slot-${Date.now()}-${Math.random()}`
                })));

                const costDiscount = service.cost_discount || [];
                const plansData: Plan[] = costDiscount.map((plan, index) => ({
                    id: `plan-${index}-${Date.now()}`,
                    plan: plan.plan || '',
                    cost: plan.cost?.toString() || '0',
                    discount: plan.discount?.toString() || '0',
                    description: plan.description || ''
                }));
                setPlans(plansData);
                setValue('cost_discount', costDiscount);
            }
        } else {
            router.back();
        }
    };

    // Format currency
    const formatCurrency = (value: string): string => {
        const num = parseFloat(value);
        return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
    };

    if (fetching) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-4xl">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading service...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="container mx-auto py-8 px-4 max-w-4xl">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
                    <p className="text-gray-600 mb-6">The service you're looking for doesn't exist.</p>
                    <Button onClick={() => router.push('/pages/admin/services')}>
                        Back to Services
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 max-w-4xl">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                        {isEditMode ? 'Edit Service' : 'Service Details'}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {isEditMode
                            ? 'Update your service details, pricing plans, and availability.'
                            : 'View and manage your service details.'
                        }
                    </p>
                </div>
                {!isEditMode && (
                    <Button onClick={() => setIsEditMode(true)}>
                        Edit Service
                    </Button>
                )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                        <CardDescription>
                            {isEditMode ? 'Update the basic details about your service.' : 'Basic service details.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                                Service Name *
                            </Label>
                            <Input
                                id="name"
                                type="text"
                                {...register('name', { required: 'Service name is required' })}
                                className="mt-1"
                                placeholder="e.g., Web Development, Consulting"
                                disabled={!isEditMode}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                                Short Description *
                            </Label>
                            <Textarea
                                id="description"
                                {...register('description', { required: 'Description is required' })}
                                className="mt-1"
                                rows={3}
                                placeholder="Brief description of your service..."
                                disabled={!isEditMode}
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="long_description" className="text-sm font-medium text-gray-700">
                                Detailed Description
                            </Label>
                            <Textarea
                                id="long_description"
                                {...register('long_description')}
                                className="mt-1"
                                rows={5}
                                placeholder="Detailed information about your service, features, benefits..."
                                disabled={!isEditMode}
                            />
                        </div>

                        {isEditMode && (
                            <div>
                                <Label htmlFor="media" className="text-sm font-medium text-gray-700">
                                    Service Image
                                </Label>
                                <Input
                                    id="media"
                                    type="file"
                                    accept="image/*,.pdf,.doc,.docx"
                                    onChange={handleFileChange}
                                    className="mt-1"
                                />
                                <p className="text-sm text-gray-500 mt-1">
                                    Upload an image or document related to your service
                                </p>
                            </div>
                        )}

                        {service.media && !isEditMode && (
                            <div>
                                <Label className="text-sm font-medium text-gray-700">
                                    Current Media
                                </Label>
                                <div className="mt-1">
                                    <a
                                        href={service.media}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                        View Media File
                                    </a>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Pricing Plans Card */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Pricing Plans</CardTitle>
                                <CardDescription>
                                    {isEditMode ? 'Define different pricing plans for your service.' : 'Current pricing plans.'}
                                </CardDescription>
                            </div>
                            {isEditMode && (
                                <Button type="button" onClick={addPlan} variant="outline">
                                    Add Plan
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {plans.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No plans added yet.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {plans.map((plan, index) => (
                                    <div key={plan.id} className="border rounded-lg p-4 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-medium">Plan {index + 1}</h4>
                                            {isEditMode && (
                                                <Button
                                                    type="button"
                                                    onClick={() => removePlan(index)}
                                                    variant="destructive"
                                                    size="sm"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <Label htmlFor={`plan-${index}-name`}>Plan Name</Label>
                                                {isEditMode ? (
                                                    <Input
                                                        id={`plan-${index}-name`}
                                                        value={plan.plan}
                                                        onChange={(e) => updatePlan(index, 'plan', e.target.value)}
                                                        placeholder="e.g., Basic, Premium, Enterprise"
                                                    />
                                                ) : (
                                                    <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{plan.plan || 'No name'}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor={`plan-${index}-cost`}>Cost ($)</Label>
                                                {isEditMode ? (
                                                    <Input
                                                        id={`plan-${index}-cost`}
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={plan.cost}
                                                        onChange={(e) => updatePlan(index, 'cost', e.target.value)}
                                                        placeholder="0.00"
                                                    />
                                                ) : (
                                                    <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{formatCurrency(plan.cost)}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor={`plan-${index}-discount`}>Discount ($)</Label>
                                                {isEditMode ? (
                                                    <Input
                                                        id={`plan-${index}-discount`}
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        value={plan.discount}
                                                        onChange={(e) => updatePlan(index, 'discount', e.target.value)}
                                                        placeholder="0.00"
                                                    />
                                                ) : (
                                                    <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{formatCurrency(plan.discount)}</p>
                                                )}
                                            </div>

                                            <div className="md:col-span-2">
                                                <Label htmlFor={`plan-${index}-description`}>Description</Label>
                                                {isEditMode ? (
                                                    <Input
                                                        id={`plan-${index}-description`}
                                                        value={plan.description}
                                                        onChange={(e) => updatePlan(index, 'description', e.target.value)}
                                                        placeholder="Describe what this plan includes..."
                                                    />
                                                ) : (
                                                    <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{plan.description || 'No description'}</p>
                                                )}
                                            </div>
                                        </div>

                                        {plan.cost && (
                                            <div className="text-sm font-medium text-green-600">
                                                Final Price: {formatCurrency((parseFloat(plan.cost) - (parseFloat(plan.discount) || 0)).toString())}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Availability Slots Card */}
                {/* <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>Availability Slots</CardTitle>
                                <CardDescription>
                                    {isEditMode ? 'Define when your service is available for booking.' : 'Current availability schedule.'}
                                </CardDescription>
                            </div>
                            {isEditMode && (
                                <Button type="button" onClick={addAvailabilitySlot} variant="outline">
                                    Add Slot
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {availabilitySlots.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No availability slots added yet.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {availabilitySlots.map((slot, index) => (
                                    <div key={slot.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-3">
                                            <h4 className="font-medium">Slot {index + 1}</h4>
                                            {isEditMode && (
                                                <Button
                                                    type="button"
                                                    onClick={() => removeAvailabilitySlot(index)}
                                                    variant="destructive"
                                                    size="sm"
                                                >
                                                    Remove
                                                </Button>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div>
                                                <Label htmlFor={`slot-${index}-day`}>Day of Week</Label>
                                                {isEditMode ? (
                                                    <Select
                                                        value={slot.day_of_week}
                                                        onValueChange={(value) => updateAvailabilitySlot(index, 'day_of_week', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {daysOfWeek.map(day => (
                                                                <SelectItem key={day.value} value={day.value}>
                                                                    {day.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <p className="text-sm mt-1 p-2 bg-gray-50 rounded">
                                                        {daysOfWeek.find(d => d.value === slot.day_of_week)?.label || slot.day_of_week}
                                                    </p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor={`slot-${index}-start`}>Start Time</Label>
                                                {isEditMode ? (
                                                    <Select
                                                        value={slot.start_time}
                                                        onValueChange={(value) => updateAvailabilitySlot(index, 'start_time', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {timeOptions.map(time => (
                                                                <SelectItem key={time} value={time}>
                                                                    {time}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{slot.start_time}</p>
                                                )}
                                            </div>

                                            <div>
                                                <Label htmlFor={`slot-${index}-end`}>End Time</Label>
                                                {isEditMode ? (
                                                    <Select
                                                        value={slot.end_time}
                                                        onValueChange={(value) => updateAvailabilitySlot(index, 'end_time', value)}
                                                    >
                                                        <SelectTrigger>
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {timeOptions.map(time => (
                                                                <SelectItem key={time} value={time}>
                                                                    {time}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <p className="text-sm mt-1 p-2 bg-gray-50 rounded">{slot.end_time}</p>
                                                )}
                                            </div>
                                        </div>

                                        {isEditMode && slot.start_time && slot.end_time && slot.start_time >= slot.end_time && (
                                            <p className="text-red-500 text-sm mt-2">
                                                End time must be after start time
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card> */}

                {/* Action Buttons */}
                {isEditMode && (
                    <div className="flex justify-end space-x-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Updating Service...' : 'Update Service'}
                        </Button>
                    </div>
                )}
            </form>

            {!isEditMode && (
                <div className="flex justify-end mt-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                    >
                        Back to Services
                    </Button>
                </div>
            )}
        </div>
    );
};

export default AdminServiceEdit;