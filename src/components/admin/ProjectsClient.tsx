"use client";

import { useState } from "react";
import { Project } from "@/types";
import { saveProject, deleteProject } from "@/lib/actions/portfolio";
import { Plus, Edit2, Trash2, Loader2, X, AlertCircle, ExternalLink } from "lucide-react";
import { Github } from "../shared/BrandIcons";
import ImageUpload from "@/components/admin/ImageUpload";

interface ProjectsClientProps {
  initialProjects: Project[];
}

export default function ProjectsClient({ initialProjects }: ProjectsClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  
  // Form State
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [technologies, setTechnologies] = useState("");
  const [features, setFeatures] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [githubUrl, setGithubUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [client, setClient] = useState("");
  const [completionDate, setCompletionDate] = useState("");

  // Ops State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setImage("");
    setTechnologies("");
    setFeatures("");
    setCategory("Web Development");
    setGithubUrl("");
    setLiveUrl("");
    setClient("");
    setCompletionDate("");
    setError("");
    setIsOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingId(project.id);
    setTitle(project.title);
    setDescription(project.description);
    setImage(project.image);
    setTechnologies(project.technologies);
    setFeatures(project.features);
    setCategory(project.category);
    setGithubUrl(project.githubUrl || "");
    setLiveUrl(project.liveUrl || "");
    setClient(project.client || "");
    setCompletionDate(project.completionDate || "");
    setError("");
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setError("Please upload a cover image.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = {
        title,
        description,
        image,
        technologies,
        features,
        category,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        client: client || null,
        completionDate: completionDate || null,
      };

      const result = await saveProject(editingId, data);
      
      if (editingId) {
        setProjects(prev =>
          prev.map(p => (p.id === editingId ? (result as unknown as Project) : p))
        );
      } else {
        setProjects(prev => [...prev, result as unknown as Project]);
      }
      setIsOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save project");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    
    setLoading(true);
    try {
      await deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Projects Catalog ({projects.length})</h2>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition duration-200 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.05] hover:border-white/[0.12] rounded-3xl overflow-hidden flex flex-col group transition duration-300"
          >
            {/* Project Image banner */}
            <div className="relative h-48 w-full bg-[#111318] overflow-hidden">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-4 left-4 text-xs font-bold px-3 py-1 rounded-full bg-black/60 text-blue-400 border border-white/[0.08] backdrop-blur-sm">
                {project.category}
              </span>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                  {project.description}
                </p>
                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.technologies.split(",").map((tech) => (
                    <span
                      key={tech}
                      className="text-[10px] font-medium px-2 py-0.5 rounded bg-white/[0.05] border border-white/[0.08] text-slate-300"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action row */}
              <div className="flex items-center justify-between border-t border-white/[0.04] pt-4 mt-auto">
                <div className="flex items-center gap-2">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-slate-400 hover:text-white transition duration-200"
                      title="GitHub Repository"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      className="p-2 rounded-lg bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] text-slate-400 hover:text-white transition duration-200"
                      title="Live Preview"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(project)}
                    className="flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-slate-300 transition duration-200"
                  >
                    <Edit2 className="w-3 h-3" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12 backdrop-blur-xl bg-white/[0.01] border border-white/[0.05] rounded-3xl text-slate-500">
          No projects configured. Click "Add Project" to register one.
        </div>
      )}

      {/* Add/Edit Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl bg-[#0c0e14] border border-white/[0.08] rounded-3xl p-6 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingId ? "Edit Project" : "Add Project"}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white transition duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Acme Dashboard Portal"
                    className="w-full bg-[#111318]/50 border border-white/[0.08] rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Category Group
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    placeholder="e.g. E-Commerce, SaaS App"
                    className="w-full bg-[#111318]/50 border border-white/[0.08] rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Technologies (Comma separated)
                </label>
                <input
                  type="text"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                  required
                  placeholder="Next.js, Tailwind CSS, Framer Motion"
                  className="w-full bg-[#111318]/50 border border-white/[0.08] rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImageUpload label="Cover Image" value={image} onChange={setImage} />
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Client Name
                    </label>
                    <input
                      type="text"
                      value={client}
                      onChange={(e) => setClient(e.target.value)}
                      placeholder="e.g. Starlight Inc"
                      className="w-full bg-[#111318]/50 border border-white/[0.08] rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                      Completion Date
                    </label>
                    <input
                      type="text"
                      value={completionDate}
                      onChange={(e) => setCompletionDate(e.target.value)}
                      placeholder="e.g. December 2025"
                      className="w-full bg-[#111318]/50 border border-white/[0.08] rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    GitHub Code Repository URL
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full bg-[#111318]/50 border border-white/[0.08] rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Live Demo Link
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-[#111318]/50 border border-white/[0.08] rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Project Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={3}
                  placeholder="Outline the scope and background of the project..."
                  className="w-full bg-[#111318]/50 border border-white/[0.08] rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Project Features (One per line)
                </label>
                <textarea
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                  rows={3}
                  className="w-full bg-[#111318]/50 border border-white/[0.08] rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl p-3 text-center flex items-center justify-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <div className="flex justify-end gap-2 border-t border-white/[0.05] pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="py-2.5 px-5 rounded-xl text-sm font-semibold bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-slate-400 hover:text-white transition duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-5 rounded-xl text-sm transition duration-200 flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingId ? "Save Changes" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
