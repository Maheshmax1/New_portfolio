"use client";

import { useState } from "react";
import { Skill } from "@/types";
import { saveSkill, deleteSkill } from "@/lib/actions/portfolio";
import { Plus, Edit2, Trash2, Loader2, X, AlertCircle } from "lucide-react";

interface SkillsClientProps {
  initialSkills: Skill[];
}

export default function SkillsClient({ initialSkills }: SkillsClientProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  
  // Form State
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [percentage, setPercentage] = useState(80);
  const [category, setCategory] = useState("Frontend");
  const [color, setColor] = useState("#3b82f6");

  // Ops State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpenAdd = () => {
    setEditingId(null);
    setName("");
    setPercentage(80);
    setCategory("Frontend");
    setColor("#3b82f6");
    setError("");
    setIsOpen(true);
  };

  const handleOpenEdit = (skill: Skill) => {
    setEditingId(skill.id);
    setName(skill.name);
    setPercentage(skill.percentage);
    setCategory(skill.category);
    setColor(skill.color);
    setError("");
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = {
        name,
        percentage: Number(percentage),
        category,
        color,
      };

      const result = await saveSkill(editingId, data);
      
      if (editingId) {
        setSkills(prev =>
          prev.map(s => (s.id === editingId ? (result as unknown as Skill) : s)).sort((a, b) => b.percentage - a.percentage)
        );
      } else {
        setSkills(prev => [...prev, result as unknown as Skill].sort((a, b) => b.percentage - a.percentage));
      }
      setIsOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save skill");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    
    setLoading(true);
    try {
      await deleteSkill(id);
      setSkills(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete skill");
    } finally {
      setLoading(false);
    }
  };

  // Group skills by category
  const categories = Array.from(new Set(skills.map(s => s.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Skills Matrix ({skills.length})</h2>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition duration-200 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Skill
        </button>
      </div>

      {/* Skills Categories Display */}
      {categories.map((cat) => (
        <div key={cat} className="backdrop-blur-xl bg-white/[0.01] border border-white/[0.05] rounded-3xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-white/[0.04] pb-2">
            {cat}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills
              .filter(s => s.category === cat)
              .map(skill => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] hover:bg-white/[0.04] transition duration-200"
                >
                  <div className="flex-1 mr-4">
                    <div className="flex items-center justify-between text-sm font-semibold mb-2">
                      <span className="text-white">{skill.name}</span>
                      <span style={{ color: skill.color }}>{skill.percentage}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-2 bg-white/[0.08] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${skill.percentage}%`,
                          backgroundColor: skill.color,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenEdit(skill)}
                      className="p-2 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-300 hover:text-white transition duration-200"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition duration-200"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      ))}

      {skills.length === 0 && (
        <div className="text-center py-12 backdrop-blur-xl bg-white/[0.01] border border-white/[0.05] rounded-3xl text-slate-500">
          No skills configured. Click "Add Skill" to create one.
        </div>
      )}

      {/* Add/Edit Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0c0e14] border border-white/[0.08] rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingId ? "Edit Skill" : "Add Skill"}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg bg-white/[0.03] border border-white/[0.08] text-slate-400 hover:text-white transition duration-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Skill Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="e.g. Next.js"
                  className="w-full bg-[#111318]/50 border border-white/[0.08] rounded-xl py-2.5 px-4 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Proficiency Category
                  </label>
                  <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    required
                    placeholder="Frontend, Backend..."
                    className="w-full bg-[#111318]/50 border border-white/[0.08] rounded-xl py-2.5 px-4 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Visual Accent Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-10 h-10 bg-transparent border-0 cursor-pointer rounded overflow-hidden"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="flex-1 bg-[#111318]/50 border border-white/[0.08] rounded-xl px-2 text-center text-white text-sm focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Proficiency Percentage ({percentage}%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
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
                  {editingId ? "Save Changes" : "Create Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
