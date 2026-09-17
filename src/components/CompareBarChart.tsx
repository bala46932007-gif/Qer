import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell,
  ReferenceLine,
  LabelList
} from 'recharts';
import { MaterialData } from '../types';
import {
  Zap,
  Layers,
  ShieldCheck,
  Flame,
  Award,
  Columns,
  LayoutGrid,
  Atom,
  ChevronDown,
  Info
} from 'lucide-react';

interface CompareBarChartProps {
  materials: MaterialData[];
  onSelectForDossier: (formula: string) => void;
}

// 10 distinct, vibrant, accessible candidate colors for 3 to 10 materials
export const CANDIDATE_COLORS = [
  { fill: '#38bdf8', stroke: '#0284c7', bg: 'bg-[#38bdf8]', text: 'text-[#38bdf8]', name: 'Sky Blue' },
  { fill: '#34d399', stroke: '#059669', bg: 'bg-[#34d399]', text: 'text-[#34d399]', name: 'Emerald' },
  { fill: '#a78bfa', stroke: '#7c3aed', bg: 'bg-[#a78bfa]', text: 'text-[#a78bfa]', name: 'Violet' },
  { fill: '#fbbf24', stroke: '#d97706', bg: 'bg-[#fbbf24]', text: 'text-[#fbbf24]', name: 'Amber' },
  { fill: '#f87171', stroke: '#dc2626', bg: 'bg-[#f87171]', text: 'text-[#f87171]', name: 'Coral Red' },
  { fill: '#2dd4bf', stroke: '#0d9488', bg: 'bg-[#2dd4bf]', text: 'text-[#2dd4bf]', name: 'Teal' },
  { fill: '#818cf8', stroke: '#4f46e5', bg: 'bg-[#818cf8]', text: 'text-[#818cf8]', name: 'Indigo' },
  { fill: '#f472b6', stroke: '#db2777', bg: 'bg-[#f472b6]', text: 'text-[#f472b6]', name: 'Rose' },
  { fill: '#fb923c', stroke: '#ea580c', bg: 'bg-[#fb923c]', text: 'text-[#fb923c]', name: 'Orange' },
  { fill: '#a3e635', stroke: '#65a30d', bg: 'bg-[#a3e635]', text: 'text-[#a3e635]', name: 'Lime' },
];

export type MetricKey =
  | 'bandGap'
  | 'formationEnergy'
  | 'volume'
  | 'energyAboveHull'
  | 'density'
  | 'thermalStability'
  | 'chemicalStability'
  | 'synthesizability'
  | 'screeningScore'
  | 'confidence';

export interface MetricOption {
  key: MetricKey;
  label: string;
  unit: string;
  category: string;
  icon: React.ReactNode;
  description: string;
}

export const METRIC_OPTIONS: MetricOption[] = [
  {
    key: 'bandGap',
    label: 'Band Gap (Eg)',
    unit: 'eV',
    category: 'Prioritized Core Metric',
    icon: <Zap className="w-3.5 h-3.5 text-[#38bdf8]" />,
    description: 'Fundamental optical & electronic excitation bandgap (eV)',
  },
  {
    key: 'formationEnergy',
    label: 'Formation Energy (Ef)',
    unit: 'eV/atom',
    category: 'Prioritized Core Metric',
    icon: <ShieldCheck className="w-3.5 h-3.5 text-[#f87171]" />,
    description: 'Enthalpy of formation per atom (more negative = more exothermic & stable)',
  },
  {
    key: 'volume',
    label: 'Unit Cell Volume (V)',
    unit: 'Å³',
    category: 'Prioritized Core Metric',
    icon: <Layers className="w-3.5 h-3.5 text-[#34d399]" />,
    description: 'Unit cell crystallographic volume derived from lattice parameters (Å³)',
  },
  {
    key: 'energyAboveHull',
    label: 'Energy Above Hull (Ehull)',
    unit: 'eV/atom',
    category: 'Prioritized Core Metric',
    icon: <Award className="w-3.5 h-3.5 text-[#fbbf24]" />,
    description: 'Distance to thermodynamic convex hull (0.000 = ground state, <0.05 = synthesizable)',
  },
  {
    key: 'density',
    label: 'Theoretical Density',
    unit: 'g/cm³',
    category: 'Structural & Mass',
    icon: <Layers className="w-3.5 h-3.5 text-[#2dd4bf]" />,
    description: 'Mass density based on crystallographic unit cell volume',
  },
  {
    key: 'thermalStability',
    label: 'Thermal Stability',
    unit: '%',
    category: 'Thermal & Phase',
    icon: <Flame className="w-3.5 h-3.5 text-[#fbbf24]" />,
    description: 'Resistance to phase degradation at high temperatures',
  },
  {
    key: 'chemicalStability',
    label: 'Chemical Stability',
    unit: '%',
    category: 'Chemical Resistance',
    icon: <ShieldCheck className="w-3.5 h-3.5 text-[#a78bfa]" />,
    description: 'Electrochemical & ambient oxidation stability',
  },
  {
    key: 'synthesizability',
    label: 'Synthesizability',
    unit: '%',
    category: 'Synthesis Viability',
    icon: <Atom className="w-3.5 h-3.5 text-[#2dd4bf]" />,
    description: 'Experimental solid-state synthesizability & yield',
  },
  {
    key: 'screeningScore',
    label: 'Overall Screening Score',
    unit: '/100',
    category: 'Figure of Merit',
    icon: <Award className="w-3.5 h-3.5 text-[#818cf8]" />,
    description: 'Multi-criteria weighted composite discovery score',
  },
];

export const CompareBarChart: React.FC<CompareBarChartProps> = ({
  materials,
  onSelectForDossier,
}) => {
  // 3 distinct metrics selected for the 3 separate bar graphs, defaulted to user's prioritized properties
  const [metric1, setMetric1] = useState<MetricKey>('bandGap');
  const [metric2, setMetric2] = useState<MetricKey>('formationEnergy');
  const [metric3, setMetric3] = useState<MetricKey>('energyAboveHull');

  // Layout presentation: 'grid' (3 columns) or 'rows' (3 stacked full-width graphs)
  const [layoutMode, setLayoutMode] = useState<'grid' | 'rows'>(
    materials.length >= 7 ? 'rows' : 'grid'
  );

  const count = materials.length;

  // Format data points for each candidate for a specific metric
  const formatMetricData = (metricKey: MetricKey) => {
    return materials.map((m, index) => {
      let val = 0;
      let rawLabel = '';
      let compactLabel = '';
      let subtext = '';

      switch (metricKey) {
        case 'bandGap':
          val = m.bandGap;
          rawLabel = `${m.bandGap.toFixed(2)} eV`;
          compactLabel = `${m.bandGap.toFixed(1)} eV`;
          subtext = m.bandType || 'Direct';
          break;
        case 'density':
          val = m.density;
          rawLabel = `${m.density.toFixed(2)} g/cm³`;
          compactLabel = `${m.density.toFixed(1)}`;
          subtext = m.crystalSystem || 'Lattice';
          break;
        case 'thermalStability':
          val = m.thermalStability;
          rawLabel = `${m.thermalStability}%`;
          compactLabel = `${m.thermalStability}%`;
          subtext = `Chem: ${m.chemicalStability}%`;
          break;
        case 'chemicalStability':
          val = m.chemicalStability;
          rawLabel = `${m.chemicalStability}%`;
          compactLabel = `${m.chemicalStability}%`;
          subtext = 'Ambient inertness';
          break;
        case 'synthesizability':
          val = m.synthesizability;
          rawLabel = `${m.synthesizability}%`;
          compactLabel = `${m.synthesizability}%`;
          subtext = m.spaceGroup || 'Solid-state';
          break;
        case 'formationEnergy':
          // For visualization, show magnitude or value; we display exact signed value on label
          val = Math.abs(m.formationEnergy);
          rawLabel = `${m.formationEnergy} eV/atom`;
          compactLabel = `${m.formationEnergy} eV`;
          subtext = m.formationEnergy <= 0 ? 'Exothermic (Stable)' : 'Endothermic';
          break;
        case 'volume':
          val = m.volume ?? 100;
          rawLabel = `${(m.volume ?? 0).toFixed(1)} Å³`;
          compactLabel = `${(m.volume ?? 0).toFixed(0)} Å³`;
          subtext = `${m.crystalSystem || 'Lattice'} Unit Cell`;
          break;
        case 'energyAboveHull':
          val = m.energyAboveHull ?? 0;
          rawLabel = `${(m.energyAboveHull ?? 0).toFixed(3)} eV/atom`;
          compactLabel = (m.energyAboveHull ?? 0) === 0 ? '0.000 (On Hull)' : `${(m.energyAboveHull ?? 0).toFixed(3)} eV`;
          subtext = (m.energyAboveHull ?? 0) === 0 ? 'On Convex Hull' : (m.energyAboveHull ?? 0) <= 0.05 ? 'Metastable (<50 meV)' : 'Unstable';
          break;
        case 'screeningScore':
          val = m.screeningScore;
          rawLabel = `${m.screeningScore}/100`;
          compactLabel = `${m.screeningScore}`;
          subtext = 'Composite FOM';
          break;
        case 'confidence':
          val = m.confidence;
          rawLabel = `${m.confidence}%`;
          compactLabel = `${m.confidence}%`;
          subtext = 'ML Confidence';
          break;
      }

      const colorSet = CANDIDATE_COLORS[index % CANDIDATE_COLORS.length];

      return {
        formula: m.formula,
        name: m.name,
        value: val,
        rawLabel,
        compactLabel,
        subtext,
        color: colorSet.fill,
        stroke: colorSet.stroke,
      };
    });
  };

  // Find leader for a given metric
  const getLeader = (data: ReturnType<typeof formatMetricData>, metricKey: MetricKey) => {
    if (data.length === 0) return null;
    if (metricKey === 'formationEnergy') {
      const sorted = [...materials].sort((a, b) => a.formationEnergy - b.formationEnergy);
      return sorted[0];
    }
    if (metricKey === 'energyAboveHull') {
      const sorted = [...materials].sort((a, b) => (a.energyAboveHull ?? 0) - (b.energyAboveHull ?? 0));
      return sorted[0];
    }
    const sorted = [...data].sort((a, b) => b.value - a.value);
    return sorted[0];
  };

  // Render a Single Distinct Bar Graph Card
  const renderBarCard = (
    index: number,
    selectedMetric: MetricKey,
    onMetricChange: (m: MetricKey) => void
  ) => {
    const data = formatMetricData(selectedMetric);
    const metricConfig = METRIC_OPTIONS.find(o => o.key === selectedMetric) || METRIC_OPTIONS[0];
    const leader = getLeader(data, selectedMetric);

    const values = data.map(d => d.value);
    const avgValue = values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;

    // Dynamic responsive parameters based on candidate count (3 to 10)
    const barSize = count <= 4 ? 40 : count <= 6 ? 28 : count <= 8 ? 20 : 16;
    const xAxisAngle = count <= 4 ? 0 : count <= 7 ? -25 : -35;
    const xAxisHeight = count <= 4 ? 28 : count <= 7 ? 44 : 54;
    const xAxisFontSize = count <= 4 ? 12 : count <= 7 ? 10 : 9;
    const labelFontSize = count <= 4 ? 11 : count <= 6 ? 9.5 : 8.5;
    const chartHeight = count <= 5 ? 270 : 300;

    return (
      <div
        key={`comparison-${index}`}
        className="rounded-2xl bg-[#0a1626] border border-[#1b344e] p-4 sm:p-5 flex flex-col justify-between shadow-xl relative overflow-hidden"
      >
        {/* Top Header & Metric Selector */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-[#14283d]">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#0f2338] text-[#56b6ff] border border-[#1c3e64]">
                GRAPH #{index}
              </span>
              <span className="text-xs font-semibold text-[#8ca3ba]">
                {metricConfig.category}
              </span>
            </div>

            {/* Metric Switcher Dropdown */}
            <div className="relative">
              <select
                value={selectedMetric}
                onChange={e => onMetricChange(e.target.value as MetricKey)}
                aria-label={`Select metric for comparison graph ${index}`}
                className="appearance-none bg-[#0e2136] hover:bg-[#142f4c] text-white text-xs font-bold pl-3 pr-7 py-1.5 rounded-xl border border-[#204060] focus:outline-none focus:border-[#42a5f5] cursor-pointer transition-colors"
              >
                {METRIC_OPTIONS.map(opt => (
                  <option key={opt.key} value={opt.key} className="bg-[#0b1726] text-white">
                    {opt.label} ({opt.unit})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#56b6ff] absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>

          {/* Graph Title & Description */}
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2">
                {metricConfig.icon}
                <h4 className="text-base font-bold text-white tracking-tight">
                  {metricConfig.label} ({metricConfig.unit})
                </h4>
              </div>
              <p className="text-xs text-[#718da8] mt-0.5">{metricConfig.description}</p>
            </div>

            {/* Leader Pill */}
            {leader && (
              <div className="flex items-center gap-1.5 bg-[#09221a] border border-[#144b34] px-2.5 py-1 rounded-lg shrink-0">
                <Award className="w-3 h-3 text-[#43d6a3]" />
                <div className="text-[10px] leading-tight">
                  <span className="text-[#68b08f] block uppercase font-mono">Leader</span>
                  <span className="text-white font-mono font-bold">
                    {'formula' in leader ? leader.formula : ''}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* RECHARTS BAR GRAPH - Automatically scales from 3 to 10 bars */}
          <div style={{ height: `${chartHeight}px` }} className="w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{ top: 25, right: 10, left: -15, bottom: xAxisAngle !== 0 ? 15 : 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#13273e" vertical={false} />
                <XAxis
                  dataKey="formula"
                  stroke="#5f7e9b"
                  tick={{
                    fill: '#ffffff',
                    fontSize: xAxisFontSize,
                    fontWeight: 700,
                  }}
                  angle={xAxisAngle}
                  textAnchor={xAxisAngle !== 0 ? 'end' : 'middle'}
                  height={xAxisHeight}
                  interval={0}
                />
                <YAxis
                  stroke="#5f7e9b"
                  tick={{ fill: '#7f9cb8', fontSize: 10 }}
                  unit={metricConfig.unit !== '%' && metricConfig.unit !== '/100' ? ` ${metricConfig.unit}` : ''}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(255, 255, 255, 0.04)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload;
                      return (
                        <div className="bg-[#071322] border border-[#20446b] p-3 rounded-xl shadow-2xl text-xs space-y-1 z-50">
                          <p className="font-bold text-white font-mono text-sm">{item.formula}</p>
                          <p className="text-[#86a6c4]">{item.name}</p>
                          <p className="text-[#56b6ff] font-mono font-bold text-base mt-1">
                            {item.rawLabel}
                          </p>
                          <p className="text-[11px] text-[#6987a3]">{item.subtext}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine
                  y={avgValue}
                  stroke="#4f6e8a"
                  strokeDasharray="3 3"
                  label={{
                    value: `Avg: ${avgValue.toFixed(1)}`,
                    fill: '#8da6be',
                    fontSize: 10,
                    position: 'top',
                  }}
                />
                <Bar dataKey="value" radius={[5, 5, 0, 0]} maxBarSize={barSize}>
                  <LabelList
                    dataKey={count > 7 ? 'compactLabel' : 'rawLabel'}
                    position="top"
                    fill="#badefc"
                    fontSize={labelFontSize}
                    fontWeight={600}
                    offset={5}
                  />
                  {data.map((entry, idx) => (
                    <Cell
                      key={`cell-${idx}`}
                      fill={entry.color}
                      stroke={entry.stroke}
                      className="cursor-pointer hover:opacity-90 transition-opacity"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Micro Candidate Listing & Dossier Trigger - 2 cols if > 5 items */}
        <div className="mt-4 pt-3 border-t border-[#13283f]">
          <div className="text-[10px] uppercase font-mono tracking-wider text-[#617b96] mb-2 flex items-center justify-between">
            <span>Candidate Breakdown ({count} items)</span>
            <span className="text-[#43d6a3]">Click to inspect dossier</span>
          </div>

          <div
            className={
              count > 5
                ? 'grid grid-cols-1 sm:grid-cols-2 gap-1.5 max-h-[160px] overflow-y-auto pr-1'
                : 'space-y-1.5'
            }
          >
            {data.map(item => (
              <div
                key={item.formula}
                onClick={() => onSelectForDossier(item.formula)}
                className="flex items-center justify-between py-1 px-2 rounded-lg bg-[#08121f] hover:bg-[#10253d] border border-[#14263b] hover:border-[#224b75] transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-mono font-bold text-white text-xs group-hover:text-[#56b6ff] transition-colors truncate">
                    {item.formula}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-1">
                  <span className="font-mono text-[11px] font-bold text-[#bfe1ff]">
                    {item.rawLabel}
                  </span>
                  <span className="text-[9px] text-[#56b6ff] opacity-0 group-hover:opacity-100 transition-opacity">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#091626] p-4 rounded-2xl border border-[#1a334d]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-black text-white">
              3 Separate Comparison Bar Graphs
            </h3>
            <span className="text-xs font-mono font-bold text-[#43d6a3] bg-[#0c241a] px-2 py-0.5 rounded border border-[#184e36]">
              {count} of 10 Elements/Materials
            </span>
          </div>
          <p className="text-xs text-[#7693af] mt-0.5">
            Evaluating {count} candidate compositions across 3 independent, customized physical metric benchmarks simultaneously.
          </p>
        </div>

        {/* Layout Mode & Color Legend */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Candidate Count Pill */}
          <div className="flex items-center gap-1 text-xs text-[#6e8ba8] bg-[#07111d] px-3 py-1.5 rounded-xl border border-[#162a40]">
            <Info className="w-3.5 h-3.5 text-[#56b6ff]" />
            <span>Comparison Pool: <b className="text-white">{count}</b> (Range: 3 to 10)</span>
          </div>

          {/* Layout Toggle */}
          <div className="flex items-center gap-1 bg-[#07111d] p-1 rounded-xl border border-[#162a40]">
            <button
              onClick={() => setLayoutMode('grid')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                layoutMode === 'grid'
                  ? 'bg-[#15426e] text-white shadow-sm shadow-[#15426e]'
                  : 'text-[#627e9b] hover:text-white'
              }`}
              title="3-Column Side-by-Side Grid"
            >
              <Columns className="w-3.5 h-3.5 text-[#56b6ff]" />
              <span className="hidden sm:inline">3-Column Grid</span>
            </button>
            <button
              onClick={() => setLayoutMode('rows')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                layoutMode === 'rows'
                  ? 'bg-[#15426e] text-white shadow-sm shadow-[#15426e]'
                  : 'text-[#627e9b] hover:text-white'
              }`}
              title="Full-Width Stacked Rows (Great for 7-10 candidates)"
            >
              <LayoutGrid className="w-3.5 h-3.5 text-[#56b6ff]" />
              <span className="hidden sm:inline">Stacked Rows</span>
            </button>
          </div>
        </div>
      </div>

      {/* Candidate Color Legend Bar (3 to 10 chips with unique colors) */}
      <div className="flex items-center gap-2 bg-[#091524] px-4 py-2.5 rounded-xl border border-[#18314c] flex-wrap">
        <span className="text-[11px] text-[#627e9b] font-mono uppercase font-bold shrink-0">
          Color Key ({count}):
        </span>
        {materials.map((m, idx) => {
          const colorSet = CANDIDATE_COLORS[idx % CANDIDATE_COLORS.length];
          return (
            <button
              key={m.formula}
              onClick={() => onSelectForDossier(m.formula)}
              className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[#0d1f33] hover:bg-[#152e4a] border border-[#1d3c5e] text-[11px] font-mono font-bold text-white transition-colors cursor-pointer"
              title={`Inspect 3D Dossier for ${m.formula}`}
            >
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm"
                style={{ backgroundColor: colorSet.fill }}
              />
              <span>{m.formula}</span>
            </button>
          );
        })}
      </div>

      {/* 3 SEPARATE BAR GRAPHS CONTAINER */}
      <div
        className={
          layoutMode === 'grid'
            ? 'grid grid-cols-1 lg:grid-cols-3 gap-6'
            : 'space-y-6'
        }
      >
        {/* GRAPH 1 */}
        {renderBarCard(1, metric1, setMetric1)}

        {/* GRAPH 2 */}
        {renderBarCard(2, metric2, setMetric2)}

        {/* GRAPH 3 */}
        {renderBarCard(3, metric3, setMetric3)}
      </div>
    </div>
  );
};
