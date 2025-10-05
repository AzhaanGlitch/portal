// TeamSection.tsx
"use client";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useContent } from "@/context/ContentContext";

const TeamSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { content, loading, error } = useContent();

  // Loading state
  if (loading && !content.team) {
    return (
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Loading team...
          </p>
        </div>
      </section>
    );
  }

  // Error state
  if (error && !content.team) {
    return (
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        <div className="text-center">
          <p className={`text-lg text-red-500 mb-4`}>Error loading team content</p>
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

  // Fallback content if no team data
  const teamData = content.team || {
    core_members: [
      {
        name: "Ashutosh Vishwakarma",
        role: "Founder & Lead Engineer",
        image: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=1000&q=80"
      },
      {
        name: "Ashutosh Vishwakarma",
        role: "AI & Robotics Specialist",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=1000&q=80"
      },
      {
        name: "Ashutosh Vishwakarma",
        role: "AI & Robotics Specialist",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=1000&q=80"
      },
      {
        name: "Ashutosh Vishwakarma",
        role: "AI & Robotics Specialist",
        image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=1000&q=80"
      }
    ],
    club_heads: [
      {
        name: "Ashutosh Vishwakarma",
        role: "Full Stack Developer",
        image: "https://images.unsplash.com/photo-1603415526960-f8f0a7090f88?auto=format&fit=crop&w=1000&q=80"
      },
      {
        name: "Ashutosh Vishwakarma",
        role: "Design & UI/UX",
        image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=1000&q=80"
      }
    ]
  };

  const renderTeam = (members: typeof teamData.core_members, delayBase = 0) => (
    <div className="flex flex-wrap justify-center gap-8 mb-8">
      {members.map((member:any, index:any) => (
        <motion.div
          key={`${member.name}-${index}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: delayBase + index * 0.1 }}
          className={`${
            isDark
              ? "bg-white/10 border-white/20"
              : "bg-black/5 border-black/10"
          } backdrop-blur-md p-6 rounded-xl border flex flex-col items-center group w-64`}
        >
          <div className="w-32 h-32 mb-4 overflow-hidden rounded-full border-2 border-white/30">
            <img
              src={member.image}
              alt={member.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </div>
          <h3
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-gray-900"
            } mb-1`}
          >
            {member.name}
          </h3>
          <p className={`${isDark ? "text-slate-300" : "text-gray-600"} text-sm`}>
            {member.role}
          </p>
        </motion.div>
      ))}
    </div>
  );

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-2 text-center px-4 max-w-6xl mx-auto py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={`text-3xl md:text-4xl lg:text-5xl font-bold ${
            isDark ? "text-white" : "text-gray-900"
          } mb-8 font-serif`}
        >
          Meet Our Team
        </motion.h2>

        {/* Core Members */}
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`text-2xl font-semibold mb-8 ${
            isDark ? "text-cyan-400" : "text-cyan-600"
          }`}
        >
          I2EDC Core Members
        </motion.h3>
        {renderTeam(teamData.core_members)}

        {/* Club Heads & Student Leaders */}
        <motion.h3
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className={`text-2xl font-semibold mb-8 ${
            isDark ? "text-green-400" : "text-green-600"
          }`}
        >
          Club Heads & Student Leaders
        </motion.h3>
        {renderTeam(teamData.club_heads, 0.3)}
      </div>
    </section>
  );
};

export default TeamSection;