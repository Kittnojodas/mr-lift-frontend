import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Checklist from './components/Checklist';
import { sendMessage } from './api';

const DEFAULT_CONFIG = {
    baseUrl: "https://asistentes-5e8m.onrender.com",
    assistantId: "asst_kGfLr7tpbJp5oNpsFWJ9HyfO"
};

function App() {
    const [config, setConfig] = useState(() => {
        const saved = localStorage.getItem('ml_config');
        return saved ? JSON.parse(saved) : DEFAULT_CONFIG;
    });

    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('ml_messages');
        return saved ? JSON.parse(saved) : [];
    });

    const [threadId, setThreadId] = useState(() => localStorage.getItem('ml_thread_id'));
    const [showMeta, setShowMeta] = useState(false);
    const [isMock, setIsMock] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        localStorage.setItem('ml_config', JSON.stringify(config));
    }, [config]);

    useEffect(() => {
        localStorage.setItem('ml_messages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        if (threadId) {
            localStorage.setItem('ml_thread_id', threadId);
        } else {
            localStorage.removeItem('ml_thread_id');
        }
    }, [threadId]);

    const handleSendMessage = async (text) => {
        const userMessage = { role: 'user', content: text, timestamp: Date.now() };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            const response = await sendMessage({
                message: text,
                thread_id: threadId,
                assistant_id: config.assistantId,
                baseUrl: config.baseUrl,
                mock: isMock
            });

            const botMessage = {
                role: 'assistant',
                content: response.answer,
                meta: response.meta,
                timestamp: Date.now()
            };

            setMessages(prev => [...prev, botMessage]);
            if (response.thread_id) setThreadId(response.thread_id);
        } catch (err) {
            setError(`Error: ${err.message || 'Error de conexión'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        if (window.confirm('¿Estás seguro de que quieres limpiar la conversación?')) {
            setMessages([]);
            setThreadId(null);
        }
    };

    const handleCopyAll = () => {
        const text = messages.map(m => `[${m.role.toUpperCase()}] ${m.content}`).join('\n\n');
        navigator.clipboard.writeText(text);
        alert('Conversación copiada al portapapeles');
    };

    const handleExportJSON = () => {
        const data = {
            config,
            threadId,
            messages,
            exportedAt: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mr-lift-chat-${new Date().getTime()}.json`;
        a.click();
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-900">
            <Sidebar
                config={config}
                setConfig={setConfig}
                onReset={handleReset}
                showMeta={showMeta}
                setShowMeta={setShowMeta}
                isMock={isMock}
                setIsMock={setIsMock}
                onCopyAll={handleCopyAll}
                onExportJSON={handleExportJSON}
                conversationLength={messages.length}
            />

            <main className="flex-1 flex flex-col h-full relative">
                <ChatWindow
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    isLoading={isLoading}
                    showMeta={showMeta}
                    error={error}
                />
                <Checklist />
            </main>
        </div>
    );
}

export default App;
