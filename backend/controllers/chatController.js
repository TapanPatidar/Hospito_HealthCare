/**
 * Bilingual AI Assistant Controller (English & Hindi)
 * Path: backend/controllers/chatController.js
 */
const { GoogleGenAI } = require('@google/genai');

let geminiClient = null;
function getGeminiClient() {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// @desc    Bilingual Healthcare & Platform AI Chatbot
// @route   POST /api/chat
exports.handleChat = async (req, res) => {
  try {
    const { message, language = 'en', userRole = 'patient', userName = 'Patient' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const isHindi = language === 'hi' || /[\u0900-\u097F]/.test(message);

    const systemPrompt = `You are "Hospito AI Health & App Assistant" (हॉस्पिटो स्वास्थ्य एवं ऐप सहायक), an intelligent and compassionate healthcare interoperability guide.

Context:
- User Role: ${userRole}
- User Name: ${userName}
- Language: ${isHindi ? 'Hindi (हिंदी)' : 'English'}

Provide concise, friendly, and medically responsible guidance about using Hospito and common health queries. Include helpful formatting and reminders to consult a doctor.`;

    const ai = getGeminiClient();

    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.7-flash',
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Question:\n${message}` }],
            },
          ],
        });

        const reply = response.text || (isHindi ? 'नमस्ते! मैं आपकी किस प्रकार सहायता कर सकता हूँ?' : 'Hello! How can I assist you today?');
        return res.json({
          reply,
          language: isHindi ? 'hi' : 'en',
          source: 'gemini-3.7-flash',
        });
      } catch (genError) {
        console.warn('Gemini API call failed, using intelligent built-in medical KB fallback:', genError?.message);
      }
    }

    // Built-in intelligent fallback
    let fallbackReply = '';
    const q = message.toLowerCase();

    if (isHindi) {
      if (q.includes('उपयोग') || q.includes('use') || q.includes('kaise') || q.includes('चलाएं')) {
        fallbackReply = `🏥 **Hospito का उपयोग कैसे करें:**\n\n1. **मरीज़ (Patient):** आप अपनी दवाएं देख सकते हैं। अपना **Patient ID** कॉपी करके डॉक्टर को दें।\n2. **फार्मेसी स्टेटस:** डॉक्टर के पर्ची भेजते ही यह फार्मेसी चली जाती है। दवा तैयार होने पर स्थिति **"Fulfilled"** हो जाएगी।\n3. **दवा परामर्श:** किसी भी दवा के बारे में यहाँ पूछ सकते हैं!`;
      } else {
        fallbackReply = `नमस्ते ${userName}! 🙏 मैं **Hospito AI स्वास्थ्य सहायक** हूँ। मैं आपकी पर्ची देखने, Patient ID साझा करने और दवाओं की सामान्य जानकारी में सहायता कर सकता हूँ।`;
      }
    } else {
      if (q.includes('use') || q.includes('how to') || q.includes('patient id')) {
        fallbackReply = `🏥 **How to use Hospito:**\n\n1. **View Prescriptions:** Your dashboard displays all active orders with dosages and diagnosis in real time.\n2. **Share Patient ID:** Copy your unique ID from the top bar to provide to your physician.\n3. **Track Fulfillment:** Follow status updates as your chosen pharmacy prepares your medication.`;
      } else {
        fallbackReply = `Hello ${userName}! 👋 I am your **Hospito AI Health Assistant**. I can help you understand your prescriptions, dosage instructions, and navigate the platform in English and Hindi.`;
      }
    }

    res.json({
      reply: fallbackReply,
      language: isHindi ? 'hi' : 'en',
      source: 'hospito-clinical-engine',
    });
  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: 'Failed to process chat query' });
  }
};
