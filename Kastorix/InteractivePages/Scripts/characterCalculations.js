"use strict";

function setHealth(currentHealth = null) {
    const defaultBase = 6;
    const baseHealth = (characterState.selectedSpecies && Number(characterState.selectedSpecies.health)) || defaultBase;
    let computedHealth = baseHealth + characterState.phy;

    const featArrays = ['advantages', 'arcaneFeats', 'generalFeats', 'ancestryFeats'];
    featArrays.forEach(arrayName => {
        if (window[arrayName]) {
            window[arrayName].forEach(feat => {
                if (feat.health) {
                    computedHealth += evaluateStatBonus(feat.health);
                }
            });
        }
    });

    document.getElementById('maxHealth').value = computedHealth;
    characterState.maxHealth = computedHealth;

    document.getElementById('health').value = (currentHealth ?? computedHealth);
    characterState.health = (currentHealth ?? computedHealth);
    updateBar('health');
}

function longRest() {
    characterState.mana = characterState.maxMana;
    characterState.aura = characterState.maxAura;
    setManaAndAura();
    setHealth();
}

function setManaAndAura(currentMana = null, currentAura = null) {
    const defaultBase = 10;
    const baseMana = (characterState.selectedSpecies && Number(characterState.selectedSpecies.mana)) || defaultBase;
    const level = characterState.characterLevel;

    let computedMana = baseMana + characterState.wil + ((level - 1) * (3 + characterState.wil));

    const featArrays = ['advantages', 'arcaneFeats', 'generalFeats', 'ancestryFeats'];
    featArrays.forEach(arrayName => {
        if (window[arrayName]) {
            window[arrayName].forEach(feat => {
                if (feat.mana) {
                    computedMana += evaluateStatBonus(feat.mana);
                }
            });
        }
    });

    document.getElementById('maxMana').value = computedMana;
    document.getElementById('maxAura').value = computedMana;
    characterState.maxAura = computedMana;
    characterState.maxMana = computedMana;

    document.getElementById('mana').value = computedMana;
    document.getElementById('aura').value = computedMana;
    characterState.aura = computedMana;
    characterState.mana = computedMana;

    updateBar('mana');
    updateBar('aura');
}

function setBaseStats(phy, dex, int, wil) {
    if (typeof modalButton !== 'undefined' && modalButton) {
        modalButton.classList.add('activated');
    }
    document.getElementById('phy').value = phy;
    document.getElementById('dex').value = dex;
    document.getElementById('int').value = int;
    document.getElementById('wil').value = wil;
    updateOnStatIncrease();
}

function increaseStat(stat) {
    if (typeof modalButton !== 'undefined' && modalButton) {
        modalButton.classList.add('activated');
    }
    let statInt = parseInt(document.getElementById(stat)?.value || 0, 10) || 0;
    statInt += 1;
    document.getElementById(stat).value = statInt;
    updateOnStatIncrease();
    closeModal();
}

function updateOnStatIncrease() {
    characterState.characterLevel = parseInt(document.getElementById('level')?.value || 0, 10) || 0;
    characterState.phy = parseInt(document.getElementById('phy')?.value || 0, 10) || 0;
    characterState.dex = parseInt(document.getElementById('dex')?.value || 0, 10) || 0;
    characterState.int = parseInt(document.getElementById('int')?.value || 0, 10) || 0;
    characterState.wil = parseInt(document.getElementById('wil')?.value || 0, 10) || 0;

    characterState.globalPenalty = 0;
    if (characterState.statuses) {
        if (characterState.statuses.fatigue) {
            characterState.globalPenalty = -characterState.statuses.fatigue;
        }
        if (characterState.statuses.frightened) {
            characterState.globalPenalty += -characterState.statuses.frightened;
        }
    }

    setupAttunement();
    checkForSpecifiedFeats();

    updateSkillModifiers(characterState.phy, characterState.dex, characterState.int, characterState.wil, characterState.skillProficiencies, null, characterState.currentArmor);
    updateSaveModifiers(characterState.phy, characterState.dex, characterState.wil, characterState.saves, null, characterState.currentArmor);
    updateBaseSpellshapingBonus(characterState.dex, characterState.int, characterState.wil, characterState.attunement);
    setHealth();
    setManaAndAura();

    calculateAllStats();
    setupGolem();

    Object.keys(characterState.spellsByRank).forEach(rank => {
        characterState.spellsByRank[rank].forEach(spell => {
            const button = document.querySelector(`[data-selected-feat="${spell.name}"]`);
            if (button) {
                updateSpellshapingModifier(spell, button, spell.proficiency);
            }
        });
    });

    characterState.weapons.forEach(weapon => {
        const button = document.querySelector(`[data-selected-feat="${weapon.name}"]`);
        if (button) {
            updateWeaponAttackBonus(weapon, button, weapon.proficiency);
            updateStrikeDamage(weapon, button);
        }
    });
}

function setupAttunement() {
    for (const advantage of characterState.advantages) {
        if (advantage.selectedChoice && advantage.name === 'Attunement') {
            characterState.attunement = advantage.selectedChoice.name;
            return;
        }
    }
    characterState.attunement = null;
}

function checkForSpecifiedFeats() {
    for (const generalFeat of characterState.generalFeats) {
        if (generalFeat.name === 'Untrained Improvisation') {
            characterState.untrainedImprov = true;
            return;
        }
    }
    characterState.untrainedImprov = null;
}

async function setupGolem() {
    const golemSection = document.querySelector('[data-tab="golem"]');
    for (const advantage of characterState.advantages) {
        if (advantage.selectedChoice && advantage.name === 'Golemcrafter') {
            const golemModel = advantage.selectedChoice;
            characterState.golem.golemModel = golemModel;
            golemSection.classList.remove('noGolem');
            const golemModelText = document.getElementById('golemModel');
            golemModelText.textContent = golemModel.name;
            document.getElementById('golemPhy').value = golemModel.phy || 0;
            document.getElementById('golemDex').value = golemModel.dex || 0;
            document.getElementById('golemInt').value = golemModel.int || 0;
            document.getElementById('golemWil').value = golemModel.wil || 0;

            document.getElementById('maxHealthGolem').value = (3 * characterState.characterLevel) + characterState.int + golemModel.phy;
            updateBar('healthGolem');
            return;
        }
    }

    golemSection.classList.add('noGolem');
    characterState.golem.golemModel = null;
}
