// about.jsx - Updated version
"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import LiquidEther from "../animations/LiquidEther/LiquidEther";
import Link from "next/link";
export default function AboutPage() {
  return (
    <div className="relative">
      <AboutHeroSection />
      <MissionSection />
      <ValuesSection />
      <HistorySection />
      <LeadershipSection />
    </div>
  );
}

const AboutHeroSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <LiquidEther autoDemo={true} />
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
            About
          </span>{" "}
          <span
            className={`bg-gradient-to-r ${
              isDark
                ? "from-green-400 to-cyan-600"
                : "from-green-600 to-cyan-700"
            } bg-clip-text text-transparent`}
          >
            I2EDC
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
          Fostering innovation and entrepreneurship through cutting-edge
          resources, mentorship, and a vibrant community of student innovators
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
        >
          <Link href={"#mission"}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-4 rounded-lg font-semibold transition-all duration-300 border ${
                isDark
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-blue-400/30 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40"
                  : "bg-gradient-to-r from-blue-600 to-purple-700 text-white border-blue-500/30 shadow-lg shadow-blue-500/30 hover:shadow-blue-600/40"
              }`}
            >
              Our Mission
            </motion.button>
          </Link>
          <Link href={"#team"}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-4 rounded-lg font-semibold border transition-all duration-300 ${
              isDark
                ? "bg-transparent text-white border-white/30 hover:bg-white/10"
                : "bg-transparent text-gray-800 border-gray-400 hover:bg-gray-100/50"
            }`}
          >
            Meet the Team
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
        <span className="text-sm mb-2">Scroll to explore</span>
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

const MissionSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900"
    : "bg-gradient-to-br from-gray-50 via-blue-50/50 to-gray-50";

  const cardBg = isDark
    ? "bg-white/5 backdrop-blur-sm border-white/10 hover:border-blue-400/30"
    : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-blue-400/30";

  const titleColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-300" : "text-gray-700";
  const accentColor = isDark ? "text-blue-400" : "text-blue-600";

  return (
    <section
      className={`relative w-full min-h-screen flex items-center justify-center ${sectionBg}`} id="mission"
    >
      <div className="relative z-10 px-4 max-w-4xl mx-auto">
        <motion.h2
          className={`text-4xl md:text-5xl font-bold text-center mb-12 ${titleColor}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Our{" "}
          <span
            className={`bg-gradient-to-r ${
              isDark ? "from-blue-400 to-cyan-400" : "from-blue-600 to-cyan-600"
            } bg-clip-text text-transparent`}
          >
            Mission
          </span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          className={`text-lg md:text-xl leading-relaxed text-center mb-12 ${textColor}`}
        >
          <p className="mb-6">
            At the Institute Innovation Entrepreneurship Development Cell
            (I2EDC), we're revolutionizing student innovation with
            state-of-the-art facilities and mentorship that empower students to
            transform ideas into reality.
          </p>
          <p>
            Our mission is to provide accessible innovation resources, foster
            entrepreneurial thinking, and build a vibrant community where
            creativity meets execution.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          {[
            {
              title: "Innovation",
              desc: "Creating an ecosystem that nurtures groundbreaking ideas",
              icon: "🚀",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              title: "Accessibility",
              desc: "Making innovation resources available to every student",
              icon: "🔓",
              gradient: "from-green-500 to-teal-500",
            },
            {
              title: "Community",
              desc: "Building a collaborative network of student innovators",
              icon: "🤝",
              gradient: "from-purple-500 to-pink-500",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`rounded-2xl p-6 border transition-all duration-300 ${cardBg}`}
            >
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.gradient} mb-4 flex items-center justify-center text-white text-xl`}
              >
                {item.icon}
              </div>
              <h3 className={`text-xl font-bold mb-3 ${accentColor}`}>
                {item.title}
              </h3>
              <p className={textColor}>{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const ValuesSection = () => {
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
  const accentColor = isDark ? "text-purple-400" : "text-purple-600";

  const values = [
    {
      title: "Excellence",
      description:
        "We pursue technical excellence in every project, from prototyping to execution.",
      icon: "⭐",
      gradient: "from-yellow-500 to-orange-500",
    },
    {
      title: "Innovation",
      description:
        "We challenge conventions and pioneer new approaches to problem-solving.",
      icon: "💡",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Collaboration",
      description:
        "We believe great achievements are born from teamwork and shared vision.",
      icon: "🤝",
      gradient: "from-green-500 to-teal-500",
    },
    {
      title: "Integrity",
      description:
        "We operate with transparency, honesty, and ethical principles.",
      icon: "🔒",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section
      className={`relative w-full min-h-screen flex items-center justify-center ${sectionBg}`}
    >
      <div className="relative z-10 px-4 max-w-6xl mx-auto">
        <motion.h2
          className={`text-4xl md:text-5xl font-bold text-center mb-16 ${titleColor}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Our{" "}
          <span
            className={`bg-gradient-to-r ${
              isDark
                ? "from-purple-400 to-pink-400"
                : "from-purple-600 to-pink-600"
            } bg-clip-text text-transparent`}
          >
            Values
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`rounded-2xl p-8 border transition-all duration-300 hover:shadow-lg ${cardBg}`}
            >
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${value.gradient} mb-6 flex items-center justify-center text-white text-xl`}
              >
                {value.icon}
              </div>
              <h3 className={`text-2xl font-bold mb-3 ${accentColor}`}>
                {value.title}
              </h3>
              <p className={`text-lg ${textColor}`}>{value.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <p className={`text-xl max-w-3xl mx-auto ${textColor}`}>
            These values guide our decisions, shape our culture, and drive us
            toward our vision of creating the next generation of innovators and
            entrepreneurs.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const HistorySection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-green-900/20 to-slate-900"
    : "bg-gradient-to-br from-green-50/80 via-cyan-50/50 to-blue-50/80";

  const cardBg = isDark
    ? "bg-white/5 backdrop-blur-sm border-white/10 hover:border-green-400/30"
    : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-green-400/30";

  const titleColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-300" : "text-gray-700";
  const accentColor = isDark ? "text-green-400" : "text-green-600";

  const milestones = [
    {
      year: "2018",
      event: "I2EDC established with vision for student innovation hub",
    },
    {
      year: "2019",
      event: "Launched Protospace with initial prototyping equipment",
    },
    {
      year: "2020",
      event: "Expanded to include Tinkering Lab and Machine Services",
    },
    {
      year: "2022",
      event: "100+ student projects supported, 10+ startups incubated",
    },
    {
      year: "2024",
      event: "Became premier innovation hub with 500+ active members",
    },
  ];

  return (
    <section
      className={`relative w-full min-h-screen flex items-center justify-center pt-20 ${sectionBg}`}
    >
      <div className="relative z-10 px-4 max-w-6xl mx-auto">
        <motion.h2
          className={`text-4xl md:text-5xl font-bold text-center mb-16 ${titleColor}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Our{" "}
          <span
            className={`bg-gradient-to-r ${
              isDark
                ? "from-green-400 to-cyan-400"
                : "from-green-600 to-cyan-600"
            } bg-clip-text text-transparent`}
          >
            Journey
          </span>
        </motion.h2>

        <div className="relative">
          {/* Vertical timeline line */}
          <div
            className={`absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b ${
              isDark
                ? "from-green-500/30 via-cyan-500/30 to-blue-500/30"
                : "from-green-400/50 via-cyan-400/50 to-blue-400/50"
            } transform -translate-x-1/2 hidden md:block`}
          ></div>

          {milestones.map((milestone, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`relative flex flex-col md:flex-row items-center mb-12 md:mb-0 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Content */}
              <div
                className={`w-full md:w-1/2 p-4 ${
                  index % 2 === 0
                    ? "md:pl-8 md:text-left"
                    : "md:pr-8 md:text-right"
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`rounded-2xl p-6 border transition-all duration-300 ${cardBg}`}
                >
                  <h3 className={`text-2xl font-bold mb-2 ${accentColor}`}>
                    {milestone.year}
                  </h3>
                  <p className={textColor}>{milestone.event}</p>
                </motion.div>
              </div>

              {/* Timeline marker */}
              <div
                className={`hidden md:flex w-12 h-12 rounded-full bg-gradient-to-r ${
                  isDark
                    ? "from-green-500 to-cyan-600"
                    : "from-green-600 to-cyan-700"
                } flex items-center justify-center relative z-10 border-4 ${
                  isDark ? "border-slate-900" : "border-white"
                } mx-4 shadow-lg ${
                  isDark ? "shadow-green-500/20" : "shadow-green-500/30"
                }`}
              >
                <div className="w-3 h-3 rounded-full bg-white"></div>
              </div>

              {/* Empty space for the other side */}
              <div className="w-full md:w-1/2 p-4 hidden md:block">
                {/* This empty div balances the layout */}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LeadershipSection = () => {
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
  const accentColor = isDark ? "text-orange-400" : "text-orange-600";

  const team = [
    {
      name: "Dr. Sarah Johnson",
      role: "Faculty Coordinator",
      bio: "Professor of Innovation & Entrepreneurship with 10+ years experience in student mentorship.",
    },
    {
      name: "Rajesh Kumar",
      role: "Student President",
      bio: "Final year Engineering student with multiple successful innovation projects.",
    },
    {
      name: "Priya Sharma",
      role: "Technical Head",
      bio: "Expert in prototyping technologies and maker space management.",
    },
    {
      name: "Amit Patel",
      role: "Operations Manager",
      bio: "Manages I2EDC facilities and coordinates innovation workshops.",
    },
  ];

  return (
    <section
      className={`relative w-full min-h-screen flex items-center justify-center py-20 ${sectionBg}`} id="team"
    >
      <div className="relative z-10 px-4 max-w-6xl mx-auto">
        <motion.h2
          className={`text-4xl md:text-5xl font-bold text-center mb-16 ${titleColor}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Leadership{" "}
          <span
            className={`bg-gradient-to-r ${
              isDark
                ? "from-orange-400 to-pink-400"
                : "from-orange-600 to-pink-600"
            } bg-clip-text text-transparent`}
          >
            Team
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`rounded-2xl overflow-hidden border transition-all duration-300 hover:shadow-lg ${cardBg}`}
            >
              <div
                className={`h-48 bg-gradient-to-r ${
                  isDark
                    ? "from-orange-900/20 to-pink-900/20"
                    : "from-orange-100 to-pink-100"
                } relative overflow-hidden flex items-center justify-center`}
              >
                <div
                  className={`text-6xl ${
                    isDark ? "text-orange-400/30" : "text-orange-600/30"
                  }`}
                >
                  {member.name.split(" ")[0].charAt(0)}
                  {member.name.split(" ")[1].charAt(0)}
                </div>
              </div>
              <div className="p-6">
                <h3 className={`text-2xl font-bold mb-2 ${titleColor}`}>
                  {member.name}
                </h3>
                <p className={`mb-4 ${accentColor}`}>{member.role}</p>
                <p className={textColor}>{member.bio}</p>
                <div className="flex mt-4 space-x-3">
                  <button
                    className={`text-sm transition-colors ${
                      isDark
                        ? "text-orange-400 hover:text-orange-300"
                        : "text-orange-600 hover:text-orange-500"
                    }`}
                  >
                    LinkedIn
                  </button>
                  <button
                    className={`text-sm transition-colors ${
                      isDark
                        ? "text-orange-400 hover:text-orange-300"
                        : "text-orange-600 hover:text-orange-500"
                    }`}
                  >
                    Full Bio
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <p className={`text-xl max-w-3xl mx-auto mb-8 ${textColor}`}>
            Our leadership team brings together faculty expertise and student
            passion to create an environment where innovation thrives and
            entrepreneurial dreams take flight.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
