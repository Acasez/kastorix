const creatureDomCache = new Map();

function getCreatureDomContext(creatureIndex) {
    const cachedContext = creatureDomCache.get(creatureIndex);
    const container = document.querySelector(`.creature-container[data-creature-index="${creatureIndex}"]`);

    if (!container) {
        return null;
    }

    if (cachedContext && cachedContext.container === container) {
        return cachedContext;
    }

    const newContext = {
        container,
        buttonCache: new Map()
    };

    creatureDomCache.set(creatureIndex, newContext);
    return newContext;
}

function getCreatureButton(creatureIndex, itemName) {
    const context = getCreatureDomContext(creatureIndex);
    if (!context) {
        return null;
    }

    if (!context.buttonCache.has(itemName)) {
        context.buttonCache.set(itemName, context.container.querySelector(`[data-selected-feat="${itemName}"]`));
    }

    return context.buttonCache.get(itemName);
}

// Example of adding a new creature
function createCreatureVariables(creatureIndex) {
    const newCreature = {
        name: "",
        index: creatureIndex,
        // Core stats
        phy: 0,
        dex: 0,
        int: 0,
        wil: 0,

        // Health, Mana, Aura
        health: 10,
        maxHealth: 10,
        mana: 10,
        maxMana: 10,
        aura: 10,
        maxAura: 10,

        // Spells by rank
        spellsByRank: {
            Apprentice: [],
            Adept: [],
            Magus: [],
            GrandMagus: [],
            Archmage: []
        },

        // Armor
        currentArmor: null,

        // Proficiencies and states
        saves: {},
        statuses: [],
        weapons: [], //Also unarmed strikes

        // Actions and Passives
        actions: [],
        passives: [],
    };
    return newCreature; // Return the new creature for further manipulation
}

function onChooseItem(item, itemType, spellrank, selectedChoice = null, selectedRunes = null) {
    const oldItemName = currentTargetButton.getAttribute('data-selected-feat');
    let currentCreature = creatures[currentCreatureIndex];
    // change state
    const storedItem = updateGlobalState(item, itemType, spellrank, oldItemName, currentCreature, selectedChoice, selectedRunes);

    // update appearance for the clicked button
    updateButtonAppearance(storedItem ? storedItem : item, itemType, currentTargetButton, currentCreature, selectedChoice, selectedRunes);
    updateOnStatIncrease(currentCreatureIndex);
}

function updateGlobalState(item, itemType, spellrank, oldItemName, currentCreature, selectedChoice = null, selectedRunes = null) {
    // Mapping of itemType to arrayName
    const typeToArray = {
        spell: 'spells',
        weapon: 'weapons',
        armor: null,
    };
    //console.log("adding " + item.name + " of item type " + itemType + " to creature " + currentCreature.name)

    // Helper: Update a global array (add/remove old item, add new item)
    function updateGlobalArray(arrayName, item, oldItemName, rank = null) {
        if (!arrayName) return;

        // Clone the item to avoid modifying the original object
        const itemToStore = { ...item };

        // Add selectedChoice to the item object if it exists
        if (selectedChoice) {
            itemToStore.selectedChoice = selectedChoice;
        }
        if (selectedRunes) {
            itemToStore.selectedRunes = selectedRunes;
            console.log(selectedRunes)
        }

        if (rank == "Grand Magus") {
            rank = "GrandMagus"
        }
        if (arrayName === 'spells' && rank) {
            //console.log("adding spell " + item.name + " to creature " + currentCreature.name)
            if (oldItemName) {
                currentCreature.spellsByRank[rank] = currentCreature.spellsByRank[rank].filter(entry => entry?.name !== oldItemName);
            }
            currentCreature.spellsByRank[rank].push(itemToStore);
            return itemToStore;
        }

        // Remove old item if it exists
        if (oldItemName) {
            currentCreature[arrayName] = currentCreature[arrayName].filter(entry => entry.name !== oldItemName);
        }

        currentCreature[arrayName].push(itemToStore);
        return itemToStore;
    }

    // Handle each itemType
    let storedItem;
    const arrayName = typeToArray[itemType];
    if (itemType == 'armor') {
        currentCreature.currentArmor = item;
        setResistancesFromArmor(item, currentCreature)
    }
    else if (arrayName) {
        storedItem = updateGlobalArray(arrayName, item, oldItemName, spellrank);
    } else {
        console.error(`Unknown item type: ${itemType}`);
    }
    return storedItem;
};

function setResistancesFromArmor(armor, currentCreature) {
    if (armor.resistances == null) {
        console.log("Not armor")
    }
    else {
        currentCreature.resistances = armor.resistances;
        const context = getCreatureDomContext(currentCreature.index);
        if (context) {
            const resistancesInput = context.container.querySelector('input[data-property="resistances"]');
            if (resistancesInput) {
                resistancesInput.value = currentCreature.resistances;
            }
        }
    }
};

function updateOnStatIncrease(creatureIndex) {
    const creature = creatures[creatureIndex]
    const armor = creature.currentArmor;
    updateSaveModifiers(creature.phy, creature.dex, creature.wil, creature.saves, creature, armor);

    const context = getCreatureDomContext(creatureIndex);
    if (!context) {
        return;
    }

    // Loop through all weapons and update their attack bonuses and damage
    creature.weapons.forEach(weapon => {
        const button = getCreatureButton(creatureIndex, weapon.name);
        if (button) {
            updateWeaponAttackBonus(weapon, button, weapon.proficiency, creature);
            updateStrikeDamage(weapon, button, creature);
        }
    });

    // Loop through all spells and update their bonuses 
    Object.keys(creature.spellsByRank).forEach(rank => {
        creature.spellsByRank[rank].forEach(spell => {
            const button = getCreatureButton(creatureIndex, spell.name);
            if (button) {
                updateSpellshapingModifier(spell, button, spell.proficiency, creature);
            }
        });
    });
}

function updateBar(type, context, changedProperty = null, creatureIndex = null) {
    const currentInput = context.querySelector(`[data-property='${type}']`);
    const maxInput = context.querySelector(`[data-property='max${type.charAt(0).toUpperCase() + type.slice(1)}']`);
    const bar = context.querySelector(`#${type}Bar`);

    const currentValue = parseInt(currentInput.value) || 0;
    const maxValue = parseInt(maxInput.value) || 1;

    // If max changed, set current to the new max
    if (changedProperty && changedProperty.startsWith('max')) {
        currentInput.value = maxValue;
        
        // Sync maxMana and maxAura, and their current values
        if (changedProperty === 'maxMana' || changedProperty === 'maxAura') {
            const otherMaxProp = changedProperty === 'maxMana' ? 'maxAura' : 'maxMana';
            const otherMaxInput = context.querySelector(`[data-property='${otherMaxProp}']`);
            const otherType = changedProperty === 'maxMana' ? 'aura' : 'mana';
            const otherCurrentInput = context.querySelector(`[data-property='${otherType}']`);
            
            if (otherMaxInput && otherCurrentInput) {
                otherMaxInput.value = maxValue;
                otherCurrentInput.value = maxValue;
                
                // Update creature data
                if (window.creatures && creatureIndex !== null && window.creatures[creatureIndex]) {
                    window.creatures[creatureIndex][changedProperty] = maxValue;
                    window.creatures[creatureIndex][otherMaxProp] = maxValue;
                    window.creatures[creatureIndex][type] = maxValue;
                    window.creatures[creatureIndex][otherType] = maxValue;
                }
                
                // Update both bars
                const otherBar = context.querySelector(`#${otherType}Bar`);
                if (otherBar) {
                    const otherPercentage = 100; // Both are now at max
                    otherBar.style.width = `${otherPercentage}%`;
                }
            }
        }
    } else if (currentValue > maxValue) {
        // If current > max, clamp it
        currentInput.value = maxValue;
    }

    const effectiveCurrentValue = parseInt(currentInput.value) || 0;
    const percentage = maxValue > 0 ? (effectiveCurrentValue / maxValue) * 100 : 0;
    bar.style.width = `${percentage}%`;
}