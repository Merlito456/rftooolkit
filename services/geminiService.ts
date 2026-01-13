
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getRfAdvice = async (history: Message[]): Promise<{ text: string; sources?: any[] }> => {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Upgraded to Pro for high-quality grounding
      contents: history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      })),
      config: {
        systemInstruction: `You are an expert RF Engineer with access to real-time search. 
        When asked about frequency allocations, regulations, or local towers, use Google Search to provide current, real-world data.
        Always cite specific bands or regulatory bodies (FCC, OFCOM, ITU).`,
        tools: [{ googleSearch: {} }],
        temperature: 0.2, // Lower temperature for technical accuracy
      },
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    return { 
      text: response.text || "No response generated.",
      sources: groundingChunks 
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return { text: "Error connecting to the live RF Intelligence Core." };
  }
};
