import React, { useState, useMemo } from 'react';
import {
  Compass,
  Filter,
  Search,
  RotateCcw,
  Layers,
  ArrowRight,
  Plus,
  CheckCircle2,
  SlidersHorizontal,
  Table as TableIcon,
  LayoutGrid,
  Zap,
  Sparkles,
  ShieldCheck,
  Flame,
  Atom,
  TrendingUp,
  Download,
  Info
} from 'lucide-react';
import { MaterialData, ScreeningFilter, CrystalSystem } from '../types';
import { INITIAL_PRESET_MATERIALS, generateAlgorithmicMaterialData } from '../data/materialsDatabase';

interface DiscoverScreeningProps {
  onSelectMaterial: (formula: string) => void;
  onAddToCompare: (formula: string) => void;
  compareList: string[];
}

// Comprehensive verified materials pool for high-throughput screening
const EXTENDED_SCREENING_MATERIALS: MaterialData[] = [
  // Core benchmark presets
  INITIAL_PRESET_MATERIALS['LiFePO4'],
  INITIAL_PRESET_MATERIALS['TiO2'],
  INITIAL_PRESET_MATERIALS['SiC'],
  INITIAL_PRESET_MATERIALS['GaN'],
  INITIAL_PRESET_MATERIALS['CsPbI3'],
  INITIAL_PRESET_MATERIALS['MoS2'],
  INITIAL_PRESET_MATERIALS['BaTiO3'],
  INITIAL_PRESET_MATERIALS['Bi2Te3'],

  // Energy & Battery Cathodes / Solid Electrolytes
  {
    ...generateAlgorithmicMaterialData('Na3V2(PO4)3'),
    name: 'NASICON Sodium Vanadium Phosphate',
    category: 'Battery & Energy Storage',
    bandGap: 2.85,
    bandType: 'Direct',
    density: 3.25,
    stability: 91,
    thermalStability: 92,
    chemicalStability: 90,
    mechanicalHardness: 75,
    synthesizability: 88,
    environmentalScore: 90,
    screeningScore: 92,
    crystalSystem: 'Trigonal',
    spaceGroup: 'R-3c',
    aiInsight: 'Open 3D framework allows rapid Na+ diffusion with minimal volume expansion during high-rate battery cycling.',
    applications: ['Sodium-Ion Battery Cathode', 'Grid Energy Storage', 'Stationary Power'],
  },
  {
    ...generateAlgorithmicMaterialData('LiCoO2'),
    name: 'Lithium Cobalt Oxide (Layered Rock Salt)',
    category: 'Battery & Energy Storage',
    bandGap: 2.70,
    bandType: 'Direct',
    density: 5.05,
    stability: 89,
    thermalStability: 84,
    chemicalStability: 88,
    mechanicalHardness: 78,
    synthesizability: 92,
    environmentalScore: 70,
    screeningScore: 90,
    crystalSystem: 'Trigonal',
    spaceGroup: 'R-3m',
    aiInsight: 'High volumetric energy density benchmark for consumer mobile electronics with well-understood intercalation kinetics.',
    applications: ['Consumer Electronics', 'High-Density Cells', 'Portable Devices'],
  },
  {
    ...generateAlgorithmicMaterialData('LiMn2O4'),
    name: 'Lithium Manganese Oxide (Spinel)',
    category: 'Battery & Energy Storage',
    bandGap: 2.90,
    bandType: 'Direct',
    density: 4.28,
    stability: 86,
    thermalStability: 87,
    chemicalStability: 84,
    mechanicalHardness: 76,
    synthesizability: 90,
    environmentalScore: 88,
    screeningScore: 88,
    crystalSystem: 'Cubic',
    spaceGroup: 'Fd-3m',
    aiInsight: '3D lithium diffusion pathways in spinel structure offer high rate capability with non-toxic, low-cost manganese.',
    applications: ['Power Tools', 'Hybrid Electric Vehicles', 'Cost-Effective Storage'],
  },
  {
    ...generateAlgorithmicMaterialData('Li7La3Zr2O12'),
    name: 'Garnet Solid Electrolyte (LLZO)',
    category: 'Solid Electrolytes',
    bandGap: 5.50,
    bandType: 'Direct',
    density: 5.10,
    stability: 94,
    thermalStability: 96,
    chemicalStability: 93,
    mechanicalHardness: 88,
    synthesizability: 84,
    environmentalScore: 89,
    screeningScore: 95,
    crystalSystem: 'Cubic',
    spaceGroup: 'Ia-3d',
    aiInsight: 'High room-temperature lithium-ion conductivity (>1 mS/cm) and superior electrochemical stability against metallic lithium anodes.',
    applications: ['All-Solid-State Lithium Batteries', 'Safe EV Packs', 'High-Voltage Solid Electrolytes'],
  },
  {
    ...generateAlgorithmicMaterialData('NaFePO4'),
    name: 'Sodium Iron Phosphate (Maricite/Olivine)',
    category: 'Battery & Energy Storage',
    bandGap: 3.10,
    bandType: 'Direct',
    density: 3.20,
    stability: 87,
    thermalStability: 90,
    chemicalStability: 88,
    mechanicalHardness: 71,
    synthesizability: 86,
    environmentalScore: 95,
    screeningScore: 87,
    crystalSystem: 'Orthorhombic',
    spaceGroup: 'Pnma',
    aiInsight: 'Composed entirely of earth-abundant iron and sodium, offering extraordinary sustainability for massive grid energy buffers.',
    applications: ['Grid Energy Storage', 'Low-Cost Sodium Cells', 'Sustainable Storage'],
  },

  // Wide-Bandgap & RF Power Semiconductors
  {
    ...generateAlgorithmicMaterialData('AlN'),
    name: 'Aluminum Nitride (Wurtzite)',
    category: 'Wide-Bandgap Semiconductors',
    bandGap: 6.05,
    bandType: 'Direct',
    density: 3.26,
    stability: 95,
    thermalStability: 97,
    chemicalStability: 96,
    mechanicalHardness: 92,
    synthesizability: 86,
    environmentalScore: 92,
    screeningScore: 92,
    crystalSystem: 'Hexagonal',
    spaceGroup: 'P6_3mc',
    aiInsight: 'Ultra-wide direct bandgap combined with high thermal conductivity (320 W/m·K) for deep-UV optoelectronics and heat dissipation substrates.',
    applications: ['Deep UV Disinfection LEDs', 'Power Module Heat Sinks', 'Piezoelectric BAW Resonators'],
  },
  {
    ...generateAlgorithmicMaterialData('Diamond'),
    name: 'Synthetic Single-Crystal Diamond',
    category: 'Wide-Bandgap Semiconductors',
    bandGap: 5.47,
    bandType: 'Indirect',
    density: 3.51,
    stability: 99,
    thermalStability: 99,
    chemicalStability: 99,
    mechanicalHardness: 100,
    synthesizability: 76,
    environmentalScore: 96,
    screeningScore: 96,
    crystalSystem: 'Cubic',
    spaceGroup: 'Fd-3m',
    aiInsight: 'Ultimate semiconductor figure of merit with extreme thermal conductivity (2200 W/m·K) and huge breakdown field (10 MV/cm).',
    applications: ['Ultra-High Voltage Switches', 'Thermal Spreading Substrates', 'Quantum Magnetometry NV Centers'],
  },
  {
    ...generateAlgorithmicMaterialData('AlScN'),
    name: 'Scandium Aluminum Nitride (Sc0.2Al0.8N)',
    category: 'Wide-Bandgap Semiconductors',
    bandGap: 4.80,
    bandType: 'Direct',
    density: 3.42,
    stability: 93,
    thermalStability: 94,
    chemicalStability: 92,
    mechanicalHardness: 89,
    synthesizability: 82,
    environmentalScore: 88,
    screeningScore: 93,
    crystalSystem: 'Hexagonal',
    spaceGroup: 'P6_3mc',
    aiInsight: 'Giant piezoelectric response and switchable ferroelectricity in wurtzite lattice for 5G/6G acoustic RF telecom filters.',
    applications: ['5G/6G BAW RF Filters', 'Ferroelectric Memories', 'Micro-Acoustic Sensors'],
  },
  {
    ...generateAlgorithmicMaterialData('ZnO'),
    name: 'Zinc Oxide (Wurtzite)',
    category: 'Wide-Bandgap Semiconductors',
    bandGap: 3.37,
    bandType: 'Direct',
    density: 5.61,
    stability: 90,
    thermalStability: 92,
    chemicalStability: 85,
    mechanicalHardness: 80,
    synthesizability: 94,
    environmentalScore: 92,
    screeningScore: 89,
    crystalSystem: 'Hexagonal',
    spaceGroup: 'P6_3mc',
    aiInsight: 'Large exciton binding energy (60 meV) enables efficient room-temperature UV luminescence and transparent conducting oxide coatings.',
    applications: ['Transparent Conductive Films', 'UV Sensors', 'Piezoelectric Nanogenerators'],
  },

  // Photovoltaics & Halide Perovskites
  {
    ...generateAlgorithmicMaterialData('Cs2AgBiBr6'),
    name: 'Lead-Free Double Perovskite Halide',
    category: 'Photovoltaics & Halides',
    bandGap: 2.15,
    bandType: 'Direct',
    density: 4.70,
    stability: 89,
    thermalStability: 92,
    chemicalStability: 86,
    mechanicalHardness: 65,
    synthesizability: 86,
    environmentalScore: 94,
    screeningScore: 90,
    crystalSystem: 'Cubic',
    spaceGroup: 'Fm-3m',
    aiInsight: 'Completely eliminates toxic lead while retaining long carrier lifetimes and superior ambient moisture stability.',
    applications: ['Indoor Photovoltaics', 'X-Ray Detectors', 'Tandem Solar Cells'],
  },
  {
    ...generateAlgorithmicMaterialData('CsPbBr3'),
    name: 'Cesium Lead Bromide Perovskite',
    category: 'Photovoltaics & Halides',
    bandGap: 2.30,
    bandType: 'Direct',
    density: 4.55,
    stability: 82,
    thermalStability: 85,
    chemicalStability: 79,
    mechanicalHardness: 55,
    synthesizability: 90,
    environmentalScore: 68,
    screeningScore: 85,
    crystalSystem: 'Orthorhombic',
    spaceGroup: 'Pnma',
    aiInsight: 'Exceptional optical green photoluminescence quantum yield (>90%) with enhanced moisture resistance over iodide analogues.',
    applications: ['Pure Green Display LEDs', 'Gamma-Ray Radiation Detectors', 'Optoelectronic Sensors'],
  },
  {
    ...generateAlgorithmicMaterialData('CsSnI3'),
    name: 'Cesium Tin Iodide (Black Perovskite)',
    category: 'Photovoltaics & Halides',
    bandGap: 1.30,
    bandType: 'Direct',
    density: 4.51,
    stability: 76,
    thermalStability: 78,
    chemicalStability: 70,
    mechanicalHardness: 50,
    synthesizability: 82,
    environmentalScore: 90,
    screeningScore: 84,
    crystalSystem: 'Orthorhombic',
    spaceGroup: 'Pnma',
    aiInsight: 'Near-optimal single-junction Shockley-Queisser bandgap without lead, but requires encapsulation to suppress Sn2+ to Sn4+ oxidation.',
    applications: ['Eco-Friendly Solar Cells', 'Near-Infrared Detectors', 'Thermoelectric Absorbers'],
  },

  // 2D & Quantum Nanomaterials
  {
    ...generateAlgorithmicMaterialData('Ti3C2Tx'),
    name: 'Titanium Carbide MXene',
    category: '2D & Quantum Materials',
    bandGap: 0.10,
    bandType: 'Metallic',
    density: 3.90,
    stability: 87,
    thermalStability: 85,
    chemicalStability: 88,
    mechanicalHardness: 82,
    synthesizability: 85,
    environmentalScore: 88,
    screeningScore: 91,
    crystalSystem: 'Hexagonal',
    spaceGroup: 'P6_3/mmc',
    aiInsight: 'Ultra-high metallic conductivity combined with hydrophilic functional surfaces for rapid pseudocapacitive electrochemical charge storage.',
    applications: ['Supercapacitors', 'Electromagnetic Interference (EMI) Shielding', 'Water Desalination'],
  },
  {
    ...generateAlgorithmicMaterialData('WS2'),
    name: 'Tungsten Disulfide (2D Monolayer)',
    category: '2D & Quantum Materials',
    bandGap: 2.00,
    bandType: 'Direct',
    density: 7.50,
    stability: 92,
    thermalStability: 93,
    chemicalStability: 91,
    mechanicalHardness: 78,
    synthesizability: 83,
    environmentalScore: 91,
    screeningScore: 91,
    crystalSystem: 'Hexagonal',
    spaceGroup: 'P6_3/mmc',
    aiInsight: 'Direct bandgap in monolayer form with massive spin-orbit splitting (~430 meV) in valence band for valleytronic quantum operations.',
    applications: ['Valleytronics', 'Atomically Thin Transistors', 'HER Electrocatalysis'],
  },
  {
    ...generateAlgorithmicMaterialData('MoSe2'),
    name: 'Molybdenum Diselenide',
    category: '2D & Quantum Materials',
    bandGap: 1.55,
    bandType: 'Direct',
    density: 6.98,
    stability: 90,
    thermalStability: 89,
    chemicalStability: 90,
    mechanicalHardness: 74,
    synthesizability: 84,
    environmentalScore: 89,
    screeningScore: 88,
    crystalSystem: 'Hexagonal',
    spaceGroup: 'P6_3/mmc',
    aiInsight: 'Closer bandgap match to near-infrared spectrum with higher carrier mobilities than sulfur counterparts.',
    applications: ['Near-IR Photodetectors', 'Flexible Photovoltaics', 'Nano-Optics'],
  },

  // Photocatalysis & Functional Oxides
  {
    ...generateAlgorithmicMaterialData('SrTiO3'),
    name: 'Strontium Titanate (Perovskite)',
    category: 'Photocatalysis & Functional Oxides',
    bandGap: 3.25,
    bandType: 'Indirect',
    density: 5.12,
    stability: 96,
    thermalStability: 97,
    chemicalStability: 96,
    mechanicalHardness: 88,
    synthesizability: 95,
    environmentalScore: 94,
    screeningScore: 91,
    crystalSystem: 'Cubic',
    spaceGroup: 'Pm-3m',
    aiInsight: 'Archetype cubic perovskite with suitable conduction band edge position for non-assisted solar hydrogen evolution from water.',
    applications: ['Solar Water Splitting', 'Oxide Heterostructure 2DEG', 'Cryogenic Dielectrics'],
  },
  {
    ...generateAlgorithmicMaterialData('WO3'),
    name: 'Tungsten Trioxide',
    category: 'Photocatalysis & Functional Oxides',
    bandGap: 2.70,
    bandType: 'Indirect',
    density: 7.16,
    stability: 92,
    thermalStability: 94,
    chemicalStability: 91,
    mechanicalHardness: 80,
    synthesizability: 92,
    environmentalScore: 90,
    screeningScore: 87,
    crystalSystem: 'Monoclinic',
    spaceGroup: 'P2_1/n',
    aiInsight: 'Visible-light responsive photocatalyst with high chemical resistance in acidic media and fast electrochromic reversible color switching.',
    applications: ['Smart Electrochromic Windows', 'Visible-Light Photocatalysis', 'Toxic Gas Sensors'],
  },

  // Thermoelectrics & Topological Quantum Matter
  {
    ...generateAlgorithmicMaterialData('Sb2Te3'),
    name: 'Antimony Telluride',
    category: 'Thermoelectrics & Quantum Matter',
    bandGap: 0.28,
    bandType: 'Direct',
    density: 6.50,
    stability: 86,
    thermalStability: 85,
    chemicalStability: 87,
    mechanicalHardness: 58,
    synthesizability: 87,
    environmentalScore: 79,
    screeningScore: 87,
    crystalSystem: 'Trigonal',
    spaceGroup: 'R-3m',
    aiInsight: 'Premier p-type thermoelectric counterpart paired with n-type Bi2Te3 for high-performance Peltier solid-state heat pumps.',
    applications: ['Peltier Cooling Modules', 'Thermoelectric Generators', 'Spintronics'],
  },
  {
    ...generateAlgorithmicMaterialData('Bi2Se3'),
    name: 'Bismuth Selenide',
    category: 'Thermoelectrics & Quantum Matter',
    bandGap: 0.30,
    bandType: 'Direct',
    density: 6.82,
    stability: 89,
    thermalStability: 88,
    chemicalStability: 88,
    mechanicalHardness: 62,
    synthesizability: 89,
    environmentalScore: 82,
    screeningScore: 89,
    crystalSystem: 'Trigonal',
    spaceGroup: 'R-3m',
    aiInsight: 'Model 3D topological insulator with simple single Dirac cone surface state protected by time-reversal symmetry.',
    applications: ['Topological Quantum Devices', 'Spin-Orbit Torque Memory', 'Infrared Detectors'],
  },
];

const APPLICATION_CATEGORIES = [
  'All Applications',
  'Battery & Energy Storage',
  'Wide-Bandgap Semiconductors',
  'Solid Electrolytes',
  'Photovoltaics & Halides',
  '2D & Quantum Materials',
  'Photocatalysis & Functional Oxides',
  'Thermoelectrics & Quantum Matter',
];

const CRYSTAL_SYSTEMS = [
  'All Systems',
  'Cubic',
  'Hexagonal',
  'Tetragonal',
  'Orthorhombic',
  'Trigonal',
  'Monoclinic',
];

const DEFAULT_FILTERS: ScreeningFilter = {
  searchQuery: '',
  application: 'All Applications',
  minBandGap: 0.0,
  maxBandGap: 7.0,
  minStability: 70,
  minScore: 75,
  crystalSystem: 'All Systems',
  requiredElement: '',
  maxEnergyAboveHull: 0.10,
  maxFormationEnergy: 0.5,
  maxVolume: 800,
};

export const DiscoverScreening: React.FC<DiscoverScreeningProps> = ({
  onSelectMaterial,
  onAddToCompare,
  compareList,
}) => {
  const [filters, setFilters] = useState<ScreeningFilter>(DEFAULT_FILTERS);
  const [sortBy, setSortBy] = useState<
    'screeningScore' | 'bandGap' | 'formationEnergy' | 'volume' | 'energyAboveHull' | 'stability' | 'density' | 'synthesizability'
  >('screeningScore');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Fast preset filters prioritizing the 4 core properties
  const applyPreset = (presetName: string) => {
    switch (presetName) {
      case 'on_hull':
        setFilters({
          ...DEFAULT_FILTERS,
          maxEnergyAboveHull: 0.000,
        });
        setSortBy('energyAboveHull');
        break;
      case 'low_ef':
        setFilters({
          ...DEFAULT_FILTERS,
          maxFormationEnergy: -1.5,
        });
        setSortBy('formationEnergy');
        break;
      case 'compact_volume':
        setFilters({
          ...DEFAULT_FILTERS,
          maxVolume: 120,
        });
        setSortBy('volume');
        break;
      case 'battery':
        setFilters({
          ...DEFAULT_FILTERS,
          application: 'Battery & Energy Storage',
          minScore: 85,
        });
        break;
      case 'power_semis':
        setFilters({
          ...DEFAULT_FILTERS,
          application: 'Wide-Bandgap Semiconductors',
          minBandGap: 3.0,
          minScore: 88,
        });
        break;
      case 'solar_halides':
        setFilters({
          ...DEFAULT_FILTERS,
          application: 'Photovoltaics & Halides',
          minBandGap: 1.0,
          maxBandGap: 2.5,
          minScore: 80,
        });
        break;
      case 'solid_electrolytes':
        setFilters({
          ...DEFAULT_FILTERS,
          application: 'Solid Electrolytes',
          minScore: 85,
        });
        break;
      case 'two_d':
        setFilters({
          ...DEFAULT_FILTERS,
          application: '2D & Quantum Materials',
          minScore: 85,
        });
        break;
      default:
        setFilters(DEFAULT_FILTERS);
    }
  };

  // Filter and sort candidates
  const filteredMaterials = useMemo(() => {
    return EXTENDED_SCREENING_MATERIALS.filter(m => {
      // Search query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase().trim();
        const formulaMatch = m.formula.toLowerCase().includes(q);
        const nameMatch = m.name.toLowerCase().includes(q);
        const catMatch = m.category.toLowerCase().includes(q);
        if (!formulaMatch && !nameMatch && !catMatch) return false;
      }

      // Application domain
      if (filters.application !== 'All Applications') {
        if (m.category !== filters.application) return false;
      }

      // Crystal system
      if (filters.crystalSystem !== 'All Systems') {
        if (m.crystalSystem !== filters.crystalSystem) return false;
      }

      // Required element
      if (filters.requiredElement.trim()) {
        const targetSym = filters.requiredElement.trim().toLowerCase();
        const hasEl = m.elements.some(e => e.symbol.toLowerCase() === targetSym || e.name.toLowerCase().includes(targetSym));
        if (!hasEl) return false;
      }

      // 4 Prioritized Core Properties Numeric thresholds
      if (m.bandGap < filters.minBandGap || m.bandGap > filters.maxBandGap) return false;

      if (filters.maxEnergyAboveHull !== undefined && (m.energyAboveHull ?? 0) > filters.maxEnergyAboveHull) {
        return false;
      }

      if (filters.maxFormationEnergy !== undefined && m.formationEnergy > filters.maxFormationEnergy) {
        return false;
      }

      if (filters.maxVolume !== undefined && (m.volume ?? 100) > filters.maxVolume) {
        return false;
      }

      // Secondary thresholds
      if (m.stability < filters.minStability) return false;
      if (m.screeningScore < filters.minScore) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'screeningScore') return b.screeningScore - a.screeningScore;
      if (sortBy === 'bandGap') return a.bandGap - b.bandGap;
      if (sortBy === 'formationEnergy') return a.formationEnergy - b.formationEnergy; // most exothermic first
      if (sortBy === 'volume') return (a.volume ?? 0) - (b.volume ?? 0); // compact cell first
      if (sortBy === 'energyAboveHull') return (a.energyAboveHull ?? 0) - (b.energyAboveHull ?? 0); // on hull ground state first
      if (sortBy === 'stability') return b.stability - a.stability;
      if (sortBy === 'synthesizability') return b.synthesizability - a.synthesizability;
      if (sortBy === 'density') return b.density - a.density;
      return 0;
    });
  }, [filters, sortBy]);

  // Compute aggregate stats for current view with prioritized metrics
  const stats = useMemo(() => {
    if (filteredMaterials.length === 0) {
      return { total: EXTENDED_SCREENING_MATERIALS.length, matched: 0, topScore: 0, avgBandGap: 0, onHullCount: 0, avgVolume: 0 };
    }
    const topScore = Math.max(...filteredMaterials.map(m => m.screeningScore));
    const avgBandGap = filteredMaterials.reduce((acc, m) => acc + m.bandGap, 0) / filteredMaterials.length;
    const onHullCount = filteredMaterials.filter(m => (m.energyAboveHull ?? 0) === 0).length;
    const avgVolume = filteredMaterials.reduce((acc, m) => acc + (m.volume ?? 0), 0) / filteredMaterials.length;
    return {
      total: EXTENDED_SCREENING_MATERIALS.length,
      matched: filteredMaterials.length,
      topScore,
      avgBandGap: parseFloat(avgBandGap.toFixed(2)),
      onHullCount,
      avgVolume: parseFloat(avgVolume.toFixed(1)),
    };
  }, [filteredMaterials]);

  // Export CSV with prioritized metrics
  const handleExportCSV = () => {
    const headers = [
      'Formula',
      'Name',
      'Category',
      'Band Gap (eV)',
      'Band Type',
      'Formation Energy (eV/atom)',
      'Unit Cell Volume (Å³)',
      'Energy Above Hull (eV/atom)',
      'Density (g/cm³)',
      'Crystal System',
      'Space Group',
      'Stability (%)',
      'Synthesizability (%)',
      'Screening Score',
      'AI Insight'
    ];
    const rows = filteredMaterials.map(m => [
      `"${m.formula}"`,
      `"${m.name}"`,
      `"${m.category}"`,
      m.bandGap,
      `"${m.bandType}"`,
      m.formationEnergy,
      (m.volume ?? 0).toFixed(2),
      (m.energyAboveHull ?? 0).toFixed(3),
      m.density,
      `"${m.crystalSystem}"`,
      `"${m.spaceGroup}"`,
      m.stability,
      m.synthesizability,
      m.screeningScore,
      `"${m.aiInsight.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `MaterialMind_Screened_Candidates_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#10243b] via-[#0a1829] to-[#071220] border border-[#1b344e] p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold text-[#56b6ff] uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-4 h-4" />
                Materials Discovery & High-Throughput Screening
              </span>
              <span className="text-[11px] font-mono font-bold bg-[#0d2744] text-[#56b6ff] px-2.5 py-0.5 rounded-full border border-[#1e4875]">
                {stats.matched} of {stats.total} Candidates Match
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              High-Throughput Material Screening Engine
            </h2>
            <p className="text-xs sm:text-sm text-[#8ba5bf] max-w-2xl mt-1.5 leading-relaxed">
              Screen verified materials candidates across electronic band gaps, crystal symmetries, thermodynamic stability, and synthetic feasibility. Select any candidate to inspect its 3D unit cell or compare directly.
            </p>
          </div>

          {/* Quick Metrics Cards prioritizing core physics */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 shrink-0">
            <div className="bg-[#071424] border border-[#152e4a] p-3 rounded-xl">
              <span className="text-[10px] text-[#6a87a4] block uppercase font-mono">Catalog</span>
              <span className="text-base font-black text-white font-mono">{stats.total}</span>
            </div>
            <div className="bg-[#071424] border border-[#152e4a] p-3 rounded-xl">
              <span className="text-[10px] text-[#6a87a4] block uppercase font-mono">Screened</span>
              <span className="text-base font-black text-[#56b6ff] font-mono">{stats.matched}</span>
            </div>
            <div className="bg-[#071424] border border-[#152e4a] p-3 rounded-xl">
              <span className="text-[10px] text-[#6a87a4] block uppercase font-mono">On Convex Hull</span>
              <span className="text-base font-black text-[#43d6a3] font-mono">{stats.onHullCount}</span>
            </div>
            <div className="bg-[#071424] border border-[#152e4a] p-3 rounded-xl">
              <span className="text-[10px] text-[#6a87a4] block uppercase font-mono">Avg Bandgap</span>
              <span className="text-base font-black text-[#fbbf24] font-mono">{stats.avgBandGap} eV</span>
            </div>
            <div className="bg-[#071424] border border-[#152e4a] p-3 rounded-xl">
              <span className="text-[10px] text-[#6a87a4] block uppercase font-mono">Avg Volume</span>
              <span className="text-base font-black text-[#38bdf8] font-mono">{stats.avgVolume} Å³</span>
            </div>
          </div>
        </div>

        {/* Quick Screening Preset Chips */}
        <div className="mt-5 pt-4 border-t border-[#142940] flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs text-[#6282a2] font-semibold shrink-0 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-[#56b6ff]" />
            Core Presets:
          </span>
          <button
            onClick={() => applyPreset('on_hull')}
            className="px-3 py-1.5 rounded-xl bg-[#082218] hover:bg-[#103a2a] text-xs font-semibold text-[#43d6a3] hover:text-white border border-[#18593c] whitespace-nowrap transition-colors"
          >
            ★ On Convex Hull (Ehull = 0)
          </button>
          <button
            onClick={() => applyPreset('low_ef')}
            className="px-3 py-1.5 rounded-xl bg-[#0b1e33] hover:bg-[#14304e] text-xs font-semibold text-[#8ca8c4] hover:text-white border border-[#1a3857] whitespace-nowrap transition-colors"
          >
            Deep Exothermic (Ef &lt; -1.5 eV)
          </button>
          <button
            onClick={() => applyPreset('compact_volume')}
            className="px-3 py-1.5 rounded-xl bg-[#0b1e33] hover:bg-[#14304e] text-xs font-semibold text-[#8ca8c4] hover:text-white border border-[#1a3857] whitespace-nowrap transition-colors"
          >
            Compact Unit Cell (V &lt; 120 Å³)
          </button>
          <button
            onClick={() => applyPreset('wide_bandgap')}
            className="px-3 py-1.5 rounded-xl bg-[#0b1e33] hover:bg-[#14304e] text-xs font-semibold text-[#8ca8c4] hover:text-white border border-[#1a3857] whitespace-nowrap transition-colors"
          >
            Wide Band Gap (&gt;3.0 eV)
          </button>
          <button
            onClick={() => applyPreset('battery')}
            className="px-3 py-1.5 rounded-xl bg-[#0b1e33] hover:bg-[#14304e] text-xs font-semibold text-[#8ca8c4] hover:text-white border border-[#1a3857] whitespace-nowrap transition-colors"
          >
            EV Battery Cathodes
          </button>
          <button
            onClick={() => applyPreset('power_semis')}
            className="px-3 py-1.5 rounded-xl bg-[#0b1e33] hover:bg-[#14304e] text-xs font-semibold text-[#8ca8c4] hover:text-white border border-[#1a3857] whitespace-nowrap transition-colors"
          >
            Power Semiconductors
          </button>
          <button
            onClick={() => applyPreset('all')}
            className="px-3 py-1.5 rounded-xl bg-[#14283f] hover:bg-[#1b3756] text-xs font-semibold text-[#56b6ff] border border-[#23486f] whitespace-nowrap transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        </div>
      </div>

      {/* FILTER CONTROLS TOOLBAR */}
      <div className="bg-[#091728] rounded-2xl border border-[#17304b] p-4 sm:p-5 space-y-4 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#577695] absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={filters.searchQuery}
              onChange={e => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              placeholder="Search formula, material name, or chemical class..."
              className="w-full pl-10 pr-4 py-2.5 bg-[#061220] border border-[#172d47] rounded-xl text-xs text-white placeholder-[#587694] focus:outline-none focus:border-[#4da6ff] transition-colors"
            />
          </div>

          {/* Application Category selector */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={filters.application}
              onChange={e => setFilters(prev => ({ ...prev, application: e.target.value }))}
              className="bg-[#0c1f34] text-white text-xs font-semibold px-3 py-2.5 rounded-xl border border-[#1d3d61] focus:outline-none cursor-pointer"
            >
              {APPLICATION_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Sort selector prioritizing the 4 properties */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-[#0c1f34] text-white text-xs font-semibold px-3 py-2.5 rounded-xl border border-[#1d3d61] focus:outline-none cursor-pointer"
            >
              <option value="screeningScore">Sort: Screening Score (FOM)</option>
              <option value="energyAboveHull">Sort: Energy Above Hull (On Hull First)</option>
              <option value="formationEnergy">Sort: Formation Energy (Exothermic First)</option>
              <option value="volume">Sort: Unit Cell Volume (Compact First)</option>
              <option value="bandGap">Sort: Band Gap (Eg)</option>
              <option value="stability">Sort: Stability (%)</option>
              <option value="synthesizability">Sort: Synthesizability (%)</option>
              <option value="density">Sort: Density (g/cm³)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 bg-[#061220] p-1 rounded-xl border border-[#172d47]">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-[#15426e] text-white' : 'text-[#627f9d] hover:text-white'
                }`}
                title="Grid Card View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-colors ${
                  viewMode === 'table' ? 'bg-[#15426e] text-white' : 'text-[#627f9d] hover:text-white'
                }`}
                title="Matrix Table View"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Filter Toggle button */}
            <button
              onClick={() => setShowAdvancedFilters(prev => !prev)}
              className={`px-3 py-2.5 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-colors ${
                showAdvancedFilters
                  ? 'bg-[#15426e] border-[#388bd9] text-white'
                  : 'bg-[#0c1f34] hover:bg-[#132f4f] text-[#8aa5bf] hover:text-white border-[#1d3d61]'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{showAdvancedFilters ? 'Hide Filters' : 'Filters'}</span>
            </button>

            {/* Export CSV button */}
            <button
              onClick={handleExportCSV}
              className="p-2.5 rounded-xl bg-[#0c1f34] hover:bg-[#132f4f] text-[#56b6ff] hover:text-white border border-[#1d3d61] transition-colors"
              title="Export Screened Candidates to CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ADVANCED SLIDERS & PARAMETRIC FILTERS FOR 4 PRIORITIZED METRICS */}
        {showAdvancedFilters && (
          <div className="pt-4 border-t border-[#13283f] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs animate-fadeIn">
            {/* Energy Above Hull Filter Slider */}
            <div className="bg-[#061220] p-3 rounded-xl border border-[#13263b]">
              <div className="flex justify-between text-[#8aa3bc] mb-1.5">
                <span className="font-semibold text-white">Max Energy Above Hull</span>
                <span className="font-mono font-bold text-[#43d6a3]">
                  {(filters.maxEnergyAboveHull ?? 0.10).toFixed(3)} eV/at
                </span>
              </div>
              <input
                type="range"
                min="0.000"
                max="0.100"
                step="0.005"
                value={filters.maxEnergyAboveHull ?? 0.10}
                onChange={e => setFilters(prev => ({ ...prev, maxEnergyAboveHull: Number(e.target.value) }))}
                className="w-full accent-[#43d6a3] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#547594] mt-1">
                <span>0.000 (Hull Ground)</span>
                <span>0.050 (Metastable)</span>
                <span>0.100</span>
              </div>
            </div>

            {/* Formation Energy Filter Slider */}
            <div className="bg-[#061220] p-3 rounded-xl border border-[#13263b]">
              <div className="flex justify-between text-[#8aa3bc] mb-1.5">
                <span className="font-semibold text-white">Max Formation Energy</span>
                <span className="font-mono font-bold text-[#38bdf8]">
                  {(filters.maxFormationEnergy ?? 0.5).toFixed(2)} eV/at
                </span>
              </div>
              <input
                type="range"
                min="-3.5"
                max="0.5"
                step="0.1"
                value={filters.maxFormationEnergy ?? 0.5}
                onChange={e => setFilters(prev => ({ ...prev, maxFormationEnergy: Number(e.target.value) }))}
                className="w-full accent-[#38bdf8] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#547594] mt-1">
                <span>-3.5 (Highly Exothermic)</span>
                <span>0.5 eV</span>
              </div>
            </div>

            {/* Unit Cell Volume Filter Slider */}
            <div className="bg-[#061220] p-3 rounded-xl border border-[#13263b]">
              <div className="flex justify-between text-[#8aa3bc] mb-1.5">
                <span className="font-semibold text-white">Max Unit Cell Volume</span>
                <span className="font-mono font-bold text-[#fbbf24]">
                  {filters.maxVolume ?? 800} Å³
                </span>
              </div>
              <input
                type="range"
                min="50"
                max="800"
                step="25"
                value={filters.maxVolume ?? 800}
                onChange={e => setFilters(prev => ({ ...prev, maxVolume: Number(e.target.value) }))}
                className="w-full accent-[#fbbf24] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#547594] mt-1">
                <span>50 Å³</span>
                <span>400 Å³</span>
                <span>800 Å³</span>
              </div>
            </div>

            {/* Bandgap Max Slider */}
            <div className="bg-[#061220] p-3 rounded-xl border border-[#13263b]">
              <div className="flex justify-between text-[#8aa3bc] mb-1.5">
                <span className="font-semibold text-white">Max Band Gap (Eg)</span>
                <span className="font-mono font-bold text-[#a78bfa]">{filters.maxBandGap.toFixed(1)} eV</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="7.0"
                step="0.5"
                value={filters.maxBandGap}
                onChange={e => setFilters(prev => ({ ...prev, maxBandGap: Number(e.target.value) }))}
                className="w-full accent-[#a78bfa] cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-[#547594] mt-1">
                <span>0.5 eV</span>
                <span>3.5 eV</span>
                <span>7.0 eV</span>
              </div>
            </div>

            {/* Min Screening Score Slider */}
            <div className="bg-[#061220] p-3 rounded-xl border border-[#13263b]">
              <div className="flex justify-between text-[#8aa3bc] mb-1.5">
                <span>Min Screening Score</span>
                <span className="font-mono font-bold text-[#43d6a3]">{filters.minScore}/100</span>
              </div>
              <input
                type="range"
                min="60"
                max="95"
                value={filters.minScore}
                onChange={e => setFilters(prev => ({ ...prev, minScore: Number(e.target.value) }))}
                className="w-full accent-[#43d6a3] cursor-pointer"
              />
            </div>

            {/* Min Stability Slider */}
            <div className="bg-[#061220] p-3 rounded-xl border border-[#13263b]">
              <div className="flex justify-between text-[#8aa3bc] mb-1.5">
                <span>Min Stability</span>
                <span className="font-mono font-bold text-[#56b6ff]">{filters.minStability}%</span>
              </div>
              <input
                type="range"
                min="60"
                max="95"
                value={filters.minStability}
                onChange={e => setFilters(prev => ({ ...prev, minStability: Number(e.target.value) }))}
                className="w-full accent-[#56b6ff] cursor-pointer"
              />
            </div>

            {/* Crystal System & Element Inclusion */}
            <div className="bg-[#061220] p-3 rounded-xl border border-[#13263b] flex gap-2 lg:col-span-2">
              <div className="flex-1">
                <span className="text-[#8aa3bc] block mb-1">Crystal System</span>
                <select
                  value={filters.crystalSystem}
                  onChange={e => setFilters(prev => ({ ...prev, crystalSystem: e.target.value }))}
                  className="w-full bg-[#0a1829] border border-[#162f4a] rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
                >
                  {CRYSTAL_SYSTEMS.map(sys => (
                    <option key={sys} value={sys}>{sys}</option>
                  ))}
                </select>
              </div>
              <div className="w-28">
                <span className="text-[#8aa3bc] block mb-1">Has Element</span>
                <input
                  type="text"
                  value={filters.requiredElement}
                  onChange={e => setFilters(prev => ({ ...prev, requiredElement: e.target.value }))}
                  placeholder="e.g. Li or Ti"
                  className="w-full bg-[#0a1829] border border-[#162f4a] rounded-lg px-2 py-1 text-xs text-white focus:outline-none font-mono"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RESULTS SECTION */}
      {filteredMaterials.length === 0 ? (
        <div className="bg-[#091626] rounded-2xl border border-[#17304b] p-12 text-center space-y-3 shadow-lg">
          <Layers className="w-10 h-10 text-[#486b8f] mx-auto" />
          <h3 className="text-base font-bold text-white">No materials matched your screening filters</h3>
          <p className="text-xs text-[#7593af] max-w-md mx-auto">
            Try lowering the minimum screening score or widening the band gap range to include more candidate formulations.
          </p>
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="px-4 py-2 rounded-xl bg-[#143252] hover:bg-[#1c436e] text-[#56b6ff] text-xs font-bold transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARD VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMaterials.map(m => {
            const inCompare = compareList.includes(m.formula);

            return (
              <div
                key={m.formula}
                className="rounded-2xl bg-[#091728] border border-[#183452] hover:border-[#2b5683] p-5 flex flex-col justify-between transition-all shadow-md group hover:shadow-xl"
              >
                <div>
                  {/* Top Bar: Category & Screening FOM Badge */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#0e253e] text-[#56b6ff] border border-[#1d426a] truncate max-w-[200px]">
                      {m.category}
                    </span>

                    <div className="text-right shrink-0">
                      <div className="text-sm font-black font-mono text-[#43d6a3]">
                        {m.screeningScore}
                        <span className="text-[10px] text-[#60869e] font-normal">/100</span>
                      </div>
                      <span className="text-[9px] text-[#547594] block uppercase font-mono">Screening FOM</span>
                    </div>
                  </div>

                  {/* Formula & Name */}
                  <h3 className="text-2xl font-black text-white font-mono tracking-tight group-hover:text-[#56b6ff] transition-colors">
                    {m.formula}
                  </h3>
                  <p className="text-xs text-[#8ca6c0] line-clamp-1 mb-3.5">{m.name}</p>

                  {/* Prioritized 4 Core Physical Properties Grid */}
                  <div className="bg-[#061220] p-3 rounded-xl border border-[#14283f] mb-3.5 space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-[#597b9c] uppercase font-mono pb-1 border-b border-[#0d2036]">
                      <span className="font-bold text-[#8fb2d4]">Core Evaluated Properties</span>
                      {(m.energyAboveHull ?? 0) === 0 && (
                        <span className="text-[#43d6a3] font-bold">★ On Convex Hull</span>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-[10px] text-[#597996] block uppercase font-mono">Band Gap (Eg)</span>
                        <span className="font-mono font-bold text-[#fbbf24]">{m.bandGap.toFixed(2)} eV</span>
                        <span className="text-[10px] text-[#718da6] ml-1">({m.bandType})</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#597996] block uppercase font-mono">Formation (Ef)</span>
                        <span className={`font-mono font-bold ${m.formationEnergy < -1 ? 'text-[#38bdf8]' : 'text-white'}`}>
                          {m.formationEnergy > 0 ? '+' : ''}{m.formationEnergy.toFixed(2)} eV/at
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#597996] block uppercase font-mono">Unit Cell Vol (V)</span>
                        <span className="font-mono font-bold text-[#e2e8f0]">
                          {(m.volume ?? 100).toFixed(1)} Å³
                        </span>
                      </div>
                      <div>
                        <span className="text-[10px] text-[#597996] block uppercase font-mono">Above Hull (Ehull)</span>
                        <span className={`font-mono font-bold ${(m.energyAboveHull ?? 0) === 0 ? 'text-[#43d6a3]' : 'text-[#f59e0b]'}`}>
                          {(m.energyAboveHull ?? 0).toFixed(3)} eV/at
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Secondary Metrics Bar */}
                  <div className="flex items-center justify-between text-[11px] text-[#698ba9] font-mono px-2 py-1.5 rounded-lg bg-[#071526] border border-[#112338] mb-3.5">
                    <span>{m.crystalSystem}</span>
                    <span>{m.density.toFixed(2)} g/cm³</span>
                    <span className="text-[#43d6a3] font-bold">Stab {m.stability}%</span>
                    <span className="text-[#56b6ff] font-bold">Synth {m.synthesizability}%</span>
                  </div>

                  {/* Constituent Element Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-3.5">
                    {m.elements.map(e => (
                      <span
                        key={e.symbol}
                        className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#0b1c2e] text-white border border-[#16304d]"
                        style={{ borderLeftColor: e.color, borderLeftWidth: 3 }}
                      >
                        {e.symbol}
                        <span className="text-[#6484a2] ml-1 font-normal">{e.massPercent}%</span>
                      </span>
                    ))}
                  </div>

                  {/* AI Screening Insight */}
                  <p className="text-xs text-[#7290ad] leading-relaxed line-clamp-2">
                    {m.aiInsight}
                  </p>
                </div>

                {/* Card Actions Footer */}
                <div className="mt-4 pt-3.5 border-t border-[#13273e] flex items-center gap-2">
                  <button
                    onClick={() => onSelectMaterial(m.formula)}
                    className="flex-1 py-2 px-3 rounded-xl bg-[#102740] hover:bg-[#18395c] text-[#56b6ff] hover:text-white text-xs font-bold border border-[#1d4168] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Inspect 3D Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => onAddToCompare(m.formula)}
                    disabled={inCompare || compareList.length >= 10}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 cursor-pointer ${
                      inCompare
                        ? 'bg-[#0d281c] text-[#43d6a3] border-[#18613e]'
                        : 'bg-[#0b1d30] hover:bg-[#14304e] text-[#8aa5c0] hover:text-white border-[#1a3a5e]'
                    }`}
                    title={inCompare ? 'Already in compare matrix' : 'Add to comparison matrix'}
                  >
                    {inCompare ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Compare</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE MATRIX VIEW WITH PRIORITIZED COLUMNS */
        <div className="rounded-2xl bg-[#091728] border border-[#183452] overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#8ba5bf]">
              <thead className="bg-[#061220] text-[#597896] uppercase font-mono text-[10px] border-b border-[#14293f]">
                <tr>
                  <th className="py-3.5 px-4 font-bold">Candidate / Formula</th>
                  <th className="py-3.5 px-3 font-bold">Category</th>
                  <th className="py-3.5 px-3 font-bold text-[#fbbf24]">Band Gap (eV)</th>
                  <th className="py-3.5 px-3 font-bold text-[#38bdf8]">Formation Ef (eV/at)</th>
                  <th className="py-3.5 px-3 font-bold text-[#e2e8f0]">Volume (Å³)</th>
                  <th className="py-3.5 px-3 font-bold text-[#43d6a3]">Above Hull (eV/at)</th>
                  <th className="py-3.5 px-3 font-bold">Stability</th>
                  <th className="py-3.5 px-3 font-bold">FOM Score</th>
                  <th className="py-3.5 px-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#112439]">
                {filteredMaterials.map(m => {
                  const inCompare = compareList.includes(m.formula);
                  const isOnHull = (m.energyAboveHull ?? 0) === 0;

                  return (
                    <tr key={m.formula} className="hover:bg-[#0c2036] transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <span className="font-mono font-black text-white text-sm block">{m.formula}</span>
                            <span className="text-[11px] text-[#6886a2] truncate max-w-[170px] block">{m.name}</span>
                          </div>
                          {isOnHull && (
                            <span className="text-[9px] font-mono font-bold bg-[#0a271c] text-[#43d6a3] border border-[#175239] px-1.5 py-0.5 rounded">
                              Hull
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 px-3 font-medium text-[#9fc7ec]">{m.category}</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-[#fbbf24]">
                        {m.bandGap.toFixed(2)}
                        <span className="text-[10px] text-[#718ea8] ml-1 font-normal">({m.bandType})</span>
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-[#38bdf8]">
                        {m.formationEnergy > 0 ? '+' : ''}{m.formationEnergy.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-3 font-mono text-white">
                        {(m.volume ?? 100).toFixed(1)}
                      </td>
                      <td className={`py-3.5 px-3 font-mono font-bold ${isOnHull ? 'text-[#43d6a3]' : 'text-[#f59e0b]'}`}>
                        {(m.energyAboveHull ?? 0).toFixed(3)}
                      </td>
                      <td className="py-3.5 px-3 font-mono font-bold text-[#43d6a3]">{m.stability}%</td>
                      <td className="py-3.5 px-3 font-mono font-black text-white">{m.screeningScore}/100</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onSelectMaterial(m.formula)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#102740] hover:bg-[#18395c] text-[#56b6ff] hover:text-white font-bold text-[11px] border border-[#1d4168] transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                          <button
                            onClick={() => onAddToCompare(m.formula)}
                            disabled={inCompare || compareList.length >= 10}
                            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold border transition-colors cursor-pointer ${
                              inCompare
                                ? 'bg-[#0d281c] text-[#43d6a3] border-[#18613e]'
                                : 'bg-[#0b1d30] hover:bg-[#14304e] text-[#8aa5c0] hover:text-white border-[#1a3a5e]'
                            }`}
                          >
                            {inCompare ? 'Added' : '+ Compare'}
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
      )}
    </div>
  );
};
