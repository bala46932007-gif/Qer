import React, { useEffect, useRef, useState } from 'react';
import { Atom, Sparkles, Layers, Eye, Sliders, Hexagon } from 'lucide-react';

export type ChemistryThemeMode = 'molecules' | 'graphene' | 'orbitals' | 'diffraction';
export type BackgroundIntensity = 'subtle' | 'balanced' | 'vivid';

interface AtomParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  symbol: string;
  color: string;
  valence: number;
  charge?: string;
  pulsePhase: number;
}

const CHEMICAL_ELEMENTS = [
  { symbol: 'C', color: '#60a5fa', radius: 9, valence: 4 },
  { symbol: 'O', color: '#f87171', radius: 8, valence: 2, charge: '2−' },
  { symbol: 'N', color: '#38bdf8', radius: 8.5, valence: 3 },
  { symbol: 'H', color: '#94a3b8', radius: 5.5, valence: 1 },
  { symbol: 'Li', color: '#34d399', radius: 7, valence: 1, charge: '1+' },
  { symbol: 'Fe', color: '#fb923c', radius: 10.5, valence: 3, charge: '2+' },
  { symbol: 'Ti', color: '#a78bfa', radius: 10, valence: 4, charge: '4+' },
  { symbol: 'Si', color: '#facc15', radius: 9.5, valence: 4 },
  { symbol: 'P', color: '#f472b6', radius: 9, valence: 5 },
];

export const ChemistryBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [themeMode, setThemeMode] = useState<ChemistryThemeMode>(() => {
    try {
      return (localStorage.getItem('mm_bg_theme') as ChemistryThemeMode) || 'molecules';
    } catch {
      return 'molecules';
    }
  });

  const [intensity, setIntensity] = useState<BackgroundIntensity>(() => {
    try {
      return (localStorage.getItem('mm_bg_intensity') as BackgroundIntensity) || 'balanced';
    } catch {
      return 'balanced';
    }
  });

  const [isControlOpen, setIsControlOpen] = useState(false);
  const mousePosRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });

  // Save preferences
  useEffect(() => {
    try {
      localStorage.setItem('mm_bg_theme', themeMode);
      localStorage.setItem('mm_bg_intensity', intensity);
    } catch {}
  }, [themeMode, intensity]);

  // Opacity factor based on intensity
  const opacityMultipliers = {
    subtle: { canvas: 0.45, grid: 0.25, glyphs: 0.25 },
    balanced: { canvas: 0.85, grid: 0.55, glyphs: 0.5 },
    vivid: { canvas: 1.25, grid: 0.85, glyphs: 0.8 },
  }[intensity];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Track mouse for interactive molecular bonding / repulsion
    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mousePosRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Initialize particles
    let particles: AtomParticle[] = [];
    const particleCount = Math.min(Math.floor((width * height) / 38000), 42);

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        const el = CHEMICAL_ELEMENTS[Math.floor(Math.random() * CHEMICAL_ELEMENTS.length)];
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: el.radius,
          symbol: el.symbol,
          color: el.color,
          valence: el.valence,
          charge: el.charge,
          pulsePhase: Math.random() * Math.PI * 2,
        });
      }
    };

    initParticles();

    // Orbital angle counter
    let orbitalAngle = 0;
    let diffractionPhase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      orbitalAngle += 0.005;
      diffractionPhase += 0.01;

      const maxBondDist = 135;
      const mouseInfluenceDist = 170;

      // 1. MOLECULES MODE: Molecular dynamics network with covalent bonds
      if (themeMode === 'molecules') {
        // Draw bonds between neighboring atoms
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxBondDist) {
              const alpha = (1 - dist / maxBondDist) * 0.38 * opacityMultipliers.canvas;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);

              // Gradient bond reflecting elemental junction
              const grad = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y);
              grad.addColorStop(0, p1.color);
              grad.addColorStop(1, p2.color);

              ctx.strokeStyle = grad;
              ctx.globalAlpha = alpha;
              ctx.lineWidth = dist < 70 ? 2 : 1.2;
              ctx.stroke();

              // If atoms are very close, draw a subtle double bond or electron sharing node
              if (dist < 65 && (p1.symbol === 'C' || p2.symbol === 'O')) {
                const perpX = -dy / dist * 3.5;
                const perpY = dx / dist * 3.5;
                ctx.beginPath();
                ctx.moveTo(p1.x + perpX, p1.y + perpY);
                ctx.lineTo(p2.x + perpX, p2.y + perpY);
                ctx.globalAlpha = alpha * 0.7;
                ctx.lineWidth = 1;
                ctx.stroke();
              }
            }
          }

          // Bond to mouse cursor if within range
          if (mousePosRef.current.active) {
            const p = particles[i];
            const mdx = mousePosRef.current.x - p.x;
            const mdy = mousePosRef.current.y - p.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mDist < mouseInfluenceDist) {
              const alpha = (1 - mDist / mouseInfluenceDist) * 0.5 * opacityMultipliers.canvas;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(mousePosRef.current.x, mousePosRef.current.y);
              ctx.strokeStyle = '#38bdf8';
              ctx.globalAlpha = alpha;
              ctx.setLineDash([3, 4]);
              ctx.lineWidth = 1.5;
              ctx.stroke();
              ctx.setLineDash([]);
            }
          }
        }

        // Draw atoms
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          p.pulsePhase += 0.02;

          // Mouse gentle repulsion/steering
          if (mousePosRef.current.active) {
            const mdx = p.x - mousePosRef.current.x;
            const mdy = p.y - mousePosRef.current.y;
            const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
            if (mDist < mouseInfluenceDist && mDist > 0) {
              const force = (1 - mDist / mouseInfluenceDist) * 0.4;
              p.vx += (mdx / mDist) * force;
              p.vy += (mdy / mDist) * force;
            }
          }

          // Move
          p.x += p.vx;
          p.y += p.vy;

          // Damping & speed cap
          p.vx *= 0.985;
          p.vy *= 0.985;
          if (Math.abs(p.vx) < 0.1) p.vx += (Math.random() - 0.5) * 0.1;
          if (Math.abs(p.vy) < 0.1) p.vy += (Math.random() - 0.5) * 0.1;

          // Wrap edges smoothly
          const pad = 30;
          if (p.x < -pad) p.x = width + pad;
          if (p.x > width + pad) p.x = -pad;
          if (p.y < -pad) p.y = height + pad;
          if (p.y > height + pad) p.y = -pad;

          // Atom outer orbital glow
          const glowRad = p.radius * 2.2 + Math.sin(p.pulsePhase) * 2;
          const radialGlow = ctx.createRadialGradient(p.x, p.y, p.radius * 0.4, p.x, p.y, glowRad);
          radialGlow.addColorStop(0, p.color);
          radialGlow.addColorStop(1, 'transparent');

          ctx.beginPath();
          ctx.arc(p.x, p.y, glowRad, 0, Math.PI * 2);
          ctx.fillStyle = radialGlow;
          ctx.globalAlpha = 0.25 * opacityMultipliers.canvas;
          ctx.fill();

          // Atom core sphere
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = 0.65 * opacityMultipliers.canvas;
          ctx.fill();

          ctx.strokeStyle = '#ffffff';
          ctx.globalAlpha = 0.35 * opacityMultipliers.canvas;
          ctx.lineWidth = 1;
          ctx.stroke();

          // Chemical Symbol text
          ctx.font = `bold ${Math.round(p.radius * 1.05)}px monospace`;
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = 0.9 * opacityMultipliers.canvas;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(p.symbol, p.x, p.y + 0.5);

          // Ionic charge indicator if present (e.g. 2+)
          if (p.charge) {
            ctx.font = `bold 7px monospace`;
            ctx.fillStyle = '#cbd5e1';
            ctx.globalAlpha = 0.7 * opacityMultipliers.canvas;
            ctx.fillText(p.charge, p.x + p.radius + 4, p.y - p.radius * 0.6);
          }
        }
      }

      // 2. ORBITALS MODE: Quantum Bohr & electron probability lobes
      else if (themeMode === 'orbitals') {
        const centers = [
          { x: width * 0.22, y: height * 0.35, r: 120, label: '3d / 4s Hybrid', el: 'Ti' },
          { x: width * 0.75, y: height * 0.28, r: 150, label: 'sp³ Tetrahedral', el: 'Si' },
          { x: width * 0.48, y: height * 0.72, r: 130, label: 'FeO₆ Octahedron', el: 'Fe' },
          { x: width * 0.85, y: height * 0.8, r: 100, label: 'π-Conjugation', el: 'C' },
        ];

        centers.forEach((c, idx) => {
          // Central nucleus
          ctx.beginPath();
          ctx.arc(c.x, c.y, 10, 0, Math.PI * 2);
          ctx.fillStyle = idx % 2 === 0 ? '#38bdf8' : '#34d399';
          ctx.globalAlpha = 0.8 * opacityMultipliers.canvas;
          ctx.fill();

          ctx.font = 'bold 10px monospace';
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(c.el, c.x, c.y);

          // Concentric & tilted orbital ellipses
          for (let k = 1; k <= 3; k++) {
            const radX = c.r * (k * 0.35);
            const radY = radX * 0.48;
            const rot = orbitalAngle * (k % 2 === 0 ? 1 : -1.2) + (k * Math.PI) / 3;

            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(rot);

            ctx.beginPath();
            ctx.ellipse(0, 0, radX, radY, 0, 0, Math.PI * 2);
            ctx.strokeStyle = idx % 2 === 0 ? '#38bdf8' : '#a78bfa';
            ctx.globalAlpha = (0.28 - k * 0.05) * opacityMultipliers.canvas;
            ctx.lineWidth = 1.2;
            ctx.stroke();

            // Electron particle on orbit
            const electronTheta = orbitalAngle * 2.5 * (k % 2 === 0 ? 1 : -1) + k;
            const ex = radX * Math.cos(electronTheta);
            const ey = radY * Math.sin(electronTheta);

            ctx.beginPath();
            ctx.arc(ex, ey, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.85 * opacityMultipliers.canvas;
            ctx.fill();

            // Electron tail
            ctx.restore();
          }

          // Orbital label
          ctx.font = '9px monospace';
          ctx.fillStyle = '#7dd3fc';
          ctx.globalAlpha = 0.5 * opacityMultipliers.canvas;
          ctx.fillText(c.label, c.x, c.y + c.r * 0.55);
        });
      }

      // 3. DIFFRACTION MODE: X-ray powder diffraction (XRD) Debye-Scherrer rings
      else if (themeMode === 'diffraction') {
        const cx = width * 0.5;
        const cy = height * 0.45;
        const rings = [50, 95, 140, 190, 245, 310, 380, 460, 560];

        rings.forEach((rad, i) => {
          const ringAlpha = (0.22 - (i / rings.length) * 0.14) * opacityMultipliers.canvas;
          ctx.beginPath();
          ctx.arc(cx, cy, rad, 0, Math.PI * 2);
          ctx.strokeStyle = i % 3 === 0 ? '#38bdf8' : i % 3 === 1 ? '#34d399' : '#fbbf24';
          ctx.globalAlpha = ringAlpha;
          ctx.lineWidth = i % 2 === 0 ? 1.8 : 1;
          ctx.stroke();

          // Diffraction spot peaks on rings
          const spotsCount = 4 + (i % 4) * 2;
          for (let s = 0; s < spotsCount; s++) {
            const angle = (s * Math.PI * 2) / spotsCount + diffractionPhase * (i % 2 === 0 ? 0.3 : -0.3);
            const sx = cx + rad * Math.cos(angle);
            const sy = cy + rad * Math.sin(angle);

            ctx.beginPath();
            ctx.arc(sx, sy, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.globalAlpha = 0.6 * opacityMultipliers.canvas;
            ctx.fill();
          }
        });

        // Reciprocal lattice vector axes
        ctx.beginPath();
        ctx.moveTo(cx - 300, cy);
        ctx.lineTo(cx + 300, cy);
        ctx.moveTo(cx, cy - 300);
        ctx.lineTo(cx, cy + 300);
        ctx.strokeStyle = '#64748b';
        ctx.globalAlpha = 0.15 * opacityMultipliers.canvas;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 4. GRAPHENE MODE: Draw additional carbon nodes onto hexagonal vertices
      else if (themeMode === 'graphene') {
        // Draw moving electron carriers along graphene honeycomb
        for (let i = 0; i < 22; i++) {
          const p = particles[i % particles.length];
          p.x += p.vx * 0.6;
          p.y += p.vy * 0.6;
          if (p.x < 0) p.x = width;
          if (p.x > width) p.x = 0;
          if (p.y < 0) p.y = height;
          if (p.y > height) p.y = 0;

          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = '#2dd4bf';
          ctx.globalAlpha = 0.7 * opacityMultipliers.canvas;
          ctx.fill();

          // Hex ring trace
          ctx.beginPath();
          const r = 18;
          for (let h = 0; h < 6; h++) {
            const ha = (h * Math.PI) / 3;
            const hx = p.x + r * Math.cos(ha);
            const hy = p.y + r * Math.sin(ha);
            if (h === 0) ctx.moveTo(hx, hy);
            else ctx.lineTo(hx, hy);
          }
          ctx.closePath();
          ctx.strokeStyle = '#0284c7';
          ctx.globalAlpha = 0.25 * opacityMultipliers.canvas;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [themeMode, intensity, opacityMultipliers]);

  return (
    <div
      id="chemistry-ambient-background"
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      {/* 1. Deep Atmospheric Gradient with Quantum Glows */}
      <div className="absolute inset-0 bg-[#040a14]" />

      {/* Radiant chemical plasma spots */}
      <div
        className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full blur-[130px] transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.16) 0%, rgba(6, 78, 59, 0.08) 50%, transparent 70%)',
          opacity: opacityMultipliers.grid,
        }}
      />
      <div
        className="absolute top-[30%] right-[-10%] w-[750px] h-[750px] rounded-full blur-[150px] transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle, rgba(99, 102, 241, 0.14) 0%, rgba(20, 184, 166, 0.1) 45%, transparent 70%)',
          opacity: opacityMultipliers.grid,
        }}
      />
      <div
        className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] rounded-full blur-[140px] transition-opacity duration-700"
        style={{
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, rgba(14, 116, 144, 0.08) 50%, transparent 70%)',
          opacity: opacityMultipliers.grid,
        }}
      />

      {/* 2. Seamless Hexagonal Honeycomb / Graphene Lattice SVG Grid */}
      <svg
        className="absolute inset-0 w-full h-full transition-opacity duration-500"
        style={{ opacity: opacityMultipliers.grid * 0.4 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="graphene-pattern"
            width="56"
            height="96.9948"
            patternUnits="userSpaceOnUse"
            patternTransform="scale(0.85)"
          >
            {/* Hexagonal Honeycomb Vertices & Bonds */}
            <path
              d="M28,0 L56,16.1658 L56,48.4974 L28,64.6632 L0,48.4974 L0,16.1658 Z"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="0.75"
              strokeOpacity="0.35"
            />
            <path
              d="M28,96.9948 L56,80.829 L56,48.4974 L28,64.6632 L0,48.4974 L0,80.829 Z"
              fill="none"
              stroke="#2dd4bf"
              strokeWidth="0.75"
              strokeOpacity="0.35"
            />
            {/* Carbon Atom Nodes on Vertices */}
            <circle cx="28" cy="0" r="1.5" fill="#38bdf8" fillOpacity="0.6" />
            <circle cx="56" cy="16.1658" r="1.5" fill="#34d399" fillOpacity="0.6" />
            <circle cx="56" cy="48.4974" r="1.5" fill="#38bdf8" fillOpacity="0.6" />
            <circle cx="28" cy="64.6632" r="1.5" fill="#34d399" fillOpacity="0.6" />
            <circle cx="0" cy="48.4974" r="1.5" fill="#38bdf8" fillOpacity="0.6" />
            <circle cx="0" cy="16.1658" r="1.5" fill="#34d399" fillOpacity="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#graphene-pattern)" />
      </svg>

      {/* 3. Scientific & Chemical Formula Typography Watermarks */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{ opacity: opacityMultipliers.glyphs }}
      >
        {/* Top-Right: Benzene ring with conjugated bonds and Gibbs equation */}
        <div className="absolute top-16 right-12 hidden lg:flex flex-col items-end text-right font-mono text-[#38bdf8]/20 select-none">
          <svg width="120" height="120" viewBox="0 0 100 100" className="stroke-[#38bdf8]/25 fill-none stroke-[1.5]">
            <polygon points="50,10 85,30 85,70 50,90 15,70 15,30" />
            {/* Inner conjugated circle */}
            <circle cx="50" cy="50" r="24" strokeDasharray="6 4" />
            {/* Substituent bond */}
            <line x1="50" y1="10" x2="50" y2="0" />
            <line x1="85" y1="30" x2="95" y2="24" />
          </svg>
          <span className="text-xs font-bold text-[#38bdf8]/30 tracking-widest mt-1">C₆H₆ · AROMATIC RING</span>
          <span className="text-[10px] text-[#34d399]/30">ΔG° = ΔH° − TΔS°</span>
        </div>

        {/* Top-Left behind sidebar area: Bragg's law & crystallographic space group */}
        <div className="absolute top-36 left-8 hidden xl:flex flex-col text-left font-mono text-[#7dd3fc]/20 select-none">
          <span className="text-sm font-black tracking-widest text-[#38bdf8]/25">λ = 2d sin θ</span>
          <span className="text-[10px] text-[#94a3b8]/25">BRAGG DIFFRACTION (XRD)</span>
          <span className="text-[10px] text-[#4ade80]/25 mt-1">SPACE GROUP Fm-3m (No. 225)</span>
          <span className="text-[9px] text-[#64748b]/20">FCC RECIPROCAL LATTICE Brillouin Zone</span>
        </div>

        {/* Center-Right: Schrödinger Wave Equation & Octahedral coordination */}
        <div className="absolute top-[55%] right-8 hidden lg:flex flex-col items-end text-right font-mono text-[#a78bfa]/20 select-none">
          <svg width="100" height="90" viewBox="0 0 100 90" className="stroke-[#a78bfa]/25 fill-none stroke-[1.2]">
            {/* Octahedron representation */}
            <polygon points="50,10 85,45 50,80 15,45" />
            <line x1="50" y1="10" x2="50" y2="80" strokeDasharray="3 3" />
            <line x1="15" y1="45" x2="85" y2="45" />
            <circle cx="50" cy="45" r="5" fill="#a78bfa" fillOpacity="0.3" />
          </svg>
          <span className="text-xs font-bold text-[#a78bfa]/30 tracking-wider">TiO₆ OCTAHEDRAL LOBE</span>
          <span className="text-[10px] text-[#f472b6]/30">ĤΨ = EΨ (DFT-PBE)</span>
        </div>

        {/* Bottom-Left: Perovskite Formula & Formation Enthalpy */}
        <div className="absolute bottom-12 left-16 hidden lg:flex flex-col font-mono text-[#34d399]/20 select-none">
          <span className="text-xs font-bold text-[#34d399]/30 tracking-widest">ABX₃ PEROVSKITE UNIT CELL</span>
          <span className="text-[10px] text-[#38bdf8]/25">Tolerance Factor: t = (r_A + r_X) / √2(r_B + r_X)</span>
          <span className="text-[9px] text-[#94a3b8]/20">E_hull &lt; 0.050 eV/atom · METASTABLE BOUNDARY</span>
        </div>
      </div>

      {/* 4. Interactive HTML5 Chemical Animation Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* 5. Subtle Vignette Border to focus content */}
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none shadow-[inset_0_0_120px_rgba(2,6,23,0.85)]" />

      {/* 6. Interactive Chemistry Background Customizer Control Floating Badge */}
      <div className="pointer-events-auto absolute bottom-4 right-4 z-40">
        <div className="relative">
          {isControlOpen && (
            <div className="absolute bottom-12 right-0 w-72 p-3.5 rounded-2xl bg-[#091728]/95 backdrop-blur-md border border-[#1b3a5c] shadow-2xl text-xs text-[#cbd5e1] animate-fadeIn space-y-3">
              <div className="flex items-center justify-between border-b border-[#173250] pb-2">
                <div className="flex items-center gap-1.5 font-bold text-white">
                  <Atom className="w-4 h-4 text-[#38bdf8]" />
                  <span>Chemistry Canvas Mode</span>
                </div>
                <button
                  onClick={() => setIsControlOpen(false)}
                  className="text-[#64748b] hover:text-white text-xs px-1"
                >
                  ✕
                </button>
              </div>

              {/* Theme Mode Selector */}
              <div>
                <span className="text-[10px] uppercase font-mono text-[#64748b] block mb-1.5 font-bold">
                  Chemical Visualizer
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    onClick={() => setThemeMode('molecules')}
                    className={`px-2.5 py-1.5 rounded-lg text-left transition-colors font-medium flex items-center gap-1.5 ${
                      themeMode === 'molecules'
                        ? 'bg-[#153e66] text-white border border-[#38bdf8]'
                        : 'bg-[#0b1c30] text-[#94a3b8] hover:bg-[#102742]'
                    }`}
                  >
                    <Atom className="w-3.5 h-3.5 text-[#38bdf8]" />
                    <span>Molecules</span>
                  </button>

                  <button
                    onClick={() => setThemeMode('graphene')}
                    className={`px-2.5 py-1.5 rounded-lg text-left transition-colors font-medium flex items-center gap-1.5 ${
                      themeMode === 'graphene'
                        ? 'bg-[#153e66] text-white border border-[#2dd4bf]'
                        : 'bg-[#0b1c30] text-[#94a3b8] hover:bg-[#102742]'
                    }`}
                  >
                    <Hexagon className="w-3.5 h-3.5 text-[#2dd4bf]" />
                    <span>Graphene</span>
                  </button>

                  <button
                    onClick={() => setThemeMode('orbitals')}
                    className={`px-2.5 py-1.5 rounded-lg text-left transition-colors font-medium flex items-center gap-1.5 ${
                      themeMode === 'orbitals'
                        ? 'bg-[#153e66] text-white border border-[#a78bfa]'
                        : 'bg-[#0b1c30] text-[#94a3b8] hover:bg-[#102742]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#a78bfa]" />
                    <span>Orbitals</span>
                  </button>

                  <button
                    onClick={() => setThemeMode('diffraction')}
                    className={`px-2.5 py-1.5 rounded-lg text-left transition-colors font-medium flex items-center gap-1.5 ${
                      themeMode === 'diffraction'
                        ? 'bg-[#153e66] text-white border border-[#fbbf24]'
                        : 'bg-[#0b1c30] text-[#94a3b8] hover:bg-[#102742]'
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 text-[#fbbf24]" />
                    <span>XRD Rings</span>
                  </button>
                </div>
              </div>

              {/* Intensity / Opacity Selector */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] uppercase font-mono text-[#64748b] font-bold">Luminescence</span>
                  <span className="text-[10px] font-mono text-[#38bdf8] capitalize">{intensity}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 bg-[#061220] p-1 rounded-xl border border-[#13283f]">
                  {(['subtle', 'balanced', 'vivid'] as BackgroundIntensity[]).map(val => (
                    <button
                      key={val}
                      onClick={() => setIntensity(val)}
                      className={`py-1 rounded-lg text-[11px] font-medium capitalize transition-colors ${
                        intensity === val
                          ? 'bg-[#163e66] text-white font-bold'
                          : 'text-[#64748b] hover:text-[#94a3b8]'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-1 text-[10px] text-[#476685] font-mono flex items-center justify-between border-t border-[#12263d]">
                <span>Mouse reacts to chemical bonds</span>
                <span className="text-[#34d399]">Live Dynamics</span>
              </div>
            </div>
          )}

          {/* Trigger button */}
          <button
            id="chemistry-bg-toggle-btn"
            onClick={() => setIsControlOpen(prev => !prev)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#08182b]/80 hover:bg-[#0e2744] backdrop-blur-md border border-[#1b3d63] text-[#7eb5e6] hover:text-white text-xs font-semibold shadow-lg transition-all"
            title="Configure Chemistry Background Theme"
          >
            <Atom className="w-3.5 h-3.5 text-[#38bdf8] animate-spin" style={{ animationDuration: '14s' }} />
            <span className="hidden sm:inline">Chemistry Ambience</span>
            <span className="text-[10px] font-mono text-[#34d399] uppercase bg-[#071d33] px-1.5 py-0.5 rounded border border-[#143d63]">
              {themeMode}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
