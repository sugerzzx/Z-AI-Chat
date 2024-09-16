import { GoogleGenerativeAI } from "@google/generative-ai";

export const googleGenAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_API_KEY!); // API key is required
