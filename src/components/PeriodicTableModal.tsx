import React, { useState } from 'react';
import { X, Check, Trash2, Atom, Search } from 'lucide-react';
import { ELEMENT_METADATA } from '../data/materialsDatabase';

interface PeriodicTableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectFormula: (formula: string) => void;
  currentFormula: string;
}

// Compact layout grid coordinates for common elements
const PERIODIC_ELEMENTS = [
  // Period 1
  { symbol: 'H', row: 1, col: 1, type: 'nonmetal' },
  { symbol: 'He', row: 1, col: 18, type: 'noble' },
  // Period 2
  { symbol: 'Li', row: 2, col: 1, type: 'alkali' },
  { symbol: 'Be', row: 2, col: 2, type: 'alkaline' },
  { symbol: 'B', row: 2, col: 13, type: 'metalloid' },
  { symbol: 'C', row: 2, col: 14, type: 'nonmetal' },
  { symbol: 'N', row: 2, col: 15, type: 'nonmetal' },
  { symbol: 'O', row: 2, col: 16, type: 'nonmetal' },
  { symbol: 'F', row: 2, col: 17, type: 'halogen' },
  { symbol: 'Ne', row: 2, col: 18, type: 'noble' },
  // Period 3
  { symbol: 'Na', row: 3, col: 1, type: 'alkali' },
  { symbol: 'Mg', row: 3, col: 2, type: 'alkaline' },
  { symbol: 'Al', row: 3, col: 13, type: 'metal' },
  { symbol: 'Si', row: 3, col: 14, type: 'metalloid' },
  { symbol: 'P', row: 3, col: 15, type: 'nonmetal' },
  { symbol: 'S', row: 3, col: 16, type: 'nonmetal' },
  { symbol: 'Cl', row: 3, col: 17, type: 'halogen' },
  // Period 4
  { symbol: 'K', row: 4, col: 1, type: 'alkali' },
  { symbol: 'Ca', row: 4, col: 2, type: 'alkaline' },
  { symbol: 'Sc', row: 4, col: 3, type: 'transition' },
  { symbol: 'Ti', row: 4, col: 4, type: 'transition' },
  { symbol: 'V', row: 4, col: 5, type: 'transition' },
  { symbol: 'Cr', row: 4, col: 6, type: 'transition' },
  { symbol: 'Mn', row: 4, col: 7, type: 'transition' },
  { symbol: 'Fe', row: 4, col: 8, type: 'transition' },
  { symbol: 'Co', row: 4, col: 9, type: 'transition' },
  { symbol: 'Ni', row: 4, col: 10, type: 'transition' },
  { symbol: 'Cu', row: 4, col: 11, type: 'transition' },
  { symbol: 'Zn', row: 4, col: 12, type: 'transition' },
  { symbol: 'Ga', row: 4, col: 13, type: 'metal' },
  { symbol: 'Ge', row: 4, col: 14, type: 'metalloid' },
  { symbol: 'As', row: 4, col: 15, type: 'metalloid' },
  { symbol: 'Se', row: 4, col: 16, type: 'nonmetal' },
  { symbol: 'Br', row: 4, col: 17, type: 'halogen' },
  // Period 5
  { symbol: 'Rb', row: 5, col: 1, type: 'alkali' },
  { symbol: 'Sr', row: 5, col: 2, type: 'alkaline' },
  { symbol: 'Y', row: 5, col: 3, type: 'transition' },
  { symbol: 'Zr', row: 5, col: 4, type: 'transition' },
  { symbol: 'Nb', row: 5, col: 5, type: 'transition' },
  { symbol: 'Mo', row: 5, col: 6, type: 'transition' },
  { symbol: 'Ru', row: 5, col: 8, type: 'transition' },
  { symbol: 'Rh', row: 5, col: 9, type: 'transition' },
  { symbol: 'Pd', row: 5, col: 10, type: 'transition' },
  { symbol: 'Ag', row: 5, col: 11, type: 'transition' },
  { symbol: 'Cd', row: 5, col: 12, type: 'transition' },
  { symbol: 'In', row: 5, col: 13, type: 'metal' },
  { symbol: 'Sn', row: 5, col: 14, type: 'metal' },
  { symbol: 'Sb', row: 5, col: 15, type: 'metalloid' },
  { symbol: 'Te', row: 5, col: 16, type: 'metalloid' },
  { symbol: 'I', row: 5, col: 17, type: 'halogen' },
  // Period 6
  { symbol: 'Cs', row: 6, col: 1, type: 'alkali' },
  { symbol: 'Ba', row: 6, col: 2, type: 'alkaline' },
  { symbol: 'La', row: 6, col: 3, type: 'lanthanide' },
  { symbol: 'W', row: 6, col: 6, type: 'transition' },
  { symbol: 'Pt', row: 6, col: 10, type: 'transition' },
  { symbol: 'Au', row: 6, col: 11, type: 'transition' },
  { symbol: 'Pb', row: 6, col: 14, type: 'metal' },
  { symbol: 'Bi', row: 6, col: 15, type: 'metal' }
];

const TYPE_COLORS: Record<string, string> = {
  alkali: '#9b5de5',
  alkaline: '#f15bb5',
  transition: '#00bbf9',
  metal: '#00f5d4',
  metalloid: '#fee440',
  nonmetal: '#ff6b6b',
  halogen: '#ff9f1c',
  noble: '#a0c4ff',
  lanthanide: '#c77dff'
};

export const PeriodicTableModal: React.FC<PeriodicTableModalProps> = ({
  isOpen,
  onClose,
  onSelectFormula,
  currentFormula
}) => {
  const [builderFormula, setBuilderFormula] = useState(currentFormula || 'LiFePO4');
  const [selectedSubscript, setSelectedSubscript] = useState('1');

  if (!isOpen) return null;

  const handleAddElement = (symbol: string) => {
    const subscript = selectedSubscript === '1' ? '' : selectedSubscript;
    setBuilderFormula(prev => prev + symbol + subscript);
  };

  const handleApply = () => {
    if (builderFormula.trim()) {
      onSelectFormula(builderFormula.trim());
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#0b1728] border border-[#1e334c] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c324c] bg-[#0d1c30]">
          <div className="flex items-center gap-2">
            <Atom className="w-5 h-5 text-[#56b6ff]" />
            <div>
              <h2 className="text-lg font-bold text-white">Periodic Table Formula Builder</h2>
              <p className="text-xs text-[#829bb3]">Click elements to compose or modify candidate chemical formulas</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#829bb3] hover:text-white hover:bg-[#152a42]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formula Input / Preview Bar */}
        <div className="px-6 py-3 bg-[#081220] border-b border-[#182d44] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 min-w-[240px]">
            <span className="text-xs text-[#7891a9]">Target Formula:</span>
            <input
              type="text"
              value={builderFormula}
              onChange={e => setBuilderFormula(e.target.value)}
              className="bg-[#0e1d30] border border-[#233d59] rounded-lg px-3 py-1.5 text-white font-mono text-base font-bold focus:border-[#56b6ff] outline-none flex-1"
              placeholder="e.g. LiFePO4"
            />
            <button
              onClick={() => setBuilderFormula('')}
              className="p-2 text-[#7891a9] hover:text-[#ff5c5c] rounded-lg hover:bg-[#15273b]"
              title="Clear formula"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Subscript selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#7891a9]">Subscript:</span>
            {['1', '2', '3', '4', '0.5'].map(num => (
              <button
                key={num}
                onClick={() => setSelectedSubscript(num)}
                className={`px-2 py-1 rounded text-xs font-mono font-bold border transition-colors ${
                  selectedSubscript === num
                    ? 'bg-[#56b6ff] text-black border-[#56b6ff]'
                    : 'bg-[#102338] text-[#91a7bd] border-[#1b344e] hover:text-white'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Grid */}
        <div className="p-6 overflow-x-auto overflow-y-auto max-h-[55vh]">
          <div className="min-w-[700px] grid grid-cols-18 gap-1">
            {Array.from({ length: 6 }).map((_, rIdx) => {
              const rowNum = rIdx + 1;
              return Array.from({ length: 18 }).map((_, cIdx) => {
                const colNum = cIdx + 1;
                const el = PERIODIC_ELEMENTS.find(e => e.row === rowNum && e.col === colNum);
                if (!el) {
                  return <div key={`${rowNum}-${colNum}`} className="h-10 w-full" />;
                }
                const meta = ELEMENT_METADATA[el.symbol] || { name: el.symbol, weight: 0 };
                const color = TYPE_COLORS[el.type] || '#56b6ff';

                return (
                  <button
                    key={el.symbol}
                    onClick={() => handleAddElement(el.symbol)}
                    className="h-11 rounded-lg flex flex-col items-center justify-center p-0.5 border border-[#1b324d] bg-[#0d1c2e] hover:bg-[#17304d] hover:border-[#56b6ff] hover:scale-105 active:scale-95 transition-all group"
                    title={`${meta.name} (${el.symbol}) - Wt: ${meta.weight}`}
                  >
                    <span className="text-xs font-bold font-mono leading-none" style={{ color }}>
                      {el.symbol}
                    </span>
                    <span className="text-[8px] text-[#6b859e] leading-none mt-0.5 group-hover:text-white">
                      {Math.round(meta.weight)}
                    </span>
                  </button>
                );
              });
            })}
          </div>

          {/* Quick presets */}
          <div className="mt-4 pt-4 border-t border-[#182c42] flex items-center gap-2 flex-wrap text-xs">
            <span className="text-[#6b859e]">Quick Load:</span>
            {['LiFePO4', 'TiO2', 'SiC', 'GaN', 'CsPbI3', 'MoS2', 'BaTiO3', 'Bi2Te3', 'WS2', 'SrTiO3'].map(preset => (
              <button
                key={preset}
                onClick={() => setBuilderFormula(preset)}
                className="bg-[#0e2136] text-[#91a7bd] hover:text-white hover:border-[#56b6ff] px-2.5 py-1 rounded-md border border-[#1b344e] font-mono transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#1b314a] bg-[#0c1a2c] flex items-center justify-between">
          <span className="text-xs text-[#718aa3]">
            Selected: <b className="text-white font-mono">{builderFormula || 'None'}</b>
          </span>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[#8ca4bb] hover:text-white hover:bg-[#142940] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#48aef5] to-[#6c72ff] hover:opacity-95 shadow-lg flex items-center gap-1.5 transition-opacity"
            >
              <Check className="w-4 h-4" />
              Analyze Material
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
