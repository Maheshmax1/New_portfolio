"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface InteractiveHeroPhotoProps {
  src: string;
  alt: string;
  theme: "apple" | "creative" | "dark" | "developer" | "minimalist";
  className?: string;
}

export default function InteractiveHeroPhoto({
  src,
  alt,
  theme,
  className = "",
}: InteractiveHeroPhotoProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Raw mouse offset motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for fluid, physics-based opposite movement
  const springConfig = { stiffness: 120, damping: 18, mass: 0.5 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // Subtle 3D tilt
  const rotateX = useTransform(smoothY, [-45, 45], [-8, 8]);
  const rotateY = useTransform(smoothX, [-45, 45], [8, -8]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Find the hero section or calculate from viewport center
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      // Normalized coordinates (-1 to 1)
      const normX = (e.clientX - centerX) / centerX;
      const normY = (e.clientY - centerY) / centerY;

      // Inverse parallax:
      // When cursor moves TOP (normY < 0), image moves DOWN (+value)
      // When cursor moves BOTTOM (normY > 0), image moves UP (-value)
      // When cursor moves LEFT (normX < 0), image moves RIGHT (+value)
      // When cursor moves RIGHT (normX > 0), image moves LEFT (-value)
      const maxOffset = 38; // pixels of maximum float
      mouseX.set(-normX * maxOffset);
      mouseY.set(-normY * maxOffset);
    };

    const handleMouseLeave = () => {
      // Return gently to center when cursor leaves viewport
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY]);

  const getAssetPath = (path: string) => {
    if (!path) return "/profile.jpg";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    return `${basePath}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const imageSrc = getAssetPath(src || "/profile.jpg");

  // Render theme-specific frame
  return (
    <div
      ref={containerRef}
      className={`relative select-none perspective-[1000px] flex items-center justify-center ${className}`}
    >
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="w-full max-w-[380px] md:max-w-[420px] transition-shadow duration-300"
      >
        {/* ================= 1. APPLE THEME ================= */}
        {theme === "apple" && (
          <div className="relative group">
            {/* Ambient Apple Glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-500/20 via-indigo-500/15 to-purple-500/20 rounded-[2.5rem] blur-2xl opacity-75 group-hover:opacity-100 transition duration-500 pointer-events-none" />

            {/* Glass container */}
            <div className="relative rounded-[2rem] p-2 bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_20px_50px_rgba(0,113,227,0.18)] overflow-hidden">
              <div className="w-full aspect-square rounded-[1.6rem] overflow-hidden bg-zinc-100 relative">
                <img
                  src={imageSrc}
                  alt={alt}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

                {/* Floating Top Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-white/50 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-zinc-800 tracking-wide">
                    FULLSTACK & BACKEND
                  </span>
                </div>

                {/* Floating Bottom Pill */}
                <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10 flex items-center justify-between text-white text-[11px] font-medium">
                  <span className="font-semibold tracking-wide">Mahesh Mariappan</span>
                  <span className="text-blue-400 font-bold">Java • React • Spring</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 2. CREATIVE THEME ================= */}
        {theme === "creative" && (
          <div className="relative group">
            {/* Neo-brutalist offset shadow block */}
            <div className="absolute inset-0 bg-[#ec4899] border-4 border-black translate-x-3 translate-y-3" />

            {/* Main Frame */}
            <div className="relative border-4 border-black bg-white p-3 shadow-[8px_8px_0px_0px_#000]">
              {/* Corner Playful Stickers */}
              <div className="absolute -top-4 -left-4 bg-[#facc15] border-3 border-black px-2.5 py-1 font-black text-[10px] uppercase tracking-wider rotate-[-6deg] shadow-[2px_2px_0px_#000] z-20">
                ★ 2026 EDITION
              </div>
              <div className="absolute -bottom-3 -right-3 bg-[#38bdf8] border-3 border-black px-2.5 py-1 font-black text-[10px] uppercase tracking-wider rotate-[4deg] shadow-[2px_2px_0px_#000] z-20">
                ✦ CRAFT & CODE
              </div>

              <div className="w-full aspect-square border-2 border-black overflow-hidden bg-yellow-100 relative">
                <img
                  src={imageSrc}
                  alt={alt}
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Tag row */}
              <div className="mt-2.5 pt-2 border-t-2 border-black flex items-center justify-between font-mono font-black text-[11px] uppercase">
                <span className="bg-black text-white px-1.5 py-0.5">DEV.STATUS</span>
                <span className="text-black">ACTIVE @ NESSA</span>
              </div>
            </div>
          </div>
        )}

        {/* ================= 3. DARK THEME ================= */}
        {theme === "dark" && (
          <div className="relative group">
            {/* Cyberpunk Violet Ambient Aura */}
            <div className="absolute -inset-3 bg-purple-600/25 rounded-2xl blur-xl group-hover:bg-purple-600/40 transition duration-500 pointer-events-none" />

            {/* Obsidian Glass Frame */}
            <div className="relative bg-[#0d0d12] border border-purple-500/40 rounded-xl p-3 shadow-[0_0_35px_rgba(168,85,247,0.25)] overflow-hidden">
              {/* Sci-fi HUD Corner Accents */}
              <div className="absolute top-1 left-1 w-3 h-3 border-t-2 border-l-2 border-purple-400 pointer-events-none" />
              <div className="absolute top-1 right-1 w-3 h-3 border-t-2 border-r-2 border-purple-400 pointer-events-none" />
              <div className="absolute bottom-1 left-1 w-3 h-3 border-b-2 border-l-2 border-purple-400 pointer-events-none" />
              <div className="absolute bottom-1 right-1 w-3 h-3 border-b-2 border-r-2 border-purple-400 pointer-events-none" />

              {/* Status Header */}
              <div className="flex items-center justify-between text-[10px] font-mono text-purple-400/80 pb-2 px-1">
                <span>[SYS.CORE]</span>
                <span className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
                  ONLINE
                </span>
              </div>

              <div className="w-full aspect-square rounded overflow-hidden border border-purple-500/20 bg-black relative">
                <img
                  src={imageSrc}
                  alt={alt}
                  className="w-full h-full object-cover object-top filter grayscale contrast-115 hover:filter-none transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-2.5 left-2.5 right-2.5 text-xs font-mono text-purple-200">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-white">
                    Mahesh Mariappan
                  </div>
                  <div className="text-[9px] text-purple-400">
                    Java / Spring / Next.js Architect
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 4. DEVELOPER THEME ================= */}
        {theme === "developer" && (
          <div className="relative group">
            {/* Terminal Window Frame */}
            <div className="relative bg-[#080c14] border-2 border-[#39ff14]/50 rounded-lg shadow-[0_0_35px_rgba(57,255,20,0.2)] overflow-hidden font-mono">
              {/* Terminal Header */}
              <div className="bg-[#0e1626] border-b border-[#39ff14]/30 px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#ff5f56] inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#febc2e] inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#27c93f] inline-block" />
                </div>
                <div className="text-[10px] text-[#39ff14] font-bold tracking-tight">
                  bash: profile_render.sh [200 OK]
                </div>
                <div className="text-[9px] text-[#666]">x86_64</div>
              </div>

              {/* Photo Area */}
              <div className="p-3">
                <div className="w-full aspect-square border border-[#39ff14]/30 rounded overflow-hidden relative bg-black">
                  <img
                    src={imageSrc}
                    alt={alt}
                    className="w-full h-full object-cover object-top grayscale hover:grayscale-0 opacity-90 hover:opacity-100 transition-all duration-500"
                  />

                  {/* Terminal Scanline overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#39ff14]/5 to-transparent pointer-events-none" />

                  {/* Terminal CLI prompt pill */}
                  <div className="absolute bottom-2 left-2 bg-black/85 border border-[#39ff14]/40 px-2 py-0.5 rounded text-[10px] text-[#39ff14]">
                    $ export ROLE="NCA Trainee"
                  </div>
                </div>

                {/* Footer status bar */}
                <div className="mt-2 text-[9px] text-[#888] flex items-center justify-between border-t border-[#39ff14]/20 pt-1.5">
                  <span>
                    LANG: <span className="text-[#39ff14]">JAVA / SPRING / TS</span>
                  </span>
                  <span className="text-white font-bold animate-pulse">● LIVE</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= 5. MINIMALIST THEME ================= */}
        {theme === "minimalist" && (
          <div className="relative group">
            {/* Editorial Luxury Passe-Partout */}
            <div className="relative bg-white p-5 border border-neutral-300 shadow-[0_15px_40px_rgba(0,0,0,0.06)]">
              {/* Fine inner frame */}
              <div className="border border-neutral-200 p-2">
                <div className="w-full aspect-square overflow-hidden bg-neutral-100 relative">
                  <img
                    src={imageSrc}
                    alt={alt}
                    className="w-full h-full object-cover object-top grayscale contrast-105 hover:grayscale-0 transition-all duration-700 ease-out"
                  />
                </div>
              </div>

              {/* Gallery-style caption */}
              <div className="mt-3 flex items-center justify-between text-[10px] uppercase tracking-widest text-neutral-500 font-sans">
                <span className="font-semibold text-neutral-900">PLATE NO. 01</span>
                <span>MAHESH M. — 2026</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
