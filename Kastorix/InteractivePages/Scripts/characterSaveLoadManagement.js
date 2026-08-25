function getStoredCharacters() {
    try {
        const stored = JSON.parse(localStorage.getItem('ttrpgCharacters') || '[]');
        return Array.isArray(stored) ? stored : [];
    } catch (error) {
        console.error('Error reading saved characters:', error);
        return [];
    }
}

function saveStoredCharacters(characters) {
    localStorage.setItem('ttrpgCharacters', JSON.stringify(characters));
}

function getInputValue(elementId, fallback = '') {
    const element = document.getElementById(elementId);
    return element ? element.value : fallback;
}

function setInputValue(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) {
        element.value = value ?? '';
    }
}

function getCharacterValue(charData, key, fallback = '') {
    return charData?.[key] ?? fallback;
}

function getCharacterByName(charName, characters = getStoredCharacters()) {
    return (characters || []).find(char => char.name === charName);
}

function saveSheet() {
    const charName = getInputValue('charName');
    if (!charName) {
        alert('Please enter a character name.');
        return;
    }

    const selectedFeats = [];
    document.querySelectorAll('button[data-selected-feat]').forEach(button => {
        // Extract the onclick attribute
        const level = button.getAttribute('level');

        const type = button.getAttribute('type');
        if (leftSideOptions.includes(type)) {
            selectedFeats.push({
                name: button.getAttribute('data-selected-feat'),
                type: type,
                level: level,
                id: button.id,
                selectedChoice: button.getAttribute('choice'),
            });
        }
    });

    // Save unlocked feats
    const unlockedFeats = {};
    document.querySelectorAll('button[data-unlocked-by]').forEach(button => {
        const sourceFeat = button.getAttribute('data-unlocked-by');
        const unlockedFeatName = button.getAttribute('data-selected-feat') || button.textContent.trim();
        if (!unlockedFeats[sourceFeat]) unlockedFeats[sourceFeat] = [];
        unlockedFeats[sourceFeat].push({
            name: unlockedFeatName,
            id: button.id,
        });
    });

    const charData = {
        name: charName,
        featsState: {
            selected: selectedFeats,
            unlocked: unlockedFeats
        },
        species: characterState.selectedSpecies,
        backgrounds: characterState.backgrounds,
        advantages: characterState.advantages,
        arcaneFeats: characterState.arcaneFeats,
        generalFeats: characterState.generalFeats,
        spellsByRank: characterState.spellsByRank,
        weapons: characterState.weapons,
        metamagics: characterState.metamagics,
        combatManeuvers: characterState.combatManeuvers,
        gadgets: characterState.gadgets,
        armor: characterState.currentArmor,
        golemUpgrades: characterState.golemUpgrades,
        runegunUpgrades: characterState.runegunUpgrades,
        armorUpgrades: characterState.armorUpgrades,

        level: characterState.characterLevel,
        initiative: characterState.initiative,

        health: characterState.health,
        aura: characterState.aura,
        mana: characterState.mana,
        stats: {
            phy: characterState.phy,
            dex: characterState.dex,
            int: characterState.int,
            wil: characterState.wil
        },
        resistances: characterState.resistances,
        speeds: characterState.speeds,
        senses: characterState.senses,

        saves: characterState.saves,
        skills: characterState.skillProficiencies,
        status: characterState.statuses,

        inventory: characterState.inventory,
    };

    let characters = getStoredCharacters();
    const existingIndex = characters.findIndex(char => char.name === charName);
    if (existingIndex >= 0) {
        characters[existingIndex] = charData;
    } else {
        characters.push(charData);
    }
    saveStoredCharacters(characters);
    alert(`Character "${charName}" saved!`);
}

async function loadSheet() {
    const charName = getInputValue('charName');
    if (!charName) {
        alert('Please enter a character name to load.');
        return;
    }

    // Clear all lists and global state before loading
    clearLists();
    clearButtons();

    const characters = JSON.parse(localStorage.getItem('ttrpgCharacters')) || [];
    const charData = characters.find(char => char.name === charName);
    if (!charData) {
        alert(`No saved character found with the name "${charName}".`);
        return;
    }

    // --- Load feats 
    try {
        if (charData.featsState?.selected) {
            for (const feat of charData.featsState.selected) {
                if (feat.id.startsWith("dynamic_")) continue;
                const button = document.getElementById(feat.id);
                if (button) {
                    loadInButton(feat, button);
                } else {
                    console.warn(`Button not found for feat: ${feat.name}, id: ${feat.id}`);
                }
            }
            // Process dynamic feats
            for (const feat of charData.featsState.selected) {
                if (feat.id.startsWith("dynamic_")) {
                    const button = document.getElementById(feat.id);
                    if (button) {
                        loadInButton(feat, button);
                    } else {
                        console.warn(`Button not found for dynamic feat: ${feat.name}, id: ${feat.id}`);
                    }
                }
            }
        }
    } catch (error) {
        console.error('Error loading feats:', error);
    }

    // --- Load basic fields ---
    try {
        setInputValue('charName', charName);
        characterState.characterLevel = getCharacterValue(charData, 'level', 0);
        setInputValue('level', characterState.characterLevel);
        setInputValue('initiative', getCharacterValue(charData, 'initiative', 0));
        setInputValue('passivePerception', getCharacterValue(charData, 'passivePerception', 0));
        setInputValue('passiveManasense', getCharacterValue(charData, 'passiveManasense', 0));
        setInputValue('preciseSenses', getCharacterValue(charData, 'preciseSenses', 'Sight'));
        setInputValue('impreciseSenses', getCharacterValue(charData, 'impreciseSenses', 'Hearing'));
        setInputValue('vagueSenses', getCharacterValue(charData, 'vagueSenses', 'Smell'));
    } catch (error) {
        console.error('Error loading basic fields:', error);
    }

    // --- Load stats ---
    try {
        setInputValue('phy', getCharacterValue(charData?.stats, 'phy', 0));
        setInputValue('dex', getCharacterValue(charData?.stats, 'dex', 0));
        setInputValue('int', getCharacterValue(charData?.stats, 'int', 0));
        setInputValue('wil', getCharacterValue(charData?.stats, 'wil', 0));
    } catch (error) {
        console.error('Error loading stats:', error);
    }

    // --- Load resistances and speeds ---
    try {
        characterState.resistances = charData?.resistances || {};
        characterState.speeds = charData?.speeds || {};
    } catch (error) {
        console.error('Error loading resistances/speeds:', error);
    }

    // --- Load skill proficiencies ---
    try {
        characterState.skillProficiencies = charData.skills || {};
        characterState.saves = charData.saves || {};
        addExtraSkills(characterState.skillProficiencies);
        updateSkillModifiers(characterState.phy, characterState.dex, characterState.int, characterState.wil, characterState.skillProficiencies, null, characterState.currentArmor);
    } catch (error) {
        console.error('Error loading skill proficiencies:', error);
    }

    // --- Load armor ---
    try {
        if (charData.armor) {
            const button = document.getElementById("SelectedArmor");
            loadInButton(charData.armor, button, "armor");
        }
    } catch (error) {
        console.error('Error loading armor:', error);
    }

    // --- Load statuses ---
    try {
        characterState.statuses = charData.statuses || {};
    } catch (error) {
        console.error('Error loading statuses:', error);
    }

    // --- Load collections (weapons, metamagics, etc.) ---
    try {
        loadCollection(charData, 'weapons', 'weapon');
        loadCollection(charData, 'metamagics', 'metamagic');
        loadCollection(charData, 'combatManeuvers', 'combatManeuvers');
        loadCollection(charData, 'gadgets', 'gadgets');
    } catch (error) {
        console.error('Error loading collections:', error);
    }

    // --- Load spells ---
    try {
        loadInAllSpells(charData);
    } catch (error) {
        console.error('Error loading spells:', error);
    }

    // --- Do calculations ---
    try {
        updateOnStatIncrease();
    } catch (error) {
        console.error('Error in calculations:', error);
    }

    // --- Load inventory ---
    try {
        characterState.inventory = charData.inventory || {};
        setInputValue('heldItems', characterState.inventory.heldItems || "");
        setInputValue('quickAccessItems', characterState.inventory.quickAccessItems || "");
        setInputValue('equipment', characterState.inventory.equipment || "");
        setInputValue('notes', characterState.inventory.notes || "");
        setInputValue('languages', characterState.inventory.languages || "");
        setInputValue('gold', characterState.inventory.gold || "0");
        setInputValue('silver', characterState.inventory.silver || "0");
    } catch (error) {
        console.error('Error loading inventory:', error);
    }

    // --- Load health and mana ---
    try {
        setHealth(charData.health);
        setManaAndAura(charData.mana, charData.aura);
    } catch (error) {
        console.error('Error loading health/mana:', error);
    }

    alert(`Character "${charName}" loaded!`);
}

function clearButtons() {
    document.querySelectorAll('[data-selected-feat]').forEach(resetButtonAppearance);
}

function addExtraSkills() {
    for (const skill of Object.keys(characterState.skillProficiencies)) {
        let skillContainer = document.querySelector(`[data-skill-type="${skill}"]`);
        if (skillContainer) {
            //console.log("Skill " + skill + " has container")
        }
        else {
            //console.log("Skill " + skill + " lacks container")
            const words = skill.split(' ');
            // Remove the last word ("Lore")
            const skillBase = words.slice(0, -1).join(' ');
            // Capitalize the first letter of each word
            const formattedSkillName = skillBase.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            addLoreSkill(formattedSkillName, false);
        }
    };
}

function loadInButton(feat, button, featType = feat.type) {
    const actualFeat = getItemByName(feat.name, featType)
    //console.log("Found feat " + feat.name + " of type " + featType)
    currentTargetButton = button;
    let selectedChoiceItem = null;
    if (feat.selectedChoice) {
        const choiceType = actualFeat.choice.split(" - ")[0].toLowerCase();
        selectedChoiceItem = getItemByName(feat.selectedChoice, choiceType)
    }
    if (actualFeat) {
        onChooseItem(actualFeat, featType, null, selectedChoiceItem);
    }
    else {
        console.error("Can't find feat " + feat.name);
    }
}

 function getItemByName(name, type) {
    const items = globalData[type]
    const foundItem = items.find(item => item.name === name);
    if (foundItem) {
        //console.log(`Found Item "${name}" in ${type} data.`);
        return foundItem;
    }
}

// Delete a character
function deleteSheet() {
    const charName = getInputValue('charName');
    if (!charName) {
        alert('Please enter a character name to delete.');
        return;
    }

    let characters = getStoredCharacters();
    const updatedCharacters = characters.filter(char => char.name !== charName);

    if (updatedCharacters.length === characters.length) {
        alert(`No saved character found with the name "${charName}".`);
    } else {
        saveStoredCharacters(updatedCharacters);
        alert(`Character "${charName}" deleted!`);
    }
}

/* // Populate the character list dropdown
function populateCharacterList() {
    const characterList = document.getElementById('characterList');
    characterList.innerHTML = '<option value="">Select a character...</option>';

    const characters = JSON.parse(localStorage.getItem('ttrpgCharacters')) || [];
    characters.forEach(char => {
        const option = document.createElement('option');
        option.value = char.name;
        option.textContent = char.name;
        characterList.appendChild(option);
    });
} */

// Load the selected character from the dropdown
function loadSelectedCharacter() {
    const characterList = document.getElementById('characterList');
    const charName = characterList.value;
    if (!charName) {
        alert('Please select a character to load.');
        return;
    }

    setInputValue('charName', charName);
    loadSheet();
}

// Export character as a JSON file
function exportCharacter() {
    const charName = getInputValue('charName');
    if (!charName) {
        alert('Please enter a character name to export.');
        return;
    }

    const characters = JSON.parse(localStorage.getItem('ttrpgCharacters')) || [];
    const charData = characters.find(char => char.name === charName);

    if (!charData) {
        alert(`No saved character found with the name "${charName}".`);
        return;
    }

    const jsonStr = JSON.stringify(charData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `${charName}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Async import character from a JSON file
async function importCharacter(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(e) {
        try {
            const charData = JSON.parse(e.target.result);
            // Get existing characters or initialize an empty array
            let characters = getStoredCharacters();
            // Check if a character with this name already exists
            const existingIndex = characters.findIndex(char => char.name === charData.name);
            if (existingIndex >= 0) {
                // Update existing character
                characters[existingIndex] = charData;
            } else {
                // Add new character
                characters.push(charData);
            }
            // Save the updated array back to localStorage
            saveStoredCharacters(characters);
            alert(`Character "${charData.name}" imported!`);

            // Load the imported character sheet
            setInputValue('charName', charData.name);
            await loadSheet();
        } catch (error) {
            alert('Error importing character: ' + error.message);
        }
    };
    reader.readAsText(file);
}