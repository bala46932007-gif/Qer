import React, { useEffect, useRef, useState } from 'react';
import { RotateCw, ZoomIn, ZoomOut, Maximize2, Sparkles, Box, Info } from 'lucide-react';
import { MaterialData } from '../types';

interface CrystalViewerProps {
  material: MaterialData;
}

interface AtomCoord {
  x: number;
  y: number;
  z: number;
  symbol: string;
  color: string;
  radius: number;
  label: string;
}

export const CrystalViewer: React.FC<CrystalViewerProps> = ({ material }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rotationRef = useRef({ rx: 0.35, ry: -0.55 });
  const [zoom, setZoom] = useState(1.1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [showUnitCell, setShowUnitCell] = useState(true);
  const [showBonds, setShowBonds] = useState(true);

  // Generate atoms based on crystal system and elements
  const generateAtoms = (): AtomCoord[] => {
    const atoms: AtomCoord[] = [];
    const elements = (material?.elements && material.elements.length > 0) ? material.elements : [
      { symbol: 'M', name: 'Metal', count: 1, atomicWeight: 50, massPercent: 50, role: 'Cation', color: '#56b6ff' },
      { symbol: 'X', name: 'Anion', count: 1, atomicWeight: 16, massPercent: 50, role: 'Anion', color: '#ff5c5c' }
    ];

    const primaryCation = elements[0] || { symbol: 'A', color: '#56b6ff' };
    const secondary = elements[1] || { symbol: 'B', color: '#e06633' };
    const anion = elements[elements.length - 1] || { symbol: 'O', color: '#ff4444' };

    // Lattice fractional points
    const corners = [
      [0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0],
      [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1],
    ];

    const sys = (material?.crystalSystem || 'Cubic').toLowerCase();

    if (sys.includes('cubic') || sys.includes('tetragonal')) {
      // Corner atoms (Primary cation or A-site)
      corners.forEach(([x, y, z]) => {
        atoms.push({
          x: x - 0.5,
          y: y - 0.5,
          z: z - 0.5,
          symbol: primaryCation.symbol,
          color: primaryCation.color || '#56b6ff',
          radius: 12,
          label: primaryCation.symbol
        });
      });

      // Body-center atom
      if (elements.length > 1) {
        atoms.push({
          x: 0,
          y: 0,
          z: 0,
          symbol: secondary.symbol,
          color: secondary.color || '#e06633',
          radius: 14,
          label: secondary.symbol
        });
      }

      // Face centers (Anion e.g. Oxygen)
      const faceCenters = [
        [0.5, 0.5, 0], [0.5, 0.5, 1],
        [0.5, 0, 0.5], [0.5, 1, 0.5],
        [0, 0.5, 0.5], [1, 0.5, 0.5]
      ];
      faceCenters.forEach(([x, y, z]) => {
        atoms.push({
          x: x - 0.5,
          y: y - 0.5,
          z: z - 0.5,
          symbol: anion.symbol,
          color: anion.color || '#ff4444',
          radius: 10,
          label: anion.symbol
        });
      });
    } else if (material.crystalSystem === 'Hexagonal' || material.crystalSystem === 'Trigonal') {
      // Hexagonal prism packing
      const hexPoints = [
        [0, 0], [1, 0], [0.5, 0.866], [-0.5, 0.866], [-1, 0], [-0.5, -0.866], [0.5, -0.866]
      ];
      [-0.45, 0.45].forEach(z => {
        hexPoints.forEach(([x, y], idx) => {
          atoms.push({
            x: x * 0.45,
            y: y * 0.45,
            z: z,
            symbol: idx === 0 ? secondary.symbol : primaryCation.symbol,
            color: idx === 0 ? secondary.color || '#43d6a3' : primaryCation.color || '#56b6ff',
            radius: idx === 0 ? 13 : 11,
            label: idx === 0 ? secondary.symbol : primaryCation.symbol
          });
        });
      });
      // Internal interstitial atoms
      atoms.push({
        x: 0.15,
        y: 0.25,
        z: 0,
        symbol: anion.symbol,
        color: anion.color || '#ff8000',
        radius: 10,
        label: anion.symbol
      });
      atoms.push({
        x: -0.15,
        y: -0.25,
        z: 0,
        symbol: anion.symbol,
        color: anion.color || '#ff8000',
        radius: 10,
        label: anion.symbol
      });
    } else {
      // Orthorhombic / Monoclinic olivine or rutile representation
      corners.forEach(([x, y, z]) => {
        atoms.push({
          x: (x - 0.5) * 1.1,
          y: (y - 0.5) * 0.9,
          z: (z - 0.5) * 0.7,
          symbol: primaryCation.symbol,
          color: primaryCation.color || '#56b6ff',
          radius: 11,
          label: primaryCation.symbol
        });
      });

      // Internal octahedral channels
      const internals = [
        [0.2, 0.1, 0.1], [-0.2, -0.1, -0.1],
        [0, 0.3, -0.2], [0, -0.3, 0.2]
      ];
      internals.forEach(([x, y, z], i) => {
        const el = elements[i % elements.length] || secondary;
        atoms.push({
          x: x * 1.1,
          y: y * 0.9,
          z: z * 0.7,
          symbol: el.symbol,
          color: el.color || '#43d6a3',
          radius: 12,
          label: el.symbol
        });
      });
    }

    return atoms;
  };

  // Canvas 3D render loop
  useEffect(() => {
    let animationId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const render = () => {
      if (autoRotate && !isDragging) {
        rotationRef.current.ry += 0.008;
      }

      const localRx = rotationRef.current.rx;
      const localRy = rotationRef.current.ry;

      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      const scale = Math.min(width, height) * 0.55 * zoom;

      // 3D rotation projection helper
      const project = (x: number, y: number, z: number) => {
        // Rotate around Y axis
        const cosY = Math.cos(localRy);
        const sinY = Math.sin(localRy);
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;

        // Rotate around X axis
        const cosX = Math.cos(localRx);
        const sinX = Math.sin(localRx);
        const y2 = y * cosX - z1 * sinX;
        const z2 = y * sinX + z1 * cosX;

        // Perspective factor
        const fov = 3.5;
        const p = fov / (fov + z2);

        return {
          px: cx + x1 * scale * p,
          py: cy + y2 * scale * p,
          depth: z2,
          p
        };
      };

      // Draw Unit Cell Box Wireframe
      if (showUnitCell) {
        const hx = 0.5 * (material.latticeConstants?.a ? 1 : 1);
        const hy = 0.5 * (material.latticeConstants?.b ? material.latticeConstants.b / (material.latticeConstants.a || 1) : 1);
        const hz = 0.5 * (material.latticeConstants?.c ? material.latticeConstants.c / (material.latticeConstants.a || 1) : 1);

        const clampedHy = Math.max(0.35, Math.min(1.4, hy));
        const clampedHz = Math.max(0.35, Math.min(1.4, hz));

        const boxCorners = [
          [-hx, -clampedHy, -clampedHz], [hx, -clampedHy, -clampedHz],
          [hx, clampedHy, -clampedHz], [-hx, clampedHy, -clampedHz],
          [-hx, -clampedHy, clampedHz], [hx, -clampedHy, clampedHz],
          [hx, clampedHy, clampedHz], [-hx, clampedHy, clampedHz]
        ];

        const projectedBox = boxCorners.map(pt => project(pt[0], pt[1], pt[2]));

        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [4, 5], [5, 6], [6, 7], [7, 4],
          [0, 4], [1, 5], [2, 6], [3, 7]
        ];

        ctx.strokeStyle = 'rgba(86, 182, 255, 0.28)';
        ctx.lineWidth = 1.2;
        ctx.setLineDash([4, 4]);

        edges.forEach(([i, j]) => {
          ctx.beginPath();
          ctx.moveTo(projectedBox[i].px, projectedBox[i].py);
          ctx.lineTo(projectedBox[j].px, projectedBox[j].py);
          ctx.stroke();
        });

        ctx.setLineDash([]);

        // Origin axes
        const origin = project(0, 0, 0);
        const axisX = project(0.35, 0, 0);
        const axisY = project(0, 0.35, 0);
        const axisZ = project(0, 0, 0.35);

        // a-axis (red)
        ctx.strokeStyle = '#ff4d6d';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(origin.px, origin.py);
        ctx.lineTo(axisX.px, axisX.py);
        ctx.stroke();

        // b-axis (green)
        ctx.strokeStyle = '#43d6a3';
        ctx.beginPath();
        ctx.moveTo(origin.px, origin.py);
        ctx.lineTo(axisY.px, axisY.py);
        ctx.stroke();

        // c-axis (cyan)
        ctx.strokeStyle = '#56b6ff';
        ctx.beginPath();
        ctx.moveTo(origin.px, origin.py);
        ctx.lineTo(axisZ.px, axisZ.py);
        ctx.stroke();
      }

      // Generate and project atoms
      const atoms = generateAtoms();
      const projectedAtoms = atoms.map(atom => ({
        ...atom,
        ...project(atom.x, atom.y, atom.z)
      }));

      // Draw Chemical Bonds between close atoms
      if (showBonds) {
        ctx.strokeStyle = 'rgba(145, 167, 189, 0.35)';
        ctx.lineWidth = 1.8;
        for (let i = 0; i < projectedAtoms.length; i++) {
          for (let j = i + 1; j < projectedAtoms.length; j++) {
            const a1 = atoms[i];
            const a2 = atoms[j];
            const dx = a1.x - a2.x;
            const dy = a1.y - a2.y;
            const dz = a1.z - a2.z;
            const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
            // Bond if within bonding threshold distance
            if (dist > 0.1 && dist < 0.65) {
              const p1 = projectedAtoms[i];
              const p2 = projectedAtoms[j];
              ctx.beginPath();
              ctx.moveTo(p1.px, p1.py);
              ctx.lineTo(p2.px, p2.py);
              ctx.stroke();
            }
          }
        }
      }

      // Sort atoms by depth for correct 3D painter's z-ordering
      projectedAtoms.sort((a, b) => b.depth - a.depth);

      // Render 3D Spheres with lighting highlights
      projectedAtoms.forEach(atom => {
        const radius = Math.max(5, atom.radius * atom.p * zoom);

        // Ambient radial glow
        const glow = ctx.createRadialGradient(
          atom.px - radius * 0.3,
          atom.py - radius * 0.3,
          radius * 0.1,
          atom.px,
          atom.py,
          radius * 1.5
        );
        glow.addColorStop(0, '#ffffff');
        glow.addColorStop(0.3, atom.color);
        glow.addColorStop(0.85, atom.color);
        glow.addColorStop(1, '#050c18');

        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(atom.px, atom.py, radius, 0, Math.PI * 2);
        ctx.fill();

        // Outline
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Element Symbol Label
        if (showLabels && radius > 7) {
          ctx.fillStyle = '#ffffff';
          ctx.font = `bold ${Math.max(9, Math.round(radius * 0.9))}px Inter, sans-serif`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(atom.label, atom.px, atom.py);
        }
      });

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [material, zoom, autoRotate, showLabels, showUnitCell, showBonds, isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStart.x;
    const dy = e.clientY - dragStart.y;
    rotationRef.current.rx += dy * 0.008;
    rotationRef.current.ry += dx * 0.008;
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="relative rounded-2xl bg-[#091524] border border-[#1e334c] p-4 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between mb-3 z-10">
        <div>
          <div className="text-[11px] font-bold text-[#56b6ff] uppercase tracking-wider flex items-center gap-1.5">
            <Box className="w-3.5 h-3.5" />
            3D Crystal Unit Cell
          </div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            {material.crystalSystem} System
            <span className="text-xs font-normal text-[#91a7bd] px-2 py-0.5 rounded-full bg-[#102338] border border-[#1e3550]">
              {material.spaceGroup}
            </span>
          </h3>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 bg-[#0e1f33]/80 p-1 rounded-xl border border-[#1c334d]">
          <button
            id="toggle-rotate-btn"
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-1.5 rounded-lg text-xs flex items-center gap-1 transition-colors ${
              autoRotate ? 'bg-[#56b6ff]/20 text-[#56b6ff] border border-[#56b6ff]/40' : 'text-[#91a7bd] hover:text-white'
            }`}
            title="Toggle Auto Rotation"
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          </button>
          <button
            id="zoom-in-btn"
            onClick={() => setZoom(z => Math.min(2.0, z + 0.15))}
            className="p-1.5 rounded-lg text-[#91a7bd] hover:text-white hover:bg-[#152942]"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            id="zoom-out-btn"
            onClick={() => setZoom(z => Math.max(0.6, z - 0.15))}
            className="p-1.5 rounded-lg text-[#91a7bd] hover:text-white hover:bg-[#152942]"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            id="reset-view-btn"
            onClick={() => {
              rotationRef.current = { rx: 0.35, ry: -0.55 };
              setZoom(1.1);
            }}
            className="p-1.5 rounded-lg text-[#91a7bd] hover:text-white hover:bg-[#152942]"
            title="Reset Orientation"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Interactive Canvas */}
      <div className="relative flex-1 min-h-[280px] w-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none rounded-xl overflow-hidden bg-gradient-to-b from-[#071321] to-[#0a182a]">
        <canvas
          ref={canvasRef}
          width={520}
          height={380}
          className="w-full h-full object-contain"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />

        {/* Drag Hint */}
        <div className="absolute top-2 left-2 text-[10px] text-[#6f879e] bg-[#0b1b2d]/70 px-2 py-1 rounded-md pointer-events-none backdrop-blur-sm border border-[#193149]">
          Drag to orbit • Scroll to zoom
        </div>

        {/* View toggles overlay */}
        <div className="absolute bottom-2 left-2 flex gap-1 z-10">
          <button
            onClick={() => setShowUnitCell(!showUnitCell)}
            className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
              showUnitCell ? 'bg-[#15314e] text-[#56b6ff] border-[#294c73]' : 'bg-[#0b1726] text-[#6e879f] border-[#1a2d42]'
            }`}
          >
            Unit Cell Box
          </button>
          <button
            onClick={() => setShowBonds(!showBonds)}
            className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
              showBonds ? 'bg-[#15314e] text-[#56b6ff] border-[#294c73]' : 'bg-[#0b1726] text-[#6e879f] border-[#1a2d42]'
            }`}
          >
            Bonds
          </button>
          <button
            onClick={() => setShowLabels(!showLabels)}
            className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
              showLabels ? 'bg-[#15314e] text-[#56b6ff] border-[#294c73]' : 'bg-[#0b1726] text-[#6e879f] border-[#1a2d42]'
            }`}
          >
            Atom Labels
          </button>
        </div>
      </div>

      {/* Lattice Constants Bar */}
      <div className="mt-3 pt-3 border-t border-[#182c42] grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-xs">
        <div className="bg-[#0b1828] p-1.5 rounded-lg border border-[#172d45]">
          <span className="text-[10px] text-[#718aa3] block">a</span>
          <strong className="text-[#eef6ff]">{material.latticeConstants?.a?.toFixed(2) || '5.40'} Å</strong>
        </div>
        <div className="bg-[#0b1828] p-1.5 rounded-lg border border-[#172d45]">
          <span className="text-[10px] text-[#718aa3] block">b</span>
          <strong className="text-[#eef6ff]">{material.latticeConstants?.b?.toFixed(2) || '5.40'} Å</strong>
        </div>
        <div className="bg-[#0b1828] p-1.5 rounded-lg border border-[#172d45]">
          <span className="text-[10px] text-[#718aa3] block">c</span>
          <strong className="text-[#eef6ff]">{material.latticeConstants?.c?.toFixed(2) || '7.20'} Å</strong>
        </div>
        <div className="bg-[#0b1828] p-1.5 rounded-lg border border-[#172d45]">
          <span className="text-[10px] text-[#718aa3] block">α</span>
          <strong className="text-[#eef6ff]">{material.latticeConstants?.alpha || 90}°</strong>
        </div>
        <div className="bg-[#0b1828] p-1.5 rounded-lg border border-[#172d45]">
          <span className="text-[10px] text-[#718aa3] block">β</span>
          <strong className="text-[#eef6ff]">{material.latticeConstants?.beta || 90}°</strong>
        </div>
        <div className="bg-[#0b1828] p-1.5 rounded-lg border border-[#172d45]">
          <span className="text-[10px] text-[#718aa3] block">γ</span>
          <strong className="text-[#eef6ff]">{material.latticeConstants?.gamma || 90}°</strong>
        </div>
      </div>

      {/* Elements Legend */}
      <div className="mt-2.5 flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-[#718aa3]">Atoms:</span>
        {material.elements.map(el => (
          <div key={el.symbol} className="flex items-center gap-1.5 bg-[#0d1e30] px-2 py-0.5 rounded-full border border-[#1b344d] text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: el.color || '#56b6ff' }} />
            <span className="text-white font-semibold">{el.symbol}</span>
            <span className="text-[10px] text-[#7891a9]">({el.name})</span>
          </div>
        ))}
      </div>
    </div>
  );
};
