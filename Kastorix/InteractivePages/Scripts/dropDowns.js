async function loadJSON(jsonName) {
    try {
        const fetchAddress = 'sqlite/build/' + jsonName + '.json'
        const response = await fetch(fetchAddress);
        if (!response.ok) {
            throw new Error("Failed to load " + jsonName);
        }
        const data = await response.json();
        return data.All; // Return the data
    } catch (error) {
        console.error("Error loading " + jsonName + ": " + error);
        return null; // Or throw the error
    }
}

// Initialize the dropdown when the modal opens
function initializeDropdown(container, dropdownButtonClass, optionClassName, array, propertyName, creatureIndex) {
    const button = container.querySelector('.' + dropdownButtonClass);
    if (button) {
        button.onclick = function(event) {
            toggleDropDown(event);
        };
    } else {
        console.warn("Can't setup dropdown button");
    }
    populateDropdown(container, optionClassName, array, propertyName, creatureIndex);
}

function populateDropdown(container, optionClassName, array, propertyName, creatureIndex) {
    const dropdown = container.querySelector('.' + optionClassName + "s");
    dropdown.innerHTML = ''; // Clear existing options
    array.forEach(type => {
        const option = document.createElement('div');
        option.className = optionClassName;
        option.textContent = type.name;
        option.onclick = () => selectProperty(propertyName, type.name, creatureIndex, container);
        dropdown.appendChild(option);
    });
}

function selectProperty(propertyName, value, creatureIndex, container) {
    //console.log("Set property " + propertyName + " to " + value + " for creatureIndex " + creatureIndex)
    // Update the creature's property
    if (window.creatures && window.creatures[creatureIndex]) {
        window.creatures[creatureIndex][propertyName] = value;
    }

    // Update the UI: button text
    const button = container.querySelector(`.${propertyName}-button`);
    if (button) {
        button.textContent = value + ' ▼';
    }

    // Update the UI: input field (if it exists)
    const inputField = container.querySelector(`[data-property="${propertyName}"]`);
    if (inputField) {
        inputField.value = value;
    }

    // Hide the dropdown after selection
    const dropdown = container.querySelector(`.${propertyName}-options`);
    if (dropdown) {
        dropdown.classList.remove('show');
    }
}


function toggleDropDown(event) {
    const button = event.currentTarget;
    const dropdown = button.nextElementSibling; // Assumes the dropdown is the next sibling
    dropdown.classList.toggle('show');
}