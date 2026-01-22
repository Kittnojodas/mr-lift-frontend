import React, { useState } from 'react';
import { CheckCircle2, ChevronDown, ChevronRight, ClipboardList } from 'lucide-react';
import { cn } from '../utils';

const CHECKLIST_ITEMS = [
    "¿Informó antes de derivar?",
    "¿Preguntó zona antes de pasar WhatsApp?",
    "¿No inventó servicios?",
    "¿Derivó solo si correspondía?"
];

export default function Checklist() {
    const [isOpen, setIsOpen] = useState(true);
    const [checked, setChecked] = useState({});

    const toggleItem = (idx) => {
        setChecked(prev => ({ ...prev, [idx]: !prev[idx] }));
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <div className={cn(
                "bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all duration-300",
                isOpen ? "w-72" : "w-14 h-14"
            )}>
                {/* Header */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors",
                        !isOpen && "h-full justify-center p-0"
                    )}
                >
                    {isOpen ? (
                        <>
                            <div className="flex items-center gap-2">
                                <ClipboardList className="w-5 h-5 text-primary-600" />
                                <span className="font-bold text-slate-800">Checklist Mr. Lift</span>
                            </div>
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        </>
                    ) : (
                        <ClipboardList className="w-6 h-6 text-primary-600" />
                    )}
                </button>

                {isOpen && (
                    <div className="p-4 pt-0 space-y-3">
                        <div className="h-px bg-slate-100 mb-4" />
                        {CHECKLIST_ITEMS.map((item, idx) => (
                            <label
                                key={idx}
                                className="flex items-start gap-3 cursor-pointer group"
                            >
                                <div className="pt-0.5">
                                    <div
                                        onClick={() => toggleItem(idx)}
                                        className={cn(
                                            "w-5 h-5 border-2 rounded-md transition-all flex items-center justify-center",
                                            checked[idx]
                                                ? "bg-green-500 border-green-500"
                                                : "border-slate-300 group-hover:border-primary-400"
                                        )}
                                    >
                                        {checked[idx] && <CheckCircle2 className="w-4 h-4 text-white" />}
                                    </div>
                                </div>
                                <span className={cn(
                                    "text-sm font-medium transition-colors select-none pt-0.5",
                                    checked[idx] ? "text-slate-400 line-through" : "text-slate-700"
                                )}>
                                    {item}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
