import React, { useState } from 'react';
import { Bookmark, Clock, Plus, Tag, Trash2, FileText, ArrowRight, CheckCircle2, Download } from 'lucide-react';
import { MaterialData, LabNote } from '../types';

interface HistoryNotesViewProps {
  historyList: MaterialData[];
  labNotes: LabNote[];
  onAddNote: (note: Omit<LabNote, 'id' | 'timestamp'>) => void;
  onDeleteNote: (id: string) => void;
  onSelectMaterial: (formula: string) => void;
}

export const HistoryNotesView: React.FC<HistoryNotesViewProps> = ({
  historyList,
  labNotes,
  onAddNote,
  onDeleteNote,
  onSelectMaterial,
}) => {
  const [selectedMaterialFormula, setSelectedMaterialFormula] = useState(
    historyList[0]?.formula || 'LiFePO4'
  );
  const [noteText, setNoteText] = useState('');
  const [notePriority, setNotePriority] = useState<'High' | 'Medium' | 'Low'>('High');
  const [noteStatus, setNoteStatus] = useState<'Screened' | 'In Testing' | 'Synthesized' | 'Archived'>('Screened');
  const [tagInput, setTagInput] = useState('');

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const tags = tagInput
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    onAddNote({
      materialFormula: selectedMaterialFormula,
      note: noteText.trim(),
      priority: notePriority,
      status: noteStatus,
      tags: tags.length > 0 ? tags : ['Screening'],
    });

    setNoteText('');
    setTagInput('');
  };

  const exportNotesMarkdown = () => {
    let md = '# MaterialMind Lab Notebook & Screening Archive\n\n';
    md += `Generated: ${new Date().toLocaleString()}\n\n`;

    md += '## Lab Notes & Hypotheses\n\n';
    labNotes.forEach(n => {
      md += `### [${n.materialFormula}] - Priority: ${n.priority} (${n.status})\n`;
      md += `Date: ${new Date(n.timestamp).toLocaleString()}\n`;
      md += `Tags: ${n.tags.join(', ')}\n\n`;
      md += `${n.note}\n\n---\n\n`;
    });

    md += '## Analyzed Materials Dossier History\n\n';
    historyList.forEach(m => {
      md += `### ${m.formula} - ${m.name}\n`;
      md += `- Category: ${m.category}\n`;
      md += `- Band Gap: ${m.bandGap} eV (${m.bandType})\n`;
      md += `- Density: ${m.density} g/cm³\n`;
      md += `- Crystal System: ${m.crystalSystem} (${m.spaceGroup})\n`;
      md += `- Stability: ${m.stability}%\n`;
      md += `- Screening Score: ${m.screeningScore}/100\n`;
      md += `- Insight: ${m.aiInsight}\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MaterialMind_Lab_Notebook_${Date.now()}.md`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#10233b] to-[#091524] border border-[#1b324d] p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-[#56b6ff] uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Bookmark className="w-4 h-4" />
            Lab Records & Screening Notebook
          </div>
          <h2 className="text-2xl font-black text-white">Researcher Notebook & Analysis Log</h2>
          <p className="text-xs text-[#8ca4bb] max-w-lg mt-1">
            Track computational predictions, record lab synthesis observations, and prioritize experimental validation queues.
          </p>
        </div>

        <button
          onClick={exportNotesMarkdown}
          className="px-4 py-2.5 rounded-xl bg-[#0e2136] hover:bg-[#142c47] text-[#56b6ff] hover:text-white text-xs font-bold border border-[#214368] flex items-center gap-2 self-start md:self-auto transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Export Lab Notebook (.MD)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Log a note */}
        <div className="rounded-2xl bg-[#0c182a] border border-[#1a314b] p-5 h-fit">
          <div className="flex items-center gap-2 text-xs font-bold text-[#8fa7be] uppercase tracking-wider mb-4">
            <FileText className="w-4 h-4 text-[#56b6ff]" />
            Record Lab Note / Hypothesis
          </div>

          <form onSubmit={handleCreateNote} className="space-y-3.5">
            <div>
              <label className="text-xs text-[#718ca4] block mb-1.5">Target Material</label>
              <select
                value={selectedMaterialFormula}
                onChange={e => setSelectedMaterialFormula(e.target.value)}
                className="w-full bg-[#081220] border border-[#1c3552] rounded-xl px-3 py-2 text-xs text-white focus:border-[#56b6ff] outline-none font-mono"
              >
                {historyList.map(m => (
                  <option key={m.formula} value={m.formula}>
                    {m.formula} ({m.name})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-xs text-[#718ca4] block mb-1.5">Priority</label>
                <select
                  value={notePriority}
                  onChange={e => setNotePriority(e.target.value as any)}
                  className="w-full bg-[#081220] border border-[#1c3552] rounded-xl px-3 py-2 text-xs text-white focus:border-[#56b6ff] outline-none"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-[#718ca4] block mb-1.5">Status</label>
                <select
                  value={noteStatus}
                  onChange={e => setNoteStatus(e.target.value as any)}
                  className="w-full bg-[#081220] border border-[#1c3552] rounded-xl px-3 py-2 text-xs text-white focus:border-[#56b6ff] outline-none"
                >
                  <option value="Screened">Screened</option>
                  <option value="In Testing">In Testing</option>
                  <option value="Synthesized">Synthesized</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs text-[#718ca4] block mb-1.5">Tags (comma-separated)</label>
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                placeholder="e.g. Battery, XRD, Order Precursors"
                className="w-full bg-[#081220] border border-[#1c3552] rounded-xl px-3 py-2 text-xs text-white focus:border-[#56b6ff] outline-none"
              />
            </div>

            <div>
              <label className="text-xs text-[#718ca4] block mb-1.5">Experimental Observation / Notes</label>
              <textarea
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                placeholder="e.g. Recommended for high-temperature hydrothermal trial. Check phase purity with XRD Pnma pattern..."
                rows={4}
                className="w-full bg-[#081220] border border-[#1c3552] rounded-xl p-3 text-xs text-white focus:border-[#56b6ff] outline-none resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#48aef5] to-[#6c72ff] hover:opacity-90 text-white text-xs font-bold shadow-lg flex items-center justify-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Save Note to Lab Queue
            </button>
          </form>
        </div>

        {/* Right 2 Columns: Notebook entries and History timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Notebook Entries */}
          <div className="rounded-2xl bg-[#0c182a] border border-[#1a314b] p-5">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-[#56b6ff]" />
              Lab Queue & Hypotheses ({labNotes.length})
            </h3>

            {labNotes.length === 0 ? (
              <div className="text-center py-8 text-xs text-[#6e879f] border border-dashed border-[#182c42] rounded-xl">
                No lab notes recorded yet. Add observations or priority flags above.
              </div>
            ) : (
              <div className="space-y-3">
                {labNotes.map(n => (
                  <div
                    key={n.id}
                    className="bg-[#081220] p-4 rounded-xl border border-[#162a40] flex flex-col justify-between hover:border-[#26476e] transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-bold text-white text-sm">
                          {n.materialFormula}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            n.priority === 'High'
                              ? 'bg-[#3b191e] text-[#ff6b6b] border border-[#6b2c34]'
                              : n.priority === 'Medium'
                              ? 'bg-[#3d3319] text-[#ffd166] border border-[#6b582b]'
                              : 'bg-[#12283a] text-[#56b6ff] border border-[#1f476a]'
                          }`}
                        >
                          {n.priority} Priority
                        </span>
                        <span className="text-[10px] bg-[#102438] text-[#8ea7be] px-2 py-0.5 rounded-md border border-[#1b344d]">
                          {n.status}
                        </span>
                      </div>

                      <button
                        onClick={() => onDeleteNote(n.id)}
                        className="text-[#647c94] hover:text-[#ff5c5c] p-1"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs text-[#b0c7db] leading-relaxed mb-3">{n.note}</p>

                    <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#122438]">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {n.tags.map(t => (
                          <span
                            key={t}
                            className="text-[10px] text-[#6d8ca8] bg-[#0c1b2c] px-2 py-0.5 rounded-full"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-[#5c738a] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>

                        <button
                          onClick={() => onSelectMaterial(n.materialFormula)}
                          className="text-[#56b6ff] hover:text-white font-bold flex items-center gap-0.5"
                        >
                          Analyze
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Analysis History Log */}
          <div className="rounded-2xl bg-[#0c182a] border border-[#1a314b] p-5">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#43d6a3]" />
              Analysis History Log ({historyList.length})
            </h3>

            <div className="space-y-2">
              {historyList.map(item => (
                <div
                  key={item.formula}
                  className="bg-[#081220] px-4 py-3 rounded-xl border border-[#162a40] flex items-center justify-between hover:bg-[#0c1c2e] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-white text-sm">{item.formula}</span>
                    <span className="text-xs text-[#718ca4] hidden sm:inline truncate max-w-[200px]">
                      {item.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#102338] text-[#8ea7be] border border-[#1a344e]">
                      {item.crystalSystem}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#56b6ff] font-bold">
                      {item.screeningScore}/100
                    </span>
                    <button
                      onClick={() => onSelectMaterial(item.formula)}
                      className="px-2.5 py-1 rounded-lg text-xs font-bold text-white bg-[#142d47] hover:bg-[#1a3a5e] border border-[#21476f] flex items-center gap-1"
                    >
                      Inspect
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
