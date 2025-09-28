"use client"
import React, { useState } from 'react';
import { useForm, useFieldArray, SubmitHandler } from 'react-hook-form';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Calendar, Clock, Zap, Info, DollarSign, Upload } from 'lucide-react';
import apiClient from '@/lib/api';

type AvailabilityInput = {
  daySelection: string;
  startTime: string;
  endTime: string;
};
export interface CostPlan {
  plan: string;
  cost: number;
  discount: number;
  description: string;
}
export interface AvailabilitySlot {
  day_of_week: 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';
  start_time: string;
  end_time: string;
}

export interface ServiceFormData {
  name: string;
  description: string;
  long_description?: string;
  media?: FileList;
  cost_discount: CostPlan[];
  availability_slots: AvailabilitySlot[];
}

const dayOptions = [
  { value: 'MON-FRI', label: 'Weekdays (Mon-Fri)' },
  { value: 'WEEKEND', label: 'Weekends (Sat-Sun)' },
  { value: 'MON', label: 'Monday' },
  { value: 'TUE', label: 'Tuesday' },
  { value: 'WED', label: 'Wednesday' },
  { value: 'THU', label: 'Thursday' },
  { value: 'FRI', label: 'Friday' },
  { value: 'SAT', label: 'Saturday' },
  { value: 'SUN', label: 'Sunday' },
] as const;

const dayLabels: Record<string, string> = {
  MON: "Monday", TUE: "Tuesday", WED: "Wednesday", THU: "Thursday",
  FRI: "Friday", SAT: "Saturday", SUN: "Sunday",
};

const ServiceCreateForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availabilityInput, setAvailabilityInput] = useState<AvailabilityInput>({
    daySelection: 'MON-FRI',
    startTime: '09:00',
    endTime: '17:00',
  });

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ServiceFormData>({
    defaultValues: {
      name: '',
      description: '',
      long_description: '',
      cost_discount: [{ plan: 'basic', cost: 0, discount: 0, description: '' }],
      availability_slots: [],
    },
  });

  const { fields: costFields, append: appendCost, remove: removeCost } = useFieldArray({
    control,
    name: 'cost_discount',
  });

  const { fields: availabilityFields, append: appendAvailability, remove: removeAvailability } = useFieldArray({
    control,
    name: 'availability_slots',
  });

  const handleAddAvailability = () => {
    const { daySelection, startTime, endTime } = availabilityInput;
    
    if (!startTime || !endTime) {
      toast.error('Please select both start and end time');
      return;
    }

    if (startTime >= endTime) {
      toast.error('End time must be after start time');
      return;
    }

    let daysToAdd: AvailabilitySlot['day_of_week'][] = [];

    switch (daySelection) {
      case 'MON-FRI':
        daysToAdd = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
        break;
      case 'WEEKEND':
        daysToAdd = ['SAT', 'SUN'];
        break;
      default:
        daysToAdd = [daySelection as AvailabilitySlot['day_of_week']];
        break;
    }

    // Check for duplicates
    const existingSlots = watch('availability_slots');
    const newSlots: AvailabilitySlot[] = [];

    daysToAdd.forEach(day => {
      const isDuplicate = existingSlots.some(slot => 
        slot.day_of_week === day && 
        slot.start_time === startTime && 
        slot.end_time === endTime
      );

      if (!isDuplicate) {
        newSlots.push({
          day_of_week: day,
          start_time: startTime,
          end_time: endTime,
        });
      }
    });

    if (newSlots.length === 0) {
      toast.warning('All selected time slots already exist');
      return;
    }

    newSlots.forEach(slot => appendAvailability(slot));
    toast.success(`Added ${newSlots.length} availability slot(s)`);
  };

  const onSubmit: SubmitHandler<ServiceFormData> = async (data) => {
    setIsSubmitting(true);

    if (data.availability_slots.length === 0) {
      toast.error('Please add at least one availability slot');
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    
    // Append simple fields
    formData.append('name', data.name);
    formData.append('description', data.description);
    
    if (data.long_description) {
      formData.append('long_description', data.long_description);
    }
    
    if (data.media && data.media.length > 0) {
      formData.append('media', data.media[0]);
    }

    // FIX: Append arrays correctly - don't stringify the entire array
    data.cost_discount.forEach((costPlan, index) => {
      formData.append(`cost_discount[${index}].plan`, costPlan.plan);
      formData.append(`cost_discount[${index}].cost`, costPlan.cost.toString());
      formData.append(`cost_discount[${index}].discount`, costPlan.discount.toString());
      formData.append(`cost_discount[${index}].description`, costPlan.description);
    });

    data.availability_slots.forEach((slot, index) => {
      formData.append(`availability_slots[${index}].day_of_week`, slot.day_of_week);
      formData.append(`availability_slots[${index}].start_time`, slot.start_time);
      formData.append(`availability_slots[${index}].end_time`, slot.end_time);
    });

    // Alternative approach if the above doesn't work with your backend:
    // formData.append('cost_discount', JSON.stringify(data.cost_discount));
    // formData.append('availability_slots', JSON.stringify(data.availability_slots));

    try {
      const response = await apiClient.post('/services/create/', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        toast.success('Service created successfully!');
        reset();
        setAvailabilityInput({
          daySelection: 'MON-FRI',
          startTime: '09:00',
          endTime: '17:00',
        });
      }
    } catch (error: any) {
      console.error('Failed to create service:', error);
      
      // Enhanced error logging
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
        
        if (error.response.data.availability_slots) {
          toast.error('Invalid availability slots format. Please check the data.');
        } else if (error.response.data.cost_discount) {
          toast.error('Invalid pricing format. Please check the data.');
        } else {
          toast.error(error.response.data?.detail || error.response.data?.message || 'An unexpected error occurred.');
        }
      } else if (error.request) {
        toast.error('No response received from server. Please try again.');
      } else {
        toast.error('An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="container mx-auto max-w-4xl py-6 px-4">
      <Card className="shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/10 via-blue-50 to-purple-50 dark:from-primary/20 dark:via-blue-900/20 dark:to-purple-900/20 text-center pb-6 border-b">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Create New Service
            </CardTitle>
          </div>
          <CardDescription className="text-sm text-muted-foreground">
            Build your service offering with flexible availability and pricing options
          </CardDescription>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
            {/* Basic Information Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1.5 h-5 bg-primary rounded-full"></div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Basic Information
                </h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium flex items-center gap-1">
                      Service Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      {...register('name', { required: 'Service name is required' })}
                      placeholder="e.g., Consulting Session, Web Development"
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="text-sm font-medium flex items-center gap-1">
                      Short Description <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      {...register('description', { required: 'Description is required' })}
                      placeholder="Brief overview of your service"
                      className={errors.description ? 'border-destructive' : 'min-h-[80px]'}
                    />
                    {errors.description && (
                      <p className="text-xs text-destructive flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        {errors.description.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="long_description" className="text-sm font-medium">
                      Detailed Description
                    </Label>
                    <Textarea
                      id="long_description"
                      {...register('long_description')}
                      placeholder="Comprehensive details, requirements, and what clients can expect"
                      className="min-h-[100px]"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="media" className="text-sm font-medium flex items-center gap-1">
                      <Upload className="h-3 w-3" />
                      Service Image
                    </Label>
                    <div className="border-2 border-dashed border-muted-foreground/20 rounded-lg p-4 transition-colors hover:border-primary/30">
                      <Input
                        id="media"
                        type="file"
                        accept="image/*"
                        {...register('media')}
                        className="cursor-pointer border-0 p-0 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Availability Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-primary" />
                <h3 className="text-lg font-semibold">Availability Settings</h3>
              </div>

              <Card className="bg-muted/30 border-0">
                <CardContent className="p-5">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div className="space-y-2">
                        <Label htmlFor="day-selection" className="text-sm">Day Selection</Label>
                        <Select
                          value={availabilityInput.daySelection}
                          onValueChange={(value) => setAvailabilityInput(prev => ({ ...prev, daySelection: value }))}
                        >
                          <SelectTrigger className="h-10">
                            <SelectValue placeholder="Select days" />
                          </SelectTrigger>
                          <SelectContent>
                            {dayOptions.map(option => (
                              <SelectItem key={option.value} value={option.value} className="text-sm">
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="start-time" className="text-sm">Start Time</Label>
                        <Input
                          id="start-time"
                          type="time"
                          value={availabilityInput.startTime}
                          onChange={(e) => setAvailabilityInput(prev => ({ ...prev, startTime: e.target.value }))}
                          className="h-10"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="end-time" className="text-sm">End Time</Label>
                        <Input
                          id="end-time"
                          type="time"
                          value={availabilityInput.endTime}
                          onChange={(e) => setAvailabilityInput(prev => ({ ...prev, endTime: e.target.value }))}
                          className="h-10"
                        />
                      </div>

                      <div className="flex items-end">
                        <Button
                          type="button"
                          onClick={handleAddAvailability}
                          className="w-full h-10"
                          variant="secondary"
                        >
                          <Plus className="h-3.5 w-3.5 mr-1.5" />
                          Add Slots
                        </Button>
                      </div>
                    </div>

                    {/* Availability List */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Added Time Slots ({availabilityFields.length})</Label>
                      {availabilityFields.length === 0 ? (
                        <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg bg-background/50">
                          <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No availability slots added yet</p>
                          <p className="text-xs mt-1">Add your first time slot above</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1">
                          {availabilityFields.map((field, index) => (
                            <div key={field.id} className="flex items-center justify-between p-2.5 bg-background border rounded-lg hover:bg-muted/50 transition-colors">
                              <div className="flex items-center gap-2">
                                <Badge variant="secondary" className="text-xs font-medium px-2 py-1">
                                  {dayLabels[field.day_of_week]}
                                </Badge>
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(field.start_time)} - {formatTime(field.end_time)}
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 hover:bg-destructive/10 hover:text-destructive"
                                onClick={() => {
                                  removeAvailability(index);
                                  toast.info('Time slot removed');
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>

            {/* Cost Plans Section */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="h-4 w-4 text-primary" />
                <h3 className="text-lg font-semibold">Pricing Plans</h3>
              </div>
              
              <div className="space-y-3">
                {costFields.map((field, index) => (
                  <Card key={field.id} className="bg-muted/20 border-0">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <Label htmlFor={`cost-${index}-plan`} className="text-sm font-medium">
                              Plan Name <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id={`cost-${index}-plan`}
                              {...register(`cost_discount.${index}.plan`, { 
                                required: 'Plan name is required' 
                              })}
                              placeholder="e.g., Basic, Premium, Enterprise"
                              className="h-9"
                            />
                            {errors.cost_discount?.[index]?.plan && (
                              <p className="text-xs text-destructive flex items-center gap-1">
                                <Info className="h-3 w-3" />
                                {errors.cost_discount[index]?.plan?.message}
                              </p>
                            )}
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor={`cost-${index}-cost`} className="text-sm font-medium">
                              Cost ($) <span className="text-destructive">*</span>
                            </Label>
                            <Input
                              id={`cost-${index}-cost`}
                              type="number"
                              step="0.01"
                              min="0"
                              {...register(`cost_discount.${index}.cost`, { 
                                required: 'Cost is required',
                                min: { value: 0, message: 'Cost must be positive' }
                              })}
                              className="h-9"
                            />
                            {errors.cost_discount?.[index]?.cost && (
                              <p className="text-xs text-destructive flex items-center gap-1">
                                <Info className="h-3 w-3" />
                                {errors.cost_discount[index]?.cost?.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="space-y-1.5">
                            <Label htmlFor={`cost-${index}-discount`} className="text-sm font-medium">
                              Discount (%)
                            </Label>
                            <Input
                              id={`cost-${index}-discount`}
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              {...register(`cost_discount.${index}.discount`, {
                                min: { value: 0, message: 'Discount cannot be negative' },
                                max: { value: 100, message: 'Discount cannot exceed 100%' }
                              })}
                              className="h-9"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <Label htmlFor={`cost-${index}-description`} className="text-sm font-medium">
                              Plan Description
                            </Label>
                            <Input
                              id={`cost-${index}-description`}
                              {...register(`cost_discount.${index}.description`)}
                              placeholder="What's included in this plan?"
                              className="h-9"
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-end mt-3">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() => {
                            if (costFields.length > 1) {
                              removeCost(index);
                              toast.info('Plan removed');
                            } else {
                              toast.error('At least one pricing plan is required');
                            }
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Remove Plan
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendCost({ plan: '', cost: 0, discount: 0, description: '' })}
                  className="w-full h-10 text-sm"
                >
                  <Plus className="h-3.5 w-3.5 mr-1.5" />
                  Add Another Pricing Plan
                </Button>
              </div>
            </section>

            {/* Submit Section */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t">
              <div className="text-xs text-muted-foreground space-y-1">
                {availabilityFields.length > 0 && (
                  <p className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    {availabilityFields.length} time slot(s) configured
                  </p>
                )}
                {costFields.length > 0 && (
                  <p className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    {costFields.length} pricing plan(s) added
                  </p>
                )}
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="min-w-32 h-10 px-6 text-sm font-medium transition-all hover:shadow-lg"
                size="default"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-b-2 border-current mr-2" />
                    Creating Service...
                  </>
                ) : (
                  'Create Service'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceCreateForm;