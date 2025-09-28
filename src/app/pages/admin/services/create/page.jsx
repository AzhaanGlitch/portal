'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import api from '@/lib/api';

// Shadcn components (assuming you have these installed)
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AdminServiceCreate = () => {
  const [loading, setLoading] = useState(false);
  const [availabilitySlots, setAvailabilitySlots] = useState([]);
  const [plans, setPlans] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm({
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

  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push(timeString);
    }
  }

  // Add new availability slot
  const addAvailabilitySlot = () => {
    setAvailabilitySlots([
      ...availabilitySlots,
      { day_of_week: 'MON', start_time: '09:00', end_time: '17:00', id: Date.now() }
    ]);
  };

  // Update availability slot
  const updateAvailabilitySlot = (index, field, value) => {
    const updatedSlots = [...availabilitySlots];
    updatedSlots[index][field] = value;
    setAvailabilitySlots(updatedSlots);
  };

  // Remove availability slot
  const removeAvailabilitySlot = (index) => {
    setAvailabilitySlots(availabilitySlots.filter((_, i) => i !== index));
  };

  // Add new plan
  const addPlan = () => {
    setPlans([
      ...plans,
      { plan: '', cost: '', discount: '', description: '', id: Date.now() }
    ]);
  };

  // Update plan
  const updatePlan = (index, field, value) => {
    const updatedPlans = [...plans];
    updatedPlans[index][field] = value;
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
  const removePlan = (index) => {
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
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue('media', file);
    }
  };

  // Form submission
  const onSubmit = async (data) => {
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

      // Append plans as JSON
      formData.append('cost_discount', JSON.stringify(data.cost_discount));

      // Append availability slots as JSON
      formData.append('availability_slots', JSON.stringify(availabilitySlots.map(slot => ({
        day_of_week: slot.day_of_week,
        start_time: slot.start_time,
        end_time: slot.end_time
      }))));

      const response = await api.post('/services/create/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Service created successfully!');
      reset();
      setPlans([]);
      setAvailabilitySlots([]);
      
      // Redirect to services list or show success message
      setTimeout(() => {
        window.location.href = '/pages/admin/services';
      }, 2000);

    } catch (error) {
      console.error('Error creating service:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create service';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Service</h1>
        <p className="text-gray-600 mt-2">
          Add a new service to your platform with availability slots and pricing plans.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>
              Enter the basic details about your service.
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
              />
            </div>

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
          </CardContent>
        </Card>

        {/* Pricing Plans Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Pricing Plans</CardTitle>
                <CardDescription>
                  Define different pricing plans for your service.
                </CardDescription>
              </div>
              <Button type="button" onClick={addPlan} variant="outline">
                Add Plan
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {plans.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No plans added yet. Click "Add Plan" to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {plans.map((plan, index) => (
                  <div key={plan.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">Plan {index + 1}</h4>
                      <Button
                        type="button"
                        onClick={() => removePlan(index)}
                        variant="destructive"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`plan-${index}-name`}>Plan Name *</Label>
                        <Input
                          id={`plan-${index}-name`}
                          value={plan.plan}
                          onChange={(e) => updatePlan(index, 'plan', e.target.value)}
                          placeholder="e.g., Basic, Premium, Enterprise"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`plan-${index}-cost`}>Cost ($) *</Label>
                        <Input
                          id={`plan-${index}-cost`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={plan.cost}
                          onChange={(e) => updatePlan(index, 'cost', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`plan-${index}-discount`}>Discount ($)</Label>
                        <Input
                          id={`plan-${index}-discount`}
                          type="number"
                          min="0"
                          step="0.01"
                          value={plan.discount}
                          onChange={(e) => updatePlan(index, 'discount', e.target.value)}
                          placeholder="0.00"
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor={`plan-${index}-description`}>Description</Label>
                        <Input
                          id={`plan-${index}-description`}
                          value={plan.description}
                          onChange={(e) => updatePlan(index, 'description', e.target.value)}
                          placeholder="Describe what this plan includes..."
                        />
                      </div>
                    </div>

                    {plan.cost && (
                      <div className="text-sm text-gray-600">
                        Final Price: ${(parseFloat(plan.cost) - (parseFloat(plan.discount) || 0)).toFixed(2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Availability Slots Card */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Availability Slots</CardTitle>
                <CardDescription>
                  Define when your service is available for booking.
                </CardDescription>
              </div>
              <Button type="button" onClick={addAvailabilitySlot} variant="outline">
                Add Slot
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {availabilitySlots.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No availability slots added yet. Click "Add Slot" to get started.
              </div>
            ) : (
              <div className="space-y-4">
                {availabilitySlots.map((slot, index) => (
                  <div key={slot.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-medium">Slot {index + 1}</h4>
                      <Button
                        type="button"
                        onClick={() => removeAvailabilitySlot(index)}
                        variant="destructive"
                        size="sm"
                      >
                        Remove
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`slot-${index}-day`}>Day of Week</Label>
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
                      </div>

                      <div>
                        <Label htmlFor={`slot-${index}-start`}>Start Time</Label>
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
                      </div>

                      <div>
                        <Label htmlFor={`slot-${index}-end`}>End Time</Label>
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
                      </div>
                    </div>

                    {slot.start_time && slot.end_time && slot.start_time >= slot.end_time && (
                      <p className="text-red-500 text-sm mt-2">
                        End time must be after start time
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating Service...' : 'Create Service'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminServiceCreate;