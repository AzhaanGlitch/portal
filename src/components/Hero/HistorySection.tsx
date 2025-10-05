import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { FaHistory } from "react-icons/fa";
import { useContent } from "@/context/ContentContext";

const HistorySection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { content, loading, error } = useContent();

  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900"
    : "bg-gradient-to-br from-blue-50 via-cyan-50 to-slate-100";

  const titleColor = isDark ? "text-white" : "text-gray-900";

  // Loading state
  if (loading && !content.history) {
    return (
      <section className={`w-full min-h-screen flex items-center justify-center ${sectionBg}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Loading history...
          </p>
        </div>
      </section>
    );
  }

  // Error state
  if (error && !content.history) {
    return (
      <section className={`w-full min-h-screen flex items-center justify-center ${sectionBg}`}>
        <div className="text-center">
          <p className={`text-lg text-red-500 mb-4`}>Error loading history content</p>
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

  // Fallback content if no history data
  const historyData = content.history?.timeline || [
    {
      year: "2019",
      event: "Founding of I2EDC",
      description: "Established the innovation cell to foster student entrepreneurship"
    },
    {
      year: "2020",
      event: "Launch of Protospace",
      description: "Opened our state-of-the-art prototyping facility"
    },
    {
      year: "2022",
      event: "Annual Innovation Summit",
      description: "Hosted our first major innovation conference"
    },
    {
      year: "2023",
      event: "Expanded Labs",
      description: "Added AI, Robotics, and IoT labs for students"
    },
    {
      year: "2024",
      event: "National Collaboration",
      description: "Partnered with institutes for nationwide innovation programs"
    }
  ];

  return (
    <section
      className={`w-full min-h-screen flex items-center justify-center ${sectionBg}`}
    >
      <div className="max-w-5xl w-full px-6 py-12">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`text-4xl md:text-5xl font-bold mb-12 text-center ${titleColor}`}
        >
          I2EDC{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-600">
            History
          </span>
        </motion.h2>

        <VerticalTimeline lineColor={isDark ? "cyan" : "blue"}>
          {historyData.map((milestone:any, index:any) => (
            <VerticalTimelineElement
              key={`${milestone.year}-${index}`}
              date={milestone.year}
              iconStyle={{
                background: isDark ? "#06b6d4" : "#3b82f6",
                color: "#fff",
              }}
              icon={<FaHistory />}
              contentStyle={{
                background: isDark ? "rgba(255, 255, 255, 0.05)" : "#fff",
                color: isDark ? "#fff" : "#333",
                border: isDark
                  ? "1px solid rgba(255,255,255,0.1)"
                  : "1px solid #e5e7eb",
                marginBottom: "-70px",
              }}
              contentArrowStyle={{
                borderRight: isDark
                  ? "7px solid rgba(255, 255, 255, 0.1)"
                  : "7px solid #e5e7eb",
              }}
            >
              <h3 className={`text-xl font-bold mb-2`}>{milestone.event}</h3>
              <p className={`${isDark ? "text-gray-300" : "text-gray-700"}`}>
                {milestone.description}
              </p>
            </VerticalTimelineElement>
          ))}
        </VerticalTimeline>
      </div>
    </section>
  );
};

export default HistorySection;