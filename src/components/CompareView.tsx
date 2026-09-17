import React, { useState } from 'react';
import { GitCompare, Sparkles, X, Plus, CheckCircle2, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import { MaterialData } from '../types';
import { PropertyRadar } from './PropertyRadar';
import { INITIAL_PRESET_MATERIALS, generateAlgorithmicMaterialData } from '../data/materialsDatabase';

interface CompareViewProps {
  compareList: string[];
  onRemoveFromCompare: (formula: string) => void;
  onAddToCompare: (formula: string) => void;
  onSelectForDossier: (formula: string) => void;
  allMaterials: Record<string, MaterialData>;
}

interface ComparisonResult {
  verdict: string;
  bestForTarget: string;
  comparisonPoints: { dimension: string; winner: string; analysis: string }[];
  experimentalRecommendations: string[];
}

export const CompareView: React.FC<CompareViewProps> = ({
  compareList,
  onRemoveFromCompare,
  onAddToCompare,
  onSelectForDossier,
  allMaterials,
}) => {
  const [newFormulaInput, setNewFormulaInput] = useState('');
  const [targetApplication, setTargetApplication] = useState('High Energy Density & Thermal Stability');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiComparison, setAiComparison] = useState<ComparisonResult | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);

  // Resolve full material data for each formula in compareList
  const materials: MaterialData[] = compareList.map(formula => {
    return allMaterials[formula] || INITIAL_PRESET_MATERIALS[formula] || generateAlgorithmicMaterialData(formula);
  });

  const handleAddFormula = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormulaInput.trim()) return;
    onAddToCompare(newFormulaInput.trim());
    setNewFormulaInput('');
  };

  const handleRunAiEvaluation = async () => {
    if (materials.length < 2) return;
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
      <div className="rounded-2xl bg-gradient-to-r from-[#10233b] to-[#091524] border border-[#1b324d] p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-[#56b6ff] uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <GitCompare className="w-4 h-4" />
              Multi-Candidate Trade-off Evaluation
            </div>
            <h2 className="text-2xl font-black text-white">Compare Material Candidates</h2>
            <p className="text-xs text-[#8ca4bb] max-w-xl mt-1">
              Benchmark electronic structures, thermodynamic stability, and synthetic feasibility across competing compositions.
            </p>
          </div>

          {/* Add candidate input */}
          <form onSubmit={handleAddFormula} className="flex items-center gap-2">
            <input
              type="text"
              value={newFormulaInput}
              onChange={e => setNewFormulaInput(e.target.value)}
              placeholder="Add formula e.g. BaTiO3"
              className="bg-[#081220] border border-[#1d3550] rounded-xl px-3 py-2 text-xs text-white focus:border-[#56b6ff] outline-none min-w-[160px]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-[#142c47] hover:bg-[#1a385a] text-[#56b6ff] text-xs font-bold border border-[#23456b] flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              Add
            </button>
          </form>
        </div>

        {/* Quick candidate pill chips */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#162c44] flex-wrap">
          <span className="text-xs text-[#6e879f]">Selected:</span>
          {materials.map(m => (
            <div
              key={m.formula}
              className="flex items-center gap-2 bg-[#0e2136] px-3 py-1 rounded-full border border-[#1d3652] text-xs"
            >
              <span className="font-mono font-bold text-white">{m.formula}</span>
              <span className="text-[10px] text-[#718aa3]">({m.screeningScore}/100)</span>
              {materials.length > 2 && (
                <button
                  onClick={() => onRemoveFromCompare(m.formula)}
                  className="text-[#718aa3] hover:text-[#ff5c5c]"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          ))}

          {/* AI Evaluate Button */}
          <button
            onClick={handleRunAiEvaluation}
            disabled={isEvaluating || materials.length < 2}
            className="ml-auto px-4 py-2 rounded-xl bg-gradient-to-r from-[#48aef5] to-[#6c72ff] hover:opacity-90 text-white text-xs font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
          >
            {isEvaluating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                Evaluating Trade-offs...
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                Run AI Trade-Off Synthesis
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Comparative Insights Box (if evaluated) */}
      {aiComparison && (
        <div className="rounded-2xl bg-[#0a1829] border border-[#22456b] p-6 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#43d6a3] uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4" />
            Gemini 3.8 Flash Comparative Verdict
          </div>
          <h3 className="text-lg font-bold text-white mb-2">{aiComparison.verdict}</h3>
          <p className="text-xs text-[#9eb6cc] leading-relaxed mb-4">
            <b>Optimal Candidate:</b> <span className="text-[#56b6ff] font-bold">{aiComparison.bestForTarget}</span>
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {aiComparison.comparisonPoints.map((point, idx) => (
              <div key={idx} className="bg-[#081220] p-3 rounded-xl border border-[#162a40]">
                <div className="flex justify-between items-center text-xs font-semibold mb-1">
                  <span className="text-[#56b6ff]">{point.dimension}</span>
                  <span className="text-[10px] bg-[#10273f] text-[#91bde4] px-2 py-0.5 rounded border border-[#1b3d62]">
                    Leader: {point.winner}
                  </span>
                </div>
                <p className="text-xs text-[#829bb3] leading-relaxed">{point.analysis}</p>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-xs font-bold text-[#718da6] uppercase tracking-wider mb-1.5">
              Experimental Testing Recommendations:
            </h4>
            <ul className="text-xs text-[#a2bccf] list-disc pl-4 space-y-1">
              {aiComparison.experimentalRecommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Comparison Grid Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {materials.map((m, idx) => (
          <div
            key={m.formula}
            className="rounded-2xl bg-[#0c182a] border border-[#1a314b] p-5 flex flex-col justify-between relative hover:border-[#2b4c73] transition-colors"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[10px] text-[#56b6ff] font-mono uppercase">
                    Candidate {idx + 1}
                  </div>
                  <h3 className="text-xl font-black text-white font-mono">{m.formula}</h3>
                  <p className="text-xs text-[#718ca4] truncate max-w-[200px]">{m.name}</p>
                </div>

                <div className="text-right">
                  <span className="text-2xl font-black text-white">{m.screeningScore}</span>
                  <span className="text-[10px] text-[#718ca4] block">/100 Score</span>
                </div>
              </div>

              {/* Radar Preview */}
              <div className="py-2 flex justify-center bg-[#071321] rounded-xl border border-[#14263b] mb-4">
                <PropertyRadar material={m} />
              </div>

              {/* Key Properties List */}
              <div className="space-y-2 text-xs divide-y divide-[#13253b]">
                <div className="flex justify-between py-1.5">
                  <span className="text-[#718ca4]">Category</span>
                  <span className="text-white font-medium">{m.category}</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#718ca4]">Band Gap</span>
                  <span className="font-mono text-[#56b6ff] font-bold">{m.bandGap} eV ({m.bandType})</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#718ca4]">Density</span>
                  <span className="font-mono text-white">{m.density} g/cm³</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#718ca4]">Crystal Symmetry</span>
                  <span className="text-white">{m.crystalSystem} ({m.spaceGroup})</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#718ca4]">Formation Energy</span>
                  <span className="font-mono text-[#43d6a3]">{m.formationEnergy} eV/atom</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#718ca4]">Thermal Stability</span>
                  <span className="font-mono text-white">{m.thermalStability}%</span>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-[#718ca4]">Synthesizability</span>
                  <span className="font-mono text-white">{m.synthesizability}%</span>
                </div>
              </div>
            </div>

            {/* Bottom action */}
            <div className="mt-5 pt-4 border-t border-[#162a40]">
              <button
                onClick={() => onSelectForDossier(m.formula)}
                className="w-full py-2 rounded-xl bg-[#112439] hover:bg-[#183350] text-[#56b6ff] hover:text-white text-xs font-bold border border-[#1e3b5e] transition-colors"
              >
                Inspect Full 3D Dossier →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
