

import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from '../types';

// FIX: Initialize the GoogleGenAI client using the API_KEY from environment variables as per the guidelines.
// The '!' non-null assertion is used to comply with the assumption that the key is always provided.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const RILANE_SYSTEM_PROMPT = "Você é Rilane, uma IA acolhedora que ajuda mulheres a reduzir ansiedade através do método 3XR (Reconhecer, Respirar, Redirecionar). Responda de forma empática e curta.";

export const getRilaneResponse = async (history: ChatMessage[], newPrompt: string): Promise<string> => {
  try {
    // The initial greeting message is for UI only and doesn't have a Firestore ID.
    // It shouldn't be part of the history sent to the model, as the API expects
    // the conversation to begin with a 'user' role.
    const filteredHistory = history.filter(msg => msg.id);

    const contents = filteredHistory.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: newPrompt }] });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: contents,
      config: {
        systemInstruction: RILANE_SYSTEM_PROMPT,
      }
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Desculpe, estou com um pouco de dificuldade para me conectar agora. Vamos tentar respirar fundo enquanto isso?";
  }
};

export const getDailyTip = async (): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Me dê uma dica rápida e acionável de autocuidado para mulheres com ansiedade, com no máximo 2 frases.",
        });
        return response.text;
    } catch (error) {
        console.error("Error fetching daily tip:", error);
        return "Hoje, seja gentil com você mesma. Pequenos atos de carinho fazem uma grande diferença.";
    }
}