
const leftSideOptions = ['species', 'background', 'generalFeat', 'arcaneFeat', 'ancestryFeat', 'advantage'];
function updateButtonAppearance (item, itemType, button, creature = null, selectedChoice = null, selectedRunes = null) {
    if (!button) {
        console.error(`No target element found for ${item.name}`);
        return;
    }
    //console.log("updating appearance for button " + button + " with item " + item.name + " of " + (creature ? creature.name : "player"));
    if (leftSideOptions.includes(itemType)) {
        button.classList.add('featChosen');
    }

    // Set button content based on item actions
    if (item.actions) {
        const actionContent = item.actions.includes("Reaction.png") ? item.actions.match(/<img[^>]+>/)?.[0] || "" : item.actions;
        button.innerHTML = `${item.name} ${actionContent}`;
    } else {
        button.textContent = item.name;
    }

    if (item.traits && item.traits.includes("Complex")) {
        button.classList.add("complexSpell");
    }

    button.setAttribute('data-selected-feat', item.name);
    button.setAttribute('type', itemType);

    if (selectedChoice) {
        button.setAttribute('choice', selectedChoice.name);
        button.textContent += " - " + selectedChoice.name;
        button.style.fontSize = `${15}px`;
    }

    if (selectedRunes) {
        button.setAttribute('runes', selectedRunes);
    }

    // Add proficiency button for spells and weapons
    if (itemType === "spell" || itemType === "weapon") {
        setupSpellWeaponProficiencyButton(item, itemType, button, creature);
    }
    
    button.classList.add('has-tooltip');
    let tooltip = button.querySelector('.tooltip') || document.createElement('div');
    if (!tooltip.classList.contains('tooltip')) {
        tooltip.className = 'tooltip';
        button.appendChild(tooltip);
    }

    // Generate tooltip content based on item type
    tooltip.innerHTML = createGeneralTooltip(item, itemType);

    // Update collection count display for specific item types
    const collectionMappings = {
        spell: () => {
            const trimmedRank = item.rank.slice(4);
            updateCollectionCountDisplay('spells', trimmedRank === "Grand Magus" ? "GrandMagus" : trimmedRank);
        },
        weapon: () => updateCollectionCountDisplay('weapons'),
        metamagic: () => updateCollectionCountDisplay('metamagics'),
        combatManeuvers: () => updateCollectionCountDisplay('combatManeuvers'),
    };

    if (collectionMappings[itemType]) {
        collectionMappings[itemType]();
    }
};

function resetButtonAppearance(button) {
    const originalText = button.getAttribute('data-original-text');
    const oldFeat = button.getAttribute('data-selected-feat');
    button.textContent = originalText;
    button.removeAttribute('aspect');
    button.removeAttribute('choice');
    button.removeAttribute('data-selected-feat');
    const existingTooltip = button.querySelector('.tooltip');
    if (existingTooltip) existingTooltip.remove();
    button.classList.remove('has-tooltip', 'featChosen');

    return oldFeat;
}
