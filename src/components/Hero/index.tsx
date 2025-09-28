// Hero.tsx - Updated version
"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

import ServicesSection from "./ServicesSection";
import PrototypesSection from "./PrototypesSection";
import TeamSection from "./TeamSection";
import LiquidEther from "../animations/LiquidEther/LiquidEther";
import { useTheme } from "next-themes";

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
            <span
              className={`bg-gradient-to-r ${
                isDark
                  ? "from-blue-400 to-purple-600"
                  : "from-blue-600 to-purple-700"
              } bg-clip-text text-transparent`}
            >
              Innovate.
            </span>{" "}
            <span
              className={`bg-gradient-to-r ${
                isDark
                  ? "from-green-400 to-cyan-600"
                  : "from-green-600 to-cyan-700"
              } bg-clip-text text-transparent`}
            >
              Create.
            </span>{" "}
            <span
              className={`bg-gradient-to-r ${
                isDark
                  ? "from-orange-400 to-pink-600"
                  : "from-orange-600 to-pink-700"
              } bg-clip-text text-transparent`}
            >
              Transform.
            </span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed ${
              isDark ? "text-gray-300" : "text-gray-700"
            }`}
          >
            The Institute Innovation Entrepreneurship Development Cell (I2EDC)
            is a hub for student innovators and entrepreneurs. We provide
            resources, mentorship, and a vibrant community to help you bring
            your ideas to life.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 border ${
                isDark
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-400/30 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                  : "bg-gradient-to-r from-blue-600 to-purple-700 text-white border-blue-500/30 shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40"
              }`}
            >
              Explore I2EDC
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-lg font-semibold border transition-all duration-300 ${
                isDark
                  ? "bg-transparent text-white border-white/30 hover:bg-white/10"
                  : "bg-transparent text-gray-800 border-gray-400 hover:bg-gray-100/50"
              }`}
            >
              Join Community
            </motion.button>
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
  const aboutData = {
    title: "Explore I2EDC",
    subtitle: "Our Offerings",
    offerings: [
      {
        title: "Protospace",
        description:
          "A collaborative workspace equipped with tools and resources for prototyping and development.",
        gradient: "from-blue-500 to-cyan-500",
        icon: (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
        ),
      },
      {
        title: "Tinkering Lab",
        description:
          "A hands-on lab for experimenting with electronics, robotics, and IoT.",
        gradient: "from-purple-500 to-pink-500",
        icon: (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        ),
      },
      {
        title: "Machine Services",
        description:
          "Access to a range of specialized machines for fabrication and manufacturing.",
        gradient: "from-orange-500 to-red-500",
        icon: (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        ),
      },
    ],
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
  const subtitleGradient = isDark
    ? "from-blue-400 to-purple-400"
    : "from-blue-600 to-purple-600";

  return (
    <section
      className={`relative w-full min-h-screen flex items-center justify-center ${sectionBg}`}
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
          {aboutData.offerings.map((item, index) => (
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
                {item.icon}
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

const HistorySection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  // Data for HistorySection
  const historyData = {
    title: "I2EDC History",
    milestones: [
      {
        year: "2020",
        event: "Launch of Protospace",
        description: "Opened our state-of-the-art prototyping facility",
      },
      {
        year: "2019",
        event: "Founding of I2EDC",
        description:
          "Established the innovation cell to foster student entrepreneurship",
      },
      {
        year: "2022",
        event: "Annual Innovation Summit",
        description: "Hosted our first major innovation conference",
      },
    ],
  };
  // Theme-based styles
  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
    : "bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-100";

  const titleColor = isDark ? "text-white" : "text-gray-900";
  const subtitleGradient = isDark
    ? "from-cyan-400 to-blue-400"
    : "from-cyan-600 to-blue-600";

  const timelineLine = isDark
    ? "bg-gradient-to-b from-cyan-500 to-blue-500"
    : "bg-gradient-to-b from-cyan-400 to-blue-400";

  const timelineDot = isDark
    ? "bg-gradient-to-r from-cyan-500 to-blue-500"
    : "bg-gradient-to-r from-cyan-600 to-blue-600";

  const cardBg = isDark
    ? "bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20"
    : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-gray-300";

  const eventColor = isDark ? "text-white" : "text-gray-900";
  const yearColor = isDark ? "text-gray-300" : "text-gray-600";
  const descriptionColor = isDark ? "text-gray-400" : "text-gray-500";

  return (
    <section
      className={`relative w-full min-h-screen flex items-center justify-center ${sectionBg}`}
    >
      <div className="relative z-10 px-6 max-w-4xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-4xl md:text-5xl font-bold ${titleColor} mb-12 text-center`}
        >
          {historyData.title.split(" ")[0]}{" "}
          <span
            className={`text-transparent bg-gradient-to-r ${subtitleGradient} bg-clip-text`}
          >
            {historyData.title.split(" ")[1]}
          </span>
        </motion.h2>

        <div className="relative">
          {/* Timeline line */}
          <div
            className={`absolute left-8 top-0 bottom-0 w-0.5 ${timelineLine}`}
          ></div>

          {historyData.milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative flex items-center mb-12 last:mb-0"
            >
              {/* Timeline dot */}
              <div
                className={`absolute left-0 w-16 h-16 rounded-full ${timelineDot} flex items-center justify-center z-10 shadow-lg`}
              >
                <span className="text-white font-bold text-sm">
                  {milestone.year}
                </span>
              </div>

              <div
                className={`ml-24 rounded-2xl p-6 border transition-all duration-300 ${cardBg}`}
              >
                <h3 className={`text-xl font-bold ${eventColor} mb-2`}>
                  {milestone.event}
                </h3>
                <p className={`text-sm font-medium ${yearColor} mb-2`}>
                  {milestone.year}
                </p>
                <p className={`text-sm ${descriptionColor}`}>
                  {milestone.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const EventsSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  // Data for EventsSection
  const eventsData = {
    title: "Upcoming Events",
    events: [
      {
        title: "Innovation Conference 2024",
        description:
          "A gathering of innovations, entrepreneurs, and industry experts.",
        date: "Coming Soon",
        link: "/events/innovation-conference-2024",
        icon: (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        ),
      },
      {
        title: "3D Printing Workshop",
        description:
          "Learn the basics of 3D printing and create your own designs.",
        date: "Coming Soon",
        link: "/events/3d-printing-workshop",
        icon: (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
            />
          </svg>
        ),
      },
      {
        title: "Startup Networking Mixer",
        description:
          "Connect with fellow entrepreneurs and potential investors.",
        date: "Coming Soon",
        link: "/events/startup-networking-mixer",
        icon: (
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        ),
      },
    ],
  };

  // Theme-based styles
  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
    : "bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50";

  const titleColor = isDark ? "text-white" : "text-gray-900";
  const subtitleGradient = isDark
    ? "from-purple-400 to-pink-400"
    : "from-purple-600 to-pink-600";

  const cardBg = isDark
    ? "bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20"
    : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-gray-300";

  const eventTitleColor = isDark ? "text-white" : "text-gray-900";
  const eventDescriptionColor = isDark ? "text-gray-300" : "text-gray-700";
  const dateColor = isDark ? "text-purple-400" : "text-purple-600";
  const buttonColor = isDark
    ? "text-white hover:text-purple-400"
    : "text-gray-700 hover:text-purple-600";

  const iconGradient = isDark
    ? "from-purple-500 to-pink-500"
    : "from-purple-600 to-pink-600";

  return (
    <section
      className={`relative w-full min-h-screen flex items-center justify-center ${sectionBg}`}
    >
      <div className="relative z-10 px-6 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-4xl md:text-5xl font-bold ${titleColor} mb-12 text-center`}
        >
          {eventsData.title.split(" ")[0]}{" "}
          <span
            className={`text-transparent bg-gradient-to-r ${subtitleGradient} bg-clip-text`}
          >
            {eventsData.title.split(" ")[1]}
          </span>
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {eventsData.events.map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`rounded-2xl p-8 border transition-all duration-300 group hover:shadow-lg ${cardBg}`}
            >
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${iconGradient} mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
              >
                {event.icon}
              </div>

              <h3 className={`text-xl font-bold ${eventTitleColor} mb-3`}>
                {event.title}
              </h3>

              <p className={`mb-4 leading-relaxed ${eventDescriptionColor}`}>
                {event.description}
              </p>

              <div className="flex items-center justify-between">
                <span className={`font-semibold ${dateColor}`}>
                  {event.date}
                </span>
                <a
                  href={event.link}
                  className={`transition-colors duration-300 flex items-center gap-1 ${buttonColor}`}
                >
                  Learn More
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </a>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-center mt-12"
        >
          <a
            href="/events"
            className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              isDark
                ? "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                : "bg-purple-100 text-purple-700 border border-purple-200 hover:bg-purple-200"
            }`}
          >
            View All Events
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
};
