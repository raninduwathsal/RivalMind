import { useState } from 'react';
import { Send, Bot, User, Sparkles } from 'lucide-react';

export default function StrategyRag() {
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I have vectorized the latest intelligence on Acme Corp, Globex, and Initech. Ask me anything about their pricing, features, or how to pitch against them.' }
  ]);

  const handleSend = () => {
    if (!query.trim()) return;
    
    setMessages([...messages, { role: 'user', content: query }]);
    setQuery('');
    
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Based on recent data from their changelog and pricing page, Acme Corp recently introduced Enterprise SSO. To stand out, you should highlight our easier onboarding and significantly lower price point for startups.' }]);
    }, 1000);
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto border border-[#2a2a2a] rounded-lg bg-[#121212] overflow-hidden">
      <div className="p-4 border-b border-[#2a2a2a] flex items-center justify-between bg-[#0a0a0a]">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-500" size={20} />
          <h2 className="font-semibold text-white">Strategy RAG Assistant</h2>
        </div>
        <span className="text-xs px-2 py-1 bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">Vector Index: Active</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-blue-600' : 'bg-purple-600'}`}>
              {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
            </div>
            <div className={`max-w-[80%] rounded-lg p-3 text-sm ${msg.role === 'user' ? 'bg-blue-600/20 text-white border border-blue-500/30' : 'bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a]'}`}>
              {msg.content}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-[#2a2a2a] bg-[#0a0a0a]">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about competitor features, pitch ideas, or recent news..."
            className="w-full bg-[#121212] border border-[#2a2a2a] rounded-md pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
          />
          <button 
            onClick={handleSend}
            className="absolute right-2 top-2 bottom-2 aspect-square flex items-center justify-center bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
