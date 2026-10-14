import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Sparkles, Send, Bot, User, Volume2, VolumeX, HelpCircle, ArrowRight, ShieldCheck, Cpu } from 'lucide-react';

interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  time: string;
}

export const AIAdvisorTab: React.FC = () => {
  const { user, awardPoints } = useApp();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'E nle o! I am your Idanre & Ifedore AI Community Guide. Ask me anything about cocoa farming, tourism at Oke Idanre Hills, artisan grants, tech mentorship, or local emergency services!',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const quickPrompts = [
    'How do I apply for agricultural & cocoa grants in Ifedore?',
    'Tell me about the history of the 682 steps of Oke Idanre',
    'How can youth register their technical or artisan skills?',
    'What are the primary emergency security numbers in Idanre?',
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessages: ChatMessage[] = [
      ...messages,
      { role: 'user', text: query, time: userTime },
    ];

    setMessages(newMessages);
    if (!textToSend) setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/ai-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: query,
          history: messages.map(m => ({ role: m.role, text: m.text })),
        }),
      });

      const data = await response.json();
      const modelTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      if (data.success && data.answer) {
        setMessages([
          ...newMessages,
          { role: 'model', text: data.answer, time: modelTime },
        ]);
        awardPoints(5, 'Asked AI Community Guide!');
      } else {
        throw new Error('Failed to get answer');
      }
    } catch (err) {
      console.error(err);
      const modelTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setMessages([
        ...newMessages,
        {
          role: 'model',
          text: 'E nle! Our community network is buzzing right now. Please try again or check our discussion boards for direct community support.',
          time: modelTime,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const speakText = (text: string, index: number) => {
    if (!('speechSynthesis' in window)) {
      setToastMessage('Speech synthesis audio is not supported in this browser.');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    if (isSpeaking === index) {
      window.speechSynthesis.cancel();
      setIsSpeaking(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);

    setIsSpeaking(index);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-stone-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 animate-in fade-in">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-teal-900 to-green-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-300 bg-emerald-950/80 px-3 py-1.5 rounded-full border border-emerald-800/60">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Gemini AI Powered Community Assistant
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Idanre & Ifedore AI Guide
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base max-w-2xl leading-relaxed">
              Your intelligent conversational assistant for local agriculture, tourism, youth skill grants, and civic assistance. Ask questions anytime in English or Yoruba!
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/20 flex items-center gap-3 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/30 flex items-center justify-center">
              <Bot className="w-7 h-7 text-amber-400" />
            </div>
            <div>
              <div className="text-xs text-emerald-200 font-medium">AI Assistant Status</div>
              <div className="text-sm font-bold text-white flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                Online & Ready
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Prompt Chips */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-emerald-600" />
          Frequently Asked Questions & Quick Prompts
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-left text-xs sm:text-sm font-medium text-stone-700 bg-stone-50 hover:bg-emerald-50 hover:text-emerald-900 p-3 rounded-xl border border-stone-200 hover:border-emerald-300 transition-all flex items-center justify-between group"
            >
              <span>{prompt}</span>
              <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-emerald-600 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm flex flex-col h-[520px]">
        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-stone-900 text-white font-bold text-xs'
                    : 'bg-emerald-800 text-amber-300 shadow-sm'
                }`}
              >
                {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              <div
                className={`max-w-[80%] sm:max-w-[70%] rounded-2xl p-4 shadow-xs text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-stone-900 text-white rounded-tr-none'
                    : 'bg-stone-100 text-stone-800 rounded-tl-none border border-stone-200/60'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                <div
                  className={`mt-2 flex items-center justify-between text-[10px] ${
                    msg.role === 'user' ? 'text-stone-400' : 'text-stone-500'
                  }`}
                >
                  <span>{msg.time}</span>
                  {msg.role === 'model' && (
                    <button
                      onClick={() => speakText(msg.text, index)}
                      className="flex items-center gap-1 hover:text-emerald-700 font-medium transition-colors bg-white px-2 py-0.5 rounded-md border border-stone-200 shadow-2xs"
                    >
                      {isSpeaking === index ? (
                        <>
                          <VolumeX className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
                          <span>Stop Audio</span>
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Listen Voice</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center shrink-0 shadow-sm">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-stone-100 border border-stone-200 rounded-2xl rounded-tl-none p-4 text-stone-500 text-sm flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-emerald-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="text-xs ml-1 font-medium">Idanre AI is consulting local knowledge bases...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 rounded-b-3xl">
          <form
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder="Ask about Idanre tourism, cocoa farming, youth grants, or emergency contacts..."
              className="flex-1 min-h-[48px] px-4 py-3 bg-white border border-stone-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent text-stone-900 shadow-2xs"
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="min-h-[48px] px-6 bg-emerald-800 hover:bg-emerald-900 disabled:bg-stone-300 text-white rounded-xl font-semibold text-sm flex items-center gap-2 transition-colors shadow-sm cursor-pointer disabled:cursor-not-allowed shrink-0"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
