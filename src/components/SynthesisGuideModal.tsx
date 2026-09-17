import React from 'react';
import { X, FlaskConical, AlertTriangle, CheckCircle2, Flame, ShieldAlert, FileText } from 'lucide-react';
import { MaterialData } from '../types';

interface SynthesisGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  material: MaterialData;
}

export const SynthesisGuideModal: React.FC<SynthesisGuideModalProps> = ({
  isOpen,
  onClose,
  material
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="bg-[#0c182a] border border-[#1e334c] rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1c324c] bg-[#0f2136]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#56b6ff]/10 text-[#56b6ff] border border-[#56b6ff]/30">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Laboratory Synthesis Blueprint: <span className="font-mono text-[#56b6ff]">{material.formula}</span>
              </h2>
              <p className="text-xs text-[#8ca4bb]">{material.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#8ca4bb] hover:text-white hover:bg-[#152a42]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Method summary */}
          <div className="bg-[#081220] rounded-xl p-4 border border-[#182c44]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#56b6ff] uppercase tracking-wider mb-1">
              <Flame className="w-3.5 h-3.5" />
              Primary Synthesis Methodology
            </div>
            <p className="text-white font-semibold text-base mb-1">{material.synthesisMethod}</p>
            <p className="text-xs text-[#8ca4bb] leading-relaxed">
              Standard laboratory protocol optimized for high phase purity and minimum defect density.
            </p>
          </div>

          {/* Precursors list */}
          <div>
            <h4 className="text-xs font-bold text-[#8ca4bb] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#43d6a3]" />
              Recommended Precursors & Reagents
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {material.suggestedPrecursors.map((prec, i) => (
                <div key={i} className="bg-[#0e1f33] p-3 rounded-xl border border-[#1a344e] flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#162e49] text-[#56b6ff] flex items-center justify-center text-xs font-bold font-mono">
                    {i + 1}
                  </span>
                  <span className="text-xs text-white font-medium">{prec}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety and Handling */}
          <div className="bg-[#241315] border border-[#52252a] rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-[#ff6b6b] uppercase tracking-wider mb-1.5">
              <ShieldAlert className="w-4 h-4" />
              Safety & Handling Precautions
            </div>
            <p className="text-xs text-[#e8b4b8] leading-relaxed">
              {material.safetyNotes}
            </p>
          </div>

          {/* Characterization Checklist */}
          <div className="bg-[#091524] rounded-xl p-4 border border-[#172c44]">
            <h4 className="text-xs font-bold text-[#8ca4bb] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-[#56b6ff]" />
              Recommended Phase Validation Checklist
            </h4>
            <ul className="text-xs text-[#a1b8ce] space-y-1.5 list-disc pl-4">
              <li><b>Powder X-ray Diffraction (PXRD):</b> Match Bragg reflection peaks against space group <span className="font-mono text-white">{material.spaceGroup}</span>.</li>
              <li><b>Scanning Electron Microscopy (SEM/EDS):</b> Validate stoichiometric molar ratios and grain boundary morphologies.</li>
              <li><b>Thermogravimetric Analysis (TGA):</b> Confirm thermal stability up to predicted limit (Stability score: {material.thermalStability}%).</li>
              <li><b>Spectroscopic Ellipsometry / UV-Vis:</b> Measure optical absorption edge for bandgap of <span className="text-white font-semibold">{material.bandGap} eV</span>.</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#1b314a] bg-[#0c1a2c] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#1a3350] hover:bg-[#22446a] transition-colors"
          >
            Close Blueprint
          </button>
        </div>
      </div>
    </div>
  );
};
