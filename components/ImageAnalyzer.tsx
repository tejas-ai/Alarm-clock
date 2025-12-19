
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

const ImageAnalyzer: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);
    setAnalysis("Analyzing your image...");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = image.split(',')[1];
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: [
          {
            parts: [
              { text: "Analyze this image and provide a brief, helpful insight. If it's related to sleep environment or wellness, provide actionable advice." },
              { inlineData: { mimeType: "image/jpeg", data: base64Data } }
            ]
          }
        ]
      });

      setAnalysis(response.text || "I couldn't generate an analysis for this image.");
    } catch (error) {
      console.error("Analysis error:", error);
      setAnalysis("Error analyzing image. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="neu-outset rounded-[24px] p-6 flex flex-col items-center gap-6">
        <h2 className="text-lg font-black text-[#31456a] uppercase tracking-widest">Image Analysis</h2>
        
        <div 
          className="w-full h-48 rounded-2xl neu-inset flex items-center justify-center overflow-hidden relative cursor-pointer group"
          onClick={() => document.getElementById('image-upload')?.click()}
        >
          {image ? (
            <img src={image} alt="Upload" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          ) : (
            <div className="flex flex-col items-center text-[#31456a]/30">
              <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs font-bold uppercase tracking-widest">Tap to Upload</span>
            </div>
          )}
          <input 
            id="image-upload"
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            className="hidden" 
          />
        </div>

        <button
          onClick={analyzeImage}
          disabled={!image || loading}
          className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all ${
            !image || loading 
            ? 'opacity-50 cursor-not-allowed neu-inset' 
            : 'neu-outset neu-button active:neu-pressed text-[#31456a]'
          }`}
        >
          {loading ? 'Analyzing...' : 'Analyze with Gemini'}
        </button>
      </div>

      {analysis && (
        <div className="neu-outset rounded-[24px] p-6 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 mb-3">
             <div className="w-2 h-2 rounded-full bg-[#31456a] animate-pulse" />
             <span className="text-xs font-black text-[#31456a] uppercase tracking-widest">Lumina Insight</span>
          </div>
          <p className="text-sm leading-relaxed text-[#31456a]/80 font-medium italic">
            {analysis}
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;
