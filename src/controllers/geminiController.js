require('dotenv').config();

let aiInstance = null;

const initGenAI = async () => {
  if (aiInstance) return aiInstance;
  const { GoogleGenAI } = await import("@google/genai");
  aiInstance = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
  return aiInstance;
};

const llmRun = async (prompt) => {
  const maxRetries = 3;
  const models = ["gemini-3-pro-preview", "gemini-2.5-flash"];

  for (const model of models) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const ai = await initGenAI();
        const response = await ai.models.generateContent({
          model,
          contents: prompt,
        });

        // newer SDK responses usually have response.text()
        const text = response.text || response.response?.text?.() || "";
        console.log(`✅ Model "${model}" succeeded on attempt ${attempt}`);
        return text;

      } catch (error) {
        const message = error?.message || JSON.stringify(error);
        const isOverload = message.includes("503") || message.includes("overloaded");

        if (isOverload && attempt < maxRetries) {
          console.warn(`⚠️ ${model} overloaded, retrying in 3s... (Attempt ${attempt}/${maxRetries})`);
          await new Promise(res => setTimeout(res, 3000));
        } else if (isOverload && model !== models[models.length - 1]) {
          console.warn(`⚠️ ${model} too busy, switching to fallback model...`);
          break; // go to next model
        } else {
          console.error(`❌ Model ${model} failed:`, message);
          return null;
        }
      }
    }
  }

  console.error("❌ All model attempts failed after retries.");
  return null;
};

module.exports = llmRun;
