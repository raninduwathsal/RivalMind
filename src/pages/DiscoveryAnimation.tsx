import { useState, useEffect, useRef } from 'react';
import { Terminal, Database, ArrowRight, Activity, Loader2 } from 'lucide-react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function DiscoveryAnimation() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const targetUrl = searchParams.get('url') || '';
  const domain = searchParams.get('domain') || '';
  const name = domain ? domain.split('.')[0].charAt(0).toUpperCase() + domain.split('.')[0].slice(1) : 'Unknown';

  const [logs, setLogs] = useState<{ timestamp: string, text: string }[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  useEffect(() => {
    if (!domain) return;

    const eventSource = new EventSource(`http://localhost:3001/api/investigate?company=${encodeURIComponent(name)}`);

    eventSource.addEventListener('progress', (e) => {
      const data = JSON.parse(e.data);
      setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), text: data.message }]);
    });

    eventSource.addEventListener('complete', async (e) => {
      const data = JSON.parse(e.data);
      setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), text: 'Agent investigation finished. Synthesizing final DB row...' }]);
      
      try {
        // Upsert into Supabase with the dynamic metrics
        await supabase.from('competitors').upsert({
          name: name,
          domain: domain,
          metrics: data.metrics
        }, { onConflict: 'domain' });

        setLogs(prev => [...prev, { timestamp: new Date().toLocaleTimeString(), text: 'Successfully committed dynamic intelligence to Knowledge Graph.' }]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsComplete(true);
        eventSource.close();
      }
    });

    eventSource.addEventListener('error', (e: any) => {
      if (e.data) {
        const data = JSON.parse(e.data);
        setError(data.message);
      } else {
        setError('Connection to agent lost.');
      }
      setIsComplete(true);
      eventSource.close();
    });

    return () => {
      eventSource.close();
    };
  }, [domain, name]);

  if (!domain) {
    return <div className="text-white">No target domain provided.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Activity className={!isComplete ? "text-purple-500 animate-pulse" : "text-green-500"} />
            Autonomous Investigator Agent
          </h1>
          <p className="text-[#a1a1aa] mt-1">DeepSeek v3 is live-crawling the web for {name} ({domain})...</p>
        </div>
        {isComplete && (
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors shadow-[0_0_15px_rgba(37,99,235,0.5)]"
          >
            View Dashboard <ArrowRight size={16} />
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-md shrink-0">
          Agent Error: {error}
        </div>
      )}

      <div className="flex-1 bg-black border border-[#2a2a2a] rounded-lg overflow-hidden flex flex-col font-mono text-sm shadow-2xl relative min-h-[500px]">
        {/* Terminal Header */}
        <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 py-2 flex items-center gap-2 shrink-0">
          <Terminal size={14} className="text-[#a1a1aa]" />
          <span className="text-[#a1a1aa]">agent-execution-log.sh</span>
        </div>
        
        {/* Terminal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-4">
              <span className="text-blue-500 shrink-0">[{log.timestamp}]</span>
              <span className={`${
                log.text.startsWith('Thought:') ? 'text-purple-400' :
                log.text.startsWith('Action:') ? 'text-green-400' :
                log.text.startsWith('Observation') ? 'text-yellow-400' :
                'text-white'
              }`}>
                {log.text}
              </span>
            </div>
          ))}
          {!isComplete && (
            <div className="flex gap-4">
              <span className="text-blue-500 shrink-0">[{new Date().toLocaleTimeString()}]</span>
              <span className="text-purple-400 flex items-center gap-2">
                <Loader2 size={12} className="animate-spin" /> DeepSeek is reasoning...
              </span>
            </div>
          )}
          <div ref={logsEndRef} />
        </div>
      </div>
    </div>
  );
}
