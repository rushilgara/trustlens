import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Loader2, ArrowLeft, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const FinSage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm FinSage, your friendly financial advisor. I'm here to help you with questions about personal finance, savings, investments, loans, financial safety, and more. What would you like to know?"
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('finsage-chat', {
        body: { messages: newMessages }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.reply
      };
      setMessages([...newMessages, assistantMessage]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment."
      };
      setMessages([...newMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col hero-gradient">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-accent-cyan/20 backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity shrink-0">
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-accent-cyan" />
              <span className="text-xs sm:text-sm text-muted-foreground hidden sm:inline">Back to Home</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6 text-accent-cyan animate-pulse-glow" />
              <h1 className="text-xl sm:text-2xl font-bold gradient-text">FinSage</h1>
            </div>
            <div className="w-16 sm:w-24" /> {/* Spacer for center alignment */}
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-4xl">
          <AnimatePresence>
            {messages.map((message, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`mb-6 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[90%] sm:max-w-[80%] p-3 sm:p-4 rounded-2xl ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-accent-cyan/20 to-accent-emerald/20 ml-auto"
                      : "glass-card"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-cyan to-accent-emerald flex items-center justify-center">
                        <Sparkles className="w-4 h-4 text-background" />
                      </div>
                      <span className="font-semibold text-sm text-accent-cyan">FinSage</span>
                    </div>
                  )}
                  <p className="text-foreground whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start mb-6"
            >
              <div className="glass-card max-w-[80%] p-4 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-cyan to-accent-emerald flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-background" />
                  </div>
                  <span className="font-semibold text-sm text-accent-cyan">FinSage</span>
                </div>
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-accent-cyan" />
                  <span className="text-muted-foreground">Thinking...</span>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 border-t border-accent-cyan/20 glass backdrop-blur-xl">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 max-w-4xl">
          <div className="flex gap-2 sm:gap-3">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Ask about finances..."
              className="glass border-accent-cyan/30 focus:border-accent-cyan flex-1 text-sm sm:text-base"
              disabled={loading}
            />
            <Button
              onClick={handleSend}
              disabled={loading || !input.trim()}
              variant="premium"
              size="lg"
              className="px-4 sm:px-6 shrink-0"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
              ) : (
                <Send className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </Button>
          </div>
          <p className="text-center text-[10px] sm:text-xs text-muted-foreground mt-2 sm:mt-3">
            Powered by TrustLens AI & OpenAI GPT
          </p>
        </div>
      </div>
    </div>
  );
};

export default FinSage;
