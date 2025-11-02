// prototypes.jsx
"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import LiquidEther from "../animations/LiquidEther/LiquidEther";
import { useState, useMemo } from "react";
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
  ExternalLink,
  Github,
  Users,
  Tag,
  X,
  ArrowRight,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { useContent } from "@/context/ContentContext";

export default function PrototypesPage() {
  const { content, loading, error } = useContent();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-red-600 mb-4">Error loading content</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

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
  const { content } = useContent();
  const isDark = theme === "dark";

  const heroContent = content?.all_prototypes?.hero || {};
  const title = heroContent.title || ["Student", "Prototypes"];
  const subtitle = heroContent.subtitle || "Explore innovative prototypes developed by our student community.";
  const cta = heroContent.cta || {};

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
            {title[0]}
          </span>{" "}
          <span
            className={`bg-gradient-to-r ${
              isDark
                ? "from-green-400 to-cyan-600"
                : "from-green-600 to-cyan-700"
            } bg-clip-text text-transparent`}
          >
            {title[1]}
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
          {subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
        >
          {cta.primary && (
            <Link href={cta.primary.href || "#projects"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 border ${
                  isDark
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-400/30 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                    : "bg-gradient-to-r from-blue-600 to-purple-700 text-white border-blue-500/30 shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40"
                }`}
              >
                {cta.primary.label || "View Projects"}
              </motion.button>
            </Link>
          )}
          {cta.secondary && (
            <Link href={cta.secondary.href || "#stats"}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-lg font-semibold border transition-all duration-300 ${
                  isDark
                    ? "bg-transparent text-white border-white/30 hover:bg-white/10"
                    : "bg-transparent text-gray-800 border-gray-400 hover:bg-gray-100/50"
                }`}
              >
                {cta.secondary.label || "Our Track Record"}
              </motion.button>
            </Link>
          )}
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
  const { content } = useContent();
  const isDark = theme === "dark";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPrototype, setSelectedPrototype] = useState(null);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);

  // Safe data access
  const featuredContent = content?.all_prototypes?.featured || {};
  const prototypes = useMemo(
    () => Array.isArray(featuredContent.prototypes) ? featuredContent.prototypes : [],
    [featuredContent.prototypes]
  );

  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900"
    : "bg-gradient-to-br from-gray-50 via-blue-50/50 to-gray-50";

  const cardBg = isDark
    ? "bg-white/5 backdrop-blur-sm border-white/10 hover:border-blue-400/30"
    : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-blue-400/30";

  const titleColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-300" : "text-gray-700";

  // Use statusMap from content or fallback
  const statusColors = featuredContent.statusMap || {
    completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    "in-progress": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    planning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  };

  // Categories based on actual prototype categories
  const categories = useMemo(() => {
    const allCategories = [
      { id: "all", name: "All Projects", count: prototypes.length }
    ];

    // Extract unique categories from prototypes
    const uniqueCategories = [...new Set(prototypes
      .map(p => p?.category)
      .filter(Boolean)
    )];

    // Create category entries
    const categoryEntries = uniqueCategories.map(category => ({
      id: category,
      name: category.charAt(0).toUpperCase() + category.slice(1),
      count: prototypes.filter(p => p?.category === category).length
    }));

    return [...allCategories, ...categoryEntries];
  }, [prototypes]);

  // Filtered prototypes with safe access
  const filteredPrototypes = useMemo(() => 
    prototypes.filter((prototype) => {
      if (!prototype) return false;
      
      const matchesSearch =
        prototype.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prototype.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || prototype.category === selectedCategory;
      return matchesSearch && matchesCategory;
    }),
  [prototypes, searchTerm, selectedCategory]
  );

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

  // No data state
  if (prototypes.length === 0) {
    return (
      <section className={`min-h-screen py-20 flex items-center justify-center ${sectionBg}`}>
        <div className="text-center">
          <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            No projects available at the moment.
          </p>
        </div>
      </section>
    );
  }

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
          {featuredContent.heading || "Featured Projects"}{" "}
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
          {featuredContent.subheading || "Explore groundbreaking prototypes developed by our talented student innovators"}
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
              placeholder={featuredContent.searchPlaceholder || "Search projects..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
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
                    src={prototype.images?.[0]}
                    alt={prototype.title || "Project image"}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className={statusColors[prototype.status] || statusColors.planning}>
                      {prototype.status?.replace("-", " ") || "Unknown"}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className={`text-xl mb-2 ${titleColor}`}>
                    {prototype.title || "Untitled Project"}
                  </CardTitle>
                  <CardDescription className={textColor}>
                    {prototype.description || "No description available"}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-3">
                  {/* Team Members */}
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {prototype.team?.join(", ") || "No team members"}
                    </span>
                  </div>

                  {/* Technologies */}
                  <div className="flex flex-wrap gap-1">
                    {prototype.technologies?.map((tech) => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        <Tag className="w-3 h-3 mr-1" />
                        {tech}
                      </Badge>
                    )) || (
                      <Badge variant="outline" className="text-xs">
                        No technologies listed
                      </Badge>
                    )}
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

        {filteredPrototypes.length === 0 && prototypes.length > 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <p className={`text-lg ${textColor}`}>
              {featuredContent.noResults || "No projects found matching your criteria. Try adjusting your search filters."}
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
                  {selectedPrototype.title || "Untitled Project"}
                </h2>
                <p className="text-blue-100 text-lg">
                  {selectedPrototype.description || "No description available"}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
              <div className="p-8">
                {/* Image Gallery */}
                <div className="mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {selectedPrototype.images?.map((image, index) => (
                      <div key={index} className="rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`${selectedPrototype.title || "Project"} - Image ${index + 1}`}
                          className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )) || (
                      <div className="col-span-3 text-center py-8">
                        <p className="text-gray-500">No images available</p>
                      </div>
                    )}
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
                    {selectedPrototype.longDescription || selectedPrototype.long_description || "No detailed description available."}
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
                      {selectedPrototype.team?.map((member, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 text-sm"
                        >
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-700 dark:text-gray-300">
                            {member}
                          </span>
                        </div>
                      )) || (
                        <p className="text-gray-500">No team members listed</p>
                      )}
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                      <Tag className="w-5 h-5 text-green-600" />
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedPrototype.technologies?.map((tech, index) => (
                        <Badge key={index} variant="secondary">
                          {tech}
                        </Badge>
                      )) || (
                        <Badge variant="secondary">No technologies listed</Badge>
                      )}
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
  const { content } = useContent();
  const isDark = theme === "dark";

  const categoriesContent = content?.all_prototypes?.categories || {};
  const categories = categoriesContent.cards || [];

  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900"
    : "bg-gradient-to-br from-purple-50/80 via-pink-50/50 to-rose-50/80";

  const cardBg = isDark
    ? "bg-white/5 backdrop-blur-sm border-white/10 hover:border-purple-400/30"
    : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-purple-400/30";

  const titleColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-300" : "text-gray-700";

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
          {categoriesContent.heading || "Project"}{" "}
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
  const { content } = useContent();
  const isDark = theme === "dark";

  const showcaseContent = content?.all_prototypes?.showcase || {};
  const stats = showcaseContent.stats || [];
  const summary = showcaseContent.summary || "";

  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900"
    : "bg-gradient-to-br from-green-50/80 via-cyan-50/50 to-blue-50/80";

  const titleColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-300" : "text-gray-700";

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
          {showcaseContent.heading || "Innovation"}{" "}
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
            {summary}
          </p>
          {showcaseContent.cta && (
            <Button size="lg" asChild>
              <Link href={showcaseContent.cta.href || "#"}>
                {showcaseContent.cta.label || "View All Projects"}
                <ExternalLink className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
};

const GetInvolvedSection = () => {
  const { theme } = useTheme();
  const { content } = useContent();
  const isDark = theme === "dark";

  const getInvolvedContent = content?.all_prototypes?.getInvolved || {};
  const steps = getInvolvedContent.steps || [];
  const summary = getInvolvedContent.summary || "";

  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-orange-900/20 to-slate-900"
    : "bg-gradient-to-br from-orange-50/80 via-red-50/50 to-pink-50/80";

  const cardBg = isDark
    ? "bg-white/5 backdrop-blur-sm border-white/10 hover:border-orange-400/30"
    : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-orange-400/30";

  const titleColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-300" : "text-gray-700";

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
          {getInvolvedContent.heading || "Get"}{" "}
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
            {summary}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {getInvolvedContent.primaryCta && (
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700" asChild>
                <Link href={getInvolvedContent.primaryCta.href || "#"}>
                  {getInvolvedContent.primaryCta.label || "Start Your Project"}
                </Link>
              </Button>
            )}
            {getInvolvedContent.secondaryCta && (
              <Button variant="outline" size="lg" asChild>
                <Link href={getInvolvedContent.secondaryCta.href || "#"}>
                  {getInvolvedContent.secondaryCta.label || "Join as Mentor"}
                </Link>
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
};