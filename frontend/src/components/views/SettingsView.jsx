import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../context/TaskContext';
import { 
  Settings, 
  Moon, 
  Bell, 
  User, 
  Shield, 
  Database, 
  ChevronRight,
  Zap,
  HelpCircle
} from 'lucide-react';

export const SettingsView = () => {
  const { user } = useAuth();
  const { setIsAuthModalOpen } = useTasks();

  const settingSections = [
    {
      title: 'Preferences',
      items: [
        { icon: Moon, label: 'Appearance & Theme', value: 'Obsidian & Gold (Default)', action: () => {} },
        { icon: Bell, label: 'Real-time Notifications', value: 'Enabled', action: () => {} },
        { icon: Zap, label: 'WebSocket Live Presence', value: 'Active', action: () => {} },
      ]
    },
    {
      title: 'Account & Security',
      items: [
        { icon: User, label: 'Workspace Persona', value: `${user?.name} (${user?.role})`, action: () => setIsAuthModalOpen(true) },
        { icon: Shield, label: 'Authentication Mode', value: 'JWT & Demo Personas', action: () => setIsAuthModalOpen(true) },
        { icon: Database, label: 'Storage Engine', value: 'PostgreSQL + Local High-Performance Store', action: () => {} },
      ]
    },
    {
      title: 'About',
      items: [
        { icon: HelpCircle, label: 'TaskEngine PRO Version', value: 'v2.4.0 (Enterprise)', action: () => {} },
      ]
    }
  ];

  return (
    <div className="space-y-4 animate-fade-in w-full">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-[#090b10] border border-white/[0.06] flex items-center justify-between">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
            <Settings className="w-4 h-4 text-[#caa457]" />
            Workspace Settings
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Manage preferences, notifications, and security</p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        {settingSections.map((section, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-[#090b10] border border-white/[0.06] space-y-2">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 px-1">
              {section.title}
            </h4>
            <div className="divide-y divide-white/[0.04]">
              {section.items.map((item, i) => {
                const Icon = item.icon;
                return (
                  <button
                    key={i}
                    onClick={item.action}
                    className="w-full min-h-[52px] py-3 px-2 flex items-center justify-between hover:bg-white/[0.02] active:bg-white/[0.04] transition-colors rounded-xl text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#0d0f15] border border-white/[0.08] flex items-center justify-center text-[#caa457]">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-200 group-hover:text-[#edd295] transition-colors">
                          {item.label}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {item.value}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#edd295] transition-colors" />
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
