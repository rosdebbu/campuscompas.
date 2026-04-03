import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

const ChatIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2V10a2 2 0 012-2h8z" />
    </svg>
);
const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const SendIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.428A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
    </svg>
);
const CompassIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
    </svg>
);


interface Message {
    text: string;
    sender: 'user' | 'ai';
}

const MarkdownRenderer: React.FC<{ text: string }> = ({ text }) => {
    const lines = text.split('\n');

    const renderSegment = (segment: string, key: string | number) => {
        const parts = segment.split(/(\*\*.*?\*\*|\*.*?\*)/g).filter(Boolean);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={`${key}-${index}`}>{part.slice(2, -2)}</strong>;
            }
            if (part.startsWith('*') && part.endsWith('*')) {
                return <em key={`${key}-${index}`}>{part.slice(1, -1)}</em>;
            }
            return <span key={`${key}-${index}`}>{part}</span>;
        });
    };

    return (
        <div>
            {lines.map((line, i) => {
                if (line.trim().startsWith('- ')) {
                    return <div key={i} className="flex"><span className="mr-2">•</span><span>{renderSegment(line.trim().substring(2), i)}</span></div>
                }
                return <p key={i}>{renderSegment(line, i)}</p>;
            })}
        </div>
    );
};


const AIChatbot: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showStarters, setShowStarters] = useState(true);
    const chatBoxRef = useRef<HTMLDivElement>(null);

     const conversationStarters = [
        "What events are happening this week?",
        "Where is the Tech Park?",
        "Tell me about the campus library.",
    ];

    useEffect(() => {
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [messages, isLoading]);
    
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ sender: 'ai', text: "Hi! I'm Campus Compass, your AI guide for SRMIST. How can I help you today?" }]);
            setShowStarters(true);
        }
    }, [isOpen]);

    const callGeminiAPI = async (prompt: string, currentMessages: Message[]) => {
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction: "You are 'Campus Compass', a friendly and knowledgeable AI assistant for the SRMIST Potheri campus. Your purpose is to provide concise, accurate, and helpful information to students. When asked about locations, provide a brief description and mention nearby landmarks. For events, give the key details: name, date, time, and location. For facilities, describe what they offer. Always use basic markdown for formatting lists (using '- '), bold text (using '**'), and italics (using '*') to improve readability."
                }
            });

            setMessages([...currentMessages, { text: response.text, sender: 'ai' }]);
        } catch (error) {
            console.error("Error calling Gemini API:", error);
            setMessages([...currentMessages, { text: "Sorry, I'm having trouble connecting right now. Please try again later.", sender: 'ai' }]);
        } finally {
            setIsLoading(false);
        }
    };
    
    const submitQuery = (text: string) => {
        if (!text || isLoading) return;
        const newMessages: Message[] = [...messages, { text, sender: 'user' }];
        setMessages(newMessages);
        setShowStarters(false);
        setIsLoading(true);
        callGeminiAPI(text, newMessages);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        submitQuery(userInput.trim());
        setUserInput('');
    };

    const handleStarterClick = (prompt: string) => {
        submitQuery(prompt);
    };

    return (
        <>
            {/* Floating Action Button */}
            <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 transform hover:scale-110 border-2 border-white/20 dark:border-slate-700/50"
                    aria-label="Open AI Chatbot"
                >
                    {isOpen ? <CloseIcon /> : <ChatIcon />}
                </button>
            </div>

            {/* Chatbot Window */}
            {isOpen && (
                <div className="fixed bottom-20 right-4 sm:bottom-28 sm:right-6 w-[calc(100vw-2rem)] sm:w-[26rem] h-[calc(100vh-100px)] sm:h-[36rem] max-h-[36rem] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl flex flex-col z-50 transform transition-all duration-300 ease-out origin-bottom-right scale-95 opacity-0 animate-fade-in-scale border border-slate-100 dark:border-slate-800 overflow-hidden">
                    {/* Header */}
                    <div className="flex justify-between items-center p-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">
                                <CompassIcon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg leading-tight">CampusCompass AI</h3>
                                <p className="text-xs text-cyan-100">Always online & ready to help</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="hover:bg-white/20 p-2 rounded-full transition-colors">
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div ref={chatBoxRef} className="flex-grow p-5 overflow-y-auto space-y-5 custom-scrollbar">
                        {messages.map((msg, index) => (
                             <div key={index} className={`flex items-end gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'ai' && (
                                    <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 mb-1">
                                        <CompassIcon className="w-4 h-4" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] px-4 py-3 text-[15px] leading-relaxed shadow-sm ${msg.sender === 'user' ? 'bg-gradient-to-br from-cyan-500 to-blue-600 text-white rounded-2xl rounded-br-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-2xl rounded-bl-sm border border-slate-200 dark:border-slate-700/50'}`}>
                                    {msg.sender === 'ai' ? <MarkdownRenderer text={msg.text} /> : msg.text}
                                </div>
                            </div>
                        ))}

                        {showStarters && messages.length === 1 && (
                            <div className="space-y-2 pt-4 px-2 animate-fade-in-scale" style={{ animationDelay: '0.4s', animationFillMode: 'both' }}>
                                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-3 uppercase tracking-wide">Suggested questions</p>
                                 {conversationStarters.map((prompt, i) => (
                                     <button key={i} onClick={() => handleStarterClick(prompt)} className="w-full text-left text-sm text-cyan-700 dark:text-cyan-300 bg-white dark:bg-slate-900/50 border border-cyan-200 dark:border-cyan-800/50 rounded-xl p-3 hover:bg-cyan-50 dark:hover:bg-slate-800 transition-colors shadow-sm mb-2 hover:border-cyan-400 dark:hover:border-cyan-500">
                                         {prompt}
                                     </button>
                                 ))}
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex items-end gap-3 justify-start">
                                 <div className="w-8 h-8 rounded-full bg-cyan-100 dark:bg-cyan-900/40 text-cyan-600 dark:text-cyan-400 flex items-center justify-center flex-shrink-0 mb-1">
                                    <CompassIcon className="w-4 h-4" />
                                </div>
                                <div className="max-w-[80%] px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-sm flex items-center gap-1.5 shadow-sm border border-slate-200 dark:border-slate-700/50">
                                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce"></span>
                                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                                    <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Form */}
                    <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 relative">
                        <form onSubmit={handleSendMessage} className="relative flex items-center">
                            <input
                                type="text"
                                placeholder="Message CampusCompass..."
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                className="w-full bg-slate-50 dark:bg-slate-800 rounded-3xl py-3.5 pl-5 pr-14 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 border border-slate-200 dark:border-slate-700 transition-all font-medium"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white w-9 h-9 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed shadow-md transition-colors"
                                aria-label="Send Message"
                                disabled={isLoading || !userInput.trim()}
                            >
                                <SendIcon />
                            </button>
                        </form>
                    </div>
                     <style>{`
                        @keyframes fade-in-scale {
                            from { transform: scale(0.92) translateY(10px); opacity: 0; }
                            to { transform: scale(1) translateY(0); opacity: 1; }
                        }
                        .animate-fade-in-scale { animation: fade-in-scale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                        
                        /* Custom subtle scrollbar for the chat area */
                        .custom-scrollbar::-webkit-scrollbar {
                            width: 6px;
                        }
                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: transparent;
                        }
                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background-color: rgba(156, 163, 175, 0.3);
                            border-radius: 10px;
                        }
                        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
                            background-color: rgba(75, 85, 99, 0.5);
                        }
                    `}</style>
                </div>
            )}
        </>
    );
};

export default AIChatbot;