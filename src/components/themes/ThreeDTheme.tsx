"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import { PortfolioData, Project, Service, WorkProcess } from "@/types";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Disc,
  RotateCw,
  Sparkles,
  ExternalLink,
  Cpu,
  Zap,
  Sliders,
  Headphones,
  Radio,
  Send,
  Check,
  ArrowRight,
  ChevronRight,
  Layers,
  Flame,
  Terminal,
} from "lucide-react";
import { Github, Instagram, Whatsapp } from "../shared/BrandIcons";

interface ThemeProps {
  data: PortfolioData;
}

export default function ThreeDTheme({ data }: ThemeProps) {
  // Audio state
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [isPlayingLoFi, setIsPlayingLoFi] = useState(false);
  const [activeSide, setActiveSide] = useState<"A" | "B">("A");
  const [activeFaq, setActiveFaq] = useState<string | null>(null);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);

  // Web Audio Context & Nodes refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const vinylNoiseNodeRef = useRef<AudioNode | null>(null);
  const loFiIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Canvas refs
  const threeMountRef = useRef<HTMLDivElement>(null);
  const vinylDiscMeshRef = useRef<THREE.Group | null>(null);
  const toneArmRef = useRef<THREE.Group | null>(null);
  const isDraggingRef = useRef(false);
  const prevMouseXRef = useRef(0);
  const spinSpeedRef = useRef(0.015);
  const targetRotationYRef = useRef(0);
  const vinylRotationXRef = useRef(0.45); // slight tilt forward

  // 1. Initialize Web Audio Synthesizer (Zero external audio file dependencies!)
  const initAudio = () => {
    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      return;
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Create Analog Vinyl Surface Crackle / Pink Noise
      const bufferSize = ctx.sampleRate * 2;
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.04;
        b6 = white * 0.115926;
        // Occasional vinyl pop crackle
        if (Math.random() < 0.0008) {
          output[i] += (Math.random() - 0.5) * 0.45;
        }
      }

      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 850;
      filter.Q.value = 1.2;

      const gain = ctx.createGain();
      gain.gain.value = 0.08;

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      whiteNoise.start(0);

      vinylNoiseNodeRef.current = gain;
    } catch (e) {
      console.warn("Web Audio not supported or blocked", e);
    }
  };

  // Play DJ scratch sound impulse
  const playScratchSound = (speed: number) => {
    if (!audioCtxRef.current || !soundEnabled) return;
    try {
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = "sawtooth";
      const baseFreq = Math.min(Math.max(Math.abs(speed) * 600, 120), 1200);
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.4, now + 0.12);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.13);
    } catch {
      // ignore
    }
  };

  // Toggle Lo-Fi chill ambient synthesizer
  const toggleLoFi = () => {
    initAudio();
    if (isPlayingLoFi) {
      if (loFiIntervalRef.current) clearInterval(loFiIntervalRef.current);
      setIsPlayingLoFi(false);
    } else {
      setIsPlayingLoFi(true);
      setSoundEnabled(true);
      startLoFiBeat();
    }
  };

  const startLoFiBeat = () => {
    if (!audioCtxRef.current) return;
    const chords = [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 392.0],  // Am7
      [174.61, 220.0, 261.63, 329.63], // Fmaj7
      [196.0, 246.94, 293.66, 349.23], // G7
    ];
    let step = 0;

    loFiIntervalRef.current = setInterval(() => {
      if (!audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;
      const chord = chords[step % chords.length];

      // Play soft rhodes pad
      chord.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.015, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.03);
        osc.stop(now + 1.9);
      });

      // Soft kick pulse on beat 0 and 2
      const kickOsc = ctx.createOscillator();
      const kickGain = ctx.createGain();
      kickOsc.frequency.setValueAtTime(110, now);
      kickOsc.frequency.exponentialRampToValueAtTime(35, now + 0.25);
      kickGain.gain.setValueAtTime(0.09, now);
      kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      kickOsc.connect(kickGain);
      kickGain.connect(ctx.destination);
      kickOsc.start(now);
      kickOsc.stop(now + 0.26);

      step++;
    }, 2000);
  };

  useEffect(() => {
    return () => {
      if (loFiIntervalRef.current) clearInterval(loFiIntervalRef.current);
      if (audioCtxRef.current) audioCtxRef.current.close().catch(() => {});
    };
  }, []);

  // 2. Interactive Three.js 3D Vinyl Turntable Scene
  useEffect(() => {
    const mount = threeMountRef.current;
    if (!mount) return;

    // Dimensions
    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    camera.position.set(0, 5.2, 7.5);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // Lighting (Warm neon cyberpunk dubplate studio lighting)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const redLight = new THREE.PointLight(0xff0044, 4, 15);
    redLight.position.set(-4, 3, 3);
    scene.add(redLight);

    const cyanLight = new THREE.PointLight(0x00f0ff, 4, 15);
    cyanLight.position.set(4, 3, -2);
    scene.add(cyanLight);

    const topSpot = new THREE.SpotLight(0xffeedd, 3.5, 20, Math.PI / 4, 0.3);
    topSpot.position.set(0, 8, 2);
    scene.add(topSpot);

    // Master Turntable Group
    const turntableGroup = new THREE.Group();
    scene.add(turntableGroup);

    // Turntable Deck Platter Base (Brushed Black Anodized Aluminium)
    const baseGeo = new THREE.BoxGeometry(7.2, 0.4, 6.2);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x111111,
      roughness: 0.35,
      metalness: 0.85,
    });
    const deckBase = new THREE.Mesh(baseGeo, baseMat);
    deckBase.position.y = -0.3;
    turntableGroup.add(deckBase);

    // Metal rim around platter
    const platterRingGeo = new THREE.CylinderGeometry(2.65, 2.65, 0.2, 64);
    const platterRingMat = new THREE.MeshStandardMaterial({
      color: 0x888888,
      metalness: 0.95,
      roughness: 0.15,
    });
    const platterRing = new THREE.Mesh(platterRingGeo, platterRingMat);
    platterRing.position.set(-0.6, -0.05, 0);
    turntableGroup.add(platterRing);

    // 3D VINYL DISC GROUP
    const vinylGroup = new THREE.Group();
    vinylGroup.position.set(-0.6, 0.08, 0);
    turntableGroup.add(vinylGroup);
    vinylDiscMeshRef.current = vinylGroup;

    // A) Procedural Vinyl Record Texture with Realistic Grooves
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d")!;

    // Black vinyl surface base
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, 1024, 1024);

    // Concentric micro-groove tracks
    ctx.lineWidth = 1.2;
    for (let r = 180; r < 500; r += 2.5) {
      const alpha = 0.12 + Math.sin(r * 0.4) * 0.08;
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(512, 512, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Lead-out runout groove area
    ctx.lineWidth = 3;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    ctx.beginPath();
    ctx.arc(512, 512, 195, 0, Math.PI * 2);
    ctx.stroke();

    // Center Label Sticker: Graphic Artwork
    ctx.save();
    ctx.beginPath();
    ctx.arc(512, 512, 160, 0, Math.PI * 2);
    ctx.fillStyle = "#ff1744"; // Akira Red Center Label
    ctx.fill();
    ctx.lineWidth = 6;
    ctx.strokeStyle = "#ffe600"; // Yellow border
    ctx.stroke();

    // Center Label typography
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "bold 28px 'Geist', monospace, sans-serif";
    ctx.fillText("MIND OF MAHESH", 512, 440);

    ctx.font = "900 18px monospace";
    ctx.fillStyle = "#ffe600";
    ctx.fillText("SIDE A // 33 ⅓ RPM", 512, 470);

    ctx.font = "bold 14px monospace";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("STEREO DUBPLATE // CHENNAI", 512, 550);

    ctx.font = "900 12px monospace";
    ctx.fillStyle = "rgba(255,255,255,0.8)";
    ctx.fillText("マヘシュ・マリアッパン", 512, 580);

    // Center Spindle Hole
    ctx.beginPath();
    ctx.arc(512, 512, 22, 0, Math.PI * 2);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.restore();

    const vinylTexture = new THREE.CanvasTexture(canvas);
    vinylTexture.wrapS = THREE.RepeatWrapping;
    vinylTexture.wrapT = THREE.RepeatWrapping;

    // Vinyl Disc 3D Geometry
    const vinylGeo = new THREE.CylinderGeometry(2.55, 2.55, 0.04, 64);
    const vinylMat = new THREE.MeshStandardMaterial({
      map: vinylTexture,
      roughness: 0.2,
      metalness: 0.6,
      bumpMap: vinylTexture,
      bumpScale: 0.002,
    });
    const vinylMesh = new THREE.Mesh(vinylGeo, vinylMat);
    vinylGroup.add(vinylMesh);

    // Chrome Center Spindle Pin
    const spindleGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.35, 32);
    const spindleMat = new THREE.MeshStandardMaterial({
      color: 0xdddddd,
      metalness: 0.98,
      roughness: 0.05,
    });
    const spindle = new THREE.Mesh(spindleGeo, spindleMat);
    spindle.position.y = 0.12;
    vinylGroup.add(spindle);

    // Tonearm Pivot & Arm
    const tonearmGroup = new THREE.Group();
    tonearmGroup.position.set(2.4, 0.2, -1.6);
    turntableGroup.add(tonearmGroup);
    toneArmRef.current = tonearmGroup;

    // Tonearm Base
    const armBaseGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.35, 32);
    const armBaseMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.9, roughness: 0.2 });
    const armBase = new THREE.Mesh(armBaseGeo, armBaseMat);
    tonearmGroup.add(armBase);

    // Tonearm Rod (S-shaped or curved slightly toward vinyl)
    const armRodGeo = new THREE.CylinderGeometry(0.04, 0.04, 3.2, 16);
    const armRodMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.95, roughness: 0.1 });
    const armRod = new THREE.Mesh(armRodGeo, armRodMat);
    armRod.rotation.z = Math.PI / 2 - 0.15;
    armRod.rotation.y = 0.55;
    armRod.position.set(-1.2, 0.25, 1.1);
    tonearmGroup.add(armRod);

    // Tonearm Cartridge / Headshell (Stylus needle on vinyl)
    const headshellGeo = new THREE.BoxGeometry(0.18, 0.12, 0.35);
    const headshellMat = new THREE.MeshStandardMaterial({ color: 0xff0044, metalness: 0.7, roughness: 0.3 });
    const headshell = new THREE.Mesh(headshellGeo, headshellMat);
    headshell.position.set(-2.55, 0.12, 2.2);
    tonearmGroup.add(headshell);

    // Subtle background float particles (floating dust / vinyl shimmer)
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 120;
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 16;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xff0055,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Interaction (Scratch & Parallax)
    let isMouseDown = false;
    let lastX = 0;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      isMouseDown = true;
      isDraggingRef.current = true;
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      lastX = clientX;
      prevMouseXRef.current = clientX;
      initAudio();
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

      // Mouse Parallax on Turntable
      const normX = (clientX / window.innerWidth) * 2 - 1;
      const normY = -(clientY / window.innerHeight) * 2 + 1;
      turntableGroup.rotation.y = normX * 0.18;
      turntableGroup.rotation.x = normY * 0.12 + 0.1;

      // Scratching if dragged
      if (isMouseDown && vinylDiscMeshRef.current) {
        const deltaX = clientX - lastX;
        lastX = clientX;
        const scratchDelta = deltaX * 0.015;
        vinylDiscMeshRef.current.rotation.y += scratchDelta;
        playScratchSound(scratchDelta);
      }
    };

    const handlePointerUp = () => {
      isMouseDown = false;
      isDraggingRef.current = false;
    };

    const domEl = renderer.domElement;
    domEl.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);

    domEl.addEventListener("touchstart", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handlePointerMove, { passive: true });
    window.addEventListener("touchend", handlePointerUp);

    // Animation Render Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Auto-spin if not scratching
      if (vinylDiscMeshRef.current && !isDraggingRef.current) {
        vinylDiscMeshRef.current.rotation.y += spinSpeedRef.current;
      }

      // Smooth flip transition for Side A / Side B
      if (vinylDiscMeshRef.current) {
        vinylDiscMeshRef.current.rotation.z = THREE.MathUtils.lerp(
          vinylDiscMeshRef.current.rotation.z,
          targetRotationYRef.current,
          0.08
        );
      }

      // Particle floating
      particles.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      if (!mount) return;
      const newW = mount.clientWidth;
      const newH = mount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      domEl.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      domEl.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
      cancelAnimationFrame(animationFrameId);
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  // Handle Flip Record (Side A <-> Side B)
  const flipRecord = (side: "A" | "B") => {
    setActiveSide(side);
    initAudio();
    playScratchSound(0.08);
    if (side === "B") {
      targetRotationYRef.current = Math.PI; // Flip 180 degrees
    } else {
      targetRotationYRef.current = 0;
    }
  };

  const getAssetPath = (path: string) => {
    if (!path) return "/profile.jpg";
    if (path.startsWith("http") || path.startsWith("data:")) return path;
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    return `${basePath}${path.startsWith("/") ? "" : "/"}${path}`;
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert("Please provide your Name and Phone Number.");
      return;
    }
    const waText = `*VIP STUDIO INQUIRY [3D DUBPLATE]*\n\n- *Name:* ${formData.name}\n- *Phone:* ${formData.phone}\n- *Email:* ${formData.email || "N/A"}\n- *Message:* ${formData.message || "Hi Mahesh, I explored your 3D Akira portfolio and would love to collaborate!"}`;
    const waUrl = `https://wa.me/91${data.contact.phone}?text=${encodeURIComponent(waText)}`;
    window.open(waUrl, "_blank");
  };

  const displayedProjects = showAllProjects ? data.projects : data.projects.slice(0, 4);

  return (
    <div className="bg-[#070707] text-[#e0e0e0] font-sans min-h-screen relative overflow-x-hidden selection:bg-[#ff0044] selection:text-white">
      {/* 1. CRT Scanlines & Streetwear Analog Grain Overlay */}
      <div
        className="fixed inset-0 pointer-events-none z-30 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"
        aria-hidden="true"
      />
      <div
        className="fixed inset-0 pointer-events-none z-30 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.5)_50%)] [background-size:100%_4px]"
        aria-hidden="true"
      />

      {/* 2. Akira Dubplate Header Bar */}
      <header className="sticky top-0 z-40 bg-[#090909]/90 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo / Monogram */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#ff0044] flex items-center justify-center font-black text-black text-xs tracking-tighter shadow-[0_0_15px_rgba(255,0,68,0.5)]">
              MM
            </div>
            <div>
              <div className="text-xs font-black tracking-widest text-white uppercase flex items-center gap-2">
                <span>{data.settings.websiteName.split("|")[0].trim()}</span>
                <span className="text-[10px] text-[#ff0044] font-mono">[33 RPM]</span>
              </div>
              <div className="text-[9px] font-mono text-zinc-400 tracking-wider">
                マヘシュ・マリアッパン // CHENNAI
              </div>
            </div>
          </div>

          {/* Side A / Side B Selector Deck */}
          <div className="flex items-center bg-black/60 p-1 rounded-full border border-white/10 shadow-inner">
            <button
              onClick={() => flipRecord("A")}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition ${
                activeSide === "A"
                  ? "bg-[#ff0044] text-white shadow-[0_0_12px_rgba(255,0,68,0.6)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              SIDE A : RELEASES
            </button>
            <button
              onClick={() => flipRecord("B")}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition ${
                activeSide === "B"
                  ? "bg-[#ffe600] text-black shadow-[0_0_12px_rgba(255,230,0,0.6)]"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              SIDE B : ARCHIVE
            </button>
          </div>

          {/* Quick Sound / Lo-Fi Beats Switch */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleLoFi}
              className={`px-3 py-1.5 rounded border text-[11px] font-mono flex items-center gap-2 transition ${
                isPlayingLoFi
                  ? "border-[#00f0ff] bg-[#00f0ff]/10 text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.3)] animate-pulse"
                  : "border-white/10 text-zinc-400 hover:border-white/30 hover:text-white"
              }`}
            >
              {isPlayingLoFi ? <Volume2 size={14} /> : <VolumeX size={14} />}
              <span className="hidden sm:inline">LO-FI AUDIO</span>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
            </button>
            <a
              href="#contact"
              className="hidden md:inline-flex items-center gap-2 px-4 py-1.5 bg-white text-black hover:bg-[#ff0044] hover:text-white font-black text-xs uppercase tracking-wider rounded transition shadow"
            >
              SESSION BOOKING
            </a>
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION: 3D Turntable + Streetwear Dubplate Poster */}
      <section className="relative min-h-[92vh] flex flex-col items-center justify-center px-6 pt-8 pb-16 overflow-hidden">
        {/* Background Streetwear Watermark Typography */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden opacity-5">
          <span className="text-[22vw] font-black uppercase text-white tracking-tighter leading-none">
            AKIRA
          </span>
        </div>

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center z-10">
          {/* Left Hero Story / Specs */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Indicator Badges */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px]">
              <span className="px-2.5 py-1 rounded bg-[#ff0044]/20 border border-[#ff0044]/40 text-[#ff0044] font-bold uppercase tracking-widest flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff0044] animate-ping" />
                DUBPLATE PRESS // 2026
              </span>
              <span className="px-2.5 py-1 rounded bg-white/5 border border-white/10 text-zinc-400 uppercase">
                LATENCY: 0.12ms
              </span>
              <span className="px-2.5 py-1 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 uppercase">
                FRESHWORKS ALUMNI
              </span>
            </div>

            {/* Giant Display Title */}
            <div>
              <p className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest mb-2 flex items-center gap-2">
                <span>[ SIDE {activeSide} : CURRENT GROOVE ]</span>
                <span className="h-px w-12 bg-[#00f0ff]/40"></span>
              </p>
              <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tighter uppercase leading-[0.95]">
                {data.hero.name.split(" ")[0]}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff0044] via-[#ff7300] to-[#ffe600]">
                  {data.hero.name.split(" ").slice(1).join(" ")}
                </span>
              </h1>
            </div>

            {/* Tagline & Subtitle */}
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-medium">
              {data.hero.tagline}
            </p>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 backdrop-blur-sm space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span>SPECIALIZATION</span>
                <span className="text-[#00f0ff]">FULLSTACK ENGINE</span>
              </div>
              <p className="text-xs text-zinc-400 leading-normal">
                {data.hero.description}
              </p>
            </div>

            {/* Turntable Instructions & Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => flipRecord(activeSide === "A" ? "B" : "A")}
                className="px-6 py-3.5 rounded bg-[#ff0044] hover:bg-[#d60039] text-white font-black text-xs uppercase tracking-widest flex items-center gap-3 transition shadow-[0_0_25px_rgba(255,0,68,0.4)]"
              >
                <RotateCw size={16} />
                FLIP TO SIDE {activeSide === "A" ? "B" : "A"}
              </button>

              <a
                href="#projects"
                className="px-6 py-3.5 rounded bg-white/5 hover:bg-white/10 border border-white/20 text-white font-mono font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition"
              >
                <span>EXPLORE TRACKS</span>
                <ArrowRight size={14} />
              </a>
            </div>

            {/* DJ Tip */}
            <div className="text-[10px] font-mono text-zinc-400 flex items-center gap-2">
              <Disc size={13} className="text-[#ff0044] animate-spin" />
              <span>CLICK & DRAG VINYL ON RIGHT TO SCRATCH REAL-TIME</span>
            </div>
          </div>

          {/* Right: Interactive 3D WebGL Vinyl Turntable Canvas */}
          <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
            <div className="w-full h-[380px] sm:h-[480px] lg:h-[540px] relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-zinc-900/60 to-black/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
              {/* Three.js Canvas Mount */}
              <div
                ref={threeMountRef}
                className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
              />

              {/* Holographic Watermark Badge */}
              <div className="absolute top-4 left-4 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-white/10 text-[10px] font-mono text-white">
                <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse"></span>
                <span>3D WEBGL ENGINE // THREE.JS</span>
              </div>

              {/* Scratch Overlay Indicator */}
              <div className="absolute bottom-4 right-4 pointer-events-none px-3 py-1.5 rounded bg-black/70 border border-white/10 text-[9px] font-mono text-zinc-400">
                DRAG TO SCRATCH ◄►
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TRACKLIST & SELECTED WORKS (SIDE A) */}
      <section id="projects" className="py-24 px-6 border-t border-white/10 bg-[#090909]">
        <div className="max-w-7xl mx-auto space-y-12">
          {/* Section Header with Dubplate Metadata */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#ff0044] uppercase tracking-widest mb-2">
                <Disc size={14} className="animate-spin" />
                <span>SIDE A // TRACKLIST RELEASES</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                SELECTED WORKS
              </h2>
            </div>
            <div className="font-mono text-xs text-zinc-400 space-y-1">
              <p>CATALOG NO: MM-2026-LP</p>
              <p className="text-zinc-400">AUDIO FORMAT: 24-BIT / 96KHZ CODE ARCHITECTURE</p>
            </div>
          </div>

          {/* Project Sleeves Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {displayedProjects.map((project, idx) => (
              <motion.div
                key={project.id}
                whileHover={{ y: -8, scale: 1.01 }}
                transition={{ duration: 0.2 }}
                className="group relative rounded-2xl bg-gradient-to-b from-[#141414] to-[#0a0a0a] border border-white/10 hover:border-[#ff0044]/50 overflow-hidden shadow-2xl transition duration-300"
              >
                {/* Vinyl Record Peeking Behind Sleeve */}
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 w-44 h-44 rounded-full bg-gradient-to-tr from-zinc-900 to-black border-4 border-zinc-700/40 shadow-2xl opacity-40 group-hover:opacity-100 group-hover:translate-x-6 transition-all duration-500 pointer-events-none flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#ff0044] border-2 border-yellow-400 flex items-center justify-center text-[8px] font-black text-black">
                    SIDE A
                  </div>
                </div>

                {/* Sleeve Cover Image */}
                <div className="relative h-60 w-full overflow-hidden bg-zinc-950">
                  <img
                    src={getAssetPath(project.image)}
                    alt={project.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-500 filter contrast-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/60" />

                  {/* Track Index Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1 rounded bg-black/80 backdrop-blur-md border border-white/10 font-mono text-xs font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#ff0044]"></span>
                    TRACK {String(idx + 1).padStart(2, "0")}
                  </div>

                  {/* Category Pill */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded bg-[#ff0044]/90 text-white font-mono text-[10px] font-bold uppercase tracking-wider">
                    {project.category}
                  </div>
                </div>

                {/* Sleeve Info & Track Details */}
                <div className="p-6 space-y-4 relative z-10 bg-[#141414]">
                  <div>
                    <h3 className="text-xl font-black text-white group-hover:text-[#ff0044] transition flex items-center justify-between">
                      <span>{project.title}</span>
                      <ChevronRight size={18} className="text-zinc-600 group-hover:text-white group-hover:translate-x-1 transition" />
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 mt-1">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech Matrix Chips */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.technologies.split(",").map((tech, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2.5 py-0.5 rounded bg-black/60 border border-white/10 text-zinc-300 font-mono text-[10px] font-semibold"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>

                  {/* Links / Playback */}
                  <div className="flex items-center gap-4 pt-3 border-t border-white/5 font-mono text-xs">
                    {project.liveUrl && (
                      <a
                        href={project.liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#00f0ff] hover:text-white flex items-center gap-1.5 transition font-bold"
                      >
                        <ExternalLink size={13} />
                        <span>DROP NEEDLE // LIVE</span>
                      </a>
                    )}
                    {project.githubUrl && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-zinc-400 hover:text-white flex items-center gap-1.5 transition"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>SOURCE CODE</span>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Show More Tracks Button */}
          {data.projects.length > 4 && (
            <div className="text-center pt-6">
              <button
                onClick={() => setShowAllProjects(!showAllProjects)}
                className="px-8 py-3.5 rounded bg-white/5 hover:bg-white/10 border border-white/20 font-mono text-xs font-bold uppercase tracking-widest text-white transition inline-flex items-center gap-2"
              >
                <span>{showAllProjects ? "COLLAPSE TRACKLIST" : `LOAD COMPLETE CATALOG (${data.projects.length} TRACKS)`}</span>
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. HARDWARE SYNTHESIS / STUDIO SERVICES */}
      <section id="services" className="py-24 px-6 bg-[#050505] border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#00f0ff] uppercase tracking-widest mb-2">
                <Sliders size={14} />
                <span>RACK UNITS & SIGNAL ROUTING</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                STUDIO SERVICES
              </h2>
            </div>
            <p className="font-mono text-xs text-zinc-400 max-w-sm">
              Modular fullstack engineering stacks custom-tuned for high throughput and responsive web dynamics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {data.services.map((srv, idx) => (
              <div
                key={srv.id}
                className="p-6 rounded-2xl bg-gradient-to-b from-[#121212] to-black border border-white/10 hover:border-[#00f0ff]/50 space-y-4 group transition duration-300"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff] flex items-center justify-center font-mono font-bold text-sm">
                    0{idx + 1}
                  </div>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    CH-{idx + 1} ACTIVE
                  </span>
                </div>
                <h3 className="text-lg font-black text-white group-hover:text-[#00f0ff] transition">
                  {srv.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  {srv.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. SIDE B: CASSETTE TAPE ARCHIVE & CAREER LINER NOTES */}
      <section id="about" className="py-24 px-6 bg-[#080808] border-t border-white/10">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#ffe600] uppercase tracking-widest mb-2">
                <Radio size={14} />
                <span>SIDE B // CASSETTE MASTER TAPE</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black text-white uppercase tracking-tight">
                ENGINEERING ARCHIVE
              </h2>
            </div>
            <p className="font-mono text-xs text-zinc-400">
              REEL-TO-REEL LOG // EDUCATION, MILESTONES & DISCIPLINE
            </p>
          </div>

          {/* About Bio Reel + Photo Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-4 relative group">
              <div className="relative rounded-2xl overflow-hidden border-2 border-white/20 bg-zinc-900 shadow-2xl">
                <img
                  src={getAssetPath(data.about.photo || data.hero.profileImage || "/profile.jpg")}
                  alt={data.hero.name}
                  className="w-full aspect-square object-cover object-top filter grayscale contrast-125 group-hover:grayscale-0 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4 p-3 rounded-lg bg-black/80 backdrop-blur border border-white/10 font-mono text-xs">
                  <p className="font-bold text-white uppercase">{data.hero.name}</p>
                  <p className="text-[10px] text-[#ff0044]">{data.about.education}</p>
                </div>
              </div>
              {/* Retro sticker */}
              <div className="absolute -top-3 -right-3 px-3 py-1 rounded bg-[#ffe600] text-black font-black text-[10px] uppercase tracking-widest rotate-6 shadow-lg">
                MASTER TAPE
              </div>
            </div>

            <div className="lg:col-span-8 space-y-6">
              <h3 className="text-2xl font-black text-white uppercase">
                The Narrative: Resilience & Scalable Systems
              </h3>
              <p className="text-sm text-zinc-300 leading-relaxed font-sans">
                {data.about.description}
              </p>

              {/* Mission & Vision Dubplate Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="text-[10px] font-mono text-[#00f0ff] uppercase tracking-widest font-bold">
                    [ MISSION STATEMENT ]
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {data.about.mission}
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                  <div className="text-[10px] font-mono text-[#ff0044] uppercase tracking-widest font-bold">
                    [ VISION STATEMENT ]
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {data.about.vision}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Equalizer Frequency Analyzer (Skills) */}
          <div className="space-y-6 pt-8 border-t border-white/10">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="text-[#00f0ff] font-bold">[ FREQUENCY EQUALIZER // CORE SKILLS ]</span>
              <span className="text-zinc-400">DB LEVEL: +3.5 PEAK</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="p-4 rounded-xl bg-zinc-950 border border-white/10 space-y-2 group hover:border-[#ff0044]/50 transition"
                >
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-white font-bold">{skill.name}</span>
                    <span className="text-[#ff0044] font-black">{skill.percentage}%</span>
                  </div>
                  {/* EQ Level Meter Bar */}
                  <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-[#00f0ff] via-[#ffe600] to-[#ff0044] rounded-full transition-all duration-700"
                      style={{ width: `${skill.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Reel (Journey) */}
          <div className="space-y-6 pt-8 border-t border-white/10">
            <div className="font-mono text-xs text-[#ffe600] font-bold">
              [ TIMELINE LOG // CAREER TAPE ]
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.workProcess.map((step, idx) => (
                <div
                  key={step.id}
                  className="p-6 rounded-2xl bg-zinc-950 border border-white/10 relative space-y-3"
                >
                  <div className="flex items-center justify-between font-mono text-xs">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-white font-bold">
                      STAGE 0{idx + 1}
                    </span>
                    <span className="text-zinc-400">{step.period || `202${4 + idx}`}</span>
                  </div>
                  <h4 className="text-lg font-black text-white">{step.title}</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ (LINER NOTES SPEC SHEET) */}
      <section id="faq" className="py-24 px-6 bg-[#060606] border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono text-[#00f0ff] uppercase tracking-widest">
              [ DUBPLATE SPECS & FAQ ]
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase">
              FREQUENTLY ASKED QUESTIONS
            </h2>
          </div>

          <div className="space-y-3">
            {data.faqs.map((faq) => {
              const isOpen = activeFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-white/10 bg-zinc-950/60 overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left font-mono text-sm font-bold text-white flex items-center justify-between hover:text-[#ff0044] transition"
                  >
                    <span>{faq.question}</span>
                    <span className="text-xs text-zinc-400">{isOpen ? "[-]" : "[+]"}</span>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-white/5 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. BACKSTAGE PASS / STUDIO BOOKING CONTACT FORM */}
      <section id="contact" className="py-24 px-6 bg-[#090909] border-t border-white/10">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Backstage Pass Frame */}
          <div className="relative rounded-3xl bg-gradient-to-b from-[#141414] to-[#0a0a0a] border-2 border-white/20 p-8 sm:p-12 shadow-2xl overflow-hidden">
            {/* Lanyard Hole Clip */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-4 rounded-b-xl bg-black border-x border-b border-white/20 flex items-center justify-center">
              <div className="w-12 h-1.5 rounded-full bg-zinc-800"></div>
            </div>

            <div className="space-y-8 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
                <div>
                  <div className="font-mono text-xs text-[#ff0044] font-bold tracking-widest uppercase mb-1">
                    ACCESS CODE // ALL ACCESS VIP
                  </div>
                  <h2 className="text-3xl font-black text-white uppercase">
                    BOOK A STUDIO SESSION
                  </h2>
                </div>
                <div className="font-mono text-right text-xs text-zinc-400">
                  <p>LOCATION: CHENNAI, INDIA</p>
                  <p className="text-[#00f0ff]">STATUS: OPEN FOR WORK</p>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleContactSubmit} className="space-y-4 font-mono text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-zinc-400 uppercase tracking-wider text-[10px]">YOUR NAME *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Akira Toriyama"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#ff0044] focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-400 uppercase tracking-wider text-[10px]">PHONE / WHATSAPP *</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#ff0044] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase tracking-wider text-[10px]">EMAIL ADDRESS</label>
                  <input
                    type="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#ff0044] focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 uppercase tracking-wider text-[10px]">PROJECT BRIEF / MESSAGE</label>
                  <textarea
                    rows={4}
                    placeholder="Describe your vision, technical requirements, or role offer..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-black/60 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#ff0044] focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-[#ff0044] hover:bg-[#d60039] text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 transition shadow-[0_0_30px_rgba(255,0,68,0.4)]"
                >
                  <Send size={15} />
                  TRANSMIT TO WHATSAPP DIRECT
                </button>
              </form>

              {/* Direct Channels */}
              <div className="flex flex-wrap items-center justify-between pt-6 border-t border-white/10 text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-4">
                  {data.contact.whatsapp && (
                    <a
                      href={`https://wa.me/91${data.contact.whatsapp}`}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-emerald-400 flex items-center gap-1.5 transition"
                    >
                      <Whatsapp className="w-4 h-4" />
                      <span>WHATSAPP</span>
                    </a>
                  )}
                  {data.contact.github && (
                    <a
                      href={data.contact.github}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-white flex items-center gap-1.5 transition"
                    >
                      <Github className="w-4 h-4" />
                      <span>GITHUB</span>
                    </a>
                  )}
                  {data.contact.instagram && (
                    <a
                      href={data.contact.instagram}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-pink-400 flex items-center gap-1.5 transition"
                    >
                      <Instagram className="w-4 h-4" />
                      <span>INSTAGRAM</span>
                    </a>
                  )}
                </div>
                <div>{data.contact.email}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. PERSISTENT FLOATING AUDIO DOCK (MIND OF AKIRA STYLE) */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-3 bg-black/90 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-full shadow-2xl">
        <button
          onClick={toggleLoFi}
          className="w-8 h-8 rounded-full bg-[#ff0044] flex items-center justify-center text-white shadow-[0_0_12px_rgba(255,0,68,0.5)] hover:scale-105 transition"
          title={isPlayingLoFi ? "Pause Audio" : "Play Lo-Fi"}
        >
          {isPlayingLoFi ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
        </button>

        <div className="text-[11px] font-mono pr-2">
          <div className="text-white font-bold flex items-center gap-2">
            <span>DUBPLATE LP</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-ping" />
          </div>
          <div className="text-[9px] text-zinc-400">
            {isPlayingLoFi ? "TRACK 01 // LO-FI STREAM" : "SCRATCH OR HIT PLAY"}
          </div>
        </div>

        {/* Animated Sound Bars */}
        <div className="flex items-end gap-1 h-4 px-2">
          <span className={`w-0.5 bg-[#00f0ff] rounded-full transition-all ${isPlayingLoFi ? "h-4 animate-bounce" : "h-1"}`} />
          <span className={`w-0.5 bg-[#ffe600] rounded-full transition-all ${isPlayingLoFi ? "h-3 animate-pulse" : "h-1.5"}`} />
          <span className={`w-0.5 bg-[#ff0044] rounded-full transition-all ${isPlayingLoFi ? "h-5 animate-bounce" : "h-2"}`} />
          <span className={`w-0.5 bg-[#00f0ff] rounded-full transition-all ${isPlayingLoFi ? "h-2 animate-pulse" : "h-1"}`} />
        </div>
      </div>
    </div>
  );
}
