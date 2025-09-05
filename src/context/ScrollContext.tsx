// src/context/ScrollContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define the shape of our scroll context
interface ScrollContextType {
  scrollY: number;
  isTop: boolean;
}

// Create the context with a default (null) value
const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

interface ScrollProviderProps {
  children: ReactNode;
  topThreshold?: number; // Optional threshold parameter
}

export const ScrollProvider = ({ children, topThreshold = 50 }: ScrollProviderProps) => {
  const [scrollY, setScrollY] = useState(0);
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);
      setIsTop(currentScroll <= topThreshold);
    };

    // Add event listener
    window.addEventListener('scroll', handleScroll);

    // Initial check in case component mounts when not at the top
    handleScroll();

    // Clean up
    return () => window.removeEventListener('scroll', handleScroll);
  }, [topThreshold]); // Include topThreshold in dependency array

  return (
    <ScrollContext.Provider value={{ scrollY, isTop }}>
      {children}
    </ScrollContext.Provider>
  );
};

// Custom hook to consume the scroll context
export const useScroll = () => {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
};