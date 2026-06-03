import { useState, useRef, useEffect } from 'react';
import { Target, Search, Activity, Link as LinkIcon, Database, ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function CompetitorIntelligence() {
  const [competitor, setCompetitor] = useState('');
  const [customInstructions, setCustomInstructions] = useState('');
  const [dataSource, setDataSource] = useState<'meta_ads' | 'uber_eats'>('meta_ads');
  
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<{message: string, isResult: boolean, data: any}[]>([]);
  const [result, setResult] = useState<any>(null);
  
  const logsEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleStartAnalysis = async () => {
    if (!competitor.trim()) return;
    
    setIsRunning(true);
    setLogs([]);
    setResult(null);

    try {
      const res = await fetch('http://localhost:3001/api/agentic-scraper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          competitor: competitor.trim(),
          customInstructions: customInstructions.trim(),
          target: dataSource
        }),
      });

      if (!res.body) {
        throw new Error('No response body');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            setLogs(prev => [...prev, data]);
            if (data.isResult && data.data) {
              setResult(data.data);
            }
          } catch (e) {
            console.error('Failed to parse SSE line:', line);
          }
        }
      }
    } catch (error: any) {
      setLogs(prev => [...prev, { message: `[Error] ${error.message}`, isResult: false, data: null }]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Target className="text-purple-500" />
            Competitor Intelligence
          </h1>
          <p className="text-[#a1a1aa] mt-1">Autonomous agentic scraping of competitor ads and menus.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Input Panel */}
        <div className="bg-[#121212] border border-[#2a2a2a] rounded-lg p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-white block mb-2">Data Source</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setDataSource('meta_ads')}
                  className={`p-3 rounded-md border text-sm font-medium transition-colors ${
                    dataSource === 'meta_ads' 
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400' 
                      : 'bg-[#0a0a0a] border-[#2a2a2a] text-[#a1a1aa] hover:border-[#4a4a4a]'
                  }`}
                >
                  Meta Ads Library
                </button>
                <button
                  onClick={() => setDataSource('uber_eats')}
                  className={`p-3 rounded-md border text-sm font-medium transition-colors ${
                    dataSource === 'uber_eats' 
                      ? 'bg-green-600/20 border-green-500 text-green-400' 
                      : 'bg-[#0a0a0a] border-[#2a2a2a] text-[#a1a1aa] hover:border-[#4a4a4a]'
                  }`}
                >
                  Uber Eats Menu
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white block mb-2">Competitor Target</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a1a1aa]" />
                <input
                  type="text"
                  value={competitor}
                  onChange={(e) => setCompetitor(e.target.value)}
                  placeholder={dataSource === 'meta_ads' ? "Enter Page Name or URL (e.g. Acme Corp)" : "Enter Restaurant Name or URL"}
                  className="w-full pl-9 pr-3 py-2 bg-[#0a0a0a] border border-[#2a2a2a] rounded-md text-white placeholder-[#a1a1aa] focus:outline-none focus:border-blue-500"
                  disabled={isRunning}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white block mb-2">Custom Instructions & URLs (Optional)</label>
              <textarea
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Provide extra instructions or specific URLs..."
                rows={3}
                className="w-full p-3 bg-[#0a0a0a] border border-[#2a2a2a] rounded-md text-white placeholder-[#a1a1aa] focus:outline-none focus:border-blue-500 resize-y"
                disabled={isRunning}
              />
            </div>
            
            <button
              onClick={handleStartAnalysis}
              disabled={isRunning || !competitor.trim()}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:hover:bg-purple-600 text-white font-medium rounded-md transition-colors flex items-center justify-center gap-2"
            >
              {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Activity className="w-4 h-4" />}
              {isRunning ? 'Agent Initializing...' : 'Deploy Intelligence Agent'}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Agent Terminal */}
          <div className="bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg overflow-hidden flex flex-col h-64 shadow-inner">
            <div className="bg-[#121212] border-b border-[#2a2a2a] px-4 py-2 flex items-center gap-2 text-xs font-mono text-[#a1a1aa]">
              <Database className="w-3 h-3" />
              agent-stealth-terminal.log
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-1.5 font-mono text-[11px] leading-relaxed">
              {logs.length === 0 && !isRunning && (
                <div className="text-[#a1a1aa] italic">Waiting for target deployment...</div>
              )}
              {logs.map((log, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-emerald-500 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                  <span className={log.message.includes('[Error]') ? 'text-red-400' : 'text-zinc-300'}>
                    {log.message}
                  </span>
                </div>
              ))}
              {isRunning && (
                <div className="flex gap-3 animate-pulse">
                  <span className="text-emerald-500 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                  <span className="text-zinc-400 flex items-center gap-2">
                    <Loader2 className="w-3 h-3 animate-spin" /> 
                    <span className="w-2 h-4 bg-zinc-400 animate-ping" />
                  </span>
                </div>
              )}
              <div ref={logsEndRef} />
            </div>
          </div>

          {/* Render Results */}
          {result && (
            <div className="bg-[#121212] border border-[#2a2a2a] rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-500" />
                Intelligence Captured
              </h3>
              
              {dataSource === 'meta_ads' && (
                <div className="space-y-6">
                  {/* Summary */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg">
                      <p className="text-sm text-[#a1a1aa]">Total Active Ads</p>
                      <p className="text-2xl font-bold mt-1 text-white">{result.ads?.length || 0}</p>
                    </div>
                  </div>
                  
                  {/* Ads List */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-white">Active Campaigns</h4>
                    <div className="grid gap-4">
                      {(result.ads || []).map((ad: any, i: number) => (
                        <div key={i} className="p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-medium px-2 py-1 bg-purple-500/10 text-purple-400 rounded-full">
                              {ad.platform || 'Meta'}
                            </span>
                            {ad.sourceUrl && (
                              <a href={ad.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-xs">
                                <LinkIcon className="w-3 h-3" /> View Source
                              </a>
                            )}
                          </div>
                          <p className="text-sm mt-2 text-zinc-300">{ad.content}</p>
                          {ad.mediaUrl && (
                            <div className="mt-3 text-xs text-[#a1a1aa] bg-[#121212] p-2 rounded">
                              Media Attached: {ad.mediaUrl}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {dataSource === 'uber_eats' && (
                <div className="space-y-6">
                   {/* Summary */}
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg">
                      <p className="text-sm text-[#a1a1aa]">Total Categories</p>
                      <p className="text-2xl font-bold mt-1 text-white">{(result.categories || []).length}</p>
                    </div>
                    <div className="p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg">
                      <p className="text-sm text-[#a1a1aa]">Total Items</p>
                      <p className="text-2xl font-bold mt-1 text-white">
                        {(result.categories || []).reduce((acc: number, cat: any) => acc + (cat.items?.length || 0), 0)}
                      </p>
                    </div>
                  </div>
                  {result.storeUrl && (
                    <a href={result.storeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 text-sm font-medium">
                      <LinkIcon className="w-4 h-4" /> Verify Store Source
                    </a>
                  )}

                  {/* Menu List */}
                  <div className="space-y-8">
                    {(result.categories || []).map((cat: any, i: number) => (
                      <div key={i}>
                        <h4 className="font-semibold text-lg text-white mb-4 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {cat.name}
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {(cat.items || []).map((item: any, j: number) => (
                            <div key={j} className="p-4 bg-[#0a0a0a] border border-[#2a2a2a] rounded-lg hover:border-[#4a4a4a] transition-colors">
                              <div className="flex justify-between items-start">
                                <h5 className="font-medium text-white">{item.name}</h5>
                                {item.price && <span className="text-emerald-400 font-medium whitespace-nowrap ml-4">{item.price}</span>}
                              </div>
                              {item.description && <p className="text-sm text-[#a1a1aa] mt-2 line-clamp-2">{item.description}</p>}
                              {item.rating && (
                                <div className="mt-3 flex items-center gap-1">
                                  <span className="text-yellow-500 text-xs">★</span>
                                  <span className="text-xs font-medium text-zinc-300">{item.rating}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
