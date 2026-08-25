
function deleteCreature(button) {
    // Find the current creature container
    const index = button.dataset.creatureIndex;
    const container = document.querySelector(`.creature-container[data-creature-index="${index}"]`);
    if (!container) return alert('No creature container found.');

    const select = container.querySelector('#creatureSelect');
    const name = select.value;
    if (!name) return alert('No creature selected.');

    console.log("deleting creature" + name)
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) return;

    let savedCreatures = JSON.parse(localStorage.getItem('ttrpgCreatures')) || [];
    savedCreatures = savedCreatures.filter(c => c.name !== name);
    localStorage.setItem('ttrpgCreatures', JSON.stringify(savedCreatures));
    alert(`Creature "${name}" deleted!`);

    // Refresh dropdowns in all containers
    populateCreatureSelect();
}

// Import Creature from a JSON file
function importCreature(event, button) {
    const file = event.target.files[0];
    if (!file) return;

    const index = button.dataset.creatureIndex;
    const container = document.querySelector(`.creature-container[data-creature-index="${index}"]`);
    const reader = new FileReader();
    reader.onload = function (e) {
        try {
            const charData = JSON.parse(e.target.result);
            const creatures = JSON.parse(localStorage.getItem('ttrpgCreatures')) || [];
            const existingIndex = creatures.findIndex(c => c.name === charData.name);
            if (existingIndex >= 0) {
                creatures[existingIndex] = charData;
            } else {
                creatures.push(charData);
            }
            localStorage.setItem('ttrpgCreatures', JSON.stringify(creatures));
            populateCreatureSelect();
            alert(`Creature "${charData.name}" imported!`);
            loadCreature(container, charData);
        } catch (error) {
            alert('Error importing creature: ' + error.message);
        }
    };
    reader.readAsText(file);
}

function addNewCreature() {
    // Clone the template
    const template = document.getElementById('creatureTemplate');
    const clone = template.content.cloneNode(true);

    // Insert the clone into the DOM
    const sidebar = document.querySelector('.sidebar');
    document.querySelector('.container').insertBefore(clone, sidebar);

    // Get the newly added creature container
    const containers = document.querySelectorAll('.creature-container');
    const newContainer = containers[containers.length - 1];

    // Add creature to window.creatures and set data attributes
    const creatureIndex = window.creatures.length;
    const creatureObject = createCreatureVariables(creatureIndex);
    window.creatures.push(creatureObject);

    newContainer.querySelectorAll('[data-creature-index]').forEach(field => {
        field.setAttribute('data-creature-index', creatureIndex);
    });
    newContainer.setAttribute('data-creature-index', creatureIndex);

    // Initialize bars 
    ['health', 'aura', 'mana'].forEach(type => updateBar(type, newContainer, null, creatureIndex));
    //Set up listeners 
    setUpListenersForCreature(newContainer, creatureIndex);

    // Initialize Select2 for actions in the new container
    newContainer.querySelectorAll('.image-select').forEach(select => {
        if (!$(select).data('select2')) {
            $(select).select2({
                templateResult: formatOption,
                templateSelection: formatOptionSelection,
                escapeMarkup: function (m) { return m; }
            });
        }
    });

    // Update container IDs
    let strikesContainer = newContainer.querySelector('#weaponsContainer');
    strikesContainer.id = 'weaponsContainer' + creatureIndex;
    generateCollectionButtons(strikesContainer.id, 0, 'weapons', null, creatures[creatureIndex]);

    let actionsContainer = newContainer.querySelector('#actionsContainer');
    actionsContainer.id = 'actionsContainer' + creatureIndex;

    let passivesContainer = newContainer.querySelector('#passivesContainer');
    passivesContainer.id = 'passivesContainer' + creatureIndex;

    // Generate spell collection buttons
    Object.keys(COLLECTION_CONFIGS.spells.ranks).forEach(rank => {
        let spellContainer = newContainer.querySelector(`#${COLLECTION_CONFIGS.spells.ranks[rank].containerId}`);
        spellContainer.id = COLLECTION_CONFIGS.spells.ranks[rank].containerId + creatureIndex;
        const count = creatureObject.spellsByRank?.[rank]?.length || 0;
        generateCollectionButtons(spellContainer.id, count, 'spells', rank, creatures[creatureIndex]);
    });

    // Populate creature select and other dropdowns
    populateCreatureSelect();
    initializeDropdown(newContainer, 'size-button', 'size-option', sizes, 'size', creatureIndex);
}

// Export creature as a JSON file
function exportCreature(button) {
    const creatureIndex = button.dataset.creatureIndex;
    const creature = creatures[creatureIndex];

    if (creature == null) {
        console.warn("Can't find creature")
        return;
    }
    else if (creature.name == "") {
        console.warn("Can't find creature name")
        return;
    }

    const jsonStr = JSON.stringify(creature, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${creature.name}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function saveCreature(button) {
    const creatureIndex = button.dataset.creatureIndex;
    const creature = creatures[creatureIndex];

    if (!creature.name) {
        alert('Please enter a creature name.');
        return;
    }

    let savedCreatures = JSON.parse(localStorage.getItem('ttrpgCreatures')) || [];
    const existingIndex = savedCreatures.findIndex(savedCreature => savedCreature.name === creature.name);

    if (existingIndex >= 0) {
        savedCreatures[existingIndex] = creature;
    } else {
        savedCreatures.push(creature);
    }
    localStorage.setItem('ttrpgCreatures', JSON.stringify(savedCreatures));
    alert(`Character "${creature.name}" saved!`);
}

// Populate the dropdown with saved creatures
function populateCreatureSelect() {
    // Find all creatureSelect dropdowns on the page
    document.querySelectorAll('.creature-container #creatureSelect').forEach(select => {
        select.innerHTML = '';
        const creatures = JSON.parse(localStorage.getItem('ttrpgCreatures')) || [];
        creatures.forEach(c => {
            const option = document.createElement('option');
            option.value = c.name;
            option.textContent = c.name;
            select.appendChild(option);
        });
    });
}

// Refactored loadCreature
function loadCreature(button, creatureData) {
    const index = button.dataset.creatureIndex;
    const container = document.querySelector(`.creature-container[data-creature-index="${index}"]`);
    const creature = creatures[index];
    if (!container || !creature) return;

    // Resolve creatureData from dropdown if needed
    if (!creatureData) {
        const select = container.querySelector('#creatureSelect');
        if (!select) return alert('Creature select not found.');
        const name = select.value;
        creatureData = (JSON.parse(localStorage.getItem('ttrpgCreatures')) || []).find(c => c.name === name);
        if (!creatureData) return alert('Creature not found.');
    }

    // Property defaults
    const defaults = {
        name: '', phy: 0, dex: 0, int: 0, wil: 0, speeds: 0,
        health: 10, maxHealth: 10, mana: 10, maxMana: 10, aura: 10, maxAura: 10,
        traits: '', senses: '', languages: '', skills: '', size: '', resistances: '', equipment: '', notes: '',
        saves: {}, actions: [], passives: []
    };

    // Update creature and DOM in one pass
    Object.keys(defaults).forEach(prop => {
        creature[prop] = creatureData[prop] ?? defaults[prop];
        const el = container.querySelector(`[data-property="${prop}"]`);
        if (el) el.value = creature[prop];
    });

    updateOnStatIncrease(index);
    loadCollection(creatureData, 'weapons', 'weapon', null, creature);
    loadInAllSpells(creatureData, creature);

    // Generic loader for actions/passives
    const loadItems = (items, templateId, containerId, fieldMap) => {
        const actionPassivesContainer = document.getElementById(containerId + index);
        if (!actionPassivesContainer) return;
        actionPassivesContainer.innerHTML = '';
        (items || []).forEach(item => {
            const clone = document.getElementById(templateId).content.cloneNode(true);
            Object.entries(fieldMap).forEach(([key, sel]) => {
                const el = clone.querySelector(sel);
                if (el) el.value = item[key] || '';
            });
            actionPassivesContainer.appendChild(clone);
        });
        // Initialize Select2 immediately
        actionPassivesContainer.querySelectorAll('.image-select').forEach(s => {
            if (!$(s).data('select2')) {
                $(s).select2({ templateResult: formatOption, templateSelection: formatOptionSelection, escapeMarkup: m => m });
            }
        });
    };

    loadItems(creatureData.actions, 'actionTemplate', 'actionsContainer', {
        name: '.actionName', actions: '.image-select', requirement: '.actionRequirement', effect: '.actionEffect'
    });
    loadItems(creatureData.passives, 'passiveTemplate', 'passivesContainer', {
        name: '.passiveName', requirement: '.passiveRequirement', effect: '.passiveEffect'
    });
}