// prototypes.jsx
"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import LiquidEther from "../animations/LiquidEther/LiquidEther";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  ExternalLink,
  Github,
  Users,
  Calendar,
  Tag,
  X,
  ArrowRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";

export default function PrototypesPage() {
  return (
    <div className="relative">
      <PrototypesHeroSection />
      <FeaturedPrototypesSection />
      <CategoriesSection />
      <ShowcaseSection />
      <GetInvolvedSection />
    </div>
  );
}

const PrototypesHeroSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <LiquidEther />
      </div>

      {/* Content */}
      <div
        className={`relative z-10 h-full flex flex-col justify-center items-center text-center px-6 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-bold text-5xl md:text-6xl lg:text-7xl mb-6"
        >
          <span
            className={`bg-gradient-to-r ${
              isDark
                ? "from-blue-400 to-purple-600"
                : "from-blue-600 to-purple-700"
            } bg-clip-text text-transparent`}
          >
            Student
          </span>{" "}
          <span
            className={`bg-gradient-to-r ${
              isDark
                ? "from-green-400 to-cyan-600"
                : "from-green-600 to-cyan-700"
            } bg-clip-text text-transparent`}
          >
            Prototypes
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className={`text-xl md:text-2xl mb-10 max-w-3xl mx-auto leading-relaxed ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Discover innovative projects created by our student community. From
          cutting-edge tech to sustainable solutions, witness the future of
          innovation.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
        >
          <Link href={"#projects"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 border ${
                isDark
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-400/30 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                  : "bg-gradient-to-r from-blue-600 to-purple-700 text-white border-blue-500/30 shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40"
              }`}
            >
              View Projects
            </motion.button>
          </Link>
          <Link href={"#stats"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-lg font-semibold border transition-all duration-300 ${
                isDark
                  ? "bg-transparent text-white border-white/30 hover:bg-white/10"
                  : "bg-transparent text-gray-800 border-gray-400 hover:bg-gray-100/50"
              }`}
            >
              Our Track Record
            </motion.button>
          </Link>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center ${
          isDark ? "text-white" : "text-gray-600"
        }`}
      >
        <span className="text-sm mb-2">Explore Projects</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className={`w-6 h-10 border-2 rounded-full flex justify-center ${
            isDark ? "border-white/50" : "border-gray-400"
          }`}
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className={`w-1 h-3 rounded-full mt-2 ${
              isDark ? "bg-white/70" : "bg-gray-600"
            }`}
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

const FeaturedPrototypesSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrototype, setSelectedPrototype] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900"
    : "bg-gradient-to-br from-gray-50 via-blue-50/50 to-gray-50";

  const cardBg = isDark
    ? "bg-white/5 backdrop-blur-sm border-white/10 hover:border-blue-400/30"
    : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-blue-400/30";

  const titleColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-300" : "text-gray-700";
  const accentColor = isDark ? "text-blue-400" : "text-blue-600";

  const prototypes = [
    {
      id: 1,
      title: "Smart Irrigation System",
      description:
        "AI-powered irrigation system that optimizes water usage based on soil moisture and weather predictions.",
      long_description: `# Smart Irrigation System

![Smart Irrigation](https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=400&fit=crop)

## Project Overview

The Smart Irrigation System is an AI-powered solution that revolutionizes agricultural water management. Using machine learning algorithms and IoT sensors, the system optimizes water usage in real-time, reducing water consumption by up to 40% while maintaining crop health.

## Key Features

- **Real-time Monitoring**: Continuous soil moisture and weather data collection
- **Predictive Analytics**: Machine learning models predict optimal irrigation schedules
- **Remote Control**: Mobile app for manual override and monitoring
- **Water Conservation**: Smart algorithms reduce water waste significantly

## Technical Stack

- **Hardware**: Arduino Uno, Soil Moisture Sensors, Weather Station
- **Software**: Python, TensorFlow, React Native
- **Cloud**: AWS IoT Core, MongoDB
- **APIs**: Weather API, Soil Data API

## Impact

- 40% reduction in water usage
- 25% increase in crop yield
- Real-time monitoring capabilities
- Scalable for large farms

## Team Members

- Alice Chen - Hardware & IoT
- Bob Smith - Machine Learning
- Charlie Davis - Mobile Development

## Future Enhancements

- Integration with drone technology
- Multi-crop optimization
- Blockchain for supply chain tracking`,
      category: "iot",
      status: "completed",
      team: ["Alice Chen", "Bob Smith", "Charlie Davis"],
      technologies: ["Arduino", "Python", "IoT", "TensorFlow", "React Native"],
      github: "https://github.com",
      demo: "https://demo.com",
      images: [
        "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=400&fit=crop",
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1586771107445-d3ca888129ce?w=400&h=300&fit=crop",
      ],
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Medical Drone Delivery",
      description:
        "Autonomous drone system for emergency medical supply delivery in remote areas.",
      long_description: `# Medical Drone Delivery System

![Medical Drone](https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=400&fit=crop)

## Project Vision

Revolutionizing emergency healthcare delivery in remote and inaccessible areas through autonomous drone technology. This system ensures timely delivery of critical medical supplies like vaccines, blood, and emergency medications.

## Technical Specifications

### Drone Capabilities
- **Range**: 50km radius
- **Payload**: 5kg medical supplies
- **Speed**: 60 km/h
- **Battery**: 2 hours flight time
- **Navigation**: GPS + Computer Vision

### Safety Features
- Redundant flight systems
- Emergency parachute deployment
- Real-time health monitoring
- Weather-resistant design

## Impact Metrics
- Reduced delivery time from 4 hours to 15 minutes
- 95% delivery success rate in testing
- Potential to save thousands of lives annually
- Cost-effective compared to traditional methods

## Technology Stack
- **Hardware**: Custom drone frame, Pixhawk flight controller
- **Software**: ROS, Python, OpenCV
- **AI**: Object detection and avoidance
- **Communication**: 4G/LTE with satellite backup

## Team
- David Wilson - Robotics Engineering
- Eva Martinez - Computer Vision
- Frank Thompson - Systems Integration`,
      category: "robotics",
      status: "in-progress",
      team: ["David Wilson", "Eva Martinez"],
      technologies: ["ROS", "Python", "Computer Vision", "OpenCV", "Pixhawk"],
      github: "https://github.com",
      demo: null,
      images: [
        "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&h=400&fit=crop",
        "https://images.unsplash.com/photo-1506941433945-99a2aa4bd50a?w=400&h=300&fit=crop",
      ],
      date: "2024-02-20",
    },
    {
      id: 3,
      title: "Eco-Friendly Packaging",
      description:
        "Biodegradable packaging material made from agricultural waste.",
      long_description: `# Eco-Friendly Packaging Solution

![Eco Packaging](https://images.unsplash.com/photo-1558769132-cb25c5d11e83?w=800&h=400&fit=crop)

## Innovation in Sustainability

Transforming agricultural waste into high-performance, biodegradable packaging materials. This solution addresses the global plastic pollution crisis while creating value from waste products.

## Material Properties

- **Biodegradation**: 90 days in compost
- **Strength**: Comparable to conventional plastics
- **Water Resistance**: Suitable for food packaging
- **Cost**: 30% cheaper than bioplastics
- **Source**: Rice husk, sugarcane bagasse, corn stover

## Manufacturing Process

1. **Collection**: Agricultural waste from local farms
2. **Processing**: Mechanical and chemical treatment
3. **Forming**: Injection molding and extrusion
4. **Finishing**: Quality control and packaging

## Environmental Impact
- Reduces plastic waste by 1 ton per 2 tons produced
- Carbon negative manufacturing process
- Supports circular economy
- Creates rural employment opportunities

## Applications
- Food packaging
- E-commerce shipping
- Consumer goods
- Medical supplies (sterile packaging)

## Team
- Grace Lee - Material Science
- Henry Brown - Chemical Engineering
- Ivy Chen - Business Development`,
      category: "sustainability",
      status: "completed",
      team: ["Grace Lee", "Henry Brown"],
      technologies: ["Material Science", "Chemistry", "Biodegradable Polymers"],
      github: null,
      demo: "https://demo.com",
      images: [
        "https://images.unsplash.com/photo-1558769132-cb25c5d11e83?w=800&h=400&fit=crop",
        "https://images.unsplash.com/photo-1587332278432-1517e92c0c7a?w=400&h=300&fit=crop",
      ],
      date: "2024-01-30",
    },
    {
      id: 4,
      title: "VR Learning Platform",
      description:
        "Immersive virtual reality platform for interactive STEM education.",
      long_description: `# VR Learning Platform

![VR Education](https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&h=400&fit=crop)

## Transforming STEM Education

An immersive virtual reality platform that makes complex STEM concepts accessible and engaging through interactive 3D simulations and gamified learning experiences.

## Key Features

### Interactive Simulations
- Molecular biology in 3D space
- Physics experiments in virtual labs
- Astronomical exploration
- Engineering design simulations

### Learning Analytics
- Real-time progress tracking
- Adaptive learning paths
- Performance analytics
- Teacher dashboard

## Technical Architecture
- **Platform**: Unity 3D Engine
- **VR Support**: Oculus Quest, HTC Vive
- **Backend**: Node.js, MongoDB
- **AI**: Personalized learning algorithms

## Educational Impact
- 65% improvement in concept retention
- 80% increase in student engagement
- Accessible to diverse learning styles
- Reduces need for physical lab equipment

## Team
- Jack Wilson - VR Development
- Karen Adams - Educational Design
- Leo Martinez - Backend Systems`,
      category: "education",
      status: "planning",
      team: ["Jack Wilson", "Karen Adams", "Leo Martinez"],
      technologies: ["Unity", "C#", "VR", "Node.js", "MongoDB"],
      github: "https://github.com",
      demo: null,
      images: [
        "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=800&h=400&fit=crop",
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
      ],
      date: "2024-03-10",
    },
    {
      id: 5,
      title: "Blockchain Voting System",
      description:
        "Secure and transparent voting system using blockchain technology.",
      long_description: `# Blockchain Voting System

![Blockchain Voting](https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop)

## Secure Digital Democracy

A blockchain-based voting system that ensures transparency, security, and accessibility in electoral processes while maintaining voter privacy and preventing fraud.

## Core Features

### Security Measures
- End-to-end encryption
- Zero-knowledge proofs
- Immutable transaction ledger
- Multi-factor authentication

### Accessibility
- Mobile and web interfaces
- Multi-language support
- Accessibility compliance
- Offline capability

## Technology Implementation
- **Blockchain**: Ethereum-based private chain
- **Smart Contracts**: Solidity
- **Frontend**: React, TypeScript
- **Security**: Cryptographic voting protocols

## Benefits
- 100% audit trail of votes
- Real-time result verification
- Reduced election costs by 70%
- Increased voter turnout by 25%

## Team
- Mike Johnson - Blockchain Development
- Nancy Lee - Security Engineering
- Oscar Brown - UX/UI Design`,
      category: "web3",
      status: "completed",
      team: ["Mike Johnson", "Nancy Lee"],
      technologies: ["Solidity", "React", "Web3", "TypeScript", "Ethereum"],
      github: "https://github.com",
      demo: "https://demo.com",
      images: [
        "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=400&fit=crop",
        "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?w=400&h=300&fit=crop",
      ],
      date: "2024-02-05",
    },
    {
      id: 6,
      title: "AI Health Assistant",
      description:
        "Personal health monitoring and recommendation system using machine learning.",
      long_description: `# AI Health Assistant

![AI Health](https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop)

## Personalized Healthcare Companion

An AI-powered health monitoring system that provides personalized health recommendations, medication reminders, and early warning detection for potential health issues.

## Core Capabilities

### Health Monitoring
- Vital signs tracking
- Symptom analysis
- Medication adherence
- Activity monitoring

### AI Features
- Predictive health analytics
- Personalized recommendations
- Emergency alert system
- Health trend analysis

## Technical Stack
- **Machine Learning**: TensorFlow, Scikit-learn
- **Mobile**: React Native
- **Backend**: Python, FastAPI
- **Database**: PostgreSQL
- **APIs**: Health data integration

## Impact Metrics
- 40% reduction in medication errors
- 30% improvement in treatment adherence
- Early detection of 85% of potential issues
- 95% user satisfaction rate

## Team
- Paul Garcia - AI/ML Engineering
- Quinn Taylor - Mobile Development
- Rachel Kim - Healthcare Analytics`,
      category: "ai-ml",
      status: "in-progress",
      team: ["Paul Garcia", "Quinn Taylor"],
      technologies: [
        "TensorFlow",
        "React Native",
        "Node.js",
        "Python",
        "PostgreSQL",
      ],
      github: "https://github.com",
      demo: null,
      images: [
        "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop",
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
      ],
      date: "2024-03-01",
    },
  ];

  const categories = [
    { id: "all", name: "All Projects", count: prototypes.length },
    {
      id: "iot",
      name: "IoT",
      count: prototypes.filter((p) => p.category === "iot").length,
    },
    {
      id: "robotics",
      name: "Robotics",
      count: prototypes.filter((p) => p.category === "robotics").length,
    },
    {
      id: "ai-ml",
      name: "AI/ML",
      count: prototypes.filter((p) => p.category === "ai-ml").length,
    },
    {
      id: "sustainability",
      name: "Sustainability",
      count: prototypes.filter((p) => p.category === "sustainability").length,
    },
    {
      id: "education",
      name: "Education",
      count: prototypes.filter((p) => p.category === "education").length,
    },
    {
      id: "web3",
      name: "Web3",
      count: prototypes.filter((p) => p.category === "web3").length,
    },
  ];

  const statusColors = {
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    "in-progress":
      "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    planning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  };

  const filteredPrototypes = prototypes.filter((prototype) => {
    const matchesSearch =
      prototype.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prototype.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || prototype.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const openOverlay = (prototype) => {
    setSelectedPrototype(prototype);
    setIsOverlayOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeOverlay = () => {
    setIsOverlayOpen(false);
    setTimeout(() => setSelectedPrototype(null), 300);
    document.body.style.overflow = "unset";
  };

  return (
    <section className={`relative w-full min-h-screen py-20 ${sectionBg}`} id="projects">
      <div className="relative z-10 px-4 max-w-7xl mx-auto">
        <motion.h2
          className={`text-4xl md:text-5xl font-bold text-center mb-4 ${titleColor}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Featured{" "}
          <span
            className={`bg-gradient-to-r ${
              isDark ? "from-blue-400 to-cyan-400" : "from-blue-600 to-cyan-600"
            } bg-clip-text text-transparent`}
          >
            Projects
          </span>
        </motion.h2>

        <motion.p
          className={`text-lg text-center mb-12 max-w-2xl mx-auto ${textColor}`}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Explore groundbreaking prototypes developed by our talented student
          innovators
        </motion.p>

        {/* Search and Filter Bar */}
        <motion.div
          className="flex flex-col lg:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                onClick={() => setSelectedCategory(category.id)}
                className="whitespace-nowrap"
              >
                {category.name}
                <Badge variant="secondary" className="ml-2">
                  {category.count}
                </Badge>
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPrototypes.map((prototype, index) => (
            <motion.div
              key={prototype.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <Card
                className={`h-full transition-all duration-300 hover:shadow-xl cursor-pointer pt-0 ${cardBg}`}
                onClick={() => openOverlay(prototype)}
              >
                {/* Project Image */}
                <div className="relative h-48 overflow-hidden rounded-t-lg">
                  <img
                    src={prototype.images[0]}
                    alt={prototype.title}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className={statusColors[prototype.status]}>
                      {prototype.status.replace("-", " ")}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className={`text-xl mb-2 ${titleColor}`}>
                    {prototype.title}
                  </CardTitle>
                  <CardDescription className={textColor}>
                    {prototype.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-3">
                  {/* Team Members */}
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {prototype.team.join(", ")}
                    </span>
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1">
                    {prototype.technologies.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex gap-2 pt-3 border-t">
                  {prototype.github && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(prototype.github, "_blank");
                      }}
                    >
                      <Github className="w-4 h-4 mr-1" />
                      Code
                    </Button>
                  )}
                  {prototype.demo && (
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(prototype.demo, "_blank");
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Demo
                    </Button>
                  )}
                  {!prototype.demo && !prototype.github && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      disabled
                    >
                      Details Coming Soon
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      openOverlay(prototype);
                    }}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredPrototypes.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className={`text-lg ${textColor}`}>
              No projects found matching your criteria. Try adjusting your
              search filters.
            </p>
          </motion.div>
        )}
      </div>

      {/* Project Detail Overlay */}
      {selectedPrototype && (
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${
            isOverlayOpen
              ? "bg-black/50 backdrop-blur-sm"
              : "bg-black/0 backdrop-blur-0"
          }`}
        >
          <div
            className={`bg-white dark:bg-gray-900 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl transform transition-all duration-300 ${
              isOverlayOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
            }`}
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
                  {selectedPrototype.title}
                </h2>
                <p className="text-blue-100 text-lg">
                  {selectedPrototype.description}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="p-8">
                {/* Image Gallery */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedPrototype.images.map((image, index) => (
                      <div key={index} className="rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`${selectedPrototype.title} - Image ${
                            index + 1
                          }`}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Markdown Content */}
                <div className="prose prose-lg dark:prose-invert max-w-none mb-8">
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => (
                        <h1
                          className="text-2xl font-bold text-gray-900 dark:text-white mb-4 mt-6"
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
                          className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1"
                          {...props}
                        />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol
                          className="list-decimal list-inside text-gray-700 dark:text-gray-300 mb-4 space-y-1"
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
                          {...props}
                        />
                      ),
                      img: ({ node, ...props }) => (
                        <img className="rounded-lg shadow-lg my-4" {...props} />
                      ),
                    }}
                  >
                    {selectedPrototype.long_description}
                  </ReactMarkdown>
                </div>

                {/* Project Metadata */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                      <Users className="w-5 h-5 text-blue-600" />
                      Team Members
                    </h3>
                    <div className="space-y-2">
                      {selectedPrototype.team.map((member, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700 dark:text-gray-300">
                            {member}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                      <Tag className="w-5 h-5 text-green-600" />
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPrototype.technologies.map((tech, index) => (
                        <Badge key={index} variant="secondary">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="flex items-center gap-4">
                  {selectedPrototype.github && (
                    <Button
                      variant="outline"
                      onClick={() =>
                        window.open(selectedPrototype.github, "_blank")
                      }
                    >
                      <Github className="w-4 h-4 mr-2" />
                      View Code
                    </Button>
                  )}
                  {selectedPrototype.demo && (
                    <Button
                      onClick={() =>
                        window.open(selectedPrototype.demo, "_blank")
                      }
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </Button>
                  )}
                </div>
                <div className="flex gap-3">
                  <Button variant="outline" onClick={closeOverlay}>
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

const CategoriesSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"
    : "bg-gradient-to-br from-purple-50/80 via-pink-50/50 to-rose-50/80";

  const cardBg = isDark
    ? "bg-white/5 backdrop-blur-sm border-white/10 hover:border-purple-400/30"
    : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-purple-400/30";

  const titleColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-300" : "text-gray-700";

  const categories = [
    {
      title: "Internet of Things",
      description: "Connected devices and smart systems",
      icon: "📱",
      count: "12 Projects",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Artificial Intelligence",
      description: "Machine learning and intelligent systems",
      icon: "🤖",
      count: "8 Projects",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      title: "Robotics",
      description: "Automated systems and mechanical innovation",
      icon: "⚙️",
      count: "6 Projects",
      gradient: "from-green-500 to-teal-500",
    },
    {
      title: "Sustainability",
      description: "Eco-friendly and green technology",
      icon: "🌱",
      count: "9 Projects",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "Healthcare Tech",
      description: "Medical devices and health solutions",
      icon: "🏥",
      count: "7 Projects",
      gradient: "from-red-500 to-pink-500",
    },
    {
      title: "Education Tech",
      description: "Learning platforms and educational tools",
      icon: "🎓",
      count: "5 Projects",
      gradient: "from-indigo-500 to-purple-500",
    },
  ];

  return (
    <section
      className={`relative w-full min-h-screen flex items-center justify-center py-20 ${sectionBg}`}
    >
      <div className="relative z-10 px-4 max-w-6xl mx-auto">
        <motion.h2
          className={`text-4xl md:text-5xl font-bold text-center mb-16 ${titleColor}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Project{" "}
          <span
            className={`bg-gradient-to-r ${
              isDark
                ? "from-purple-400 to-pink-400"
                : "from-purple-600 to-pink-600"
            } bg-clip-text text-transparent`}
          >
            Categories
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`rounded-2xl p-6 border transition-all duration-300 hover:shadow-lg ${cardBg}`}
            >
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${category.gradient} mb-4 flex items-center justify-center text-white text-xl`}
              >
                {category.icon}
              </div>
              <h3 className={`text-xl font-bold mb-2 ${titleColor}`}>
                {category.title}
              </h3>
              <p className={`mb-3 ${textColor}`}>{category.description}</p>
              <Badge variant="secondary">{category.count}</Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const ShowcaseSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900"
    : "bg-gradient-to-br from-green-50/80 via-cyan-50/50 to-blue-50/80";

  const titleColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-300" : "text-gray-700";

  const stats = [
    { number: "50+", label: "Projects Completed" },
    { number: "200+", label: "Student Innovators" },
    { number: "15+", label: "Technologies Used" },
    { number: "10+", label: "Industry Partners" },
  ];

  return (
    <section
      className={`relative w-full min-h-screen flex items-center justify-center py-20 ${sectionBg}`} id="stats"
    >
      <div className="relative z-10 px-4 max-w-6xl mx-auto">
        <motion.h2
          className={`text-4xl md:text-5xl font-bold text-center mb-16 ${titleColor}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Innovation{" "}
          <span
            className={`bg-gradient-to-r ${
              isDark
                ? "from-green-400 to-cyan-400"
                : "from-green-600 to-cyan-600"
            } bg-clip-text text-transparent`}
          >
            Showcase
          </span>
        </motion.h2>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div
                className={`text-3xl md:text-4xl font-bold mb-2 ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {stat.number}
              </div>
              <div className={textColor}>{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <p className={`text-xl max-w-3xl mx-auto mb-8 ${textColor}`}>
            Our students have developed innovative solutions that address
            real-world challenges, from environmental sustainability to
            healthcare and education technology.
          </p>
          <Button size="lg">
            View All Projects
            <ExternalLink className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

const GetInvolvedSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900"
    : "bg-gradient-to-br from-orange-50/80 via-red-50/50 to-pink-50/80";

  const cardBg = isDark
    ? "bg-white/5 backdrop-blur-sm border-white/10 hover:border-orange-400/30"
    : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-orange-400/30";

  const titleColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-300" : "text-gray-700";

  const steps = [
    {
      step: "01",
      title: "Share Your Idea",
      description: "Present your innovative concept to our team",
      icon: "💡",
    },
    {
      step: "02",
      title: "Get Resources",
      description: "Access our labs, equipment, and mentorship",
      icon: "🛠️",
    },
    {
      step: "03",
      title: "Build & Iterate",
      description: "Develop your prototype with expert guidance",
      icon: "🚀",
    },
    {
      step: "04",
      title: "Showcase",
      description: "Present your project to the community",
      icon: "🏆",
    },
  ];

  return (
    <section
      className={`relative w-full min-h-screen flex items-center justify-center py-20 ${sectionBg}`}
    >
      <div className="relative z-10 px-4 max-w-6xl mx-auto">
        <motion.h2
          className={`text-4xl md:text-5xl font-bold text-center mb-16 ${titleColor}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Get{" "}
          <span
            className={`bg-gradient-to-r ${
              isDark
                ? "from-orange-400 to-pink-400"
                : "from-orange-600 to-pink-600"
            } bg-clip-text text-transparent`}
          >
            Involved
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`rounded-2xl p-6 border transition-all duration-300 ${cardBg}`}
            >
              <div className="text-3xl mb-4">{step.icon}</div>
              <div className="text-sm font-semibold text-orange-600 dark:text-orange-400 mb-2">
                STEP {step.step}
              </div>
              <h3 className={`text-xl font-bold mb-3 ${titleColor}`}>
                {step.title}
              </h3>
              <p className={textColor}>{step.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <p className={`text-xl max-w-3xl mx-auto mb-8 ${textColor}`}>
            Ready to turn your idea into reality? Join our community of
            innovators and start building the future today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              Start Your Project
            </Button>
            <Button variant="outline" size="lg">
              Join as Mentor
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
