"use client";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-black text-gray-300 py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center md:text-left"
        >
          <h2 className="text-xl font-bold text-white">I2EDC</h2>
          <p className="text-sm text-gray-400">
            Fueling Innovation, Driving Growth.
          </p>
        </motion.div>

        {/* Middle - Navigation */}
        <motion.nav
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex gap-6 text-sm"
        >
          <a href="#mission" className="hover:text-white transition">
            Mission
          </a>
          <a href="#about" className="hover:text-white transition">
            About
          </a>
          <a href="#contact" className="hover:text-white transition">
            Contact
          </a>
        </motion.nav>

        {/* Right side - Social links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex gap-4"
        >
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="mailto:example@email.com"
            className="hover:text-white transition"
          >
            <Mail className="w-5 h-5" />
          </a>
        </motion.div>
      </div>

      {/* Bottom copyright */}
      <div className="mt-8 border-t border-gray-700 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} I2EDC. All rights reserved.
      </div>
    </footer>
  );
}
