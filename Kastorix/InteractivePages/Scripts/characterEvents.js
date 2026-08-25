"use strict";

document.addEventListener('DOMContentLoaded', function() {
    resetInputFields();
    clearLists();

    const container = document.getElementById('featButtonsContainer');
    generateBasicInfo(container);
    generateLevelFeats(container);

    Object.keys(COLLECTION_CONFIGS.spells.ranks).forEach(rank => {
        const containerId = COLLECTION_CONFIGS.spells.ranks[rank].containerId;
        const count = characterState.spellsByRank?.[rank]?.length || 0;
        generateCollectionButtons(containerId, count, 'spells', rank);
    });

    updateAllSpellCountDisplays();

    generateCollectionButtons('weaponsContainer', 0, 'weapons');
    generateCollectionButtons('metamagicsContainer', 0, 'metamagics');
    generateCollectionButtons('combatManeuversContainer', 0, 'combatManeuvers');
    generateCollectionButtons('gadgetsContainer', 0, 'gadgets');

    document.querySelectorAll('button[class*="choose"]').forEach(button => {
        button.setAttribute('data-original-text', button.textContent);
    });

    document.addEventListener('click', (e) => {
        if (e.target.matches('.chooseSpellsModal, .chooseWeaponsModal, .chooseMetamagicModal, .chooseCombatManeuversModal, .chooseGadgetsModal')) {
            handleButtonClick(e.target);
        }
    });

    document.addEventListener('contextmenu', (e) => {
        if (e.target.matches('.chooseSpellsModal, .chooseWeaponsModal, .chooseMetamagicModal, .chooseCombatManeuversModal, .chooseGadgetsModal')) {
            e.preventDefault();
            handleButtonRightClick(e.target);
        }
    });

    clearPassiveValues();
    clearInventoryFields();
    updateAllInventoryFields();

    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('proficiency-cycle-button')) {
            const property = e.target.dataset.property;
            if (e.target.classList.contains('save')) {
                cycleProficiency(property, e.target, characterState.saves, 'saves', null);
            } else {
                cycleProficiency(property, e.target, characterState.skillProficiencies, 'skills', null);
            }
        }
    });
});

window.onload = function() {
    updateBar('health');
    updateBar('aura');
    updateBar('mana');

    calculateAllStats();
    updateCollectionCountDisplay('weapons');

    loadInCustomWeaponModal();
};
