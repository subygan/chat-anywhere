// content.js
(function() {
    console.log("YouTube Chat Extension: Content script loaded");

    function injectChatInterface() {
        console.log("YouTube Chat Extension: Attempting to inject chat interface");

        const targetElement = document.querySelector('ytd-watch-next-secondary-results-renderer');

        if (targetElement) {
            const chatHTML = `
                <div id="yt-chat-container" class="yt-chat-container">
                    <div id="yt-chat-header" class="yt-chat-header">
                        <span>Video Chat</span>
                    </div>
                    <div id="yt-chat-messages" class="yt-chat-messages"></div>
                    <div id="yt-chat-input" class="yt-chat-input">
                        <input type="text" id="yt-user-input" placeholder="Ask about the video...">
                        <button id="yt-send-button">
                            <svg viewBox="0 0 24 24" preserveAspectRatio="xMidYMid meet" focusable="false" class="style-scope yt-icon" style="pointer-events: none; display: block; width: 100%; height: 100%;"><g class="style-scope yt-icon"><path d="M2,21L23,12L2,3V10L17,12L2,14V21Z" class="style-scope yt-icon"></path></g></svg>
                        </button>
                    </div>
                </div>
            `;

            const chatContainer = document.createElement('div');
            chatContainer.innerHTML = chatHTML;

            targetElement.parentNode.insertBefore(chatContainer, targetElement);

            injectStyles();
            console.log("YouTube Chat Extension: Chat interface injected");

            addEventListeners();
        } else {
            console.log("YouTube Chat Extension: Target element not found, retrying in 1 second");
            setTimeout(injectChatInterface, 1000);
        }
    }

    function injectStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .yt-chat-container {
                position: relative;
                width: 100%;
                background-color: var(--yt-spec-base-background);
                border: 1px solid var(--yt-spec-10-percent-layer);
                border-radius: 12px;
                margin-bottom: 16px;
                overflow: hidden;
                font-family: "Roboto", "Arial", sans-serif;
            }
            .yt-chat-header {
                padding: 16px;
                font-size: 16px;
                font-weight: 500;
                border-bottom: 1px solid var(--yt-spec-10-percent-layer);
                color: var(--yt-spec-text-primary);
            }
            .yt-chat-messages {
                height: 300px;
                overflow-y: auto;
                padding: 16px;
                color: var(--yt-spec-text-primary);
            }
            .yt-chat-message {
                margin-bottom: 12px;
                line-height: 1.4;
            }
            .yt-chat-message strong {
                font-weight: 500;
            }
            .yt-chat-input {
                display: flex;
                padding: 12px;
                border-top: 1px solid var(--yt-spec-10-percent-layer);
            }
            #yt-user-input {
                flex-grow: 1;
                background-color: var(--yt-spec-base-background);
                border: 1px solid var(--yt-spec-10-percent-layer);
                border-radius: 24px;
                padding: 8px 16px;
                font-size: 14px;
                color: var(--yt-spec-text-primary);
            }
            #yt-user-input:focus {
                outline: none;
                border-color: var(--yt-spec-call-to-action);
            }
            #yt-send-button {
                background-color: transparent;
                border: none;
                cursor: pointer;
                padding: 6px;
                margin-left: 8px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 32px;
                height: 32px;
            }
            #yt-send-button:hover {
                background-color: var(--yt-spec-10-percent-layer);
            }
            #yt-send-button svg {
                width: 20px;
                height: 20px;
                fill: var(--yt-spec-call-to-action);
            }
        `;
        document.head.appendChild(styleElement);
    }

    function addEventListeners() {
        console.log("YouTube Chat Extension: Adding event listeners");
        const sendButton = document.getElementById('yt-send-button');
        const userInput = document.getElementById('yt-user-input');

        if (sendButton && userInput) {
            sendButton.addEventListener('click', handleSendMessage);
            userInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSendMessage();
                }
            });
            console.log("YouTube Chat Extension: Event listeners added successfully");
        } else {
            console.log("YouTube Chat Extension: Failed to add event listeners: Elements not found");
        }
    }

    function handleSendMessage() {
        console.log("YouTube Chat Extension: Handle send message called");
        const userInput = document.getElementById('yt-user-input');
        const message = userInput.value.trim();

        if (message) {
            addMessageToChat('You', message);
            sendMessageToLLM(message);
            userInput.value = '';
        }
    }

    function addMessageToChat(sender, message) {
        const chatMessages = document.getElementById('yt-chat-messages');
        const messageElement = document.createElement('div');
        messageElement.className = 'yt-chat-message';
        messageElement.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessageToLLM(message) {
        console.log("YouTube Chat Extension: Attempting to send message to LLM");
        const videoTitle = document.querySelector('h1.title.style-scope.ytd-video-primary-info-renderer')?.textContent;
        const videoId = new URLSearchParams(window.location.search).get('v');

        chrome.runtime.sendMessage({
            action: 'sendToLLM',
            message: message,
            videoInfo: { title: videoTitle, id: videoId }
        }, response => {
            if (response && response.answer) {
                addMessageToChat('AI', response.answer);
                console.log("YouTube Chat Extension: Received response from LLM");
            } else {
                addMessageToChat('AI', 'Sorry, I couldn\'t process that request.');
                console.log("YouTube Chat Extension: Failed to get response from LLM");
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectChatInterface);
    } else {
        injectChatInterface();
    }

    console.log("YouTube Chat Extension: Script execution completed");
})();