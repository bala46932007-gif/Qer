import React, { useState } from 'react';
import {
  GitCompare,
  Sparkles,
  X,
  Plus,
  BarChart3,
  LayoutGrid,
  RefreshCw,
  AlertTriangle,
  Layers,
  Sparkle
} from 'lucide-react';
import { MaterialData } from '../types';
import { PropertyRadar } from './PropertyRadar';
import { CompareBarChart, CANDIDATE_COLORS } from './CompareBarChart';
import { INITIAL_PRESET_MATERIALS, generateAlgorithmicMaterialData } from '../data/materialsDatabase';

interface CompareViewProps {
  compareList: string[];
  onRemoveFromCompare: (formula: string) => void;
  onAddToCompare: (formula: string) => void;
  onSetCompareList?: (formulas: string[]) => void;
  onSelectForDossier: (formula: string) => void;
  allMaterials: Record<string, MaterialData>;
}

interface ComparisonResult {
  verdict: string;
  bestForTarget: string;
  comparisonPoints: { dimension: string; winner: string; analysis: string }[];
  experimentalRecommendations: string[];
}

// Preset candidate cohorts spanning 3 to 10 elements/materials
const COHORT_PRESETS = [
  {
    id: 'top3',
    label: '3 Baseline Benchmark',
    count: 3,
    description: 'Cathode, Photocatalyst, Semiconductor',
    formulas: ['LiFePO4', 'TiO2', 'SiC'],
  },
  {
    id: 'battery5',
    label: '5 Energy & Battery',
    count: 5,
    description: 'Polyanion, Layered, Spinel, Sodium Host',
    formulas: ['LiFePO4', 'LiCoO2', 'LiMn2O4', 'NMC811', 'Na3V2(PO4)3'],
  },
  {
    id: 'semiconductors7',
    label: '7 Power Semiconductors',
    count: 7,
    description: 'Wide bandgap & RF optoelectronics',
    formulas: ['SiC', 'GaN', 'Diamond', 'ZnO', 'AlN', 'GaAs', 'TiO2'],
  },
  {
    id: 'mixed10',
    label: '10 Advanced Compounds',
    count: 10,
    description: 'Diverse oxides, halides, 2D & nitrides',
    formulas: [
      'LiFePO4',
      'TiO2',
      'SiC',
      'GaN',
      'BaTiO3',
      'SrTiO3',
      'MoS2',
      'ZnO',
      'CsPbI3',
      'Al2O3',
    ],
  },
  {
    id: 'elements10',
    label: '10 Pure Elemental Solids',
    count: 10,
    description: 'Benchmark elemental crystals & metals',
    formulas: ['Fe', 'Cu', 'Ti', 'Si', 'Al', 'Ni', 'Zn', 'Mo', 'C', 'W'],
  },
];

// Quick toggle chips for popular elements & compounds
const QUICK_PICK_MATERIALS = [
  { formula: 'Fe', type: 'element' },
  { formula: 'Cu', type: 'element' },
  { formula: 'Ti', type: 'element' },
  { formula: 'Si', type: 'element' },
  { formula: 'Al', type: 'element' },
  { formula: 'Ni', type: 'element' },
  { formula: 'Mo', type: 'element' },
  { formula: 'C', type: 'element' },
  { formula: 'LiFePO4', type: 'compound' },
  { formula: 'TiO2', type: 'compound' },
  { formula: 'SiC', type: 'compound' },
  { formula: 'GaN', type: 'compound' },
  { formula: 'BaTiO3', type: 'compound' },
  { formula: 'SrTiO3', type: 'compound' },
  { formula: 'MoS2', type: 'compound' },
  { formula: 'ZnO', type: 'compound' },
  { formula: 'CsPbI3', type: 'compound' },
  { formula: 'Al2O3', type: 'compound' },
];

export const CompareView: React.FC<CompareViewProps> = ({
  compareList,
  onRemoveFromCompare,
  onAddToCompare,
  onSetCompareList,
  onSelectForDossier,
  allMaterials,
}) => {
  const [newFormulaInput, setNewFormulaInput] = useState('');
  const [targetApplication, setTargetApplication] = useState('High Energy Density & Thermal Stability');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiComparison, setAiComparison] = useState<ComparisonResult | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<'bargraph' | 'cards'>('bargraph');
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  // Resolve full material data for each formula in compareList
  const materials: MaterialData[] = compareList.map(formula => {
    return (
      allMaterials[formula] ||
      INITIAL_PRESET_MATERIALS[formula] ||
      generateAlgorithmicMaterialData(formula)
    );
  });

  const handleAddFormula = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newFormulaInput.trim();
    if (!clean) return;

    if (compareList.some(f => f.toUpperCase() === clean.toUpperCase())) {
      setWarningMessage(`${clean} is already in the comparison pool.`);
      setTimeout(() => setWarningMessage(null), 3500);
      setNewFormulaInput('');
      return;
    }

    if (compareList.length >= 10) {
      setWarningMessage('Maximum limit of 10 candidate materials reached. Remove one before adding another.');
      setTimeout(() => setWarningMessage(null), 4000);
      return;
    }

    onAddToCompare(clean);
    setNewFormulaInput('');
    setWarningMessage(null);
  };

  const handleToggleCandidate = (formula: string) => {
    const isSelected = compareList.some(f => f.toUpperCase() === formula.toUpperCase());

    if (isSelected) {
      if (compareList.length <= 3) {
        setWarningMessage('Comparison requires a minimum of 3 candidate materials.');
        setTimeout(() => setWarningMessage(null), 3500);
        return;
      }
      onRemoveFromCompare(formula);
      setWarningMessage(null);
    } else {
      if (compareList.length >= 10) {
        setWarningMessage('Maximum limit of 10 candidate materials reached. Remove one before adding.');
        setTimeout(() => setWarningMessage(null), 4000);
        return;
      }
      onAddToCompare(formula);
      setWarningMessage(null);
    }
  };

  const handleApplyPreset = (formulas: string[]) => {
    if (onSetCompareList) {
      onSetCompareList(formulas);
    } else {
      // Fallback if prop not provided
      formulas.forEach(f => {
        if (!compareList.includes(f)) onAddToCompare(f);
      });
    }
    setWarningMessage(null);
    setAiComparison(null);
  };

  const handleRunAiEvaluation = async () => {
    if (materials.length < 3) {
      setWarningMessage('Select at least 3 candidates to run trade-off synthesis.');
      return;
    }
    setIsEvaluating(true);
    setEvalError(null);
    try {
      const response = await fetch('/api/compare-materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          formulas: materials.map(m => m.formula),
          targetContext: targetApplication,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.comparison) {
        setAiComparison(data.comparison);
      }
    } catch (err: any) {
      console.error(err);
      setEvalError('AI comparison is operating in offline mode. Standard parameter matrix is shown below.');
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#10233b] via-[#0b1c30] to-[#091524] border border-[#1b324d] p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-bold text-[#56b6ff] uppercase tracking-wider flex items-center gap-1.5">
                <GitCompare className="w-4 h-4" />
                Multi-Candidate Comparison Matrix
              </span>
              <span className="text-[11px] font-mono font-bold bg-[#0e2742] text-[#56b6ff] px-2.5 py-0.5 rounded-full border border-[#1f4975]">
                {materials.length} / 10 Candidates (Min 3, Max 10)
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Compare 3 to 10 Materials
            </h2>
            <p className="text-xs text-[#8ca4bb] max-w-2xl mt-1 leading-relaxed">
              Dynamically benchmark electronic band gaps, density, formation enthalpy, and stability profiles
              across 3 up to 10 competing compositions side-by-side.
            </p>
          </div>

          {/* Add candidate input */}
          <form onSubmit={handleAddFormula} className="flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={newFormulaInput}
              onChange={e => setNewFormulaInput(e.target.value)}
              placeholder="Add element/formula e.g. W, BaTiO3"
              disabled={materials.length >= 10}
              className="bg-[#081220] border border-[#1d3550] rounded-xl px-3 py-2 text-xs text-white focus:border-[#56b6ff] outline-none min-w-[190px] disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={materials.length >= 10 || !newFormulaInput.trim()}
              className="px-4 py-2 rounded-xl bg-[#142c47] hover:bg-[#1a385a] text-[#56b6ff] hover:text-white text-xs font-bold border border-[#23456b] flex items-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </form>
        </div>

        {/* Dynamic Warning / Notice Banner if applicable */}
        {warningMessage && (
          <div className="mt-3 p-2.5 rounded-xl bg-[#2a1b08] border border-[#6b4712] text-amber-300 text-xs flex items-center gap-2 animate-fadeIn">
            <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
            <span>{warningMessage}</span>
          </div>
        )}

        {/* 1-CLICK COHORT PRESETS (3, 5, 7, 10 elements) */}
        <div className="mt-4 pt-4 border-t border-[#162c44]">
          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
            <span className="text-[11px] font-mono uppercase text-[#718da8] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#56b6ff]" />
              Quick Cohort Presets (3 to 10 Elements):
            </span>
            <span className="text-[10px] text-[#56b6ff]">
              Click any cohort to populate comparison immediately
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {COHORT_PRESETS.map(preset => {
              const isActive =
                preset.formulas.length === materials.length &&
                preset.formulas.every(f => compareList.includes(f));

              return (
                <button
                  key={preset.id}
                  onClick={() => handleApplyPreset(preset.formulas)}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    isActive
                      ? 'bg-[#13375c] border-[#388bd9] text-white shadow-md'
                      : 'bg-[#0b1828] hover:bg-[#10243d] border-[#18314e] text-[#90a8c2] hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold font-mono">{preset.label}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#061220] rounded text-[#56b6ff]">
                      {preset.count}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#65829e] truncate">{preset.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* QUICK-PICK ELEMENT & COMPOUND TOGGLE CHIPS */}
        <div className="mt-4 pt-3 border-t border-[#162c44]">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="text-[11px] font-mono uppercase text-[#718da8]">
              Quick Toggle Elements & Oxides:
            </span>
            <span className="text-[10px] text-[#5a7690]">
              (Click to add/remove up to 10)
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {QUICK_PICK_MATERIALS.map(chip => {
              const isSelected = compareList.some(
                f => f.toUpperCase() === chip.formula.toUpperCase()
              );

              return (
                <button
                  key={chip.formula}
                  onClick={() => handleToggleCandidate(chip.formula)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#154674] text-white border border-[#3b8fd9] shadow-sm'
                      : 'bg-[#091728] hover:bg-[#102844] text-[#819db8] hover:text-white border border-[#162d47]'
                  }`}
                  title={
                    isSelected
                      ? `Remove ${chip.formula}`
                      : `Add ${chip.formula} (Current: ${materials.length}/10)`
                  }
                >
                  <span>{chip.formula}</span>
                  {isSelected && <span className="text-[#38bdf8] text-[10px]">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Candidates Active Pills & AI Action */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#162c44] flex-wrap">
          <span className="text-xs font-semibold text-[#8ca3ba] shrink-0">
            Active Pool ({materials.length}):
          </span>

          <div className="flex items-center gap-2 flex-wrap">
            {materials.map((m, idx) => {
              const colorSet = CANDIDATE_COLORS[idx % CANDIDATE_COLORS.length];
              return (
                <div
                  key={m.formula}
                  className="flex items-center gap-2 bg-[#0e2136] px-3 py-1 rounded-full border border-[#1d3652] text-xs transition-colors hover:border-[#2f5580]"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: colorSet.fill }}
                  />
                  <span className="font-mono font-bold text-white">{m.formula}</span>
                  <span className="text-[10px] text-[#718aa3]">({m.screeningScore}/100)</span>
                  {materials.length > 3 && (
                    <button
                      onClick={() => handleToggleCandidate(m.formula)}
                      className="text-[#718aa3] hover:text-[#ff5c5c] ml-0.5"
                      title="Remove candidate"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* AI Evaluate Button */}
          <button
            onClick={handleRunAiEvaluation}
            disabled={isEvaluating || materials.length < 3}
            className="ml-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#48aef5] to-[#6c72ff] hover:opacity-90 text-white text-xs font-bold flex items-center gap-2 shadow-lg disabled:opacity-50 transition-all shrink-0"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing Trade-offs...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Run AI Trade-Off Synthesis ({materials.length})</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Comparative Insights Box (if evaluated) */}
      {aiComparison && (
        <div className="rounded-2xl bg-[#0a1829] border border-[#22456b] p-6 shadow-xl animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-bold text-[#43d6a3] uppercase tracking-wider mb-2">
            <Sparkle className="w-4 h-4" />
            Gemini 3.8 Flash Comparative Trade-off Analysis
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{aiComparison.verdict}</h3>
          <p className="text-xs text-[#9eb6cc] leading-relaxed mb-4">
            <b>Optimal Candidate for Target Application:</b>{' '}
            <span className="text-[#56b6ff] font-bold text-sm ml-1 font-mono">
              {aiComparison.bestForTarget}
            </span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {aiComparison.comparisonPoints.map((point, idx) => (
              <div key={idx} className="bg-[#081220] p-3 rounded-xl border border-[#162a40]">
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span className="text-[#56b6ff] font-bold">{point.dimension}</span>
                  <span className="text-[10px] bg-[#10273f] text-[#91bde4] px-2 py-0.5 rounded border border-[#1b3d62] font-mono">
                    Leader: {point.winner}
                  </span>
                </div>
                <p className="text-xs text-[#829bb3] leading-relaxed">{point.analysis}</p>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#718da6] uppercase tracking-wider mb-1.5">
              Experimental Synthesis & Testing Directives:
            </h4>
            <ul className="text-xs text-[#a2bccf] list-disc pl-4 space-y-1">
              {aiComparison.experimentalRecommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* View Mode Switcher Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <span>Candidate Comparison Matrix</span>
            <span className="text-xs font-mono font-normal text-[#56b6ff] bg-[#0c2238] px-2.5 py-0.5 rounded-full border border-[#1b3d62]">
              {materials.length} Materials
            </span>
          </h3>
          <p className="text-xs text-[#718aa3]">
            {displayMode === 'bargraph'
              ? '3 independent bar graphs comparing physical, electronic, and thermodynamic benchmarks side-by-side.'
              : 'Multi-axis radar and parameter profile card grid for each candidate.'}
          </p>
        </div>

        <div className="flex items-center gap-1 bg-[#091524] p-1 rounded-xl border border-[#19324e] self-start sm:self-auto">
          <button
            onClick={() => setDisplayMode('bargraph')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              displayMode === 'bargraph'
                ? 'bg-[#15426e] text-white shadow-md shadow-[#15426e]'
                : 'text-[#6f8da8] hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[#56b6ff]" />
            <span>3 Bar Graphs View</span>
          </button>

          <button
            onClick={() => setDisplayMode('cards')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              displayMode === 'cards'
                ? 'bg-[#15426e] text-white shadow-md shadow-[#15426e]'
                : 'text-[#6f8da8] hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5 text-[#56b6ff]" />
            <span>Card Grid View ({materials.length})</span>
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE MATRIX VIEW */}
      {displayMode === 'bargraph' ? (
        <CompareBarChart
          materials={materials}
          onSelectForDossier={onSelectForDossier}
        />
      ) : (
        /* Comparison Grid Matrix (Cards) - Flexible grid for 3 to 10 materials */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {materials.map((m, idx) => {
            const colorSet = CANDIDATE_COLORS[idx % CANDIDATE_COLORS.length];
            return (
              <div
                key={m.formula}
                className="rounded-2xl bg-[#0c182a] border border-[#1a314b] p-4 sm:p-5 flex flex-col justify-between relative hover:border-[#2b4c73] transition-colors"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-[10px] text-[#56b6ff] font-mono uppercase flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full inline-block"
                          style={{ backgroundColor: colorSet.fill }}
                        />
                        Candidate {idx + 1}
                      </div>
                      <h3 className="text-xl font-black text-white font-mono">{m.formula}</h3>
                      <p className="text-xs text-[#718ca4] truncate max-w-[170px]">{m.name}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xl font-black text-white">{m.screeningScore}</span>
                      <span className="text-[10px] text-[#718ca4] block">/100 Score</span>
                    </div>
                  </div>

                  {/* Radar Preview */}
                  <div className="py-2 flex justify-center bg-[#071321] rounded-xl border border-[#14263b] mb-4">
                    <PropertyRadar material={m} />
                  </div>

                  {/* 4 Prioritized Core Properties Highlight Box */}
                  <div className="bg-[#071322] p-3 rounded-xl border border-[#162f4b] mb-3 space-y-2">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#56b6ff] font-bold flex items-center justify-between">
                      <span>Prioritized Metrics</span>
                      <span className="text-[#3ed598]">Core Physics</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-[#0b1c2f] p-2 rounded-lg border border-[#173859]">
                        <span className="text-[10px] text-[#718ca4] block uppercase font-mono">Band Gap (Eg)</span>
                        <span className="font-mono text-[#fbbf24] font-bold block">{m.bandGap.toFixed(2)} eV</span>
                        <span className="text-[9px] text-[#8aa3bc]">{m.bandType}</span>
                      </div>

                      <div className="bg-[#0b1c2f] p-2 rounded-lg border border-[#173859]">
                        <span className="text-[10px] text-[#718ca4] block uppercase font-mono">Formation Ef</span>
                        <span className="font-mono text-[#43d6a3] font-bold block">{m.formationEnergy} eV/at</span>
                        <span className="text-[9px] text-[#8aa3bc]">{m.formationEnergy <= 0 ? 'Exothermic' : 'Metastable'}</span>
                      </div>

                      <div className="bg-[#0b1c2f] p-2 rounded-lg border border-[#173859]">
                        <span className="text-[10px] text-[#718ca4] block uppercase font-mono">Volume (V)</span>
                        <span className="font-mono text-[#38bdf8] font-bold block">{(m.volume ?? 0).toFixed(1)} Å³</span>
                        <span className="text-[9px] text-[#8aa3bc]">{m.crystalSystem}</span>
                      </div>

                      <div className="bg-[#0b1c2f] p-2 rounded-lg border border-[#173859]">
                        <span className="text-[10px] text-[#718ca4] block uppercase font-mono">E above Hull</span>
                        <span className={`font-mono font-bold block ${(m.energyAboveHull ?? 0) === 0 ? 'text-[#34d399]' : (m.energyAboveHull ?? 0) <= 0.05 ? 'text-[#fbbf24]' : 'text-[#f87171]'}`}>
                          {(m.energyAboveHull ?? 0).toFixed(3)} eV
                        </span>
                        <span className="text-[9px] text-[#8aa3bc]">
                          {(m.energyAboveHull ?? 0) === 0 ? 'Ground state' : (m.energyAboveHull ?? 0) <= 0.05 ? 'Metastable' : 'Unstable'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Properties List */}
                  <div className="space-y-1 text-xs divide-y divide-[#13253b]">
                    <div className="flex justify-between py-1">
                      <span className="text-[#718ca4]">Category</span>
                      <span className="text-white font-medium truncate max-w-[120px]">
                        {m.category}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#718ca4]">Density</span>
                      <span className="font-mono text-white">{m.density} g/cm³</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#718ca4]">Thermal Stability</span>
                      <span className="font-mono text-white">{m.thermalStability}%</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-[#718ca4]">Synthesizability</span>
                      <span className="font-mono text-white">{m.synthesizability}%</span>
                    </div>
                  </div>
                </div>

                {/* Bottom action */}
                <div className="mt-4 pt-3 border-t border-[#162a40]">
                  <button
                    onClick={() => onSelectForDossier(m.formula)}
                    className="w-full py-2 rounded-xl bg-[#112439] hover:bg-[#183350] text-[#56b6ff] hover:text-white text-xs font-bold border border-[#1e3b5e] transition-colors"
                  >
                    Inspect Full 3D Dossier →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
