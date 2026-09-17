import React from 'react';
import { MaterialData } from '../types';

interface PropertyRadarProps {
  material: MaterialData;
  compareWith?: MaterialData | null;
}

export const PropertyRadar: React.FC<PropertyRadarProps> = ({ material, compareWith }) => {
  const metrics = [
    { label: 'Thermal Stability', value: material.thermalStability || 85, compareVal: compareWith?.thermalStability },
    { label: 'Chemical Stability', value: material.chemicalStability || 80, compareVal: compareWith?.chemicalStability },
    { label: 'Mechanical Hardness', value: material.mechanicalHardness || 75, compareVal: compareWith?.mechanicalHardness },
    { label: 'Synthesizability', value: material.synthesizability || 85, compareVal: compareWith?.synthesizability },
    { label: 'Eco / Abundance', value: material.environmentalScore || 85, compareVal: compareWith?.environmentalScore },
    { label: 'Lattice Stability', value: material.stability || 90, compareVal: compareWith?.stability },
  ];

  const size = 260;
  const center = size / 2;
  const radius = size * 0.38;
  const total = metrics.length;

  const getCoordinates = (index: number, val: number) => {
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    const r = (val / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  // Build polygon points
  const points = metrics.map((m, i) => {
    const coord = getCoordinates(i, m.value);
    return `${coord.x},${coord.y}`;
  }).join(' ');

  const comparePoints = compareWith ? metrics.map((m, i) => {
    const coord = getCoordinates(i, m.compareVal || 50);
    return `${coord.x},${coord.y}`;
  }).join(' ') : null;

  // Grid levels: 25%, 50%, 75%, 100%
  const gridLevels = [25, 50, 75, 100];

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <svg width={size} height={size} className="overflow-visible">
        {/* Radial Web Grid */}
        {gridLevels.map(level => {
          const gridPoints = Array.from({ length: total }).map((_, i) => {
            const coord = getCoordinates(i, level);
            return `${coord.x},${coord.y}`;
          }).join(' ');
          return (
            <polygon
              key={level}
              points={gridPoints}
              fill={level === 100 ? '#0b192b' : 'none'}
              stroke="#1b3047"
              strokeWidth="1"
              strokeDasharray={level < 100 ? '2,2' : undefined}
            />
          );
        })}

        {/* Axis Lines */}
        {metrics.map((_, i) => {
          const edge = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={edge.x}
              y2={edge.y}
              stroke="#1c334d"
              strokeWidth="1.2"
            />
          );
        })}

        {/* Comparison Polygon if active */}
        {comparePoints && (
          <polygon
            points={comparePoints}
            fill="rgba(240, 144, 160, 0.25)"
            stroke="#f090a0"
            strokeWidth="2"
          />
        )}

        {/* Primary Material Polygon */}
        <polygon
          points={points}
          fill="rgba(86, 182, 255, 0.35)"
          stroke="#56b6ff"
          strokeWidth="2.5"
          className="transition-all duration-300"
        />

        {/* Metric Data Points */}
        {metrics.map((m, i) => {
          const coord = getCoordinates(i, m.value);
          const labelCoord = getCoordinates(i, 118);
          return (
            <g key={i}>
              <circle
                cx={coord.x}
                cy={coord.y}
                r="4.5"
                fill="#56b6ff"
                stroke="#07111f"
                strokeWidth="1.5"
              />
              <text
                x={labelCoord.x}
                y={labelCoord.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize="10"
                fill="#91a7bd"
                className="font-medium select-none"
              >
                {m.label.split(' ')[0]} ({m.value})
              </text>
            </g>
          );
        })}
      </svg>

      {/* Legend / Values Breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full mt-2 text-xs">
        {metrics.map((m, i) => (
          <div key={i} className="flex justify-between items-center bg-[#091626] px-2.5 py-1.5 rounded-lg border border-[#172c44]">
            <span className="text-[#849cb3] truncate">{m.label}</span>
            <strong className="text-[#56b6ff] font-bold ml-1">{m.value}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
};
