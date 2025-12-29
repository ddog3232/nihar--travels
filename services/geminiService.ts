import { GoogleGenAI } from "@google/genai";
import { TripPlanRequest } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const generateTripPlan = async (request: TripPlanRequest): Promise<string> => {
  const model = "gemini-2.5-flash";
  
  const prompt = `
    Act as a senior travel consultant for NIHAR Travels, a premium Indian travel agency.
    Create a summarized, engaging itinerary for a trip to ${request.destination}.
    
    Details:
    - Duration: ${request.days} days
    - Travelers: ${request.travelers}
    - Budget Style: ${request.budget}
    
    Format the response in clean Markdown.
    Include:
    1. A catchy title for the trip.
    2. A day-by-day highlight list (bullet points).
    3. One "Local Secret" tip specifically for Indian travelers (e.g., best place for chai, veg food options, or cultural connection).
    
    Keep the tone inspiring, professional, and warm. Limit to 300 words.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 } // Disable thinking for faster response on flash model
      }
    });

    return response.text || "Sorry, I couldn't generate a plan right now. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to generate trip plan.");
  }
};
