/**
 * Generic details renderer for all modal items.
 * @param {Object} item - The item to render (e.g., species, background, feat).
 * @param {string} btnClass - CSS class for the select button.
 * @param {string} btnLabel - Label for the select button.
 * @param {Array} fieldMap - Array of {key, label} pairs for properties to display.
 * @returns {string} - HTML string for the item details.
 */
function genericDetailsRenderer(item, btnClass, btnLabel, fieldMap) {
    let html = `<h2>${item.name}</h2>`;
    fieldMap.forEach(field => {
        if (!item[field.key]) return;
        if (field.render) {
            const rendered = field.render(item);
            html += window.formatTextWithLineBreaks(rendered);
        } else {
            const raw = item[field.key];
            html += `<p><strong>${field.label}:</strong> ${window.formatTextWithLineBreaks(raw)}</p>`;
        }
    });
    html += `<button class="${btnClass}">${btnLabel}</button>`;
    return html;
}

window.formatTextWithLineBreaks = function(text) {
    if (!text) return '';
    return String(text).replace(/\n/g, '<br>');
};

// Renderers
function speciesDetailsRenderer(species, btnClass, btnLabel) {
    return genericDetailsRenderer(species, btnClass, btnLabel, speciesFieldMap);
}
function backgroundDetailsRenderer(background, btnClass, btnLabel) {
    return genericDetailsRenderer(background, btnClass, btnLabel, backgroundFieldMap);
}
function advantageDetailsRenderer(advantage, btnClass, btnLabel) {
    return genericDetailsRenderer(advantage, btnClass, btnLabel, featFieldMap);
}
function arcaneFeatsDetailsRenderer(arcanefeat, btnClass, btnLabel) {
    return genericDetailsRenderer(arcanefeat, btnClass, btnLabel, featFieldMap);
}
function generalFeatsDetailsRenderer(generalfeat, btnClass, btnLabel) {
    return genericDetailsRenderer(generalfeat, btnClass, btnLabel, featFieldMap);
}
function ancestryFeatsDetailsRenderer(ancestryfeat, btnClass, btnLabel) {
    return genericDetailsRenderer(ancestryfeat, btnClass, btnLabel, ancestryFeatFieldMap);
}
function spellsDetailsRenderer(spell, btnClass, btnLabel) {
    return genericDetailsRenderer(spell, btnClass, btnLabel, spellsFieldMap);
}
function weaponsDetailsRenderer(weapons, btnClass, btnLabel) {
    return genericDetailsRenderer(weapons, btnClass, btnLabel, weaponsFieldMap);
}
function metamagicsDetailsRenderer(metamagics, btnClass, btnLabel) {
    return genericDetailsRenderer(metamagics, btnClass, btnLabel, metamagicsFieldMap);
}
function combatManeuversDetailsRenderer(combatManeuver, btnClass, btnLabel) {
    return genericDetailsRenderer(combatManeuver, btnClass, btnLabel, combatManeuversFieldMap);
}
function armorsDetailsRenderer(armor, btnClass, btnLabel) {
    return genericDetailsRenderer(armor, btnClass, btnLabel, armorsFieldMap);
}
function golemUpgradesDetailsRenderer(golemUpgrade, btnClass, btnLabel) {
    return genericDetailsRenderer(golemUpgrade, btnClass, btnLabel, featFieldMap);
}
function runegunUpgradesDetailsRenderer(runegunUpgrade, btnClass, btnLabel) {
    return genericDetailsRenderer(runegunUpgrade, btnClass, btnLabel, featFieldMap);
}
function gadgetsDetailsRenderer(gadget, btnClass, btnLabel) {
    return genericDetailsRenderer(gadget, btnClass, btnLabel, gadgetsFieldMap);
}

// Field maps
const speciesFieldMap = [
    { key: 'size', label: 'Size' },
    { key: 'health', label: 'Health' },
    { key: 'mana', label: 'Mana' },
    {
        key: 'traitOne',
        label: '',
        render: (species) => `
            <p><strong>${species.traitOne}</strong> ${species.traitOneDescription}</p>
            <p><strong>${species.traitTwo}</strong> ${species.traitTwoDescription}</p>
            <p><strong>${species.traitThree}</strong> ${species.traitThreeDescription}</p>
            <p><strong>${species.traitFour}</strong> ${species.traitFourDescription}</p>
        `
    }
];
const backgroundFieldMap = [
    { key: 'description', label: 'Description' },
    { key: 'stats', label: 'Stat Increase' }
];
const featFieldMap = [
    { key: 'description', label: 'Description' },
    { key: 'unlockedAction', label: 'Unlocked Action' },
    { key: 'prerequisites', label: 'Prerequisites' },
    { key: 'level', label: 'Level' }
];
const ancestryFeatFieldMap = [
    { key: 'description', label: 'Description' },
    { key: 'type', label: 'Type' },
    { key: 'prerequisites', label: 'Prerequisites' },
    { key: 'level', label: 'Level' }
];
const spellsFieldMap = [
    { key: 'actions', label: 'Actions' },
    { key: 'aspects', label: 'Aspects' },
    { key: 'traits', label: 'Traits' },
    { key: 'range', label: 'Range' },
    { key: 'target', label: 'Target' },
    { key: 'duration', label: 'Duration' },
    { key: 'effect', label: 'Effect' },
    { key: 'upcast', label: 'Upcast' },
    { key: 'rank', label: 'Rank' }
];
const weaponsFieldMap = [
    { key: 'damage', label: 'Damage' },
    { key: 'hands', label: 'Hands' },
    { key: 'range', label: 'Range (tiles)' },
    { key: 'traits', label: 'Traits' },
    { key: 'description', label: 'Description' },
    { key: 'price', label: 'Price' },
    { key: 'type', label: 'Type' },
    { key: 'weaponGroup', label: 'Weapon Group' }
];
const metamagicsFieldMap = [
    { key: 'spelltype', label: 'Spell Type' },
    { key: 'effect', label: 'Effect' },
    { key: 'DC', label: 'DC Increase' },
    { key: 'level', label: 'Level' },
];
const combatManeuversFieldMap = [
    { key: 'actions', label: 'Actions' },
    { key: 'traits', label: 'Traits' },
    { key: 'map', label: 'Multiple Attack Penalty' },
    { key: 'description', label: 'Description' },
    { key: 'type', label: 'Type' },
    { key: 'level', label: 'Level' },
];
const armorsFieldMap = [
    { key: 'resistances', label: 'Resistances' },
    { key: 'weakPointDiff', label: 'Weak Point Difficulty' },
    { key: 'penalties', label: 'Armor Penalties' },
    { key: 'manaRecovery', label: 'Mana Recovery Penalty' },
    { key: 'traits', label: 'Traits' },
    { key: 'description', label: 'Description' },
    { key: 'price', label: 'Price' },
    { key: 'type', label: 'Type' },
    { key: 'phy', label: 'PHY Requirement' },
];
const gadgetsFieldMap = [
    { key: 'type', label: 'Type' },
    { key: 'effect', label: 'Effect' },
    { key: 'level', label: 'Level' },
    { key: 'requirement', label: 'Requirement' },
];