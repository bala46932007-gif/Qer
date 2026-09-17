import React from 'react';
import { LayoutDashboard, Compass, GitCompare, Bookmark, X, Sparkles, Database } from 'lucide-react';
import { ActiveTab } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  savedCount: number;
  historyCount: number;
  onOpenChat?: () => void;
  isChatOpen?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isOpenMobile,
  onCloseMobile,
  savedCount,
  historyCount,
  onOpenChat,
  isChatOpen,
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'discover', label: 'Discover & Screen', icon: <Compass className="w-4 h-4" /> },
    { id: 'compare', label: 'Compare Matrix', icon: <GitCompare className="w-4 h-4" /> },
    { id: 'history', label: 'Lab History & Notes', icon: <Bookmark className="w-4 h-4" />, badge: historyCount },
  ];

  const handleSelect = (tab: ActiveTab) => {
    onTabChange(tab);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#06111f]/95 lg:bg-[#06111f]/85 border-r border-[#172d45] p-5 flex flex-col justify-between transition-transform duration-300 backdrop-blur-md ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Logo & Mobile Close */}
          <div className="flex items-center justify-between mb-8 px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#102b47] to-[#143e69] border border-[#4aaef5]/60 flex items-center justify-center text-[#56b6ff] shadow-lg shadow-[#4aaef5]/10">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="text-xl font-black text-white tracking-tight">
                Material<span className="text-[#56b6ff]">Mind</span>
              </div>
            </div>

            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 text-[#8aa3bb] hover:text-white rounded-lg hover:bg-[#102236]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1.5">
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => handleSelect(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#12263d] to-[#152e4a] text-white border border-[#274b73] shadow-md'
                      : 'text-[#91a7bd] hover:bg-[#0c1c2e] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-[#56b6ff]' : 'text-[#728aa2]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-[#122b44] text-[#56b6ff] border border-[#214368] font-mono">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* AI Chatbox Trigger Card in Sidebar */}
          {onOpenChat && (
            <div className="mt-6 p-3.5 rounded-xl bg-gradient-to-br from-[#0c2036] to-[#0f2a48] border border-[#1d436c] shadow-lg">
              <div className="flex items-center gap-2 text-white text-xs font-bold mb-1">
                <Sparkles className="w-4 h-4 text-[#56b6ff]" />
                <span>AI Lab Assistant</span>
              </div>
              <p className="text-[11px] text-[#7ea0bf] leading-relaxed mb-3">
                Ask about lab synthesis steps, dopants, band structure, or safety protocols.
              </p>
              <button
                id="sidebar-open-chat-btn"
                onClick={() => {
                  onOpenChat();
                  onCloseMobile();
                }}
                className={`w-full py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  isChatOpen
                    ? 'bg-[#184878] text-white border border-[#3e85c2]'
                    : 'bg-[#103254] hover:bg-[#164372] text-[#69bcff] hover:text-white border border-[#214f7d]'
                }`}
              >
                <span>{isChatOpen ? 'Chat Active' : 'Open AI Chat'}</span>
                <Sparkles className="w-3 h-3 text-[#56b6ff]" />
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Bottom Disclaimer */}
        <div className="pt-4 border-t border-[#13273e] text-[11px] text-[#637d96] space-y-2">
          <div className="flex items-center gap-2 text-[#8aa3bd]">
            <Database className="w-3.5 h-3.5 text-[#43d6a3]" />
            <span>AI Materials Platform v2.0</span>
          </div>
          <p className="leading-relaxed">
            Theoretical property screening system. All predictions should undergo experimental synthesis and phase validation.
          </p>
        </div>
      </aside>
    </>
  );
};
