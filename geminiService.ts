import { GoogleGenAI, Type } from "@google/genai";
import { SARData } from "./types";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;

export async function analyzeSARData(): Promise<SARData> {
  if (!apiKey) {
    throw new Error("Gemini API key not found. Please set VITE_GEMINI_API_KEY in your environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `You are NISAR SAR analyzer. Generate random SAR data:
   soil_moisture: 20-80%, deformation: 0-0.5m, 
   vibration: 3-9, region: Tamil Nadu districts.
   Predict: earthquake/landslide/flood/normal.
   Risk: low/medium/high.
   Return JSON only:
   {soil_moisture, deformation, vibration, 
    region, disaster_type, risk, 
    people_affected, safety_action}`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          soil_moisture: { type: Type.STRING },
          deformation: { type: Type.STRING },
          vibration: { type: Type.STRING },
          region: { type: Type.STRING },
          disaster_type: { type: Type.STRING },
          risk: { type: Type.STRING },
          people_affected: { type: Type.NUMBER },
          safety_action: { type: Type.STRING },
        },
        required: ["soil_moisture", "deformation", "vibration", "region", "disaster_type", "risk", "people_affected", "safety_action"]
      }
    }
  });

  return JSON.parse(response.text) as SARData;
}
