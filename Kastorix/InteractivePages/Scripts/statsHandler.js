// 1. Define all stat types and their defaults
window.stats = {
speeds: {
        land: 5,
        swim: 0,
        climb: 0,
        glide: 0,
        fly: 0,
        burrow: 0
    },
resistances: {
        physical: 0, //TODO, display these in categories
        slashing: 0,
        piercing: 0,
        bludgeoning: 0,

        elemental: 0,
        fire: 0,
        cold: 0,
        lightning: 0,
        acid: 0,
        thunder: 0,

        poison: 0,
        force: 0
    },
metamagicsLearned: {
        metamagic: 0,
    },
combatManeuversLearned: {
        combatManeuvers: 4,
    },
    gadgetsPossible: {
        gadgets: 0,
    },
spellsLearnableByRank: {
        Apprentice: 0,
        Adept: 0,
        Magus: 0,
        GrandMagus: 0,
        Archmage: 0
    },
    health: {
        health: 0,
    },
};

const spellRanks = [
    { name: "Apprentice", level: 1 },
    { name: "Adept", level: 4 },
    { name: "Magus", level: 8 },
    { name: "GrandMagus", level: 12 },
    { name: "Archmage", level: 16 }
];

// 2. Reset a stat type to its default
function resetStat(statType) {
    if (!window.stats[statType]) return;
    const defaultStats = {
        speeds: { land: 5, swim: 0, climb: 0, glide: 0, fly: 0, burrow: 0 },
        resistances: { physical: 0, slashing: 0, piercing: 0, bludgeoning: 0, elemental: 0, fire: 0, cold: 0, lightning: 0, acid: 0, thunder: 0, poison: 0, force: 0 },
        metamagicsLearned: { metamagic: 0 },
        combatManeuversLearned: { combatManeuvers: 4 },
        gadgetsPossible: { gadgets: 0 },
        spellsLearnableByRank: { Apprentice: 0, Adept: 0, Magus: 0, GrandMagus: 0, Archmage: 0 }
    };
    window.stats[statType] = { ...defaultStats[statType] };
}

// 3. Reset spell counts to base values
function resetSpellCountsToBase() {
    spellRanks.forEach(rank => {
        window.stats.spellsLearnableByRank[rank.name] = 0;
    });

    spellRanks.forEach(rank => {
        if (characterState.characterLevel >= rank.level) {
            window.stats.spellsLearnableByRank[rank.name] = characterState.int;
        }
    });
}

// 4. Calculate all stats
function calculateAllStats() {
    Object.keys(window.stats).forEach(statType => {
        calculateStat(statType);
    });
    calculateAllSpellCounts();
}

// 4.5. Reset all stats
function resetAllStats() {
    Object.keys(window.stats).forEach(statType => {
        resetStat(statType);
    });
    resetSpellCountsToBase();
}

// 5. Calculate a specific stat type
function calculateStat(statType) {
    resetStat(statType);
    //console.log(`Calculating stat ${statType}`);
    // Reapply all feat bonuses
    const featArrays = ['advantages', 'arcaneFeats', 'generalFeats', 'ancestryFeats', 'backgrounds'];
    featArrays.forEach(arrayName => {
        if (window[arrayName]) {
            window[arrayName].forEach(feat => {
                if (feat[statType]) { 
                    //console.log("Feat " + feat.name + " matches stattype " + statType);
                    const bonuses = parseBonuses(feat[statType]);
                    updateStat(bonuses, true, statType);
                }
            });
        }
    });

    // Apply species bonuses
    if (characterState.selectedSpecies && characterState.selectedSpecies[statType]) {
        const bonuses = parseBonuses(characterState.selectedSpecies[statType]);
        updateStat(bonuses, true, statType);
    }

    // Apply armor bonuses
    if (characterState.currentArmor && characterState.currentArmor[statType]) {
        const bonuses = parseBonuses(characterState.currentArmor[statType]);
        updateStat(bonuses, true, statType);
    }

    // Render the stat
    renderStat(statType);
}

// 6. Calculate all spell counts
function calculateAllSpellCounts() {
    resetSpellCountsToBase();

    // Reapply all feat bonuses
    const featArrays = ['advantages', 'arcaneFeats', 'generalFeats', 'ancestryFeats', 'backgrounds'];
    featArrays.forEach(arrayName => {
        if (window[arrayName]) {
            window[arrayName].forEach(feat => {
                if (feat.spellsLearned) {
                    const bonuses = parseBonuses(feat.spellsLearned);
                    applySpellsLearnedBonus(bonuses);
                }
            });
        }
    });

    if (characterState.selectedSpecies && characterState.selectedSpecies.spellsLearned) {
        const bonuses = parseBonuses(characterState.selectedSpecies.spellsLearned);
        applySpellsLearnedBonus(bonuses);
    }

    // Update the displays
    updateAllSpellCountDisplays();
}

// 7. Apply spell learned bonuses
function applySpellsLearnedBonus(bonuses) {
    if (!Array.isArray(bonuses)) return;

    for (const bonus of bonuses) {
        if (bonus.type !== 'spell') continue;

        const rank = bonus.target.charAt(0).toUpperCase() + bonus.target.slice(1).toLowerCase();
        if (window.stats.spellsLearnableByRank[rank] !== undefined) {
            window.stats.spellsLearnableByRank[rank] += bonus.count;
        }
    }
}

// 8. Update a stat
function updateStat(bonuses, add, statType) {
    //console.log("Adding " + bonuses + " to stattype " + statType)
    if (!Array.isArray(bonuses) || !window.stats[statType]) return;
    //console.log("Adding " + bonuses + " to stattype " + statType)
    for (const bonus of bonuses) {
        //console.log("bonus.type is " + bonus.type);
        if (bonus.type !== statType) continue;
        const target = bonus.target.charAt(0).toLowerCase() + bonus.target.slice(1);
        //console.log("Statype is " + statType + " target is " + target)
        //console.log(window.stats[statType])
        if (window.stats[statType][target] !== undefined) {
            if (add) {
                //console.log("Adding " + statType + " " + target + " " + bonus.count);
                window.stats[statType][target] += bonus.count;
                //console.log(window.stats[statType][target]);
            } else {
                window.stats[statType][target] -= bonus.count;
            }
        }
        else {
            console.warn("Stattype target doesn't exist");
        }
    }
}

// 9. Render a stat
function renderStat(statType) {
    //console.log("rendering statType " + statType)
    const containerId = `active${statType.charAt(0).toUpperCase() + statType.slice(1)}`;
    if (statType == "metamagicsLearned") {
        updateCollectionCountDisplay("metamagics");
        return;
    }
    else if (statType == "combatManeuversLearned") {
        updateCollectionCountDisplay("combatManeuvers");
        return;
    }
    const singularStat = statType.slice(0, -1)
    const headerID = `${singularStat}Header`;
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';
    let hasValue = false;
    const header = document.getElementById(headerID);

    for (const [type, value] of Object.entries(window.stats[statType])) {
        //console.log("type is " + type + " value is " + value)
        if (value > 0) {
            const templateSelector = `.${singularStat}-item[data-${singularStat}-type="${type}"]`;
            const statItem = document.querySelector(templateSelector)?.cloneNode(true);
            //console.log(statItem)
            if (statItem) {
                statItem.querySelector('input').value = value;
                container.appendChild(statItem);
                hasValue = true;
            }
        }
    }
    if (header) header.style.display = hasValue ? 'block' : 'none';
}

// 10. Parse bonuses 
function parseBonuses(bonusText) {
    if (!bonusText || typeof bonusText !== 'string') return [];

    const bonuses = [];
    const lines = bonusText.split(/[,\n]+/).map(line => line.trim()).filter(line => line);
    //console.log(lines);
    for (const line of lines) {
        const match = line.match(/\(([^)]+)\)\s*([\w\s,]+)/);
        if (!match) continue;

        const expression = match[1].trim();
        const targets = match[2].trim().split(/\s*,\s*/);
        const count = evaluateStatBonus(expression);

        for (const target of targets) {
            let type = 'unknown';
            //console.log("target is " + target);
            if (isSpeed(target)) type = 'speeds';
            else if (isResistance(target)) type = 'resistances';
            else if (target == "Metamagic") type = 'metamagicsLearned';
            else if (target == "CombatManeuvers") type = 'combatManeuversLearned';
            else if (isSpell(target)) type = 'spell';
            //console.log("Pushing bonus with target " + target + " of type " + type + " and count " + count)
            bonuses.push({
                count: count,
                target: target.trim(),
                type: type
            });
        }
    }
    return bonuses;
}

// 12. Helpers for stat type checks
function isSpeed(target) { return window.stats.speeds.hasOwnProperty(target.toLowerCase()); }
function isResistance(target) { return window.stats.resistances.hasOwnProperty(target.toLowerCase()); }
function isSpell(target) { return spellRanks.some(rank => rank.name.toLowerCase() === target.toLowerCase()); }

// Do stat math
function evaluateStatBonus(expr) {
    if (!expr || typeof expr !== 'string') return 0;

    let result = expr.trim();

    // Replace stats with the actual stat values
    result = result.replace(/PHY/gi, characterState.phy || 0);
    result = result.replace(/DEX/gi, characterState.dex || 0);
    result = result.replace(/INT/gi, characterState.int || 0);
    result = result.replace(/WIL/gi, characterState.wil || 0);
    result = result.replace(/LEVEL/gi, characterState.characterLevel || 0);

    // Evaluate basic arithmetic (+, -, *, /)
    try {
        // Only allow digits, +, -, *, /, and parentheses
        if (/^[\d\s+\-*\/()]+$/.test(result)) {
            // Use Math.floor to ensure integer results for division
            return Math.max(0, Math.floor(eval(result)));
        }
    } catch (e) {
        console.warn('Invalid expression:', expr, e);
        return 0;
    }

    return 0;
}
