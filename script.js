const wsUrl = "wss://echo-ws-service.herokuapp.com";
const chatWindow = document.getElementById("chat-window");
const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const geoButton = document.getElementById("geo-button");

const websocket = new WebSocket(wsUrl);

// Функция добавления сообщения в окно чата
function addMessage(message, isSender = false) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    if (isSender) {
        messageElement.classList.add("sender");
    }
    messageElement.textContent = message;
    chatWindow.appendChild(messageElement);
    chatWindow.scrollTop = chatWindow.scrollHeight; // Прокрутка вниз
}

// Отправка сообщения
sendButton.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message) {
        addMessage(message, true);
        websocket.send(message);
        messageInput.value = "";
    }
});

// Получение ответа от сервера
websocket.onmessage = (event) => {
    addMessage(event.data);
};

// Отправка геолокации
geoButton.addEventListener("click", () => {
    if (!navigator.geolocation) {
        addMessage("Геолокация не поддерживается вашим браузером.");
        return;
    }
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            const geoUrl = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
            addMessage(`Гео-локация: ${geoUrl}`, true);

            // Не отправляем ссылку на сервер, но выводим
        },
        () => {
            addMessage("Невозможно получить геолокацию.");
        }
    );
});
