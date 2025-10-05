"use client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useContent } from "@/context/ContentContext";

export default function PrototypesSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { content, loading, error } = useContent();

  // Loading state
  if (loading && !content.prototypes) {
    return (
      <section className={`relative w-full min-h-screen flex items-center justify-center ${
        isDark 
          ? "bg-gradient-to-br from-slate-900 via-green-900 to-slate-900" 
          : "bg-gradient-to-br from-green-50 via-cyan-50 to-emerald-50"
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Loading prototypes...
          </p>
        </div>
      </section>
    );
  }

  // Error state
  if (error && !content.prototypes) {
    return (
      <section className={`relative w-full min-h-screen flex items-center justify-center ${
        isDark 
          ? "bg-gradient-to-br from-slate-900 via-green-900 to-slate-900" 
          : "bg-gradient-to-br from-green-50 via-cyan-50 to-emerald-50"
      }`}>
        <div className="text-center">
          <p className={`text-lg text-red-500 mb-4`}>Error loading prototypes content</p>
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

  // Fallback content if no prototypes data
  const prototypesData = content.prototypes?.prototypes || [
    {
      title: "Smart Agriculture System",
      description: "An automatic system for monitoring and optimising crop growth.",
      category: "IoT & Automation"
    },
    {
      title: "Wearable Health Tracker",
      description: "A device for tracking vital signs and promoting healing habits.",
      category: "Healthcare"
    },
    {
      title: "Sustainable Energy Solution",
      description: "A solution for generating clean energy from renewable sources.",
      category: "Energy"
    }
  ];

  // Theme-based styles
  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-green-900 to-slate-900"
    : "bg-gradient-to-br from-green-50 via-cyan-50 to-emerald-50";

  const titleColor = isDark ? "text-white" : "text-gray-900";
  const subtitleGradient = isDark
    ? "from-green-400 to-cyan-400"
    : "from-green-600 to-cyan-600";

  const cardBg = isDark
    ? "bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/20"
    : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-gray-300";

  const categoryColor = isDark ? "text-green-400" : "text-green-600";
  const prototypeTitleColor = isDark ? "text-white" : "text-gray-900";
  const descriptionColor = isDark ? "text-gray-300" : "text-gray-700";
  const iconGradient = isDark
    ? "from-green-500 to-cyan-500"
    : "from-green-600 to-cyan-600";

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
          Student{" "}
          <span
            className={`text-transparent bg-gradient-to-r ${subtitleGradient} bg-clip-text`}
          >
            Prototypes
          </span>
        </motion.h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {prototypesData.map((prototype:any, index:any) => (
            <motion.div
              key={`${prototype.title}-${index}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`rounded-2xl p-8 border transition-all duration-300 group hover:shadow-lg ${cardBg}`}
            >
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${iconGradient} mb-6 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
              >
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
              </div>
              <span
                className={`${categoryColor} text-sm font-semibold mb-2 block`}
              >
                {prototype.category}
              </span>
              <h3 className={`text-xl font-bold ${prototypeTitleColor} mb-3`}>
                {prototype.title}
              </h3>
              <p className={`${descriptionColor} leading-relaxed`}>
                {prototype.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}