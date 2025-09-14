// TeamSection.tsx
"use client";
import { motion } from "framer-motion";

const TeamSection = () => {
  const team = [
    {
      image:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      name: "Ashutosh Vishwakarma",
      role: "Founder & Lead Engineer",
    },
    {
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      name: "Ashutosh Vishwakarma",
      role: "AI & Robotics Specialist",
    },
    {
      image:
        "https://images.unsplash.com/photo-1603415526960-f8f0a7090f88?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      name: "Ashutosh Vishwakarma",
      role: "Full Stack Developer",
    },
    {
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      name: "Ashutosh Vishwakarma",
      role: "Design & UI/UX",
    },
  ];

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-2 text-center px-4 max-w-6xl mx-auto py-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-16 font-serif"
        >
          Meet Our Team
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 flex flex-col items-center group"
            >
              <div className="w-32 h-32 mb-4 overflow-hidden rounded-full border-2 border-white/30">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                {member.name}
              </h3>
              <p className="text-slate-300 text-sm">{member.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
