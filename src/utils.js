import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function formatDuration(ms) {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
}

export function analyzeMessage(content) {
    const text = content.toLowerCase();
    const tags = [];

    // Heuristics
    if (text.includes("whatsapp") || text.includes("wa.me")) {
        tags.push({ type: 'info', label: '📱 WhatsApp' });
    }

    if (text.includes("zona") || text.includes("localidad") || text.includes("provincia")) {
        tags.push({ type: 'success', label: '❓ Pidió Zona' });
    }

    if (text.includes("deriv") || text.includes("contactar") || text.includes("especialista")) {
        if (text.includes("informo") || text.includes("para que") || text.includes("orden")) {
            tags.push({ type: 'success', label: '✅ Derivó Informando' });
        } else {
            tags.push({ type: 'warning', label: '⚠️ Derivación Directa?' });
        }
    }

    if (text.includes("no acreditado") || text.includes("no realizamos")) {
        tags.push({ type: 'neutral', label: '🚫 No Acreditado' });
    }

    // Detection of potentially hallucinated services (example keywords)
    if (text.includes("reparación") || text.includes("alquiler") || text.includes("repuestos")) {
        tags.push({ type: 'danger', label: '⚠️ Posible Invención' });
    }

    return tags;
}
