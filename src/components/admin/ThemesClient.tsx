"use client";

import { useState } from "react";
import { applyTheme } from "@/lib/actions/portfolio";
import { Check, Palette, Sparkles, Layout, Code, Terminal, FileText, ArrowUpRight } from "lucide-react";

interface ThemeMeta {
  slug: string;
  name: string;
  description: string;
  tags: string[];
  gradient: string;
  icon: any;
}

const themes: ThemeMeta[] = [
  {
    slug: "apple",
    name: "Apple Style",
    description: "Minimalist design inspired by Apple. Features frosted glass blurs, light interfaces, custom rounded-3xl corners, and ultra-smooth fluid transitions.",
    tags: ["Minimal", "Glassmorphism", "White Theme", "Immersive"],
    gradient: "from-slate-100 to-zinc-200 text-slate-800",
    icon: Layout,
  },
  {
    slug: "corporate",
    name: "Modern Corporate",
    description: "Clean, reliable layout in navy blue. Grid arrangements, corporate headers, bold contact options, and traditional card boxes.",
    tags: ["Professional", "Blue Theme", "Corporate Grid", "Agency"],
    gradient: "from-slate-900 via-blue-950 to-slate-900 text-white",
    icon: FileText,
  },
  {
    slug: "dark",
    name: "Dark Theme",
    description: "Deep charcoal backdrops with glowing neon violet/green accents. Clean borders, glow filters, and contemporary typography.",
    tags: ["Dark Mode", "Neon Glows", "Elegant", "High Contrast"],
    gradient: "from-[#0a0a0a] to-[#1a1a1a] text-white border-violet-500/30",
    icon: Sparkles,
  },
  {
    slug: "glassmorphism",
    name: "Glassmorphism",
    description: "Intense translucent layers floating over vibrant purple-blue mesh gradients. Highly active blur filters and custom glowing borders.",
    tags: ["Mesh Gradient", "Frosted Glass", "Glow Effects", "Modern"],
    gradient: "from-indigo-900/60 to-purple-900/60 text-white border-white/20 backdrop-blur-xl",
    icon: Palette,
  },
  {
    slug: "minimalist",
    name: "Minimalist",
    description: "Ultra-clean aesthetics focusing heavily on margins and contrast. High whitespace, serif typography headers, and pure grayscale outlines.",
    tags: ["Whitespace", "Serif Typography", "Zero Borders", "High Contrast"],
    gradient: "from-white to-neutral-50 text-neutral-900 border-neutral-200",
    icon: Layout,
  },
  {
    slug: "creative",
    name: "Creative",
    description: "Asymmetrical blocks, overlapping banners, off-beat margins, and bold combinations of bright yellow, neon pink, and purple details.",
    tags: ["Asymmetrical", "Bright Colors", "Overlapping Layers", "Expressive"],
    gradient: "from-yellow-400 to-pink-500 text-white",
    icon: Sparkles,
  },
  {
    slug: "developer",
    name: "Developer Console",
    description: "Styled entirely like a Unix terminal command prompt. Monospace fonts, folder symbols, GitHub repository links, and terminal style components.",
    tags: ["Monospace Font", "Terminal Style", "Code Blox", "Git Dark"],
    gradient: "from-[#0d1117] to-[#161b22] text-[#39ff14] border-[#39ff14]/20",
    icon: Terminal,
  },
  {
    slug: "agency",
    name: "Agency Studio",
    description: "Heavy headlines, full-width content cards, immersive grid systems, large CTA banners, and detailed project gallery grids.",
    tags: ["Studio Layout", "Bold Grids", "Client Showcase", "Sales Focused"],
    gradient: "from-slate-900 to-slate-950 text-white",
    icon: Layout,
  },
  {
    slug: "landing",
    name: "Landing Page",
    description: "Conversion-optimized layout sequence. Large hero action forms, client testimonials cards, and plan pricing cards positioned directly on the home page.",
    tags: ["CTAs", "Pricing Matrix", "Trust Badges", "Form Integration"],
    gradient: "from-blue-600 to-indigo-700 text-white",
    icon: Check,
  },
  {
    slug: "animated",
    name: "Animated Flow",
    description: "Heavy interactions, cursor hover card translations (3D), parallax content scaling, and advanced scroll reveals.",
    tags: ["Scroll Reveal", "Parallax Scroll", "3D Hover Card", "Mouse particles"],
    gradient: "from-[#080d16] to-[#0f172a] text-white border-cyan-500/20",
    icon: Code,
  },
];

interface ThemesClientProps {
  currentTheme: string;
}

export default function ThemesClient({ currentTheme }: ThemesClientProps) {
  const [activeTheme, setActiveTheme] = useState(currentTheme);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);

  const handleApplyTheme = async (slug: string) => {
    if (activeTheme === slug) return;

    setLoadingSlug(slug);
    try {
      await applyTheme(slug);
      setActiveTheme(slug);
    } catch (error) {
      console.error(error);
      alert("Failed to apply theme. Please try again.");
    } finally {
      setLoadingSlug(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Dynamic Summary Panel */}
      <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-md font-bold text-white flex items-center gap-2">
            <Palette className="w-5 h-5 text-blue-400" />
            Active Theme Status
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            All frontend routes (home, project detail pages, blog posts) will compile in this theme.
          </p>
        </div>
        <div className="px-5 py-2.5 rounded-2xl bg-blue-500/10 border border-blue-500/25 flex items-center gap-2 self-start md:self-auto">
          <span className="text-xs font-semibold text-slate-300">Selected Theme:</span>
          <span className="text-sm font-black text-blue-400 uppercase tracking-wider">
            {themes.find(t => t.slug === activeTheme)?.name || activeTheme}
          </span>
        </div>
      </div>

      {/* Theme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {themes.map((theme) => {
          const isActive = activeTheme === theme.slug;
          const isLoading = loadingSlug === theme.slug;

          return (
            <div
              key={theme.slug}
              className={`backdrop-blur-xl bg-[#0c0e14]/60 border rounded-3xl overflow-hidden p-6 flex flex-col justify-between space-y-4 hover:border-white/[0.12] transition duration-300 ${
                isActive ? "border-blue-500 ring-1 ring-blue-500" : "border-white/[0.05]"
              }`}
            >
              <div className="space-y-4">
                {/* Mockup Thumbnail */}
                <div className={`relative h-28 w-full rounded-2xl bg-gradient-to-tr ${theme.gradient} border border-white/[0.08] flex items-center justify-center p-4 overflow-hidden`}>
                  <theme.icon className="w-10 h-10 opacity-40 animate-pulse" />
                  <span className="absolute bottom-2 right-3 text-[10px] uppercase font-bold tracking-widest opacity-60">
                    Preview Frame
                  </span>
                  {isActive && (
                    <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1 shadow-lg">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <h3 className="text-md font-bold text-white flex items-center gap-2">
                    {theme.name}
                    {isActive && (
                      <span className="text-[9px] font-black uppercase tracking-wider bg-blue-500/10 border border-blue-500/20 text-blue-400 px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    {theme.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {theme.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] font-bold px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-slate-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action row */}
              <div className="pt-2 border-t border-white/[0.04]">
                {isActive ? (
                  <button
                    disabled
                    className="w-full bg-white/[0.03] border border-white/[0.06] text-slate-500 font-semibold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 cursor-default"
                  >
                    <Check className="w-3.5 h-3.5" />
                    Active Theme Selected
                  </button>
                ) : (
                  <button
                    onClick={() => handleApplyTheme(theme.slug)}
                    disabled={!!loadingSlug}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl text-xs transition duration-200 flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>Applying Theme...</>
                    ) : (
                      <>
                        Apply Theme
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
