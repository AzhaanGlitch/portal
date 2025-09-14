// about.jsx
"use client";
import { motion } from "framer-motion";
import BackgroundAnimation from "../animations/BackgroundAnimation/BackgroundAnimation";
import GradientBlinds from "../animations/GradientBlinds/GradientBlinds";
import styles from "./about.module.css";

export default function Contact() {
  return (
    <div className="relative">
      <BackgroundAnimation />
      <ContactHeroSection />
      <ContactSection />
    </div>
  );
}

const ContactHeroSection = () => {
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
          Conatct Us
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

const ContactSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center py-20">
      <div className="relative z-10 px-4 max-w-4xl mx-auto">

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
