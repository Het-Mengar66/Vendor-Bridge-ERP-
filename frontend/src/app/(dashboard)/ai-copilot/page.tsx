"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, FileText, User, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AICopilotPage() {
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", content: "Hello! I am your AI Procurement Copilot. I can help you analyze vendor performance, draft rejection emails, compare quotations, or summarize spend data. How can I assist you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  const suggestedPrompts = [
    "Compare the last 3 quotations for the Q3 Laptops RFQ",
    "Draft a polite rejection email to Global IT Suppliers",
    "Summarize our hardware spend for this quarter",
    "Identify the vendor with the highest rating for Office Supplies"
  ];

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMessages = [...messages, { id: Date.now(), role: "user", content: input }];
    setMessages(newMessages);
    setInput("");
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      setMessages([...newMessages, { 
        id: Date.now() + 1, 
        role: "assistant", 
        content: "I've received your request! Currently, my integration to the Gemini AI API is being finalized. Once the API key is connected, I will provide full analytical and drafting capabilities." 
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="max-w-5xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-6 rounded-2xl border border-indigo-500/20 shadow-sm backdrop-blur-md shrink-0">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 animate-pulse" />
            <Bot className="h-6 w-6 text-indigo-400 relative z-10" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              Procurement Copilot <Sparkles className="w-4 h-4 text-amber-400" />
            </h1>
            <p className="text-sm text-muted-foreground mt-1">Powered by AI to accelerate your workflows.</p>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-panel rounded-2xl border border-border flex flex-col overflow-hidden relative">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-4 max-w-[85%] ${msg.role === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/20'}`}>
                  {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                </div>
                <div className={`p-4 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-sm' : 'bg-secondary/50 text-foreground rounded-tl-sm border border-border'}`}>
                  <p className="text-sm leading-relaxed">{msg.content}</p>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4 max-w-[85%]"
              >
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-indigo-500/20 text-indigo-400 border border-indigo-500/20">
                  <Bot size={16} />
                </div>
                <div className="p-4 rounded-2xl bg-secondary/50 text-foreground rounded-tl-sm border border-border flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={endOfMessagesRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-card border-t border-border">
          {messages.length === 1 && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 ml-1">Suggested Prompts</p>
              <div className="flex flex-wrap gap-2">
                {suggestedPrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => handlePromptClick(prompt)}
                    className="text-xs bg-secondary hover:bg-secondary/80 text-foreground px-3 py-1.5 rounded-full border border-border transition-colors flex items-center"
                  >
                    {prompt} <ChevronRight size={12} className="ml-1 opacity-50" />
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <div className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask the copilot anything..."
              className="w-full pl-4 pr-12 py-4 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 shadow-sm transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-center text-muted-foreground mt-3">
            AI Copilot can make mistakes. Always verify critical procurement decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
