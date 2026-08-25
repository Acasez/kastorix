"use strict";

function addUnlocks(item) {
    if (item.unlockedFeats && currentTargetButton) {
        insertUnlockedFeatButtons(currentTargetButton, item.name, item.unlockedFeats);
    }
}

function addBasicCombatManuevers() {
    const combatManData = globalData?.combatManeuvers?.Basic || [];
    const tempCharData = { combatManeuvers: [] };
    combatManData.forEach(combatMan => tempCharData.combatManeuvers.push(combatMan));
    loadCollection(tempCharData, 'combatManeuvers', 'combatManeuvers');
}

function updateGlobalState(item, itemType, spellrank, oldItemName, proficiency = START_PROF, selectedChoice = null, selectedRunes = null) {
    function updateGlobalArray(arrayName, item, oldItemName, rank = null, selectedChoice = null) {
        if (!arrayName) return;

        if (rank === 'Grand Magus') {
            rank = 'GrandMagus';
        }

        const itemToStore = { ...item };

        if (selectedChoice !== null && selectedChoice !== undefined) {
            itemToStore.selectedChoice = selectedChoice;
        }
        if (selectedRunes) {
            itemToStore.selectedRunes = selectedRunes;
        }

        if (arrayName === 'spells' && rank) {
            if (oldItemName) {
                characterState.spellsByRank[rank] = characterState.spellsByRank[rank].filter(entry => entry?.name !== oldItemName);
            }
            itemToStore.proficiency = proficiency;
            characterState.spellsByRank[rank].push(itemToStore);
            return itemToStore;
        }

        if (oldItemName) {
            characterState[arrayName] = characterState[arrayName].filter(entry => entry.name !== oldItemName);
        }

        characterState[arrayName].push(itemToStore);
        addUnlocks(itemToStore);
        return itemToStore;
    }

    if (currentTargetButton) {
        const prevSelected = currentTargetButton.getAttribute('data-selected-feat');
        if (prevSelected) removeUnlockedFeatButtons(prevSelected);
    }
    if (oldItemName) removeUnlockedFeatButtons(oldItemName);

    let storedItem;
    const arrayName = TYPE_TO_ARRAY[itemType];
    if (itemType === 'species') {
        characterState.selectedSpecies = item;
        setHealth();
        setManaAndAura();
        addUnlocks(item);
    } else if (itemType === 'armor') {
        characterState.currentArmor = item;
        addUnlocks(item);
    } else if (arrayName) {
        storedItem = updateGlobalArray(arrayName, item, oldItemName, spellrank, selectedChoice);
    } else {
        console.error(`Unknown item type: ${itemType}`);
    }

    updateOnStatIncrease();
    return storedItem;
}

function onChooseItem(item, itemType, spellrank, selectedChoice = null, selectedRunes = null) {
    const oldItemName = currentTargetButton?.getAttribute('data-selected-feat');
    const storedItem = updateGlobalState(item, itemType, spellrank, oldItemName, null, selectedChoice, selectedRunes);
    updateButtonAppearance(storedItem || item, itemType, currentTargetButton, null, selectedChoice, selectedRunes);
}

function clearFeat(button, itemType) {
    const oldFeat = resetButtonAppearance(button);
    if (!oldFeat) return;

    function removeFromGlobalArray(arrayName, oldFeatName) {
        if (!characterState[arrayName]) return;
        characterState[arrayName] = characterState[arrayName].filter(entry => entry.name !== oldFeatName);
    }

    const removalMap = {
        advantage: 'advantages',
        arcaneFeat: 'arcaneFeats',
        generalFeat: 'generalFeats',
        background: 'backgrounds',
        ancestryFeat: 'ancestryFeats',
        golemUpgrade: 'golemUpgrades',
        runegunUpgrade: 'runegunUpgrades',
        armorUpgrade: 'armorUpgrades'
    };

    const arrayName = removalMap[itemType];
    if (arrayName) {
        removeFromGlobalArray(arrayName, oldFeat);
        removeUnlockedFeatButtons(oldFeat);
    } else if (itemType === 'armor') {
        characterState.currentArmor = null;
        calculateAllStats();
    } else if (itemType === 'species') {
        characterState.selectedSpecies = null;
        calculateAllStats();
    } else {
        console.warn(`No removal logic for item type: ${itemType}`);
    }

    updateOnStatIncrease();
}
