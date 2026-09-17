import React, { useState } from 'react';
import {
  Compass,
  Filter,
  Sparkles,
  Download,
  ArrowRight,
  SlidersHorizontal,
  Layers,
  Search,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { MaterialData } from '../types';
import { INITIAL_PRESET_MATERIALS } from '../data/materialsDatabase';

interface DiscoverScreeningProps {
  onSelectMaterial: (formula: string) => void;
  onAddToCompare: (formula: string) => void;
  compareList: string[];
}

interface DiscoveredItem {
  formula: string;
  name: string;
  category: string;
  bandGap: number;
  density: number;
  crystalSystem: string;
  stability: number;
  synthesizability: number;
  screeningScore: number;
  innovationRationale: string;
  primaryApplication: string;
  isAiGenerated?: boolean;
}

export const DiscoverScreening: React.FC<DiscoverScreeningProps> = ({
  onSelectMaterial,
  onAddToCompare,
  compareList,
}) => {
  // Convert presets to candidate list
  const initialList: DiscoveredItem[] = Object.values(INITIAL_PRESET_MATERIALS).map(m => ({
    formula: m.formula,
    name: m.name,
    category: m.category,
    bandGap: m.bandGap,
    density: m.density,
    crystalSystem: m.crystalSystem,
    stability: m.stability,
    synthesizability: m.synthesizability,
    screeningScore: m.screeningScore,
    innovationRationale: m.aiInsight,
    primaryApplication: m.applications[0] || 'General',
  }));

  // Extra preset discovery candidates for richness
  const extraPresets: DiscoveredItem[] = [
    {
      formula: 'LiMnPO4',
      name: 'Lithium Manganese Phosphate',
      category: 'Battery Cathode',
      bandGap: 3.2,
      density: 3.4,
      crystalSystem: 'Orthorhombic',
      stability: 89,
      synthesizability: 85,
      screeningScore: 89,
      innovationRationale: 'Higher 4.1V redox plateau than LiFePO4, elevating pack-level energy density.',
      primaryApplication: 'Next-Gen EV Batteries',
    },
    {
      formula: 'NaFePO4',
      name: 'Sodium Iron Phosphate (Maricite/Triphylite)',
      category: 'Sodium-Ion Cathode',
      bandGap: 3.1,
      density: 3.25,
      crystalSystem: 'Orthorhombic',
      stability: 87,
      synthesizability: 90,
      screeningScore: 87,
      innovationRationale: 'Abundant sodium alternative bypassing lithium supply constraints.',
      primaryApplication: 'Grid Energy Storage',
    },
    {
      formula: 'SrTiO3',
      name: 'Strontium Titanate (Cubic Perovskite)',
      category: 'Photocatalysis & Oxide Electronics',
      bandGap: 3.25,
      density: 5.12,
      crystalSystem: 'Cubic',
      stability: 94,
      synthesizability: 92,
      screeningScore: 90,
      innovationRationale: 'High dielectric constant and ideal band edge alignment for photochemical water splitting.',
      primaryApplication: 'Green Hydrogen Evolution',
    },
    {
      formula: 'WS2',
      name: 'Tungsten Disulfide (2D Monolayer)',
      category: '2D Semiconductor',
      bandGap: 2.0,
      density: 7.5,
      crystalSystem: 'Hexagonal',
      stability: 92,
      synthesizability: 82,
      screeningScore: 91,
      innovationRationale: 'Large spin-orbit coupling gap (~430 meV) suited for spintronics and valleytronics.',
      primaryApplication: 'Valleytronic Quantum Logic',
    },
    {
      formula: 'AlN',
      name: 'Aluminum Nitride',
      category: 'Ultra-Wide Bandgap',
      bandGap: 6.05,
      density: 3.26,
      crystalSystem: 'Hexagonal',
      stability: 95,
      synthesizability: 81,
      screeningScore: 88,
      innovationRationale: 'Ultra-high breakdown electric field and exceptional thermal conductivity (320 W/m·K).',
      primaryApplication: 'Deep UV & RF Microwave',
    },
    {
      formula: 'Cu2ZnSnS4',
      name: 'CZTS Kesterite',
      category: 'Earth-Abundant Photovoltaic',
      bandGap: 1.5,
      density: 4.56,
      crystalSystem: 'Tetragonal',
      stability: 85,
      synthesizability: 80,
      screeningScore: 85,
      innovationRationale: 'Non-toxic, low-cost solar absorber free of rare indium or tellurium.',
      primaryApplication: 'Thin-Film Solar Absorbers',
    }
  ];

  const [candidates, setCandidates] = useState<DiscoveredItem[]>([...initialList, ...extraPresets]);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState('All');
  const [crystalFilter, setCrystalFilter] = useState('All');
  const [minScore, setMinScore] = useState(80);
  const [minBandGap, setMinBandGap] = useState(0);
  const [maxBandGap, setMaxBandGap] = useState(6.5);
  const [minStability, setMinStability] = useState(70);

  // Generate novel AI candidates using Gemini
  const handleGenerateAiCandidates = async () => {
    setIsGeneratingAi(true);
    setAiError(null);
    try {
      const response = await fetch('/api/discover-candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetApplication: selectedApplication !== 'All' ? selectedApplication : 'Advanced Clean Energy & Semiconductor',
          bandGapMin: minBandGap,
          bandGapMax: maxBandGap,
          minStability: minStability,
          elementsInclude: searchQuery || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      const data = await response.json();
      if (data.candidates && Array.isArray(data.candidates)) {
        const newItems: DiscoveredItem[] = data.candidates.map((c: any) => ({
          ...c,
          isAiGenerated: true,
        }));
        // Prepend new candidates
        setCandidates(prev => [...newItems, ...prev]);
      }
    } catch (err: any) {
      console.error(err);
      setAiError('Could not reach Gemini AI screening engine. Using standard discovery dataset.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Filter logic
  const filteredCandidates = candidates.filter(item => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match =
        item.formula.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q);
      if (!match) return false;
    }

    if (selectedApplication !== 'All') {
      const appMatch =
        item.category.toLowerCase().includes(selectedApplication.toLowerCase()) ||
        item.primaryApplication.toLowerCase().includes(selectedApplication.toLowerCase());
      if (!appMatch) return false;
    }

    if (crystalFilter !== 'All' && item.crystalSystem !== crystalFilter) {
      return false;
    }

    if (item.screeningScore < minScore) return false;
    if (item.stability < minStability) return false;
    if (item.bandGap < minBandGap || item.bandGap > maxBandGap) return false;

    return true;
  });

  const exportCSV = () => {
    const headers = 'Formula,Name,Category,BandGap(eV),Density(g/cm3),CrystalSystem,Stability(%),ScreeningScore,PrimaryApplication\n';
    const rows = filteredCandidates.map(c =>
      `"${c.formula}","${c.name}","${c.category}",${c.bandGap},${c.density},"${c.crystalSystem}",${c.stability},${c.screeningScore},"${c.primaryApplication}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MaterialMind_Screened_Candidates.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#10243b] via-[#0d1d30] to-[#091524] border border-[#1e344e] p-6 relative overflow-hidden">
        <div className="max-w-2xl relative z-10">
          <div className="text-xs font-bold text-[#56b6ff] uppercase tracking-wider flex items-center gap-1.5 mb-1.5">
            <Compass className="w-4 h-4" />
            Autonomous Candidate Screening
          </div>
          <h2 className="text-2xl font-black text-white mb-2">
            Screen Materials Across Multi-Objective Space
          </h2>
          <p className="text-sm text-[#8fa7be] leading-relaxed mb-4">
            Filter through calculated candidate profiles or direct Gemini 3.8 Flash to hypothesize novel stoichiometric combinations tailored to your application requirements.
          </p>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="ai-generate-candidates-btn"
              onClick={handleGenerateAiCandidates}
              disabled={isGeneratingAi}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#48aef5] to-[#6c72ff] hover:opacity-95 text-white text-xs font-bold shadow-lg flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isGeneratingAi ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Synthesizing Candidates with Gemini...
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  Hypothesize Novel AI Candidates
                </>
              )}
            </button>

            <button
              onClick={exportCSV}
              className="px-4 py-2.5 rounded-xl bg-[#0c1a2c] hover:bg-[#13273e] text-[#91a7bd] hover:text-white text-xs font-semibold border border-[#1b344e] flex items-center gap-2 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#56b6ff]" />
              Export Filtered CSV ({filteredCandidates.length})
            </button>
          </div>

          {aiError && (
            <div className="mt-3 text-xs text-[#f090a0] bg-[#2d1217] px-3 py-1.5 rounded-lg border border-[#59222c]">
              {aiError}
            </div>
          )}
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl bg-[#0c192a] border border-[#1a314b] p-5">
        <div className="flex items-center gap-2 text-xs font-bold text-[#8fa7be] uppercase tracking-wider mb-4">
          <SlidersHorizontal className="w-4 h-4 text-[#56b6ff]" />
          Screening Parameters & Boundary Constraints
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          {/* Search Query */}
          <div>
            <label className="text-xs text-[#718ca4] block mb-1.5">Search Formula / Keyword</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="e.g. Li, Perovskite, TiO2..."
                className="w-full bg-[#081220] border border-[#1c3552] rounded-xl px-3 py-2 text-xs text-white focus:border-[#56b6ff] outline-none pl-8"
              />
              <Search className="w-3.5 h-3.5 text-[#5a748c] absolute left-2.5 top-3" />
            </div>
          </div>

          {/* Application */}
          <div>
            <label className="text-xs text-[#718ca4] block mb-1.5">Target Application</label>
            <select
              value={selectedApplication}
              onChange={e => setSelectedApplication(e.target.value)}
              className="w-full bg-[#081220] border border-[#1c3552] rounded-xl px-3 py-2 text-xs text-white focus:border-[#56b6ff] outline-none"
            >
              <option value="All">All Domains</option>
              <option value="Battery">Battery & Ion Storage</option>
              <option value="Semiconductor">Wide-Bandgap Semiconductor</option>
              <option value="Photovoltaic">Solar / Photovoltaics</option>
              <option value="Photocatalysis">Photocatalysis & H2</option>
              <option value="Thermoelectric">Thermoelectrics</option>
              <option value="2D">2D Materials</option>
            </select>
          </div>

          {/* Crystal System */}
          <div>
            <label className="text-xs text-[#718ca4] block mb-1.5">Crystal System</label>
            <select
              value={crystalFilter}
              onChange={e => setCrystalFilter(e.target.value)}
              className="w-full bg-[#081220] border border-[#1c3552] rounded-xl px-3 py-2 text-xs text-white focus:border-[#56b6ff] outline-none"
            >
              <option value="All">All Symmetries</option>
              <option value="Cubic">Cubic</option>
              <option value="Tetragonal">Tetragonal</option>
              <option value="Orthorhombic">Orthorhombic</option>
              <option value="Hexagonal">Hexagonal</option>
              <option value="Trigonal">Trigonal</option>
              <option value="Monoclinic">Monoclinic</option>
            </select>
          </div>

          {/* Min Score Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#718ca4]">Min Screening Score</span>
              <b className="text-[#56b6ff] font-mono">{minScore}</b>
            </div>
            <input
              type="range"
              min="60"
              max="95"
              value={minScore}
              onChange={e => setMinScore(Number(e.target.value))}
              className="w-full accent-[#56b6ff]"
            />
          </div>
        </div>

        {/* Sliders row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[#14283f]">
          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#718ca4]">Bandgap Window</span>
              <b className="text-[#43d6a3] font-mono">{minBandGap.toFixed(1)} eV – {maxBandGap.toFixed(1)} eV</b>
            </div>
            <div className="flex gap-2">
              <input
                type="range"
                min="0"
                max="6"
                step="0.2"
                value={minBandGap}
                onChange={e => setMinBandGap(Number(e.target.value))}
                className="w-full accent-[#43d6a3]"
              />
              <input
                type="range"
                min="1"
                max="7"
                step="0.2"
                value={maxBandGap}
                onChange={e => setMaxBandGap(Number(e.target.value))}
                className="w-full accent-[#43d6a3]"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#718ca4]">Minimum Thermodynamic Stability</span>
              <b className="text-[#56b6ff] font-mono">{minStability}%</b>
            </div>
            <input
              type="range"
              min="50"
              max="95"
              value={minStability}
              onChange={e => setMinStability(Number(e.target.value))}
              className="w-full accent-[#56b6ff]"
            />
          </div>
        </div>
      </div>

      {/* Candidate Results Table */}
      <div className="rounded-2xl bg-[#0c182a] border border-[#1a314b] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#172c44] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#56b6ff]" />
            <h3 className="text-sm font-bold text-white">
              Screened Candidates <span className="text-xs font-normal text-[#7893ad]">({filteredCandidates.length} matches)</span>
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#091422] text-[#718ca4] border-b border-[#172b42]">
                <th className="p-3.5">Material</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Crystal System</th>
                <th className="p-3.5">Band Gap</th>
                <th className="p-3.5">Density</th>
                <th className="p-3.5">Stability</th>
                <th className="p-3.5">Screening Score</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#152a42]">
              {filteredCandidates.map(c => {
                const inCompare = compareList.includes(c.formula);
                return (
                  <tr key={c.formula} className="hover:bg-[#0f2136] transition-colors">
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white text-sm">{c.formula}</span>
                        {c.isAiGenerated && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#3d276b] text-[#c9a6ff] border border-[#58399a] font-semibold">
                            AI Novel
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#758ea6] block">{c.name}</span>
                    </td>
                    <td className="p-3.5 text-[#91a7bd]">{c.category}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-md bg-[#102236] text-[#8ea8c2] border border-[#1b344e]">
                        {c.crystalSystem}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono text-white">{c.bandGap.toFixed(2)} eV</td>
                    <td className="p-3.5 font-mono text-[#91a7bd]">{c.density.toFixed(2)} g/cm³</td>
                    <td className="p-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-2 bg-[#122338] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#48b6ff] to-[#43d6a3]"
                            style={{ width: `${c.stability}%` }}
                          />
                        </div>
                        <span className="font-mono text-white">{c.stability}%</span>
                      </div>
                    </td>
                    <td className="p-3.5">
                      <span className="text-xs font-bold px-2 py-1 rounded-lg bg-[#0e271f] text-[#43d6a3] border border-[#184e3a] font-mono">
                        {c.screeningScore}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onAddToCompare(c.formula)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                            inCompare
                              ? 'bg-[#15324e] text-[#56b6ff] border-[#294c73]'
                              : 'bg-[#0b1726] text-[#8ea7be] hover:text-white border-[#182c42]'
                          }`}
                        >
                          {inCompare ? 'In Compare' : '+ Compare'}
                        </button>
                        <button
                          onClick={() => onSelectMaterial(c.formula)}
                          className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#48aef5] to-[#6c72ff] hover:opacity-90 flex items-center gap-1"
                        >
                          Analyze
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
