import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Initialize Supabase Client
const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function ingestContent(content: string, metadata: any) {
  console.log(`[RAG Ingestion] Chunking and embedding content from ${metadata.source}...`);
  
  if (!process.env.GEMINI_API_KEY || !process.env.VITE_SUPABASE_URL) {
    console.warn('[RAG Ingestion] Missing API keys. Returning mock success.');
    return { status: 'mock_success', chunksInserted: 1 };
  }

  // Simple chunking logic (by paragraph or fixed length)
  const chunkSize = 1000;
  const chunks = [];
  for (let i = 0; i < content.length; i += chunkSize) {
    chunks.push(content.substring(i, i + chunkSize));
  }
  
  console.log(`[RAG Ingestion] Created ${chunks.length} chunks.`);
  
  try {
    const embeddingModel = genAI.getGenerativeModel({ model: "text-embedding-004" });
    let insertedCount = 0;

    for (const chunk of chunks) {
      // Generate embedding using Gemini
      const result = await embeddingModel.embedContent(chunk);
      const embedding = result.embedding.values;

      // Upsert into Supabase pgvector
      const { error } = await supabase.from('competitor_embeddings').insert({
        competitor_id: metadata.competitor_id || null, // Assuming UUID
        content: chunk,
        source: metadata.source,
        metadata: metadata,
        embedding: embedding
      });

      if (error) {
        console.error('[RAG Ingestion] Supabase insertion error:', error);
      } else {
        insertedCount++;
      }
    }

    return {
      status: 'success',
      chunksInserted: insertedCount
    };
  } catch (error) {
    console.error('[RAG Ingestion] Failed:', error);
    throw error;
  }
}
