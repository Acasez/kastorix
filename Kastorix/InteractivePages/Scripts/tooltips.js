function createGeneralTooltip (item, itemType) {
    return `
        <div class="tooltip-header">
            <h3>${item.name} [${itemType.charAt(0).toUpperCase() + itemType.slice(1)}]</h3>
        </div>
        <div class="tooltip-content">
            ${item.size ? `<p><strong>Size:</strong> ${item.size}</p>` : ''} <!-- Species -->
            ${item.health ? `<p><strong>Health:</strong> ${item.health}</p>` : ''} <!-- Species -->
            ${item.mana ? `<p><strong>Mana:</strong> ${item.mana}</p>` : ''} <!-- Species -->
            ${item.prerequisites ? `<p><strong>Prerequisites:</strong> ${item.prerequisites.replace(/\n/g, '<br>')}</p>` : ''} <!-- Feats and Upgrades -->
            ${item.traitOne ? `<p><strong>${item.traitOne}</strong> ${item.traitOneDescription}</p>` : ''} <!-- Species -->
            ${item.traitTwo ? `<p><strong>${item.traitTwo}</strong> ${item.traitTwoDescription}</p>` : ''} <!-- Species -->
            ${item.traitThree ? `<p><strong>${item.traitThree}</strong> ${item.traitThreeDescription}</p>` : ''} <!-- Species -->
            ${item.traitFour ? `<p><strong>${item.traitFour}</strong> ${item.traitFourDescription}</p>` : ''} <!-- Species -->
            ${item.actions ? `<p><strong>Actions:</strong> ${item.actions}</p>` : ''} <!-- Spells/Combat Man -->
            ${item.aspects ? `<p><strong>Aspects:</strong> ${item.aspects}</p>` : ''} <!-- Spells -->
            ${item.spelltype ? `<p><strong>Type:</strong> ${item.spelltype}</p>` : ''} <!-- Metamagic -->
            
            ${item.resistances ? `<p><strong>Resistances:</strong> ${item.resistances}</p>` : ''} <!-- Armor -->
            ${item.weakPointDiff ? `<p><strong>Weak Point Difficulty:</strong> ${item.weakPointDiff}</p>` : ''} <!-- Armor -->
            ${item.penalties ? `<p><strong>Penalties:</strong> ${item.penalties}</p>` : ''} <!-- Armor -->
            ${item.manaRecovery ? `<p><strong>Mana Recovery Penalty:</strong> ${item.manaRecovery}</p>` : ''} <!-- Armor -->

            ${item.traits ? `<p><strong>Traits:</strong> ${item.traits}</p>` : ''} <!-- Spells/Combat Man/Weapon -->
            ${item.damage ? `<p><strong>Damage:</strong> ${item.damage}</p>` : ''} <!-- Weapon -->
            ${item.hands ? `<p><strong>Hands:</strong> ${item.hands}</p>` : ''} <!-- Weapon -->
            ${item.range ? `<p><strong>Range:</strong> ${item.range}</p>` : ''} <!-- Spells/Weapon -->
            ${item.target ? `<p><strong>Target:</strong> ${item.target}</p>` : ''} <!-- Spells -->
            ${item.duration ? `<p><strong>Duration:</strong> ${item.duration}</p>` : ''} <!-- Spells -->
            ${item.effect ? `<p><strong>Effect:</strong> ${item.effect.replace(/\n/g, '<br>')}</p>` : ''} <!-- Spells -->
            ${item.description ? `<p><strong>Description:</strong> ${item.description.replace(/\n/g, '<br>')}</p>` : ''} <!-- Most Things -->
            ${item.unlockedAction ? `<p><strong>Unlocked Action:</strong> ${item.unlockedAction.replace(/\n/g, '<br>')}</p>` : ''} <!-- Most Things -->
            ${item.upcast ? `<p><strong>Upcast:</strong> ${item.upcast.replace(/\n/g, '<br>')}</p>` : ''} <!-- Spells -->
            ${item.rank ? `<p><strong>Rank:</strong> ${item.rank}</p>` : ''} <!-- Spells -->
            ${item.price ? `<p><strong>Price:</strong> ${item.price}</p>` : ''} <!-- Weapon/Armor -->
            ${item.type ? `<p><strong>Type:</strong> ${item.type}</p>` : ''} <!-- Ancestry Feats/Weapon/Combat Man -->
            ${item.weaponGroup ? `<p><strong>Weapon Group:</strong> ${item.weaponGroup}</p>` : ''} <!-- Weapon -->
            
            ${item.DC ? `<p><strong>DC Increase:</strong> ${item.DC}</p>` : ''} <!-- Metamagic -->
            ${item.phy ? `<p><strong>PHY Requirement:</strong> ${item.phy}</p>` : ''} <!-- PHY Requirement -->
            ${item.level ? `<p><strong>Level:</strong> ${item.level}</p>` : ''} <!-- Most Things -->

            ${item.choice && item.selectedChoice ? `<p><strong>Chosen Effect: </strong> ${item.selectedChoice[itemToJsonValue[item.name]]}</p>` : ''} <!-- Items with choices -->
            ${item.selectedRunes && item.selectedRunes.length > 0 ?`<p><strong>Runes:</strong> ${item.selectedRunes.map(rune => rune.name).join(', ')}</p>` : ''}</div>
        </div>
    `;
};
