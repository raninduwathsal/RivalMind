import { useState, useEffect } from 'react';
import { Package, ExternalLink, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function ProductComparisons() {
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
            products: dbRow.metrics?._products || []
          })).filter(c => c.products.length > 0);
          
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
      .channel('products-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'competitors' }, () => {
        fetchCompetitors();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-4 text-[#a1a1aa]">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
          <p>Syncing product catalogs from Supabase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
          <Package className="text-purple-500" /> Product & Package Comparisons
        </h1>
        <p className="text-sm text-[#a1a1aa]">Deep-dive side-by-side analysis of specific product tiers, menus, or catalog items dynamically extracted by the AI Agent.</p>
      </div>

      {competitors.length === 0 ? (
        <div className="bg-[#121212] border border-[#2a2a2a] rounded-lg p-12 text-center flex flex-col items-center justify-center">
          <Activity size={48} className="text-[#2a2a2a] mb-4" />
          <h2 className="text-lg font-semibold text-white mb-2">No Product Catalogs Found</h2>
          <p className="text-[#a1a1aa] max-w-md">
            The AI Investigator hasn't found any product catalogs or pricing tiers yet. 
            Track a new SaaS or Ecommerce competitor in the dashboard to populate this view.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {competitors.map((comp, idx) => (
            <div key={idx} className="space-y-4">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2 border-b border-[#2a2a2a] pb-2">
                {comp.name} {comp.isUs && <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded ml-2">Our Brand</span>}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {comp.products.map((product: any, pIdx: number) => (
                  <div key={pIdx} className="bg-[#121212] border border-[#2a2a2a] rounded-lg p-5 flex flex-col h-full hover:border-gray-500 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-white text-lg">{product.name || 'Unnamed Product'}</h3>
                      <div className="bg-[#1a1a1a] text-green-400 px-3 py-1 rounded-full text-sm font-medium border border-green-500/20">
                        {product.price || 'Contact Sales'}
                      </div>
                    </div>
                    
                    {product.description && (
                      <p className="text-[#a1a1aa] text-sm mb-4 leading-relaxed line-clamp-3">
                        {product.description}
                      </p>
                    )}
                    
                    <div className="mt-auto pt-4 border-t border-[#2a2a2a]">
                      <h4 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-2">Included Features</h4>
                      {product.features && Array.isArray(product.features) ? (
                        <ul className="space-y-2">
                          {product.features.map((feature: string, fIdx: number) => (
                            <li key={fIdx} className="flex gap-2 text-sm text-gray-300">
                              <span className="text-purple-500 shrink-0">•</span>
                              <span className="line-clamp-2">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-400 italic">No features explicitly listed.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
