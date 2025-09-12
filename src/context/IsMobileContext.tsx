// IsMobileContext.tsx
'use client';
import React, { createContext, useState, useEffect, useContext, ReactNode } from "react";

interface IsMobileContextType {
  isMobile: boolean;
}

const IsMobileContext = createContext<IsMobileContextType | undefined>(undefined);

export const IsMobileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 580);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return (
    <IsMobileContext.Provider value={{ isMobile }}>
      {children}
    </IsMobileContext.Provider>
  );
};

// Custom hook for easy usage
export const useIsMobile = () => {
  const context = useContext(IsMobileContext);
  if (!context) {
    throw new Error("useIsMobile must be used within an IsMobileProvider");
  }
  return context;
};



// import { useIsMobile } from "./IsMobileContext";

// const MyComponent = () => {
//   const { isMobile } = useIsMobile();

//   return <div>{isMobile ? "On Mobile" : "On Desktop"}</div>;
// };
