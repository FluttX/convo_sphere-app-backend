import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateDailyQuestion = async (): Promise<string> => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {role: 'user',content: 'Generate a fun and engaging daily question for a chat conversation. No need to any any extra text.'}
            ],
            max_tokens: 50,
        });
        
        return response.choices[0]?.message?.content?.trim() || "What's your favorite color?";

    } catch (err) {
        console.error("Error generating daily questions:", err);
        return "What's your favorite hobby?";
    }
}