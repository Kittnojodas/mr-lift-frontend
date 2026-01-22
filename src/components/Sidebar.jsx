import React, { useState } from 'react';
import {
    RefreshCw,
    Info,
    Database,
    Eye,
    EyeOff,
    ClipboardCheck,
    Beaker,
    FileText,
    Play,
    User,
    Building2,
    HelpCircle,
    MessageSquare,
    Ban,
    BookOpen
} from 'lucide-react';
import { cn } from '../utils';

const CLIENT_TYPES = [
    { id: 'new_client', label: 'Cliente Nuevo', icon: User, color: 'text-blue-400' },
    { id: 'tech_client', label: 'Técnico / Empresa', icon: Building2, color: 'text-purple-400' },
    { id: 'undecided_client', label: 'Cliente Indeciso', icon: HelpCircle, color: 'text-amber-400' },
    { id: 'whatsapp_client', label: 'Pide WhatsApp', icon: MessageSquare, color: 'text-green-400' },
    { id: 'out_of_scope', label: 'Fuera de Alcance', icon: Ban, color: 'text-red-400' }
];

export default function Sidebar({
    testMode,
    setTestMode,
    testObjective,
    setTestObjective,
    onReset,
    showMeta,
    setShowMeta,
    onCopyAll,
    onExportJSON,
    onOpenInstructions,
    conversationLength
}) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className={cn(
            "h-screen bg-slate-950 text-slate-100 transition-all duration-300 flex flex-col border-r border-slate-800 shadow-xl",
            isOpen ? "w-80" : "w-16"
        )}>
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-800">
                <div className={cn("flex items-center gap-3 overflow-hidden transition-all", isOpen ? "opacity-100" : "opacity-0 w-0")}>
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-500/20">
                        ML
                    </div>
                    <span className="font-bold text-xl whitespace-nowrap tracking-tight">Validation Panel</span>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    {isOpen ? <Beaker className="w-5 h-5 text-indigo-400" /> : <Beaker className="w-6 h-6 text-indigo-400" />}
                </button>
            </div>

            {isOpen && (
                <div className="flex-1 overflow-y-auto p-4 space-y-8">

                    {/* Test Mode */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-indigo-400">
                            <User className="w-4 h-4" />
                            <h3 className="text-xs font-bold uppercase tracking-wider">Modo de Prueba</h3>
                        </div>
                        <div className="space-y-1">
                            {CLIENT_TYPES.map((type) => {
                                const Icon = type.icon;
                                const isSelected = testMode === type.id;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => setTestMode(type.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all border",
                                            isSelected
                                                ? "bg-indigo-500/10 border-indigo-500/50 text-indigo-100"
                                                : "bg-transparent border-transparent text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                                        )}
                                    >
                                        <Icon className={cn("w-4 h-4", isSelected ? "text-indigo-400" : "text-slate-500")} />
                                        <span>{type.label}</span>
                                        {isSelected && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Test Scenario */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-amber-400">
                            <FileText className="w-4 h-4" />
                            <h3 className="text-xs font-bold uppercase tracking-wider">Escenario de Prueba</h3>
                        </div>
                        <textarea
                            value={testObjective}
                            onChange={(e) => setTestObjective(e.target.value)}
                            placeholder="Ej: Ver si informa antes de derivar..."
                            className="w-full h-24 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/30 transition-all resize-none text-slate-300 placeholder:text-slate-600 shadow-inner"
                        />
                    </div>

                    {/* Controls */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-slate-400">
                            <Play className="w-4 h-4" />
                            <h3 className="text-xs font-bold uppercase tracking-wider">Controles</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <button
                                onClick={onReset}
                                className="col-span-2 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700"
                            >
                                <RefreshCw className="w-4 h-4" />
                                Nueva Conversación
                            </button>

                            <button
                                onClick={() => setShowMeta(!showMeta)}
                                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 rounded-lg transition-colors border border-dashed border-slate-800 hover:border-slate-600"
                            >
                                {showMeta ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                {showMeta ? "Ocultar" : "Metadata"}
                            </button>

                            <button
                                onClick={onCopyAll}
                                disabled={conversationLength === 0}
                                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-slate-400 hover:bg-slate-800 rounded-lg transition-colors border border-dashed border-slate-800 hover:border-slate-600 disabled:opacity-50"
                            >
                                <ClipboardCheck className="w-3 h-3" />
                                Copiar
                            </button>
                        </div>

                        <button
                            onClick={onOpenInstructions}
                            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium text-indigo-300 hover:text-indigo-200 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 rounded-lg transition-colors mb-2"
                        >
                            <BookOpen className="w-4 h-4" />
                            Ver Instructivo
                        </button>

                        <button
                            onClick={onExportJSON}
                            disabled={conversationLength === 0}
                            className="w-full flex items-center justify-center gap-2 px-3 py-3 text-sm font-bold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 hover:border-emerald-500/40 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-emerald-900/20"
                        >
                            <Database className="w-4 h-4" />
                            Exportar Test Completo
                        </button>
                    </div>
                </div>
            )}

            {/* Footer Info */}
            <div className="p-4 bg-slate-950 border-t border-slate-800">
                {isOpen ? (
                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                        <Info className="w-3 h-3" />
                        <span className="font-mono">ENV: PROD (Auditor View)</span>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <Info className="w-4 h-4 text-slate-500" />
                    </div>
                )}
            </div>
        </div>
    );
}
