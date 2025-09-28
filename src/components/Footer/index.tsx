"use client";
import { motion } from "framer-motion";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <section>
      <footer className="relative bg-white/60 dark:bg-black/40 backdrop-blur-md border-t border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 py-12 px-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          {/* Left side - Branding */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white font-serif tracking-wide">
              I2EDC
            </h2>
            <p className="text-sm text-gray-600 dark:text-slate-400">
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
            <a
              href="/pages/services"
              className="hover:text-gray-900 dark:hover:text-white hover:scale-105 transition transform"
            >
              Services
            </a>
            <a
              href="/pages/about"
              className="hover:text-gray-900 dark:hover:text-white hover:scale-105 transition transform"
            >
              About
            </a>
            <a
              href="/pages/contact"
              className="hover:text-gray-900 dark:hover:text-white hover:scale-105 transition transform"
            >
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
              className="p-2 rounded-full bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/20 hover:bg-gray-300 dark:hover:bg-white/20 hover:text-gray-900 dark:hover:text-white transition"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="https://linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/20 hover:bg-gray-300 dark:hover:bg-white/20 hover:text-gray-900 dark:hover:text-white transition"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="mailto:example@email.com"
              className="p-2 rounded-full bg-gray-200 dark:bg-white/10 border border-gray-300 dark:border-white/20 hover:bg-gray-300 dark:hover:bg-white/20 hover:text-gray-900 dark:hover:text-white transition"
            >
              <Mail className="w-5 h-5" />
            </a>
          </motion.div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 border-t border-gray-200 dark:border-white/10 pt-6 text-center text-xs text-gray-500 dark:text-slate-500">
          © {new Date().getFullYear()} I2EDC. All rights reserved.
        </div>
      </footer>
    </section>
  );
}
