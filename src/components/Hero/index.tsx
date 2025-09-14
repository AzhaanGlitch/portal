// Hero.tsx

"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import styles from "./hero.module.css";
import GradientBlinds from "../animations/GradientBlinds/GradientBlinds";
import BlurText from "../animations/BlurText/BlurText";
import ServicesSection from "./ServicesSection";
import PrototypesSection from "./PrototypesSection";
import TeamSection from "./TeamSection";
import BackgroundAnimation from "../animations/BackgroundAnimation/BackgroundAnimation";

// News data for the carousel
const newsData = [
  {
    title: "Portal Space Systems Expands Manufacturing Footprint with New 50,000 Sq. Ft. Facility in Bothell, WA",
    image: "https://cdn.prod.website-files.com/67f8bd9d630dd52ec429fb93/685545c256fb25811dad7522_Portal%20Space%20Systems%20Expands.avif",
    link: "/news/portal-space-systems-expands-manufacturing-footprint-with-new-50-000-sq-ft-facility-in-bothell-wa"
  },
  {
    title: "Revolutionary IoT Platform Launches to Transform Industrial Automation",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&h=300&fit=crop",
    link: "/news/iot-platform-launches"
  },
  {
    title: "AI-Powered Robotics Division Secures $50M Series B Funding Round",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop",
    link: "/news/ai-robotics-funding"
  },
  {
    title: "Partnership with NASA for Next-Generation Space Technology Development",
    image: "https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=400&h=300&fit=crop",
    link: "/news/nasa-partnership"
  },
  {
    title: "Breakthrough in Quantum Computing Integration with Industrial Systems",
    image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&h=300&fit=crop",
    link: "/news/quantum-computing-breakthrough"
  }
];

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
      e.preventDefault(); // stop native scroll
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
      }, 1200); // match smooth scroll duration
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isScrolling.current) return;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        isScrolling.current = true;
        setCurrentSection((prev) =>
          Math.min(prev + 1, sections.current.length - 1)
        );
        setTimeout(() => (isScrolling.current = false), 1200);
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        isScrolling.current = true;
        setCurrentSection((prev) => Math.max(prev - 1, 0));
        setTimeout(() => (isScrolling.current = false), 1200);
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
      }, 1200);
    }
  }, [currentSection]);

  return (
    <div className="relative">
      <BackgroundAnimation/>
      <HeroSection />
      <NextSection />
      <ServicesSection />
      <PrototypesSection />
      <TeamSection />
    </div>
  );
}

export const HeroSection = () => {
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

  // Auto-rotate news cards every 3 seconds
  useEffect(() => {
    const newsInterval = setInterval(() => {
      setCurrentNewsIndex((prevIndex) => 
        (prevIndex + 1) % newsData.length
      );
    }, 3000); // Change every 3 seconds

    return () => clearInterval(newsInterval);
  }, []);

  const currentNews = newsData[currentNewsIndex];

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

      {/* Hero Content */}
      <div className={styles["hero-content"]}>
        <div className="flex flex-col gap-4">
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`text-white font-bold max-w-3xl mx-auto text-center ${styles["text-responsive-heading-1"]}`}
          >
           From Idea to Prototype:
            Seamlessly access to tools and resources.
          </motion.h1>

          {/* CTA Button */}
          <motion.button
            onClick={() => {
              window.dispatchEvent(new WheelEvent("wheel", { deltaY: 100 }));
            }}
            className="mt-6 inline-flex items-center text-white font-medium text-[clamp(0.3rem,3vw,1rem)] group cursor-pointer bg-transparent border-none"
            whileHover={{ x: 5 }}
          >
            Learn more
            <svg
              className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 12 8"
              fill="none"
            >
              <path
                d="M11 1L6 6.5L1 1"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.button>
        </div>

        {/* Animated News Carousel Card */}
        <motion.div
          key={currentNewsIndex} // This ensures re-animation on each change
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="h-fit w-fit"
        >
          <div className={styles["card"]}>
            <div className={styles["card-content"]}>
              <p className="p-m mb-3">
                {currentNews.title}
              </p>
              <div className={styles["content-bottom"]}>
                <p className="p-m">Read more</p>
              </div>
            </div>
            <img
              src={currentNews.image}
              loading="lazy"
              width="97"
              alt=""
              className={styles["card-image"]}
            />
            <div className={styles["card-overlay"]}></div>
            <a
              href={currentNews.link}
              className="abs-link w-inline-block"
            ></a>
          </div>
        </motion.div>

        {/* News Indicators (Optional - shows dots for each news item) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="flex justify-center gap-2 mt-4"
        >
          {newsData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentNewsIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentNewsIndex 
                  ? 'bg-white' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center"
      >
        <span className="text-sm mb-2">Scroll down</span>
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

const NextSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleAnimationComplete = () => {
    console.log("Animation completed!");
  };

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <BlurText
          text="Fueling Innovation, Driving Growth."
          delay={250}
          animateBy="words"
          direction="top"
          onAnimationComplete={handleAnimationComplete}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-slate-300 mb-10 max-w-3xl mx-auto font-light tracking-wide"
        >
          Transforming industries with cutting-edge <span className="text-cyan-400 font-medium">robotics</span>, 
          <span className="text-blue-400 font-medium"> IoT solutions</span>, and visionary technology
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium 
                     shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 
                     border border-cyan-400/30 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Explore Our Work
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-transparent text-white rounded-lg font-medium border border-cyan-500/30 
                     hover:bg-cyan-500/10 transition-all duration-300 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Learn More
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};