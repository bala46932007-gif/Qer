import React from 'react';
import { MaterialData } from '../types';
import { Layers, Atom } from 'lucide-react';

interface ElementBreakdownProps {
  material: MaterialData;
}

export const ElementBreakdown: React.FC<ElementBreakdownProps> = ({ material }) => {
  const elements = material?.elements || [];
  const totalMolarMass = elements.reduce(
    (acc, el) => acc + (el.count || 1) * (el.atomicWeight || 1),
    0
  );

  return (
    <div className="rounded-2xl bg-[#0d1a2b] border border-[#1e334c] p-4 flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Atom className="w-4 h-4 text-[#56b6ff]" />
          <h3 className="text-base font-bold text-white">Elemental Composition & Stoichiometry</h3>
        </div>
        <span className="text-xs font-mono text-[#91a7bd] bg-[#102236] px-2.5 py-1 rounded-md border border-[#1b324d]">
          Molar Mass: <b className="text-white font-semibold">{totalMolarMass.toFixed(2)}</b> g/mol
        </span>
      </div>

      {/* Mass Percent Bar */}
      <div className="h-3 w-full rounded-full overflow-hidden flex bg-[#122338] mb-3 p-0.5 border border-[#1e344e]">
        {elements.map((el, i) => (
          <div
            key={el.symbol || i}
            style={{
              width: `${el.massPercent || 100 / (elements.length || 1)}%`,
              backgroundColor: el.color || '#56b6ff',
            }}
            className="h-full transition-all duration-300 relative group"
            title={`${el.symbol}: ${el.massPercent}% mass`}
          />
        ))}
      </div>

      {/* Element Detail Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {elements.map((el, i) => (
          <div
            key={el.symbol || i}
            className="bg-[#091524] rounded-xl p-3 border border-[#182c42] flex flex-col justify-between hover:border-[#2b4c73] transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs text-white border border-white/20"
                  style={{ backgroundColor: el.color || '#56b6ff' }}
                >
                  {el.symbol}
                </div>
                <div>
                  <strong className="text-sm text-white block leading-tight">{el.name}</strong>
                  <span className="text-[10px] text-[#718aa3]">Atomic Wt: {el.atomicWeight.toFixed(2)}</span>
                </div>
              </div>
              <span className="text-xs font-bold text-[#43d6a3] bg-[#0c261e] px-1.5 py-0.5 rounded border border-[#1a4d3b]">
                {el.massPercent}%
              </span>
            </div>

            <div className="mt-2.5 pt-2 border-t border-[#14263b] flex items-center justify-between text-[11px]">
              <span className="text-[#849bb1]">Stoichiometry:</span>
              <span className="font-mono text-white font-semibold">{el.count} atoms</span>
            </div>
            <div className="text-[10px] text-[#56b6ff] mt-1 truncate" title={el.role}>
              {el.role}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
