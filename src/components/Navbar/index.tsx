// Header.tsx
'use client';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/context/IsMobileContext";
import { useScroll } from "@/context/ScrollContext";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "../ThemeToggle";

const Header = () => {
  const { isMobile } = useIsMobile();
  const { isTop } = useScroll();
  const [showNav, setShowNav] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { logout, user, isAuthenticated } = useAuth();
  // Use a local effect to track scroll direction for hiding/showing the header,
  // but only when the mobile menu is NOT open.
  useEffect(() => {
    const handleScrollDirection = () => {
      const currentScroll = window.scrollY; // Use window.scrollY here for direction tracking

      // Only hide/show header based on scroll direction if the mobile menu is NOT open.
      // When the menu is open, the header should stay visible to show the close button.
      if (!isMenuOpen) {
        if (currentScroll > lastScrollY) {
          // scrolling down → hide
          setShowNav(false);
        } else {
          // scrolling up → show
          setShowNav(true);
        }
      }
      setLastScrollY(currentScroll);
    };

    window.addEventListener("scroll", handleScrollDirection);
    return () => window.removeEventListener("scroll", handleScrollDirection);
  }, [lastScrollY, isMenuOpen]); // Added isMenuOpen as dependency

  // Close mobile menu when switching to desktop
  useEffect(() => {
    if (!isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = ''; // Clean up on unmount
    };
  }, [isMenuOpen]);

  const handleLinkClick = () => {
    if (isMobile) {
      setIsMenuOpen(false); // Close menu on link click in mobile
    }
  };

  // --- Header Dynamic Styles ---
  // Mobile: Normal Logo, transparent at top, black when scrolled
  // Desktop: Big Logo at top, smaller black when scrolled
  const headerHeight = isTop && !isMobile ? 100 : 50; // Desktop: Big/Small. Mobile: Always small (60)
  const logoText = isTop && !isMobile ? "Big Logo" : "Logo"; // Desktop: Big/Small. Mobile: Always "Logo"

  const headerBackgroundColor = (isTop && !isMenuOpen) ? "rgba(0,0,0,0)" : "var(--background)";
  // When mobile menu is open, override the header background to be darker/solid
  const finalBackgroundColor = isMobile && isMenuOpen ? "var(--background)" : headerBackgroundColor;

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{
        y: showNav || isMenuOpen ? 0 : -100, // Always show if menu is open
        height: isMobile && isMenuOpen ? '100vh' : headerHeight, // Full screen on mobile when menu open, otherwise dynamic (desktop) or fixed small (mobile)
        backgroundColor: finalBackgroundColor,
        opacity: isTop ? 1 : 0.8
      }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 w-full z-50 flex items-center px-6 ${isMobile && isMenuOpen ? 'flex-col justify-start items-center' : ''}`}
    >
      {/* Logo and Mobile Menu Button Container (to keep them on one line) */}
      <div className={`flex w-full items-center ${isMobile && isMenuOpen ? 'pt-6 pb-4' : ''}`}>
        {/* Logo */}
        <div className="text-forground font-bold text-2xl flex-1 z-50">
          {isMobile && isMenuOpen ? "Logo" : logoText} {/* Mobile menu open: just "Logo" */}
        </div>

        {/* Mobile Menu Icon */}
        {isMobile && (
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-forground text-3xl relative z-50 p-2"
          >
            {isMenuOpen ? "✕" : "☰"}
          </button>
        )}
      </div>

      {/* Navigation Links (Desktop) */}
      {!isMobile && (
        <nav className="flex items-center space-x-6 text-foreground">
          <ThemeToggle />
          <a
            href="/"
            className="relative font-medium text-sm text-foreground transition-colors duration-300 hover:text-primary after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            Home
          </a>
          <a
            href="/pages/about"
            className="relative font-medium text-sm text-foreground transition-colors duration-300 hover:text-primary after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            About
          </a>
          <a
            href="/pages/services"
            className="relative font-medium text-sm text-foreground transition-colors duration-300 hover:text-primary after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            Services
          </a>
          <a
            href="/pages/events"
            className="relative font-medium text-sm text-foreground transition-colors duration-300 hover:text-primary after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            Events
          </a>
          <a
            href="/pages/contact"
            className="relative font-medium text-sm text-foreground transition-colors duration-300 hover:text-primary after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            Contact
          </a>

          {(user?.is_superuser || user?.is_staff) && (
            <a
              href="/pages/admin"
              className="relative font-medium text-sm text-foreground transition-colors duration-300 hover:text-primary after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
            >
              Admin
            </a>
          )}

          {isAuthenticated ? (
            <button
              onClick={logout}
              className="px-4 py-1.5 rounded-md border border-primary text-primary font-medium text-sm transition-colors duration-300 hover:bg-primary hover:text-white"
            >
              Logout
            </button>
          ) : (
            <a
              href="/auth?action=login"
              key="rand29384"
              className="px-4 py-1.5 rounded-md bg-primary text-background font-medium text-sm transition-colors duration-300 hover:bg-primary/90"
            >
              Login
            </a>
          )}
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
            className="flex flex-col items-center justify-center space-y-6 text-foreground text-2xl w-full flex-grow p-6"
          >
            {/* Regular links */}
            <a
              href="/"
              onClick={handleLinkClick}
              className="relative font-medium transition-colors duration-300 hover:text-primary after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-1/2 px-6 py-2"
            >
              Home
            </a>
            <a
              href="/pages/about"
              onClick={handleLinkClick}
              className="relative font-medium transition-colors duration-300 hover:text-primary after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-1/2 px-6 py-2"
            >
              About
            </a>
            <a
              href="/pages/services"
              onClick={handleLinkClick}
              className="relative font-medium transition-colors duration-300 hover:text-primary after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-1/2 px-6 py-2"
            >
              Services
            </a>
            <a
              href="/pages/contact"
              onClick={handleLinkClick}
              className="relative font-medium transition-colors duration-300 hover:text-primary after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-1/2 px-6 py-2"
            >
              Contact
            </a>

            {(user?.is_superuser || user?.is_staff) && (
              <a
                href="/pages/admin"
                onClick={handleLinkClick}
                className="relative font-medium transition-colors duration-300 hover:text-primary after:absolute after:-bottom-1 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:after:w-1/2 px-6 py-2"
              >
                Admin
              </a>
            )}

            {/* Auth buttons */}
            {isAuthenticated ? (
              <button
                onClick={() => {
                  handleLinkClick();
                  logout();
                }}
                className="w-40 text-center px-6 py-2 rounded-md border border-primary text-primary font-medium transition-colors duration-300 hover:bg-primary hover:text-white"
              >
                Logout
              </button>
            ) : (
              <a
                href="/auth?action=login"
                onClick={handleLinkClick}
                className="w-40 text-center px-6 py-2 rounded-md bg-primary text-background font-medium transition-colors duration-300 hover:bg-primary/90"
              >
                Login
              </a>
            )}

            <ThemeToggle />
          </motion.nav>

        )}
      </AnimatePresence>
    </motion.header>
  );
};

export default Header;