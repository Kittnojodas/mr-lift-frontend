import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Copy, Check, AlertCircle, PlayCircle } from 'lucide-react';
import { cn, formatDuration, analyzeMessage } from '../utils';
import { motion } from 'framer-motion';

const TEST_SCENARIOS = [
    { label: "Servicio no acreditado", sequence: ["¿Inspeccionan grúas torre?", "Quiero hablar con alguien"] },
    { label: "Pedir WhatsApp directo", sequence: ["Quiero coordinar por WhatsApp"] },
    { label: "Pedir zona (Contexto)", sequence: ["Estoy en Mendoza, ¿a quién contacto?"] },
    { label: "Curso de autoelevador", sequence: ["Necesito curso de autoelevador", "¿Tienen fechas disponibles?"] },
    { label: "Ensayo no destructivo", sequence: ["¿Hacen ensayos no destructivos?", "Soy de una empresa constructora", "Quiero un presupuesto"] }
];

const highlightKeywords = (text) => {
    if (!text) return text;

    // Terms to highlight with specific styles
    const patterns = [
        { regex: /whatsapp/gi, className: "bg-green-100 text-green-800 px-1 rounded font-bold" },
        { regex: /zonas?|localidad|provincia/gi, className: "bg-amber-100 text-amber-800 px-1 rounded font-bold" },
        { regex: /no realizamos|no acreditado/gi, className: "bg-red-100 text-red-800 px-1 rounded font-bold" },
        { regex: /se gestiona por consulta/gi, className: "bg-blue-100 text-blue-800 px-1 rounded font-bold" }
    ];

    let parts = [{ text, className: null }];

    patterns.forEach(({ regex, className }) => {
        const newParts = [];
        parts.forEach(part => {
            if (part.className) {
                newParts.push(part);
            } else {
                const split = part.text.split(regex);
                const matches = part.text.match(regex);

                split.forEach((s, i) => {
                    if (s) newParts.push({ text: s, className: null });
                    if (matches && matches[i]) newParts.push({ text: matches[i], className });
                });
            }
        });
        parts = newParts;
    });

    return parts.map((part, i) =>
        part.className ? <span key={i} className={part.className}>{part.text}</span> : part.text
    );
};

export default function ChatWindow({
    messages,
    onSendMessage,
    onRunScenario,
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
        <div className="flex-1 flex flex-col bg-slate-100 overflow-hidden relative">
            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 md:p-6 space-y-8 scroll-smooth"
            >
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 opacity-50">
                        <Bot className="w-20 h-20" />
                        <p className="text-xl font-medium">Panel de Validación Mr. Lift</p>
                    </div>
                )}

                {messages.map((m, idx) => {
                    const isBot = m.role === 'assistant';
                    const analysis = isBot ? analyzeMessage(m.content) : [];

                    return (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={idx}
                            className={cn(
                                "flex gap-5 max-w-5xl mx-auto",
                                !isBot ? "flex-row-reverse" : "flex-row"
                            )}
                        >
                            {/* Avatar */}
                            <div className={cn(
                                "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm border",
                                !isBot ? "bg-indigo-600 border-indigo-500 text-white" : "bg-white border-slate-200 text-slate-600"
                            )}>
                                {!isBot ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                            </div>

                            <div className={cn(
                                "flex flex-col space-y-2 group max-w-[85%]",
                                !isBot ? "items-end" : "items-start"
                            )}>
                                {/* Message Bubble */}
                                <div className={cn(
                                    "px-6 py-4 rounded-2xl text-base shadow-sm relative leading-relaxed",
                                    !isBot
                                        ? "bg-indigo-600 text-white rounded-tr-none"
                                        : "bg-white border border-slate-200 text-slate-900 rounded-tl-none"
                                )}>
                                    <div>
                                        {isBot ? highlightKeywords(m.content) : m.content}
                                    </div>

                                    {/* Copy Button */}
                                    <button
                                        onClick={() => copyToClipboard(m.content, idx)}
                                        className={cn(
                                            "absolute top-2 right-2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity",
                                            !isBot ? "text-white/80 hover:bg-white/20" : "text-slate-400 hover:bg-slate-100"
                                        )}
                                    >
                                        {copiedId === idx ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                                    </button>
                                </div>

                                {/* Analysis Badges */}
                                {isBot && analysis.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-1 px-1">
                                        {analysis.map((tag, i) => (
                                            <span key={i} className={cn(
                                                "text-xs px-2 py-0.5 rounded-full border font-medium flex items-center gap-1",
                                                tag.type === 'success' && "bg-green-50 border-green-200 text-green-700",
                                                tag.type === 'warning' && "bg-amber-50 border-amber-200 text-amber-700",
                                                tag.type === 'danger' && "bg-red-50 border-red-200 text-red-700",
                                                tag.type === 'info' && "bg-blue-50 border-blue-200 text-blue-700",
                                                tag.type === 'neutral' && "bg-slate-100 border-slate-200 text-slate-600"
                                            )}>
                                                {tag.label}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Metadata */}
                                {showMeta && m.meta && (
                                    <div className="text-[10px] uppercase font-bold tracking-widest text-slate-400 flex gap-3 px-1">
                                        <span>Time: {formatDuration(m.meta.duration_ms)}</span>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}

                {isLoading && (
                    <div className="flex gap-5 max-w-5xl mx-auto">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-white border border-slate-200 text-slate-600 shadow-sm">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div className="bg-white border border-slate-200 px-6 py-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                            <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                        </div>
                    </div>
                )}

                {error && (
                    <div className="max-w-4xl mx-auto flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl border border-red-100 shadow-sm">
                        <AlertCircle className="w-5 h-5" />
                        <span className="font-medium">{error}</span>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-200 p-4 md:p-6 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-10">
                <div className="max-w-5xl mx-auto space-y-4">
                    {/* Test Cases */}
                    <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-indigo-500 mr-2">
                            <PlayCircle className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase tracking-wider">Casos de Prueba</span>
                        </div>
                        {TEST_SCENARIOS.map((t, idx) => (
                            <button
                                key={idx}
                                onClick={() => onRunScenario(t.sequence)}
                                disabled={isLoading}
                                className="px-3 py-1.5 text-xs font-medium bg-slate-50 border border-slate-200 text-slate-600 rounded-lg hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all disabled:opacity-50"
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <form onSubmit={handleSubmit} className="relative">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            disabled={isLoading}
                            placeholder="Escribe para probar..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-4 pr-14 py-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 font-medium"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:bg-slate-300 shadow-md transform active:scale-95"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
