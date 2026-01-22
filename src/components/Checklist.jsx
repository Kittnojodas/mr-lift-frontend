import React, { useState } from 'react';
import {
    CheckCircle2,
    ChevronDown,
    ClipboardList,
    AlertTriangle,
    XCircle,
    MinusCircle
} from 'lucide-react';
import { cn } from '../utils';

const EVALUATION_ITEMS = [
    { id: 'informed_derivation', label: 'Informó antes de derivar' },
    { id: 'asked_zone', label: 'Preguntó zona antes de WhatsApp' },
    { id: 'no_hallucination', label: 'No inventó servicios' },
    { id: 'correct_derivation', label: 'Derivó solo cuando correspondía' },
    { id: 'professional_tone', label: 'Mantuvo tono profesional' },
    { id: 'no_overexplain', label: 'No sobreexplicó' }
];

export default function Checklist({ evaluation, setEvaluation }) {
    const [isOpen, setIsOpen] = useState(true);

    const toggleCheck = (id) => {
        setEvaluation(prev => ({
            ...prev,
            checks: {
                ...prev.checks,
                [id]: !prev.checks[id]
            }
        }));
    };

    const setScore = (score) => {
        setEvaluation(prev => ({ ...prev, score }));
    };

    const setObservations = (text) => {
        setEvaluation(prev => ({ ...prev, observations: text }));
    };

    const getScoreColor = () => {
        if (evaluation.score === 'approved') return 'bg-emerald-500 border-emerald-600';
        if (evaluation.score === 'observed') return 'bg-amber-500 border-amber-600';
        if (evaluation.score === 'failed') return 'bg-red-500 border-red-600';
        return 'bg-slate-100 border-slate-300';
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <div className={cn(
                "pointer-events-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300 flex flex-col",
                isOpen ? "w-80 h-[32rem]" : "w-auto h-auto"
            )}>
                {/* Header */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors bg-white z-10",
                        !isOpen && "rounded-2xl"
                    )}
                >
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center transition-colors shadow-sm border",
                            isOpen ? "bg-slate-900 text-white border-slate-800" : getScoreColor()
                        )}>
                            <ClipboardList className={cn("w-5 h-5", !isOpen && evaluation.score && "text-white")} />
                        </div>
                        {isOpen && <span className="font-bold text-slate-800">Evaluación del Test</span>}
                    </div>
                    {isOpen && <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {isOpen && (
                    <div className="flex-1 overflow-y-auto p-4 pt-0 space-y-6">

                        {/* Checklist */}
                        <div className="space-y-3 pt-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Criterios</h4>
                            {EVALUATION_ITEMS.map((item) => (
                                <label
                                    key={item.id}
                                    className="flex items-start gap-3 cursor-pointer group p-2 hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    <div className="pt-0.5">
                                        <div
                                            onClick={() => toggleCheck(item.id)}
                                            className={cn(
                                                "w-5 h-5 border-2 rounded-md transition-all flex items-center justify-center",
                                                evaluation.checks[item.id]
                                                    ? "bg-indigo-600 border-indigo-600"
                                                    : "border-slate-300 group-hover:border-indigo-400"
                                            )}
                                        >
                                            {evaluation.checks[item.id] && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                    </div>
                                    <span className={cn(
                                        "text-sm font-medium transition-colors select-none",
                                        evaluation.checks[item.id] ? "text-slate-900" : "text-slate-500"
                                    )}>
                                        {item.label}
                                    </span>
                                </label>
                            ))}
                        </div>

                        {/* Observations */}
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Observaciones</h4>
                            <textarea
                                value={evaluation.observations}
                                onChange={(e) => setObservations(e.target.value)}
                                placeholder="Notas sobre el comportamiento..."
                                className="w-full h-24 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
                            />
                        </div>

                        {/* Final Score */}
                        <div className="space-y-2 pb-4">
                            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Resultado Final</h4>
                            <div className="grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => setScore('approved')}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1 p-2 rounded-xl border-2 transition-all",
                                        evaluation.score === 'approved'
                                            ? "bg-emerald-50 border-emerald-500 text-emerald-700"
                                            : "border-transparent bg-slate-50 text-slate-400 hover:bg-slate-100"
                                    )}
                                >
                                    <CheckCircle2 className="w-6 h-6" />
                                    <span className="text-[10px] font-bold uppercase">Aprobado</span>
                                </button>

                                <button
                                    onClick={() => setScore('observed')}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1 p-2 rounded-xl border-2 transition-all",
                                        evaluation.score === 'observed'
                                            ? "bg-amber-50 border-amber-500 text-amber-700"
                                            : "border-transparent bg-slate-50 text-slate-400 hover:bg-slate-100"
                                    )}
                                >
                                    <AlertTriangle className="w-6 h-6" />
                                    <span className="text-[10px] font-bold uppercase">Observado</span>
                                </button>

                                <button
                                    onClick={() => setScore('failed')}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1 p-2 rounded-xl border-2 transition-all",
                                        evaluation.score === 'failed'
                                            ? "bg-red-50 border-red-500 text-red-700"
                                            : "border-transparent bg-slate-50 text-slate-400 hover:bg-slate-100"
                                    )}
                                >
                                    <XCircle className="w-6 h-6" />
                                    <span className="text-[10px] font-bold uppercase">Fallido</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
