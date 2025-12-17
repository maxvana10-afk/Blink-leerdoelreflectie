import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getReflectionCoaching = async (
  goal: string,
  field: string,
  input: string
): Promise<string> => {
  if (!input || input.length < 5) return "Schrijf eerst iets meer tekst, dan kan ik je helpen!";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Je bent een vriendelijke, bemoedigende leerkracht voor groep 8 (kinderen van 11-12 jaar).
        De leerling is bezig met een reflectie op het lesdoel: "${goal}".
        De leerling vult het onderdeel "${field}" in.
        De invoer van de leerling is: "${input}".

        Geef kort en positief feedback.
        Geef één tip hoe ze het antwoord nog specifieker kunnen maken of beter kunnen formuleren.
        Geef NIET het antwoord voor, maar stel een prikkelende vraag.
        Spreek de leerling aan met 'je'. Houd het kort (max 2-3 zinnen).
      `,
    });

    return response.text || "Ik kan even geen tip geven, maar ga zo door!";
  } catch (error) {
    console.error("Gemini error:", error);
    return "Het lukt even niet om de AI coach te bereiken. Ga gerust verder!";
  }
};
