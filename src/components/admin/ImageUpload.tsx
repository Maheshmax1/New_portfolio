"use client";

import { useState } from "react";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      onChange(data.url);
    } catch (err: any) {
      console.error("Upload error:", err);
      setError(err.message || "Something went wrong during upload");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onChange("");
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {label}
        </label>
      )}

      {value ? (
        <div className="relative w-40 h-40 rounded-2xl overflow-hidden border border-white/[0.08] group bg-[#111318]">
          {/* Using raw img element since local uploads might bypass Next.js hostname validation settings on domain whitelist */}
          <img
            src={value}
            alt="Uploaded Preview"
            className="w-full h-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg transition duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-white/[0.08] hover:border-blue-500/50 rounded-2xl cursor-pointer hover:bg-white/[0.01] transition duration-300">
            {loading ? (
              <div className="flex flex-col items-center space-y-2 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                <span className="text-sm">Uploading file...</span>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-2 text-slate-400">
                <Upload className="w-8 h-8 text-slate-500 group-hover:text-blue-400" />
                <span className="text-sm font-medium">Click to upload image</span>
                <span className="text-xs text-slate-600">JPG, PNG, GIF, WEBP up to 5MB</span>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={loading}
            />
          </label>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 font-medium mt-1">{error}</p>
      )}
    </div>
  );
}
