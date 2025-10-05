// Hero.tsx - Updated version
"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ServicesSection from "./ServicesSection";
import PrototypesSection from "./PrototypesSection";
import TeamSection from "./TeamSection";
import LiquidEther from "../animations/LiquidEther/LiquidEther";
import { useTheme } from "next-themes";
import HistorySection from "./HistorySection";
import EventsSection from "./EventSection";
import { useContent } from "@/context/ContentContext";
const scrollToSection = (id: string) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};
export default function HomePage() {
  const [currentSection, setCurrentSection] = useState(0);
  const isScrolling = useRef(false);
  const sections = useRef<HTMLElement[]>([]);

  // Register sections
  useEffect(() => {
    const updateSections = () => {
      sections.current = Array.from(document.querySelectorAll("section"));
    };
    updateSections();
    window.addEventListener("resize", updateSections);
    return () => window.removeEventListener("resize", updateSections);
  }, []);

  // Handle scroll + keyboard
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling.current) return;

      isScrolling.current = true;

      if (e.deltaY > 0) {
        setCurrentSection((prev) =>
          Math.min(prev + 1, sections.current.length - 1)
        );
      } else {
        setCurrentSection((prev) => Math.max(prev - 1, 0));
      }

      setTimeout(() => {
        isScrolling.current = false;
      }, 100);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling.current) return;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        isScrolling.current = true;
        setCurrentSection((prev) =>
          Math.min(prev + 1, sections.current.length - 1)
        );
        setTimeout(() => (isScrolling.current = false), 200);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        isScrolling.current = true;
        setCurrentSection((prev) => Math.max(prev - 1, 0));
        setTimeout(() => (isScrolling.current = false), 200);
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Scroll to the current section
  useEffect(() => {
    if (sections.current.length > 0 && sections.current[currentSection]) {
      isScrolling.current = true;
      window.scrollTo({
        top: sections.current[currentSection].offsetTop,
        behavior: "smooth",
      });

      setTimeout(() => {
        isScrolling.current = false;
      }, 200);
    }
  }, [currentSection]);

  return (
    <div className="relative">
      <HeroSection />
      <AboutSection />
      <ServicesSection />
      <HistorySection />
      <EventsSection />
      <PrototypesSection />
      <TeamSection />
    </div>
  );
}

export const HeroSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { content, loading, error } = useContent();

  // Loading state
  if (loading && !content.hero) {
    return (
      <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Loading...
          </p>
        </div>
      </section>
    );
  }

  // Error state
  if (error && !content.hero) {
    return (
      <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <p className={`text-lg text-red-500 mb-4`}>Error loading content</p>
          <button 
            onClick={() => window.location.reload()}
            className={`px-6 py-3 rounded-lg font-semibold ${
              isDark 
                ? "bg-white/10 text-white border border-white/30" 
                : "bg-gray-100 text-gray-800 border border-gray-300"
            }`}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // Fallback content if no hero data
  const heroData = content.hero || {
    headline: {
      parts: [
        { text: "Innovate.", style: "gradient-blue-purple" },
        { text: "Create.", style: "gradient-green-cyan" },
        { text: "Transform.", style: "gradient-orange-pink" }
      ]
    },
    description: "The Institute Innovation Entrepreneurship Development Cell (I2EDC) is a hub for student innovators and entrepreneurs. We provide resources, mentorship, and a vibrant community to help you bring your ideas to life.",
    buttons: [
      { text: "Explore I2EDC", action: "scroll_to_explore" },
      { text: "Join Community", action: "navigate_to_auth" }
    ]
  };

  const getGradientClass = (style: string, isDark: boolean) => {
    const gradients: { [key: string]: { dark: string, light: string } } = {
      "gradient-blue-purple": {
        dark: "from-blue-400 to-purple-600",
        light: "from-blue-600 to-purple-700"
      },
      "gradient-green-cyan": {
        dark: "from-green-400 to-cyan-600",
        light: "from-green-600 to-cyan-700"
      },
      "gradient-orange-pink": {
        dark: "from-orange-400 to-pink-600",
        light: "from-orange-600 to-pink-700"
      }
    };
    
    const gradient = gradients[style] || gradients["gradient-blue-purple"];
    return isDark ? gradient.dark : gradient.light;
  };

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <LiquidEther />
      </div>

      {/* Hero Content */}
      <div
        className={`relative z-10 h-full flex flex-col justify-center items-center text-center px-6 ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
            {heroData.headline.parts.map((part: any, index: any) => (
              <span key={index}>
              <span
                className={`bg-gradient-to-r ${getGradientClass(part.style, isDark)} bg-clip-text text-transparent`}
              >
                {part.text}
              </span>
              {index < heroData.headline.parts.length - 1 && " "}
              </span>
            ))}
            </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            {heroData.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {heroData.buttons.map((button:any, index:any) => {
              if (button.action === "scroll_to_explore") {
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 border ${
                      isDark
                        ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-400/30 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                        : "bg-gradient-to-r from-blue-600 to-purple-700 text-white border-blue-500/30 shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40"
                    }`}
                    onClick={() => scrollToSection("explore")}
                  >
                    {button.text}
                  </motion.button>
                );
              } else if (button.action === "navigate_to_auth") {
                return (
                  <Link key={index} href="/auth" scroll={false}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`px-8 py-4 rounded-lg font-semibold border transition-all duration-300 ${
                        isDark
                          ? "bg-transparent text-white border-white/30 hover:bg-white/10"
                          : "bg-transparent text-gray-800 border-gray-400 hover:bg-gray-100/50"
                      }`}
                    >
                      {button.text}
                    </motion.button>
                  </Link>
                );
              }
              return null;
            })}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
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

const AboutSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { content, loading, error } = useContent();

  // Loading state
  if (loading && !content.about) {
    return (
      <section className={`relative w-full min-h-screen flex items-center justify-center ${
        isDark 
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" 
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50"
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Loading about content...
          </p>
        </div>
      </section>
    );
  }

  // Error state
  if (error && !content.about) {
    return (
      <section className={`relative w-full min-h-screen flex items-center justify-center ${
        isDark 
          ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900" 
          : "bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50"
      }`}>
        <div className="text-center">
          <p className={`text-lg text-red-500 mb-4`}>Error loading about content</p>
          <button 
            onClick={() => window.location.reload()}
            className={`px-6 py-3 rounded-lg font-semibold ${
              isDark 
                ? "bg-white/10 text-white border border-white/30" 
                : "bg-gray-100 text-gray-800 border border-gray-300"
            }`}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  // Fallback content if no about data
  const aboutData = content.about || {
    title: "Explore I2EDC",
    subtitle: "Our Offerings",
    offerings: [
      {
        title: "Protospace",
        description: "A collaborative workspace equipped with tools and resources for prototyping and development.",
        gradient: "from-blue-500 to-cyan-500",
        icon: "<svg className=\"w-6 h-6 text-white\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10\" /></svg>"
      },
      {
        title: "Tinkering Lab",
        description: "A hands-on lab for experimenting with electronics, robotics, and IoT.",
        gradient: "from-purple-500 to-pink-500",
        icon: "<svg className=\"w-6 h-6 text-white\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z\" /></svg>"
      },
      {
        title: "Machine Services",
        description: "Access to a range of specialized machines for fabrication and manufacturing.",
        gradient: "from-orange-500 to-red-500",
        icon: "<svg className=\"w-6 h-6 text-white\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\"><path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z\" /><path strokeLinecap=\"round\" strokeLinejoin=\"round\" strokeWidth={2} d=\"M15 12a3 3 0 11-6 0 3 3 0 016 0z\" /></svg>"
      }
    ]
  };

  // Theme-based styles
  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    : "bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50";

  const cardBg = isDark
    ? "bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20"
    : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-gray-300";

  const titleColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-300" : "text-gray-700";

  // Function to render SVG from string
  const renderSVG = (svgString: string) => {
    return <div dangerouslySetInnerHTML={{ __html: svgString }} />;
  };

  return (
    <section
      className={`relative w-full min-h-screen flex items-center justify-center ${sectionBg}`}
      id="explore"
    >
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-4xl md:text-5xl font-bold ${titleColor} mb-4`}
        >
          {aboutData.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`text-lg md:text-xl ${textColor} mb-12 max-w-2xl mx-auto`}
        >
          {aboutData.subtitle}
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8">
          {aboutData.offerings.map((item:any, index:any) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`rounded-2xl p-8 border transition-all duration-300 hover:shadow-lg ${cardBg}`}
            >
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.gradient} mb-6 flex items-center justify-center`}
              >
                {renderSVG(item.icon)}
              </div>
              <h3 className={`text-xl font-bold ${titleColor} mb-4`}>
                {item.title}
              </h3>
              <p className={`leading-relaxed ${textColor}`}>
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};