"use client";

import { useState, useEffect } from "react";
import { PortfolioData } from "@/types";
import TypingEffect from "../shared/TypingEffect";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code,
  Sparkles,
  Layout,
  Zap,
  ArrowRight,
  ExternalLink,
  Mail,
  Phone,
  Check,
  ChevronDown,
  Info,
  Calendar,
  Layers,
  GraduationCap,
  Briefcase,
  BookOpen,
  Bike
} from "lucide-react";
import { Github, Instagram, Whatsapp } from "../shared/BrandIcons";

interface ThemeProps {
  data: PortfolioData;
}

export default function AppleTheme({ data }: ThemeProps) {
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const displayedProjects = showAllProjects ? data.projects : data.projects.slice(0, 3);

  return (
    <div className="bg-[#f5f5f7] text-[#1d1d1f] font-sans antialiased min-h-screen selection:bg-blue-100">
      {/* 1. Navbar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-zinc-200/30">
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
          <a href="#" className="text-sm font-extrabold tracking-tight text-black flex items-center gap-1.5">
            <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px]">M</span>
            {data.settings.websiteName}
          </a>
          <nav className="hidden md:flex items-center gap-6 text-[11px] font-bold text-zinc-500 uppercase tracking-widest">
            <a href="#about" className="hover:text-black transition">About</a>
            <a href="#services" className="hover:text-black transition">Services</a>
            <a href="#projects" className="hover:text-black transition">Projects</a>
            <a href="#journey" className="hover:text-black transition">Journey</a>
            <a href="#faq" className="hover:text-black transition">FAQs</a>
            <a href="#contact" className="hover:text-black transition">Contact</a>
          </nav>
          <a
            href="#contact"
            className="text-[11px] font-bold bg-[#1d1d1f] text-white px-3.5 py-1.5 rounded-full hover:bg-zinc-800 transition"
          >
            Hire Me
          </a>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 px-6 max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="flex-1 space-y-6"
        >
          <motion.div variants={itemVariants} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-200/50 border border-zinc-300/30 text-xs font-semibold text-[#86868b]">
            <Sparkles className="w-3.5 h-3.5 text-yellow-600 animate-pulse" />
            Active and Available
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-black tracking-tight text-[#1d1d1f] leading-none">
            I am <span className="text-zinc-600">{data.hero.name}</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              <TypingEffect wordsString={data.hero.typingWords} />
            </span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-xl font-bold tracking-tight text-[#515154]">
            {data.hero.tagline}
          </motion.p>
          <motion.p variants={itemVariants} className="text-sm md:text-base text-[#86868b] leading-relaxed max-w-lg">
            {data.hero.description}
          </motion.p>
          <motion.div variants={itemVariants} className="flex flex-wrap gap-3 pt-4">
            <a
              href="#contact"
              className="bg-[#0071e3] text-white font-semibold py-3 px-6 rounded-full text-sm hover:bg-[#0077ed] transition shadow-md shadow-blue-500/10 flex items-center gap-1.5 active:scale-95"
            >
              Get In Touch
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full md:w-[400px] h-[400px] rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/50 bg-white relative"
        >
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
        </motion.div>
      </section>

      {/* 3. About Section */}
      <section id="about" className="py-20 bg-white border-t border-zinc-200/30">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="w-full h-[500px] rounded-3xl overflow-hidden shadow-xl border border-zinc-100 bg-[#f5f5f7] relative">
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
          <div className="space-y-6">
            <span className="text-xs font-bold text-[#0071e3] uppercase tracking-widest block">About Me</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1d1d1f]">
              Resilient Fullstack Developer
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              {data.about.description}
            </p>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-[#f5f5f7] border border-zinc-200/40">
                <span className="text-xs font-bold text-zinc-400 block mb-2 uppercase tracking-wide">My Mission</span>
                <p className="text-xs text-zinc-600 leading-relaxed">{data.about.mission}</p>
              </div>
              <div className="p-5 rounded-2xl bg-[#f5f5f7] border border-zinc-200/40">
                <span className="text-xs font-bold text-zinc-400 block mb-2 uppercase tracking-wide">My Vision</span>
                <p className="text-xs text-zinc-600 leading-relaxed">{data.about.vision}</p>
              </div>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-zinc-100">
              <div>
                <span className="text-4xl font-black text-black">{data.about.experienceYears}+</span>
                <span className="text-xs text-zinc-400 block uppercase tracking-wider font-semibold">Years Exp</span>
              </div>
              <div>
                <span className="text-xs font-bold text-zinc-500 block uppercase tracking-wider">Education</span>
                <span className="text-xs text-zinc-700 font-semibold leading-relaxed">{data.about.education}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Services Section */}
      <section id="services" className="py-20 bg-[#f5f5f7] border-t border-zinc-200/30">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#0071e3] uppercase tracking-widest">Capabilities</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1d1d1f]">
              Engineering web results.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {data.services.map((serv) => (
              <div key={serv.id} className="bg-white border border-zinc-200/40 rounded-3xl p-6 shadow-sm hover:shadow-md transition duration-300 space-y-4">
                <div className="w-10 h-10 rounded-full bg-[#f5f5f7] flex items-center justify-center border border-zinc-200/30">
                  <Layers className="w-4 h-4 text-[#0071e3]" />
                </div>
                <h3 className="font-extrabold text-sm text-[#1d1d1f]">{serv.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{serv.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Skills Grid */}
      <section className="py-20 bg-white border-t border-zinc-200/30">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-3">
            <span className="text-xs font-bold text-[#0071e3] uppercase tracking-widest">My Tools</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1d1d1f]">
              Skillset & Artificial Intelligence
            </h2>
          </div>

          <div className="space-y-10">
            {/* Group Skills by Category */}
            {Array.from(new Set(data.skills.map(s => s.category))).map(cat => (
              <div key={cat} className="space-y-4">
                <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-400 border-b border-zinc-100 pb-2">{cat}</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {data.skills.filter(s => s.category === cat).map((skill) => (
                    <div key={skill.id} className="bg-[#f5f5f7] border border-zinc-200/30 rounded-2xl p-4 flex items-center justify-center text-center">
                      <span className="text-xs font-bold text-[#1d1d1f]">{skill.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Selected Case Studies */}
      <section id="projects" className="py-20 bg-[#f5f5f7] border-t border-zinc-200/30">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[#0071e3] uppercase tracking-widest block">Works</span>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1d1d1f]">
                Selected Case Studies
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {displayedProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white border border-zinc-200/40 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col"
              >
                <div className="h-48 w-full bg-[#f5f5f7] overflow-hidden relative">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-widest bg-white/80 border border-zinc-200/30 backdrop-blur-sm py-1 px-3 rounded-full text-zinc-800">
                    {project.category}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-base text-[#1d1d1f] mb-2">{project.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{project.description}</p>
                    <div className="flex flex-wrap gap-1 pt-3">
                      {project.technologies.split(",").map((tech) => (
                        <span key={tech} className="text-[9px] font-bold bg-[#f5f5f7] text-[#86868b] px-2 py-0.5 rounded border border-zinc-200/30">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-zinc-100 pt-4 mt-auto">
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">{project.completionDate}</span>
                    <div className="flex gap-2">
                      {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" className="p-2 rounded-full bg-[#f5f5f7] text-zinc-500 hover:text-black border border-zinc-200/30">
                          <Github className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a href={project.liveUrl} target="_blank" className="p-2 rounded-full bg-[#f5f5f7] text-zinc-500 hover:text-black border border-zinc-200/30">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {data.projects.length > 3 && (
            <div className="flex justify-center mt-10">
              <button
                onClick={() => setShowAllProjects(!showAllProjects)}
                className="px-6 py-3 rounded-full border border-zinc-300 bg-white text-zinc-700 font-semibold text-xs hover:bg-zinc-50 hover:shadow transition duration-200 active:scale-95"
              >
                {showAllProjects ? "Show Main Projects Only" : `Show All ${data.projects.length} Projects`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 7. Achievements Section */}
      <section className="py-20 bg-white border-t border-zinc-200/30">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {data.achievements.map((item) => (
            <div key={item.id} className="text-center space-y-2">
              <span className="text-4xl md:text-5xl font-black text-black block tracking-tight">
                {item.counter}+
              </span>
              <span className="text-xs text-zinc-400 uppercase tracking-widest block font-bold">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 8. Journey Timeline */}
      <section id="journey" className="py-20 bg-[#f5f5f7] border-t border-zinc-200/30">
        <div className="max-w-3xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-[#0071e3] uppercase tracking-widest block">Biography</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#1d1d1f]">
              My Path & Milestones
            </h2>
          </div>

          <div className="relative border-l border-zinc-300 ml-4 md:ml-8 space-y-10 py-4">
            {data.workProcess.map((item) => (
              <div key={item.id} className="relative pl-8 md:pl-10">
                {/* Timeline node */}
                <div className="absolute -left-[13px] top-1.5 w-6 h-6 rounded-full border-4 border-white bg-[#0071e3] shadow-sm flex items-center justify-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <div className="bg-white border border-zinc-200/50 rounded-2xl p-6 shadow-sm space-y-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#0071e3] bg-blue-50 px-2 py-0.5 rounded">
                    {item.order === 2027 ? "2026 - Present" : item.order === 2021 ? "2021 - 2023" : item.order === 2025 ? "2025 - 2026" : item.order}
                  </span>
                  <h3 className="font-bold text-sm text-[#1d1d1f]">{item.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. FAQs Section */}
      <section id="faq" className="py-20 bg-white border-t border-zinc-200/30">
        <div className="max-w-3xl mx-auto px-6 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold text-[#0071e3] uppercase tracking-widest block">Support</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-[#1d1d1f]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {data.faqs.map((faq) => {
              const isOpen = activeFaq === faq.id;

              return (
                <div
                  key={faq.id}
                  className="border border-zinc-200/50 rounded-2xl overflow-hidden bg-[#f5f5f7]/30 transition"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm font-bold text-[#1d1d1f]"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-zinc-200/20 text-xs text-slate-500 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 12. Contact Section */}
      <section id="contact" className="py-20 bg-[#f5f5f7] border-t border-zinc-200/30">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <span className="text-xs font-bold text-[#0071e3] uppercase tracking-widest block">Connect</span>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#1d1d1f]">
              Reach Out Ports
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-md">
              Let's build something awesome. Feel free to call, email, or fill out the form to ping me directly on WhatsApp.
            </p>

            <div className="space-y-4 text-xs font-bold uppercase tracking-wider pt-6">
              {data.contact.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-zinc-400" />
                  <a href={`mailto:${data.contact.email}`} className="text-zinc-800 hover:text-black underline">{data.contact.email}</a>
                </div>
              )}
              {data.contact.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-zinc-400" />
                  <a href={`tel:${data.contact.phone}`} className="text-zinc-800 hover:text-black underline">{data.contact.phone}</a>
                </div>
              )}
            </div>

            {data.contact.mapIframe && (
              <div className="h-64 rounded-3xl overflow-hidden border border-zinc-200/50 shadow-sm mt-8">
                <div dangerouslySetInnerHTML={{ __html: data.contact.mapIframe }} className="w-full h-full" />
              </div>
            )}
          </div>

          <div className="bg-white border border-zinc-200/40 rounded-3xl p-8 shadow-sm">
            <h3 className="font-bold text-lg text-black mb-6">Send a Message (WhatsApp Link)</h3>
            <form className="space-y-4" onSubmit={handleContactSubmit}>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Your Name (Required)</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-zinc-200/20 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Phone Number (Required)</label>
                <input
                  required
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-zinc-200/20 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Email Address (Optional)</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-zinc-200/20 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Your Message (Optional)</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#f5f5f7] border border-zinc-200/20 rounded-xl py-2.5 px-4 text-xs focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-4 rounded-xl text-xs transition duration-200 active:scale-95">
                Send to WhatsApp
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 13. Footer */}
      <footer className="bg-white border-t border-zinc-200/30 py-12">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
            &copy; {new Date().getFullYear()} {data.hero.name}. All Rights Reserved.
          </span>
          <div className="flex gap-3">
            {data.contact.github && (
              <a href={data.contact.github} target="_blank" className="p-2 rounded-full bg-[#f5f5f7] text-zinc-500 hover:text-black border border-zinc-200/30">
                <Github className="w-4 h-4" />
              </a>
            )}
            {data.contact.whatsapp && (
              <a href={`https://wa.me/${data.contact.whatsapp}`} target="_blank" className="p-2 rounded-full bg-[#f5f5f7] text-zinc-500 hover:text-black border border-zinc-200/30">
                <Whatsapp className="w-4 h-4" />
              </a>
            )}
            {data.contact.instagram && (
              <a href={data.contact.instagram} target="_blank" className="p-2 rounded-full bg-[#f5f5f7] text-zinc-500 hover:text-black border border-zinc-200/30">
                <Instagram className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}
