import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, CheckCircle, MessageSquare, Save, Flag } from 'lucide-react';
import { cn } from '../utils';

export default function InstructionsModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    // Content based on INSTRUCTIVO_TESTERS.md
    const steps = [
        {
            title: "1. Configuración del Test",
            icon: Flag,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            content: (
                <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm">
                    <li>Selecciona el <strong>Modo de Prueba</strong> (ej: Cliente Nuevo, Técnico) en la barra lateral.</li>
                    <li>Define el <strong>Objetivo</strong> en el cuadro de texto (ej: "Verificar si pide zona").</li>
                    <li>Usa <strong>Nueva Conversación</strong> 🔄 si necesitas limpiar el historial.</li>
                </ul>
            )
        },
        {
            title: "2. Interactuar",
            icon: MessageSquare,
            color: "text-indigo-500",
            bg: "bg-indigo-500/10",
            content: (
                <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm">
                    <li>Habla como un cliente real.</li>
                    <li>Usa los <strong>botones rápidos</strong> (arriba del chat) para ahorrar tiempo.</li>
                    <li>Observa las <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium border border-green-200"> etiquetas de colores</span> bajo las respuestas para ver qué detectó el bot.</li>
                </ul>
            )
        },
        {
            title: "3. Evaluar",
            icon: CheckCircle,
            color: "text-emerald-500",
            bg: "bg-emerald-500/10",
            content: (
                <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm">
                    <li>Completa el <strong>Checklist</strong> en el panel derecho.</li>
                    <li>Califica con estrellas ⭐.</li>
                    <li>Agrega observaciones si encontraste algún error o bug.</li>
                </ul>
            )
        },
        {
            title: "4. Exportar y Reportar",
            icon: Save,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            content: (
                <ul className="list-disc list-inside space-y-2 text-slate-600 text-sm">
                    <li>Haz clic en <strong>Exportar Test Completo</strong> 📥 (barra lateral, abajo).</li>
                    <li>Guarda el archivo <code>.json</code>.</li>
                    <li>Al final, envía todos los archivos generados por email.</li>
                </ul>
            )
        }
    ];

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-all"
                />

                {/* Modal Window */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                                <BookOpen className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Instructivo de Uso</h2>
                                <p className="text-sm text-slate-500">Guía rápida para testers</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        <div className="grid gap-6">
                            {steps.map((step, idx) => {
                                const Icon = step.icon;
                                return (
                                    <div key={idx} className="flex gap-4">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center mt-1 border",
                                            step.bg,
                                            step.color,
                                            "border-current/20" // automatic border opacity
                                        )}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-slate-900 text-lg">{step.title}</h3>
                                            <div className="leading-relaxed">
                                                {step.content}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-8 p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                            <p className="text-slate-600 text-sm">
                                ¿Dudas adicionales? Contacta al equipo de desarrollo antes de continuar.
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
                        <button
                            onClick={onClose}
                            className="px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 active:scale-95"
                        >
                            Entendido, ¡Empecemos!
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
