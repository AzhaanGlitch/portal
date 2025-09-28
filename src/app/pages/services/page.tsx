"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import api from "@/lib/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Calendar,
  Clock,
  AlertCircle,
  Info,
  ExternalLink,
  X,
  Bookmark,
  DollarSign,
  CheckCircle2,
  IndianRupee,
  Upload,
  CalendarIcon,
  Image,
  FileQuestion,
  MapPin,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

interface BookingFormData {
  subject: string;
  body: string;
  files: FileList | null;
  selectedPlan: CostDiscount | null;
}

const ServicesPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<
    "details" | "booking" | null
  >(null);
  const [bookingFormData, setBookingFormData] = useState<BookingFormData>({
    subject: "",
    body: "",
    files: null,
    selectedPlan: null,
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get<Service[]>("/services/list/");
      console.log(response);

      // Parse cost_discount if it's a JSON string
      const parsedServices = response.data.map((service) => ({
        ...service,
        cost_discount: parseCostDiscount(service.cost_discount),
        availability_map: parseAvailabilityMap(service.availability_map),
      }));

      console.log("Parsed services:", parsedServices);
      setServices(parsedServices);
      setError("");
    } catch (err: any) {
      setError(
        err.response?.data?.error || err.message || "Failed to load services."
      );
    } finally {
      setLoading(false);
    }
  };

  // Parse cost_discount whether it's JSON string or already an object
  const parseCostDiscount = (costDiscount: any): CostDiscount[] => {
    console.log(
      "Raw cost_discount:",
      costDiscount,
      "Type:",
      typeof costDiscount
    );

    if (!costDiscount) return [];

    try {
      // If it's already an array, return it
      if (Array.isArray(costDiscount)) {
        console.log("Cost discount is already array:", costDiscount);
        return costDiscount.map((plan) => ({
          plan: plan.plan || "Standard",
          cost:
            typeof plan.cost === "string"
              ? parseFloat(plan.cost)
              : plan.cost || 0,
          discount:
            typeof plan.discount === "string"
              ? parseFloat(plan.discount)
              : plan.discount || 0,
          description: plan.description,
        }));
      }

      // If it's a string, parse it as JSON
      if (typeof costDiscount === "string") {
        console.log("Parsing cost_discount string:", costDiscount);
        // Remove any extra quotes or escape characters
        const cleanString = costDiscount
          .replace(/^"+|"+$/g, "")
          .replace(/\\"/g, '"');
        const parsed = JSON.parse(cleanString);
        console.log("Parsed cost_discount:", parsed);
        return Array.isArray(parsed)
          ? parsed.map((plan) => ({
              plan: plan.plan || "Standard",
              cost:
                typeof plan.cost === "string"
                  ? parseFloat(plan.cost)
                  : plan.cost || 0,
              discount:
                typeof plan.discount === "string"
                  ? parseFloat(plan.discount)
                  : plan.discount || 0,
              description: plan.description,
            }))
          : [];
      }

      return [];
    } catch (error) {
      console.error(
        "Error parsing cost_discount:",
        error,
        "Raw value:",
        costDiscount
      );
      return [];
    }
  };

  // Parse availability_map if it's a JSON string
  const parseAvailabilityMap = (
    availabilityMap: any
  ): Record<string, string> => {
    if (!availabilityMap) return {};

    try {
      if (typeof availabilityMap === "string") {
        const cleanString = availabilityMap
          .replace(/^"+|"+$/g, "")
          .replace(/\\"/g, '"');
        return JSON.parse(cleanString);
      }
      return availabilityMap;
    } catch (error) {
      console.error("Error parsing availability_map:", error);
      return {};
    }
  };

  // Safe handler for cost_discount array
  const getCostDiscounts = (service: Service): CostDiscount[] => {
    return service.cost_discount || [];
  };

  // Safe handler for long_description
  const getLongDescription = (service: Service): string => {
    if (service.long_description && service.long_description.trim()) {
      return service.long_description;
    }
    return service.description || "Detailed description coming soon.";
  };

  // Safe handler for media URL
  const getMediaUrl = (service: Service): string | null => {
    if (!service.media) return null;

    if (service.media.startsWith("http")) {
      return service.media;
    }

    return `${api.defaults.baseURL}${service.media.startsWith("/") ? "" : "/"}${
      service.media
    }`;
  };

  // Safe handler for pricing display
  const getStartingPrice = (service: Service): string => {
    const discounts = getCostDiscounts(service);
    console.log(
      "Getting starting price for service:",
      service.name,
      "Discounts:",
      discounts
    );

    if (discounts.length === 0) return "Contact for pricing";

    const firstPlan = discounts[0];
    const cost = firstPlan.cost || 0;
    return `Starting at ₹${cost}`;
  };

  // Safe handler for discount display
  const hasDiscount = (service: Service): boolean => {
    const discounts = getCostDiscounts(service);
    return discounts.length > 0 && (discounts[0].discount || 0) > 0;
  };

  // Format availability map for display
  const formatAvailability = (service: Service): string => {
    const availabilityMap = service.availability_map || {};
    if (Object.keys(availabilityMap).length === 0) {
      return "Flexible scheduling available";
    }

    const days = Object.entries(availabilityMap)
      .map(([day, time]) => `${day}: ${time}`)
      .join(", ");

    return days || "Flexible scheduling available";
  };

  const openDetailsOverlay = (service: Service) => {
    setSelectedService(service);
    setActiveOverlay("details");
    document.body.style.overflow = "hidden";
  };

  const closeOverlay = () => {
    setActiveOverlay(null);
    setTimeout(() => {
      setSelectedService(null);
      setBookingFormData({
        subject: "",
        body: "",
        files: null,
        selectedPlan: null,
      });
      setError("");
    }, 300);
    document.body.style.overflow = "unset";
  };

  const openBookingOverlay = (plan?: CostDiscount) => {
    if (!isAuthenticated) {
      alert("You must be logged in to request this service");
      return;
    }

    if (!selectedService) return;

    const discounts = getCostDiscounts(selectedService);
    const defaultPlan = discounts.length > 0 ? discounts[0] : null;

    setBookingFormData({
      subject: `Inquiry about ${selectedService.name}${
        plan ? ` - ${plan.plan} plan` : ""
      }`,
      body: "",
      files: null,
      selectedPlan: plan || defaultPlan,
    });

    setActiveOverlay("booking");
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedService) {
      setError("No service selected");
      return;
    }

    if (!bookingFormData.selectedPlan) {
      setError("Please select a plan");
      return;
    }

    if (!bookingFormData.subject.trim() || !bookingFormData.body.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const formData = new FormData();

      // Append service data
      formData.append("service", selectedService.id.toString());
      formData.append("plan", JSON.stringify(bookingFormData.selectedPlan));
      formData.append(
        "request_msg",
        JSON.stringify({
          subject: bookingFormData.subject.trim(),
          body: bookingFormData.body.trim(),
        })
      );

      // Append all files
      if (bookingFormData.files) {
        for (let i = 0; i < bookingFormData.files.length; i++) {
          formData.append("media_url", bookingFormData.files[i]);
        }
      }
      formData.append("service_id", String(selectedService.id));

      console.log("Submitting service request to /services/requests/create/");
      console.log("Form data:", {
        service: selectedService.id,
        plan: bookingFormData.selectedPlan,
        subject: bookingFormData.subject,
      });

      const response = await api.post("/services/requests/create/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Service request submitted successfully:", response.data);

      alert(
        `Service request submitted for ${selectedService.name}! We'll contact you soon.`
      );
      closeOverlay();
    } catch (err: any) {
      console.error("Service request error:", err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.response?.data?.detail ||
        "Failed to submit service request. Please try again.";
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof BookingFormData, value: any) => {
    setBookingFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeOverlay();
    }
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

  if (error && !selectedService) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-900 dark:to-blue-900/20 mt-24">
        <div className="max-w-7xl mx-auto p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={fetchServices} className="mt-4">
            Try Again
          </Button>
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
            Discover our comprehensive range of professional services designed
            to bring your ideas to life
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const discounts = getCostDiscounts(service);
            const hasAnyDiscount = hasDiscount(service);
            const startingPrice = getStartingPrice(service);
            const availability = formatAvailability(service);

            console.log(
              "Rendering service:",
              service.name,
              "Discounts:",
              discounts
            );

            return (
              <Card
                key={service.id}
                className="group cursor-pointer bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 hover:border-blue-300/50 dark:hover:border-blue-400/50 hover:shadow-2xl hover:scale-105 transition-all duration-300"
                onClick={() => openDetailsOverlay(service)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {service.name}
                    </CardTitle>
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                    >
                      Available
                    </Badge>
                  </div>
                  <CardDescription className="text-base text-gray-600 dark:text-gray-400 line-clamp-2">
                    {service.description || "No description available."}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-4 space-y-3">
                  {/* Availability */}
                  <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{availability}</span>
                  </div>

                  {/* Pricing preview */}
                  {discounts.length > 0 ? (
                    <div className="flex items-center gap-2">
                      <IndianRupee className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {startingPrice}
                      </span>
                      {hasAnyDiscount && (
                        <Badge
                          variant="outline"
                          className="text-xs bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                        >
                          {discounts[0].discount}% OFF
                        </Badge>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <IndianRupee className="w-4 h-4" />
                      <span>Contact for pricing</span>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="pt-4 border-t border-gray-100 dark:border-gray-700">
                  <Button
                    variant="outline"
                    className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      openDetailsOverlay(service);
                    }}
                  >
                    <Info className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {services.length === 0 && !loading && (
          <div className="text-center py-16">
            <FileQuestion className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No Services Available
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Check back later for our service offerings.
            </p>
          </div>
        )}
      </div>

      {/* Service Details Overlay */}
      {selectedService && activeOverlay === "details" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300"
          onClick={handleBackdropClick}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl transform scale-100 opacity-100 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <button
                onClick={closeOverlay}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="pr-12">
                <h2 className="text-3xl font-bold mb-2">
                  {selectedService.name}
                </h2>
                <p className="text-blue-100 text-lg">
                  {selectedService.description ||
                    "Professional service offering"}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="p-8">
                {/* Media Display - Conditional */}
                {getMediaUrl(selectedService) ? (
                  <div className="mb-8">
                    <img
                      src={getMediaUrl(selectedService)!}
                      alt={selectedService.name}
                      className="w-full h-64 object-cover rounded-lg shadow-lg"
                      onError={(e) => {
                        // Hide broken images and show placeholder instead
                        e.currentTarget.style.display = "none";
                        // The placeholder will show from the condition below
                      }}
                    />
                  </div>
                ) : (
                  <div className="mb-8 flex items-center justify-center h-48 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                    <div className="text-center text-gray-400 dark:text-gray-500">
                      <Image className="w-12 h-12 mx-auto mb-2" />
                      <p>No media available</p>
                    </div>
                  </div>
                )}

                {/* Availability Schedule */}
                {selectedService.availability_map &&
                  Object.keys(selectedService.availability_map).length > 0 && (
                    <div className="mb-8">
                      <h3 className="font-semibold text-2xl mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                        <Calendar className="w-6 h-6 text-blue-600" />
                        Availability Schedule
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(selectedService.availability_map).map(
                          ([day, time]) => (
                            <div
                              key={day}
                              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                            >
                              <span className="font-medium text-gray-900 dark:text-white capitalize">
                                {day.toLowerCase()}
                              </span>
                              <span className="text-gray-600 dark:text-gray-400 font-medium">
                                {time}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )}

                {/* Markdown Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1
                          className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-6 border-b pb-2"
                          {...props}
                        />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2
                          className="text-xl font-bold text-gray-900 dark:text-white mb-3 mt-5"
                          {...props}
                        />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3
                          className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-2 mt-4"
                          {...props}
                        />
                      ),
                      p: ({ node, ...props }) => (
                        <p
                          className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed"
                          {...props}
                        />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul
                          className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2"
                          {...props}
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-2"
                          {...props}
                        />
                      ),
                      li: ({ node, ...props }) => (
                        <li
                          className="text-gray-700 dark:text-gray-300"
                          {...props}
                        />
                      ),
                      strong: ({ node, ...props }) => (
                        <strong
                          className="font-bold text-gray-900 dark:text-white"
                          {...props}
                        />
                      ),
                      a: ({ node, ...props }) => (
                        <a
                          className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline"
                          target="_blank"
                          rel="noopener noreferrer"
                          {...props}
                        />
                      ),
                      code: ({ node, inline, ...props }) =>
                        inline ? (
                          <code
                            className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm"
                            {...props}
                          />
                        ) : (
                          <code
                            className="block bg-gray-100 dark:bg-gray-800 p-4 rounded-lg text-sm overflow-x-auto"
                            {...props}
                          />
                        ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote
                          className="border-l-4 border-blue-500 pl-4 italic text-gray-600 dark:text-gray-400 my-4"
                          {...props}
                        />
                      ),
                    }}
                  >
                    {getLongDescription(selectedService)}
                  </ReactMarkdown>
                </div>

                {/* Pricing Plans Section - Conditional */}
                {getCostDiscounts(selectedService).length > 0 ? (
                  <div className="mb-8">
                    <h3 className="font-semibold text-2xl mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
                      <IndianRupee className="w-6 h-6 text-green-600" />
                      Pricing Plans
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {getCostDiscounts(selectedService).map((plan, index) => {
                        const cost = plan.cost || 0;
                        const discount = plan.discount || 0;
                        const originalPrice =
                          discount > 0 ? cost / (1 - discount / 100) : cost;

                        return (
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
                                  {discount > 0 && (
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 text-sm">
                                      {discount}% OFF
                                    </Badge>
                                  )}
                                </div>

                                {/* Pricing */}
                                <div className="mb-4">
                                  {discount > 0 && (
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-sm line-through text-gray-500 dark:text-gray-400">
                                        ₹{Math.round(originalPrice)}
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <IndianRupee className="w-5 h-5 text-green-600" />
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                                      {Math.round(cost)}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Select Plan Button */}
                              <Button
                                className="w-full bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 transition-all duration-300"
                                onClick={() => openBookingOverlay(plan)}
                                disabled={!isAuthenticated}
                              >
                                <Bookmark className="w-4 h-4 mr-2" />
                                {isAuthenticated
                                  ? `Select ${plan.plan}`
                                  : "Login to Select"}
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg text-center">
                    <IndianRupee className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                      Custom Pricing
                    </h3>
                    <p className="text-gray-500 dark:text-gray-500 mb-4">
                      Contact us for personalized pricing based on your
                      requirements
                    </p>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => openBookingOverlay()}
                      disabled={!isAuthenticated}
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      {isAuthenticated ? "Request Quote" : "Login to Request"}
                    </Button>
                  </div>
                )}
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
                  {getCostDiscounts(selectedService).length > 0 && (
                    <Button
                      className="min-w-24 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25"
                      onClick={() => openBookingOverlay()}
                      disabled={!isAuthenticated}
                      size="lg"
                    >
                      <Bookmark className="w-4 h-4 mr-2" />
                      {isAuthenticated ? "Book Now" : "Login to Book"}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Request Form Overlay */}
      {selectedService && activeOverlay === "booking" && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-all duration-300"
          onClick={handleBackdropClick}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl transform scale-100 opacity-100 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
              <button
                onClick={closeOverlay}
                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="pr-12">
                <h2 className="text-2xl font-bold mb-2">
                  Request {selectedService.name}
                  {bookingFormData.selectedPlan &&
                    ` - ${bookingFormData.selectedPlan.plan} Plan`}
                </h2>
                <p className="text-blue-100">
                  Please provide your project details
                </p>
              </div>
            </div>

            {/* Service Request Form */}
            <form
              onSubmit={handleBookingSubmit}
              className="p-6 space-y-6 max-h-[calc(90vh-200px)] overflow-y-auto"
            >
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Selected Plan Display */}
              {bookingFormData.selectedPlan ? (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
                    Selected Plan
                  </h4>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">
                        {bookingFormData.selectedPlan.plan}
                      </p>
                      <p className="text-sm text-blue-600 dark:text-blue-300">
                        ₹{Math.round(bookingFormData.selectedPlan.cost || 0)}
                        {bookingFormData.selectedPlan.discount > 0 && (
                          <span className="ml-2 line-through text-blue-400">
                            ₹
                            {Math.round(
                              (bookingFormData.selectedPlan.cost || 0) /
                                (1 -
                                  (bookingFormData.selectedPlan.discount || 0) /
                                    100)
                            )}
                          </span>
                        )}
                      </p>
                    </div>
                    {(bookingFormData.selectedPlan.discount || 0) > 0 && (
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {bookingFormData.selectedPlan.discount}% OFF
                      </Badge>
                    )}
                  </div>
                  {bookingFormData.selectedPlan.description && (
                    <p className="text-sm text-blue-600 dark:text-blue-300 mt-2">
                      {bookingFormData.selectedPlan.description}
                    </p>
                  )}
                </div>
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>No Plan Selected</AlertTitle>
                  <AlertDescription>
                    Please go back and select a pricing plan first.
                  </AlertDescription>
                </Alert>
              )}

              {/* Subject */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <Input
                  type="text"
                  placeholder="Brief subject for your request..."
                  value={bookingFormData.subject}
                  onChange={(e) => handleInputChange("subject", e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Project Details *
                </label>
                <Textarea
                  placeholder="Describe your project requirements, goals, timeline, and any specific details..."
                  value={bookingFormData.body}
                  onChange={(e) => handleInputChange("body", e.target.value)}
                  className="w-full min-h-[120px]"
                  required
                />
              </div>

              {/* File Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <Upload className="w-4 h-4 inline mr-2" />
                  Supporting Files (Optional)
                </label>
                <Input
                  type="file"
                  multiple
                  accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.zip,.rar"
                  onChange={(e) => handleInputChange("files", e.target.files)}
                  className="w-full"
                />
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Supported formats: JPG, PNG, PDF, DOC, ZIP (Max 10MB per file)
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeOverlay}
                  className="flex-1"
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/25"
                  disabled={submitting || !bookingFormData.selectedPlan}
                >
                  <Bookmark className="w-4 h-4 mr-2" />
                  {submitting ? "Submitting..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;