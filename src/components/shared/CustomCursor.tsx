"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface CustomCursorProps {
  activeTheme: string;
}

export default function CustomCursor({ activeTheme }: CustomCursorProps) {
  const [mounted, setMounted] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Position motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for trailing circle/box
  const springConfig = { damping: 25, stiffness: 350, mass: 0.1 };
  const smoothX = useSpring(cursorX, springConfig);
  const smoothY = useSpring(cursorY, springConfig);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches || "ontouchstart" in window) {
      setIsTouchDevice(true);
      return;
    }

    setMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);

      // Check if hovering over clickable elements
      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable = Boolean(
          target.closest("a, button, input, textarea, select, [role='button'], label, .cursor-pointer")
        );
        setIsHovering(isClickable);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  if (!mounted || isTouchDevice) return null;

  return (
    <div
      className={`pointer-events-none fixed top-0 left-0 z-[9999] transition-opacity duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* ================= 1. APPLE CURSOR ================= */}
      {activeTheme === "apple" && (
        <>
          {/* Outer frosted ring */}
          <motion.div
            style={{
              x: smoothX,
              y: smoothY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              width: isHovering ? 52 : 32,
              height: isHovering ? 52 : 32,
              backgroundColor: isHovering ? "rgba(0, 113, 227, 0.18)" : "rgba(255, 255, 255, 0.5)",
              borderColor: isHovering ? "rgba(0, 113, 227, 0.6)" : "rgba(0, 113, 227, 0.25)",
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="rounded-full border backdrop-blur-[2px] shadow-[0_4px_16px_rgba(0,113,227,0.15)] flex items-center justify-center"
          />
          {/* Inner precision dot */}
          <motion.div
            style={{
              x: cursorX,
              y: cursorY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              scale: isHovering ? 0 : 1,
            }}
            className="w-1.5 h-1.5 rounded-full bg-[#0071e3] shadow-[0_0_6px_#0071e3]"
          />
        </>
      )}

      {/* ================= 2. CREATIVE CURSOR ================= */}
      {activeTheme === "creative" && (
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            width: isHovering ? 32 : 20,
            height: isHovering ? 32 : 20,
            rotate: isHovering ? -15 : 8,
            backgroundColor: isHovering ? "#ec4899" : "#facc15",
            scale: isHovering ? 1.25 : 1,
          }}
          transition={{ type: "spring", stiffness: 450, damping: 20 }}
          className="border-2 border-black shadow-[3px_3px_0px_0px_#000] flex items-center justify-center font-black text-[9px] text-black select-none"
        >
          {isHovering ? "✦" : ""}
        </motion.div>
      )}

      {/* ================= 3. DARK NEON CURSOR ================= */}
      {activeTheme === "dark" && (
        <>
          {/* Orbiting cyber ring */}
          <motion.div
            style={{
              x: smoothX,
              y: smoothY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              width: isHovering ? 46 : 28,
              height: isHovering ? 46 : 28,
              borderColor: isHovering ? "#c084fc" : "rgba(168, 85, 247, 0.5)",
              borderWidth: isHovering ? 2 : 1,
            }}
            transition={{ type: "spring", stiffness: 350, damping: 22 }}
            className="rounded-full border shadow-[0_0_18px_rgba(168,85,247,0.5)] flex items-center justify-center"
          >
            {isHovering && (
              <span className="w-2 h-2 border-t border-l border-purple-300 absolute -top-1 -left-1" />
            )}
          </motion.div>
          {/* Center laser point */}
          <motion.div
            style={{
              x: cursorX,
              y: cursorY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              scale: isHovering ? 1.5 : 1,
            }}
            className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_10px_#c084fc]"
          />
        </>
      )}

      {/* ================= 4. DEVELOPER TERMINAL CURSOR ================= */}
      {activeTheme === "developer" && (
        <motion.div
          style={{
            x: smoothX,
            y: smoothY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          animate={{
            scale: isHovering ? 1.3 : 1,
          }}
          className="font-mono text-[#39ff14] text-xs font-bold select-none drop-shadow-[0_0_8px_#39ff14] flex items-center gap-0.5"
        >
          {isHovering ? (
            <span className="bg-[#39ff14] text-black px-1 rounded-sm text-[10px]">[+]</span>
          ) : (
            <span className="animate-pulse text-sm">█</span>
          )}
        </motion.div>
      )}

      {/* ================= 5. MINIMALIST EDITORIAL CURSOR ================= */}
      {activeTheme === "minimalist" && (
        <>
          {/* Hairline circle */}
          <motion.div
            style={{
              x: smoothX,
              y: smoothY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              width: isHovering ? 46 : 24,
              height: isHovering ? 46 : 24,
              borderColor: isHovering ? "#171717" : "rgba(115, 115, 115, 0.4)",
              backgroundColor: isHovering ? "rgba(0, 0, 0, 0.04)" : "transparent",
            }}
            transition={{ type: "spring", stiffness: 350, damping: 25 }}
            className="rounded-full border border-neutral-400"
          />
          {/* Fine center pinpoint */}
          <motion.div
            style={{
              x: cursorX,
              y: cursorY,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              scale: isHovering ? 0 : 1,
            }}
            className="w-1 h-1 rounded-full bg-neutral-900"
          />
        </>
      )}
    </div>
  );
}
