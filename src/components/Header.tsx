import React from 'react';
import { Cpu, Sparkles, Download, BookOpen, Layers, Menu } from 'lucide-react';
import { MaterialData } from '../types';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  savedCount: number;
  currentMaterial: MaterialData;
  onExportReport: () => void;
  aiStatus: { online: boolean; aiEnabled: boolean };
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileMenu,
  savedCount,
  currentMaterial,
  onExportReport,
  aiStatus,
}) => {
  return (
    <header className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-[#172d45]">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl bg-[#0e1d30] border border-[#1e344e] text-[#91a7bd] hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="text-[#56b6ff] text-xs font-bold tracking-[0.15em] uppercase flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            AI Material Discovery & Screening
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
            Good morning, Researcher
          </h1>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* AI Status Badge */}
        <div className="hidden sm:flex items-center gap-2 border border-[#1f3b57] bg-[#0c1b2c] px-3 py-1.5 rounded-full text-xs font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#43d6a3] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#43d6a3]"></span>
          </span>
          <span className="text-[#9ed5ff]">
            {aiStatus.aiEnabled ? 'Gemini 3.8 Flash Online' : 'AI Engine Ready'}
          </span>
        </div>

        {/* Export Analysis Button */}
        <button
          id="export-report-btn"
          onClick={onExportReport}
          className="flex items-center gap-1.5 bg-[#0e1f33] hover:bg-[#152e4d] text-[#a9bfd3] hover:text-white px-3 py-1.5 rounded-xl border border-[#1c3552] text-xs font-semibold transition-colors"
          title="Export JSON Dossier"
        >
          <Download className="w-3.5 h-3.5 text-[#56b6ff]" />
          <span className="hidden md:inline">Export Dossier</span>
        </button>
      </div>
    </header>
  );
};
