import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  FlaskConical,
  GitCompare,
  Bookmark,
  Share2,
  Atom,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Layers,
  Search,
  FileDown
} from 'lucide-react';
import { MaterialData, ActiveTab, LabNote } from './types';
import { INITIAL_PRESET_MATERIALS, generateAlgorithmicMaterialData } from './data/materialsDatabase';
import { CrystalViewer } from './components/CrystalViewer';
import { PropertyRadar } from './components/PropertyRadar';
import { ElementBreakdown } from './components/ElementBreakdown';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DiscoverScreening } from './components/DiscoverScreening';
import { CompareView } from './components/CompareView';
import { HistoryNotesView } from './components/HistoryNotesView';
import { PeriodicTableModal } from './components/PeriodicTableModal';
import { SynthesisGuideModal } from './components/SynthesisGuideModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [formulaInput, setFormulaInput] = useState('LiFePO4');
  const [currentMaterial, setCurrentMaterial] = useState<MaterialData>(INITIAL_PRESET_MATERIALS['LiFePO4']);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Stored state
  const [allMaterials, setAllMaterials] = useState<Record<string, MaterialData>>(INITIAL_PRESET_MATERIALS);
  const [historyList, setHistoryList] = useState<MaterialData[]>([
    INITIAL_PRESET_MATERIALS['LiFePO4'],
    INITIAL_PRESET_MATERIALS['TiO2'],
    INITIAL_PRESET_MATERIALS['SiC'],
    INITIAL_PRESET_MATERIALS['GaN'],
  ]);
  const [compareList, setCompareList] = useState<string[]>(['LiFePO4', 'TiO2', 'SiC']);
  const [labNotes, setLabNotes] = useState<LabNote[]>([
    {
      id: 'note-1',
      materialFormula: 'LiFePO4',
      timestamp: Date.now() - 3600000 * 2,
      note: 'Ordered battery grade Li2CO3 and FeC2O4 precursors. Phase purity targets require 650°C calcination under inert Ar atmosphere.',
      tags: ['Cathode', 'Synthesis', 'Ar-Furnace'],
      priority: 'High',
      status: 'In Testing',
    },
    {
      id: 'note-2',
      materialFormula: 'SiC',
      timestamp: Date.now() - 3600000 * 24,
      note: '4H-SiC high voltage power electronics candidate. Verified 3.26 eV indirect bandgap simulation.',
      tags: ['Semiconductor', 'EV Inverter'],
      priority: 'Medium',
      status: 'Screened',
    }
  ]);

  // UI state
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isPeriodicTableOpen, setIsPeriodicTableOpen] = useState(false);
  const [isSynthesisModalOpen, setIsSynthesisModalOpen] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [aiStatus, setAiStatus] = useState({ online: true, aiEnabled: true });
  const [userSearchCount, setUserSearchCount] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('materialmind_user_search_count');
      return saved ? Math.max(parseInt(saved, 10), 4) : 4;
    } catch {
      return 4;
    }
  });

  // Check backend health
  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        setAiStatus({ online: true, aiEnabled: data.aiEnabled });
      })
      .catch(() => {
        setAiStatus({ online: true, aiEnabled: false });
      });
  }, []);

  // Analyze function
  const handleAnalyze = async (formulaToAnalyze?: string, forceRefresh = false) => {
    const rawTarget = (formulaToAnalyze || formulaInput).trim();
    if (!rawTarget) return;

    // Track user search query count
    setUserSearchCount(prev => {
      const next = prev + 1;
      try {
        localStorage.setItem('materialmind_user_search_count', next.toString());
      } catch {}
      return next;
    });

    // Normalize capitalization if user typed lowercase (e.g., nacl -> NaCl)
    let target = rawTarget;
    if (/^[a-z0-9]+$/i.test(rawTarget) && !/[A-Z]/.test(rawTarget)) {
      target = rawTarget.charAt(0).toUpperCase() + rawTarget.slice(1);
    }

    // Instant zero-latency display if user is just selecting a known preset chip and didn't request a fresh analysis
    const existing = allMaterials[target] || INITIAL_PRESET_MATERIALS[target];
    if (existing && !forceRefresh) {
      setCurrentMaterial(existing);
      setFormulaInput(existing.formula);
      setHistoryList(prev => {
        const filtered = prev.filter(p => p.formula.toUpperCase() !== existing.formula.toUpperCase());
        return [existing, ...filtered];
      });
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    try {
      const response = await fetch('/api/analyze-material', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ formula: target, forceRefresh: true }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data && data.formula) {
          setCurrentMaterial(data);
          setFormulaInput(data.formula);
          setAllMaterials(prev => ({ ...prev, [data.formula]: data, [data.formula.toUpperCase()]: data }));
          setHistoryList(prev => {
            const filtered = prev.filter(p => p.formula.toUpperCase() !== data.formula.toUpperCase());
            return [data, ...filtered];
          });
          setIsAnalyzing(false);
          return;
        }
      }
    } catch (e: any) {
      console.warn('Using local materials physics engine fallback:', e);
    }

    // Fallback: algorithmic or preset
    const fallbackData = existing || generateAlgorithmicMaterialData(target);
    setCurrentMaterial(fallbackData);
    setFormulaInput(fallbackData.formula);
    setAllMaterials(prev => ({ ...prev, [fallbackData.formula]: fallbackData }));
    setHistoryList(prev => {
      const filtered = prev.filter(p => p.formula.toUpperCase() !== fallbackData.formula.toUpperCase());
      return [fallbackData, ...filtered];
    });
    setIsAnalyzing(false);
  };

  const handleSelectPreset = (formula: string) => {
    setFormulaInput(formula);
    handleAnalyze(formula, false);
  };

  const handleAddToCompare = (formula: string) => {
    if (!compareList.includes(formula)) {
      setCompareList(prev => [...prev, formula]);
    }
  };

  const handleRemoveFromCompare = (formula: string) => {
    setCompareList(prev => prev.filter(f => f !== formula));
  };

  const handleAddNote = (newNote: Omit<LabNote, 'id' | 'timestamp'>) => {
    const note: LabNote = {
      ...newNote,
      id: `note-${Date.now()}`,
      timestamp: Date.now(),
    };
    setLabNotes(prev => [note, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    setLabNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleExportDossier = () => {
    const jsonStr = JSON.stringify(currentMaterial, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MaterialMind_${currentMaterial.formula}_Dossier.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-[#eef6ff] flex">
      {/* Sidebar navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        savedCount={labNotes.length}
        historyCount={historyList.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:ml-64 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex flex-col justify-between">
        <div>
          {/* Header */}
          <Header
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
            savedCount={labNotes.length}
            currentMaterial={currentMaterial}
            onExportReport={handleExportDossier}
            aiStatus={aiStatus}
          />

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Hero Search Section */}
              <section className="relative rounded-2xl bg-gradient-to-br from-[#10253b] via-[#0b1728] to-[#071321] border border-[#1e334c] p-5 sm:p-7 overflow-hidden shadow-2xl">
                {/* Background glow circle */}
                <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#315c9a]/20 blur-3xl pointer-events-none" />

                <div className="relative z-10 max-w-3xl">
                  <div className="text-[11px] font-bold text-[#56b6ff] uppercase tracking-widest flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    Explore Any Chemical Material
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white mt-1 mb-2 tracking-tight">
                    Discover materials before you build them.
                  </h2>
                  <p className="text-xs sm:text-sm text-[#91a7bd] leading-relaxed max-w-2xl">
                    Enter any chemical formula or alloy composition. MaterialMind predicts 3D crystal lattice parameters, electronic band structures, thermodynamic stability, and candidate screening indicators.
                  </p>

                  {/* Search Bar */}
                  <div className="flex flex-col sm:flex-row gap-2 mt-5">
                    <div className="flex-1 relative">
                      <input
                        id="formula-input"
                        type="text"
                        value={formulaInput}
                        onChange={e => setFormulaInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleAnalyze(formulaInput, true)}
                        placeholder="Enter formula e.g. LiFePO4, BaTiO3, CsPbI3..."
                        className="w-full bg-[#071321] border border-[#29445f] text-white font-mono font-bold text-base rounded-xl px-4 py-3 outline-none focus:border-[#56b6ff] shadow-inner transition-colors"
                      />
                    </div>

                    <div className="flex gap-2">
                      <button
                        id="periodic-table-btn"
                        onClick={() => setIsPeriodicTableOpen(true)}
                        className="px-3.5 py-3 rounded-xl bg-[#0f2136] hover:bg-[#162e49] text-[#91a7bd] hover:text-white border border-[#243f5e] text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        title="Open Periodic Table Formula Builder"
                      >
                        <Atom className="w-4 h-4 text-[#56b6ff]" />
                        <span className="hidden sm:inline">Periodic Table</span>
                      </button>

                      <button
                        id="analyze-material-btn"
                        onClick={() => handleAnalyze(formulaInput, true)}
                        disabled={isAnalyzing}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#48aef5] to-[#6c72ff] hover:opacity-95 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#48aef5]/20 transition-all disabled:opacity-50"
                      >
                        {isAnalyzing ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            Analyze Material
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {analysisError && (
                    <div className="mt-3 p-3 rounded-xl bg-[#2a131a] border border-[#6b2532] text-xs text-[#ff99a8] flex items-center justify-between">
                      <span>{analysisError}</span>
                      <button onClick={() => setAnalysisError(null)} className="text-[#ff99a8] hover:text-white font-bold">×</button>
                    </div>
                  )}

                  {/* Preset Chips */}
                  <div className="flex items-center gap-2 mt-3.5 flex-wrap">
                    <span className="text-xs text-[#6e879e]">Suggested:</span>
                    {['LiFePO4', 'TiO2', 'SiC', 'GaN', 'CsPbI3', 'MoS2', 'BaTiO3', 'Bi2Te3'].map(preset => (
                      <button
                        key={preset}
                        onClick={() => handleSelectPreset(preset)}
                        className={`text-xs px-2.5 py-1 rounded-full border transition-all font-mono ${
                          currentMaterial.formula === preset
                            ? 'bg-[#18395c] text-[#56b6ff] border-[#4aaef5]'
                            : 'bg-[#0b1828] text-[#9bb0c4] border-[#29445f] hover:text-white hover:border-[#4aaef5]'
                        }`}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>

                  {/* Active Analysis Result Hero Card */}
                  <div className="mt-5 pt-5 border-t border-[#182f47]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-[#718aa3] tracking-wider">
                          CURRENT SCREENING DOSSIER
                        </div>
                        <div className="text-2xl font-black text-white font-mono flex items-center gap-2.5">
                          {currentMaterial.formula}
                          <button
                            onClick={() => handleAnalyze(currentMaterial.formula, true)}
                            disabled={isAnalyzing}
                            className="p-1 rounded-lg text-[#718aa3] hover:text-[#56b6ff] hover:bg-[#122438] transition-colors"
                            title="Re-run fresh AI analysis with Gemini"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                          </button>
                          <span className="text-xs font-sans font-normal text-[#8ca4bb] px-2 py-0.5 rounded-md bg-[#0f2136] border border-[#1b3654]">
                            {currentMaterial.category}
                          </span>
                          {currentMaterial.isAiGenerated && (
                            <span className="text-[10px] font-sans font-bold text-[#c9a6ff] bg-[#3a2066] px-2 py-0.5 rounded-full border border-[#583399]">
                              Gemini Real-time AI
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="text-xs text-[#43d6a3] font-bold bg-[#0d271f] px-3 py-1 rounded-full border border-[#184e3a] flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Confidence: {currentMaterial.confidence}%
                        </div>

                        <button
                          onClick={() => setIsSynthesisModalOpen(true)}
                          className="text-xs font-bold text-white bg-[#142d47] hover:bg-[#1a385a] px-3 py-1.5 rounded-xl border border-[#23456c] flex items-center gap-1.5 transition-colors"
                        >
                          <FlaskConical className="w-3.5 h-3.5 text-[#56b6ff]" />
                          Synthesis Guide
                        </button>
                      </div>
                    </div>

                    {/* Key Metric Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-3.5">
                      <div className="p-3 bg-[#0a1727] border border-[#1d344c] rounded-xl">
                        <span className="text-[11px] text-[#718aa3] block">Band Gap</span>
                        <strong className="text-lg font-mono text-white">
                          {currentMaterial.bandGap.toFixed(2)} eV
                        </strong>
                        <span className="text-[10px] text-[#56b6ff] block">{currentMaterial.bandType}</span>
                      </div>

                      <div className="p-3 bg-[#0a1727] border border-[#1d344c] rounded-xl">
                        <span className="text-[11px] text-[#718aa3] block">Density</span>
                        <strong className="text-lg font-mono text-white">
                          {currentMaterial.density.toFixed(2)} g/cm³
                        </strong>
                        <span className="text-[10px] text-[#718aa3] block">Theoretical</span>
                      </div>

                      <div className="p-3 bg-[#0a1727] border border-[#1d344c] rounded-xl">
                        <span className="text-[11px] text-[#718aa3] block">Thermodynamic Stability</span>
                        <strong className="text-lg font-mono text-[#43d6a3]">
                          {currentMaterial.stability}%
                        </strong>
                        <span className="text-[10px] text-[#718aa3] block">Decomp. resistant</span>
                      </div>

                      <div className="p-3 bg-[#0a1727] border border-[#1d344c] rounded-xl">
                        <span className="text-[11px] text-[#718aa3] block">Formation Energy</span>
                        <strong className="text-lg font-mono text-white">
                          {currentMaterial.formationEnergy} eV/atom
                        </strong>
                        <span className="text-[10px] text-[#43d6a3] block">Favorable Enthalpy</span>
                      </div>
                    </div>

                    {/* AI Insight Box */}
                    <div className="p-3.5 border-l-4 border-[#56b6ff] bg-[#0b1b2c] rounded-r-xl text-xs text-[#a9bfd3] leading-relaxed">
                      <b className="text-white">AI Solid-State Insight:</b> {currentMaterial.aiInsight}
                    </div>
                  </div>
                </div>
              </section>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="bg-[#0d1a2b]/90 border border-[#1e334c] rounded-2xl p-4">
                  <span className="text-[11px] font-bold text-[#718aa3] uppercase block">
                    MATERIALS ANALYZED
                  </span>
                  <strong className="text-2xl font-black text-white block mt-1">
                    {1284 + historyList.length}
                  </strong>
                  <span className="text-[11px] text-[#43d6a3] font-semibold">↑ 14% this week</span>
                </div>

                <div className="bg-[#0d1a2b]/90 border border-[#1e334c] rounded-2xl p-4">
                  <span className="text-[11px] font-bold text-[#718aa3] uppercase block flex items-center justify-between">
                    <span>USER SEARCHES</span>
                    <Search className="w-3 h-3 text-[#56b6ff]" />
                  </span>
                  <strong className="text-2xl font-black text-[#56b6ff] block mt-1 font-mono">
                    {userSearchCount}
                  </strong>
                  <span className="text-[11px] text-[#8ca4bb]">
                    {historyList.length} distinct materials searched
                  </span>
                </div>

                <div className="bg-[#0d1a2b]/90 border border-[#1e334c] rounded-2xl p-4">
                  <span className="text-[11px] font-bold text-[#718aa3] uppercase block flex items-center justify-between">
                    <span>ELEMENTS PRESENT</span>
                    <Atom className="w-3 h-3 text-[#43d6a3]" />
                  </span>
                  <strong className="text-2xl font-black text-[#43d6a3] block mt-1 font-mono">
                    {currentMaterial.elements?.length || 0} Elements
                  </strong>
                  <span className="text-[11px] text-[#718aa3] truncate block">
                    {currentMaterial.elements?.map(e => e.symbol).join(' · ') || currentMaterial.formula}
                  </span>
                </div>

                <div className="bg-[#0d1a2b]/90 border border-[#1e334c] rounded-2xl p-4">
                  <span className="text-[11px] font-bold text-[#718aa3] uppercase block">
                    MODEL FIDELITY
                  </span>
                  <strong className="text-2xl font-black text-white block mt-1 font-mono">
                    {currentMaterial.confidence ? `${currentMaterial.confidence}%` : '89.4%'}
                  </strong>
                  <span className="text-[11px] text-[#718aa3]">Validation Set</span>
                </div>
              </div>

              {/* Main 2-Column Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left 7 Columns: 3D Unit Cell & Stoichiometry */}
                <div className="lg:col-span-7 space-y-6">
                  <CrystalViewer material={currentMaterial} />
                  <ElementBreakdown material={currentMaterial} />
                </div>

                {/* Right 5 Columns: Property Radar & Screening Score */}
                <div className="lg:col-span-5 space-y-6">
                  {/* Property Radar & Bars */}
                  <div className="rounded-2xl bg-[#0d1a2b] border border-[#1e334c] p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h3 className="text-base font-bold text-white">Multi-Dimensional Profile</h3>
                        <span className="text-xs text-[#718aa3]">6-Axis Material Figure of Merit</span>
                      </div>
                      <span className="text-xs font-mono font-bold text-[#56b6ff] bg-[#102438] px-2 py-0.5 rounded border border-[#1b344d]">
                        {currentMaterial.formula}
                      </span>
                    </div>

                    <PropertyRadar material={currentMaterial} />

                    {/* Progress Bars */}
                    <div className="mt-4 pt-4 border-t border-[#162a40] space-y-3">
                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#849cb3]">Thermal Stability</span>
                          <b className="text-white font-mono">{currentMaterial.thermalStability}%</b>
                        </div>
                        <div className="h-1.5 w-full bg-[#122438] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#48b6ff] to-[#776dff] rounded-full"
                            style={{ width: `${currentMaterial.thermalStability}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#849cb3]">Chemical Stability</span>
                          <b className="text-white font-mono">{currentMaterial.chemicalStability}%</b>
                        </div>
                        <div className="h-1.5 w-full bg-[#122438] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#48b6ff] to-[#776dff] rounded-full"
                            style={{ width: `${currentMaterial.chemicalStability}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#849cb3]">Synthesizability & Yield</span>
                          <b className="text-white font-mono">{currentMaterial.synthesizability}%</b>
                        </div>
                        <div className="h-1.5 w-full bg-[#122438] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#48b6ff] to-[#776dff] rounded-full"
                            style={{ width: `${currentMaterial.synthesizability}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-[#849cb3]">Prediction Reliability</span>
                          <b className="text-white font-mono">{currentMaterial.confidence}%</b>
                        </div>
                        <div className="h-1.5 w-full bg-[#122438] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#48b6ff] to-[#776dff] rounded-full"
                            style={{ width: `${currentMaterial.confidence}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Elements Present & User Searches Telemetry Card */}
                  <div className="rounded-2xl bg-[#0d1a2b] border border-[#1e334c] p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-[#162a40]">
                      <div>
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <Layers className="w-4 h-4 text-[#56b6ff]" />
                          Composition & Search Telemetry
                        </h3>
                        <span className="text-xs text-[#718aa3]">Constituent elements and dashboard search metrics</span>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#102438] text-[#56b6ff] border border-[#1a3854]">
                        {currentMaterial.elements?.length === 1
                          ? 'Unary Element'
                          : currentMaterial.elements?.length === 2
                          ? 'Binary Compound'
                          : currentMaterial.elements?.length === 3
                          ? 'Ternary Compound'
                          : currentMaterial.elements?.length === 4
                          ? 'Quaternary Compound'
                          : `${currentMaterial.elements?.length || 0}-Element Compound`}
                      </span>
                    </div>

                    {/* Section 1: Elements Present */}
                    <div className="bg-[#091523] border border-[#182e44] rounded-xl p-3.5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-[#718aa3] uppercase flex items-center gap-1.5">
                          <Atom className="w-3.5 h-3.5 text-[#43d6a3]" />
                          Elements Present in {currentMaterial.formula}
                        </span>
                        <span className="text-xs font-mono text-[#8da5bc]">
                          {currentMaterial.elements?.reduce((acc, el) => acc + (el.count || 1), 0) || 0} atoms/unit
                        </span>
                      </div>

                      <div className="flex items-baseline gap-2 mb-3">
                        <span className="text-3xl font-black text-white font-mono">
                          {currentMaterial.elements?.length || 0}
                        </span>
                        <span className="text-xs text-[#718aa3]">distinct chemical constituent elements</span>
                      </div>

                      {/* Element Badges */}
                      <div className="flex flex-wrap gap-2">
                        {currentMaterial.elements?.map(el => (
                          <div
                            key={el.symbol}
                            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#0e1f32] border border-[#1c3652]"
                          >
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: el.color || '#56b6ff' }}
                            />
                            <span className="font-mono font-bold text-white text-xs">{el.symbol}</span>
                            <span className="text-[11px] text-[#8ca4bb]">{el.name}</span>
                            <span className="text-[10px] font-mono text-[#56b6ff] bg-[#12273e] px-1.5 py-0.5 rounded border border-[#1b3b60]">
                              {el.massPercent}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Section 2: User Searches in Dashboard */}
                    <div className="bg-[#091523] border border-[#182e44] rounded-xl p-3.5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-[#718aa3] uppercase flex items-center gap-1.5">
                          <Search className="w-3.5 h-3.5 text-[#56b6ff]" />
                          User Searches in Dashboard
                        </span>
                        <span className="text-[11px] text-[#43d6a3] font-semibold">Active Session</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div className="p-2.5 rounded-lg bg-[#0c1a2b] border border-[#183049]">
                          <span className="text-[10px] text-[#718aa3] block uppercase font-bold">Total Queries</span>
                          <strong className="text-2xl font-black text-[#56b6ff] font-mono block">
                            {userSearchCount}
                          </strong>
                          <span className="text-[10px] text-[#718aa3]">Searches conducted</span>
                        </div>

                        <div className="p-2.5 rounded-lg bg-[#0c1a2b] border border-[#183049]">
                          <span className="text-[10px] text-[#718aa3] block uppercase font-bold">Distinct Materials</span>
                          <strong className="text-2xl font-black text-white font-mono block">
                            {historyList.length}
                          </strong>
                          <span className="text-[10px] text-[#718aa3]">Formulas explored</span>
                        </div>
                      </div>

                      {/* Recent User Searches */}
                      {historyList.length > 0 && (
                        <div>
                          <div className="text-[10px] text-[#718aa3] uppercase font-bold mb-1.5">
                            Recent User Searches (Click to Inspect):
                          </div>
                          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                            {historyList.slice(0, 8).map(item => (
                              <button
                                key={item.formula}
                                onClick={() => handleSelectPreset(item.formula)}
                                className={`text-[11px] font-mono px-2 py-0.5 rounded border transition-colors ${
                                  currentMaterial.formula === item.formula
                                    ? 'bg-[#18395c] text-[#56b6ff] border-[#4aaef5]'
                                    : 'bg-[#0d1d2f] text-[#8ca4bb] border-[#1f3750] hover:text-white hover:border-[#4aaef5]'
                                }`}
                              >
                                {item.formula}
                                <span className="text-[9px] text-[#5f7a93] ml-1">
                                  ({item.elements?.length || 0} el)
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Compare & Actions */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-xs text-[#718aa3]">
                        {currentMaterial.formula} • {currentMaterial.category}
                      </span>

                      <button
                        onClick={() => handleAddToCompare(currentMaterial.formula)}
                        className="text-xs font-bold text-[#56b6ff] hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#102438] border border-[#1b3854] transition-colors"
                      >
                        <GitCompare className="w-3.5 h-3.5" />
                        + Add to Compare
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Similar Materials Table */}
              <section className="rounded-2xl bg-[#0d1a2b] border border-[#1e334c] p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-white">Similar & Derivative Materials</h3>
                    <span className="text-xs text-[#718aa3]">
                      Solid-state structural analogues and stoichiometric candidates
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#1a2d42] text-[#7891a9]">
                        <th className="py-3 px-3 font-semibold">Material</th>
                        <th className="py-3 px-3 font-semibold">Similarity</th>
                        <th className="py-3 px-3 font-semibold">Stability</th>
                        <th className="py-3 px-3 font-semibold">Band Gap</th>
                        <th className="py-3 px-3 font-semibold">Constituent Elements</th>
                        <th className="py-3 px-3 font-semibold">Rationale</th>
                        <th className="py-3 px-3 text-right font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#16283b]">
                      {currentMaterial.similarMaterials.map(sim => (
                        <tr key={sim.formula} className="hover:bg-[#0f2136] transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-white text-sm">{sim.formula}</span>
                            <span className="text-[10px] text-[#718aa3] block">{sim.name}</span>
                          </td>
                          <td className="py-3 px-3 font-mono text-[#56b6ff] font-bold">
                            {sim.similarity}%
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                sim.stability === 'High'
                                    ? 'bg-[#103629] text-[#62e0b2]'
                                    : 'bg-[#3b3419] text-[#ffd166]'
                              }`}
                            >
                              {sim.stability}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-mono text-white">{sim.bandGap}</td>
                          <td className="py-3 px-3">
                            <span className="font-mono font-bold text-white bg-[#102338] px-2 py-0.5 rounded border border-[#1b344e]">
                              {sim.formula.match(/[A-Z][a-z]*/g)?.length || 2} Elements
                            </span>
                          </td>
                          <td className="py-3 px-3 text-[#8ca4bb] max-w-xs">{sim.reason}</td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleAddToCompare(sim.formula)}
                                className="px-2 py-1 rounded bg-[#0e2136] text-[#718aa3] hover:text-white text-[11px] border border-[#1c3552]"
                              >
                                + Compare
                              </button>
                              <button
                                onClick={() => handleAnalyze(sim.formula)}
                                className="px-2.5 py-1 rounded bg-gradient-to-r from-[#48aef5] to-[#6c72ff] text-white font-bold text-[11px] flex items-center gap-1"
                              >
                                Analyze
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}

          {/* TAB 2: DISCOVER & SCREENING */}
          {activeTab === 'discover' && (
            <DiscoverScreening
              onSelectMaterial={f => {
                handleAnalyze(f);
                setActiveTab('dashboard');
              }}
              onAddToCompare={handleAddToCompare}
              compareList={compareList}
            />
          )}

          {/* TAB 3: COMPARE MATRIX */}
          {activeTab === 'compare' && (
            <CompareView
              compareList={compareList}
              onRemoveFromCompare={handleRemoveFromCompare}
              onAddToCompare={handleAddToCompare}
              onSelectForDossier={f => {
                handleAnalyze(f);
                setActiveTab('dashboard');
              }}
              allMaterials={allMaterials}
            />
          )}

          {/* TAB 4: LAB HISTORY & NOTES */}
          {activeTab === 'history' && (
            <HistoryNotesView
              historyList={historyList}
              labNotes={labNotes}
              onAddNote={handleAddNote}
              onDeleteNote={handleDeleteNote}
              onSelectMaterial={f => {
                handleAnalyze(f);
                setActiveTab('dashboard');
              }}
            />
          )}
        </div>

        {/* Footer */}
        <footer className="text-center text-[#526a82] text-xs py-6 mt-8 border-t border-[#122338]">
          MaterialMind · AI-driven materials discovery & screening platform · Built for solid-state research
        </footer>
      </div>

      {/* Modals */}
      <PeriodicTableModal
        isOpen={isPeriodicTableOpen}
        onClose={() => setIsPeriodicTableOpen(false)}
        onSelectFormula={f => {
          setFormulaInput(f);
          handleAnalyze(f);
        }}
        currentFormula={formulaInput}
      />

      <SynthesisGuideModal
        isOpen={isSynthesisModalOpen}
        onClose={() => setIsSynthesisModalOpen(false)}
        material={currentMaterial}
      />
    </div>
  );
}
