import { useState } from 'react';
import { Check, X, ShieldAlert, Zap, Building2, Users, Banknote, ShieldCheck, TrendingUp, Target, Puzzle, MessageCircle, Info, ExternalLink } from 'lucide-react';

export default function SalesBattlecards() {
  const [selectedEvidence, setSelectedEvidence] = useState<any>(null);

  const competitors = [
    {
      name: "RivalMind (Us)",
      isUs: true,
      data: {
        features: {
          discovery: true,
          ragChat: true,
          stealthEvasion: true,
          apiAccess: true,
        },
        market: {
          g2Rating: "New",
          sentiment: "Highly Positive (+45%)",
        },
        social: {
          shareOfVoice: "5% (Emerging)",
          redditMomentum: "High (r/SaaS, r/startups)",
          blogStrategy: "Technical Deep-Dives",
          communityGrowth: "+40% MoM",
        },
        gtm: {
          audience: "Startups & Mid-Market",
          salesMotion: "Product-Led Growth (PLG)",
          freeTrial: "14-Day Free Trial",
        },
        ecosystem: {
          integrations: "Slack, Teams, HubSpot",
        },
        resources: {
          funding: "Bootstrapped",
          employees: "1-10",
          deployment: "Cloud (Multi-tenant)",
          hiringVelocity: "Active (Engineering)",
        },
        compliance: {
          soc2: false,
          gdpr: true,
          hipaa: false,
        },
        pricing: "$49/mo (Flat)"
      }
    },
    {
      name: "Acme Corp",
      isUs: false,
      data: {
        features: {
          discovery: false,
          ragChat: false,
          stealthEvasion: false,
          apiAccess: true,
        },
        market: {
          g2Rating: "4.8/5",
          sentiment: "Trending Negative (-12%)",
        },
        social: {
          shareOfVoice: "65% (Dominant)",
          redditMomentum: "Low (mostly complaints)",
          blogStrategy: "SEO / Top-of-Funnel",
          communityGrowth: "Stagnant",
        },
        gtm: {
          audience: "Enterprise Only",
          salesMotion: "Sales-Led (Demo required)",
          freeTrial: "No Trial",
        },
        ecosystem: {
          integrations: "Salesforce, Marketo, Snowflake",
        },
        resources: {
          funding: "$45M Series B",
          employees: "200+",
          deployment: "Cloud & On-prem",
          hiringVelocity: "Hiring Freeze",
        },
        compliance: {
          soc2: true,
          gdpr: true,
          hipaa: true,
        },
        pricing: "$899/mo + Usage"
      }
    },
    {
      name: "Globex Analytics",
      isUs: false,
      data: {
        features: {
          discovery: true,
          ragChat: false,
          stealthEvasion: false,
          apiAccess: false,
        },
        market: {
          g2Rating: "3.5/5",
          sentiment: "Neutral",
        },
        social: {
          shareOfVoice: "15%",
          redditMomentum: "Moderate",
          blogStrategy: "Thought Leadership (Medium)",
          communityGrowth: "+5% MoM",
        },
        gtm: {
          audience: "Mid-Market",
          salesMotion: "Sales-Assisted",
          freeTrial: "7-Day Trial",
        },
        ecosystem: {
          integrations: "Slack, Asana",
        },
        resources: {
          funding: "$12M Series A",
          employees: "50-100",
          deployment: "Cloud (Single-tenant)",
          hiringVelocity: "Moderate",
        },
        compliance: {
          soc2: true,
          gdpr: true,
          hipaa: false,
        },
        pricing: "$299/mo base"
      }
    },
    {
      name: "Initech",
      isUs: false,
      data: {
        features: {
          discovery: false,
          ragChat: true,
          stealthEvasion: true,
          apiAccess: true,
        },
        market: {
          g2Rating: "4.1/5",
          sentiment: "Positive (+5%)",
        },
        social: {
          shareOfVoice: "10%",
          redditMomentum: "Low",
          blogStrategy: "Case Studies & Whitepapers",
          communityGrowth: "+2% MoM",
        },
        gtm: {
          audience: "Enterprise",
          salesMotion: "Sales-Led",
          freeTrial: "Paid Pilot",
        },
        ecosystem: {
          integrations: "Salesforce, Oracle, SAP",
        },
        resources: {
          funding: "$110M Series D",
          employees: "500+",
          deployment: "Enterprise Only",
          hiringVelocity: "Aggressive (Sales)",
        },
        compliance: {
          soc2: true,
          gdpr: true,
          hipaa: true,
        },
        pricing: "Custom ($2k+/mo)"
      }
    }
  ];

  return (
    <div className="space-y-6 pb-12 relative">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white">Competitive Matrix</h1>
        <p className="text-sm text-[#a1a1aa]">Real-time side-by-side comparison of resources, features, and compliance across the market landscape. Click any text field for scraped evidence.</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-[#2a2a2a] bg-[#121212]">
        <table className="w-full text-sm text-left whitespace-nowrap">
          <thead className="bg-[#0a0a0a] border-b border-[#2a2a2a] uppercase text-xs font-semibold text-[#a1a1aa] tracking-wider">
            <tr>
              <th scope="col" className="px-6 py-4">Criteria</th>
              {competitors.map((c, i) => (
                <th key={i} scope="col" className={`px-6 py-4 ${c.isUs ? 'bg-blue-900/20 text-blue-400' : ''}`}>
                  {c.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2a2a2a]">
            {/* Category: Market Perception */}
            <tr className="bg-[#1a1a1a]">
              <td colSpan={competitors.length + 1} className="px-6 py-3 font-semibold text-white">
                <div className="flex items-center gap-2">
                  <TrendingUp size={16} className="text-purple-500" /> Market Perception & Sentiment
                </div>
              </td>
            </tr>
            <MatrixRow title="G2 / Capterra Rating" keyName="g2Rating" category="market" competitors={competitors} isText onEvidenceClick={setSelectedEvidence} />
            <MatrixRow title="Customer Sentiment Velocity" keyName="sentiment" category="market" competitors={competitors} isText onEvidenceClick={setSelectedEvidence} />

            {/* Category: Marketing & Social Presence */}
            <tr className="bg-[#1a1a1a]">
              <td colSpan={competitors.length + 1} className="px-6 py-3 font-semibold text-white">
                <div className="flex items-center gap-2">
                  <MessageCircle size={16} className="text-pink-500" /> Marketing & Social Presence
                </div>
              </td>
            </tr>
            <MatrixRow title="Share of Voice" keyName="shareOfVoice" category="social" competitors={competitors} isText onEvidenceClick={setSelectedEvidence} />
            <MatrixRow title="Reddit/Forum Momentum" keyName="redditMomentum" category="social" competitors={competitors} isText onEvidenceClick={setSelectedEvidence} />
            <MatrixRow title="Content Strategy" keyName="blogStrategy" category="social" competitors={competitors} isText onEvidenceClick={setSelectedEvidence} />
            <MatrixRow title="Community Growth" keyName="communityGrowth" category="social" competitors={competitors} isText onEvidenceClick={setSelectedEvidence} />

            {/* Category: Go-to-Market Strategy */}
            <tr className="bg-[#1a1a1a]">
              <td colSpan={competitors.length + 1} className="px-6 py-3 font-semibold text-white">
                <div className="flex items-center gap-2">
                  <Target size={16} className="text-orange-500" /> Go-to-Market Strategy
                </div>
              </td>
            </tr>
            <MatrixRow title="Target Audience" keyName="audience" category="gtm" competitors={competitors} isText onEvidenceClick={setSelectedEvidence} />
            <MatrixRow title="Sales Motion" keyName="salesMotion" category="gtm" competitors={competitors} isText onEvidenceClick={setSelectedEvidence} />
            <MatrixRow title="Trial Offering" keyName="freeTrial" category="gtm" competitors={competitors} isText onEvidenceClick={setSelectedEvidence} />

            {/* Category: Platform Features */}
            <tr className="bg-[#1a1a1a]">
              <td colSpan={competitors.length + 1} className="px-6 py-3 font-semibold text-white">
                <div className="flex items-center gap-2">
                  <Zap size={16} className="text-yellow-500" /> Platform Features
                </div>
              </td>
            </tr>
            <MatrixRow title="Automated Discovery Engine" keyName="discovery" category="features" competitors={competitors} />
            <MatrixRow title="Strategy RAG Chatbot" keyName="ragChat" category="features" competitors={competitors} />
            <MatrixRow title="Stealth Evasion Engine" keyName="stealthEvasion" category="features" competitors={competitors} />
            <MatrixRow title="Developer API" keyName="apiAccess" category="features" competitors={competitors} />

            {/* Category: Ecosystem */}
            <tr className="bg-[#1a1a1a]">
              <td colSpan={competitors.length + 1} className="px-6 py-3 font-semibold text-white">
                <div className="flex items-center gap-2">
                  <Puzzle size={16} className="text-teal-500" /> Ecosystem & Integrations
                </div>
              </td>
            </tr>
            <MatrixRow title="Top Integrations" keyName="integrations" category="ecosystem" competitors={competitors} isText onEvidenceClick={setSelectedEvidence} />

            {/* Category: Resources & Market Presence */}
            <tr className="bg-[#1a1a1a]">
              <td colSpan={competitors.length + 1} className="px-6 py-3 font-semibold text-white">
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-blue-500" /> Resources & Presence
                </div>
              </td>
            </tr>
            <MatrixRow title="Total Funding" keyName="funding" category="resources" competitors={competitors} isText onEvidenceClick={setSelectedEvidence} />
            <MatrixRow title="Employee Count" keyName="employees" category="resources" competitors={competitors} isText onEvidenceClick={setSelectedEvidence} />
            <MatrixRow title="Deployment Model" keyName="deployment" category="resources" competitors={competitors} isText onEvidenceClick={setSelectedEvidence} />
            <MatrixRow title="Hiring Velocity" keyName="hiringVelocity" category="resources" competitors={competitors} isText onEvidenceClick={setSelectedEvidence} />

            {/* Category: Compliance */}
            <tr className="bg-[#1a1a1a]">
              <td colSpan={competitors.length + 1} className="px-6 py-3 font-semibold text-white">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-green-500" /> Compliance & Security
                </div>
              </td>
            </tr>
            <MatrixRow title="SOC2 Type II" keyName="soc2" category="compliance" competitors={competitors} />
            <MatrixRow title="GDPR Compliant" keyName="gdpr" category="compliance" competitors={competitors} />
            <MatrixRow title="HIPAA Compliant" keyName="hipaa" category="compliance" competitors={competitors} />

            {/* Category: Pricing */}
            <tr className="bg-[#1a1a1a]">
              <td colSpan={competitors.length + 1} className="px-6 py-3 font-semibold text-white">
                <div className="flex items-center gap-2">
                  <Banknote size={16} className="text-green-400" /> Pricing Structure
                </div>
              </td>
            </tr>
            <MatrixRow title="Starting Price" keyName="pricing" category="direct" competitors={competitors} isText onEvidenceClick={setSelectedEvidence} />
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
            <li className="flex gap-2"><span className="text-green-500">•</span> <strong>Agility vs Enterprise Bloat:</strong> We ship features faster than Acme Corp or Initech can schedule a roadmap meeting.</li>
            <li className="flex gap-2"><span className="text-green-500">•</span> <strong>Price-to-Value:</strong> We offer core intelligence capabilities at 1/10th the cost of legacy incumbents.</li>
            <li className="flex gap-2"><span className="text-green-500">•</span> <strong>Automated Discovery:</strong> Competitors require manual URL input; we map the entire organization's footprint automatically.</li>
          </ul>
        </div>

        <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-5">
          <div className="flex items-center gap-2 mb-3 text-red-500">
            <ShieldAlert size={18} />
            <h3 className="font-semibold text-white">Vulnerabilities (Kill-Points to Deflect)</h3>
          </div>
          <ul className="text-sm text-[#a1a1aa] space-y-2">
            <li className="flex gap-2"><span className="text-red-500">•</span> <strong>Compliance:</strong> Enterprise buyers will demand SOC2. Pivot to our rapid GDPR readiness and upcoming SOC2 roadmap.</li>
            <li className="flex gap-2"><span className="text-red-500">•</span> <strong>Market Longevity:</strong> We lack the 5-year track record of Acme Corp. Focus on our modern tech stack and avoidance of technical debt.</li>
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
                <h3 className="font-semibold text-white">Scraped Evidence: {selectedEvidence.title}</h3>
              </div>
              <button onClick={() => setSelectedEvidence(null)} className="text-[#a1a1aa] hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <p className="text-xs text-[#a1a1aa] font-semibold uppercase tracking-wider mb-1">Company</p>
                <p className="text-white text-sm">{selectedEvidence.company}</p>
              </div>
              <div>
                <p className="text-xs text-[#a1a1aa] font-semibold uppercase tracking-wider mb-1">Extracted Value</p>
                <p className="text-white text-sm font-medium bg-blue-500/10 text-blue-400 p-2 rounded border border-blue-500/20 inline-block">{selectedEvidence.value}</p>
              </div>
              <div className="bg-[#0a0a0a] rounded border border-[#2a2a2a] p-3 font-mono text-xs text-gray-300 leading-relaxed">
                <p className="text-blue-400 mb-2 border-b border-[#2a2a2a] pb-2 flex items-center gap-1">
                  <ExternalLink size={12}/> 
                  Source: 
                  <a href={selectedEvidence.mockUrl} target="_blank" rel="noreferrer" className="hover:underline hover:text-white transition-colors">
                    {selectedEvidence.mockSource}
                  </a>
                </p>
                {selectedEvidence.mockRaw}
              </div>
              <p className="text-xs text-[#a1a1aa] text-right">Scraped 2 hours ago via Stealth Engine</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MatrixRow({ title, keyName, category, competitors, isText = false, onEvidenceClick }: any) {
  
  const generateMockEvidence = (company: string, keyName: string, value: string) => {
    let mockSource = "DOM Structure / Meta Tags";
    let mockRaw = `Found exact match for "${value}" in target page payload.`;
    let mockUrl = `https://${company.toLowerCase().replace(/[^a-z]/g, '')}.com`;
    
    if (keyName === 'redditMomentum' || keyName === 'sentiment') {
      mockSource = "Reddit API / Social Scraper Node";
      mockRaw = `[NLP Analysis] Aggregated 450 recent posts. Keyword extraction flagged heavy usage of terms related to "${value}". Confidence score: 94%.`;
      mockUrl = `https://www.reddit.com/search/?q=${encodeURIComponent(company)}`;
    } else if (keyName === 'hiringVelocity' || keyName === 'employees') {
      mockSource = "Greenhouse.io / Lever Job Boards";
      mockRaw = `Detected 12 open roles in Engineering. Diffing against previous week shows a 40% increase in active listings. Pattern matches "${value}".`;
      mockUrl = `https://boards.greenhouse.io/${company.toLowerCase().replace(/[^a-z]/g, '')}`;
    } else if (keyName === 'funding') {
      mockSource = "TechCrunch RSS / SEC Filings";
      mockRaw = `Cross-referenced 3 recent news articles. Press release from last month confirms "${value}".`;
      mockUrl = `https://techcrunch.com/search/${encodeURIComponent(company)}`;
    } else if (keyName === 'pricing') {
      mockSource = "pricing.html (DOM ID: #pricing-tiers)";
      mockRaw = `<div class="tier-price">${value}</div> ... Evaluated DOM change against last week.`;
      mockUrl = `https://${company.toLowerCase().replace(/[^a-z]/g, '')}.com/pricing`;
    }

    return { title, company, value, mockSource, mockRaw, mockUrl };
  };

  return (
    <tr className="hover:bg-[#1a1a1a]/50 transition-colors">
      <td className="px-6 py-4 font-medium text-gray-300 border-r border-[#2a2a2a]/50">{title}</td>
      {competitors.map((c: any, i: number) => {
        const val = category === 'direct' ? c.data[keyName] : c.data[category][keyName];
        
        return (
          <td key={i} className={`px-6 py-4 ${c.isUs ? 'bg-blue-900/10' : ''}`}>
            {isText ? (
              <button 
                onClick={() => onEvidenceClick(generateMockEvidence(c.name, keyName, val))}
                className={`flex items-center gap-1.5 text-left transition-colors hover:text-white hover:underline decoration-blue-500/50 underline-offset-4
                  ${String(val).includes('-') || String(val).includes('Freeze') || String(val).includes('complaints') ? 'text-red-400' : ''} 
                  ${String(val).includes('+') || String(val).includes('Active') || String(val).includes('High') ? 'text-green-400' : 'text-gray-300'}`}
              >
                {val}
                <Info size={12} className="opacity-50" />
              </button>
            ) : (
              <div className={`${val ? 'text-green-500' : 'text-[#a1a1aa]'}`}>
                {val ? <Check size={18} /> : <X size={18} />}
              </div>
            )}
          </td>
        );
      })}
    </tr>
  );
}
