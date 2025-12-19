
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getSleepInsight = async (sleepData: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the following sleep summary and provide a concise, expert, friendly 2-sentence advice for better rest. Sleep Data: ${sleepData}`,
      config: {
        temperature: 0.7,
      }
    });
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
          temperature: 0.1,
        }
      });
      return response.text?.trim() || "07:00";
    } catch (error) {
      return "07:30";
    }
};

export const breakdownTask = async (task: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Break down this task into 3 extremely actionable sub-tasks for someone who is procrastinating. Task: "${task}". Format as a short bulleted list.`,
      config: {
        temperature: 0.6,
      }
    });
    return response.text;
  } catch (error) {
    return "1. Take a deep breath.\n2. Do the smallest possible step.\n3. Focus for 5 minutes.";
  }
};
