import { Link, useLocation } from 'react-router-dom';
import { Activity, LayoutDashboard, Target, MessageSquareCode, Settings } from 'lucide-react';

export default function Sidebar() {
  const location = useLocation();

  const links = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Discovery Engine', path: '/discovery', icon: Activity },
    { name: 'Sales Battlecards', path: '/battlecards', icon: Target },
    { name: 'Strategy RAG', path: '/strategy', icon: MessageSquareCode },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="w-64 bg-[#121212] border-r border-[#2a2a2a] flex flex-col h-full">
      <div className="h-16 flex items-center px-6 border-b border-[#2a2a2a]">
        <span className="text-xl font-bold tracking-tight text-white">RivalMind</span>
      </div>
      <nav className="flex-1 py-6 px-3 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname.startsWith(link.path);
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-[#2a2a2a] text-white'
                  : 'text-[#a1a1aa] hover:bg-[#1a1a1a] hover:text-white'
              }`}
            >
              <Icon size={18} />
              {link.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-[#2a2a2a]">
        <div className="text-xs text-[#a1a1aa] uppercase tracking-wider font-semibold mb-2">System Status</div>
        <div className="flex items-center gap-2 text-sm text-green-500">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          All Systems Go
        </div>
      </div>
    </div>
  );
}
