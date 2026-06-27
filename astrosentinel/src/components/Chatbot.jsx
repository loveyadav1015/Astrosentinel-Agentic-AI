import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import axios from 'axios';


const API_BASE_URL = 'http://localhost:5000';

export default function Chatbot({ neoData }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch chat history
  useEffect(() => {
    if (isOpen) {
      axios.get(`${API_BASE_URL}/api/chat`)
        .then(response => {
          setMessages(response.data.length > 0 ? response.data : [
            { role: 'assistant', text: "Hello! I am your AstroSentinel AI. Ask me about today's tracking data." }
          ]);
        })
        .catch(err => console.error("Error loading history:", err));
    }
  }, [isOpen]);

  // NEW: Clear Chat Handler
  const handleClearChat = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/api/chat`);
      setMessages([{ role: 'assistant', text: "History cleared. Monitoring active." }]);
    } catch (error) {
      console.error("Failed to clear chat:", error);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userText = input;
    setInput('');
    setLoading(true);

    try {
      // Send message to your RAG-enabled backend
      const res = await axios.post(`${API_BASE_URL}/api/chat`, { role: 'user', text: userText });
      
      // Update UI with both the user message and the AI response
      setMessages(prev => [...prev, { role: 'user', text: userText }, res.data]);
    } catch (error) {
      console.error("AI Communication Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="p-4 bg-blue-600 rounded-full text-white shadow-lg shadow-blue-500/30">
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="w-80 h-96 bg-[#0a1128]/95 backdrop-blur-md border border-slate-700/80 rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header with Clear Button */}
          <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-[#040814]">
            <span className="font-bold text-sm tracking-wide text-slate-200">ASTROSENTINEL AI</span>
            <div className="flex items-center gap-3">
              <button onClick={handleClearChat} className="text-[10px] text-red-400 hover:text-red-300">Clear</button>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-2.5 rounded-lg ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-3 border-t border-slate-700 bg-[#040814] flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-white"
            />
            <button type="submit" disabled={loading} className="p-1.5 bg-blue-600 rounded text-white">
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}