// Header.tsx
"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/context/IsMobileContext";
import { useScroll } from "@/context/ScrollContext";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "../ThemeToggle";
import { useTheme } from "next-themes";

const Header = () => {
  const { isMobile } = useIsMobile();
  const { isTop } = useScroll();
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, user, isAuthenticated } = useAuth();
  const { theme } = useTheme();

  // Theme-based styling
  const isDark = theme === "dark";

  // Colors based on theme
  const headerBgColor = isDark
    ? "rgba(15, 23, 42, 0.9)"
    : "rgba(255, 255, 255, 0.9)";
  const headerBgColorScrolled = isDark
    ? "rgba(15, 23, 42, 0.95)"
    : "rgba(255, 255, 255, 0.95)";
  const textColor = isDark ? "text-white" : "text-black";
  const hoverColor = isDark ? "hover:text-cyan-400" : "hover:text-blue-600";
  const borderColor = isDark ? "border-white/20" : "border-slate-200";
  const mobileMenuBg = isDark ? "bg-slate-900" : "bg-white";
  const buttonBg = isDark
    ? "bg-gradient-to-r from-cyan-500 to-blue-600"
    : "bg-gradient-to-r from-blue-500 to-purple-600";
  const buttonText = "text-white";
  const underlineColor = isDark ? "after:bg-cyan-400" : "after:bg-blue-600";

  useEffect(() => {
    const handleScrollDirection = () => {
      const currentScroll = window.scrollY;

      if (!isMenuOpen) {
        if (currentScroll > lastScrollY) {
          setShowNav(false);
        } else {
          setShowNav(true);
        }
      }
      setLastScrollY(currentScroll);
    };

    window.addEventListener("scroll", handleScrollDirection);
    return () => window.removeEventListener("scroll", handleScrollDirection);
  }, [lastScrollY, isMenuOpen]);

  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const handleLinkClick = () => {
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  // Header background based on scroll and theme
  const headerBackgroundColor =
    isTop && !isMenuOpen
      ? isDark
        ? "rgba(15, 23, 42, 0.1)"
        : "rgba(255, 255, 255, 1)"
      : isDark
      ? headerBgColorScrolled
      : headerBgColorScrolled;
  const finalBackgroundColor =
    isMobile && isMenuOpen
      ? isDark
        ? "rgba(15, 23, 42, 0.98)"
        : "rgba(255, 255, 255, 0.98)"
      : headerBackgroundColor;

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{
        y: showNav || isMenuOpen ? 0 : -100,
        height:
          isMobile && isMenuOpen ? "100vh" : isTop && !isMobile ? 100 : 70,
        backgroundColor: finalBackgroundColor,
        backdropFilter: isTop && !isMenuOpen ? "none" : "blur(10px)",
        borderBottom:
          isTop && !isMenuOpen
            ? "none"
            : `1px solid ${
                isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)"
              }`,
      }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 w-full z-50 flex items-center px-6 ${
        isMobile && isMenuOpen ? "flex-col justify-start items-center" : ""
      } ${isDark ? `text-white` : ` ${textColor}`}`}
    >
      {/* Logo and Mobile Menu Button Container */}
      <div
        className={`flex w-full items-center ${
          isMobile && isMenuOpen ? "pt-6 pb-4" : ""
        }`}
      >
        {/* Logo */}
        <div className="font-bold text-2xl flex-1 z-50">
          <a href="/" className="flex items-center space-x-2">
            <div
              className={`w-8 h-8 rounded-lg ${
                isDark
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600"
                  : "bg-gradient-to-r from-blue-500 to-purple-600"
              } flex items-center justify-center`}
            >
              <span className="text-white font-bold text-sm">I²</span>
            </div>
            <span className={isTop && !isMobile ? "text-3xl" : "text-xl"}>
              I2EDC
            </span>
          </a>
        </div>

        {/* Mobile Menu Icon */}
        {isMobile && (
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`text-2xl relative z-50 p-2 ${textColor}`}
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        )}
      </div>

      {/* Navigation Links (Desktop) */}
      {!isMobile && (
        <nav className="flex items-center space-x-8">
          <a
            href="/"
            className={`relative font-medium text-sm transition-colors duration-300 ${hoverColor} after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] ${underlineColor} after:transition-all after:duration-300 hover:after:w-full`}
          >
            Home
          </a>
          <a
            href="/pages/about"
            className={`relative font-medium text-sm transition-colors duration-300 ${hoverColor} after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] ${underlineColor} after:transition-all after:duration-300 hover:after:w-full`}
          >
            About
          </a>
          <a
            href="/pages/services"
            className={`relative font-medium text-sm transition-colors duration-300 ${hoverColor} after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] ${underlineColor} after:transition-all after:duration-300 hover:after:w-full`}
          >
            Services
          </a>
          <a
            href="/pages/events"
            className={`relative font-medium text-sm transition-colors duration-300 ${hoverColor} after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] ${underlineColor} after:transition-all after:duration-300 hover:after:w-full`}
          >
            Events
          </a>
          <a
            href="/pages/prototypes"
            className={`relative font-medium text-sm transition-colors duration-300 ${hoverColor} after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] ${underlineColor} after:transition-all after:duration-300 hover:after:w-full`}
          >
            Prototypes
          </a>
          <a
            href="/pages/contact"
            className={`relative font-medium text-sm transition-colors duration-300 ${hoverColor} after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] ${underlineColor} after:transition-all after:duration-300 hover:after:w-full`}
          >
            Contact
          </a>

          {(user?.is_superuser || user?.is_staff) && (
            <a
              href="/pages/admin"
              className={`relative font-medium text-sm transition-colors duration-300 ${hoverColor} after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] ${underlineColor} after:transition-all after:duration-300 hover:after:w-full`}
            >
              Admin
            </a>
          )}

          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {isAuthenticated ? (
              <button
                onClick={logout}
                className={`px-4 py-2 rounded-lg border ${
                  isDark
                    ? "border-cyan-400 text-cyan-400 hover:bg-cyan-400"
                    : "border-blue-600 text-blue-600 hover:bg-blue-600"
                } font-medium text-sm transition-colors duration-300 hover:text-white`}
              >
                Logout
              </button>
            ) : (
              <a
                href="/auth?action=login"
                className={`px-6 py-2 rounded-lg ${buttonBg} ${buttonText} font-medium text-sm transition-all duration-300 hover:shadow-lg hover:scale-105`}
              >
                Login
              </a>
            )}
          </div>
        </nav>
      )}

      {/* Mobile Navigation Links */}
      <AnimatePresence>
        {isMobile && isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`flex flex-col items-center justify-center space-y-8 text-xl w-full flex-grow p-6 ${mobileMenuBg}`}
          >
            <a
              href="/"
              onClick={handleLinkClick}
              className={`relative font-medium transition-colors duration-300 ${hoverColor} after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] ${underlineColor} after:transition-all after:duration-300 hover:after:w-1/2 px-6 py-3`}
            >
              Home
            </a>
            <a
              href="/pages/about"
              onClick={handleLinkClick}
              className={`relative font-medium transition-colors duration-300 ${hoverColor} after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] ${underlineColor} after:transition-all after:duration-300 hover:after:w-1/2 px-6 py-3`}
            >
              About
            </a>
            <a
              href="/pages/services"
              onClick={handleLinkClick}
              className={`relative font-medium transition-colors duration-300 ${hoverColor} after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] ${underlineColor} after:transition-all after:duration-300 hover:after:w-1/2 px-6 py-3`}
            >
              Services
            </a>
            <a
              href="/pages/events"
              onClick={handleLinkClick}
              className={`relative font-medium transition-colors duration-300 ${hoverColor} after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] ${underlineColor} after:transition-all after:duration-300 hover:after:w-1/2 px-6 py-3`}
            >
              Events
            </a>
            <a
              href="/pages/prototypes"
              onClick={handleLinkClick}
              className={`relative font-medium transition-colors duration-300 ${hoverColor} after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] ${underlineColor} after:transition-all after:duration-300 hover:after:w-1/2 px-6 py-3`}
            >
              Prototypes
            </a>
            <a
              href="/pages/contact"
              onClick={handleLinkClick}
              className={`relative font-medium transition-colors duration-300 ${hoverColor} after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] ${underlineColor} after:transition-all after:duration-300 hover:after:w-1/2 px-6 py-3`}
            >
              Contact
            </a>

            {(user?.is_superuser || user?.is_staff) && (
              <a
                href="/pages/admin"
                onClick={handleLinkClick}
                className={`relative font-medium transition-colors duration-300 ${hoverColor} after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] ${underlineColor} after:transition-all after:duration-300 hover:after:w-1/2 px-6 py-3`}
              >
                Admin
              </a>
            )}

            <div className="flex flex-col items-center space-y-4 pt-4">
              <ThemeToggle />

              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLinkClick();
                    logout();
                  }}
                  className={`w-48 text-center px-6 py-3 rounded-lg border ${
                    isDark
                      ? "border-cyan-400 text-cyan-400 hover:bg-cyan-400"
                      : "border-blue-600 text-blue-600 hover:bg-blue-600"
                  } font-medium transition-colors duration-300 hover:text-white`}
                >
                  Logout
                </button>
              ) : (
                <a
                  href="/auth?action=login"
                  onClick={handleLinkClick}
                  className={`w-48 text-center px-6 py-3 rounded-lg ${buttonBg} ${buttonText} font-medium transition-all duration-300 hover:shadow-lg`}
                >
                  Login
                </a>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;
