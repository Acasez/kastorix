"use strict";

function resetInputFields() {
    document.getElementById('phy').value = 0;
    document.getElementById('dex').value = 0;
    document.getElementById('int').value = 0;
    document.getElementById('wil').value = 0;
}

function updateAllInventoryFields() {
    updateInventoryField('heldItems', 'heldItems');
    updateInventoryField('quickAccessItems', 'quickAccessItems');
    updateInventoryField('equipment', 'equipment');
    updateInventoryField('gold', 'gold');
    updateInventoryField('silver', 'silver');
    updateInventoryField('notes', 'notes');
    updateInventoryField('languages', 'languages');
}

function findElementsByText(selector, text) {
    const elements = document.querySelectorAll(selector);
    return Array.from(elements).filter(el => el.textContent.includes(text));
}

function updateBar(type) {
    const currentInput = document.getElementById(type);
    const maxInput = document.getElementById(`max${type.charAt(0).toUpperCase() + type.slice(1)}`);
    const bar = document.getElementById(`${type}Bar`);

    const currentValue = parseInt(currentInput?.value || 0, 10) || 0;
    const maxValue = parseInt(maxInput?.value || 0, 10) || 0;

    if (maxValue <= 0) {
        if (bar) bar.style.width = '0%';
        return;
    }

    const safeCurrent = Math.min(currentValue, maxValue);
    if (currentValue > maxValue) {
        currentInput.value = maxValue;
    }

    const percentage = (safeCurrent / maxValue) * 100;
    if (bar) bar.style.width = `${Math.max(0, Math.min(100, percentage))}%`;
}

function updateCollectionCountDisplay(collectionKey) {
    const count = window[collectionKey]?.length || 0;
    const countElement = document.getElementById(`${collectionKey}Count`);
    if (countElement) countElement.textContent = count;
}
