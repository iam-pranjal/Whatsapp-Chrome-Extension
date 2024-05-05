function sendFilterType(filterType) {
    chrome.tabs.query({active: true, currentWindow: true, url: "https://web.whatsapp.com/*"}, function(tabs) {
        if (tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "filterChats", filterType: filterType}, response => {
                if (chrome.runtime.lastError) {
                    console.error('Error sending message:', chrome.runtime.lastError);
                } else {
                    console.log('Response received:', response);
                }
            });
        } else {
            console.error("No WhatsApp Web tab found or tab is not yet ready.");
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('all-btn').addEventListener('click', () => sendFilterType('all'));
    document.getElementById('unread-btn').addEventListener('click', () => sendFilterType('unread'));
    document.getElementById('awaiting-reply-btn').addEventListener('click', () => sendFilterType('awaiting_reply'));
    document.getElementById('needs-reply-btn').addEventListener('click', () => sendFilterType('needs_reply'));
});
