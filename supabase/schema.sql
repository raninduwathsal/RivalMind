-- RivalMind Database Schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create competitors table with flexible JSONB metric storage
CREATE TABLE public.competitors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    is_us BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- We use a JSONB column to handle varying metrics per company (e.g. some might not have funding data or SOC2 status)
    metrics JSONB DEFAULT '{}'::jsonb
);

-- Row Level Security (RLS) policies
ALTER TABLE public.competitors ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access (for MVP demo purposes)
CREATE POLICY "Allow public read access"
ON public.competitors
FOR SELECT
TO anon
USING (true);

-- Allow anonymous insert access (for MVP demo purposes)
CREATE POLICY "Allow public insert access"
ON public.competitors
FOR INSERT
TO anon
WITH CHECK (true);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for competitors table
CREATE TRIGGER update_competitors_updated_at
BEFORE UPDATE ON public.competitors
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Optional: Insert initial mock data based on the current SalesBattlecards structure
INSERT INTO public.competitors (name, domain, is_us, metrics)
VALUES 
(
  'RivalMind', 
  'rivalmind.io', 
  true, 
  '{"features": {"discovery": true, "ragChat": true, "stealthEvasion": true, "apiAccess": true}, "market": {"g2Rating": "New", "sentiment": "Highly Positive (+45%)"}, "social": {"shareOfVoice": "5% (Emerging)", "redditMomentum": "High (r/SaaS, r/startups)", "blogStrategy": "Technical Deep-Dives", "communityGrowth": "+40% MoM"}, "gtm": {"audience": "Startups & Mid-Market", "salesMotion": "Product-Led Growth (PLG)", "freeTrial": "14-Day Free Trial"}, "ecosystem": {"integrations": "Slack, Teams, HubSpot"}, "resources": {"funding": "Bootstrapped", "employees": "1-10", "deployment": "Cloud (Multi-tenant)", "hiringVelocity": "Active (Engineering)"}, "compliance": {"soc2": false, "gdpr": true, "hipaa": false}, "pricing": "$49/mo (Flat)"}'::jsonb
),
(
  'Acme Corp', 
  'acmecorp.com', 
  false, 
  '{"features": {"discovery": false, "ragChat": false, "stealthEvasion": false, "apiAccess": true}, "market": {"g2Rating": "4.8/5", "sentiment": "Trending Negative (-12%)"}, "social": {"shareOfVoice": "65% (Dominant)", "redditMomentum": "Low (mostly complaints)", "blogStrategy": "SEO / Top-of-Funnel", "communityGrowth": "Stagnant"}, "gtm": {"audience": "Enterprise Only", "salesMotion": "Sales-Led (Demo required)", "freeTrial": "No Trial"}, "ecosystem": {"integrations": "Salesforce, Marketo, Snowflake"}, "resources": {"funding": "$45M Series B", "employees": "200+", "deployment": "Cloud & On-prem", "hiringVelocity": "Hiring Freeze"}, "compliance": {"soc2": true, "gdpr": true, "hipaa": true}, "pricing": "$899/mo + Usage"}'::jsonb
);

-- Enable pgvector extension for Strategy RAG Engine
CREATE EXTENSION IF NOT EXISTS vector;

-- Create competitor_embeddings table for RAG queries
CREATE TABLE public.competitor_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    competitor_id UUID REFERENCES public.competitors(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    source VARCHAR(255), -- e.g., 'pricing_page', 'linkedin_post', 'youtube_video'
    metadata JSONB DEFAULT '{}'::jsonb,
    embedding VECTOR(1536), -- Assuming Gemini/DeepSeek standard vector sizes
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS for competitor_embeddings
ALTER TABLE public.competitor_embeddings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access on embeddings"
ON public.competitor_embeddings
FOR SELECT
TO anon
USING (true);

-- Create a similarity search function (RPC) to be called from the RAG backend
CREATE OR REPLACE FUNCTION match_competitor_embeddings(
  query_embedding VECTOR(1536),
  match_threshold FLOAT,
  match_count INT
)
RETURNS TABLE (
  id UUID,
  competitor_id UUID,
  content TEXT,
  source VARCHAR,
  metadata JSONB,
  similarity FLOAT
)
LANGUAGE sql STABLE
AS $$
  SELECT
    competitor_embeddings.id,
    competitor_embeddings.competitor_id,
    competitor_embeddings.content,
    competitor_embeddings.source,
    competitor_embeddings.metadata,
    1 - (competitor_embeddings.embedding <=> query_embedding) AS similarity
  FROM competitor_embeddings
  WHERE 1 - (competitor_embeddings.embedding <=> query_embedding) > match_threshold
  ORDER BY competitor_embeddings.embedding <=> query_embedding
  LIMIT match_count;
$$;
