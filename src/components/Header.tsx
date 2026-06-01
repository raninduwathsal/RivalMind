import { Search, Bell, User, Plus } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function Header() {
  const [url, setUrl] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const navigate = useNavigate();

  const handleTrack = async () => {
    if (!url.trim()) return;
    setIsTracking(true);
    try {
      // Clean domain
      const domain = url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "").split('/')[0];

      setUrl('');
      navigate(`/discovery?url=${encodeURIComponent(url)}&domain=${encodeURIComponent(domain)}`);
    } catch (error) {
      console.error("Failed to route to discovery:", error);
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <header className="h-16 bg-[#121212] border-b border-[#2a2a2a] flex items-center justify-between px-6 shrink-0">
      <div className="flex-1 flex items-center gap-4">
        {/* Search */}
        <div className="relative w-80">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-[#a1a1aa]" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-[#2a2a2a] rounded-md leading-5 bg-[#0a0a0a] text-white placeholder-[#a1a1aa] focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            placeholder="Search signals, features..."
          />
        </div>

        {/* Add Competitor */}
        <div className="flex items-center gap-2 border border-[#2a2a2a] bg-[#0a0a0a] rounded-md overflow-hidden focus-within:ring-1 focus-within:ring-purple-500 focus-within:border-purple-500 transition-colors">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTrack()}
            placeholder="Add competitor URL (e.g., acme.com)"
            disabled={isTracking}
            className="bg-transparent border-none outline-none text-white text-sm pl-3 py-2 w-64 placeholder-[#a1a1aa] disabled:opacity-50"
          />
          <button 
            onClick={handleTrack}
            disabled={isTracking || !url.trim()}
            className="bg-[#2a2a2a] hover:bg-[#333] disabled:bg-[#1a1a1a] text-white px-3 py-2 flex items-center gap-1 text-sm font-medium transition-colors border-l border-[#2a2a2a]"
          >
            {isTracking ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Plus size={14} />}
            {isTracking ? 'Tracking...' : 'Track'}
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <button className="text-[#a1a1aa] hover:text-white transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-[#121212]"></span>
        </button>
        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium cursor-pointer ring-2 ring-[#2a2a2a]">
          <User size={16} />
        </div>
      </div>
    </header>
  );
}
