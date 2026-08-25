let customWeaponModalTemplate = null;
// Centralized state
const CustomWeaponState = {
    weaponTraits: [],
    damageTypes: [],
    editingWeaponElement: null,
};

async function loadInCustomWeaponModal() {
    // Load the custom weapon form and cache a template node
    try {
        const response = await fetch('InteractivePages/customWeaponModal.html');
        if (!response.ok) throw new Error('Failed to load modal template');
        const data = await response.text();
        const placeholder = document.getElementById('customWeaponModal-placeholder');
        if (!placeholder) return console.warn('Modal placeholder not found');
        placeholder.innerHTML = data;
        const modalNode = placeholder.firstElementChild;
        if (!modalNode) return console.warn('No modal content found in template');
        // Keep a clone in memory so we can insert copies without removing the placeholder
        customWeaponModalTemplate = modalNode.cloneNode(true);
    } catch (err) {
        console.error('Error loading custom weapon modal:', err);
    }
    loadWeaponTraits();
    loadDamageTypes();
}

// Function to fetch weapon traits from JSON
async function loadWeaponTraits() {
    try {
        const response = await fetch('sqlite/build/weaponTraits.json');
        if (!response.ok) {
            throw new Error('Failed to load weapon traits');
        }
        const data = await response.json();
        CustomWeaponState.weaponTraits = data.All || [];
    } catch (error) {
        console.error('Error loading weapon traits:', error);
    }
}

async function loadDamageTypes() {
    try {
        const response = await fetch('sqlite/build/damageTypes.json');
        if (!response.ok) {
            throw new Error('Failed to load damageTypes');
        }
        const data = await response.json();
        CustomWeaponState.damageTypes = data.All || [];
    } catch (error) {
        console.error('Error loading weapon damageTypes:', error);
    }
}

function insertCustomWeaponOptions(detailsElement) {
    if (!customWeaponModalTemplate) return console.warn('Modal template not loaded');
    // Insert a cloned instance of the modal template
    const node = customWeaponModalTemplate.cloneNode(true);
    detailsElement.appendChild(node);

    initializeTagInput();
    initializeDamageTypeDropdown();
    populateTraitsDropdown();
}

// Function to initialize the tag input
function initializeTagInput() {
    const tagInput = document.getElementById('tagInput');
    const traitsDropdown = document.getElementById('traitsDropdown');
    if (!tagInput || !traitsDropdown) return console.warn('Tag input or dropdown not found.');

    // Show dropdown on focus
    tagInput.addEventListener('focus', () => traitsDropdown.classList.add('show'));

    // Hide dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!traitsDropdown.contains(event.target) && event.target !== tagInput) {
            traitsDropdown.classList.remove('show');
        }
    });

    // Debounced filter for options
    const debounce = (fn, wait = 150) => {
        let t;
        return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); };
    };

    const filterOptions = () => {
        const input = tagInput.value.toLowerCase();
        const options = traitsDropdown.querySelectorAll('.trait-option');
        options.forEach(option => {
            const text = option.textContent.toLowerCase();
            option.style.display = text.includes(input) ? 'block' : 'none';
        });
    };

    tagInput.addEventListener('input', debounce(filterOptions, 120));

    // Handle Enter and comma to add tags
    tagInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ',') {
            event.preventDefault();
            const text = tagInput.value.trim();
            if (text) addTag(text);
        }
    });
}


// Initialize the damage type dropdown when the modal opens
function initializeDamageTypeDropdown() {
    const button = document.querySelector('.damage-type-button');
    if (button) {
        button.addEventListener('click', toggleDamageTypeDropdown);
    }
    populateDamageTypeDropdown(); // Populate the dropdown
}

// Close the dropdown when clicking outside
document.addEventListener('click', function(event) {
    const dropdown = document.getElementById('damageTypeOptions');
    const button = document.querySelector('.damage-type-button');

    if (dropdown && button && !dropdown.contains(event.target) && event.target !== button) {
        dropdown.classList.remove('show');
    }
});

// Function to populate the traits dropdown
function populateTraitsDropdown() {
    const dropdown = document.getElementById('traitsDropdown');
    if (!dropdown) return;
    dropdown.innerHTML = '';

    CustomWeaponState.weaponTraits.forEach(trait => {
        const option = document.createElement('div');
        option.className = 'trait-option';
        option.dataset.name = trait.name;
        option.innerHTML = trait.name + ' <span class="traitEffect"> - ' + trait.effect + '</span>';
        dropdown.appendChild(option);
    });

    // Event delegation for selecting traits
    dropdown.removeEventListener('__trait_click__', dropdown.__trait_click_handler__);
    const handler = (e) => {
        const opt = e.target.closest('.trait-option');
        if (opt && opt.dataset.name) selectTrait(opt.dataset.name);
    };
    dropdown.addEventListener('click', handler);
    dropdown.__trait_click_handler__ = handler;
}

// Function to populate the damage type dropdown
function populateDamageTypeDropdown() {
    const dropdown = document.getElementById('damageTypeOptions');
    if (!dropdown) return;
    dropdown.innerHTML = '';

    CustomWeaponState.damageTypes.forEach(type => {
        const option = document.createElement('div');
        option.className = 'damage-type-option';
        option.dataset.name = type.name;
        option.textContent = type.name;
        dropdown.appendChild(option);
    });

    // Event delegation for damage type selection
    dropdown.removeEventListener('__damage_click__', dropdown.__damage_click_handler__);
    const dmgHandler = (e) => {
        const opt = e.target.closest('.damage-type-option');
        if (opt && opt.dataset.name) selectDamageType(opt.dataset.name);
    };
    dropdown.addEventListener('click', dmgHandler);
    dropdown.__damage_click_handler__ = dmgHandler;
}

// Function to select a damage type
function selectDamageType(type) {
    const damageInput = document.querySelector('.customWeaponDamage');
    if (!damageInput) return;
    const currentValue = damageInput.value.trim();
    if (currentValue && !currentValue.includes(type)) {
        damageInput.value = `${currentValue} ${type}`;
    } else if (!currentValue) {
        damageInput.value = type;
    }
    const opts = document.getElementById('damageTypeOptions');
    if (opts) opts.classList.remove('show');
}

// Function to toggle the damage type dropdown
function toggleDamageTypeDropdown() {
    const dropdown = document.getElementById('damageTypeOptions')
    dropdown.classList.toggle('show');
}

function escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Returns { trait, value } where value is the captured replacement for X (if any)
function findTraitByLabel(label) {
    const trimmedLabel = (label || '').trim();
    if (!trimmedLabel) return { trait: null, value: null };

    // Exact name match
    const exact = CustomWeaponState.weaponTraits.find(trait => trait.name === trimmedLabel);
    if (exact) return { trait: exact, value: null };

    // Try to match traits where the name contains an 'X' placeholder
    for (const trait of CustomWeaponState.weaponTraits) {
        if (!trait.name || !trait.name.includes('X')) continue;
        // Build a regex where X is replaced with a capture group
        const pattern = '^' + escapeRegex(trait.name).replace(/X/g, '(.+?)') + '$';
        const re = new RegExp(pattern);
        const m = trimmedLabel.match(re);
        if (m) {
            // capture group(s) correspond to each X occurrence; join them if multiple
            const captured = m.slice(1).join(',');
            return { trait, value: captured };
        }
    }

    // Fallback: try base name matching (e.g., "Slowing (2)" vs "Slowing (X)")
    const baseName = trimmedLabel.replace(/\s*\([^)]*\)\s*$/, '').trim();
    const found = CustomWeaponState.weaponTraits.find(trait => {
        const traitBaseName = (trait.name || '').replace(/\s*\([^)]*\)\s*$/i, '').trim();
        return traitBaseName === baseName;
    });
    return { trait: found || null, value: null };
}

function formatTraitLabel(trait, value) {
    if (!trait) return value || '';
    if (trait.modifiable === 'Yes') {
        const v = value !== null && value !== undefined ? String(value) : '';
        // Replace all X placeholders in the trait name with the provided value
        return trait.name.replace(/X/g, v);
    }
    return trait.name;
}

function getTraitTooltipText(trait, value) {
    if (!trait) return '';
    const displayValue = value !== null && value !== undefined && value !== '' ? String(value) : 'X';
    return {
        effect: trait.effect ? trait.effect.replace(/X/gi, displayValue) : trait.effect,
        specialAction: trait.specialAction ? trait.specialAction.replace(/X/gi, displayValue) : trait.specialAction,
    };
}

// Select a trait from the dropdown
function selectTrait(traitName) {
    const trait = CustomWeaponState.weaponTraits.find(candidate => candidate.name === traitName);

    if (trait?.modifiable === 'Yes') {
        const userValue = window.prompt(`Enter a value for ${traitName}:`, '1');
        if (userValue === null) return;

        const parsedValue = userValue.trim();
        if (!/^\d+$/.test(parsedValue)) {
            window.alert('Please enter a whole number.');
            return;
        }

        addTag(formatTraitLabel(trait, parsedValue));
    } else {
        addTag(traitName);
    }

    document.getElementById('traitsDropdown').classList.remove('show');
    document.getElementById('tagInput').focus();
}

// Add a tag (predefined or custom)
function addTag(text) {
    const tagContainer = document.getElementById('selectedTags');
    if (!tagContainer) return;

    const normalizedText = (text || '').trim();
    if (!normalizedText) return;

    const existingTags = Array.from(tagContainer.querySelectorAll('.tag')).map(tag => tag.dataset.value || '');
    if (existingTags.includes(normalizedText)) return;

    const traitInfo = findTraitByLabel(normalizedText);
    const trait = traitInfo.trait;
    // prefer captured value from findTraitByLabel, fallback to parentheses content
    const fallbackValue = normalizedText.match(/\(([^)]+)\)$/)?.[1] || null;
    const valueToUse = traitInfo.value || fallbackValue;
    const displayText = trait ? formatTraitLabel(trait, valueToUse) : normalizedText;
    const tooltipText = getTraitTooltipText(trait, valueToUse);

    const tag = document.createElement('div');
    tag.className = 'tag';
    tag.dataset.value = displayText;

    if (trait) {
        tag.setAttribute('title', `Effect: ${tooltipText.effect || ''}\nSpecial Action: ${tooltipText.specialAction || ''}`);
    }

    const label = document.createElement('span');
    label.className = 'tag-label';
    label.textContent = displayText;
    tag.appendChild(label);

    const close = document.createElement('span');
    close.className = 'tag-close';
    close.textContent = '×';
    close.addEventListener('click', () => removeTag(close));
    tag.appendChild(close);

    tagContainer.appendChild(tag);
    const input = document.getElementById('tagInput');
    if (input) input.value = '';
}

// Remove a tag
function removeTag(element) {
    element.parentElement.remove();
}

// Handle custom tag input (comma/enter)
function handleTagInput(event) {
    // kept for backwards compatibility; main listeners are attached in initializeTagInput
    if (event.key === 'Enter' || event.key === ',') {
        event.preventDefault();
        const input = document.getElementById('tagInput');
        const text = input ? input.value.trim() : '';
        if (text) addTag(text);
    }
}

// editing element tracked in state
// let editingWeaponElement = null;

// Function to open custom weapon modal for editing
function editCustomWeapon(weaponElement) {
    CustomWeaponState.editingWeaponElement = weaponElement;
    const modal = document.getElementById('customWeaponModal');
    const form = modal.querySelector('.customWeaponForm');

    populateEditForm(weaponElement, form);

    // Open the modal
    modal.style.display = 'block';
    initializeTagInput();
};

// Helper function to populate the edit form
function populateEditForm(weaponElement, form) {
    // Get weapon data
    const weaponName = weaponElement.querySelector('.actual-name').textContent.trim();
    const damage = weaponElement.getAttribute('data-damage') || '';
    const hands = weaponElement.getAttribute('data-hands') || '';
    const range = weaponElement.getAttribute('data-range') || '';
    const traits = weaponElement.getAttribute('data-traits') || '';
    const description = weaponElement.getAttribute('data-description') || '';
    const price = weaponElement.getAttribute('data-price') || '';
    const type = weaponElement.getAttribute('data-type') || '';
    const weaponGroup = weaponElement.getAttribute('data-weaponGroup') || '';

    // Populate form fields
    form.querySelector('.customWeaponName').value = weaponName;
    form.querySelector('.customWeaponDamage').value = damage;
    form.querySelector('.customWeaponHands').value = hands;
    form.querySelector('.customWeaponRange').value = range;
    form.querySelector('.customWeaponDescription').value = description;
    form.querySelector('.customWeaponPrice').value = price;
    form.querySelector('.customWeaponType').value = type;
    form.querySelector('.customWeaponGroup').value = weaponGroup;

    // Clear existing tags
    const selectedTagsContainer = document.getElementById('selectedTags');
    if (selectedTagsContainer) selectedTagsContainer.innerHTML = '';

    // Add each trait as a tag
    if (traits) {
        traits.split(',').forEach(trait => {
            const traitText = trait.trim();
            if (traitText) {
                addTag(traitText);
            }
        });
    }
}

// Handle form submission for custom weapon
function finishCustomWeapon(button) {
    const modal = button.closest('.modal');
    const form = modal.querySelector('.customWeaponForm');

    // Collect selected tags
    const selectedTags = Array.from(document.querySelectorAll('#selectedTags .tag'));
    const traits = selectedTags.map(tag => tag.dataset.value || '').filter(Boolean).join(',');

    const weapon = {
        name: form.querySelector('.customWeaponName').value,
        damage: form.querySelector('.customWeaponDamage').value,
        hands: form.querySelector('.customWeaponHands').value,
        range: form.querySelector('.customWeaponRange').value,
        traits: traits, // Use the collected traits
        description: form.querySelector('.customWeaponDescription').value,
        price: form.querySelector('.customWeaponPrice').value,
        type: form.querySelector('.customWeaponType').value,
        weaponGroup: form.querySelector('.customWeaponGroup').value,
        isCustom: true,
    };
    //console.log("Inputted custom weapon " + weapon.name + " with damage " + weapon.damage);

    // If editing an existing weapon, update it in place
    if (CustomWeaponState.editingWeaponElement) {
        const editingWeaponElement = CustomWeaponState.editingWeaponElement;
        editingWeaponElement.querySelector('.actual-name').textContent = weapon.name;
        editingWeaponElement.setAttribute('data-damage', weapon.damage);
        editingWeaponElement.setAttribute('data-description', weapon.description);
        editingWeaponElement.setAttribute('data-hands', weapon.hands);
        editingWeaponElement.setAttribute('data-range', weapon.range);
        editingWeaponElement.setAttribute('data-type', weapon.type);
        editingWeaponElement.setAttribute('data-weaponGroup', weapon.weaponGroup);
        editingWeaponElement.setAttribute('data-traits', weapon.traits);

        // Update tooltip content
        const tooltip = editingWeaponElement.querySelector('.tooltip');
        if (tooltip) tooltip.innerHTML = window.createWeaponTooltipContent(weapon);

        CustomWeaponState.editingWeaponElement = null;
    } else {
        // Use the generic addItemToCharacter function for new weapons
        onChooseItem(weapon, 'weapon');
    }

    // Close the modal and reset the form
    closeModal();
    form.reset();
    document.getElementById('selectedTags').innerHTML = ''; // Clear tags
};

