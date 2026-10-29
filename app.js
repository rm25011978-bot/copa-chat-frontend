// CONFIGURAÇÃO DA API: Altere esta URL para o endereço público do seu backend no Render
const API_BASE_URL = "http://127.0.0.1:5000";

const chatMessages = document.getElementById("chat-messages");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const typingIndicator = document.getElementById("typing-indicator");

// Histórico em memória mantido pelo cliente
let messageHistory = [];

chatForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;

    appendMessage("user", text);
    messageHistory.push({ role: "user", content: text });
    userInput.value = "";
    
    setLoading(true);

    try {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ messages: messageHistory })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Ocorreu um erro ao consultar o assistente.");
        }

        appendMessage("assistant", data.response);
        messageHistory.push({ role: "assistant", content: data.response });

    } catch (error) {
        console.error("Erro na requisição:", error);
        appendMessage("assistant", "⚠️ Ocorreu um problema na conexão com o juiz da partida. Verifique se a API do backend está operando.", true);
    } finally {
        setLoading(false);
    }
});

function appendMessage(role, content, isError = false) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", role);
    if (isError) msgDiv.classList.add("error");

    const contentDiv = document.createElement("div");
    contentDiv.classList.add("message-content");
    contentDiv.innerHTML = formatText(content);

    msgDiv.appendChild(contentDiv);
    chatMessages.appendChild(msgDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setLoading(isLoading) {
    if (isLoading) {
        typingIndicator.style.display = "flex";
        sendBtn.disabled = true;
        userInput.disabled = true;
    } else {
        typingIndicator.style.display = "none";
        sendBtn.disabled = false;
        userInput.disabled = false;
        userInput.focus();
    }
}

function formatText(text) {
    // Formatação leve para quebras de linha e negrito básico
    return text
        .replace(/\n/g, "<br>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
}