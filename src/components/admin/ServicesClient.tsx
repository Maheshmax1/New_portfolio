"use client";

import { useState } from "react";
import { Service } from "@/types";
import { saveService, deleteService } from "@/lib/actions/portfolio";
import { Plus, Edit2, Trash2, Loader2, Check, X, CheckSquare, AlertCircle } from "lucide-react";

interface ServicesClientProps {
  initialServices: Service[];
}

export default function ServicesClient({ initialServices }: ServicesClientProps) {
  const [services, setServices] = useState<Service[]>(initialServices);
  
  // Form State
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("Code");
  const [order, setOrder] = useState(0);
  const [status, setStatus] = useState(true);

  // Operations State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpenAdd = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setIcon("Code");
    setOrder(services.length + 1);
    setStatus(true);
    setError("");
    setIsOpen(true);
  };

  const handleOpenEdit = (service: Service) => {
    setEditingId(service.id);
    setTitle(service.title);
    setDescription(service.description);
    setIcon(service.icon);
    setOrder(service.order);
    setStatus(service.status);
    setError("");
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = {
        title,
        description,
        icon,
        order: Number(order),
        status,
      };

      const result = await saveService(editingId, data);
      
      // Update local state
      if (editingId) {
        setServices(prev =>
          prev.map(s => (s.id === editingId ? (result as unknown as Service) : s)).sort((a, b) => a.order - b.order)
        );
      } else {
        setServices(prev => [...prev, result as unknown as Service].sort((a, b) => a.order - b.order));
      }
      setIsOpen(false);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    
    setLoading(true);
    try {
      await deleteService(id);
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to delete service");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Trigger */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Services Catalog ({services.length})</h2>
        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition duration-200 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Service
        </button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div
            key={service.id}
            className={`backdrop-blur-xl bg-white/[0.02] border rounded-3xl p-6 transition duration-200 flex flex-col justify-between group ${
              service.status ? "border-white/[0.05]" : "border-red-500/20 bg-red-500/[0.01]"
            }`}
          >
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs uppercase">
                  {service.icon.substring(0, 3)}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/[0.05] text-slate-400 border border-white/[0.08]">
                    Order: {service.order}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      service.status
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                        : "bg-red-500/10 text-red-400 border border-red-500/20"
                    }`}
                  >
                    {service.status ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <h3 className="font-bold text-white text-md mb-2 group-hover:text-blue-400 transition-colors">
                {service.title}
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">
                {service.description}
              </p>
            </div>

            <div className="flex gap-2 border-t border-white/[0.04] pt-4 mt-auto">
              <button
                onClick={() => handleOpenEdit(service)}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.08] text-slate-300 transition duration-200"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="p-2 rounded-xl text-xs bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition duration-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {services.length === 0 && (
        <div className="text-center py-12 backdrop-blur-xl bg-white/[0.01] border border-white/[0.05] rounded-3xl text-slate-500">
          No services defined yet. Click "Add Service" to create one.
        </div>
      )}

      {/* CRUD Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0c0e14] border border-white/[0.08] rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/[0.05] pb-4">
              <h3 className="text-lg font-bold text-white">
                {editingId ? "Edit Service" : "Add Service"}
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
                  Service Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Frontend Engineering"
                  className="w-full bg-[#111318]/50 border border-white/[0.08] rounded-xl py-2.5 px-4 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Icon Name (Lucide)
                  </label>
                  <input
                    type="text"
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    required
                    placeholder="e.g. Code, Sparkles, Layout"
                    className="w-full bg-[#111318]/50 border border-white/[0.08] rounded-xl py-2.5 px-4 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(Number(e.target.value))}
                    required
                    className="w-full bg-[#111318]/50 border border-white/[0.08] rounded-xl py-2.5 px-4 text-white text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                  placeholder="Explain what the service entails..."
                  className="w-full bg-[#111318]/50 border border-white/[0.08] rounded-xl py-2.5 px-4 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center h-10 pt-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={status}
                    onChange={(e) => setStatus(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  <span className="ml-3 text-sm font-medium text-slate-300">
                    Active Catalog Status
                  </span>
                </label>
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
                  {editingId ? "Save Changes" : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
