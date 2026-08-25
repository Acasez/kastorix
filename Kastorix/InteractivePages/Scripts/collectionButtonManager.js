function resolveCollectionOwner(owner = collectionOwner) {
    if (owner && owner !== window) {
        return owner;
    }

    if (typeof characterState !== 'undefined' && characterState) {
        return characterState;
    }

    return window;
}

function getCollectionItems(collectionKey, owner = collectionOwner, rank = null) {
    const opts = COLLECTION_CONFIGS[collectionKey];
    const source = resolveCollectionOwner(owner);
    const collection = source?.[opts.arrayName];

    if (rank !== null && rank !== undefined) {
        return collection?.[rank] || [];
    }

    return collection || [];
}

const COLLECTION_CONFIGS = {
    spells: {
        arrayName: 'spellsByRank', // Object with ranks as keys
        globalButtonsName: 'spellButtons',
        itemPrefix: 'Spell',
        buttonClass: 'chooseSpellsModal modalButton',
        modalId: 'spellsModal',
        collectionName: 'spellCollection',
        itemType: 'spell',
        tooltipRenderer: window.createSpellTooltipContent,
        addButtonClass: 'spell-add-button',
        chooseSelector: 'button.chooseSpellsModal',
        countElementIdPrefix: 'spellCount-',
        label: 'Selected Spells',
        ranks: {
            Apprentice: {
                containerId: 'spellsContainer-Apprentice',
                countElementId: 'spellCount-Apprentice',
                maxValue: () => window.stats.spellsLearnableByRank?.Apprentice || 0,
            },
            Adept: {
                containerId: 'spellsContainer-Adept',
                countElementId: 'spellCount-Adept',
                maxValue: () => window.stats.spellsLearnableByRank?.Adept || 0,
            },
            Magus: {
                containerId: 'spellsContainer-Magus',
                countElementId: 'spellCount-Magus',
                maxValue: () => window.stats.spellsLearnableByRank?.Magus || 0,
            },
            GrandMagus: {
                containerId: 'spellsContainer-GrandMagus',
                countElementId: 'spellCount-GrandMagus',
                maxValue: () => window.stats.spellsLearnableByRank?.GrandMagus || 0,
            },
            Archmage: {
                containerId: 'spellsContainer-Archmage',
                countElementId: 'spellCount-Archmage',
                maxValue: () => window.stats.spellsLearnableByRank?.Archmage || 0,
            },
        },
        itemList: (owner = null) => getCollectionItems('spells', owner),
        itemInText: 'Spell',
    },
    weapons: {
        arrayName: 'weapons',
        globalButtonsName: 'weaponButtons',
        itemPrefix: 'Weapon',
        buttonClass: 'chooseWeaponsModal modalButton',
        modalId: 'weaponsModal',
        collectionName: 'weaponCollection',
        itemType: 'weapon',
        tooltipRenderer: window.createWeaponTooltipContent,
        addButtonClass: 'weapon-add-button',
        chooseSelector: 'button.chooseWeaponsModal',
        countElementId: 'weaponCount',
        label: 'Selected Weapons',
        itemList: (owner = null) => getCollectionItems('weapons', owner),
        containerId: 'weaponsContainer',
        itemInText: 'Weapon',
        maxValue: () => 5,
    },
    metamagics: {
        arrayName: 'metamagics',
        itemPrefix: 'Metamagic',
        buttonClass: 'chooseMetamagicModal modalButton',
        modalId: 'metamagicsModal',
        collectionName: 'metamagicCollection',
        itemType: 'metamagic',
        tooltipRenderer: window.createMetamagicTooltipContent,
        addButtonClass: 'metamagic-add-button',
        chooseSelector: 'button.chooseMetamagicModal',
        countElementId: 'metamagicCount',
        label: 'Metamagics Chosen',
        maxValue: () => window.stats.metamagicsLearned.metamagic || 0,
        itemList: (owner = null) => getCollectionItems('metamagics', owner),
        containerId: 'metamagicsContainer',
        itemInText: 'Metamagic',
    },
    combatManeuvers: {
        arrayName: 'combatManeuvers',
        itemPrefix: 'CombatManeuver',
        buttonClass: 'chooseCombatManeuversModal modalButton',
        modalId: 'combatManeuversModal',
        collectionName: 'combatManeuversCollection',
        itemType: 'combatManeuvers',
        tooltipRenderer: window.createCombatManeuversTooltipContent,
        addButtonClass: 'combatManeuvers-add-button',
        chooseSelector: 'button.chooseCombatManeuversModal',
        countElementId: 'combatManeuversCount',
        label: 'Learned Combat Maneuvers',
        maxValue: () => window.stats.combatManeuversLearned.combatManeuvers || 0,
        itemList: (owner = null) => getCollectionItems('combatManeuvers', owner),
        containerId: 'combatManeuversContainer',
        itemInText: 'Combat Maneuver',
    },
    gadgets: {
        arrayName: 'gadgets',
        itemPrefix: 'Gadget',
        buttonClass: 'chooseGadgetsModal modalButton',
        modalId: 'gadgetsModal',
        collectionName: 'gadgetsCollection',
        itemType: 'gadgets',
        tooltipRenderer: window.createGadgetsTooltipContent,
        addButtonClass: 'gadgets-add-button',
        chooseSelector: 'button.chooseGadgetsModal',
        countElementId: 'gadgetsCount',
        label: 'Crafted Gadgets',
        maxValue: () => window.stats.gadgetsPossible.gadgets || 0,
        itemList: (owner = null) => getCollectionItems('gadgets', owner),
        containerId: 'gadgetsContainer',
        itemInText: 'Gadget',
    },
};

const TYPE_TO_COLLECTION_KEY = {
    spell: "spells",
    weapon: "weapons",
    metamagic: "metamagics",
    combatManeuvers: "combatManeuvers",
}

let collectionOwner = window; // Default to window

function setCollectionOwner(creature) {
    //console.log("set collection owner to " + (creature ? creature.name : "player"))
    collectionOwner = creature || window; 
    if (creature) {
        currentCreatureIndex = creatures.indexOf(creature);
    }
}

// Generate collections
function generateCollectionButtons(containerId, count, collectionKey, rank = null, creature = null) {
    const opts = COLLECTION_CONFIGS[collectionKey];
    const owner = resolveCollectionOwner(creature || collectionOwner);
    //console.log((creature ? creature.name : "player"));
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '';

    // Get the items for the current rank
    const items = rank ? (getCollectionItems(collectionKey, collectionOwner, rank)) : (getCollectionItems(collectionKey, collectionOwner));

    if (opts.globalButtonsName) { //Find earlier buttons and remove them
        owner[opts.globalButtonsName] = (owner[opts.globalButtonsName] || []).filter(b => !b.id?.startsWith(containerId + `-${opts.itemPrefix}`));
    }

    for (let i = 0; i < count; i++) {
        const groupDiv = document.createElement("div");
        groupDiv.className = "sidebar-group";
        const button = document.createElement("button");
        button.className = opts.buttonClass || "chooseItemModal modalButton";
        button.setAttribute("data-original-text", "Select " + opts.itemInText);
        button.setAttribute("id", `${containerId}-${opts.itemPrefix}${i}`);
        if (rank != null) {
            button.setAttribute('rank', rank);
        }
        
        if (creature) {
            button.setAttribute("data-creature-index", creatures.indexOf(creature));
        } 

        const item = items[i];
        if (item) {
            button.setAttribute("data-selected-feat", item.name);
            
            button.setAttribute("type", opts.itemType);
            button.classList.add('has-tooltip');

            window.currentTargetButton = button;

            let tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.innerHTML = opts.tooltipRenderer ? opts.tooltipRenderer(item) : '';
            button.appendChild(tooltip);

            if (opts.globalButtonsName) owner[opts.globalButtonsName].push(button);
            //console.log("to update appearance for " + item.name + " of creature " + (creature ? creature.name : "player"))
            updateButtonAppearance(item, opts.itemType, button, ...(creature ? [creature] : []));
        } else {
            button.textContent = "Select " + opts.itemInText;
        }

        groupDiv.appendChild(button);
        container.appendChild(groupDiv);
    }

    const addWrapper = document.createElement("div");
    addWrapper.className = "sidebar-group centered";
    const addBtn = document.createElement("button");
    addBtn.className = opts.addButtonClass || `${opts.itemPrefix}-add-button`;
    addBtn.title = `Add ${opts.itemInText}`;
    addBtn.textContent = (creature ? "Add " + (rank ? rank : "") + " " + opts.itemInText : "+")

    addBtn.onclick = () => {
        if (creature != null) {
            setCollectionOwner(creature);
        }
        addSlotForCollection(containerId, collectionKey, rank, creature);
    };
    addWrapper.appendChild(addBtn);
    container.appendChild(addWrapper);
}

function addSlotForCollection(containerId, collectionKey, rank = null, creature = null) {
    const opts = COLLECTION_CONFIGS[collectionKey];
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn(`${collectionKey}: Container not found`, containerId);
        return;
    }

    // Get current items and calculate new count
    const items = rank ? (getCollectionItems(collectionKey, collectionOwner, rank)) : (getCollectionItems(collectionKey, collectionOwner));
    const newCount = items.length + 1;

    // Regenerate buttons
    generateCollectionButtons(containerId, newCount, collectionKey, rank, creature);

    // Open modal for the new slot
    const newButton = container.querySelectorAll(opts.chooseSelector)[newCount - 1];
    if (newButton) {
        currentTargetButton = newButton;
        openModal(newButton, opts.itemType, rank || opts.collectionName, opts.itemType, newCount - 1, rank);
    } else {
        console.warn(`${collectionKey}: New slot button not found`, containerId);
    }
}

//Remove items from collections
function commonRemoveItem(button, collectionKey, rank = null, creature = null) {
    //console.log("removed item from " + collectionKey)
    const opts = COLLECTION_CONFIGS[collectionKey];
    // console.log("Opts", opts)
    // console.log("Opts rank", opts.ranks)
    // console.log("rank", rank)
    let containerId = rank ? opts.ranks[rank].containerId : opts.containerId;
    if (creature) {
        containerId += creatures.indexOf(creature);
    }
    const container = document.getElementById(containerId);
    if (!container) {
        console.warn("can't find container")
        button.closest('.sidebar-group')?.remove();
        return;
    }
    const owner = resolveCollectionOwner(creature || collectionOwner);

    // Remove the item from the list
    const items = rank ? owner[opts.arrayName]?.[rank] : owner[opts.arrayName];
    const index = Array.from(container.querySelectorAll(opts.chooseSelector)).indexOf(button);
    const oldName = button.getAttribute('data-selected-feat');
    console.log("Items list " + items)
    console.log("removed item " + oldName)

    if (index !== -1 && items?.[index]) { //TODO FIX REMOVAL FOR CREATURES
        items.splice(index, 1);
    } else if (oldName) {
        const list = rank ? items : owner[opts.arrayName];
        owner[opts.arrayName] = list.filter(item => item.name !== oldName);
    }

    // Regenerate buttons and update count
    const newCount = items?.length || 0;
    generateCollectionButtons(container.id, newCount, collectionKey, rank);
    updateCollectionCountDisplay(collectionKey, rank);
}

//Update Collection Count
function updateCollectionCountDisplay(collectionKey, rank = null) {
    const opts = COLLECTION_CONFIGS[collectionKey];
    const rankOpts = rank ? opts.ranks?.[rank] : null;
    const countElementId = rank ? rankOpts.countElementId : opts.countElementId;
    const containerId = rank ? rankOpts.containerId : opts.containerId;

    const countElement = document.getElementById(countElementId);
    const container = document.getElementById(containerId);
    if (!countElement || !container) return;

    const selectedCount = container.querySelectorAll(`${opts.chooseSelector}[data-selected-feat]`).length;
    const maxValue = rank ? rankOpts.maxValue() : (opts.maxValue() || 0);
    let text = '';
    if (maxValue !== undefined && maxValue !== null) {
        text = `${opts.label} (${selectedCount}/${maxValue})`;
        countElement.classList.remove("redText");
        countElement.classList.remove("greenText");
        if (selectedCount > maxValue) {
            countElement.classList.add("redText");
        }
        else if (maxValue > selectedCount) {
            countElement.classList.add("greenText");
        }
    } else {
        text = `${opts.label} (${selectedCount})`;
    }

    countElement.textContent = text;
} 

function updateAllSpellCountDisplays() {
    Object.keys(COLLECTION_CONFIGS.spells.ranks).forEach(rank => {
        updateCollectionCountDisplay('spells', rank);
    });
}

function handleButtonRightClick(button, creature = null) {
    const type = button.getAttribute('type');
    const collectionKey = TYPE_TO_COLLECTION_KEY[type];
    const rank = button.closest('.spellsContainer')?.id.replace('spellsContainer-', '').replace(/\d+$/, '');
    commonRemoveItem(button, collectionKey, rank, creature);
}

function handleButtonClick(button, creature = null) { 
    console.log("Changing item")
    const type = button.getAttribute('type');
    const rank = button.closest('.spellsContainer')?.id.replace('spellsContainer-', '').replace(/\d+$/, '');
    openModal(button, type, rank, creature);
} 
/**
 * Generic helper to load a collection (weapons, metamagics, combatManeuvers, spells)
 * @param {Object} charData - The character data object
 * @param {string} collectionKey - The key name (e.g., 'weapons', 'spells')
 * @param {string} itemType - The item type string (e.g., 'weapon', 'spell')
 * @param {string} [rank] - Optional rank for spells
 */
function loadCollection(charData, collectionKey, itemType, rank = null, creature = null) {
    const opts = COLLECTION_CONFIGS[collectionKey];
    const owner = resolveCollectionOwner(creature || collectionOwner);
    let containerId = rank ? opts.ranks[rank].containerId : opts.containerId;
    if (creature) {
        containerId += creatures.indexOf(creature);
    }
    //console.log("container id is " + containerId)
    const container = document.getElementById(containerId);
    if (!container) return;
    // Load items for the collection (or rank)
    const items = rank ? (charData[opts.arrayName]?.[rank] || []) : (charData[collectionKey] || []);
    if (creature) {
        //console.log("loading in collection of type " + itemType + " from chardata " + charData + " for creature " + creature.name);
        setCollectionOwner(creature)
    }
    owner[opts.arrayName] = charData[opts.arrayName] || {};
    if (rank) {
        owner[opts.arrayName][rank] = items;
    } else {
        owner[collectionKey] = items;
    }

    // Generate buttons for the collection (or rank)
    const count = items.length;
    generateCollectionButtons(containerId, count, collectionKey, rank, creature);

    // Populate the buttons with saved items
    const buttons = Array.from(container.querySelectorAll(opts.chooseSelector));
    items.forEach((item, i) => {
        const btn = buttons[i];
        if (!btn) return;
        btn.setAttribute('data-selected-feat', item.name);
        btn.setAttribute('type', itemType);
        if (rank != null) {
            btn.setAttribute('rank', rank);
        }
        updateButtonAppearance(item, itemType, btn, creature);
    });

    // Update the count display
    updateCollectionCountDisplay(collectionKey, rank);
}

function loadInAllSpells(charData, creature){
    loadCollection(charData, 'spells', 'spell', 'Apprentice', creature)
    loadCollection(charData, 'spells', 'spell', 'Adept', creature)
    loadCollection(charData, 'spells', 'spell', 'Magus', creature)
    loadCollection(charData, 'spells', 'spell', 'GrandMagus', creature)
    loadCollection(charData, 'spells', 'spell', 'Archmage', creature)
}


