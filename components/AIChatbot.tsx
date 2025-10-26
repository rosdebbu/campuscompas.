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
            <div className="fixed bottom-6 right-6 z-50">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="bg-rose-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-rose-600 transition-all transform hover:scale-110"
                    aria-label="Open AI Chatbot"
                >
                    <ChatIcon />
                </button>
            </div>

            {isOpen && (
                <div className="fixed bottom-24 right-6 w-96 h-[32rem] bg-white rounded-2xl shadow-2xl flex flex-col z-50 transform transition-all duration-300 ease-out origin-bottom-right scale-95 opacity-0 animate-fade-in-scale">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 bg-rose-400 text-white rounded-t-2xl">
                        <h3 className="font-bold text-lg">Campus Compass AI</h3>
                        <button onClick={() => setIsOpen(false)} aria-label="Close chat">
                            <CloseIcon />
                        </button>
                    </div>

                    {/* Chat Messages */}
                    <div ref={chatBoxRef} className="flex-grow p-4 overflow-y-auto space-y-4">
                        {messages.map((msg, index) => (
                             <div key={index} className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {msg.sender === 'ai' && (
                                    <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center flex-shrink-0">
                                        <CompassIcon className="w-5 h-5" />
                                    </div>
                                )}
                                <div className={`max-w-[85%] px-4 py-2 rounded-2xl ${msg.sender === 'user' ? 'bg-rose-400 text-white rounded-br-none' : 'bg-lime-100 text-rose-900 rounded-bl-none'}`}>
                                    {msg.sender === 'ai' ? <MarkdownRenderer text={msg.text} /> : msg.text}
                                </div>
                            </div>
                        ))}

                        {showStarters && messages.length === 1 && (
                            <div className="space-y-2 pt-2 animate-fade-in-scale" style={{ animationDelay: '0.5s', animationFillMode: 'backwards' }}>
                                 {conversationStarters.map((prompt, i) => (
                                     <button key={i} onClick={() => handleStarterClick(prompt)} className="w-full text-left text-sm text-rose-600 bg-white border border-rose-200 rounded-lg p-3 hover:bg-lime-50 transition-colors">
                                         {prompt}
                                     </button>
                                 ))}
                            </div>
                        )}

                        {isLoading && (
                            <div className="flex items-start gap-2.5 justify-start">
                                 <div className="w-8 h-8 rounded-full bg-rose-100 text-rose-500 flex items-center justify-center flex-shrink-0">
                                    <CompassIcon className="w-5 h-5" />
                                </div>
                                <div className="max-w-xs px-4 py-3 rounded-2xl bg-lime-100 text-rose-900 rounded-bl-none flex items-center">
                                    <span className="text-sm text-rose-600 italic">Campus Compass is typing...</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Form */}
                    <div className="p-4 border-t border-rose-200">
                        <form onSubmit={handleSendMessage} className="relative flex items-center">
                            <input
                                type="text"
                                placeholder="Ask me anything..."
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                className="w-full bg-lime-100 rounded-full py-3 px-5 pr-14 focus:outline-none focus:ring-2 focus:ring-rose-400 text-rose-800 placeholder-rose-400"
                            />
                            <button
                                type="submit"
                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-rose-400 hover:bg-rose-500 text-white w-10 h-10 rounded-full flex items-center justify-center disabled:bg-rose-300"
                                aria-label="Send Message"
                                disabled={isLoading}
                            >
                                <SendIcon />
                            </button>
                        </form>
                    </div>
                     <style>{`
                        @keyframes fade-in-scale {
                            from { transform: scale(0.95); opacity: 0; }
                            to { transform: scale(1); opacity: 1; }
                        }
                        .animate-fade-in-scale { animation: fade-in-scale 0.2s ease-out forwards; }
                    `}</style>
                </div>
            )}
        </>
    );
};

export default AIChatbot;