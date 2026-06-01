import { useState, useEffect } from 'react';
import { Check, X, ShieldAlert, Zap, Building2, Users, Banknote, ShieldCheck, TrendingUp, Target, Puzzle, MessageCircle, Info, ExternalLink, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function SalesBattlecards() {
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);
  const [competitors, setCompetitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCompetitors() {
      try {
        const { data, error } = await supabase.from('competitors').select('*');
        if (error) throw error;
        
        if (data) {
          const formatted = data.map(dbRow => ({
            name: dbRow.name,
            isUs: dbRow.is_us,
            data: dbRow.metrics || {}
          }));
          
          formatted.sort((a, b) => (a.isUs === b.isUs) ? 0 : a.isUs ? -1 : 1);
          setCompetitors(formatted);
        }
      } catch (err) {
        console.error('Failed to fetch competitors:', err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchCompetitors();

    const channel = supabase
      .channel('battlecards-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'competitors' }, () => {
        fetchCompetitors();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Dynamically extract all top-level categories and sub-keys
  const categories = new Set<string>();
  competitors.forEach(c => {
    Object.keys(c.data).forEach(k => categories.add(k));
  });

  const categoryList = Array.from(categories).sort();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-[#a1a1aa]">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p>Syncing competitive matrix from Supabase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 relative">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Competitive Matrix (Dynamic)</h1>
        <p className="text-sm text-[#a1a1aa]">Real-time side-by-side comparison. Metrics are dynamically synthesized by the AI Investigator based on crawled footprints.</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#2a2a2a] bg-[#121212]">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-[#0a0a0a] border-b border-[#2a2a2a] uppercase text-xs font-semibold text-[#a1a1aa] tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-4 w-64 border-r border-[#2a2a2a]">Criteria</th>
              {competitors.map((c, i) => (
                <th key={i} scope="col" className={`px-6 py-4 ${c.isUs ? 'bg-blue-900/20 text-blue-400' : ''}`}>
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {categoryList.map((cat, i) => {
              // Check if category is an object (nested keys) or scalar
              let isScalar = false;
              const subKeys = new Set<string>();
              
              competitors.forEach(c => {
                const val = c.data[cat];
                if (val !== undefined && val !== null) {
                  if (typeof val === 'object') {
                    Object.keys(val).forEach(k => subKeys.add(k));
                  } else {
                    isScalar = true;
                  }
                }
              });

              if (isScalar) {
                return <MatrixRow key={cat} title={cat} category="direct" keyName={cat} competitors={competitors} onEvidenceClick={setSelectedEvidence} />;
              }

              const subKeyList = Array.from(subKeys);

              return (
                <React.Fragment key={cat}>
                  <tr className="bg-[#1a1a1a]">
                    <td colSpan={competitors.length + 1} className="px-6 py-3 font-semibold text-white border-r border-[#2a2a2a]">
                      <div className="flex items-center gap-2 capitalize">
                        <Activity size={16} className="text-purple-500" /> {cat.replace(/([A-Z])/g, ' $1').trim()}
                      </div>
                    </td>
                  </tr>
                  {subKeyList.map((subKey) => (
                    <MatrixRow key={`${cat}-${subKey}`} title={subKey.replace(/([A-Z])/g, ' $1').trim()} category={cat} keyName={subKey} competitors={competitors} onEvidenceClick={setSelectedEvidence} />
                  ))}
                </React.Fragment>
              );
            })}
            
            {categoryList.length === 0 && (
              <tr>
                <td colSpan={competitors.length + 1} className="px-6 py-8 text-center text-[#a1a1aa]">
                  No intelligence data found. Track a competitor to begin agent discovery.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3 text-green-500">
            <Zap size={18} />
            <h3 className="font-semibold text-white">Strategic Advantage (The "Why Us")</h3>
          </div>
          <ul className="text-sm text-[#a1a1aa] space-y-2">
            <li className="flex gap-2"><span className="text-green-500">•</span> <strong>Agility vs Enterprise Bloat:</strong> We ship features faster than competitors can schedule a roadmap meeting.</li>
            <li className="flex gap-2"><span className="text-green-500">•</span> <strong>Price-to-Value:</strong> We offer core intelligence capabilities at 1/10th the cost of legacy incumbents.</li>
            <li className="flex gap-2"><span className="text-green-500">•</span> <strong>Autonomous Agents:</strong> Our competitors require manual tracking; we deploy AI agents that continuously crawl and synthesize the web.</li>
          </ul>
        </div>

        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3 text-red-500">
            <ShieldAlert size={18} />
            <h3 className="font-semibold text-white">Vulnerabilities (Kill-Points to Deflect)</h3>
          </div>
          <ul className="text-sm text-[#a1a1aa] space-y-2">
            <li className="flex gap-2"><span className="text-red-500">•</span> <strong>Compliance:</strong> Enterprise buyers will demand SOC2. Pivot to our rapid GDPR readiness and upcoming SOC2 roadmap.</li>
            <li className="flex gap-2"><span className="text-red-500">•</span> <strong>Market Longevity:</strong> We lack a 5-year track record. Focus on our modern tech stack and avoidance of technical debt.</li>
          </ul>
        </div>
      </div>

      {/* Evidence Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-lg w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between bg-[#0a0a0a]">
              <div className="flex items-center gap-2">
                <Info size={18} className="text-blue-500" />
                <h3 className="font-semibold text-white">AI Agent Intelligence: {selectedEvidence.title}</h3>
              </div>
              <button onClick={() => setSelectedEvidence(null)} className="text-[#a1a1aa] hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-[#a1a1aa] font-semibold uppercase tracking-wider mb-1">Target</p>
                <p className="text-white text-sm">{selectedEvidence.company}</p>
              </div>
              <div>
                <p className="text-xs text-[#a1a1aa] font-semibold uppercase tracking-wider mb-1">Synthesized Insight</p>
                <p className="text-white text-sm font-medium bg-blue-500/10 text-blue-400 p-2 rounded border border-blue-500/20 inline-block">{selectedEvidence.value}</p>
              </div>
              <div className="bg-[#0a0a0a] rounded border border-[#2a2a2a] p-3 font-mono text-xs text-gray-300 leading-relaxed">
                <p className="text-blue-400 mb-2 border-b border-[#2a2a2a] pb-2 flex items-center gap-1">
                  <ExternalLink size={12}/> 
                  Agent Note:
                </p>
                Data dynamically extracted by DeepSeek v3 via autonomous web crawl.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';

function MatrixRow({ title, keyName, category, competitors, onEvidenceClick }: any) {
  
  const generateMockEvidence = (company: string, keyName: string, value: string) => {
    return { title, company, value };
  };

  return (
    <tr className="hover:bg-[#1a1a1a]/50 transition-colors">
      <td className="px-6 py-4 font-medium text-gray-300 border-r border-[#2a2a2a] capitalize">{title}</td>
      {competitors.map((c: any, i: number) => {
        const val = category === 'direct' ? c.data[keyName] : (c.data[category] ? c.data[category][keyName] : undefined);
        
        return (
          <td key={i} className={`px-6 py-4 ${c.isUs ? 'bg-blue-900/10' : ''}`}>
            {val !== undefined && typeof val !== 'boolean' ? (
              <button 
                onClick={() => onEvidenceClick(generateMockEvidence(c.name, keyName, String(val)))}
                className={`flex items-center gap-1.5 text-left transition-colors hover:text-white hover:underline decoration-blue-500/50 underline-offset-4
                  ${String(val).includes('-') || String(val).toLowerCase().includes('poor') || String(val).toLowerCase().includes('low') ? 'text-red-400' : ''} 
                  ${String(val).includes('+') || String(val).toLowerCase().includes('high') || String(val).toLowerCase().includes('excellent') ? 'text-green-400' : 'text-gray-300'}`}
              >
                {String(val)}
                <Info size={12} className="opacity-50" />
              </button>
            ) : val !== undefined && typeof val === 'boolean' ? (
              <div className={`${val ? 'text-green-500' : 'text-[#a1a1aa]'}`}>
                {val ? <Check size={18} /> : <X size={18} />}
              </div>
            ) : (
              <span className="text-[#a1a1aa] text-xs italic">N/A</span>
            )}
          </td>
        );
      })}
    </tr>
  );
}
