// contact.jsx
"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import LiquidEther from "../animations/LiquidEther/LiquidEther";

export default function ContactPage() {
  return (
    <div className="relative">
      <ContactHeroSection />
      <ContactFormSection />
      <ContactInfoSection />
    </div>
  );
}

const ContactHeroSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section className="relative w-full h-screen overflow-hidden">
      <div className="absolute inset-0">
        <LiquidEther />
      </div>

      <div className={`relative z-10 h-full flex flex-col justify-center items-center text-center px-6 ${
        isDark ? "text-white" : "text-gray-900"
      }`}>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="font-bold text-5xl md:text-6xl lg:text-7xl mb-6"
        >
          <span className={`bg-gradient-to-r ${
            isDark ? "from-blue-400 to-purple-600" : "from-blue-600 to-purple-700"
          } bg-clip-text text-transparent`}>
            Contact
          </span>{" "}
          <span className={`bg-gradient-to-r ${
            isDark ? "from-green-400 to-cyan-600" : "from-green-600 to-cyan-700"
          } bg-clip-text text-transparent`}>
            Us
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
          We’d love to hear from you! Reach out for inquiries, feedback, or just to say hello. Our team is here to help.
        </motion.p>
      </div>
    </section>
  );
};

const ContactFormSection = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const sectionBg = isDark
    ? "bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900"
    : "bg-gradient-to-br from-gray-50 via-blue-50/50 to-gray-50";

  const cardBg = isDark
    ? "bg-white/5 backdrop-blur-sm border-white/10 hover:border-blue-400/30"
    : "bg-white/80 backdrop-blur-sm border-gray-200 hover:border-blue-400/30";

  const titleColor = isDark ? "text-white" : "text-gray-900";
  const textColor = isDark ? "text-gray-300" : "text-gray-700";

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted", form);
    setSubmitted(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section className={`relative w-full min-h-screen flex items-center justify-center ${sectionBg} py-20`} id="form">
      <div className="relative z-10 px-4 max-w-3xl w-full">
        <motion.h2
          className={`text-4xl md:text-5xl font-bold text-center mb-12 ${titleColor}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Send Us a <span className={`bg-gradient-to-r ${isDark ? "from-blue-400 to-cyan-400" : "from-blue-600 to-cyan-600"} bg-clip-text text-transparent`}>Message</span>
        </motion.h2>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, margin: "-100px" }}
          className={`p-8 rounded-2xl ${cardBg} flex flex-col gap-4`}
        >
          <Input
            placeholder="Your Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="px-4 py-3"
          />
          <Input
            placeholder="Email Address"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="px-4 py-3"
          />
          <Textarea
            placeholder="Your Message"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
            className="px-4 py-3 h-40 resize-none"
          />
          <Button
            type="submit"
            className="mt-4 w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold hover:from-blue-700 hover:to-cyan-600"
          >
            Send Message
          </Button>

          {submitted && (
            <p className={`mt-2 text-center font-medium ${isDark ? "text-green-400" : "text-green-700"}`}>
              Your message has been sent! ✅
            </p>
          )}
        </motion.form>
      </div>
    </section>
  );
};

const ContactInfoSection = () => {
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

  const info = [
    {
      type: "Email",
      value: "contact@i2edc.in",
      icon: "📧",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      type: "Phone",
      value: "+91 98765 43210",
      icon: "📞",
      gradient: "from-green-500 to-teal-500",
    },
    {
      type: "Address",
      value: "Institute Campus, Innovation Block, City, State",
      icon: "🏢",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <section className={`relative w-full min-h-screen flex items-center justify-center py-20 ${sectionBg}`}>
      <div className="relative z-10 px-4 max-w-5xl mx-auto">
        <motion.h2
          className={`text-4xl md:text-5xl font-bold text-center mb-16 ${titleColor}`}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          Our <span className={`bg-gradient-to-r ${isDark ? "from-purple-400 to-pink-400" : "from-purple-600 to-pink-600"} bg-clip-text text-transparent`}>Contact Info</span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {info.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
              className={`rounded-2xl p-8 border transition-all duration-300 hover:shadow-lg ${cardBg} text-center`}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${item.gradient} mb-4 flex items-center justify-center text-white text-xl`}>
                {item.icon}
              </div>
              <h3 className={`text-xl font-bold mb-2 ${accentColor}`}>{item.type}</h3>
              <p className={textColor}>{item.value}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
