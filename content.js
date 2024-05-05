console.log("Content script loaded and running");

// Function to filter chats based on the selected filter type
function filterChats(filterType) {
    const chatItems = document.querySelectorAll("[data-testid='chat-item']");
    console.log(filterType + ' chats:', chatItems.length); // Log the number of chat items found
    chatItems.forEach(chat => {
        let displayStyle = '';
        switch (filterType) {
            case 'unread':
                if (!chat.querySelector("[data-testid='unread-message-counter']")) {
                    displayStyle = 'none'; // Chat does not have unread messages
                }
                break;
            case 'awaiting_reply':
                // Add logic to detect chats awaiting reply
                break;
            case 'needs_reply':
                // Add logic to detect chats that need a reply
                break;
            default:
                displayStyle = ''; // Show all chats
                break;
        }
        chat.style.display = displayStyle;
        console.log('Applying filter:', filterType, 'Display:', displayStyle);
    });
}

// Function to store contact details in local storage
function storeContactDetails(contactId, details) {
    const contacts = JSON.parse(localStorage.getItem('contacts') || '{}');
    contacts[contactId] = details;
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

// Function to save notes for a contact
function saveNoteForContact(contactId, note) {
    const contacts = JSON.parse(localStorage.getItem('contacts') || '{}');
    if (contacts[contactId]) {
        contacts[contactId].notes = note;
        localStorage.setItem('contacts', JSON.stringify(contacts));
    }
}

// Message listener for receiving filter commands from the popup
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    console.log('Received message for action:', request.action);
    if (request.action === "filterChats") {
        filterChats(request.filterType);
        sendResponse({status: "Success", message: "Filter applied: " + request.filterType});
    }
    return true; // This keeps the message channel open for async responses
});

// Function to add filter buttons directly into WhatsApp Web interface
function addFilterButtons() {
    // The selector for the header should be updated if WhatsApp changes their UI
    const header = document.querySelector('header'); // Simplified selector for demonstration
    if (header) {
        const filterContainer = document.createElement('div');
        filterContainer.style.cssText = 'margin-left: auto; display: flex; align-items: center; padding: 10px;';

        const buttonHTML = ['all', 'unread', 'awaiting_reply', 'needs_reply'].map(type => 
            `<button id="filter-${type}" style="margin-right: 8px;">${type.replace('_', ' ').toUpperCase()}</button>`
        ).join('');

        filterContainer.innerHTML = buttonHTML;
        header.appendChild(filterContainer);

        // Attach event listeners to buttons
        ['all', 'unread', 'awaiting_reply', 'needs_reply'].forEach(type => {
            document.getElementById(`filter-${type}`).addEventListener('click', () => filterChats(type));
        });
    }
}

// Ensure that the buttons are added after the page is fully loaded
if (document.readyState === "complete") {
    addFilterButtons();
} else {
    window.addEventListener('load', addFilterButtons);
}
