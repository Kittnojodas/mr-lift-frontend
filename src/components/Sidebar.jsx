import React, { useState } from 'react';
import {
    Settings,
    RefreshCw,
    Info,
    Database,
    Eye,
    EyeOff,
    Trash2,
    ChevronRight,
    ChevronDown,
    ClipboardCheck
} from 'lucide-react';
import { cn } from '../utils';

export default function Sidebar({
    config,
    setConfig,
    onReset,
    showMeta,
    setShowMeta,
    isMock,
    setIsMock,
    onCopyAll,
    onExportJSON,
    conversationLength
}) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className={cn(
            "h-screen bg-slate-900 text-slate-100 transition-all duration-300 flex flex-col border-r border-slate-800",
            isOpen ? "w-80" : "w-16"
        )}>
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-slate-800">
                <div className={cn("flex items-center gap-3 overflow-hidden transition-all", isOpen ? "opacity-100" : "opacity-0 w-0")}>
                    <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center font-bold text-white">
                        ML
                    </div>
                    <span className="font-bold text-xl whitespace-nowrap">Mr. Lift</span>
                </div>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    <Settings className="w-5 h-5 text-slate-400" />
                </button>
            </div>

            {isOpen && (
                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Configuration */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Configuración</h3>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Base URL</label>
                            <input
                                type="text"
                                value={config.baseUrl}
                                onChange={(e) => setConfig({ ...config, baseUrl: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300">Assistant ID</label>
                            <input
                                type="text"
                                value={config.assistantId}
                                onChange={(e) => setConfig({ ...config, assistantId: e.target.value })}
                                className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Acciones</h3>

                        <button
                            onClick={onReset}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 rounded-md transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Reset Conversación
                        </button>

                        <button
                            onClick={() => setShowMeta(!showMeta)}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 rounded-md transition-colors"
                        >
                            {showMeta ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            {showMeta ? "Ocultar Metadata" : "Mostrar Metadata"}
                        </button>

                        <button
                            onClick={onCopyAll}
                            disabled={conversationLength === 0}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                        >
                            <ClipboardCheck className="w-4 h-4" />
                            Copiar Todo
                        </button>

                        <button
                            onClick={onExportJSON}
                            disabled={conversationLength === 0}
                            className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-300 hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                        >
                            <Database className="w-4 h-4" />
                            Exportar JSON
                        </button>
                    </div>

                    {/* Mode Toggle */}
                    <div className="pt-4 border-t border-slate-800">
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-300">Modo Mock</span>
                                <span className="text-xs text-slate-500">Pruebas sin backend</span>
                            </div>
                            <button
                                onClick={() => setIsMock(!isMock)}
                                className={cn(
                                    "relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                                    isMock ? "bg-primary-600" : "bg-slate-700"
                                )}
                            >
                                <span className={cn(
                                    "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                                    isMock ? "translate-x-5" : "translate-x-0"
                                )} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Footer Info */}
            {isOpen && (
                <div className="p-4 bg-slate-950/50 border-t border-slate-800">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Info className="w-3 h-3" />
                        <span>Versión 1.0.0 (Testing)</span>
                    </div>
                </div>
            )}
        </div>
    );
}
