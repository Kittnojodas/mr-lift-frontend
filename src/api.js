const DEFAULT_BASE_URL = "https://asistentes-5e8m.onrender.com";
const DEFAULT_ASSISTANT_ID = "asst_kGfLr7tpbJp5oNpsFWJ9HyfO";

export async function sendMessage({
    message,
    thread_id,
    assistant_id = DEFAULT_ASSISTANT_ID,
    baseUrl = DEFAULT_BASE_URL,
    mock = false
}) {
    if (mock) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return {
            answer: `[MOCK RESPONSE] Me preguntaste: "${message}". Esta es una simulación del backend.`,
            thread_id: thread_id || `thread_mock_${Math.random().toString(36).substr(2, 9)}`,
            meta: { run_id: "run_mock_123", duration_ms: 1234 }
        };
    }

    const base = baseUrl.replace(/\/+$/, "");
    const url = `${base}/api/v1/chat`;

    const performFetch = async (retry = true) => {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(window.MR_LIFT_TEST_KEY && {
                        "X-Test-Key": window.MR_LIFT_TEST_KEY
                    })
                },
                body: JSON.stringify({
                    assistant_id,
                    message,
                    thread_id
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (retry) {
                console.warn("Retrying fetch once due to error:", error);
                return performFetch(false);
            }
            throw error;
        }
    };

    return performFetch();
}