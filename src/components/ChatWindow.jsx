import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Copy, Check, AlertCircle } from 'lucide-react';
import { cn, formatDuration } from '../utils';
import { motion, AnimatePresence } from 'framer-motion';

const QUICK_PROMPTS = [
    "¿Inspeccionan grúas torre?",
    "Necesito curso de autoelevador",
    "¿Hacen ensayos no destructivos?",
    "Quiero coordinar por WhatsApp",
    "Estoy en Mendoza, ¿a quién contacto?"
];

export default function ChatWindow({
    messages,
    onSendMessage,
    isLoading,
    showMeta,
    error
}) {
    const [input, setInput] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isLoading]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    const copyToClipboard = (text, id) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scroll-smooth"
            >
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                        <Bot className="w-16 h-16 opacity-20" />
                        <p className="text-lg font-medium">Inicia una conversación con Mr. Lift</p>
                    </div>
                )}

                {messages.map((m, idx) => (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        key={idx}
                        className={cn(
                            "flex gap-4 max-w-4xl mx-auto",
                            m.role === 'user' ? "flex-row-reverse" : "flex-row"
                        )}
                    >
                        <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors shadow-sm",
                            m.role === 'user' ? "bg-primary-100 text-primary-700" : "bg-slate-100 text-slate-600"
                        )}>
                            {m.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>

                        <div className={cn(
                            "flex flex-col space-y-2 group max-w-[80%]",
                            m.role === 'user' ? "items-end" : "items-start"
                        )}>
                            <div className={cn(
                                "px-4 py-3 rounded-2xl text-sm md:text-base shadow-sm relative",
                                m.role === 'user'
                                    ? "bg-primary-600 text-white rounded-tr-none"
                                    : "bg-slate-50 border border-slate-100 text-slate-900 rounded-tl-none"
                            )}>
                                {m.content}

                                <button
                                    onClick={() => copyToClipboard(m.content, idx)}
                                    className={cn(
                                        "absolute top-2 right-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 hover:bg-white/20 border border-white/10",
                                        m.role === 'user' ? "text-white/80" : "text-slate-400 bg-slate-100"
                                    )}
                                >
                                    {copiedId === idx ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                </button>
                            </div>

                            {showMeta && m.meta && (
                                <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 flex gap-3 px-1">
                                    <span>Duration: {formatDuration(m.meta.duration_ms)}</span>
                                    <span>ID: {m.meta.run_id?.split('_').pop()}</span>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <div className="flex gap-4 max-w-4xl mx-auto">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-slate-100 text-slate-600 shadow-sm">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div className="bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="max-w-4xl mx-auto flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{error}</span>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-100 p-4 md:p-6 bg-slate-50/50">
                <div className="max-w-4xl mx-auto space-y-4">
                    {/* Quick Prompts */}
                    <div className="flex flex-wrap gap-2">
                        {QUICK_PROMPTS.map((prompt, idx) => (
                            <button
                                key={idx}
                                onClick={() => onSendMessage(prompt)}
                                disabled={isLoading}
                                className="px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 text-slate-600 rounded-full hover:border-primary-400 hover:text-primary-600 transition-all shadow-sm disabled:opacity-50"
                            >
                                {prompt}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                            placeholder="Escribe un mensaje a Mr. Lift..."
                            className="w-full bg-white border border-slate-200 rounded-2xl pl-4 pr-12 py-3.5 shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-900"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:bg-slate-400"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                    <p className="text-[10px] text-center text-slate-400 uppercase tracking-widest font-bold">
                        Mr. Lift Testing Interface • Internal Use Only
                    </p>
                </div>
            </div>
        </div>
    );
}
