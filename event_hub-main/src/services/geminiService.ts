import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateEventDescription(title: string, category: string, location: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a compelling and professional event description for an event titled "${title}". 
      Category: ${category}. 
      Location: ${location}. 
      The description should be around 150-200 words and formatted in Markdown.`,
    });
    return response.text || "Failed to generate description.";
  } catch (error) {
    console.error("Error generating description:", error);
    return "Error generating description. Please try again.";
  }
}

export async function suggestEventIdeas(topic: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest 3 creative event ideas related to "${topic}". 
      For each idea, provide a title, a brief concept, and a target audience. 
      Return the response as a JSON array of objects with keys: title, concept, targetAudience.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error suggesting ideas:", error);
    return [];
  }
}
