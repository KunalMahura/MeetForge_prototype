import { GoogleGenAI } from '@google/genai';

export const generateAIResponse = async (req, res) => {
  try {
    const { messages, currentCode, language } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    
    const systemPrompt = `You are an expert coding mentor assisting a user in a 1-on-1 coding practice room.
You should be helpful, encouraging, and concise.

Current Editor State (${language}):
\`\`\`${language}
${currentCode}
\`\`\`

The user will ask you a question. Please respond accordingly based on the code provided. Use markdown for code snippets.`;

    let fullPrompt = systemPrompt + "\n\nChat History:\n";
    if (messages && messages.length > 0) {
      messages.forEach(msg => {
        fullPrompt += `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}\n`;
      });
    } else {
      fullPrompt += "User: Hello!\n";
    }
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });
    
    res.status(200).json({ success: true, text: response.text });
  } catch (error) {
    console.error('AI error:', error);
    res.status(500).json({ error: 'Failed to generate response. Check API key and configuration.' });
  }
};
