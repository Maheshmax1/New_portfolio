"use client";

import { useState, useEffect } from "react";
import { PortfolioData } from "@/types";
import TypingEffect from "../shared/TypingEffect";
import { motion, AnimatePresence } from "framer-motion";
import {
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

export default function MinimalistTheme({ data }: ThemeProps) {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [profileImageIndex, setProfileImageIndex] = useState(0);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });

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
    <div className="bg-white text-neutral-850 font-lora antialiased min-h-screen selection:bg-neutral-900 selection:text-white">
      {/* 1. Header */}
      <header className="sticky top-0 z-40 w-full bg-white/95 border-b border-neutral-100 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="font-extrabold text-lg tracking-tight text-neutral-900 font-sans hover:opacity-85 transition">
            {data.settings.websiteName.split("|")[0].trim()}
          </a>
          <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest text-neutral-400 font-sans font-medium">
            <a href="#about" className="hover:text-neutral-900 transition">About</a>
            <a href="#services" className="hover:text-neutral-900 transition">Services</a>
            <a href="#skills" className="hover:text-neutral-900 transition">Skills</a>
            <a href="#projects" className="hover:text-neutral-900 transition">Projects</a>
            <a href="#journey" className="hover:text-neutral-900 transition">Journey</a>
            <a href="#contact" className="hover:text-neutral-900 transition">Contact</a>
          </nav>
          <a
            href="#contact"
            className="text-xs uppercase tracking-widest text-neutral-900 font-sans font-bold border-b border-neutral-900 hover:opacity-70 transition pb-0.5"
          >
            Connect
          </a>
        </div>
      </header>

      {/* 2. Hero */}
      <section className="py-28 px-6 max-w-4xl mx-auto space-y-8">
        <h1 className="text-5xl md:text-7xl font-extrabold text-neutral-900 leading-tight tracking-tight">
          Hello. I am {data.hero.name}.
          <br />
          <span className="text-neutral-400">
            <TypingEffect wordsString={data.hero.typingWords} />
          </span>
        </h1>
        <p className="text-xl text-neutral-600 leading-relaxed font-light max-w-2xl italic">
          {data.hero.tagline}
        </p>
        <p className="text-sm text-neutral-500 leading-relaxed font-sans max-w-xl">
          {data.hero.description}
        </p>
        <div className="pt-6 font-sans">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 bg-neutral-900 text-white font-semibold py-3.5 px-8 rounded hover:bg-neutral-800 transition"
          >
            Start Project
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* 3. About */}
      <section id="about" className="py-24 px-6 max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 border-t border-neutral-100">
        <div className="w-full h-[480px] overflow-hidden bg-neutral-50 relative border border-neutral-200">
          <AnimatePresence mode="wait">
            <motion.img
              key={profileImageIndex}
              src={profileImages[profileImageIndex]}
              alt="Biography"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover object-top grayscale"
            />
          </AnimatePresence>
        </div>
        <div className="space-y-6 flex flex-col justify-center">
          <span className="text-xs uppercase tracking-widest font-sans font-bold text-neutral-400">Biography</span>
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">About My Focus</h2>
          <p className="text-sm text-neutral-600 leading-relaxed font-sans font-light">{data.about.description}</p>
        </div>
      </section>

      {/* 4. Services */}
      <section id="services" className="py-24 px-6 max-w-4xl mx-auto border-t border-neutral-100 space-y-12">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest font-sans font-bold text-neutral-400">Capabilities</span>
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Focus Disciplines</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 font-sans">
          {data.services.filter(s => s.status).map((service) => (
            <div key={service.id} className="space-y-3">
              <h3 className="font-bold text-neutral-900 text-base">{service.title}</h3>
              <p className="text-xs text-neutral-500 leading-relaxed font-light">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Skills Grid */}
      <section id="skills" className="py-24 px-6 max-w-4xl mx-auto border-t border-neutral-100 space-y-12">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest font-sans font-bold text-neutral-400">Skills</span>
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Technologies & AI</h2>
        </div>
        <div className="space-y-8 font-sans">
          {Array.from(new Set(data.skills.map(s => s.category))).map(cat => (
            <div key={cat} className="space-y-3">
              <h3 className="font-bold text-xs uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">{cat}</h3>
              <div className="flex flex-wrap gap-2">
                {data.skills.filter(s => s.category === cat).map((skill) => (
                  <span key={skill.id} className="text-xs border border-neutral-200 px-3 py-1 bg-neutral-50 text-neutral-800 font-light">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Projects */}
      <section id="projects" className="py-24 px-6 max-w-4xl mx-auto border-t border-neutral-100 space-y-12">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest font-sans font-bold text-neutral-400">Portfolio</span>
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">Selected Work</h2>
        </div>
        <div className="space-y-16 font-sans">
          {displayedProjects.map((project) => (
            <div key={project.id} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center group">
              <div className="h-60 w-full bg-neutral-50 overflow-hidden relative border border-neutral-200">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition duration-500" />
              </div>
              <div className="space-y-4">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">{project.category}</span>
                <h3 className="text-lg font-bold text-neutral-900">{project.title}</h3>
                <p className="text-xs text-neutral-500 leading-relaxed font-light">{project.description}</p>
                <div className="flex gap-4 pt-2">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" className="text-xs font-semibold text-neutral-900 border-b border-neutral-900 hover:opacity-60 transition pb-0.5">
                      View Live Link
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {data.projects.length > 3 && (
          <div className="flex justify-center pt-8 font-sans">
            <button
              onClick={() => setShowAllProjects(!showAllProjects)}
              className="px-6 py-3 border border-neutral-950 text-neutral-950 font-bold text-[10px] uppercase tracking-widest hover:bg-neutral-950 hover:text-white transition duration-200 active:scale-95"
            >
              {showAllProjects ? "Show Main Projects Only" : `View All ${data.projects.length} Projects`}
            </button>
          </div>
        )}
      </section>

      {/* 7. Journey Timeline */}
      <section id="journey" className="py-24 px-6 max-w-4xl mx-auto border-t border-neutral-100 space-y-12">
        <div className="space-y-2">
          <span className="text-xs uppercase tracking-widest font-sans font-bold text-neutral-400">Timeline</span>
          <h2 className="text-3xl font-extrabold text-neutral-900 tracking-tight">My Journey</h2>
        </div>
        <div className="space-y-8 font-sans">
          {data.workProcess.map((item) => (
            <div key={item.id} className="flex flex-col md:flex-row gap-4 border-l border-neutral-200 pl-4 py-1">
              <div className="md:w-32 font-bold text-xs uppercase tracking-widest text-neutral-500">
                {item.order === 2027 ? "2026 - Present" : item.order === 2021 ? "2021 - 2023" : item.order === 2025 ? "2025 - 2026" : item.order}
              </div>
              <div className="space-y-1 flex-1">
                <h3 className="font-bold text-sm text-neutral-900">{item.title}</h3>
                <p className="text-xs text-neutral-500 font-light leading-relaxed">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Contact */}
      <section id="contact" className="py-24 px-6 max-w-4xl mx-auto border-t border-neutral-100 grid grid-cols-1 md:grid-cols-2 gap-12 font-sans">
        <div className="space-y-6">
          <span className="text-xs uppercase tracking-widest font-bold text-neutral-400">Contact</span>
          <h2 className="text-3xl font-bold text-neutral-900 font-serif">Let's Connect</h2>
          
          <div className="space-y-4 text-xs text-neutral-500 font-semibold pt-4">
            {data.contact.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-neutral-900" />
                <a href={`mailto:${data.contact.email}`} className="text-neutral-900 hover:opacity-60 transition underline">{data.contact.email}</a>
              </div>
            )}
            {data.contact.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-neutral-900" />
                <a href={`tel:${data.contact.phone}`} className="text-neutral-900 hover:opacity-60 transition underline">{data.contact.phone}</a>
              </div>
            )}
            {data.contact.github && (
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-neutral-900" />
                <a href={data.contact.github} target="_blank" className="text-neutral-900 hover:opacity-60 transition underline">GitHub</a>
              </div>
            )}
            {data.contact.whatsapp && (
              <div className="flex items-center gap-2">
                <Whatsapp className="w-4 h-4 text-neutral-900" />
                <a href={`https://wa.me/${data.contact.whatsapp}`} target="_blank" className="text-neutral-900 hover:opacity-60 transition underline">WhatsApp</a>
              </div>
            )}
            {data.contact.instagram && (
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-neutral-900" />
                <a href={data.contact.instagram} target="_blank" className="text-neutral-900 hover:opacity-60 transition underline">Instagram</a>
              </div>
            )}
          </div>
        </div>

        <div>
          <form className="space-y-4" onSubmit={handleContactSubmit}>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Name (Required)</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-none py-2.5 px-4 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Phone Number (Required)</label>
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-none py-2.5 px-4 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Email (Optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-none py-2.5 px-4 text-xs text-neutral-900 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Message (Optional)</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-neutral-50 border border-neutral-200 rounded-none py-2.5 px-4 text-xs text-neutral-900 resize-none focus:outline-none focus:border-neutral-900"
              />
            </div>
            <button type="submit" className="w-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold py-3.5 px-4 rounded-none text-xs uppercase tracking-widest transition">
              Send to WhatsApp
            </button>
          </form>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="border-t border-neutral-100 py-12 text-center text-xs text-neutral-400 font-sans">
        &copy; {new Date().getFullYear()} {data.hero.name}. Made with intention.
      </footer>
    </div>
  );
}
