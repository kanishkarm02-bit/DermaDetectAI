import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is missing");
    throw new Error("API key is missing. Please check your configuration.");
  }
  return new GoogleGenAI({ apiKey });
};

export interface AnalysisResult {
  condition: string;
  riskLevel: "Low" | "Medium" | "High";
  description: string;
  recommendation: string;
  disclaimer: string;
}

export async function analyzeSkinImage(base64Image: string, bodyPart: string): Promise<AnalysisResult> {
  try {
    const ai = getAiClient();
    // Remove data URL prefix if present
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const model = "gemini-2.5-flash-image";
    const prompt = `
      You are an expert dermatologist assistant AI. 
      Analyze the provided image of a user's ${bodyPart}. 
      
      1. First, check if the image contains skin or a visible skin condition. If not, return a JSON with "condition": "Not a skin image", "riskLevel": "Low", "description": "Please upload a clear photo of skin.", "recommendation": "Try again."
      
      2. If it is skin, identify the most likely condition (e.g., Eczema, Acne, Melanoma, Psoriasis, Benign Mole, etc.).
      
      3. Assess the risk level (Low, Medium, High).
         - Low: Cosmetic or minor (e.g., mild acne, dry skin).
         - Medium: Requires attention (e.g., potential infection, unknown rash).
         - High: Urgent (e.g., signs of melanoma, severe infection).
      
      4. Provide a description of the visual symptoms you see (e.g., "Redness", "Irregular borders", "Pustules").
      
      5. Provide a recommendation (e.g., "Monitor for changes", "Consult a dermatologist", "Apply moisturizer").
      
      Return ONLY valid JSON in this format:
      {
        "condition": "Condition Name",
        "riskLevel": "Low/Medium/High",
        "description": "Brief description of visual findings.",
        "recommendation": "Actionable advice.",
        "disclaimer": "This is an AI prototype and not a medical diagnosis. Consult a professional."
      }
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          { text: prompt + "\nReturn ONLY raw JSON. Do not use Markdown code blocks." },
        ],
      },
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");

    // Clean up markdown if present
    text = text.replace(/```json\n?|\n?```/g, "").trim();

    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Analysis failed:", error);
    if (error instanceof Error && error.message.includes("fetch")) {
      throw new Error("Network error. Please check your connection.");
    }
    throw new Error("Failed to analyze image. Please try again.");
  }
}

export async function verifyHuman(base64Image: string): Promise<{ isHuman: boolean; reason: string }> {
  try {
    const ai = getAiClient();
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          { text: "Analyze this image. Is this a real human face? Return ONLY a raw JSON object with 'isHuman' (boolean) and 'reason' (string). Do not use Markdown code blocks." }
        ]
      },
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");
    
    // Clean up markdown if present
    text = text.replace(/```json\n?|\n?```/g, "").trim();

    return JSON.parse(text);
  } catch (error) {
    console.error("Verification failed:", error);
    // Return a default failure instead of throwing to avoid crashing the UI flow completely if parsing fails
    return { isHuman: false, reason: "Verification failed due to technical error." };
  }
}

export async function getWeatherTips(city: string, weatherDescription: string, temperature: string): Promise<string> {
  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: {
        parts: [
          { text: `The user is in ${city}. The weather is ${weatherDescription} and the temperature is ${temperature}. Provide a short, actionable skin care tip (max 2 sentences) relevant to this weather.` }
        ]
      }
    });

    return response.text || "Stay hydrated and wear sunscreen!";
  } catch (error) {
    console.error("Tips generation failed:", error);
    return "Remember to take care of your skin today!";
  }
}
