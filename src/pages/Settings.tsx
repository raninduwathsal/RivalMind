import { Save, RefreshCw, Clock } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Engine Settings</h1>
        <p className="text-sm text-[#a1a1aa] mt-1">Configure scraping intervals and stealth parameters</p>
      </div>

      <div className="bg-[#121212] border border-[#2a2a2a] rounded-lg overflow-hidden">
        <div className="p-5 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="text-blue-500" size={20} />
            <h2 className="text-lg font-semibold text-white">Refresh Intervals</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Pricing & Website Monitor</p>
                <p className="text-xs text-[#a1a1aa]">How often to diff HTML structures</p>
              </div>
              <select className="bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm rounded-md px-3 py-1.5 outline-none">
                <option>Every 12 hours</option>
                <option>Daily</option>
                <option>Weekly</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Hiring & Job Boards</p>
                <p className="text-xs text-[#a1a1aa]">How often to check for new roles</p>
              </div>
              <select className="bg-[#0a0a0a] border border-[#2a2a2a] text-white text-sm rounded-md px-3 py-1.5 outline-none">
                <option>Daily</option>
                <option>Every 3 days</option>
                <option>Weekly</option>
              </select>
            </div>
          </div>
        </div>
        
        <div className="p-5 bg-[#0a0a0a] flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Manual Override</p>
            <p className="text-xs text-[#a1a1aa]">Force an immediate scrape across all targets</p>
          </div>
          <button className="flex items-center gap-2 bg-[#2a2a2a] hover:bg-[#333] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
            <RefreshCw size={14} />
            Force Refresh Now
          </button>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors">
          <Save size={16} />
          Save Settings
        </button>
      </div>
    </div>
  );
}
