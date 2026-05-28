import { useState, useEffect } from 'react';
import { Search, Globe, Code, FileText, CheckCircle2, Loader2, Database } from 'lucide-react';

export default function DiscoveryAnimation() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const intervals = [
      setTimeout(() => setStep(1), 2000), // Google Search
      setTimeout(() => setStep(2), 5000), // Selecting Links
      setTimeout(() => setStep(3), 8000), // Extracting Content
      setTimeout(() => setStep(4), 11000), // Building RAG
    ];
    return () => intervals.forEach(clearTimeout);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Competitor Discovery Engine</h1>
        <p className="text-[#a1a1aa] mt-1">Simulating stealth collection and index generation...</p>
      </div>

      <div className="bg-[#121212] border border-[#2a2a2a] rounded-lg p-6">
        <div className="space-y-6">
          {/* Step 1: Search */}
          <div className={`transition-opacity duration-500 ${step >= 0 ? 'opacity-100' : 'opacity-0'}`}>
            <div className="flex items-center gap-3 mb-3">
              {step === 0 ? <Loader2 className="animate-spin text-blue-500" /> : <CheckCircle2 className="text-green-500" />}
              <span className="font-semibold text-white">1. Fingerprinting & Discovery</span>
            </div>
            {step >= 0 && (
              <div className="ml-9 p-4 bg-[#0a0a0a] rounded border border-[#2a2a2a] space-y-2">
                <div className="flex items-center gap-2 text-sm text-[#a1a1aa]">
                  <Search size={14} /> Executing dork queries for "Acme Corp"
                </div>
                <div className="text-xs font-mono text-blue-400">site:linkedin.com/jobs "Acme Corp"</div>
                <div className="text-xs font-mono text-blue-400">site:news.ycombinator.com "Acme Corp"</div>
                {step >= 1 && <div className="text-xs text-green-400 mt-2">↳ Found 142 related URLs across 8 domains.</div>}
              </div>
            )}
          </div>

          {/* Step 2: Site Selection */}
          <div className={`transition-opacity duration-500 ${step >= 1 ? 'opacity-100' : 'opacity-20'}`}>
            <div className="flex items-center gap-3 mb-3">
              {step === 1 ? <Loader2 className="animate-spin text-blue-500" /> : <CheckCircle2 className={step > 1 ? "text-green-500" : "text-gray-500"} />}
              <span className="font-semibold text-white">2. Navigating Target Nodes</span>
            </div>
            {step >= 1 && (
              <div className="ml-9 grid grid-cols-2 gap-3">
                <NodeCard icon={<Globe size={16} />} title="acmecorp.com/pricing" status={step > 1 ? 'Analyzed' : 'Visiting...'} active={step === 1} />
                <NodeCard icon={<FileText size={16} />} title="greenhouse.io/acme" status={step > 1 ? 'Analyzed' : 'Visiting...'} active={step === 1} />
                <NodeCard icon={<Code size={16} />} title="github.com/acme" status={step > 1 ? 'Analyzed' : 'Visiting...'} active={step === 1} />
              </div>
            )}
          </div>

          {/* Step 3: Extraction */}
          <div className={`transition-opacity duration-500 ${step >= 2 ? 'opacity-100' : 'opacity-20'}`}>
            <div className="flex items-center gap-3 mb-3">
              {step === 2 ? <Loader2 className="animate-spin text-blue-500" /> : <CheckCircle2 className={step > 2 ? "text-green-500" : "text-gray-500"} />}
              <span className="font-semibold text-white">3. Content Extraction (Stealth Mode)</span>
            </div>
            {step >= 2 && (
              <div className="ml-9 space-y-2">
                <ExtractItem source="Pricing Page" data="Extracted 3 tiers. Pro plan increased by $10." />
                <ExtractItem source="Careers Board" data="Found 4 new Enterprise Sales listings." />
                <ExtractItem source="YouTube" data="Parsed transcript from 'Acme 2.0 Launch'. Found 'SSO' mentions." />
              </div>
            )}
          </div>

          {/* Step 4: Database Building */}
          <div className={`transition-opacity duration-500 ${step >= 3 ? 'opacity-100' : 'opacity-20'}`}>
            <div className="flex items-center gap-3 mb-3">
              {step === 3 ? <Loader2 className="animate-spin text-blue-500" /> : <CheckCircle2 className={step > 3 ? "text-green-500" : "text-gray-500"} />}
              <span className="font-semibold text-white">4. Knowledge Graph Construction</span>
            </div>
            {step >= 3 && (
              <div className="ml-9 p-4 bg-[#0a0a0a] rounded border border-[#2a2a2a]">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="text-purple-500" size={18} />
                  <span className="text-sm font-medium text-white">Vectorizing Intelligence...</span>
                </div>
                <div className="w-full bg-[#121212] rounded-full h-1.5 mt-2">
                  <div className={`bg-purple-500 h-1.5 rounded-full transition-all duration-[3000ms] ${step >= 4 ? 'w-full' : 'w-1/4'}`}></div>
                </div>
                {step >= 4 && <div className="text-xs text-green-400 mt-3 font-medium">Ready. Strategy RAG online.</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function NodeCard({ icon, title, status, active }: any) {
  return (
    <div className={`p-3 border rounded flex items-center justify-between transition-colors ${active ? 'border-blue-500/50 bg-blue-500/10' : 'border-[#2a2a2a] bg-[#0a0a0a]'}`}>
      <div className="flex items-center gap-2 text-sm text-white">
        <span className="text-[#a1a1aa]">{icon}</span>
        {title}
      </div>
      <span className={`text-xs ${active ? 'text-blue-400' : 'text-[#a1a1aa]'}`}>{status}</span>
    </div>
  );
}

function ExtractItem({ source, data }: any) {
  return (
    <div className="flex gap-3 text-sm border-l-2 border-[#2a2a2a] pl-3 py-1">
      <span className="text-[#a1a1aa] w-24 shrink-0">{source}</span>
      <span className="text-white">{data}</span>
    </div>
  );
}
