"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Link from "next/link";
const ServicesSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const services = [
    {
      title: "3D Printing",
      description:
        "High-precision additive manufacturing for prototypes and production parts",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      ),
      color: "from-blue-500 to-cyan-400",
    },
    {
      title: "Laser Cutting",
      description:
        "Precision laser cutting services for various materials with clean edges",
      icon: (
        <svg
          className="w-8 h-8"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
          />
        </svg>
      ),
      color: "from-purple-500 to-pink-500",
    },
    {
      title: "CNC Machining",
      description:
        "Computer-controlled machining for high-accuracy parts and components",
      icon: (
        <svg
          className="w-8 h-8"
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
      color: "from-amber-500 to-orange-500",
    },
    {
      title: "Design Consultation",
      description: "Expert guidance to optimize your designs for manufacturing",
      icon: (
        <svg
          className="w-8 h-8"
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
      color: "from-green-500 to-emerald-400",
    },
  ];

  // Theme styles
  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900"
    : "bg-gradient-to-br from-cyan-50 via-blue-50 to-slate-50";

  const titleGradient = isDark
    ? "from-cyan-400 to-blue-500"
    : "from-cyan-600 to-blue-600";

  const subtitleColor = isDark ? "text-slate-300" : "text-gray-600";

  const cardBg = isDark
    ? "bg-gray-800/30 border-cyan-500/20 hover:border-cyan-500/40"
    : "bg-white/80 border-gray-200 hover:border-cyan-400/40";

  const serviceTitleColor = isDark ? "text-white" : "text-gray-900";
  const serviceDescColor = isDark ? "text-slate-400" : "text-gray-700";

  const ctaBg = isDark
    ? "bg-gradient-to-r from-gray-800/40 to-gray-900/40 border-cyan-500/20"
    : "bg-gradient-to-r from-white to-gray-100 border-cyan-300/30";

  const ctaTitleColor = isDark ? "text-white" : "text-gray-900";
  const ctaDescColor = isDark ? "text-slate-300" : "text-gray-700";

  return (
    <section
      className={`relative w-full min-h-screen flex items-center justify-center overflow-hidden py-16 ${sectionBg}`}
    >
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent`}
        >
          Advanced Manufacturing Services
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`text-xl md:text-2xl mb-16 max-w-3xl mx-auto font-light tracking-wide ${subtitleColor}`}
        >
          From prototyping to production, we provide cutting-edge manufacturing
          solutions
        </motion.p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className={`backdrop-blur-sm rounded-xl p-6 border transition-all duration-300 ${cardBg}`}
            >
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${service.color} mb-4`}
              >
                {service.icon}
              </div>
              <h3 className={`text-xl font-bold mb-2 ${serviceTitleColor}`}>
                {service.title}
              </h3>
              <p className={`${serviceDescColor}`}>{service.description}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className={`backdrop-blur-sm rounded-2xl p-8 max-w-2xl mx-auto ${ctaBg}`}
        >
          <h3
            className={`text-2xl md:text-3xl font-bold mb-4 ${ctaTitleColor}`}
          >
            Ready to Bring Your Ideas to Life?
          </h3>
          <p className={`mb-6 ${ctaDescColor}`}>
            Get a free consultation and quote for your project today
          </p>
          <Link href={"/pages/contact#form"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium 
                     shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 
                     border border-cyan-400/30 flex items-center gap-2 mx-auto"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              Get a Free Quote
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesSection;
