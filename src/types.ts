export type CrystalSystem =
  | 'Cubic'
  | 'Tetragonal'
  | 'Orthorhombic'
  | 'Hexagonal'
  | 'Trigonal'
  | 'Monoclinic'
  | 'Triclinic';

export interface ElementRatio {
  symbol: string;
  name: string;
  count: number;
  atomicWeight: number;
  massPercent: number;
  role: string;
  color: string;
}

export interface LatticeParameters {
  a: number; // in Ångströms
  b: number;
  c: number;
  alpha: number; // in degrees
  beta: number;
  gamma: number;
}

export interface CandidateMaterial {
  formula: string;
  name: string;
  similarity: number; // 0-100%
  stability: 'High' | 'Medium' | 'Low';
  bandGap: string;
  screeningScore: number;
  reason: string;
}

export interface MaterialData {
  formula: string;
  name: string;
  category: string;
  bandGap: number; // in eV
  bandType: 'Direct' | 'Indirect' | 'Metallic' | 'Zero-gap';
  density: number; // g/cm³
  stability: number; // 0-100
  thermalStability: number; // 0-100
  chemicalStability: number; // 0-100
  mechanicalHardness: number; // 0-100
  synthesizability: number; // 0-100
  environmentalScore: number; // 0-100
  screeningScore: number; // 0-100
  confidence: number; // 0-100
  formationEnergy: number; // eV/atom (usually negative for stable compounds)
  volume: number; // Unit cell volume in Å³
  energyAboveHull: number; // Energy above convex hull in eV/atom (0.000 = ground state on hull, <0.05 = synthesizable)
  crystalSystem: CrystalSystem;
  spaceGroup: string;
  latticeConstants: LatticeParameters;
  elements: ElementRatio[];
  aiInsight: string;
  synthesisMethod: string;
  suggestedPrecursors: string[];
  safetyNotes: string;
  applications: string[];
  similarMaterials: CandidateMaterial[];
  analyzedAt?: string;
  isAiGenerated?: boolean;
}

export interface LabNote {
  id: string;
  materialFormula: string;
  timestamp: number;
  note: string;
  tags: string[];
  priority: 'High' | 'Medium' | 'Low';
  status: 'Screened' | 'In Testing' | 'Synthesized' | 'Archived';
}

export interface ScreeningFilter {
  searchQuery: string;
  application: string;
  minBandGap: number;
  maxBandGap: number;
  minStability: number;
  minScore: number;
  crystalSystem: string;
  requiredElement: string;
  maxEnergyAboveHull?: number; // in eV/atom (e.g. 0.00 = only on hull, 0.05 = metastable)
  maxFormationEnergy?: number; // in eV/atom (e.g. <= -1.0 eV/atom)
  maxVolume?: number; // in Å³
}

export type ActiveTab = 'dashboard' | 'discover' | 'compare' | 'history';
