// about.jsx
"use client";
import { motion } from "framer-motion";
import BackgroundAnimation from "../animations/BackgroundAnimation/BackgroundAnimation";
import GradientBlinds from "../animations/GradientBlinds/GradientBlinds";
import styles from "./about.module.css";

export default function ContactPage() {
  return (
    <div className="relative">
      <BackgroundAnimation />
      <AboutHeroSection />
      <MissionSection />
      <ValuesSection />
      <HistorySection />
      <LeadershipSection />
    </div>
  );
}

const AboutHeroSection = () => {
  return (
    <section className="relative w-full h-screen overflow-hidden">
      <GradientBlinds
        gradientColors={["#FF9FFC", "#5227FF"]}
        angle={20}
        noise={0.3}
        blindCount={12}
        blindMinWidth={50}
        spotlightRadius={0.5}
        spotlightSoftness={1}
        spotlightOpacity={1}
        mouseDampening={0.15}
        distortAmount={0}
        shineDirection="left"
        mixBlendMode="lighten"
      />

      {/* Content */}
      <div className={styles["hero-content"]}>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-white font-bold text-5xl md:text-6xl lg:text-7xl mb-6"
        >
          About Portal Space
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-light tracking-wide"
        >
          Pioneering the future of space mobility with innovative propulsion
          technologies
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
          >
            Our Mission
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-transparent text-white rounded-lg font-medium border border-white/20 hover:bg-white/5 transition-all duration-300"
          >
            Meet the Team
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center"
      >
        <span className="text-sm mb-2">Scroll to explore</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};

const MissionSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-20">
      <div className="relative z-10 px-4 max-w-4xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Our Mission
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-xl text-slate-300 mb-12 leading-relaxed text-center"
        >
          <p className="mb-6">
            At Portal Space Systems, we&lsquo;re revolutionizing space mobility with
            innovative propulsion technologies that enable satellites to
            maneuver with unprecedented agility and efficiency.
          </p>
          <p>
            Our mission is to provide on-demand maneuverability solutions that
            extend satellite lifetimes, enhance mission capabilities, and
            support sustainable space operations.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
        >
          {[
            {
              title: "Innovation",
              desc: "Pushing the boundaries of propulsion technology",
            },
            {
              title: "Sustainability",
              desc: "Enabling responsible space operations",
            },
            {
              title: "Reliability",
              desc: "Mission-critical solutions you can trust",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-700/30 hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="text-cyan-400 text-2xl mb-3">
                {index === 0 && "🚀"}
                {index === 1 && "🌎"}
                {index === 2 && "🛡️"}
              </div>
              <h3 className="text-cyan-400 text-xl font-semibold mb-3">
                {item.title}
              </h3>
              <p className="text-slate-400">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const ValuesSection = () => {
  const values = [
    {
      title: "Excellence",
      description:
        "We pursue technical excellence in everything we do, from design to execution.",
      icon: "⭐",
    },
    {
      title: "Innovation",
      description:
        "We challenge conventions and pioneer new approaches to space mobility.",
      icon: "🚀",
    },
    {
      title: "Collaboration",
      description:
        "We believe great achievements are born from teamwork and shared vision.",
      icon: "🤝",
    },
    {
      title: "Integrity",
      description:
        "We operate with transparency, honesty, and ethical principles.",
      icon: "🔒",
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20">
      <div className="relative z-10 px-4 max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Our Values
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-slate-900/40 backdrop-blur-md p-8 rounded-2xl border border-slate-700/30 hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="text-4xl mb-4">{value.icon}</div>
              <h3 className="text-2xl font-bold text-cyan-400 mb-3">
                {value.title}
              </h3>
              <p className="text-slate-300 text-lg">{value.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            These values guide our decisions, shape our culture, and drive us
            toward our vision of transforming space mobility for a better
            future.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

const HistorySection = () => {
  const milestones = [
    {
      year: "2021",
      event: "Company founded with vision for agile space mobility",
    },
    {
      year: "2022",
      event: "Secured initial funding and established R&D facilities",
    },
    { year: "2023", event: "Successfully tested first propulsion prototype" },
    {
      year: "2024",
      event: "Expanded to new 50,000 sq. ft. manufacturing facility",
    },
    {
      year: "2025",
      event: "First commercial contracts signed with satellite operators",
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20">
      <div className="relative z-10 px-4 max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Our Journey
        </motion.h2>

        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500/30 via-blue-500/30 to-purple-500/30 transform -translate-x-1/2 hidden md:block"></div>

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
              {/* Content for left side (even indices) */}
              <div className={`w-full md:w-1/2 p-4 ${index % 2 === 0 ? "md:pl-8 md:text-left" : "md:pr-8 md:text-right"}`}>
                <div className="p-6 bg-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700/30 hover:border-cyan-500/30 transition-all duration-300">
                  <h3 className="text-2xl font-bold text-cyan-400 mb-2">
                    {milestone.year}
                  </h3>
                  <p className="text-slate-300">{milestone.event}</p>
                </div>
              </div>

              {/* Timeline marker */}
              <div className="hidden md:flex w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center relative z-10 border-4 border-slate-900 mx-4 shadow-lg shadow-cyan-500/20">
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
  const team = [
    {
      name: "Dr. Jane Smith",
      role: "CEO & Founder",
      bio: "Former NASA propulsion engineer with 15+ years experience in space systems.",
    },
    {
      name: "Michael Chen",
      role: "CTO",
      bio: "Ph.D in Aerospace Engineering with expertise in electric propulsion systems.",
    },
    {
      name: "Sarah Johnson",
      role: "VP of Operations",
      bio: "Seasoned operations leader with background in aerospace manufacturing.",
    },
    {
      name: "David Martinez",
      role: "Chief Engineer",
      bio: "Mechanical engineering expert specializing in propulsion system design.",
    },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center py-20">
      <div className="relative z-10 px-4 max-w-6xl mx-auto">
        <motion.h2
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Leadership Team
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="bg-slate-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-700/30 hover:border-cyan-500/30 transition-all duration-300"
            >
              <div className="h-48 bg-gradient-to-r from-cyan-900/20 to-blue-900/20 relative overflow-hidden flex items-center justify-center">
                <div className="text-6xl text-cyan-400/30">
                  {member.name.split(" ")[0].charAt(0)}
                  {member.name.split(" ")[1].charAt(0)}
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold text-white">{member.name}</h3>
                <p className="text-cyan-400 mb-4">{member.role}</p>
                <p className="text-slate-300">{member.bio}</p>
                <div className="flex mt-4 space-x-3">
                  <button className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm">
                    LinkedIn
                  </button>
                  <button className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm">
                    Full Bio
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-8">
            Our leadership team brings decades of combined experience in
            aerospace engineering, propulsion systems, and space technology
            development.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300"
          >
            View Full Team
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};
