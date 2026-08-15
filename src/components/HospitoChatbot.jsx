import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  X, 
  Sparkles, 
  Bot, 
  User, 
  Languages, 
  Volume2, 
  RotateCcw, 
  Check, 
  ChevronDown, 
  HeartPulse, 
  HelpCircle,
  Pill,
  Clock,
  ShieldAlert
} from 'lucide-react';
import { api } from '../api/client.js';

export const HospitoChatbot = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      sender: 'bot',
      text: `Hello! 👋 I'm your **Hospito Health Assistant**.\n\nI can help you understand how to use your Patient Portal, copy your Patient ID, track your medication status, or answer basic health & medicine questions in **English** or **हिंदी (Hindi)**.\n\nHow can I help you today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'hospito-assistant'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Suggested Prompts based on Language & User Role
  const suggestedPrompts = language === 'hi' 
    ? [
        'Hospito का उपयोग कैसे करें?',
        'दवाइयां कब और कैसे लेनी चाहिए?',
        'मेरा Patient ID डॉक्टर को कैसे दें?',
        'फार्मेसी से दवा कब मिलेगी?'
      ]
    : [
        'How do I use my Patient ID?',
        'When will my pharmacy fulfill my prescription?',
        'Common guidance on Metformin & Paracetamol',
        'How does doctor e-prescribing work?'
      ];

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputMessage;
    if (!text.trim()) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage('');
    setIsTyping(true);

    try {
      const res = await api.chat({
        message: text.trim(),
        language,
        userRole: user?.role || 'patient',
        userName: user?.name || 'Guest User'
      });

      const botReply = {
        id: `reply-${Date.now()}`,
        sender: 'bot',
        text: res.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: res.source
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'bot',
          text: language === 'hi'
            ? 'माफ़ कीजिये, अभी संपर्क करने में समस्या आ रही है। कृपया थोड़ी देर बाद पुनः प्रयास करें।'
            : 'Sorry, I encountered a temporary connection error. Please try asking again in a moment.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleToggleLanguage = () => {
    const newLang = language === 'en' ? 'hi' : 'en';
    setLanguage(newLang);
    setMessages((prev) => [
      ...prev,
      {
        id: `lang-switch-${Date.now()}`,
        sender: 'bot',
        text: newLang === 'hi'
          ? '🇮🇳 भाषा **हिंदी (Hindi)** में बदल दी गई है। आप मुझसे हिंदी में स्वास्थ्य या ऐप से जुड़े सवाल पूछ सकते हैं!'
          : '🌐 Language switched to **English**. Ask any question about medications or the Hospito platform!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      
      {/* Floating Chat Trigger Bubble */}
      {!isOpen && (
        <motion.button
          id="btn-open-chatbot"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="flex items-center space-x-2.5 px-5 py-3.5 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white rounded-full shadow-2xl shadow-blue-900/30 border-2 border-white/80 cursor-pointer group"
        >
          <div className="relative">
            <Bot className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-teal-600 animate-pulse" />
          </div>
          <span className="text-xs font-black tracking-wide">
            {language === 'hi' ? 'स्वास्थ्य सहायक (AI Chat)' : 'AI Health & App Guide'}
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-white/20 uppercase">
            {language === 'hi' ? 'हिंदी' : 'EN'}
          </span>
        </motion.button>
      )}

      {/* Expanded Interactive Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="hospito-chatbot-modal"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="w-[92vw] sm:w-[420px] h-[580px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden backdrop-blur-xl"
          >
            
            {/* Header */}
            <div className="px-5 py-4 bg-gradient-to-r from-teal-700 via-blue-700 to-indigo-800 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-white/15 backdrop-blur-md flex items-center justify-center font-bold border border-white/20">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="text-sm font-black tracking-tight">Hospito Health AI</h3>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="text-[10px] text-teal-100/80 font-medium">
                    {language === 'hi' ? 'द्विभाषी स्वास्थ्य एवं ऐप गाइड' : 'Bilingual Clinical & App Assistant'}
                  </p>
                </div>
              </div>

              {/* Language Switch & Close */}
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={handleToggleLanguage}
                  title="Switch Language / भाषा बदलें"
                  className="px-2.5 py-1 rounded-xl bg-white/15 hover:bg-white/25 text-white text-[11px] font-bold border border-white/20 transition-all cursor-pointer flex items-center space-x-1"
                >
                  <Languages className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'हिंदी' : 'English'}</span>
                </button>

                <button
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Safety Banner */}
            <div className="px-4 py-2 bg-amber-50/90 border-b border-amber-200/80 text-[10px] text-amber-900 font-semibold flex items-center space-x-1.5">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span>
                {language === 'hi'
                  ? 'यह AI सहायक मार्गदर्शन के लिए है। कृपया डॉक्टर की पर्ची का पूर्ण पालन करें।'
                  : 'For informational guidance. Always follow your physician’s exact prescription.'}
              </span>
            </div>

            {/* Chat Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/60">
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs shadow-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-tr-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                    }`}
                  >
                    {/* Message Header */}
                    <div className="flex items-center justify-between text-[10px] mb-1 opacity-70">
                      <span className="font-bold">
                        {msg.sender === 'user' ? (user?.name || 'You') : 'Hospito Assistant'}
                      </span>
                      <span>{msg.timestamp}</span>
                    </div>

                    {/* Text formatted */}
                    <div className="whitespace-pre-line text-xs">
                      {msg.text}
                    </div>

                    {msg.source && (
                      <div className="mt-2 pt-1 border-t border-slate-100 text-[9px] text-slate-400 font-semibold flex items-center justify-between">
                        <span>Source: {msg.source}</span>
                        <span className="text-teal-600 font-bold">Verified Medical KB</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-xs flex items-center space-x-1.5 text-xs text-slate-500">
                    <Sparkles className="w-3.5 h-3.5 text-teal-600 animate-spin" />
                    <span>{language === 'hi' ? 'सहायक विचार कर रहा है...' : 'Assistant is replying...'}</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Prompts Row */}
            <div className="p-2.5 bg-white border-t border-slate-100 flex items-center space-x-1.5 overflow-x-auto no-scrollbar">
              <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap pl-1">
                {language === 'hi' ? 'सुझाव:' : 'Quick:'}
              </span>
              {suggestedPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-teal-50 hover:text-teal-800 text-[10.5px] font-semibold text-slate-600 whitespace-nowrap border border-slate-200 transition-all cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-slate-200 flex items-center space-x-2"
            >
              <input
                id="chatbot-input-field"
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={language === 'hi' ? 'अपना प्रश्न यहाँ लिखें (हिंदी / English)...' : 'Ask about prescriptions, medicines, portal...'}
                className="flex-1 px-4 py-2.5 bg-slate-100 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 border border-transparent focus:border-teal-400"
              />
              <button
                id="btn-send-chat"
                type="submit"
                disabled={!inputMessage.trim() || isTyping}
                className="w-10 h-10 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white flex items-center justify-center shadow-md transition-all cursor-pointer active:scale-95 shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};
