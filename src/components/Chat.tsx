import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Send, User, Bot, Sparkles, Settings, History, Calendar, Settings2, Activity, Droplets, Loader2, ArrowLeft } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import { useFirebase } from '../contexts/FirebaseContext';
import { useActivePlot } from '../contexts/ActivePlotContext';
import { db, collection, query, where, getDocs } from '../firebase';

interface Message {
  role: 'user' | 'bot';
  content: string;
  actions?: { label: string; prompt: string }[];
}

export default function Chat() {
  const { user } = useFirebase();
  const { activePlotId, activePlot } = useActivePlot();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'bot',
      content: "Hello! I'm your botanical assistant. I have access to your garden data. You can ask me about your specific plants, care tips, or even upload a photo of a leaf that doesn't look quite right. How can I help your garden grow today?",
      actions: [
        { label: "Check struggling plants", prompt: "Which of my plants are currently struggling?" },
        { label: "Watering advice", prompt: "Give me a watering schedule for my garden." },
        { label: "Identify disease", prompt: "I think one of my plants is sick, can you help me identify the disease?" }
      ]
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Fetch the active plot's plants for context
      const q = query(collection(db, 'inhabitants'), where('ownerUid', '==', user?.uid));
      const snapshot = await getDocs(q);
      const allPlants = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as any));
      const plants = activePlotId ? allPlants.filter((p: any) => p.plotId === activePlotId) : allPlants;

      const plantContext = plants.map((p: any) => `${p.name} (${p.scientific || p.latinName || ''}) - Status: ${p.status}, Vigor: ${p.vigorIndex ?? 'unknown'}%`).join('\n');

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
      const prompt = `You are Botanist Sarah, a friendly and expert master gardener.
      You are helping a user with their garden.

      The user's currently active plot is "${activePlot?.name || 'their garden'}". Answer in the context of this plot unless they ask about another.

      User's Garden Data (active plot):
      ${plantContext || "No plants in the active plot yet."}
      
      User Question: "${text}"
      
      Provide a helpful, actionable, and friendly response. 
      If the user asks about a specific plant they have, use the data provided.
      At the end of your response, suggest 2-3 short follow-up actions in the format:
      ACTIONS: [Label 1 | Prompt 1], [Label 2 | Prompt 2]
      
      Keep the tone encouraging and expert.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });

      const fullText = response.text || "I'm sorry, I'm having trouble connecting to my botanical database right now.";
      
      // Parse actions
      const actionMatch = fullText.match(/ACTIONS: (.*)/);
      let cleanContent = fullText.replace(/ACTIONS: .*/, '').trim();
      let actions: { label: string; prompt: string }[] = [];

      if (actionMatch) {
        const actionStrings = actionMatch[1].split('], [');
        actions = actionStrings.map(s => {
          const parts = s.replace('[', '').replace(']', '').split(' | ');
          return { label: parts[0], prompt: parts[1] };
        });
      }

      setMessages(prev => [...prev, { role: 'bot', content: cleanContent, actions }]);
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: 'bot', content: "I encountered an error while processing your request. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row gap-8 mt-8 px-4 lg:px-8 max-w-5xl mx-auto h-[calc(100vh-12rem)]">
      {/* Sidebar / History (Visible on Desktop) */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 gap-6">
        <div className="p-6 bg-stone-50 rounded-3xl h-full flex flex-col shadow-2xl shadow-emerald-950/20">
          <div className="flex items-center gap-3 mb-8">
            <img 
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200" 
              alt="Botanist Sarah" 
              className="w-10 h-10 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <p className="font-headline font-bold text-emerald-800 text-sm">Botanist Sarah</p>
              <p className="text-[10px] text-stone-500 font-medium uppercase tracking-widest">Master Gardener</p>
            </div>
          </div>
          <nav className="space-y-1 overflow-y-auto hide-scrollbar">
            <p className="text-[11px] font-bold text-outline mb-3 ml-2 uppercase tracking-tighter">Recent Chats</p>
            <ChatHistoryItem label="Garden Overview" active />
            <ChatHistoryItem label="Plant Health Check" />
            <ChatHistoryItem label="Watering Schedule" />
          </nav>
          <div className="mt-auto pt-6 border-t border-outline-variant/10">
            <Link 
              to="/settings"
              className="w-full flex items-center gap-3 p-3 text-stone-600 hover:bg-emerald-50 rounded-xl transition-colors duration-200"
            >
              <Settings size={18} />
              <span className="text-sm font-medium">Settings</span>
            </Link>
          </div>
        </div>
      </aside>

      {/* Chat Interface */}
      <section className="flex-1 flex flex-col gap-6 overflow-hidden relative">
        {/* Chat Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-1 space-y-6 overflow-y-auto px-2 hide-scrollbar pb-32 pt-4"
        >
          {messages.map((msg, idx) => (
            <ChatMessage 
              key={idx} 
              role={msg.role} 
              content={msg.content} 
              actions={msg.actions}
              onActionClick={(prompt) => handleSendMessage(prompt)}
            />
          ))}
          {isLoading && (
            <div className="flex gap-4 items-start max-w-[85%]">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1">
                <Bot size={18} className="text-white" />
              </div>
              <div className="p-5 rounded-2xl bg-surface-container-low rounded-tl-none flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-primary" />
                <span className="text-sm text-on-surface-variant font-medium italic">Sarah is thinking...</span>
              </div>
            </div>
          )}
        </div>

        {/* Floating Message Input Field */}
        <div className="absolute bottom-6 left-0 right-0 px-2 z-40">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}
            className="bg-white/80 backdrop-blur-xl p-3 rounded-[2rem] shadow-2xl shadow-emerald-950/10 border border-outline-variant/20 flex items-center gap-2"
          >
            <button type="button" className="p-3 text-stone-500 hover:text-emerald-700 transition-colors">
              <Camera size={24} />
            </button>
            <input 
              className="flex-1 bg-transparent border-none focus:ring-0 text-on-surface placeholder:text-stone-400 font-medium" 
              placeholder="Ask Sarah about your garden..." 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

function ChatHistoryItem({ label, active = false }: { label: string, active?: boolean }) {
  return (
    <button className={cn(
      "w-full flex items-center gap-3 p-3 rounded-xl transition-colors duration-200 text-left",
      active ? "bg-emerald-800 text-white" : "text-stone-600 hover:bg-emerald-50"
    )}>
      <History size={16} className="shrink-0" />
      <span className="text-sm font-medium truncate">{label}</span>
    </button>
  );
}

function ChatMessage({ role, content, actions, onActionClick }: { 
  role: 'user' | 'bot', 
  content: string, 
  actions?: { label: string; prompt: string }[],
  onActionClick?: (prompt: string) => void
}) {
  const isBot = role === 'bot';
  return (
    <div className={cn("flex gap-4 items-start max-w-[85%]", !isBot && "ml-auto justify-end")}>
      {isBot && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-primary/20">
          <Bot size={18} className="text-white" />
        </div>
      )}
      <div className="flex flex-col gap-3">
        <div className={cn(
          "p-5 rounded-2xl space-y-4 shadow-sm",
          isBot ? "bg-surface-container-low rounded-tl-none border border-outline-variant/5" : "bg-primary text-white rounded-tr-none shadow-lg shadow-primary/10"
        )}>
          <p className="leading-relaxed text-sm whitespace-pre-wrap">{content}</p>
        </div>
        
        {isBot && actions && actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {actions.map((action, i) => (
              <button
                key={i}
                onClick={() => onActionClick?.(action.prompt)}
                className="px-4 py-2 bg-white border border-outline-variant/20 rounded-full text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95 flex items-center gap-2"
              >
                <Sparkles size={12} />
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {!isBot && (
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0 mt-1 shadow-lg shadow-secondary/20">
          <User size={18} className="text-white" />
        </div>
      )}
    </div>
  );
}
