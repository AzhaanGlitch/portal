// contexts/ContentContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';


interface AllContent {
  hero: any;
  about: any;
  services: any;
  history: any;
  prototypes: any;
  team: any;
  aboutpg: any;
}

interface ContentContextType {
  content: AllContent;
  loading: boolean;
  error: string | null;
  refreshContent: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<AllContent>({
    hero: null,
    about: null,
    services: null,
    history: null,
    prototypes: null,
    team: null, 
    aboutpg: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Define all content files to fetch
      const contentFiles = [
        { key: 'hero', path: '/content/home/hero.json' },
        { key: 'about', path: '/content/home/about.json' },
        { key: 'services', path: '/content/home/services.json' },
        { key: 'history', path: '/content/home/history.json' },
        { key: 'prototypes', path: '/content/home/prototypes.json' },
        { key: 'team', path: '/content/home/team.json' },
        { key: 'aboutpg', path: '/content/about/main.json' },

      ];

      // Fetch all content files in parallel
      const fetchPromises = contentFiles.map(async ({ key, path }) => {
        try {
          const response = await fetch(path);
          if (!response.ok) {
            throw new Error(`Failed to load ${key} content`);
          }
          return { key, data: await response.json() };
        } catch (err) {
          console.error(`Error loading ${key}:`, err);
          return { key, data: null, error: err };
        }
      });

      const results = await Promise.all(fetchPromises);
      
      // Combine all results into single content object
      const newContent: AllContent = { ...content };
      let hasErrors = false;

      results.forEach(({ key, data, error }) => {
        if (error) {
          hasErrors = true;
          console.error(`Failed to load ${key}:`, error);
        } else {
          newContent[key as keyof AllContent] = data;
        }
      });

      setContent(newContent);

      if (hasErrors) {
        setError('Some content failed to load. Please check console for details.');
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error loading content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const refreshContent = () => {
    fetchContent();
  };

  return (
    <ContentContext.Provider value={{ 
      content, 
      loading, 
      error, 
      refreshContent 
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}