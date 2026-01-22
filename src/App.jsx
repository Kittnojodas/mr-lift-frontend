import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import Checklist from './components/Checklist';
import InstructionsModal from './components/InstructionsModal';
import { sendMessage } from './api';

// Hardcoded configuration for internal testing
const API_CONFIG = {
    baseUrl: "https://asistentes-5e8m.onrender.com",
    assistantId: "asst_kGfLr7tpbJp5oNpsFWJ9HyfO"
};

function App() {
    // Test Context State
    const [testMode, setTestMode] = useState(() => localStorage.getItem('ml_test_mode') || 'new_client');
    const [testObjective, setTestObjective] = useState(() => localStorage.getItem('ml_test_objective') || '');
    const [evaluation, setEvaluation] = useState(() => {
        const saved = localStorage.getItem('ml_evaluation');
        return saved ? JSON.parse(saved) : {
            checks: {},
            score: null,
            observations: ''
        };
    });

    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('ml_messages');
        return saved ? JSON.parse(saved) : [];
    });

    const [threadId, setThreadId] = useState(() => localStorage.getItem('ml_thread_id'));
    const [showInstructions, setShowInstructions] = useState(false);
    const [showMeta, setShowMeta] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [scriptQueue, setScriptQueue] = useState([]);

    // Persistence Effects
    useEffect(() => { localStorage.setItem('ml_test_mode', testMode); }, [testMode]);
    useEffect(() => { localStorage.setItem('ml_test_objective', testObjective); }, [testObjective]);
    useEffect(() => { localStorage.setItem('ml_evaluation', JSON.stringify(evaluation)); }, [evaluation]);

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

    // Scenario Scripting Effect
    useEffect(() => {
        if (scriptQueue.length > 0 && !isLoading && messages.length > 0) {
            const lastMsg = messages[messages.length - 1];
            if (lastMsg.role === 'assistant') {
                const nextMsg = scriptQueue[0];
                const timeoutId = setTimeout(() => {
                    handleSendMessage(nextMsg);
                    setScriptQueue(prev => prev.slice(1));
                }, 1500); // Natural delay
                return () => clearTimeout(timeoutId);
            }
        }
    }, [messages, isLoading, scriptQueue]);

    const handleSendMessage = async (text) => {
        const userMessage = { role: 'user', content: text, timestamp: Date.now() };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);
        setError(null);

        try {
            const response = await sendMessage({
                message: text,
                thread_id: threadId,
                assistant_id: API_CONFIG.assistantId,
                baseUrl: API_CONFIG.baseUrl,
                mock: false
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
            setScriptQueue([]); // Stop script on error
        } finally {
            setIsLoading(false);
        }
    };

    const handleRunScenario = (sequence) => {
        if (!sequence || sequence.length === 0) return;
        const [first, ...rest] = sequence;
        setScriptQueue(rest);
        handleSendMessage(first);
    };

    const handleReset = () => {
        if (window.confirm('¿Estás seguro de que quieres limpiar la conversación?')) {
            setMessages([]);
            setThreadId(null);
            setScriptQueue([]);
        }
    };

    const handleCopyAll = () => {
        const text = messages.map(m => `[${m.role.toUpperCase()}] ${m.content}`).join('\n\n');
        navigator.clipboard.writeText(text);
        alert('Conversación copiada al portapapeles');
    };

    const handleExportJSON = () => {
        const data = {
            metadata: {
                exported_at: new Date().toISOString(),
                environment: "Mr. Lift Functional Validation Panel",
                version: "2.0"
            },
            context: {
                test_mode: testMode,
                test_objective: testObjective,
            },
            evaluation: evaluation,
            conversation: messages,
            thread_id: threadId
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `mrlift-test-${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.json`;
        a.click();
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50 font-sans text-slate-900">
            <Sidebar
                testMode={testMode}
                setTestMode={setTestMode}
                testObjective={testObjective}
                setTestObjective={setTestObjective}
                onReset={handleReset}
                showMeta={showMeta}
                setShowMeta={setShowMeta}
                onCopyAll={handleCopyAll}
                onExportJSON={handleExportJSON}
                onOpenInstructions={() => setShowInstructions(true)}
                conversationLength={messages.length}
            />

            <main className="flex-1 flex flex-col h-full relative">
                <ChatWindow
                    messages={messages}
                    onSendMessage={handleSendMessage}
                    onRunScenario={handleRunScenario}
                    isLoading={isLoading}
                    showMeta={showMeta}
                    error={error}
                />
                <Checklist
                    evaluation={evaluation}
                    setEvaluation={setEvaluation}
                />
                <InstructionsModal
                    isOpen={showInstructions}
                    onClose={() => setShowInstructions(false)}
                />
            </main>
        </div>
    );
}

export default App;
