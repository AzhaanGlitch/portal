// Hero.tsx
"use client";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import styles from "./hero.module.css";
import GradientBlinds from "../animations/GradientBlinds/GradientBlinds";
import BlurText from "../animations/BlurText/BlurText";
import LiquidEther from "../animations/LiquidEther/LiquidEther";

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
      <Hero />
      <NextSection />
      <SectionIndicator currentSection={currentSection} totalSections={2} />
    </div>
  );
}

export const Hero = () => {
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
            className={`text-white font-bold max-w-3xl mx-auto text-center lg:text-left ${styles["text-responsive-heading-1"]}`}
          >
            Maneuverability when you need it. On demand.
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

        {/* News Highlight Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="h-fit w-fit"
        >
          <div className={styles["card"]}>
            <div className={styles["card-content"]}>
              <p className="p-m mb-3">
                Portal Space Systems Expands Manufacturing Footprint with New
                50,000 Sq. Ft. Facility in Bothell, WA{" "}
              </p>
              <div className={styles["content-bottom"]}>
                <p className="p-m">Read more</p>
              </div>
            </div>
            <img
              src="https://cdn.prod.website-files.com/67f8bd9d630dd52ec429fb93/685545c256fb25811dad7522_Portal%20Space%20Systems%20Expands.avif"
              loading="lazy"
              width="97"
              alt=""
              className={styles["card-image"]}
            />
            <div className={styles["card-overlay"]}></div>
            <a
              href="/news/portal-space-systems-expands-manufacturing-footprint-with-new-50-000-sq-ft-facility-in-bothell-wa"
              className="abs-link w-inline-block"
            ></a>
          </div>
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
    <>
      {/* Hero Section with LiquidEther */}
      <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
        {/* LiquidEther as background */}
        <div className="absolute inset-0 z-0">
          <LiquidEther
            colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>

        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/30 z-1"></div>

        {/* Content */}
        <div className="relative z-2 text-center px-4 max-w-4xl mx-auto">
          <BlurText
            text="Fueling Innovation, Driving Growth."
            delay={250}
            animateBy="words"
            direction="top"
            onAnimationComplete={handleAnimationComplete}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 font-serif"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-200 mb-10 max-w-3xl mx-auto font-light"
          >
            Transforming industries with cutting-edge technology and visionary
            solutions
          </motion.p>

          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: isVisible ? 1 : 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="px-8 py-3 bg-white/10 backdrop-blur-md text-white rounded-lg border border-white/20 hover:bg-white/20 transition-colors duration-300 font-medium"
          >
            Explore Our Work
          </motion.button>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white flex flex-col items-center z-2"
        >
          <span className="text-sm mb-2">Scroll down</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
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

      {/* Services Section with same LiquidEther background */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Same LiquidEther background */}
        <div className="absolute inset-0 z-0">
          <LiquidEther
            colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 z-1"></div>

        {/* Services Content */}
        <div className="relative z-2 text-center px-4 max-w-6xl mx-auto py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-16 font-serif"
          >
            Services We Provide
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:bg-white/15 transition-colors duration-300"
              >
                <div className="text-4xl mb-4 text-white">{service.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-200 mb-4">{service.description}</p>
                <button className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm hover:bg-white/30 transition-colors duration-300">
                  Read More
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Prototypes Section with same LiquidEther background */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Same LiquidEther background */}
        <div className="absolute inset-0 z-0">
          <LiquidEther
            colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 z-1"></div>

        {/* Prototypes Content */}
        <div className="relative z-2 text-center px-4 max-w-6xl mx-auto py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-16 font-serif"
          >
            Prototypes We've Built
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {prototypes.map((prototype, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 overflow-hidden group"
              >
                <div className="h-48 mb-4 overflow-hidden rounded-lg">
                  <img
                    src={prototype.image}
                    alt={prototype.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">
                  {prototype.title}
                </h3>
                <p className="text-slate-200 mb-4">{prototype.description}</p>
                <button className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm hover:bg-white/30 transition-colors duration-300">
                  Read More
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section with same LiquidEther background */}
      <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
        {/* Same LiquidEther background */}
        <div className="absolute inset-0 z-0">
          <LiquidEther
            colors={["#5227FF", "#FF9FFC", "#B19EEF"]}
            mouseForce={20}
            cursorSize={100}
            isViscous={false}
            viscous={30}
            iterationsViscous={32}
            iterationsPoisson={32}
            resolution={0.5}
            isBounce={false}
            autoDemo={true}
            autoSpeed={0.5}
            autoIntensity={2.2}
            takeoverDuration={0.25}
            autoResumeDelay={3000}
            autoRampDuration={0.6}
          />
        </div>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40 z-1"></div>

        {/* Team Content */}
        <div className="relative z-2 text-center px-4 max-w-6xl mx-auto py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-16 font-serif"
          >
            People Working With I2EDC
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 text-center group"
              >
                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-2 border-white/30">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-lg font-bold text-white mb-1">
                  {member.name}
                </h3>
                <p className="text-slate-300 text-sm mb-3">{member.role}</p>
                <p className="text-slate-200 text-xs mb-4">{member.bio}</p>
                <button className="px-4 py-2 bg-white/20 text-white rounded-lg text-sm hover:bg-white/30 transition-colors duration-300">
                  Read More
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

// Sample data for services, prototypes, and team
const services = [
  {
    icon: "🚀",
    title: "Technology Innovation",
    description: "Cutting-edge solutions for modern challenges",
  },
  {
    icon: "🔬",
    title: "Research & Development",
    description: "Transforming ideas into tangible products",
  },
  {
    icon: "💡",
    title: "Consulting Services",
    description: "Expert guidance for your technology needs",
  },
  {
    icon: "🛠️",
    title: "Prototype Development",
    description: "From concept to functional prototype",
  },
  {
    icon: "📊",
    title: "Data Analytics",
    description: "Turning data into actionable insights",
  },
  {
    icon: "🤖",
    title: "AI Solutions",
    description: "Intelligent systems for complex problems",
  },
];

const prototypes = [
  {
    image:
      "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    title: "Automated Testing System",
    description: "Revolutionary system for automated quality assurance",
  },
  {
    image:
      "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    title: "Energy Monitoring Device",
    description: "Real-time energy consumption tracking solution",
  },
];

const team = [
  {
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    name: "John Smith",
    role: "Lead Engineer",
    bio: "10+ years of experience in tech innovation",
  },
  {
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    name: "Sarah Johnson",
    role: "Research Director",
    bio: "PhD in Computer Science with multiple publications",
  },
  {
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    name: "Michael Chen",
    role: "Product Designer",
    bio: "Specialized in human-centered design approaches",
  },
  {
    image:
      "https://images.unsplash.com/photo-1614289371518-722f2615943d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
    name: "Emily Rodriguez",
    role: "Data Scientist",
    bio: "Expert in machine learning and predictive analytics",
  },
];

const SectionIndicator = ({
  currentSection,
  totalSections,
}: {
  currentSection: number;
  totalSections: number;
}) => {
  return (
    <div className="hidden md:flex fixed right-6 top-1/2 transform -translate-y-1/2 z-50 flex-col gap-3">
      {Array.from({ length: totalSections }).map((_, index) => (
        <button
          key={index}
          onClick={() => {
            setTimeout(() => {
              window.scrollTo({
                top: document.querySelectorAll("section")[index].offsetTop,
                behavior: "smooth",
              });
            }, 50);
          }}
          className={`w-3 h-3 rounded-full transition-all ${
            index === currentSection ? "bg-white scale-125" : "bg-white/30"
          }`}
          aria-label={`Go to section ${index + 1}`}
        />
      ))}
    </div>
  );
};
