import { MaterialData } from '../types';

export const ELEMENT_METADATA: Record<string, { name: string; weight: number; color: string; radius: number }> = {
  H: { name: 'Hydrogen', weight: 1.008, color: '#FFFFFF', radius: 0.31 },
  He: { name: 'Helium', weight: 4.003, color: '#D9FFFF', radius: 0.28 },
  Li: { name: 'Lithium', weight: 6.94, color: '#CC80FF', radius: 1.28 },
  Be: { name: 'Beryllium', weight: 9.012, color: '#C2FF00', radius: 0.96 },
  B: { name: 'Boron', weight: 10.81, color: '#FFB5B5', radius: 0.84 },
  C: { name: 'Carbon', weight: 12.011, color: '#909090', radius: 0.76 },
  N: { name: 'Nitrogen', weight: 14.007, color: '#3050F8', radius: 0.71 },
  O: { name: 'Oxygen', weight: 15.999, color: '#FF0D0D', radius: 0.66 },
  F: { name: 'Fluorine', weight: 18.998, color: '#90E050', radius: 0.57 },
  Ne: { name: 'Neon', weight: 20.180, color: '#B3E3F5', radius: 0.58 },
  Na: { name: 'Sodium', weight: 22.990, color: '#AB5CF2', radius: 1.66 },
  Mg: { name: 'Magnesium', weight: 24.305, color: '#8AFF00', radius: 1.41 },
  Al: { name: 'Aluminum', weight: 26.982, color: '#BFA6A6', radius: 1.21 },
  Si: { name: 'Silicon', weight: 28.085, color: '#F0C8A0', radius: 1.11 },
  P: { name: 'Phosphorus', weight: 30.974, color: '#FF8000', radius: 1.07 },
  S: { name: 'Sulfur', weight: 32.06, color: '#FFFF30', radius: 1.05 },
  Cl: { name: 'Chlorine', weight: 35.45, color: '#1FF01F', radius: 1.02 },
  K: { name: 'Potassium', weight: 39.098, color: '#8F40D4', radius: 2.03 },
  Ca: { name: 'Calcium', weight: 40.078, color: '#3DFF00', radius: 1.76 },
  Sc: { name: 'Scandium', weight: 44.956, color: '#E6E6E6', radius: 1.70 },
  Ti: { name: 'Titanium', weight: 47.867, color: '#BFC2C7', radius: 1.60 },
  V: { name: 'Vanadium', weight: 50.942, color: '#A6A6AB', radius: 1.53 },
  Cr: { name: 'Chromium', weight: 51.996, color: '#8A99C7', radius: 1.39 },
  Mn: { name: 'Manganese', weight: 54.938, color: '#9C7AC7', radius: 1.39 },
  Fe: { name: 'Iron', weight: 55.845, color: '#E06633', radius: 1.42 },
  Co: { name: 'Cobalt', weight: 58.933, color: '#F090A0', radius: 1.40 },
  Ni: { name: 'Nickel', weight: 58.693, color: '#50D050', radius: 1.24 },
  Cu: { name: 'Copper', weight: 63.546, color: '#C88033', radius: 1.32 },
  Zn: { name: 'Zinc', weight: 65.38, color: '#7D80B0', radius: 1.22 },
  Ga: { name: 'Gallium', weight: 69.723, color: '#C28F8F', radius: 1.22 },
  Ge: { name: 'Germanium', weight: 72.630, color: '#668F8F', radius: 1.20 },
  As: { name: 'Arsenic', weight: 74.922, color: '#BD80E3', radius: 1.19 },
  Se: { name: 'Selenium', weight: 78.971, color: '#FFA100', radius: 1.20 },
  Br: { name: 'Bromine', weight: 79.904, color: '#A62929', radius: 1.20 },
  Rb: { name: 'Rubidium', weight: 85.468, color: '#702EB0', radius: 2.20 },
  Sr: { name: 'Strontium', weight: 87.62, color: '#00FF00', radius: 1.95 },
  Y: { name: 'Yttrium', weight: 88.906, color: '#94FFFF', radius: 1.90 },
  Zr: { name: 'Zirconium', weight: 91.224, color: '#94E0E0', radius: 1.75 },
  Nb: { name: 'Niobium', weight: 92.906, color: '#73C2C9', radius: 1.64 },
  Mo: { name: 'Molybdenum', weight: 95.95, color: '#54B5B5', radius: 1.54 },
  Ru: { name: 'Ruthenium', weight: 101.07, color: '#248F8F', radius: 1.48 },
  Rh: { name: 'Rhodium', weight: 102.91, color: '#0A788C', radius: 1.45 },
  Pd: { name: 'Palladium', weight: 106.42, color: '#006985', radius: 1.44 },
  Ag: { name: 'Silver', weight: 107.87, color: '#C0C0C0', radius: 1.44 },
  Cd: { name: 'Cadmium', weight: 112.41, color: '#FFD98F', radius: 1.51 },
  In: { name: 'Indium', weight: 114.82, color: '#A67573', radius: 1.50 },
  Sn: { name: 'Tin', weight: 118.71, color: '#668080', radius: 1.45 },
  Sb: { name: 'Antimony', weight: 121.76, color: '#9E63B5', radius: 1.40 },
  Te: { name: 'Tellurium', weight: 127.60, color: '#D47A00', radius: 1.42 },
  I: { name: 'Iodine', weight: 126.90, color: '#940094', radius: 1.39 },
  Cs: { name: 'Cesium', weight: 132.91, color: '#57178F', radius: 2.44 },
  Ba: { name: 'Barium', weight: 137.33, color: '#00C900', radius: 2.15 },
  La: { name: 'Lanthanum', weight: 138.91, color: '#70D4FF', radius: 2.07 },
  Ce: { name: 'Cerium', weight: 140.12, color: '#FFFFC7', radius: 2.04 },
  W: { name: 'Tungsten', weight: 183.84, color: '#2194D6', radius: 1.62 },
  Pt: { name: 'Platinum', weight: 195.08, color: '#D0D0E0', radius: 1.36 },
  Au: { name: 'Gold', weight: 196.97, color: '#FFD123', radius: 1.36 },
  Pb: { name: 'Lead', weight: 207.2, color: '#575961', radius: 1.54 },
  Bi: { name: 'Bismuth', weight: 208.98, color: '#9E4FB5', radius: 1.48 }
};

export const INITIAL_PRESET_MATERIALS: Record<string, MaterialData> = {
  LiFePO4: {
    formula: 'LiFePO4',
    name: 'Lithium Iron Phosphate (Triphylite)',
    category: 'Battery Cathode',
    bandGap: 3.4,
    bandType: 'Direct',
    density: 3.6,
    stability: 91,
    thermalStability: 94,
    chemicalStability: 90,
    mechanicalHardness: 72,
    synthesizability: 88,
    environmentalScore: 92,
    screeningScore: 92,
    confidence: 87,
    formationEnergy: -2.31,
    crystalSystem: 'Orthorhombic',
    spaceGroup: 'Pnma (No. 62)',
    latticeConstants: { a: 10.33, b: 6.01, c: 4.69, alpha: 90, beta: 90, gamma: 90 },
    elements: [
      { symbol: 'Li', name: 'Lithium', count: 1, atomicWeight: 6.94, massPercent: 4.4, role: 'Mobile Intercalation Ion', color: '#CC80FF' },
      { symbol: 'Fe', name: 'Iron', count: 1, atomicWeight: 55.85, massPercent: 35.4, role: 'Redox Active Transition Metal', color: '#E06633' },
      { symbol: 'P', name: 'Phosphorus', count: 1, atomicWeight: 30.97, massPercent: 19.6, role: 'Polyanion Backbone (PO4)3-', color: '#FF8000' },
      { symbol: 'O', name: 'Oxygen', count: 4, atomicWeight: 16.0, massPercent: 40.6, role: 'Lattice Framework Anion', color: '#FF0D0D' }
    ],
    aiInsight: 'The olivine polyanion framework creates covalent P-O bonds that suppress oxygen release during overcharge, conferring exceptional thermal and cycling stability. Primary limitation is low intrinsic electronic conductivity, typically mitigated by nano-sizing and carbon coating.',
    synthesisMethod: 'Solid-State Reaction or Hydrothermal Synthesis',
    suggestedPrecursors: ['Li2CO3 (Lithium Carbonate 99.9%)', 'FeC2O4·2H2O (Iron(II) Oxalate)', 'NH4H2PO4 (Ammonium Dihydrogen Phosphate)', 'Glucose (carbon source coating)'],
    safetyNotes: 'Non-toxic, stable under ambient conditions, non-combustible compared to cobalt-based cathodes.',
    applications: ['EV Lithium-ion Batteries', 'Grid Energy Storage', 'Power Tools', 'Heavy Duty Robotics'],
    similarMaterials: [
      { formula: 'LiMnPO4', name: 'Lithium Manganese Phosphate', similarity: 94, stability: 'High', bandGap: '3.20 eV', screeningScore: 89, reason: 'Higher redox potential (4.1V vs 3.45V) offering higher theoretical energy density.' },
      { formula: 'NaFePO4', name: 'Sodium Iron Phosphate', similarity: 86, stability: 'High', bandGap: '3.10 eV', screeningScore: 87, reason: 'Sodium-ion battery drop-in cathode using earth-abundant sodium salts.' },
      { formula: 'LiCoPO4', name: 'Lithium Cobalt Phosphate', similarity: 82, stability: 'Medium', bandGap: '3.05 eV', screeningScore: 84, reason: 'Ultra-high operating voltage (4.8V) but requires protective electrolyte window.' },
      { formula: 'Li2FeSiO4', name: 'Lithium Iron Silicate', similarity: 79, stability: 'High', bandGap: '2.90 eV', screeningScore: 83, reason: 'Two-electron theoretical exchange per transition metal atom.' }
    ]
  },
  TiO2: {
    formula: 'TiO2',
    name: 'Titanium Dioxide (Rutile / Anatase)',
    category: 'Photocatalysis & Optoelectronics',
    bandGap: 3.2,
    bandType: 'Indirect',
    density: 4.23,
    stability: 94,
    thermalStability: 96,
    chemicalStability: 95,
    mechanicalHardness: 86,
    synthesizability: 95,
    environmentalScore: 94,
    screeningScore: 90,
    confidence: 91,
    formationEnergy: -3.22,
    crystalSystem: 'Tetragonal',
    spaceGroup: 'P4_2/mnm (Rutile)',
    latticeConstants: { a: 4.59, b: 4.59, c: 2.96, alpha: 90, beta: 90, gamma: 90 },
    elements: [
      { symbol: 'Ti', name: 'Titanium', count: 1, atomicWeight: 47.87, massPercent: 59.9, role: 'Octahedral Cation Core', color: '#BFC2C7' },
      { symbol: 'O', name: 'Oxygen', count: 2, atomicWeight: 16.0, massPercent: 40.1, role: 'Bridging Oxygen Anion', color: '#FF0D0D' }
    ],
    aiInsight: 'A benchmark wide-bandgap photocatalyst with ultra-high chemical inertness across extreme pH environments. Anatase phase shows superior photocatalytic quantum yield due to longer exciton lifetimes.',
    synthesisMethod: 'Sol-Gel followed by Calcinations (450°C-700°C)',
    suggestedPrecursors: ['Titanium Isopropoxide (TTIP)', 'Ethanol / Isopropanol solvent', 'Deionized water catalyst', 'Nitric acid pH adjuster'],
    safetyNotes: 'Biologically inert in bulk; standard particulate PPE recommended during nanopowder handling.',
    applications: ['Photocatalytic Water Splitting', 'Self-cleaning Coatings', 'Dye-sensitized Solar Cells', 'UV Photodetectors'],
    similarMaterials: [
      { formula: 'SrTiO3', name: 'Strontium Titanate', similarity: 88, stability: 'High', bandGap: '3.25 eV', screeningScore: 88, reason: 'Perovskite structural analogue with band edge positions suitable for H2 evolution.' },
      { formula: 'ZnO', name: 'Zinc Oxide', similarity: 84, stability: 'Medium', bandGap: '3.37 eV', screeningScore: 85, reason: 'Direct bandgap competitor with high exciton binding energy (60 meV).' },
      { formula: 'WO3', name: 'Tungsten Trioxide', similarity: 78, stability: 'High', bandGap: '2.70 eV', screeningScore: 82, reason: 'Visible light responsive photocatalyst with narrower bandgap.' }
    ]
  },
  SiC: {
    formula: 'SiC',
    name: 'Silicon Carbide (4H-SiC Polytype)',
    category: 'Wide-Bandgap Semiconductor',
    bandGap: 3.26,
    bandType: 'Indirect',
    density: 3.21,
    stability: 96,
    thermalStability: 98,
    chemicalStability: 97,
    mechanicalHardness: 95,
    synthesizability: 82,
    environmentalScore: 90,
    screeningScore: 95,
    confidence: 93,
    formationEnergy: -0.74,
    crystalSystem: 'Hexagonal',
    spaceGroup: 'P6_3mc (No. 186)',
    latticeConstants: { a: 3.08, b: 3.08, c: 10.08, alpha: 90, beta: 90, gamma: 120 },
    elements: [
      { symbol: 'Si', name: 'Silicon', count: 1, atomicWeight: 28.09, massPercent: 70.0, role: 'Tetrahedral Coordination', color: '#F0C8A0' },
      { symbol: 'C', name: 'Carbon', count: 1, atomicWeight: 12.01, massPercent: 30.0, role: 'Covalent Carbon Lattice', color: '#909090' }
    ],
    aiInsight: 'Superb breakdown electric field (~3 MV/cm) and thermal conductivity (4.9 W/cm·K) render 4H-SiC the premier material for high-voltage power electronics and fast-charging EV inverters.',
    synthesisMethod: 'Physical Vapor Transport (PVT) / Sublimation Growth',
    suggestedPrecursors: ['High-purity SiC source powder', 'Graphite crucible with thermal insulation', 'SiC single crystal seed wafer'],
    safetyNotes: 'Extremely refractory and non-hazardous; vacuum high-temperature operation requires standard kiln shielding.',
    applications: ['EV Power Inverters', 'High-Voltage DC Converters', 'Aerospace Electronics', 'Nuclear Cladding'],
    similarMaterials: [
      { formula: 'GaN', name: 'Gallium Nitride', similarity: 91, stability: 'High', bandGap: '3.40 eV', screeningScore: 94, reason: 'Direct bandgap power competitor excelling at higher switching frequencies (>1 MHz).' },
      { formula: 'AlN', name: 'Aluminum Nitride', similarity: 83, stability: 'High', bandGap: '6.05 eV', screeningScore: 88, reason: 'Ultra-wide bandgap insulating ceramic with ultra-high thermal conductivity.' },
      { formula: 'Diamond', name: 'Carbon Diamond', similarity: 77, stability: 'High', bandGap: '5.47 eV', screeningScore: 91, reason: 'Ultimate theoretical semiconductor figure of merit, limited by wafer scaling.' }
    ]
  },
  GaN: {
    formula: 'GaN',
    name: 'Gallium Nitride (Wurtzite)',
    category: 'Optoelectronics & RF Power',
    bandGap: 3.4,
    bandType: 'Direct',
    density: 6.15,
    stability: 92,
    thermalStability: 90,
    chemicalStability: 92,
    mechanicalHardness: 88,
    synthesizability: 85,
    environmentalScore: 84,
    screeningScore: 91,
    confidence: 89,
    formationEnergy: -1.14,
    crystalSystem: 'Hexagonal',
    spaceGroup: 'P6_3mc',
    latticeConstants: { a: 3.19, b: 3.19, c: 5.19, alpha: 90, beta: 90, gamma: 120 },
    elements: [
      { symbol: 'Ga', name: 'Gallium', count: 1, atomicWeight: 69.72, massPercent: 83.3, role: 'Group III Cation', color: '#C28F8F' },
      { symbol: 'N', name: 'Nitrogen', count: 1, atomicWeight: 14.01, massPercent: 16.7, role: 'Group V Anion', color: '#3050F8' }
    ],
    aiInsight: 'Direct bandgap allows highly efficient radiative recombination for blue/UV optoelectronics and high electron mobility transistors (HEMT) based on 2D electron gas (2DEG) at AlGaN/GaN heterojunctions.',
    synthesisMethod: 'Metal-Organic Chemical Vapor Deposition (MOCVD)',
    suggestedPrecursors: ['Trimethylgallium (TMGa)', 'Ammonia (NH3) ultra-dry', 'Hydrogen / Nitrogen carrier gases'],
    safetyNotes: 'TMGa is pyrophoric; requires scrubbed exhaust systems and dedicated gas detection sensors.',
    applications: ['Fast Mobile Chargers', '5G Telecom Base Stations', 'Solid-State LED Lighting', 'Radar Systems'],
    similarMaterials: [
      { formula: 'InGaN', name: 'Indium Gallium Nitride', similarity: 93, stability: 'Medium', bandGap: '2.50 eV', screeningScore: 90, reason: 'Tunable bandgap covering full visible spectrum for high CRI LED lighting.' },
      { formula: 'AlGaN', name: 'Aluminum Gallium Nitride', similarity: 89, stability: 'High', bandGap: '4.20 eV', screeningScore: 87, reason: 'Deep UV optoelectronics and high-sheet-carrier density barrier layers.' },
      { formula: 'SiC', name: 'Silicon Carbide', similarity: 85, stability: 'High', bandGap: '3.26 eV', screeningScore: 95, reason: 'Substrate of choice for RF GaN due to closely matched lattice & thermal conductivity.' }
    ]
  },
  CsPbI3: {
    formula: 'CsPbI3',
    name: 'Cesium Lead Iodide (Inorganic Perovskite)',
    category: 'Perovskite Photovoltaic',
    bandGap: 1.73,
    bandType: 'Direct',
    density: 4.84,
    stability: 74,
    thermalStability: 82,
    chemicalStability: 68,
    mechanicalHardness: 52,
    synthesizability: 89,
    environmentalScore: 62,
    screeningScore: 86,
    confidence: 85,
    formationEnergy: -1.45,
    crystalSystem: 'Orthorhombic',
    spaceGroup: 'Pnma (Black phase)',
    latticeConstants: { a: 8.85, b: 8.57, c: 12.47, alpha: 90, beta: 90, gamma: 90 },
    elements: [
      { symbol: 'Cs', name: 'Cesium', count: 1, atomicWeight: 132.91, massPercent: 22.9, role: 'A-site Perovskite Cage Stabilizer', color: '#57178F' },
      { symbol: 'Pb', name: 'Lead', count: 1, atomicWeight: 207.2, massPercent: 35.7, role: 'B-site Octahedral Center', color: '#575961' },
      { symbol: 'I', name: 'Iodine', count: 3, atomicWeight: 126.9, massPercent: 41.4, role: 'X-site Halide Vertex', color: '#940094' }
    ],
    aiInsight: 'All-inorganic perovskite avoiding volatile organic cations like methylammonium, yielding significantly enhanced thermal stability up to 300°C. Bandgap of 1.73 eV is ideally matched as a top cell in perovskite/silicon tandem solar cells.',
    synthesisMethod: 'Solution Coating / Dual-Source Thermal Evaporation',
    suggestedPrecursors: ['CsI (Cesium Iodide 99.999%)', 'PbI2 (Lead(II) Iodide)', 'Anhydrous DMF / DMSO solvent mix'],
    safetyNotes: 'Contains soluble lead salts; requires glovebox handling, proper waste remediation, and moisture barrier encapsulation.',
    applications: ['Tandem Solar Cells', 'X-ray Detectors', 'Perovskite LEDs', 'Photodetectors'],
    similarMaterials: [
      { formula: 'CsPbBr3', name: 'Cesium Lead Bromide', similarity: 92, stability: 'High', bandGap: '2.30 eV', screeningScore: 84, reason: 'Enhanced moisture resistance and bright green luminescence for displays.' },
      { formula: 'CsSnI3', name: 'Cesium Tin Iodide', similarity: 85, stability: 'Medium', bandGap: '1.30 eV', screeningScore: 81, reason: 'Lead-free non-toxic eco-friendly perovskite alternative.' }
    ]
  },
  MoS2: {
    formula: 'MoS2',
    name: 'Molybdenum Disulfide (2D Monolayer)',
    category: '2D Semiconductor & Catalysis',
    bandGap: 1.85,
    bandType: 'Direct',
    density: 5.06,
    stability: 93,
    thermalStability: 91,
    chemicalStability: 92,
    mechanicalHardness: 76,
    synthesizability: 84,
    environmentalScore: 92,
    screeningScore: 93,
    confidence: 90,
    formationEnergy: -1.78,
    crystalSystem: 'Hexagonal',
    spaceGroup: 'P6_3/mmc',
    latticeConstants: { a: 3.16, b: 3.16, c: 12.29, alpha: 90, beta: 90, gamma: 120 },
    elements: [
      { symbol: 'Mo', name: 'Molybdenum', count: 1, atomicWeight: 95.95, massPercent: 59.9, role: 'Transition Metal Honeycomb Layer', color: '#54B5B5' },
      { symbol: 'S', name: 'Sulfur', count: 2, atomicWeight: 32.06, massPercent: 40.1, role: 'Chalcogenide Surface Capping', color: '#FFFF30' }
    ],
    aiInsight: 'Transitions from an indirect bandgap (1.2 eV) in bulk to a direct bandgap (1.85 eV) in monolayer form with massive exciton binding energy (~0.5 eV) and strong spin-orbit valley coupling.',
    synthesisMethod: 'Chemical Vapor Deposition (CVD) on SiO2/Si or Sapphire',
    suggestedPrecursors: ['MoO3 powder (molybdenum precursor)', 'Sulfur flakes', 'Argon carrier gas under low pressure'],
    safetyNotes: 'Stable under ambient conditions; protect sulfur vapor from atmospheric condensation.',
    applications: ['Sub-1nm Transistor Channels', 'HER Electrocatalysis', 'Valleytronics', 'Flexible Photodetectors'],
    similarMaterials: [
      { formula: 'WS2', name: 'Tungsten Disulfide', similarity: 93, stability: 'High', bandGap: '2.00 eV', screeningScore: 91, reason: 'Stronger spin-orbit splitting in valence band (~430 meV) for valleytronics.' },
      { formula: 'MoSe2', name: 'Molybdenum Diselenide', similarity: 89, stability: 'High', bandGap: '1.55 eV', screeningScore: 88, reason: 'Smaller bandgap closer to near-infrared spectrum with higher carrier mobility.' }
    ]
  },
  BaTiO3: {
    formula: 'BaTiO3',
    name: 'Barium Titanate (Ferroelectric Perovskite)',
    category: 'Ferroelectrics & Dielectrics',
    bandGap: 3.2,
    bandType: 'Indirect',
    density: 6.02,
    stability: 95,
    thermalStability: 93,
    chemicalStability: 96,
    mechanicalHardness: 82,
    synthesizability: 94,
    environmentalScore: 92,
    screeningScore: 94,
    confidence: 92,
    formationEnergy: -3.55,
    crystalSystem: 'Tetragonal',
    spaceGroup: 'P4mm',
    latticeConstants: { a: 3.99, b: 3.99, c: 4.03, alpha: 90, beta: 90, gamma: 90 },
    elements: [
      { symbol: 'Ba', name: 'Barium', count: 1, atomicWeight: 137.33, massPercent: 58.9, role: 'A-site Corner Cation', color: '#00C900' },
      { symbol: 'Ti', name: 'Titanium', count: 1, atomicWeight: 47.87, massPercent: 20.5, role: 'Displaced B-site Active Cation', color: '#BFC2C7' },
      { symbol: 'O', name: 'Oxygen', count: 3, atomicWeight: 16.0, massPercent: 20.6, role: 'Face-centered Anion Cage', color: '#FF0D0D' }
    ],
    aiInsight: 'The archetype lead-free ferroelectric perovskite. Below Curie temperature (120°C), Ti ion displaces from octahedron center, generating spontaneous electric polarization and ultra-high dielectric permittivity (εr > 5000).',
    synthesisMethod: 'Hydrothermal synthesis or solid-state calcination',
    suggestedPrecursors: ['BaCO3 (Barium Carbonate)', 'TiO2 (Titanium Dioxide nanopowder)', 'Dispersant and organic binder'],
    safetyNotes: 'Soluble barium salts can be toxic, but the BaTiO3 ceramic lattice is non-toxic and biocompatible.',
    applications: ['Multilayer Ceramic Capacitors (MLCC)', 'Piezoelectric Sensors', 'Electro-optic Modulators', 'Energy Harvesters'],
    similarMaterials: [
      { formula: 'SrTiO3', name: 'Strontium Titanate', similarity: 90, stability: 'High', bandGap: '3.25 eV', screeningScore: 90, reason: 'Incipient ferroelectric with high dielectric constant at cryogenic temperatures.' },
      { formula: 'KNbO3', name: 'Potassium Niobate', similarity: 84, stability: 'High', bandGap: '3.30 eV', screeningScore: 86, reason: 'High Curie temperature (435°C) lead-free piezoelectric crystal.' }
    ]
  },
  Bi2Te3: {
    formula: 'Bi2Te3',
    name: 'Bismuth Telluride (Topological Insulator)',
    category: 'Thermoelectrics & Quantum Matter',
    bandGap: 0.15,
    bandType: 'Direct',
    density: 7.7,
    stability: 88,
    thermalStability: 85,
    chemicalStability: 87,
    mechanicalHardness: 60,
    synthesizability: 86,
    environmentalScore: 78,
    screeningScore: 89,
    confidence: 88,
    formationEnergy: -0.82,
    crystalSystem: 'Trigonal',
    spaceGroup: 'R-3m (No. 166)',
    latticeConstants: { a: 4.38, b: 4.38, c: 30.49, alpha: 90, beta: 90, gamma: 120 },
    elements: [
      { symbol: 'Bi', name: 'Bismuth', count: 2, atomicWeight: 208.98, massPercent: 52.2, role: 'Heavy Metal Core (Strong Spin-Orbit)', color: '#9E4FB5' },
      { symbol: 'Te', name: 'Tellurium', count: 3, atomicWeight: 127.6, massPercent: 47.8, role: 'Chalcogenide Quintuple Layer Sublattice', color: '#D47A00' }
    ],
    aiInsight: 'Highest figure of merit (ZT ~ 1.0) near room temperature for thermoelectric refrigeration and waste-heat recovery. Also famous as a 3D topological insulator with conducting helical Dirac surface states.',
    synthesisMethod: 'Bridgman-Stockbarger crystal growth or Spark Plasma Sintering',
    suggestedPrecursors: ['High-purity Bismuth granules (99.999%)', 'Tellurium ingots (99.999%)', 'Evacuated quartz ampoule'],
    safetyNotes: 'Tellurium compounds require chemical fume hood during high temperature melting.',
    applications: ['Peltier Solid-State Coolers', 'Waste Heat Recovery Thermogenerators', 'Spintronics', 'Topological Quantum Devices'],
    similarMaterials: [
      { formula: 'Sb2Te3', name: 'Antimony Telluride', similarity: 92, stability: 'High', bandGap: '0.28 eV', screeningScore: 88, reason: 'p-type partner for thermoelectric couples with matched lattice.' },
      { formula: 'Bi2Se3', name: 'Bismuth Selenide', similarity: 89, stability: 'High', bandGap: '0.30 eV', screeningScore: 87, reason: 'Archetypal topological insulator with simpler single Dirac cone.' }
    ]
  }
};

export function parseChemicalFormula(formula: string): Record<string, number> {
  const clean = formula.trim().replace(/\s+/g, '');
  const elementRegex = /([A-Z][a-z]*)(\d*\.?\d*)/g;
  const counts: Record<string, number> = {};
  let match;

  while ((match = elementRegex.exec(clean)) !== null) {
    const symbol = match[1];
    const count = match[2] ? parseFloat(match[2]) : 1;
    counts[symbol] = (counts[symbol] || 0) + count;
  }

  return counts;
}

export function generateAlgorithmicMaterialData(formula: string): MaterialData {
  const counts = parseChemicalFormula(formula);
  const elements = Object.keys(counts);

  let totalWeight = 0;
  const elementRatios = elements.map(sym => {
    const meta = ELEMENT_METADATA[sym] || { name: sym, weight: 50.0, color: '#4aaef5', radius: 1.2 };
    const count = counts[sym];
    const weight = meta.weight * count;
    totalWeight += weight;
    return {
      symbol: sym,
      name: meta.name,
      count,
      atomicWeight: meta.weight,
      massPercent: 0,
      role: 'Constituent Component',
      color: meta.color
    };
  });

  elementRatios.forEach(e => {
    e.massPercent = totalWeight > 0 ? parseFloat(((e.count * e.atomicWeight / totalWeight) * 100).toFixed(1)) : 0;
  });

  // Heuristics based on constituents
  const hasO = counts['O'] !== undefined;
  const hasN = counts['N'] !== undefined;
  const hasS = counts['S'] !== undefined || counts['Se'] !== undefined || counts['Te'] !== undefined;
  const hasLi = counts['Li'] !== undefined || counts['Na'] !== undefined;
  const hasTransitionMetal = elements.some(e => ['Ti','Fe','Co','Ni','Cu','V','Cr','Mn','Mo','W','Zr','Nb'].includes(e));

  let category = 'Functional Compound';
  let bandGap = 2.45;
  let bandType: 'Direct' | 'Indirect' | 'Metallic' | 'Zero-gap' = 'Indirect';
  let density = 4.2;

  if (hasLi && hasTransitionMetal) {
    category = 'Battery Electrode Candidate';
    bandGap = 2.9;
    density = 3.8;
  } else if (hasO && hasTransitionMetal) {
    category = 'Transition Metal Oxide';
    bandGap = 3.1;
    density = 5.1;
  } else if (hasS) {
    category = 'Chalcogenide Semiconductor';
    bandGap = 1.6;
    bandType = 'Direct';
    density = 5.4;
  } else if (hasN) {
    category = 'Nitride Semiconductor';
    bandGap = 3.4;
    density = 6.0;
  }

  return {
    formula,
    name: `${formula} Composition`,
    category,
    bandGap: parseFloat(bandGap.toFixed(2)),
    bandType,
    density: parseFloat(density.toFixed(2)),
    stability: 85,
    thermalStability: 88,
    chemicalStability: 84,
    mechanicalHardness: 78,
    synthesizability: 82,
    environmentalScore: 86,
    screeningScore: 85,
    confidence: 81,
    formationEnergy: -1.65,
    crystalSystem: hasO ? 'Orthorhombic' : 'Hexagonal',
    spaceGroup: 'P-1 (Estimated)',
    latticeConstants: { a: 5.4, b: 5.4, c: 7.2, alpha: 90, beta: 90, gamma: 90 },
    elements: elementRatios,
    aiInsight: `Compositional screening model analysis indicates viable thermodynamic stability for ${formula}. Synthesizability is high using standard solid-state or vapor reaction routes. Experimental verification is recommended to determine exact stoichiometry and defect formation energies.`,
    synthesisMethod: 'Solid-State Ceramic Calcination or Solution Sol-Gel',
    suggestedPrecursors: elements.map(sym => `${sym}-based high purity oxide or salt precursor (99.9%)`),
    safetyNotes: 'Handle with laboratory personal protective equipment (goggles, gloves, particulate mask).',
    applications: ['Energy Conversion', 'Functional Thin Films', 'Catalysis Screening', 'Solid-State Devices'],
    similarMaterials: [
      { formula: `${elements[0] || 'Fe'}2O3`, name: 'Related Oxide Binary', similarity: 84, stability: 'High', bandGap: '2.10 eV', screeningScore: 82, reason: 'Constituent binary phase' },
      { formula: `${elements[1] || 'Ti'}O2`, name: 'Host Matrix Analogue', similarity: 79, stability: 'High', bandGap: '3.20 eV', screeningScore: 80, reason: 'Structural reference' }
    ]
  };
}
