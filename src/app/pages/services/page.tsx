'use client';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, Clock, AlertCircle, Info, Moon, Sun, ExternalLink } from 'lucide-react';
import * as THREE from 'three';
import FOG from 'vanta/dist/vanta.fog.min';

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
    media: string | null;
    availability_map: Record<string, string>;
    cost_discount: CostDiscount[];
    created_at: string;
    updated_at: string;
    admin: number;
}

const ServicesPage: React.FC = () => {
    const { isAuthenticated } = useAuth();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const [vantaEffect, setVantaEffect] = useState<any>(null);
    const vantaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!vantaEffect && vantaRef.current) {
            setVantaEffect(
                FOG({
                    el: vantaRef.current,
                    THREE: THREE,
                    mouseControls: true,
                    touchControls: true,
                    gyroControls: false,
                    minHeight: 200.00,
                    minWidth: 200.00,
                    highlightColor: 0x345c86,
                    midtoneColor: 0x5a6f,
                    baseColor: 0x1a3342,
                    blurFactor: 0.49,
                    speed: 1.80,
                    zIndex: -1 // Ensure background stays behind content
                })
            );
        }
        return () => {
            if (vantaEffect) vantaEffect.destroy();
        };
    }, [vantaEffect]);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await api.get<Service[]>('/services/list/');
            setServices(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleStartService = (serviceId: number) => {
        if (!isAuthenticated) {
            alert('You must be logged in to access this service');
            return;
        }
        alert(`Service ${serviceId} will start soon!`);
    };

    if (loading) {
        return (
            <div className="relative min-h-screen bg-gray-900">
                <div ref={vantaRef} className="absolute inset-0 z-0" />
                <div className="container mx-auto py-8 px-4 relative z-10 min-h-screen">
                    <div className="flex flex-col gap-8 mt-10">
                        <div className="text-center mb-8">
                            <Skeleton className='h-10 w-80 mx-auto mb-4 bg-gray-700' />
                            <Skeleton className='h-6 w-96 mx-auto bg-gray-700' />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <Card key={i} className='overflow-hidden transition-all duration-300 bg-gray-800 border-gray-700'>
                                    <CardHeader>
                                        <Skeleton className='h-6 w-3/4 mb-2 bg-gray-700' />
                                        <Skeleton className='h-4 w-full bg-gray-700' />
                                    </CardHeader>
                                    <CardContent>
                                        <Skeleton className='h-4 w-full mb-2 bg-gray-700' />
                                        <Skeleton className='h-4 w-2/3 mb-4 bg-gray-700' />
                                        <Skeleton className='h-4 w-1/2 mb-2 bg-gray-700' />
                                        <Skeleton className='h-4 w-3/4 bg-gray-700' />
                                    </CardContent>
                                    <CardFooter>
                                        <Skeleton className='h-10 w-full bg-gray-700' />
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="relative min-h-screen bg-gray-900">
                <div ref={vantaRef} className="absolute inset-0 z-0" />
                <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center relative z-10">
                    <Alert variant="destructive" className="max-w-md">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                            {error}
                        </AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <div className="relative min-h-screen bg-gray-900">
            <div ref={vantaRef} className="absolute inset-0 z-0" />
            <div className="container mx-auto px-10 py-8 relative z-10 min-h-screen">
                <br />

                <div className="mt-10 mb-12 text-center">
                    <h1 className='text-4xl font-bold tracking-tight mb-4 text-white'>Our Services</h1>
                    <p className='text-xl max-w-3xl mx-auto text-gray-300'>
                        Discover our range of upcoming services. We're working hard to bring you the best experience.
                    </p>
                </div>

                <Alert className='mb-10 transition-colors duration-300 bg-blue-900/20 border-blue-800'>
                    <Info className='h-4 w-4 text-blue-400' />
                    <AlertTitle className='text-blue-300'>Services Coming Soon</AlertTitle>
                    <AlertDescription className='text-blue-200' >
                        Our services are currently in development and will be available shortly. Stay tuned for updates!
                    </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <Card key={service.id} className='flex flex-col overflow-hidden hover:shadow-lg transition-all duration-300 bg-gray-800 border-gray-700 hover:border-blue-500'>
                            <div className='h-48 flex items-center justify-center relative overflow-hidden bg-gradient-to-r from-blue-900/30 to-purple-900/30'>
                                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                                <div className="text-center p-4 z-10">
                                    <div className='w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-blue-900/30'>
                                        <Clock className='h-8 w-8 text-blue-400' />
                                    </div>
                                    <Badge variant="outline" className='bg-gray-700/80 text-blue-300 border-blue-500/30 backdrop-blur-sm'>
                                        Coming Soon
                                    </Badge>
                                </div>
                            </div>

                            <CardHeader>
                                <CardTitle className='text-2xl text-white'>{service.name}</CardTitle>
                                <CardDescription className='text-gray-400'>{service.description}</CardDescription>
                            </CardHeader>

                            <CardContent className="flex-grow">
                                <div className="mb-6">
                                    <h3 className='font-semibold mb-2 flex items-center gap-2 text-gray-200'>
                                        <Calendar className="h-4 w-4" />
                                        Availability
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {Object.entries(service.availability_map || {}).map(
                                            ([day, time]) => (
                                                <div key={day} className='flex justify-between items-center py-1 border-b border-gray-700'>
                                                    <span className='font-medium text-gray-300'>{day}:</span>
                                                    <span className='text-gray-400'>{time}</span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className='font-semibold mb-2 text-gray-200'>Pricing Plans</h3>
                                    <div className="space-y-3">
                                        {service.cost_discount?.map((price) => (
                                            <div key={price.plan} className='flex justify-between items-center p-3 rounded-lg bg-gray-700'>
                                                <span className='font-medium text-gray-200'>{price.plan}</span>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-2">
                                                        {price.discount > 0 && (
                                                            <span className='text-sm line-through text-gray-500'>
                                                                ${(price.cost / (1 - price.discount / 100)).toFixed(2)}
                                                            </span>
                                                        )}
                                                        <span className='font-bold text-white'>${price.cost}</span>
                                                    </div>
                                                    {price.discount > 0 && (
                                                        <Badge variant="secondary" className='mt-1 bg-green-800/30 text-green-300 border-green-700'>
                                                            Save {price.discount}%
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    onClick={() => handleStartService(service.id)}
                                    disabled={!isAuthenticated}
                                    className="w-full group"
                                    size="lg"
                                    variant="secondary" 
                                >
                                    {isAuthenticated ? (
                                        <>
                                            Available Soon
                                            <ExternalLink className="ml-2 h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </>
                                    ) : (
                                        'Login Required'
                                    )}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {services.length === 0 && (
                    <div className="text-center py-12">
                        <div className='rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 bg-gray-800'>
                            <AlertCircle className='h-12 w-12 text-gray-600'  />
                        </div>
                        <h3 className='text-2xl font-semibold mb-2 text-white'>No Services Available</h3>
                        <p className='text-gray-400' >
                            Check back later for our upcoming services.
                        </p>
                    </div>
                )}

                <style jsx>{`
                    .bg-grid-pattern {
                        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
                    }
                    
                    .dark .bg-grid-pattern {
                        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
                    }
                `}</style>
                <br />
                <br /><br /><br />
            </div>
        </div>
    );
};

export default ServicesPage;