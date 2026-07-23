"use client";

import { useState, useEffect } from "react";
import { PortfolioData } from "@/types";
import { motion } from "framer-motion";

import AppleTheme from "../themes/AppleTheme";
import MinimalistTheme from "../themes/MinimalistTheme";
import CreativeTheme from "../themes/CreativeTheme";
import DeveloperTheme from "../themes/DeveloperTheme";
import DarkTheme from "../themes/DarkTheme";

interface ThemeWrapperProps {
  data: PortfolioData;
  initialTheme: string;
}

const THEMES = [
  { slug: "apple", name: "Apple Style", icon: "🍏", color: "bg-zinc-200 border-zinc-400" },
  { slug: "minimalist", name: "Minimalist", icon: "📄", color: "bg-white border-zinc-300 text-black" },
  { slug: "creative", name: "Creative Art", icon: "🎨", color: "bg-pink-500 border-yellow-400" },
  { slug: "developer", name: "Dev Console", icon: "💻", color: "bg-[#0b0f19] border-[#39ff14]/30" },
  { slug: "dark", name: "Dark Neon", icon: "🌙", color: "bg-purple-950 border-purple-500" },
];

export default function ThemeWrapper({ data, initialTheme }: ThemeWrapperProps) {
  const [activeTheme, setActiveTheme] = useState(initialTheme);
  const [mounted, setMounted] = useState(false);

  // Check localStorage on load to see if they have a saved preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("user-selected-theme");
    if (savedTheme && THEMES.some(t => t.slug === savedTheme)) {
      setActiveTheme(savedTheme);
    } else {
      if (!THEMES.some(t => t.slug === initialTheme)) {
        setActiveTheme("apple");
      }
    }
    setMounted(true);
  }, [initialTheme]);

  const handleThemeChange = (slug: string) => {
    setActiveTheme(slug);
    localStorage.setItem("user-selected-theme", slug);
  };

  // Render correct theme layout
  const renderTheme = () => {
    if (!mounted) return null;
    
    switch (activeTheme) {
      case "apple":
        return <AppleTheme data={data} />;
      case "minimalist":
        return <MinimalistTheme data={data} />;
      case "creative":
        return <CreativeTheme data={data} />;
      case "developer":
        return <DeveloperTheme data={data} />;
      case "dark":
        return <DarkTheme data={data} />;
      default:
        return <AppleTheme data={data} />;
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Draggable Theme Switcher Icons at the bottom right stacked vertically */}
      <div className="fixed right-6 bottom-6 flex flex-col gap-3 z-50 pointer-events-none">
        {THEMES.map((theme) => {
          const isActive = activeTheme === theme.slug;
          return (
            <motion.div
              key={theme.slug}
              drag
              dragMomentum={false}
              dragElastic={0.1}
              className="pointer-events-auto cursor-grab active:cursor-grabbing touch-none select-none"
            >
              <button
                onClick={() => handleThemeChange(theme.slug)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm border shadow-[0_4px_12px_rgba(0,0,0,0.3)] transition duration-200 hover:scale-125 relative group ${
                  theme.color
                } ${
                  isActive
                    ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-110"
                    : "opacity-85 hover:opacity-100"
                }`}
                title={theme.name}
              >
                {theme.icon}
                
                {/* Custom Tooltip on the left side of the floating buttons */}
                <div className="absolute right-12 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-black/90 border border-white/10 text-[9px] text-white font-bold uppercase tracking-wider whitespace-nowrap shadow opacity-0 group-hover:opacity-100 transition duration-150 pointer-events-none">
                  {theme.name}
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>

      {/* Actual portfolio rendered layout */}
      <div className="transition-opacity duration-300">
        {renderTheme()}
      </div>
    </div>
  );
}
