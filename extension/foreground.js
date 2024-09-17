// content.js
(function() {
    console.log("YouTube Chat Extension: Content script loaded");

    function injectChatInterface() {
        console.log("YouTube Chat Extension: Attempting to inject chat interface");

        // Look for the target element to insert before
        const targetElement = document.querySelector('ytd-watch-next-secondary-results-renderer');

        if (targetElement) {
            const chatHTML = `
                <div id="yt-chat-container" style="
                    position: relative;
                    width: 100%;
                    background-color: white;
                    border: 1px solid #ccc;
                    margin-bottom: 16px;
                    padding: 16px;
                    box-sizing: border-box;
                ">
                    <div id="yt-chat-messages" style="
                        height: 300px;
                        overflow-y: auto;
                        margin-bottom: 10px;
                        border: 1px solid #e0e0e0;
                        padding: 8px;
                    "></div>
                    <div id="yt-chat-input" style="display: flex;">
                        <input type="text" id="yt-user-input" placeholder="Ask about the video..." style="
                            flex-grow: 1;
                            margin-right: 8px;
                            padding: 8px;
                        ">
                        <button id="yt-send-button" style="
                            background-color: #065fd4;
                            color: white;
                            border: none;
                            padding: 8px 16px;
                            cursor: pointer;
                        ">Send</button>
                    </div>
                </div>
            `;

            const chatContainer = document.createElement('div');
            chatContainer.innerHTML = chatHTML;

            targetElement.parentNode.insertBefore(chatContainer, targetElement);

            console.log("YouTube Chat Extension: Chat interface injected");

            addEventListeners();
        } else {
            console.log("YouTube Chat Extension: Target element not found, retrying in 1 second");
            setTimeout(injectChatInterface, 1000);  // Retry after 1 second
        }
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
            addMessageToChat('User', message);
            sendMessageToLLM(message);
            userInput.value = '';
        }
    }

    function addMessageToChat(sender, message) {
        const chatMessages = document.getElementById('yt-chat-messages');
        const messageElement = document.createElement('div');
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

    // Start the injection process when the page is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', injectChatInterface);
    } else {
        injectChatInterface();
    }

    // Add a visible debug element
    const debugElement = document.createElement('div');
    debugElement.style.cssText = 'position:fixed;top:0;left:0;background:rgba(255,0,0,0.8);color:white;padding:10px;z-index:10000;';
    debugElement.textContent = 'YouTube Chat Extension: Debug Element';
    document.body.appendChild(debugElement);

    console.log("YouTube Chat Extension: Script execution completed");
})();