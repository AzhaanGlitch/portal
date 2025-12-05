"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import BackgroundVideo from "../animations/BackgroundVideo/BackgroundVideo"; 
import ServicesSection from "./ServicesSection";
import PrototypesSection from "./PrototypesSection";
import TeamSection from "./TeamSection";
import HistorySection from "./HistorySection";
import EventsSection from "./EventSection";
import { useContent } from "@/context/ContentContext";

const scrollToSection = (id: string) => {
  const targetId = id === "scroll_to_explore" ? "explore" : id;
  const el = document.getElementById(targetId);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  }
};

export default function HomePage() {
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
  const { content, loading, error } = useContent();

  if (loading && !content.hero) {
    return (
      <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading...</p>
        </div>
      </section>
    );
  }

  if (error && !content.hero) {
    return (
      <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg text-destructive mb-4">Error loading content</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-lg font-semibold border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  const heroData = content.hero || {
    headline: {
      parts: [
        { text: "Innovate.", style: "gradient-blue-purple" },
        { text: "Create.", style: "gradient-green-cyan" },
        { text: "Transform.", style: "gradient-orange-pink" }
      ]
    },
    description: "The Institute Innovation Entrepreneurship Development Cell (I2EDC) is a hub for student innovators and entrepreneurs. We provide resources, mentorship, and a vibrant community to help you bring your ideas to life.",
    buttons: [
      { text: "Explore I2EDC", action: "scroll_to_explore" },
      { text: "Join Community", action: "navigate_to_auth" }
    ]
  };

  const getGradientClass = (style: string) => {
    const gradients: { [key: string]: string } = {
      "gradient-blue-purple": "from-blue-600 to-purple-700 dark:from-blue-400 dark:to-purple-600",
      "gradient-green-cyan": "from-green-600 to-cyan-700 dark:from-green-400 dark:to-cyan-600",
      "gradient-orange-pink": "from-orange-600 to-pink-700 dark:from-orange-400 dark:to-pink-600"
    };
    
    return gradients[style] || gradients["gradient-blue-purple"];
  };

  return (
    <section className="relative w-full h-screen overflow-hidden ">
      <BackgroundVideo opacity={0.6} />
      
      <div className="absolute top-0 left-0 w-full h-[18vh] bg-background z-10"></div>

      {/* Hero Content */}
      <div className="relative z-20 h-full flex flex-col items-center px-6 pt-30">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <div className="inline-block p-4 md:p-6 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-2xl shadow-black/60 mb-8">
          <h1 
            className="text-4xl md:text-6xl lg:text-7xl font-bold m-0">
            {heroData.headline.parts.map((part: any, index: any) => (
              <span key={index}>
                <span
                  className={`bg-gradient-to-r ${getGradientClass(part.style)} bg-clip-text text-transparent`}
                >
                  {part.text}
                </span>
                {index < heroData.headline.parts.length - 1 && " "}
              </span>
            ))}
          </h1>
        </div>
      </motion.div>

        {/* Description - Over video with white text */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-lg md:text-xl lg:text-2xl mb-10 max-w-4xl mx-auto leading-relaxed text-center text-white font-medium drop-shadow-lg"
          style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}
        >
          {heroData.description}
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          {heroData.buttons.map((button: any, index: any) => {
            if (button.action === "scroll_to_explore") {
              return (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 rounded-lg font-semibold transition-all duration-300 bg-gradient-to-r from-blue-600 to-purple-700 text-white border border-blue-500/30 shadow-xl shadow-blue-500/50 hover:shadow-blue-600/60"
                  onClick={() => scrollToSection("scroll_to_explore")}
                >
                  {button.text}
                </motion.button>
              );
            } else if (button.action === "navigate_to_auth") {
              return (
                <Link key={index} href="/auth" scroll={false}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-lg font-semibold border-2 transition-all duration-300 bg-white/90 hover:bg-white text-gray-900 border-white/50 shadow-xl"
                  >
                    {button.text}
                  </motion.button>
                </Link>
              );
            }
            return null;
          })}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 rounded-full flex justify-center border-white/70"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 rounded-full mt-2 bg-white/70"
          />
        </motion.div>
      </motion.div>
    </section>
  );
};

const AboutSection = () => {
  const { content, loading, error } = useContent();

  if (loading && !content.about) {
    return (
      <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-lg text-muted-foreground">Loading about content...</p>
        </div>
      </section>
    );
  }

  if (error && !content.about) {
    return (
      <section className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900">
        <div className="text-center">
          <p className="text-lg text-destructive mb-4">Error loading about content</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-lg font-semibold border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  const aboutData = content.about || {};
  const title = aboutData.title || "Explore I2EDC";
  const subtitle = aboutData.subtitle || "Our Clubs";
  
  const clubs = Array.isArray(aboutData.clubs) ? aboutData.clubs : [
    {
      title: "Protospace & Tinkering Lab",
      description: "A collaborative workspace equipped with tools and resources for prototyping and development.",
      gradient: "from-blue-500 to-cyan-500",
      imageUrl: [],
      keyEvents: [],
      highlights: []
    },
    {
      title: "E-Cell",
      description: "Entrepreneurship Cell fostering innovation and business ideas among students.",
      gradient: "from-purple-500 to-pink-500",
      imageUrl: [],
      keyEvents: [],
      highlights: []
    },
    {
      title: "BEC",
      description: "Budding Entrepreneur Club nurturing young entrepreneurs and startup culture.",
      gradient: "from-orange-500 to-red-500",
      imageUrl: [],
      keyEvents: [],
      highlights: []
    }
  ];

  const activities = Array.isArray(aboutData.activities) ? aboutData.activities : [
    {
      title: "InventX 2025",
      description: "Annual innovation challenge showcasing cutting-edge projects and ideas.",
      images: [],
      videos: []
    },
    {
      title: "Invention Factory 2024",
      description: "Hands-on workshop series for product development and prototyping.",
      images: [],
      videos: []
    },
    {
      title: "Make-a-Thon",
      description: "Intensive making competition bringing ideas to life in limited time.",
      images: [],
      videos: []
    }
  ];

  const clubIcons = [
    `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>`,
    `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>`,
    `<svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>`
  ];

  const renderSVG = (svgString: string) => {
    return <div dangerouslySetInnerHTML={{ __html: svgString }} />;
  };

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900 dark:to-slate-900"
      id="explore"
    >
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto py-20">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-foreground mb-4"
        >
          {title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto"
        >
          {subtitle}
        </motion.p>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {clubs.map((club: any, index: number) => (
            <motion.div
              key={club.title || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="rounded-2xl p-8 border transition-all duration-300 hover:shadow-lg bg-card/80 backdrop-blur-sm border-border hover:border-border/80"
            >
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-r ${club.gradient || 'from-blue-500 to-cyan-500'} mb-6 flex items-center justify-center`}
              >
                {renderSVG(clubIcons[index] || clubIcons[0])}
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">
                {club.title || "Club"}
              </h3>
              <p className="leading-relaxed text-muted-foreground mb-4">
                {club.description || ""}
              </p>
              
              {club.highlights && Array.isArray(club.highlights) && club.highlights.length > 0 && club.highlights[0] && (
                <div className="text-sm text-muted-foreground text-left">
                  <strong>Highlights:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {club.highlights.map((highlight: string, i: number) => (
                      highlight && <li key={i}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h3 className="text-3xl font-bold text-foreground mb-8">Our Activities</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {activities.map((activity: any, index: number) => (
              <motion.div
                key={activity.title || index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl p-6 border bg-card/60 backdrop-blur-sm border-border hover:shadow-md transition-all duration-300"
              >
                <h4 className="text-lg font-semibold text-foreground mb-3">
                  {activity.title || "Activity"}
                </h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {activity.description || ""}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};