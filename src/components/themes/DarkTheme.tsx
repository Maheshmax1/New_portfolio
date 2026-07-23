"use client";

import { useState, useEffect } from "react";
import { PortfolioData } from "@/types";
import TypingEffect from "../shared/TypingEffect";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Sparkles,
  Zap,
  ArrowRight,
  ExternalLink,
  Mail,
  Phone,
  Check,
} from "lucide-react";
import { Github, Instagram, Whatsapp } from "../shared/BrandIcons";

interface ThemeProps {
  data: PortfolioData;
}

export default function DarkTheme({ data }: ThemeProps) {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [profileImageIndex, setProfileImageIndex] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

  const getAssetPath = (path: string) => {
    if (!path) return "";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    return `${basePath}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const profileImages = ["/profile_striped.jpg", "/profile_freshworks.jpg"];

  useEffect(() => {
    const timer = setInterval(() => {
      setProfileImageIndex((prev) => (prev === 0 ? 1 : 0));
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Name and Phone Number are required.");
      return;
    }
    const waText = `Hello Mahesh,\n\nHere are my contact details:\n- *Name:* ${formData.name}\n- *Phone:* ${formData.phone}\n- *Email:* ${formData.email || "N/A"}\n- *Message:* ${formData.message || "N/A"}`;
    const waUrl = `https://wa.me/91${data.contact.phone}?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, "_blank");
  };

  const displayedProjects = showAllProjects ? data.projects : data.projects.slice(0, 3);

  return (
    <div className="bg-[#050505] text-[#a0a0a0] font-sans antialiased min-h-screen selection:bg-purple-600 selection:text-white">
      {/* 1. Header */}
      <header className="sticky top-0 z-40 w-full bg-[#050505]/80 border-b border-purple-500/10 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="font-extrabold text-md tracking-widest text-white uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-ping"></span>
            {data.settings.websiteName.split("|")[0].trim()}
          </a>
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold uppercase tracking-wider text-[#666]">
            <a href="#about" className="hover:text-purple-400 transition">About</a>
            <a href="#services" className="hover:text-purple-400 transition">Services</a>
            <a href="#skills" className="hover:text-purple-400 transition">Skills</a>
            <a href="#projects" className="hover:text-purple-400 transition">Projects</a>
            <a href="#journey" className="hover:text-purple-400 transition">Journey</a>
            <a href="#faq" className="hover:text-purple-400 transition">FAQ</a>
            <a href="#contact" className="hover:text-purple-400 transition">Contact</a>
          </nav>
          <a
            href="#contact"
            className="text-[10px] font-bold uppercase tracking-widest bg-transparent border border-purple-500/30 text-purple-400 px-5 py-2.5 rounded hover:bg-purple-500/10 transition"
          >
            Connect
          </a>
        </div>
      </header>

      {/* 2. Hero */}
      <section className="py-24 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 border border-purple-500/20 px-3 py-1 rounded">
            System status: online
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight">
            I am {data.hero.name}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-fuchsia-500">
              <TypingEffect wordsString={data.hero.typingWords} />
            </span>
          </h1>
          <p className="text-md text-[#d0d0d0] leading-relaxed">
            {data.hero.tagline}
          </p>
          <p className="text-sm text-[#707070] leading-relaxed">
            {data.hero.description}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="#contact"
              className="bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 px-7 rounded text-xs uppercase tracking-widest shadow-lg shadow-purple-600/25 flex items-center gap-2"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
        <div className="w-full md:w-[360px] h-[360px] rounded overflow-hidden border border-purple-500/10 bg-[#0d0d0d] relative">
          <AnimatePresence mode="wait">
            <motion.img
              key={profileImageIndex}
              src={getAssetPath(profileImages[profileImageIndex])}
              alt={data.hero.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover object-top filter grayscale contrast-125 hover:filter-none transition duration-500"
            />
          </AnimatePresence>
        </div>
      </section>

      {/* 3. About */}
      <section id="about" className="py-24 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-purple-500/10">
        <div className="w-full h-[480px] rounded overflow-hidden border border-purple-500/10 relative bg-[#0d0d0d]">
          <AnimatePresence mode="wait">
            <motion.img
              key={profileImageIndex}
              src={getAssetPath(profileImages[profileImageIndex])}
              alt="About"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover object-top filter grayscale hover:filter-none transition duration-500"
            />
          </AnimatePresence>
        </div>
        <div className="space-y-6 flex flex-col justify-center">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Biography</span>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Core Competence</h2>
          <p className="text-sm text-[#a0a0a0] leading-relaxed">{data.about.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-[#0d0d0d] border border-purple-500/10 rounded">
              <span className="text-[10px] font-bold text-white block mb-2 uppercase tracking-widest">Mission</span>
              <p className="text-xs text-[#808080] leading-relaxed">{data.about.mission}</p>
            </div>
            <div className="p-6 bg-[#0d0d0d] border border-purple-500/10 rounded">
              <span className="text-[10px] font-bold text-white block mb-2 uppercase tracking-widest">Vision</span>
              <p className="text-xs text-[#808080] leading-relaxed">{data.about.vision}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Services */}
      <section id="services" className="py-24 px-6 max-w-6xl mx-auto border-t border-purple-500/10 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Services</span>
          <h2 className="text-3xl font-black text-white uppercase">Operational Stack</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.services.filter(s => s.status).map((service) => (
            <div key={service.id} className="p-6 bg-[#0d0d0d] border border-purple-500/10 hover:border-purple-500/30 transition duration-300 rounded">
              <div className="text-xs font-bold text-purple-400 mb-6 uppercase tracking-widest">
                [{service.icon.substring(0, 3)}]
              </div>
              <h3 className="font-bold text-white mb-2 text-sm uppercase tracking-wide">{service.title}</h3>
              <p className="text-xs text-[#808080] leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Skills Section */}
      <section id="skills" className="py-24 px-6 max-w-6xl mx-auto border-t border-purple-500/10 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Dependencies</span>
          <h2 className="text-3xl font-black text-white uppercase">Skills & AI Integration</h2>
        </div>
        <div className="space-y-8 max-w-4xl mx-auto font-sans">
          {Array.from(new Set(data.skills.map(s => s.category))).map(cat => (
            <div key={cat} className="space-y-4">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#666] border-b border-purple-500/15 pb-2">{cat}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.skills.filter(s => s.category === cat).map((skill) => (
                  <div key={skill.id} className="p-4 bg-[#0d0d0d] border border-purple-500/10 rounded flex items-center justify-center text-center">
                    <span className="text-xs text-[#a0a0a0] font-semibold">{skill.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Projects */}
      <section id="projects" className="py-24 px-6 max-w-6xl mx-auto border-t border-purple-500/10 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Portfolio</span>
          <h2 className="text-3xl font-black text-white uppercase">Completed Ops</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displayedProjects.map((project) => (
            <div key={project.id} className="bg-[#0d0d0d] border border-purple-500/10 rounded flex flex-col justify-between overflow-hidden">
              <div className="h-44 w-full bg-[#111] overflow-hidden">
                <img src={getAssetPath(project.image)} alt={project.title} className="w-full h-full object-cover object-top filter grayscale contrast-125 hover:filter-none transition duration-500" />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-bold text-sm text-white uppercase tracking-wide">{project.title}</h3>
                  <p className="text-xs text-[#808080] line-clamp-3 leading-relaxed mt-2">{project.description}</p>
                </div>
                <div className="flex items-center justify-between border-t border-purple-500/5 pt-4">
                  <span className="text-[10px] text-purple-400 font-bold uppercase tracking-wider">{project.category}</span>
                  <div className="flex gap-2">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" className="text-[#666] hover:text-white transition">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {data.projects.length > 3 && (
          <div className="flex justify-center pt-8">
            <button
              onClick={() => setShowAllProjects(!showAllProjects)}
              className="px-6 py-3 bg-[#0d0d0d] border border-purple-500/30 text-purple-400 font-bold text-xs uppercase tracking-widest hover:bg-purple-500/10 rounded transition duration-200 active:scale-95"
            >
              {showAllProjects ? "Show Main Projects Only" : `View All ${data.projects.length} Projects`}
            </button>
          </div>
        )}
      </section>

      {/* 7. Journey Timeline */}
      <section id="journey" className="py-24 px-6 max-w-6xl mx-auto border-t border-purple-500/10 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Operational log</span>
          <h2 className="text-3xl font-black text-white uppercase">History Timeline</h2>
        </div>
        <div className="relative border-l border-purple-500/20 ml-4 md:ml-8 space-y-10 py-4 max-w-3xl mx-auto">
          {data.workProcess.map((item) => (
            <div key={item.id} className="relative pl-8 md:pl-10">
              <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_4px_rgba(168,85,247,0.3)]" />
              <div className="bg-[#0d0d0d] border border-purple-500/10 rounded p-6 space-y-2">
                <span className="text-[10px] font-bold text-purple-400 bg-purple-950/30 px-2 py-0.5 rounded border border-purple-500/20">
                  {item.order === 2027 ? "2026 - Present" : item.order === 2021 ? "2021 - 2023" : item.order === 2025 ? "2025 - 2026" : item.order}
                </span>
                <h3 className="font-bold text-sm text-white uppercase tracking-wider">{item.title}</h3>
                <p className="text-xs text-[#808080] leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. FAQs */}
      <section id="faq" className="py-24 px-6 max-w-3xl mx-auto border-t border-purple-500/10 space-y-12">
        <div className="text-center space-y-2">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Support</span>
          <h2 className="text-3xl font-black text-white uppercase">Knowledge Base</h2>
        </div>
        <div className="space-y-4">
          {data.faqs.map((faq) => {
            const isOpen = activeFaq === faq.id;

            return (
              <div key={faq.id} className="border border-purple-500/10 rounded bg-[#0d0d0d]">
                <button
                  onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                  className="w-full flex items-center justify-between p-5 text-left text-xs font-bold uppercase tracking-wider text-white"
                >
                  <span>{faq.question}</span>
                </button>
                {isOpen && (
                  <div className="p-5 pt-0 border-t border-purple-500/5 text-xs text-[#808080] leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. Contact */}
      <section id="contact" className="py-24 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-purple-500/10">
        <div className="space-y-6">
          <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Connection</span>
          <h2 className="text-3xl font-black text-white uppercase">Initiate Protocol</h2>
          
          <div className="space-y-4 text-xs text-[#808080] font-semibold pt-4">
            {data.contact.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-purple-500" />
                <a href={`mailto:${data.contact.email}`} className="text-slate-300 hover:text-white underline">{data.contact.email}</a>
              </div>
            )}
            {data.contact.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-purple-500" />
                <a href={`tel:${data.contact.phone}`} className="text-slate-300 hover:text-white underline">{data.contact.phone}</a>
              </div>
            )}
            {data.contact.github && (
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-purple-500" />
                <a href={data.contact.github} target="_blank" className="text-slate-300 hover:text-white underline">GitHub</a>
              </div>
            )}
            {data.contact.whatsapp && (
              <div className="flex items-center gap-2">
                <Whatsapp className="w-4 h-4 text-purple-500" />
                <a href={`https://wa.me/${data.contact.whatsapp}`} target="_blank" className="text-slate-300 hover:text-white underline">WhatsApp</a>
              </div>
            )}
            {data.contact.instagram && (
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-purple-500" />
                <a href={data.contact.instagram} target="_blank" className="text-slate-300 hover:text-white underline">Instagram</a>
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#0d0d0d] border border-purple-500/10 rounded p-8">
          <form className="space-y-4" onSubmit={handleContactSubmit}>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666] mb-1">Name (Required)</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#050505] border border-purple-500/10 rounded py-2.5 px-4 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666] mb-1">Phone Number (Required)</label>
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#050505] border border-purple-500/10 rounded py-2.5 px-4 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666] mb-1">Email (Optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#050505] border border-purple-500/10 rounded py-2.5 px-4 text-xs text-white focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[#666] mb-1">Message (Optional)</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[#050505] border border-purple-500/10 rounded py-2.5 px-4 text-xs text-white resize-none focus:outline-none focus:border-purple-500"
              />
            </div>
            <button type="submit" className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 px-4 rounded text-xs uppercase tracking-widest transition">
              Send to WhatsApp
            </button>
          </form>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="border-t border-purple-500/10 py-8 text-center text-[10px] uppercase tracking-widest text-[#666]">
        &copy; {new Date().getFullYear()} {data.hero.name}. System Terminated.
      </footer>
    </div>
  );
}
