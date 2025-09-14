"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollStack, {ScrollStackItem} from '../animations/ScrollStack/ScrollStack';
const PrototypesSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const prototypes = [
    {
      image: "https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: "Automated Testing System",
      description: "Revolutionary system for automated quality assurance with precision robotics and AI-powered inspection algorithms.",
      tags: ["Robotics", "AI", "Quality Control"],
      color: "from-blue-500 to-cyan-400"
    },
    {
      image: "https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: "Energy Monitoring Device",
      description: "Real-time energy consumption tracking solution with IoT connectivity and predictive analytics capabilities.",
      tags: ["IoT", "Energy", "Analytics"],
      color: "from-purple-500 to-pink-500"
    },
    {
      image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      title: "Smart Manufacturing Hub",
      description: "Integrated control system for Industry 4.0 applications with real-time monitoring and adaptive automation.",
      tags: ["Industry 4.0", "Automation", "Control Systems"],
      color: "from-amber-500 to-orange-500"
    }
  ];

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden py-16">
      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-6xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent"
        >
          Innovative Prototypes
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-slate-300 mb-16 max-w-3xl mx-auto font-light tracking-wide"
        >
          Cutting-edge prototypes that demonstrate our technical capabilities and innovative approach
        </motion.p>

        
        {/* Prototypes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {prototypes.map((prototype, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
              transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gray-800/30 backdrop-blur-sm rounded-xl overflow-hidden border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300 group"
            >
              <div className="h-48 overflow-hidden relative">
                <img
                  src={prototype.image}
                  alt={prototype.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <div className="flex flex-wrap gap-2">
                    {prototype.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-1 bg-cyan-500/20 text-cyan-300 rounded text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                  {prototype.title}
                </h3>
                <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                  {prototype.description}
                </p>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500/20 to-blue-600/20 text-cyan-300 rounded-lg text-sm border border-cyan-500/30 hover:border-cyan-500/60 hover:bg-cyan-500/30 transition-all duration-300 flex items-center gap-2 mx-auto"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  View Case Study
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="bg-gradient-to-r from-gray-800/40 to-gray-900/40 backdrop-blur-sm rounded-2xl p-8 border border-cyan-500/20 max-w-2xl mx-auto"
        >
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Have an Idea for a Prototype?</h3>
          <p className="text-slate-300 mb-6">Let&lsquo;s collaborate to bring your innovative concepts to life with our technical expertise</p>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-medium 
                     shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all duration-300 
                     border border-cyan-400/30 flex items-center gap-2 mx-auto"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Start Your Project
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default PrototypesSection;