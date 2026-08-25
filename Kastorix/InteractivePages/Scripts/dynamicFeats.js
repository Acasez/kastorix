const UNLOCKED_FEAT_TYPES = {
    'Background': {
        className: 'chooseBackgroundsModal',
        modalId: 'backgroundsModal',
        featType: 'background',
        label: 'Background'
    },
    'Advantage': {
        className: 'chooseAdvantagesModal',
        modalId: 'advantagesModal',
        featType: 'advantage',
        label: 'Advantage'
    },
    'Arcane Feat': {
        className: 'chooseArcaneFeatsModal',
        modalId: 'arcaneFeatsModal',
        featType: 'arcaneFeat',
        label: 'Arcane Feat'
    },
    'General Feat': {
        className: 'chooseGeneralFeatsModal',
        modalId: 'generalFeatsModal',
        featType: 'generalFeat',
        label: 'General Feat'
    },
    'Ancestry Feat': {
        className: 'chooseAncestryFeatsModal',
        modalId: 'ancestryFeatsModal',
        featType: 'ancestryFeat',
        label: 'Ancestry Feat'
    },
    'Golem Model': {
        className: 'chooseGolemModelModal',
        modalId: 'golemModelModal',
        featType: 'golemModal',
        label: 'Golem Model'
    },
    'Golem Upgrade': {
        className: 'chooseGolemUpgradesModal',
        modalId: 'golemUpgradesModal',
        featType: 'golemUpgrade',
        label: 'Golem Upgrade'
    },
    'Runegun Upgrade': {
        className: 'chooseRunegunUpgradesModal',
        modalId: 'runegunUpgradesModal',
        featType: 'runegunUpgrade',
        label: 'Runegun Upgrade'
    },
    'Armor Upgrade': {
        className: 'chooseArmorUpgradesModal',
        modalId: 'armorUpgradesModal',
        featType: 'armorUpgrade',
        label: 'Armor Upgrade'
    }
};
// Function to create a dynamic feat button
function createDynamicFeatButton(unlockedFeatType, parentItemName, index, level) {
    const config = UNLOCKED_FEAT_TYPES[unlockedFeatType];
    if (!config) {
        console.error(`Unknown unlocked feat type: ${unlockedFeatType}`);
        return null;
    }

    // sanitize helper for ids
    const sanitize = s => String(s).replace(/[^a-z0-9]/gi, '_');

    const button = document.createElement("button");
    button.className = config.className;
    button.classList.add("modalButton");
    button.classList.add("dynamic-unlocked-feat");
    button.setAttribute("onclick", `openModal(this, '${config.featType}', null, '${level}')`);
    button.setAttribute("oncontextmenu", `clearFeat(this, '${config.featType}'); return false;`);
    button.setAttribute("data-original-text", config.label);
    button.setAttribute("data-unlocked-by", parentItemName);
    button.setAttribute("level", 'level' + level);
    button.textContent = config.label;

    // give a deterministic unique id so multiple identical unlocks can coexist
    const idBase = `dynamic_${sanitize(parentItemName)}_${sanitize(unlockedFeatType)}`;
    if (typeof index === 'number') {
        button.id = `${idBase}_${index}`;
    } else {
        // fall back to ensure unique id
        let i = 0;
        let candidate = idBase;
        while (document.getElementById(candidate) && i < 1000) {
            i++;
            candidate = `${idBase}_${i}`;
        }
        button.id = candidate;
    }

    // Create tooltip div
    const tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    button.appendChild(tooltip);

    return button;
}

// Function to insert unlocked feat buttons below a parent button
function insertUnlockedFeatButtons(parentButton, parentItemName, unlockedFeatType) {
    // Allow unlockedFeatType to be an array or a comma-separated string
    let types = [];
    if (!unlockedFeatType) return;
    if (Array.isArray(unlockedFeatType)) types = unlockedFeatType.slice();
        else if (typeof unlockedFeatType === 'string') {
            types = unlockedFeatType.split(',').map(s => s.trim()).filter(Boolean);
        } else {
            types = [String(unlockedFeatType)];
    }

    // Get the parent button's group
    const parentGroup = parentButton.closest('.sidebar-group');
    if (!parentGroup) return;

    let extraMargin = parseInt(parentGroup.style.marginLeft, 10);
    if (Number.isNaN(extraMargin)) extraMargin = 0;

    let lastInserted = parentGroup;
    types.forEach((type, idx) => {
        // Parse level from type (e.g., "Arcane Feat - Level 4" -> ["Arcane Feat", "Level 4"])
        const levelMatch = type.match(/(.+)\s*-\s*Level\s*(\d+)/i);
        let baseType = type;
        let level = null;

        if (levelMatch) {
            baseType = levelMatch[1].trim();
            level = parseInt(levelMatch[2], 10);
        }

        const config = UNLOCKED_FEAT_TYPES[baseType];
        if (!config) {
            console.error(`Unknown unlocked feat type: ${baseType}`);
            return;
        }

        const groupDiv = document.createElement("div");
        groupDiv.className = "sidebar-group";
        groupDiv.classList.add("unlocked-feat-group");
        groupDiv.setAttribute("data-unlocked-by", parentItemName);
        groupDiv.setAttribute("data-unlocked-type", baseType);
        groupDiv.style.marginLeft = `${extraMargin + 20}px`;

        // Pass baseType and level to createDynamicFeatButton
        const button = createDynamicFeatButton(baseType, parentItemName, idx, level);
        if (button) {
            groupDiv.appendChild(button);
            lastInserted.insertAdjacentElement('afterend', groupDiv);
            lastInserted = groupDiv;
        }
    });
}

// Function to remove unlocked feat buttons for a given prerequisite
function removeUnlockedFeatButtons(prerequisiteId) {
    document.querySelectorAll(`.unlocked-feat-group[data-unlocked-by="${prerequisiteId}"]`).forEach(group => {
        const button = group.querySelector('button');
        if (button) {
            const selectedFeat = button.getAttribute('data-selected-feat');
            const itemType = button.getAttribute('type');

            // If this unlocked button has a selected feat, recursively remove its unlocked feats
            if (selectedFeat) {
                removeUnlockedFeatButtons(selectedFeat);
            }

            // Remove the selected feat from global state
            if (selectedFeat && itemType) {
                const arrayName =
                itemType === 'advantage' ? 'advantages' :
                itemType === 'arcaneFeat' ? 'arcaneFeats' :
                itemType === 'generalFeat' ? 'generalFeats' :
                itemType === 'background' ? 'backgrounds' :
                itemType === 'ancestryFeat' ? 'ancestryFeats' : null;
                if (arrayName && window[arrayName]) {
                    window[arrayName] = window[arrayName].filter(entry => entry.name !== selectedFeat);
                }
            }
        }
        // Remove the DOM element
        group.remove();
    });
}