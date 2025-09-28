'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Calendar, Clock, AlertCircle, Info, ExternalLink, X, Bookmark, DollarSign, CheckCircle2, IndianRupee } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface CostDiscount {
    plan: string;
    cost: number;
    discount: number;
    description?: string;
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedService, setSelectedService] = useState<Service | null>(null);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        try {
            setLoading(true);
            const response = await api.get<Service[]>('/services/list/');
            setServices(response.data);
            setError('');
        } catch (err: any) {
            setError(err.message || 'Failed to load services.');
        } finally {
            setLoading(false);
        }
    };

    const handleBookService = (service: Service, plan?: CostDiscount) => {
        if (!isAuthenticated) {
            alert('You must be logged in to book this service');
            return;
        }
        const planInfo = plan ? ` (${plan.plan} plan)` : '';
        alert(`Booking ${service.name}${planInfo} - We'll contact you soon!`);
        closeOverlay();
    };

    const openOverlay = (service: Service) => {
        setSelectedService(service);
        setIsOverlayOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeOverlay = () => {
        setIsOverlayOpen(false);
        setTimeout(() => setSelectedService(null), 300);
        document.body.style.overflow = 'unset';
    };

    // Loading skeleton
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-900/20 p-8">
                <div className="max-w-7xl mx-auto">
                    <Skeleton className="h-12 w-64 mb-2" />
                    <Skeleton className="h-6 w-96 mb-12" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <Skeleton key={i} className="h-80 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-900/20 p-8">
                <div className="max-w-7xl mx-auto">
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-900/20 mt-24">
            <div className="max-w-7xl mx-auto p-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        Our Services
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Discover our comprehensive range of professional services designed to bring your ideas to life
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map(service => (
                        <Card 
                            key={service.id} 
                            className="group cursor-pointer bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-400/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                        >
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {service.name}
                                    </CardTitle>
                                    <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                                        Available
                                    </Badge>
                                </div>
                                <CardDescription className="text-base text-gray-600 dark:text-gray-400 line-clamp-2">
                                    {service.description}
                                </CardDescription>
                            </CardHeader>
                            
                            <CardContent className="pb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                                    <Calendar className="w-4 h-4" />
                                    <span>Flexible scheduling</span>
                                </div>
                                
                                {/* Pricing preview */}
                                {service.cost_discount && service.cost_discount.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <IndianRupee className="w-4 h-4 text-green-600" />
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            Starting at ₹{service.cost_discount[0].cost}
                                        </span>
                                        {service.cost_discount[0].discount > 0 && (
                                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                                                {service.cost_discount[0].discount}% OFF
                                            </Badge>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                            
                            <CardFooter className="flex gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                <Button 
                                    variant="outline" 
                                    className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        openOverlay(service);
                                    }}
                                >
                                    <Info className="w-4 h-4 mr-2" />
                                    Details
                                </Button>
                                <Button 
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleBookService(service);
                                    }}
                                    disabled={!isAuthenticated}
                                >
                                    <Bookmark className="w-4 h-4 mr-2" />
                                    {isAuthenticated ? 'Book' : 'Login'}
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Professional Overlay */}
            {selectedService && (
                <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
                    isOverlayOpen ? 'bg-black/50 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-0'
                }`}>
                    <div className={`bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 ${
                        isOverlayOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
                    }`}>
                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                            <button
                                onClick={closeOverlay}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            
                            <div className="pr-12">
                                <h2 className="text-3xl font-bold mb-2">{selectedService.name}</h2>
                                <p className="text-blue-100 text-lg">{selectedService.description}</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
                            <div className="p-8">
                                {/* Markdown Content */}
                                <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                                    <ReactMarkdown
                                        components={{
                                            h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-6" {...props} />,
                                            h2: ({node, ...props}) => <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-5" {...props} />,
                                            h3: ({node, ...props}) => <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 mt-4" {...props} />,
                                            p: ({node, ...props}) => <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed" {...props} />,
                                            ul: ({node, ...props}) => <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1" {...props} />,
                                            ol: ({node, ...props}) => <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1" {...props} />,
                                            li: ({node, ...props}) => <li className="text-gray-700 dark:text-gray-300" {...props} />,
                                            strong: ({node, ...props}) => <strong className="font-bold text-gray-900 dark:text-white" {...props} />,
                                            a: ({node, ...props}) => <a className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline" {...props} />,
                                        }}
                                    >
                                        {selectedService.long_description}
                                    </ReactMarkdown>
                                </div>

                                {/* Pricing Plans Section */}
                                <div className="mb-8">
                                    <h3 className="font-semibold text-2xl mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                                        <IndianRupee className="w-6 h-6 text-green-600" />
                                        Pricing & Booking Plans
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {selectedService.cost_discount?.map((plan, index) => (
                                            <div
                                                key={plan.plan}
                                                className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-400 transition-all duration-300 hover:shadow-lg group"
                                            >
                                                <div className="flex flex-col h-full">
                                                    {/* Plan Header */}
                                                    <div className="flex-1">
                                                        <div className="flex justify-between items-start mb-4">
                                                            <div>
                                                                <h4 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                                    {plan.plan}
                                                                </h4>
                                                                {plan.description && (
                                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                                                                        {plan.description}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            {plan.discount > 0 && (
                                                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm">
                                                                    {plan.discount}% OFF
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        {/* Pricing */}
                                                        <div className="mb-4">
                                                            {plan.discount > 0 && (
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <span className="text-sm line-through text-gray-500 dark:text-gray-400">
                                                                        ₹{(plan.cost / (1 - plan.discount / 100)).toFixed(2)}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div className="flex items-center gap-1">
                                                                <IndianRupee className="w-5 h-5 text-green-600" />
                                                                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                                                    {plan.cost}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Book Button */}
                                                    <Button 
                                                        className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300"
                                                        onClick={() => handleBookService(selectedService, plan)}
                                                        disabled={!isAuthenticated}
                                                        size="lg"
                                                    >
                                                        <Bookmark className="w-4 h-4 mr-2" />
                                                        {isAuthenticated ? `Book ${plan.plan}` : 'Login to Book'}
                                                    </Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Quick Book Section */}
                                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700">
                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle2 className="w-6 h-6 text-green-600" />
                                            <div>
                                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                                    Ready to get started?
                                                </h4>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Book your preferred plan or contact us for custom requirements
                                                </p>
                                            </div>
                                        </div>
                                        <Button 
                                            className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 whitespace-nowrap"
                                            onClick={() => handleBookService(selectedService)}
                                            disabled={!isAuthenticated}
                                            size="lg"
                                        >
                                            <Bookmark className="w-4 h-4 mr-2" />
                                            {isAuthenticated ? 'Quick Book' : 'Login to Book'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
                            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                                    Professional service with guaranteed quality
                                </div>
                                <div className="flex gap-3">
                                    <Button 
                                        variant="outline" 
                                        onClick={closeOverlay}
                                        className="min-w-24"
                                    >
                                        Close
                                    </Button>
                                    <Button 
                                        className="min-w-24 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25"
                                        onClick={() => handleBookService(selectedService)}
                                        disabled={!isAuthenticated}
                                        size="lg"
                                    >
                                        <Bookmark className="w-4 h-4 mr-2" />
                                        {isAuthenticated ? 'Book Now' : 'Login to Book'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServicesPage;