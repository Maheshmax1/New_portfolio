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
  Terminal,
} from "lucide-react";
import { Github, Instagram, Whatsapp } from "../shared/BrandIcons";

interface ThemeProps {
  data: PortfolioData;
}

export default function DeveloperTheme({ data }: ThemeProps) {
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
  const userNameFirst = data.hero.name.split(" ")[0].toLowerCase();

  return (
    <div className="bg-[#0b0f19] text-[#39ff14] font-fira antialiased min-h-screen selection:bg-[#39ff14]/30 selection:text-white">
      {/* 1. Header */}
      <header className="sticky top-0 z-40 w-full bg-[#0b0f19]/90 border-b border-[#39ff14]/20 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <a href="#" className="font-bold text-sm flex items-center gap-2 hover:opacity-80 transition">
            <Terminal className="w-4 h-4" />
            <span>{userNameFirst}@localhost:~#</span>
          </a>
          <nav className="hidden md:flex items-center gap-6 text-xs text-[#888] font-bold">
            <a href="#about" className="hover:text-[#39ff14] transition">[01] About</a>
            <a href="#services" className="hover:text-[#39ff14] transition">[02] Services</a>
            <a href="#skills" className="hover:text-[#39ff14] transition">[03] Skills</a>
            <a href="#projects" className="hover:text-[#39ff14] transition">[04] Projects</a>
            <a href="#journey" className="hover:text-[#39ff14] transition">[05] Journey</a>
            <a href="#contact" className="hover:text-[#39ff14] transition">[06] Contact</a>
          </nav>
          <a
            href="#contact"
            className="text-[10px] font-bold border border-[#39ff14]/40 text-[#39ff14] px-4 py-2 hover:bg-[#39ff14]/10 transition"
          >
            ./connect.sh
          </a>
        </div>
      </header>

      {/* 2. Hero */}
      <section className="py-24 px-6 max-w-5xl mx-auto space-y-6">
        <div className="text-xs text-[#555] font-semibold">
          Last login: {new Date().toDateString()} on ttys001
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-[#888]">
            <span className="text-[#39ff14]">$</span> whoami
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
            {data.hero.name}: ~
            <br />
            <span className="text-[#39ff14]">
              <TypingEffect wordsString={data.hero.typingWords} />
            </span>
          </h1>
        </div>

        <div className="space-y-4 pt-4 border-l border-[#39ff14]/10 pl-6">
          <div className="flex items-center gap-2 text-xs text-[#888]">
            <span className="text-[#39ff14]">$</span> cat tagline.txt
          </div>
          <p className="text-sm md:text-base text-[#a0a5b5] leading-relaxed italic">
            "{data.hero.tagline}"
          </p>
          
          <div className="flex items-center gap-2 text-xs text-[#888] pt-4">
            <span className="text-[#39ff14]">$</span> cat biography.log
          </div>
          <p className="text-xs text-[#888] leading-relaxed max-w-2xl">
            {data.hero.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-4 pt-8">
          <a
            href="#contact"
            className="bg-[#39ff14]/10 hover:bg-[#39ff14]/20 border border-[#39ff14]/40 text-[#39ff14] font-bold py-3.5 px-6 rounded text-xs transition"
          >
            ./initialize_contact.sh
          </a>
        </div>
      </section>

      {/* 3. About */}
      <section id="about" className="py-20 px-6 max-w-5xl mx-auto border-t border-[#39ff14]/20 space-y-6">
        <div className="flex items-center gap-2 text-xs text-[#888]">
          <span className="text-[#39ff14]">$</span> ls -la ./profile_data/
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
          <div className="space-y-4">
            {/* Terminal Photo Frame */}
            <div className="w-full h-[400px] border border-[#39ff14]/20 bg-[#080b12] rounded p-2 flex items-center justify-center relative overflow-hidden">
              <div className="absolute top-2 left-3 flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                <span className="w-2 h-2 rounded-full bg-[#febc2e]" />
                <span className="w-2 h-2 rounded-full bg-[#27c93f]" />
              </div>
              <div className="w-full h-full pt-6">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={profileImageIndex}
                    src={profileImages[profileImageIndex]}
                    alt="Mahesh Profile"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover object-top grayscale opacity-80"
                  />
                </AnimatePresence>
              </div>
            </div>
            <div className="p-4 bg-[#080b12] border border-[#39ff14]/10 text-xs text-[#888] space-y-2">
              <div><span className="text-[#39ff14]">Total Exp:</span> {data.about.experienceYears} Year</div>
              <div><span className="text-[#39ff14]">Education:</span> {data.about.education}</div>
            </div>
            <p className="text-xs text-[#a0a5b5] leading-relaxed">{data.about.description}</p>
          </div>
          <div className="space-y-4">
            <div className="p-6 bg-[#080b12] border border-[#39ff14]/10 rounded">
              <span className="text-xs font-bold text-white block mb-2 uppercase tracking-widest">vision.sh</span>
              <p className="text-xs text-[#888] leading-relaxed">{data.about.vision}</p>
            </div>
            <div className="p-6 bg-[#080b12] border border-[#39ff14]/10 rounded">
              <span className="text-xs font-bold text-white block mb-2 uppercase tracking-widest">mission.sh</span>
              <p className="text-xs text-[#888] leading-relaxed">{data.about.mission}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Services */}
      <section id="services" className="py-20 px-6 max-w-5xl mx-auto border-t border-[#39ff14]/20 space-y-6">
        <div className="flex items-center gap-2 text-xs text-[#888]">
          <span className="text-[#39ff14]">$</span> cat ./capabilities.json
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {data.services.filter(s => s.status).map((service) => (
            <div key={service.id} className="p-6 bg-[#080b12] border border-[#39ff14]/10 rounded hover:border-[#39ff14]/30 transition">
              <h3 className="font-bold text-[#39ff14] mb-2 text-xs uppercase">[+] {service.title}</h3>
              <p className="text-xs text-[#888] leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Skills Section */}
      <section id="skills" className="py-20 px-6 max-w-5xl mx-auto border-t border-[#39ff14]/20 space-y-6">
        <div className="flex items-center gap-2 text-xs text-[#888]">
          <span className="text-[#39ff14]">$</span> ./list_dependencies.py --verbose
        </div>
        <div className="space-y-6 pt-4">
          {Array.from(new Set(data.skills.map(s => s.category))).map(cat => (
            <div key={cat} className="space-y-2">
              <span className="text-xs text-[#555] font-bold uppercase"># {cat}</span>
              <div className="flex flex-wrap gap-2">
                {data.skills.filter(s => s.category === cat).map((skill) => (
                  <span key={skill.id} className="text-xs bg-[#39ff14]/5 text-[#39ff14] border border-[#39ff14]/20 py-1 px-3 rounded">
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Projects */}
      <section id="projects" className="py-20 px-6 max-w-5xl mx-auto border-t border-[#39ff14]/20 space-y-6">
        <div className="flex items-center gap-2 text-xs text-[#888]">
          <span className="text-[#39ff14]">$</span> git log --oneline --projects
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          {displayedProjects.map((project) => (
            <div key={project.id} className="bg-[#080b12] border border-[#39ff14]/10 rounded p-6 flex flex-col justify-between">
              <div className="space-y-3">
                <h3 className="font-bold text-xs text-white uppercase">[COMMIT] {project.title}</h3>
                <p className="text-xs text-[#888] line-clamp-3 leading-relaxed">{project.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.technologies.split(",").map((tech) => (
                    <span key={tech} className="text-[10px] bg-[#39ff14]/5 text-[#39ff14] px-2 py-0.5 rounded border border-[#39ff14]/10">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-[#39ff14]/10 pt-4 mt-6">
                <span className="text-[10px] text-[#555] font-bold uppercase">{project.category}</span>
                <div className="flex gap-2">
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" className="text-[#39ff14] hover:opacity-75 transition">
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {data.projects.length > 3 && (
          <div className="flex justify-center pt-8">
            <button
              onClick={() => setShowAllProjects(!showAllProjects)}
              className="bg-[#080b12] border border-[#39ff14]/40 hover:bg-[#39ff14]/10 text-[#39ff14] font-bold py-3 px-6 rounded text-xs transition active:scale-95"
            >
              {showAllProjects ? "./hide_extra_commits.sh" : `./show_all_${data.projects.length}_commits.sh`}
            </button>
          </div>
        )}
      </section>

      {/* 7. Journey Timeline */}
      <section id="journey" className="py-20 px-6 max-w-5xl mx-auto border-t border-[#39ff14]/20 space-y-6">
        <div className="flex items-center gap-2 text-xs text-[#888]">
          <span className="text-[#39ff14]">$</span> cat ./milestones.log
        </div>
        <div className="space-y-4 pt-4 border-l border-[#39ff14]/10 pl-6">
          {data.workProcess.map((item) => (
            <div key={item.id} className="space-y-1 relative">
              <span className="text-[#39ff14] font-bold text-xs">
                [{item.order === 2027 ? "2026 - Present" : item.order === 2021 ? "2021 - 2023" : item.order === 2025 ? "2025 - 2026" : item.order}]
              </span>
              <h3 className="font-bold text-white text-xs uppercase inline-block ml-2">- {item.title}</h3>
              <p className="text-xs text-[#888] pl-16 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Contact */}
      <section id="contact" className="py-20 px-6 max-w-5xl mx-auto border-t border-[#39ff14]/20 space-y-6">
        <div className="flex items-center gap-2 text-xs text-[#888]">
          <span className="text-[#39ff14]">$</span> ./ping_server.sh
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-white uppercase">Contact Ports</h2>
            
            <div className="space-y-4 text-xs text-[#888] font-semibold pt-4">
              {data.contact.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#39ff14]" />
                  <a href={`mailto:${data.contact.email}`} className="text-slate-300 hover:text-white underline">{data.contact.email}</a>
                </div>
              )}
              {data.contact.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#39ff14]" />
                  <a href={`tel:${data.contact.phone}`} className="text-slate-300 hover:text-white underline">{data.contact.phone}</a>
                </div>
              )}
              {data.contact.github && (
                <div className="flex items-center gap-2">
                  <Github className="w-4 h-4 text-[#39ff14]" />
                  <a href={data.contact.github} target="_blank" className="text-slate-300 hover:text-white underline">GitHub</a>
                </div>
              )}
              {data.contact.whatsapp && (
                <div className="flex items-center gap-2">
                  <Whatsapp className="w-4 h-4 text-[#39ff14]" />
                  <a href={`https://wa.me/${data.contact.whatsapp}`} target="_blank" className="text-slate-300 hover:text-white underline">WhatsApp</a>
                </div>
              )}
              {data.contact.instagram && (
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-[#39ff14]" />
                  <a href={data.contact.instagram} target="_blank" className="text-slate-300 hover:text-white underline">Instagram</a>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#080b12] border border-[#39ff14]/10 rounded p-8">
            <form className="space-y-4" onSubmit={handleContactSubmit}>
              <div>
                <label className="block text-[10px] text-[#555] mb-1">Name (Required)</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0b0f19] border border-[#39ff14]/20 rounded py-2 px-3 text-xs text-[#39ff14] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#555] mb-1">Phone Number (Required)</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#0b0f19] border border-[#39ff14]/20 rounded py-2 px-3 text-xs text-[#39ff14] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#555] mb-1">Email Address (Optional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#0b0f19] border border-[#39ff14]/20 rounded py-2 px-3 text-xs text-[#39ff14] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#555] mb-1">Message (Optional)</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#0b0f19] border border-[#39ff14]/20 rounded py-2 px-3 text-xs text-[#39ff14] resize-none focus:outline-none"
                />
              </div>
              <button type="submit" className="w-full bg-[#39ff14]/10 border border-[#39ff14]/40 hover:bg-[#39ff14]/25 text-[#39ff14] font-bold py-3 px-4 rounded text-xs transition">
                Execute Transmission
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="border-t border-[#39ff14]/10 py-8 text-center text-[10px] text-[#555]">
        &copy; {new Date().getFullYear()} {data.hero.name}. Program exited.
      </footer>
    </div>
  );
}
