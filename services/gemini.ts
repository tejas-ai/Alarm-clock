
import { GoogleGenAI, Type } from "@google/genai";

// Fix: Use process.env.API_KEY directly according to @google/genai coding guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSleepInsight = async (sleepData: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following sleep summary and provide a concise, expert, friendly 2-sentence advice for better rest. Sleep Data: ${sleepData}`,
      config: {
        // Fix: maxOutputTokens removed to avoid blocking response if thinking is used, as thinkingBudget isn't specified
        temperature: 0.7,
      }
    });
    // Fix: Access .text property directly (not a method)
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Sleep is the foundation of health. Ensure your room is cool and dark for optimal recovery.";
  }
};

export const suggestWakeUpTime = async (bedTime: string) => {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Given a bedtime of ${bedTime}, suggest the absolute optimal wake-up time based on 90-minute sleep cycles (aiming for 5 or 6 cycles). Return only the suggested time in 24h format.`,
        config: {
          // Fix: maxOutputTokens removed to follow guidelines
          temperature: 0.1,
        }
      });
      // Fix: Access .text property directly
      return response.text?.trim() || "07:00";
    } catch (error) {
      return "07:30";
    }
};
