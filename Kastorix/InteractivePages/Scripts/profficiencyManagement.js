//proficiencies
// Define proficiency levels and their bonuses
const proficiencyLevels = [
    { name: "U", bonus: 0, fullName: "Untrained", color: "#cccccc" },
    { name: "T", bonus: 2, fullName: "Trained", color: "#47d147" },
    { name: "E", bonus: 4, fullName: "Expert", color: "#66b3ff" },
    { name: "M", bonus: 6, fullName: "Master", color: "#cc66ff" },
    { name: "L", bonus: 8, fullName: "Legendary", color: "#ff9966" }
];

function setupSpellWeaponProficiencyButton(item, itemType, button, creature = null) {
    const profButton = document.createElement("button");
    profButton.className = "proficiency-cycle-button";

    let actualItem;
    if (itemType === "spell") {
        actualItem = getSpellFromData(item.name, creature);
    }
    else if (itemType === "weapon") {
        actualItem = getWeaponFromData(item.name, creature);
    }
    actualItem.proficiency == 2;

    profButton.onclick = (event) => {
        event.stopPropagation();
        cycleProficiency(item.name, profButton, null, itemType, creature);
    };

    // Update proficiency button appearance
    const currentBonus = actualItem.proficiency;
    const currentLevel = proficiencyLevels.find(level => level.bonus === currentBonus) || proficiencyLevels[1];
    profButton.textContent = currentLevel.name;
    profButton.title = `${currentLevel.fullName} [${currentLevel.bonus}]`;
    profButton.style.backgroundColor = currentLevel.color;
    button.appendChild(profButton);

    // Update modifiers based on item type
    if (itemType === "weapon") {
        updateWeaponAttackBonus(actualItem, button, currentLevel.bonus, creature);
        updateStrikeDamage(actualItem, button, creature);
    } else if (itemType === "spell") {
        updateSpellshapingModifier(actualItem, button, currentLevel.bonus, creature);
    }
    /* if (item.traits != "" && creature != null){
        showItemTraits(item, button, creature);
    } */
}

// Function to cycle proficiency
function cycleProficiency(id, button, profObject, itemType = null, creature = null) {
    let currentBonus;
    let object;

    // Determine the current proficiency based on item type
    if (itemType === "spell") {
        object = getSpellFromData(id, creature);
        currentBonus = object.proficiency;
    }
    else if (itemType === "weapon") {
        object = getWeaponFromData(id, creature);
        currentBonus = object.proficiency;
    } else {
        currentBonus = (profObject[id] || 0);
    }

    //console.log("cycling prof for item " + id.name + " with current prof " + currentBonus + " of type " + itemType + " of creature " + creature)

    // Find the current proficiency level
    let currentIndex = proficiencyLevels.findIndex(level => level.bonus === currentBonus);
    if (currentIndex === -1) currentIndex = 0;

    // Cycle to the next proficiency
    const nextIndex = (currentIndex + 1) % proficiencyLevels.length;
    const nextLevel = proficiencyLevels[nextIndex];

    // Update proficiency in the correct object
    if (itemType === "spell" || itemType === "weapon") {
        object.proficiency = nextLevel.bonus;
        //console.log("Console logging id of spell or weapon " + id)
    } else {
        profObject[id] = nextLevel.bonus;
    }

    // Get modifiers
    const phy = creature ? creature.phy : characterState.phy;
    const dex = creature ? creature.dex : characterState.dex;
    const int = creature ? creature.int : characterState.int;
    const wil = creature ? creature.wil : characterState.wil;
    const attunement = creature ? creature.attunement : characterState.attunement;
    const armor = creature ? creature.currentArmor : characterState.currentArmor;

    switch (itemType) {
        case 'weapon':
            updateWeaponAttackBonus(object, button.parentElement, nextLevel.bonus, creature);
            updateStrikeDamage(object, button.parentElement, creature);
            break;
        case 'spell':
            updateSpellshapingModifier(object, button.parentElement, nextLevel.bonus, creature);
            break;
        case 'saves':
            updateSaveModifiers(phy, dex, wil, profObject, creature, armor);
            break;
        case 'skills':
            updateSkillModifiers(phy, dex, int, wil, profObject, creature, armor);
            break;
        default:
            console.error(`Unknown item type: ${itemType}`);
            return null;
    }

    if (creature == null) {
        updateBaseSpellshapingBonus(dex, int, wil, attunement);
    }
}

function setButtonTextAndColor(button, level) {
    button.textContent = level.name;
    button.title = `${level.fullName} [${level.bonus}]`;
    button.style.backgroundColor = level.color;
}

function updateSkillModifiers(phy, dex, int, wil, skills, creature = null, armor = null) {
    const container = creature ? document.querySelector(`.creature-container[data-creature-index="${window.creatures.indexOf(creature)}"]`) : document;

    container.querySelectorAll('[data-skill-type]').forEach(el => {
        const skillType = el.dataset.skillType;
        const button = el.parentElement.querySelector('.proficiency-cycle-button');
        const bonus = skills[skillType] || 0;
        const level = proficiencyLevels.find(level => level.bonus === bonus) || proficiencyLevels[0];

        // Update button text, tooltip, and color
        if (button) {
            setButtonTextAndColor(button, level);
        } else {
            console.warn("Can't find proficiency cycle button for:", skillType);
        }

        skillData = getSkillFromData(skillType)

        armorPenalty = 0;
        if (armor != null && skillData.armorPenalties && !(armor.type == "Light" && skillData.armorPenalties == "Heavy")) {
            //console.log("Skill is " + skillData.name + " current armor is " + armor.name + " with skill penalties " + armor.penalties);
            armorPenalty = armor.penalties;
        }
        noTrainingValue = 0;
        if (creature == null && characterState.untrainedImprov) {
            noTrainingValue = 1;
        }
        otherPenalty = 0;
        if (creature == null) {
            otherPenalty = characterState.globalPenalty;
        }

        //console.log("Skill is " + skillType + " current prof is " + skills[skillType]);
        switch (skillData.stat) {
            case 'PHY':
                skillTotal = phy + (skills[skillType] || noTrainingValue) + armorPenalty + otherPenalty;
                break;
            case 'DEX':
                skillTotal = dex + (skills[skillType] || noTrainingValue) + armorPenalty + otherPenalty;
                break;
            case 'INT':
                skillTotal = int + (skills[skillType] || noTrainingValue) + armorPenalty + otherPenalty;
                break;
            case 'WIL':
                skillTotal = wil + (skills[skillType] || noTrainingValue) + armorPenalty + otherPenalty;
                break;
        }
        el.textContent = skillTotal;
        if (creature == null) {
            if (skillData.name == 'Perception') {
                document.getElementById('passivePerception').value = 10 + skillTotal;
            }
            if (skillData.name == 'Mana Sensing') {
                document.getElementById('passiveManasense').value = 10 + skillTotal;
            }
        }
    });
}

function clearPassiveValues() {
    document.getElementById('passivePerception').value = 10;
    document.getElementById('passiveManasense').value = 10;
}


function getSkillFromData(skillName) {
    const dataSkill = globalData.skills.find(skill =>
        skill.name.toLowerCase() === skillName.toLowerCase()
    );
    if (dataSkill) {
        //console.log(`Found Skill "${skillName}"`);
        return dataSkill;
    } else {
        //console.log(`Skill "${skillName}" not found.`);
        return null;
    }
}

function getSpellFromData(spellName, creature = null) {
    // Get all spell arrays from the categories
    const allSpells = Object.values(creature ? creature.spellsByRank : characterState.spellsByRank).flat();

    // Search for the spell by name (case-insensitive)
    const foundSpell = allSpells.find(spell =>
        spell.name.toLowerCase() === spellName.toLowerCase()
    );

    if (foundSpell) {
        //console.log(`Found Spell "${spellName}"`);
        return foundSpell;
    } else {
        //console.log(`Spell "${spellName}" not found.`);
        return null;
    }
}

function getWeaponFromData(weaponName, creature = null) {
    const dataSkill = (creature ? creature.weapons : characterState.weapons).find(weapon =>
        weapon.name.toLowerCase() === weaponName.toLowerCase()
    );
    if (dataSkill) {
        //console.log(`Found Weapon "${weaponName}"`);
        return dataSkill;
    } else {
        //console.log(`Weapon "${weaponName}" not found.`);
        return null;
    }
}

function updateSaveModifiers(phy, dex, wil, saves, creature = null, armor = null) {
    const container = creature ? document.querySelector(`.creature-container[data-creature-index="${window.creatures.indexOf(creature)}"]`) : document;

    container.querySelectorAll('[data-save-type]').forEach(el => {
        const saveType = el.dataset.saveType;
        const button = el.parentElement.querySelector('.proficiency-cycle-button');
        const bonus = saves[saveType] || 0;
        const level = proficiencyLevels.find(level => level.bonus === bonus) || proficiencyLevels[0];

        // Update button text, tooltip, and color
        if (button) {
            setButtonTextAndColor(button, level);
        } else {
            console.warn("Can't find proficiency cycle button for:", skillType);
        }
        armorPenalty = 0;
        if (armor && armor.type == "Heavy") {
            armorPenalty = armor.penalties;
        }

        // Update modifier value
        el.textContent = {
            'fortitude': phy + (saves?.fortitude || 0),
            'reflex': dex + (saves?.reflex || 0) + armorPenalty,
            'will': wil + (saves?.will || 0),
        }[saveType];
    });
}

function updateBaseSpellshapingBonus(dex, int, wil, attunement) {
    // Update the spellshaping bonus
    //console.log("Attunement: ", attunement)
    document.getElementById('spellshaping').textContent = dex + int + 2 + characterState.globalPenalty;
    if (attunement) {
        document.getElementById('spellshaping').textContent += " | Attuned Spells [" + attunement + "] : " + (dex + wil + 2);
    }
}

function updateSpellshapingModifier(spell, parentElement, profBonus, creature = null) {
    // Update the spell's proficiency
    spell.proficiency = profBonus;

    //console.log("updating the spellshape mod of " + spell.name + " with parentEl " + parentElement + " profBonus " + spell.proficiency)

    // Calculate the modifier
    const dex = creature ? creature.dex : characterState.dex;
    const int = creature ? creature.int : characterState.int;
    const wil = creature ? creature.wil : characterState.wil;
    const attunement = creature ? creature.attunement : characterState.attunement;
    const modifier = dex + int + spell.proficiency + (creature ? 0 : characterState.globalPenalty);
    const attunedModifier = dex + wil + spell.proficiency + (creature ? 0 : characterState.globalPenalty);

    // Find or create the modifier display element
    let modifierSpan = parentElement.querySelector('.spellshaping-modifier');
    if (!modifierSpan) {
        modifierSpan = document.createElement('span');
        modifierSpan.className = 'spellshaping-modifier';
        parentElement.appendChild(modifierSpan);
    }

    // Update the modifier text
    if (attunement != null && spell.aspects.includes(attunement)) {
        //console.log("spell " + spell + "is attuned");
        modifierSpan.textContent = ` (${attunedModifier >= 0 ? '+' : ''}${attunedModifier})`;
        parentElement.classList.add("attunedSpell");
    }
    else {
        modifierSpan.textContent = ` (${modifier >= 0 ? '+' : ''}${modifier})`;
        parentElement.classList.remove("attunedSpell");
    }

    const button = parentElement.querySelector('.proficiency-cycle-button');
    const level = proficiencyLevels.find(level => level.bonus === spell.proficiency) || proficiencyLevels[1];
    // Update button text, tooltip, and color
    if (button) {
        setButtonTextAndColor(button, level);
    } else {
        console.warn("Can't find proficiency cycle button for:", spell);
    }
}

//Weapons/Strikes
function updateWeaponAttackBonus(weapon, parentElement, profBonus, creature = null) {
    // Update the weapon's proficiency
    weapon.proficiency = profBonus;
    //console.log(weapon)
    // Update modifiers
    const phy = creature ? creature.phy : characterState.phy;
    const dex = creature ? creature.dex : characterState.dex;
    const wil = creature ? creature.wil : characterState.wil;
    const int = creature ? creature.int : characterState.int;

    // Determine if the weapon is agile or ranged
    const isFinesse = weapon.traits.includes('Finesse'); //Dex or Phy
    const isRanged = weapon.traits.includes('Ranged'); //Dex 
    const isInnate = weapon.traits.includes('Innate'); //Wil
    const isPsionic = weapon.traits.includes('Psionic'); //Int

    const isAgile = weapon.traits.includes('Agile');
    const multiAttackPenalty = isAgile ? -4 : -5;

    let itemMod = 0;
    if (weapon.selectedRunes) {
        weapon.selectedRunes.forEach(rune => {
            if (rune.striking && rune.striking > itemMod) itemMod += rune.striking;
        });
    }

    // Calculate statMod based on traits
    let statMod;
    if (isInnate && isPsionic) {
        statMod = Math.max(wil, int);
    } else if (isInnate) {
        statMod = wil;
    } else if (isPsionic) {
        statMod = int;
    } else {
        // Default logic: Ranged uses DEX, Finesse uses max(DEX, PHY), else PHY
        statMod = isRanged ? dex : (isFinesse ? Math.max(phy, dex) : phy);
    }

    // Calculate the attack bonus
    const modifier = statMod + profBonus + itemMod + (creature ? 0 : characterState.globalPenalty);

    // Find or create the modifier display element
    let modifierSpan = parentElement.querySelector('.weapon-modifier');
    if (!modifierSpan) {
        modifierSpan = document.createElement('span');
        modifierSpan.className = 'weapon-modifier';
        parentElement.appendChild(modifierSpan);
    }

    // Update the modifier text
    modifierSpan.textContent = ` (${modifier >= 0 ? '+' : ''}${modifier})`;
    modifierSpan.textContent += ' | MAP ' + multiAttackPenalty + ' | ';

    const button = parentElement.querySelector('.proficiency-cycle-button');
    const level = proficiencyLevels.find(level => level.bonus === weapon.proficiency) || proficiencyLevels[1];
    // Update button text, tooltip, and color
    if (button) {
        setButtonTextAndColor(button, level);
    } else {
        console.warn("Can't find proficiency cycle button for:", weapon);
    }
}

function updateStrikeDamage(weapon, parentElement, creature = null) {
    // Find or create the damage display element
    let damageSpan = parentElement.querySelector('.strike-damage');
    if (!damageSpan) {
        damageSpan = document.createElement('span');
        damageSpan.className = 'strike-damage';
        parentElement.appendChild(damageSpan);
    }
    const phy = creature ? creature.phy : characterState.phy;

    // If physical stat is 0, just show the base damage
    if (phy === 0) {
        damageSpan.textContent = ` ${weapon.damage}`;
        return;
    }

    // Check if the weapon is ranged or propulsive
    const isRanged = weapon.traits.includes('Ranged');
    const isPropulsive = weapon.traits.includes('Propulsive');

    if (isRanged && !isPropulsive) {
        damageSpan.textContent = ` ${weapon.damage}`;
    } else {
        // Split the damage into dice and type parts
        const [dicePart, typePart] = weapon.damage.split(" ");
        damageSpan.textContent = ` ${dicePart} + ${phy} ${typePart}`;
    }
}

function showItemTraits(item, parentElement, creature = null) {
    // Find or create the damage display element
    let traitSpan = parentElement.querySelector('.item-traits');
    if (!traitSpan) {
        traitSpan = document.createElement('div');
        traitSpan.className = 'item-traits';
        parentElement.appendChild(traitSpan);
    }

    traitSpan.textContent = "\n" + item.traits;
}