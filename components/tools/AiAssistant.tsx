
import React, { useState, useRef, useEffect } from 'react';
import { Card } from '../common/Card';
import { getRfAdvice } from '../../services/geminiService';
import { Message } from '../../types';

export const AiAssistant: React.FC = () => {
  const [messages, setMessages] = useState<(Message & { sources?: any[] })[]>([
    { role: 'assistant', content: "Hello! I am the Live RF Intelligence Core. I can now search the web for real-world frequency auctions, tower maps, and FCC data. How can I assist you today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const { text, sources } = await getRfAdvice([...messages, userMessage]);
    setMessages(prev => [...prev, { role: 'assistant', content: text, sources }]);
    setIsLoading(false);
  };

  return (
    <Card title="Live Intelligence Core (Grounding Enabled)" className="flex flex-col h-[calc(100vh-10rem)] lg:h-[calc(100vh-12rem)] max-h-screen">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 px-1 lg:px-2 scrollbar-thin">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[90%] lg:max-w-[80%] px-4 py-3 rounded-2xl shadow-sm ${
              m.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-none border border-gray-200 dark:border-gray-600'
            }`}>
              <div className="text-[10px] font-bold mb-1 uppercase tracking-tighter opacity-70">
                {m.role === 'user' ? 'RF Engineer' : 'Live Core'}
              </div>
              <div className="prose prose-sm dark:prose-invert max-w-none text-sm">
                {m.content}
              </div>
              {m.sources && m.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <p className="text-[9px] font-bold text-gray-400 uppercase mb-1">Verified Sources:</p>
                  <div className="flex flex-wrap gap-2">
                    {m.sources.map((s: any, idx: number) => (
                      <a 
                        key={idx} 
                        href={s.web?.uri || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[10px] bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-700 text-blue-500 hover:underline"
                      >
                        {s.web?.title || 'External Reference'}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl flex items-center gap-2">
              <span className="text-xs text-gray-500 italic">Searching real-time data...</span>
              <div className="flex gap-1">
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-gray-200 dark:border-gray-700 pt-4">
        <input 
          type="text" 
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask about live FCC 600MHz auctions or local tower IDs..."
          className="flex-1 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
        />
        <button 
          type="submit"
          disabled={isLoading}
          className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          Query
        </button>
      </form>
    </Card>
  );
};
