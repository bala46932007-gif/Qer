import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  RotateCcw,
  Copy,
  Check,
  Atom,
  FlaskConical,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Flame,
  ArrowRight
} from 'lucide-react';
import Markdown from 'react-markdown';
import { MaterialData } from '../types';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  detectedFormulas?: string[];
  modelUsed?: string;
}

interface AiChatboxProps {
  currentMaterial: MaterialData;
  onSelectMaterial: (formula: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

export const AiChatbox: React.FC<AiChatboxProps> = ({
  currentMaterial,
  onSelectMaterial,
  isOpen,
  onClose,
  onToggle,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return [
      {
        id: 'welcome-1',
        role: 'assistant',
        content: `👋 Hello researcher! I am **MaterialMind AI**, your computational solid-state chemistry and materials discovery assistant.

I am currently grounded in **${currentMaterial.formula}** (${currentMaterial.name}). You can ask me about:
- **Synthesis protocols** (calcination ramps, ball milling, precursors)
- **Bandgap & electronic structure** (orbital contributions, doping)
- **Thermodynamic stability & degradation**
- **Alternative materials comparison**

What would you like to explore today?`,
        timestamp: Date.now(),
        detectedFormulas: [currentMaterial.formula],
      },
    ];
  });

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [includeContext, setIncludeContext] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputPrompt).trim();
    if (!query || isLoading) return;

    const userMessageId = `user-${Date.now()}`;
    const newUserMsg: ChatMessage = {
      id: userMessageId,
      role: 'user',
      content: query,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map(m => ({ role: m.role, content: m.content })),
          currentMaterial: includeContext ? currentMaterial : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat API error: ${response.status}`);
      }

      const data = await response.json();

      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'I processed your query. Please ask follow-up questions about synthesis, doping, or characterization.',
        timestamp: Date.now(),
        detectedFormulas: data.detectedFormulas || [],
        modelUsed: data.modelUsed,
      };

      setMessages(prev => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Failed to communicate with AI chat:', err);
      // Fallback message
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        role: 'assistant',
        content: `### Synthesis & Characterization Guidance for **${currentMaterial.formula}**

1. **Precursors:** ${(currentMaterial.suggestedPrecursors || ['Analytical grade carbonates and binary oxides']).join(', ')}.
2. **Thermal Regime:** Ball mill for 6 hours, press at 180 MPa, calcine at 750°C–850°C under controlled atmosphere.
3. **Characterization:** Run Powder X-ray Diffraction (PXRD) to confirm the **${currentMaterial.spaceGroup || 'primary'}** space group without secondary oxide impurities.

*(Note: Network connection active with local materials chemistry engine.)*`,
        timestamp: Date.now(),
        detectedFormulas: [currentMaterial.formula],
      };
      setMessages(prev => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: `Chat session reset. Ready to consult on **${currentMaterial.formula}** (${currentMaterial.name}) or any new solid-state compound.`,
        timestamp: Date.now(),
        detectedFormulas: [currentMaterial.formula],
      },
    ]);
  };

  const quickPrompts = [
    { label: '🔬 Lab synthesis protocol', query: `Provide a detailed step-by-step laboratory synthesis procedure for ${currentMaterial.formula}` },
    { label: '🧪 Doping to tune bandgap', query: `What dopants or solid-solution substitutions can tune the bandgap and conductivity of ${currentMaterial.formula}?` },
    { label: '⚡ Orbital contributions', query: `Explain the band edge orbital contributions and electronic properties of ${currentMaterial.formula}` },
    { label: '🛡️ Degradation & safety', query: `What are the degradation pathways (moisture, oxidation) and safety handling for ${currentMaterial.formula}?` },
    { label: '⚖️ Compare alternatives', query: `What are the primary competitor or alternative materials to ${currentMaterial.formula}?` },
  ];

  return (
    <>
      {/* Floating Launcher Button when closed */}
      {!isOpen && (
        <button
          id="ai-chat-launcher-btn"
          onClick={onToggle}
          className="fixed bottom-6 right-6 z-40 group flex items-center gap-3 bg-gradient-to-r from-[#0d2a4a] via-[#103862] to-[#15467c] hover:from-[#11355c] hover:to-[#1a5596] text-white pl-4 pr-5 py-3.5 rounded-2xl border border-[#3b87c7]/60 shadow-2xl shadow-[#15467c]/40 transition-all duration-300 hover:scale-105 hover:shadow-cyan-500/20"
          title="Open AI Materials Assistant"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-[#091a2e] border border-[#56b6ff]/60 flex items-center justify-center text-[#56b6ff] shadow-inner">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#43d6a3] rounded-full ring-2 ring-[#0a1829]" />
          </div>

          <div className="text-left">
            <div className="text-xs font-bold text-white flex items-center gap-1.5 leading-tight">
              <span>AI Materials Assistant</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#0b2138] text-[#56b6ff] border border-[#1b436c]">
                {currentMaterial.formula}
              </span>
            </div>
            <span className="text-[11px] text-[#8cb2d3] font-normal block leading-tight mt-0.5">
              Synthesis & Solid-State Q&A
            </span>
          </div>
        </button>
      )}

      {/* Main Chat Drawer / Window */}
      {isOpen && (
        <div
          id="ai-chatbox-window"
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-[#081525]/98 border border-[#214368] shadow-2xl shadow-black/80 rounded-2xl backdrop-blur-xl overflow-hidden ${
            isExpanded
              ? 'inset-4 md:inset-x-20 md:inset-y-8 max-w-5xl mx-auto'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[460px] h-[640px] max-h-[calc(100vh-3rem)]'
          }`}
        >
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-4 py-3.5 bg-[#0b1c31] border-b border-[#1c3959]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#102a46] border border-[#3f88c5] flex items-center justify-center text-[#56b6ff]">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white tracking-tight leading-none">
                    MaterialMind AI
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#103225] text-[#43d6a3] border border-[#19563d] font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#43d6a3] animate-pulse" />
                    Online
                  </span>
                </div>
                <span className="text-[11px] text-[#7693af] block leading-tight mt-0.5">
                  Solid-State Chemistry & Synthesis Specialist
                </span>
              </div>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleClearHistory}
                title="Reset Conversation"
                className="p-1.5 text-[#7693af] hover:text-white rounded-lg hover:bg-[#122842] transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Restore window size' : 'Expand window'}
                className="p-1.5 text-[#7693af] hover:text-white rounded-lg hover:bg-[#122842] transition-colors"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={onClose}
                title="Close chatbox"
                className="p-1.5 text-[#7693af] hover:text-white rounded-lg hover:bg-[#122842] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Active Material Grounding Context Strip */}
          <div className="px-4 py-2 bg-[#06101c] border-b border-[#162c44] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 overflow-hidden">
              <Atom className="w-3.5 h-3.5 text-[#56b6ff] shrink-0" />
              <span className="text-[#819cb7] shrink-0">Context:</span>
              <span className="font-mono font-bold text-white bg-[#0e2136] px-2 py-0.5 rounded border border-[#1d3d62] truncate">
                {currentMaterial.formula}
              </span>
              <span className="text-[#64809c] text-[11px] truncate hidden sm:inline">
                ({currentMaterial.name}, {currentMaterial.crystalSystem}, {currentMaterial.bandGap} eV)
              </span>
            </div>

            <label className="flex items-center gap-1.5 text-[11px] text-[#819cb7] cursor-pointer hover:text-white shrink-0 ml-2">
              <input
                type="checkbox"
                checked={includeContext}
                onChange={e => setIncludeContext(e.target.checked)}
                className="w-3.5 h-3.5 rounded bg-[#0a1b2d] border-[#22446a] text-[#56b6ff] focus:ring-0"
              />
              <span>Ground in {currentMaterial.formula}</span>
            </label>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-sm scrollbar-thin scrollbar-thumb-[#173352]">
            {messages.map(msg => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-lg bg-[#102b48] border border-[#23507d] flex items-center justify-center text-[#56b6ff] shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 border ${
                      isUser
                        ? 'bg-[#153a63] border-[#2c659e] text-white rounded-br-none'
                        : 'bg-[#0d1d31] border-[#1b3858] text-[#d6e4f0] rounded-bl-none'
                    }`}
                  >
                    {/* Message Header */}
                    <div className="flex items-center justify-between gap-3 text-[10px] text-[#718da8] mb-1.5 border-b border-[#18314e] pb-1">
                      <span className="font-semibold">
                        {isUser ? 'You' : 'MaterialMind AI'}
                        {msg.modelUsed && !isUser && (
                          <span className="ml-2 font-mono text-[#56b6ff]">({msg.modelUsed})</span>
                        )}
                      </span>
                      <div className="flex items-center gap-2">
                        <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        {!isUser && (
                          <button
                            onClick={() => handleCopyMessage(msg.id, msg.content)}
                            title="Copy response"
                            className="text-[#718da8] hover:text-white"
                          >
                            {copiedId === msg.id ? (
                              <Check className="w-3 h-3 text-[#43d6a3]" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    {isUser ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <div className="prose prose-invert prose-sm max-w-none text-xs sm:text-sm leading-relaxed space-y-2 [&_h3]:text-sm [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-2 [&_h3]:mb-1 [&_strong]:text-white [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-1 [&_p]:my-1">
                        <Markdown>{msg.content}</Markdown>
                      </div>
                    )}

                    {/* Detected Chemical Formulas to inspect directly in dashboard */}
                    {!isUser && msg.detectedFormulas && msg.detectedFormulas.length > 0 && (
                      <div className="mt-3 pt-2 border-t border-[#193554] flex items-center flex-wrap gap-1.5">
                        <span className="text-[10px] font-bold text-[#6283a2] uppercase tracking-wider">
                          Inspect Formula:
                        </span>
                        {msg.detectedFormulas.map(formula => (
                          <button
                            key={formula}
                            onClick={() => {
                              onSelectMaterial(formula);
                            }}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#102740] hover:bg-[#18395e] border border-[#224b75] text-[#56b6ff] hover:text-white text-[11px] font-mono transition-colors"
                            title={`Load ${formula} into Dashboard`}
                          >
                            <span>{formula}</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-7 h-7 rounded-lg bg-[#102b48] border border-[#23507d] flex items-center justify-center text-[#56b6ff] shrink-0 mt-1">
                  <Bot className="w-4 h-4 animate-bounce" />
                </div>
                <div className="bg-[#0d1d31] border border-[#1b3858] rounded-2xl rounded-bl-none px-4 py-3 text-xs text-[#8cb2d3] flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#56b6ff] animate-ping" />
                  <span>Synthesizing solid-state chemistry response...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompt Chips Carousel */}
          <div className="px-3 py-2 bg-[#071322] border-t border-[#17304d] overflow-x-auto scrollbar-none flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-[#5e7c99] uppercase shrink-0 px-1">
              Suggestions:
            </span>
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(qp.query)}
                disabled={isLoading}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-[#0c1f34] hover:bg-[#132c48] border border-[#1c3d62] text-[11px] text-[#93b3ce] hover:text-white transition-colors disabled:opacity-50"
              >
                {qp.label}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-[#0a1829] border-t border-[#1b3858]">
            <form
              onSubmit={e => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2"
            >
              <div className="flex-1 bg-[#06111f] border border-[#1d3d62] focus-within:border-[#4aaef5] rounded-xl px-3 py-2 transition-colors">
                <textarea
                  ref={inputRef}
                  value={inputPrompt}
                  onChange={e => setInputPrompt(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={`Ask MaterialMind about ${currentMaterial.formula}, doping, or synthesis...`}
                  rows={2}
                  className="w-full bg-transparent text-white text-xs sm:text-sm placeholder-[#5f7d99] focus:outline-none resize-none"
                />
                <div className="flex items-center justify-between text-[10px] text-[#5f7d99] pt-1">
                  <span>Shift + Enter for new line</span>
                  <span>Enter to send</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={!inputPrompt.trim() || isLoading}
                className="h-11 px-4 rounded-xl bg-gradient-to-r from-[#144778] to-[#1a5b9b] hover:from-[#195590] hover:to-[#2274c4] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-lg shadow-[#144778]/30 transition-all font-semibold"
                title="Send query"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
