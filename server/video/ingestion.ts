import ffmpeg from 'fluent-ffmpeg';
import ffmpegStatic from 'ffmpeg-static';
import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Ensure ffmpeg is correctly referenced
if (ffmpegStatic) {
  ffmpeg.setFfmpegPath(ffmpegStatic);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Helper to wait for frame extraction
const extractFrames = (inputVideo: string, outputDir: string, fps = 1): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    ffmpeg(inputVideo)
      .fps(fps)
      .on('end', () => {
        const files = fs.readdirSync(outputDir)
          .filter(f => f.endsWith('.png'))
          .map(f => path.join(outputDir, f))
          .sort();
        resolve(files);
      })
      .on('error', (err) => reject(err))
      .save(`${outputDir}/frame-%03d.png`);
  });
};

// Helper to diff two images and return percentage of difference
const diffImages = (img1Path: string, img2Path: string): number => {
  const img1 = PNG.sync.read(fs.readFileSync(img1Path));
  const img2 = PNG.sync.read(fs.readFileSync(img2Path));
  
  const { width, height } = img1;
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, { threshold: 0.1 });
  return (numDiffPixels / (width * height)) * 100;
};

export async function processCompetitorVideo(videoPath: string, competitorName: string) {
  console.log(`[Video Ingestion] Starting processing for ${videoPath}`);
  
  const tempDir = path.resolve('./temp_frames_' + Date.now());
  
  try {
    // 1. Extract Frames
    console.log(`[Video Ingestion] Extracting frames at 1fps...`);
    const frames = await extractFrames(videoPath, tempDir, 1);
    
    if (frames.length === 0) throw new Error("No frames extracted");

    // 2. Diff Frames to find Keyframes (Detect Scene Changes)
    console.log(`[Video Ingestion] Finding key scenes via pixel diffing...`);
    const keyframes: string[] = [frames[0]]; // Always keep the first frame
    
    for (let i = 1; i < frames.length; i++) {
      const prevFrame = keyframes[keyframes.length - 1];
      const currFrame = frames[i];
      
      const diffPercent = diffImages(prevFrame, currFrame);
      
      // If image changed by more than 15%, it's a new scene/keyframe
      if (diffPercent > 15) {
        keyframes.push(currFrame);
      }
    }
    
    console.log(`[Video Ingestion] Reduced ${frames.length} total frames to ${keyframes.length} keyframes.`);

    // 3. Multimodal Analysis with Gemini
    console.log(`[Video Ingestion] Sending keyframes to Gemini 1.5 for analysis...`);
    
    if (!process.env.GEMINI_API_KEY) {
      console.warn('[Video Ingestion] GEMINI_API_KEY not found. Returning mock analysis.');
      return { status: 'mock_success', keyframeCount: keyframes.length };
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use flash for speed, pro for complex reasoning
    
    // Prepare image parts for Gemini
    const imageParts = keyframes.map(framePath => {
      const base64Data = fs.readFileSync(framePath).toString("base64");
      return {
        inlineData: {
          data: base64Data,
          mimeType: "image/png"
        }
      };
    });

    const prompt = `You are a Competitive Intelligence Analyst. 
I have extracted keyframes from a recent marketing video by ${competitorName}.
Analyze these visual frames and extract their current Go-To-Market strategy.
Focus on:
1. What new features or products are they highlighting?
2. What is the overarching marketing message?
3. What target audience are they trying to appeal to?

Provide a structured JSON output with these three keys. Do not include markdown blocks.`;

    const result = await model.generateContent([prompt, ...imageParts]);
    const responseText = result.response.text();
    
    return {
      status: 'success',
      keyframeCount: keyframes.length,
      analysis: JSON.parse(responseText)
    };
  } catch (error) {
    console.error(`[Video Ingestion] Failed:`, error);
    throw error;
  } finally {
    // Cleanup temporary frames
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
    }
  }
}
