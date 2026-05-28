import { Activity, AlertTriangle, ArrowUpRight, TrendingUp, Users } from 'lucide-react';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-white">Executive Briefing</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#a1a1aa]">Last updated:</span>
          <span className="text-sm font-medium text-white">Just now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Global Threat Score" value="78/100" trend="+5" trendUp={true} alert={true} />
        <MetricCard title="Competitor Activity" value="High" subtitle="3 Major Events" icon={<Activity className="text-blue-500" />} />
        <MetricCard title="Pricing Movements" value="2" subtitle="in last 7 days" icon={<TrendingUp className="text-yellow-500" />} />
        <MetricCard title="Hiring Velocity (AI)" value="+42%" subtitle="Industry Avg: +12%" icon={<Users className="text-green-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#121212] border border-[#2a2a2a] rounded-lg p-5">
            <h2 className="text-lg font-semibold text-white mb-4">Market Timeline</h2>
            <div className="space-y-4">
              <TimelineEvent date="Today, 09:41 AM" company="Acme Corp" event="Launched Enterprise SSO" impact="High" />
              <TimelineEvent date="Yesterday" company="Globex" event="Increased Pro Tier pricing by 15%" impact="Strategic" />
              <TimelineEvent date="Apr 24" company="Initech" event="Opened 12 ML Engineering roles" impact="Medium" />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-[#121212] border border-red-900/50 rounded-lg p-5">
            <div className="flex items-center gap-2 mb-4 text-red-500">
              <AlertTriangle size={20} />
              <h2 className="text-lg font-semibold text-white">Strategic Alerts</h2>
            </div>
            <div className="space-y-3">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                <p className="text-sm text-red-200 font-medium">Acme Corp moving upmarket</p>
                <p className="text-xs text-red-300/70 mt-1">Enterprise SSO and Audit Logs detected on pricing page.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, subtitle, trend, trendUp, alert, icon }: any) {
  return (
    <div className={`bg-[#121212] border ${alert ? 'border-red-900/50' : 'border-[#2a2a2a]'} rounded-lg p-5 flex flex-col`}>
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium text-[#a1a1aa]">{title}</span>
        {icon}
      </div>
      <div className="flex items-baseline gap-2 mt-auto">
        <span className="text-3xl font-bold text-white">{value}</span>
        {trend && (
          <span className={`flex items-center text-sm font-medium ${trendUp ? 'text-red-500' : 'text-green-500'}`}>
            <ArrowUpRight size={16} />
            {trend}
          </span>
        )}
      </div>
      {subtitle && <p className="text-xs text-[#a1a1aa] mt-1">{subtitle}</p>}
    </div>
  );
}

function TimelineEvent({ date, company, event, impact }: any) {
  const getImpactColor = (level: string) => {
    switch(level) {
      case 'High': return 'text-orange-500 border-orange-500/20 bg-orange-500/10';
      case 'Strategic': return 'text-red-500 border-red-500/20 bg-red-500/10';
      default: return 'text-blue-500 border-blue-500/20 bg-blue-500/10';
    }
  };

  return (
    <div className="flex gap-4">
      <div className="w-24 shrink-0 text-xs text-[#a1a1aa] pt-1">{date}</div>
      <div className="flex-1 pb-4 border-b border-[#2a2a2a] last:border-0 last:pb-0">
        <div className="flex items-center justify-between mb-1">
          <span className="font-semibold text-white">{company}</span>
          <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getImpactColor(impact)}`}>
            {impact}
          </span>
        </div>
        <p className="text-sm text-[#a1a1aa]">{event}</p>
      </div>
    </div>
  );
}
