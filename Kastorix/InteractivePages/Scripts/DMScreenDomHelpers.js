function findCreatureContainer(event) {
    let container;
    if (event && event.target) {
        container = event.target.closest('.creature-container');
    } else {
        container = document.querySelector('.creature-container');
    }
    if (!container) {
        alert('No creature container found.');
        return;
    }
    else {
        return container;
    }
}

// Helper function to escape HTML special characters
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function findElementByTextContent(root, selector, text) {
    const elements = root.querySelectorAll(selector);
    for (let element of elements) {
        if (element.textContent.includes(text)) {
            return element;
        }
    }
    return null;
}

// Helper function to set the active proficiency button
function setActiveProficiencyButton(weaponEntry, proficiency) {
    const buttons = weaponEntry.querySelectorAll('.proficiency-button');
    buttons.forEach(btn => btn.classList.remove('active'));
    const proficiencyMap = { 0: 0, 2: 1, 4: 2, 6: 3, 8: 4 };
    const activeButtonIndex = proficiencyMap[proficiency] || 0;
    if (buttons[activeButtonIndex]) {
        buttons[activeButtonIndex].classList.add('active');
    }
}