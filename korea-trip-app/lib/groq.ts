import Groq from "groq-sdk";

let _groq: Groq | null = null;

export function getGroqClient(): Groq {
  if (!_groq) {
    _groq = new Groq({ apiKey: process.env.GROQ_API_KEY ?? "placeholder" });
  }
  return _groq;
}

export const MODEL = "llama-3.3-70b-versatile";
