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
  Sparkles,
} from "lucide-react";
import { Github, Instagram, Whatsapp } from "../shared/BrandIcons";

interface ThemeProps {
  data: PortfolioData;
}

export default function CreativeTheme({ data }: ThemeProps) {
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
    <div className="bg-[#f3f4f6] text-[#111827] font-space antialiased min-h-screen selection:bg-yellow-400 selection:text-black">
      {/* 1. Header */}
      <header className="sticky top-0 z-40 w-full bg-[#f3f4f6]/80 border-b-4 border-black backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#" className="font-black text-2xl tracking-tighter uppercase border-4 border-black bg-yellow-400 text-black px-4 py-2 rotate-[-1.5deg] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition duration-200">
            {data.settings.websiteName.split("|")[0].trim()}
          </a>
          <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-extrabold text-black">
            <a href="#about" className="hover:text-pink-500 transition">About</a>
            <a href="#services" className="hover:text-pink-500 transition">Services</a>
            <a href="#skills" className="hover:text-pink-500 transition">Skills</a>
            <a href="#projects" className="hover:text-pink-500 transition">Projects</a>
            <a href="#journey" className="hover:text-pink-500 transition">Journey</a>
            <a href="#contact" className="hover:text-pink-500 transition">Contact</a>
          </nav>
          <a
            href="#contact"
            className="text-xs font-black uppercase bg-black hover:bg-zinc-800 text-white px-5 py-3 border-2 border-black hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            Hire Me
          </a>
        </div>
      </header>

      {/* 2. Hero */}
      <section className="py-20 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <div className="inline-block bg-pink-500 text-white text-xs font-black uppercase tracking-widest px-3 py-1.5 border-2 border-black rotate-[1deg] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            Creative Hub
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-black leading-none tracking-tight">
            I'm {data.hero.name}
            <br />
            <span className="bg-yellow-400 border-2 border-black px-3 py-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] inline-block mt-2">
              <TypingEffect wordsString={data.hero.typingWords} />
            </span>
          </h1>
          <p className="text-lg text-slate-800 font-extrabold leading-relaxed">
            {data.hero.tagline}
          </p>
          <p className="text-sm text-slate-600 leading-relaxed max-w-md">
            {data.hero.description}
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <a
              href="#contact"
              className="bg-black hover:bg-zinc-850 text-white font-extrabold py-3.5 px-8 rounded-none text-xs uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(234,179,8,1)] flex items-center gap-2 transition duration-205"
            >
              Collaborate
              <ArrowRight className="w-4 h-4 text-yellow-400" />
            </a>
          </div>
        </div>
        <div className="w-full md:w-[350px] h-[350px] border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rotate-[1.5deg] overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.img
              key={profileImageIndex}
              src={profileImages[profileImageIndex]}
              alt={data.hero.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover object-top"
            />
          </AnimatePresence>
        </div>
      </section>

      {/* 3. About */}
      <section id="about" className="py-24 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 border-t-4 border-black">
        <div className="w-full h-[480px] border-4 border-black shadow-[8px_8px_0px_0px_rgba(236,72,153,1)] rotate-[-1deg] overflow-hidden relative bg-white">
          <AnimatePresence mode="wait">
            <motion.img
              key={profileImageIndex}
              src={profileImages[profileImageIndex]}
              alt="Biography"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full h-full object-cover object-top"
            />
          </AnimatePresence>
        </div>
        <div className="space-y-6 flex flex-col justify-center">
          <span className="text-xs uppercase tracking-widest font-black text-pink-500">My Story</span>
          <h2 className="text-4xl font-black text-black uppercase tracking-tight">Biography & Goals</h2>
          <p className="text-sm text-slate-700 leading-relaxed font-semibold">{data.about.description}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[10px] font-black text-black block mb-2 uppercase tracking-widest">Vision</span>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{data.about.vision}</p>
            </div>
            <div className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-[10px] font-black text-black block mb-2 uppercase tracking-widest">Mission</span>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{data.about.mission}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Services */}
      <section id="services" className="py-24 px-6 max-w-6xl mx-auto border-t-4 border-black space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-pink-500 uppercase tracking-widest">What I Do</span>
          <h2 className="text-4xl font-black text-black uppercase">Creative Capabilities</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.services.filter(s => s.status).map((service) => (
            <div key={service.id} className="p-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition duration-200">
              <div className="w-10 h-10 border-2 border-black bg-yellow-400 flex items-center justify-center mb-6 text-black font-black uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                {service.icon.substring(0, 3)}
              </div>
              <h3 className="font-extrabold text-black mb-2 text-sm uppercase tracking-wide">{service.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-medium">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Skills Section */}
      <section id="skills" className="py-24 px-6 max-w-6xl mx-auto border-t-4 border-black space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-pink-500 uppercase tracking-widest">Expertise</span>
          <h2 className="text-4xl font-black text-black uppercase">Skills & AI Stack</h2>
        </div>
        <div className="space-y-8 max-w-4xl mx-auto">
          {Array.from(new Set(data.skills.map(s => s.category))).map(cat => (
            <div key={cat} className="space-y-4">
              <h3 className="font-black text-xs uppercase tracking-wider text-slate-500 border-b-2 border-black pb-2">{cat}</h3>
              <div className="flex flex-wrap gap-3">
                {data.skills.filter(s => s.category === cat).map((skill) => (
                  <span key={skill.id} className="bg-white border-2 border-black text-black font-black text-xs px-3.5 py-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Projects */}
      <section id="projects" className="py-24 px-6 max-w-6xl mx-auto border-t-4 border-black space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-pink-500 uppercase tracking-widest font-sans">Portfolio</span>
          <h2 className="text-4xl font-black text-black uppercase">Asymmetrical Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayedProjects.map((project) => (
            <div key={project.id} className="bg-white border-4 border-black rounded-none flex flex-col justify-between overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 transition duration-200">
              <div className="h-44 w-full bg-[#eee] overflow-hidden border-b-2 border-black">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="font-black text-md text-black uppercase tracking-wide">{project.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed mt-2 font-medium">{project.description}</p>
                </div>
                <div className="flex items-center justify-between border-t-2 border-black pt-4">
                  <span className="text-[10px] bg-yellow-400 border-2 border-black text-black font-black uppercase px-2 py-0.5">{project.category}</span>
                  <div className="flex gap-2">
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" className="p-2 border-2 border-black bg-black text-white hover:bg-yellow-400 hover:text-black transition">
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
              className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-black text-xs uppercase tracking-widest border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition duration-200 active:scale-95"
            >
              {showAllProjects ? "Show Main Projects Only" : `View All ${data.projects.length} Projects`}
            </button>
          </div>
        )}
      </section>

      {/* 7. Journey Timeline */}
      <section id="journey" className="py-24 px-6 max-w-6xl mx-auto border-t-4 border-black space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-black text-pink-500 uppercase tracking-widest">My Timeline</span>
          <h2 className="text-4xl font-black text-black uppercase">Background & Journey</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {data.workProcess.map((item) => (
            <div key={item.id} className="p-6 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
              <div className="space-y-3">
                <span className="inline-block bg-yellow-400 border-2 border-black text-black font-black text-xs px-2.5 py-1 uppercase tracking-wider">
                  {item.order === 2027 ? "2026 - Present" : item.order === 2021 ? "2021 - 2023" : item.order === 2025 ? "2025 - 2026" : item.order}
                </span>
                <h3 className="font-extrabold text-black text-sm uppercase tracking-wide pt-2">{item.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed font-semibold">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Contact */}
      <section id="contact" className="py-24 px-6 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 border-t-4 border-black">
        <div className="space-y-6">
          <span className="text-xs font-black text-pink-500 uppercase tracking-widest">Connect</span>
          <h2 className="text-4xl font-black text-black uppercase">Send Transmission</h2>
          
          <div className="space-y-4 text-xs text-slate-700 font-extrabold pt-4">
            {data.contact.email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-pink-500" />
                <a href={`mailto:${data.contact.email}`} className="text-black border-b-2 border-black underline">{data.contact.email}</a>
              </div>
            )}
            {data.contact.phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-pink-500" />
                <a href={`tel:${data.contact.phone}`} className="text-black border-b-2 border-black underline">{data.contact.phone}</a>
              </div>
            )}
            {data.contact.github && (
              <div className="flex items-center gap-2">
                <Github className="w-4 h-4 text-pink-500" />
                <a href={data.contact.github} target="_blank" className="text-black border-b-2 border-black underline">GitHub</a>
              </div>
            )}
            {data.contact.whatsapp && (
              <div className="flex items-center gap-2">
                <Whatsapp className="w-4 h-4 text-pink-500" />
                <a href={`https://wa.me/${data.contact.whatsapp}`} target="_blank" className="text-black border-b-2 border-black underline">WhatsApp</a>
              </div>
            )}
            {data.contact.instagram && (
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-pink-500" />
                <a href={data.contact.instagram} target="_blank" className="text-black border-b-2 border-black underline">Instagram</a>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <form className="space-y-4" onSubmit={handleContactSubmit}>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1">Name (Required)</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#f3f4f6] border-2 border-black rounded-none py-2.5 px-4 text-xs font-bold text-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1">Phone Number (Required)</label>
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-[#f3f4f6] border-2 border-black rounded-none py-2.5 px-4 text-xs font-bold text-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1">Email (Optional)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#f3f4f6] border-2 border-black rounded-none py-2.5 px-4 text-xs font-bold text-black focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black uppercase tracking-wider text-black mb-1">Message (Optional)</label>
              <textarea
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[#f3f4f6] border-2 border-black rounded-none py-2.5 px-4 text-xs font-bold text-black resize-none focus:outline-none"
              />
            </div>
            <button type="submit" className="w-full bg-black hover:bg-zinc-800 text-white font-black py-3.5 px-4 text-xs uppercase tracking-widest border-2 border-black transition shadow-[4px_4px_0px_0px_rgba(236,72,153,1)]">
              Send to WhatsApp
            </button>
          </form>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="border-t-4 border-black bg-yellow-400 py-12 text-center text-xs font-black uppercase text-black">
        &copy; {new Date().getFullYear()} {data.hero.name}. System Terminated.
      </footer>
    </div>
  );
}
